# Sundari — Virtual Try-On Placement Engine Design

**Date:** 2026-06-17
**Status:** Approved
**Scope:** Placement engine core — hybrid deterministic composite + controlled AI refinement

---

## 1. Context

The current try-on pipeline passes a jewelry `assetUrl` to Replicate but never forwards it to the model input. Generic SD inpainting receives only the customer photo, a product-level static mask, and a text prompt describing the jewelry — so the actual SKU is never in the output. The result is an invented jewelry shape that may resemble the prompt but never preserves the selected SKU.

This spec replaces that pipeline with a hybrid approach:
1. **Deterministic placement** — the exact jewelry PNG is composited onto the customer photo using MediaPipe landmarks and a per-SKU attachment point. This composite is the guaranteed accurate preview.
2. **Controlled AI refinement** — a low-strength inpainting call (strength 0.28) blends lighting, shadow, and skin contact around the placed jewelry. The model cannot change the jewelry shape.

---

## 2. Architecture

### 2.1 Two-Phase Pipeline

**Phase 1 — Deterministic placement (synchronous, returns in ~2–3 s)**

```
Customer photo + skuId
  → Client preflight: FaceDetector API → reject no-face / too-small / multi-face
  → POST /api/tryon/session
      → Upload photo to Cloudinary (private, signed URL)
      → Load SKU placement config (attachment point, scale, rotation, mirror)
      → MediaPipe landmark detection (Node.js, category-appropriate model)
      → Compute transform: landmark + attachment offset → translate/scale/rotate matrix
      → sharp composite: jewelry PNG onto customer photo → compositeBuffer
      → Generate blend mask: tight feathered halo around jewelry bounding box
      → Upload composite → previewUrl (Cloudinary, public)
      → Create TryOnJob { status: "preview_ready", previewUrl }
      → Return { sessionId, jobId, previewUrl }   ← client shows this immediately
      → Enqueue Replicate refinement call (non-blocking)
```

**Phase 2 — Controlled AI refinement (async, upgrades the result)**

```
  → Replicate flux-fill-pro:
      image    = compositeUrl  (composite already placed — model sees correct SKU)
      mask     = blendMaskUrl  (tight halo around jewelry bbox)
      strength = 0.28          (model adjusts lighting/shadow only, not shape)
  → Webhook → store refinedUrl → TryOnJob { status: "complete", refinedUrl }
  → Polling client upgrades display: previewUrl → refinedUrl
  → If Replicate fails: previewUrl remains the final result silently
```

### 2.2 Key Invariant

Replicate never sees the original customer photo with a text description of jewelry. It receives a composite where the correct SKU is already placed, and is constrained to the 28% of pixels nearest the jewelry edge. The model adjusts lighting and shadow only.

### 2.3 Landmark Model Routing

| Jewellery Category | MediaPipe Model | Landmark Points |
|---|---|---|
| earring_stud / drop / jhumka | FaceLandmarker | 177 (L ear lobe), 401 (R ear lobe) |
| necklace_choker / long | FaceLandmarker | Chin contour midpoint + neck base estimate |
| ring | HandLandmarker | MCP joint of target finger |
| kada / bracelet | HandLandmarker | Wrist point (landmark index 0) |

---

## 3. Data Models

### 3.1 `Product` — add stable SKU field

```ts
sku: { type: String, unique: true, sparse: true, index: true }
// Populated by admin or seed. Falls back to _id.toString() during migration.
```

### 3.2 `ProductTryonConfig` — extend enum, add calibration fields

```ts
jewelleryType: enum [
  "earring_stud", "earring_drop", "earring_jhumka",
  "necklace_choker", "necklace_long",
  "ring",       // new
  "kada",       // new
  "bracelet"    // new
]

// Attachment point within the jewelry PNG (0–1 normalized to asset dimensions)
attachmentX:       Number   // horizontal position of attachment point in PNG
attachmentY:       Number   // vertical position of attachment point in PNG

// Placement defaults (auto-proposed from PNG analysis, admin-reviewed)
defaultScaleMm:    Number   // real-world width of jewelry in mm
defaultRotationDeg: Number  // default rotation offset in degrees
mirrorForLeft:     Boolean  // flip asset horizontally for left ear / left hand

// Three-gate readiness — all must be true before tryonEnabled can be set
assetReady:        Boolean  // assetStatus === "ready"
jewelleryTypeSet:  Boolean  // jewelleryType is not null
calibrationReady:  Boolean  // attachment point reviewed by admin
```

The session route lookup updates to require all three gates:
```ts
ProductTryonConfig.findOne({
  skuId,
  tryonEnabled: true,
  assetReady: true,
  jewelleryTypeSet: true,
  calibrationReady: true,
})
```

### 3.3 `TryOnJob` — add preview/refined URLs, expand status, add provenance

```ts
status: enum [
  "queued",        // reserved for future job-queue implementation — not set in current pipeline
  "processing",    // Replicate refinement in flight
  "preview_ready", // deterministic composite ready, refinement pending
  "complete",      // refinedUrl available
  "failed",        // placement failed (no previewUrl) or both phases failed
  "expired"        // resultExpiresAt has passed
]

previewUrl:        String   // Cloudinary URL of deterministic composite (available immediately)
refinedUrl:        String   // Cloudinary URL of AI-refined result (available after webhook)
resultExpiresAt:   Date

// Provenance
modelVersion:      String   // Replicate model ID + version hash used
inputAssetVersion: String   // Cloudinary asset version at time of job
seed:              Number   // Replicate seed, stored for regeneration reproducibility
providerJobId:     String   // replaces replicateId (provider-agnostic)
```

### 3.4 `TryOnSession` — add derived placement metadata (no raw biometrics)

```ts
landmarkHash: String   // SHA-256 of landmark JSON (for cache/dedup — no raw biometrics stored)
placementMeta: {
  bodyTargetX:     Number,
  bodyTargetY:     Number,
  appliedScale:    Number,
  appliedRotation: Number,
}
```

---

## 4. Placement Modules

All placement logic lives under `src/lib/placement/`. Three modules, each with one responsibility.

### 4.1 `analyze-asset.ts`

Called once when admin uploads a PNG. Returns an attachment point proposal stored as a draft in `ProductTryonConfig` (`calibrationReady = false` until admin reviews).

```ts
export async function analyzeAsset(pngBuffer: Buffer): Promise<AssetAnalysis>

interface AssetAnalysis {
  attachmentX:      number  // 0–1, normalized to asset width
  attachmentY:      number  // 0–1, normalized to asset height
  boundingBox:      { x: number; y: number; w: number; h: number }
  naturalWidthPx:   number
  naturalHeightPx:  number
  suggestedMirror:  boolean
}
```

Heuristics by category (category known from jewelleryType field at upload time):
- **Earrings**: topmost non-transparent pixel, horizontally centered on bounding box
- **Necklaces**: topmost center of bounding box
- **Rings**: bottom center of bounding box (inner arc / band opening)
- **Kadas / bracelets**: geometric center of bounding box

Uses `sharp` alpha channel analysis. No ML model required.

### 4.2 `landmarks.ts`

Called per customer photo during session creation.

```ts
export async function detectLandmarks(
  photoBuffer: Buffer,
  jewelleryType: JewelleryType
): Promise<LandmarkResult>

interface LandmarkResult {
  targets:     BodyTarget[]
  imageWidth:  number
  imageHeight: number
  confidence:  number
}

interface BodyTarget {
  side: "left" | "right" | "center"
  x:   number  // pixel coordinate in source photo
  y:   number
  z:   number  // depth estimate for scale correction
}
```

Uses `@mediapipe/tasks-vision` Node.js build. Returns `DetectionError` with structured code if confidence < 0.6.

### 4.3 `composite.ts`

Assembles the preview image and blend mask.

```ts
export async function compositeJewellery(
  photoBuffer:  Buffer,
  assetBuffer:  Buffer,
  config:       PlacementConfig,
  targets:      BodyTarget[]
): Promise<CompositeResult>

interface CompositeResult {
  compositeBuffer: Buffer  // JPEG — full photo with jewelry placed
  blendMaskBuffer: Buffer  // PNG — white = blend zone (feathered halo around jewelry bbox)
  placedBbox:      { x: number; y: number; w: number; h: number }
}
```

Transform calculation per target:
1. Scale: `(config.defaultScaleMm / PIXELS_PER_MM_AT_DEPTH) * depthCorrectionFactor(target.z)`
   — `PIXELS_PER_MM_AT_DEPTH` is a calibration constant set to `3.78` (approximate px/mm at standard portrait distance of ~60 cm on a 1080 p sensor). `depthCorrectionFactor` linearly scales by `1 - (target.z * 0.3)` using MediaPipe's normalized depth estimate.
2. Position: `(target.x - config.attachmentX * scaledWidth, target.y - config.attachmentY * scaledHeight)`
3. Apply `config.defaultRotationDeg`
4. Mirror if `config.mirrorForLeft && target.side === "left"`
5. Earrings: run for both L and R targets, composite both onto one image

Blend mask: white filled ellipse at `placedBbox` expanded 12 px per side, Gaussian blur radius 8 px. Everything outside is black.

---

## 5. Controlled AI Refinement

### 5.1 Model

Replace `stability-ai/stable-diffusion-inpainting` with `black-forest-labs/flux-fill-pro`. Version hash pinned in `src/lib/replicate.ts`, updated deliberately.

### 5.2 Replicate Input

```ts
{
  image:    compositeUrl,   // composite with jewelry already placed
  mask:     blendMaskUrl,   // per-photo blend mask from composite.ts
  prompt:   buildRefinementPrompt(jewelleryType, descriptor),
  strength: 0.28,           // critical constraint — shape cannot change
  guidance: 3.5,
  seed:     derivedSeed,    // random integer (0–2^32) generated at session creation, stored in TryOnJob for regeneration reproducibility
}
```

### 5.3 Prompts

```ts
function buildRefinementPrompt(type: JewelleryType, descriptor?: string): string {
  const blend = "seamless lighting integration, soft contact shadow, photorealistic skin interaction"
  return `${descriptor ?? "gold jewellery"}, ${blend}, professional jewellery photography, preserve exact jewellery design`
}

function buildNegativePrompt(): string {
  return "different jewellery, missing jewellery, changed jewellery shape, extra jewellery, blurry, distorted anatomy"
}
```

### 5.4 Provider Adapter

`src/lib/replicate.ts` is refactored behind an interface:

```ts
interface RefinementProvider {
  startRefinement(input: RefinementInput): Promise<string>
  pollResult(providerJobId: string): Promise<PredictionResult>
}
```

One implementation ships: `ReplicateProvider`. Interface allows future provider swap (Fal.ai, RunPod) without changing session route.

---

## 6. Admin Calibration Workflow

### 6.1 Three-Gate Readiness

`tryonEnabled` cannot be set to `true` unless all three gates pass. Toggle is disabled with an explicit reason label in the UI.

| Gate | Field | Condition |
|---|---|---|
| 1 | `assetReady` | PNG uploaded and analyzed |
| 2 | `jewelleryTypeSet` | `jewelleryType` is not null |
| 3 | `calibrationReady` | Attachment point reviewed by admin |

### 6.2 Admin Steps Per SKU

1. **Upload PNG** → server runs `analyzeAsset()`, stores proposals, `calibrationReady = false`
2. **Select jewellery type** → includes ring, kada, bracelet
3. **Review attachment point** → PNG preview with crosshair at proposed `attachmentX/Y`, two nudge sliders (X and Y, 0–1), `defaultScaleMm` field, `mirrorForLeft` checkbox → save sets `calibrationReady = true`
4. **Test placement** → composite against built-in sample photo (no Replicate call, no TryOnJob created) → admin sees placement before enabling
5. **Enable** → all gates pass → toggle becomes active

### 6.3 New Admin API Routes

```
POST /api/admin/tryon/assets/[skuId]     — existing + run analyzeAsset(), store proposals
POST /api/admin/tryon/calibrate/[skuId]  — save attachment point review, set calibrationReady = true
POST /api/admin/tryon/test/[skuId]       — placement on sample photo, returns previewUrl
PATCH /api/admin/tryon/products          — existing + validate all three gates before enabling
```

---

## 7. Error Handling

### 7.1 Client Preflight (before upload)

| Condition | Code | User message |
|---|---|---|
| No face detected | `no_face` | "We couldn't detect a face. Try a front-facing photo in good lighting." |
| Face too small (<15% of frame) | `face_too_small` | "Please use a closer photo — face should fill most of the frame." |
| Multiple faces | `multiple_faces` | "Please use a photo with only one person." |
| File too large | `file_too_large` | "Photo must be under 10 MB." |
| Wrong MIME type | `invalid_type` | "Please use a JPG, PNG, or WebP photo." |

Ring/kada try-ons skip face detection at preflight — hand detection happens server-side.

### 7.2 Server Placement Errors (HTTP 422, no job created)

| Condition | Code | User message |
|---|---|---|
| MediaPipe confidence < 0.6 | `low_confidence` | "We couldn't find the right placement point. Try a clearer photo." |
| Ears not visible | `ear_not_visible` | "Ears aren't visible. Try a photo with hair pulled back." |
| Hand not detected | `hand_not_visible` | "Hand isn't visible. Try a photo showing your hand clearly." |
| Neck not visible | `neck_not_visible` | "Neck isn't fully visible. Try a lower neckline or different angle." |
| SKU not calibrated | `tryon_not_available` | "Try-on isn't available for this piece yet." |
| Rate limited | `rate_limit_exceeded` | "You've reached today's try-on limit. Try again tomorrow." |

### 7.3 AI Refinement Errors (silent — previewUrl is fallback)

| Condition | Behaviour |
|---|---|
| Replicate timeout | Job stays `complete`, `previewUrl` is final result |
| Replicate failed | Same — no error shown to user |
| Webhook never arrives | Fallback `pollPrediction()` called once after 90 s |
| Webhook HMAC invalid | Silently ignored — job falls back to poll |

### 7.4 Webhook HMAC Verification

```ts
const sig      = req.headers.get("webhook-signature")
const body     = await req.text()
const expected = crypto.createHmac("sha256", process.env.REPLICATE_WEBHOOK_SECRET!)
  .update(body).digest("hex")
if (sig !== expected) return NextResponse.json({ ok: true })  // silent ignore
```

---

## 8. Testing

### 8.1 Unit Tests — `src/lib/placement/__tests__/`

- `composite.test.ts` — transform matrix, scale correction, mirror logic
- `analyze-asset.test.ts` — attachment point detection on known fixture PNGs
- `landmarks.test.ts` — landmark index mapping per jewellery category

Fixtures: 100×100 transparent PNGs with known shapes, 480×640 sample face photo. No network calls.

### 8.2 API Route Tests — `src/app/api/tryon/__tests__/`

- `session.test.ts` — happy path returns `previewUrl`; placement errors return 422 with correct code; rate limit returns 429
- `result.test.ts` — returns `previewUrl` when `preview_ready`; returns `refinedUrl` when `complete`
- `webhook.test.ts` — valid HMAC updates job; invalid HMAC ignored; succeeded stores `refinedUrl`; failed leaves `previewUrl` intact
- `regenerate.test.ts` — increments `regenCount`; returns new `jobId`

Uses `msw` for Replicate mocking, `mongodb-memory-server` for DB.

### 8.3 Admin API Tests — `src/app/api/admin/tryon/__tests__/`

- `assets.test.ts` — upload triggers `analyzeAsset()`; response includes attachment point proposal
- `calibrate.test.ts` — sets `calibrationReady`; rejects if no asset uploaded
- `test.test.ts` — runs pipeline on sample photo; returns `previewUrl`; does not create `TryOnJob`
- `products.test.ts` — PATCH rejects enabling if any gate fails; accepts when all three pass

### 8.4 QA Golden-Image Dataset — `qa/fixtures/`

8 input photos × 3 jewellery categories. Run manually on changes to `src/lib/placement/` via CI manual-approval workflow. Scored on: SKU preservation, placement accuracy, face identity preservation, visible artifacts.

| Photo | Description |
|---|---|
| `front-neutral.jpg` | Front face, neutral, good lighting |
| `front-glasses.jpg` | Front face, glasses |
| `front-longhair.jpg` | Hair covering ears |
| `tilted-15deg.jpg` | Slight head tilt |
| `dark-skin.jpg` | Dark skin tone, studio lighting |
| `outdoor.jpg` | Outdoor, natural light |
| `bridal-outfit.jpg` | Heavy makeup, bridal |
| `hand-palm.jpg` | Hand visible, for ring/kada |

---

## 9. Out of Scope for This Spec

The following are separate specs and implementation plans:

- Platform blockers (env vars, Cloudinary `remotePatterns`, typecheck/lint fixes)
- Customer flow revamp (camera capture, two entry modes, crop/orientation UX)
- Backend job hardening (retry limits, provider error codes)
- Privacy/storage improvements (signed Cloudinary URLs, cleanup cron)
- UX controls (nudge jewelry, before/after slider)
- Stable SKU migration script for existing products

---

## 10. File Map

### New Files
| Path | Purpose |
|---|---|
| `src/lib/placement/analyze-asset.ts` | PNG attachment point detection |
| `src/lib/placement/landmarks.ts` | MediaPipe landmark detection (Node.js) |
| `src/lib/placement/composite.ts` | sharp compositing + blend mask generation |
| `src/lib/placement/__tests__/composite.test.ts` | Unit tests — transform math |
| `src/lib/placement/__tests__/analyze-asset.test.ts` | Unit tests — PNG analysis |
| `src/lib/placement/__tests__/landmarks.test.ts` | Unit tests — landmark mapping |
| `src/app/api/admin/tryon/calibrate/[skuId]/route.ts` | Save calibration review |
| `src/app/api/admin/tryon/test/[skuId]/route.ts` | Test placement on sample photo |
| `src/app/api/tryon/__tests__/session.test.ts` | API tests |
| `src/app/api/tryon/__tests__/result.test.ts` | API tests |
| `src/app/api/tryon/__tests__/webhook.test.ts` | API tests |
| `src/app/api/tryon/__tests__/regenerate.test.ts` | API tests |
| `public/tryon-sample/neutral-face.jpg` | Built-in sample for admin test |
| `public/tryon-sample/hand-palm.jpg` | Built-in sample for ring/kada test |
| `qa/fixtures/` | QA golden-image dataset |

### Modified Files
| Path | Change |
|---|---|
| `src/models/Product.ts` | Add `sku` field |
| `src/models/ProductTryonConfig.ts` | Extend enum, add calibration fields, three-gate readiness |
| `src/models/TryOnJob.ts` | Add `previewUrl`, `refinedUrl`, expand status, add provenance fields |
| `src/models/TryOnSession.ts` | Add `landmarkHash`, `placementMeta` |
| `src/lib/replicate.ts` | Provider adapter interface, Flux Fill model, low-strength call, updated prompts |
| `src/app/api/tryon/session/route.ts` | Full placement pipeline, two-phase result, return `previewUrl` |
| `src/app/api/tryon/webhook/route.ts` | HMAC verification, store `refinedUrl` |
| `src/app/api/admin/tryon/assets/[skuId]/route.ts` | Run `analyzeAsset()`, store proposals |
| `src/app/api/admin/tryon/products/route.ts` | Validate three-gate readiness on PATCH |
| `src/app/admin/(panel)/tryon/page.tsx` | Three-gate UI, attachment nudge, test preview button, ring/kada/bracelet types |
| `src/components/tryon/photo-upload-step.tsx` | Add FaceDetector preflight |
| `src/hooks/useTryOnResult.ts` | Handle `preview_ready` status, upgrade from preview to refined |
