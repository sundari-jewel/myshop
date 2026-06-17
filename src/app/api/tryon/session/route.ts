import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { uploadBuffer, fetchBuffer } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rate-limit";
import { detectLandmarks, DetectionError } from "@/lib/placement/landmarks";
import { compositeJewellery, type PlacementConfig } from "@/lib/placement/composite";
import { defaultProvider, FLUX_FILL_MODEL, type RefinementInput } from "@/lib/replicate";
import { TryOnSession } from "@/models/TryOnSession";
import { TryOnJob } from "@/models/TryOnJob";
import { ProductTryonConfig } from "@/models/ProductTryonConfig";
import { TryOnAnalytics } from "@/models/TryOnAnalytics";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

async function enqueueRefinement(
  jobId: string,
  input: RefinementInput
): Promise<void> {
  try {
    const providerJobId = await defaultProvider.startRefinement(input);
    await TryOnJob.updateOne({ jobId }, { $set: { status: "processing", providerJobId } });
  } catch (err) {
    console.error("[tryon/session] refinement enqueue failed — previewUrl is final", err);
    await TryOnJob.updateOne({ jobId }, { $set: { status: "failed" } });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const ip = getIp(req);
    const { allowed, remaining } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "rate_limit_exceeded", remaining }, { status: 429 });
    }

    const formData = await req.formData();
    const file     = formData.get("photo") as File | null;
    const skuId    = formData.get("skuId") as string | null;

    if (!file || !skuId) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return NextResponse.json({ error: "invalid_file_type" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }

    const config = await ProductTryonConfig.findOne({
      skuId,
      tryonEnabled:     true,
      assetStatus:      "ready",
      assetReady:       true,
      jewelleryTypeSet: true,
      calibrationReady: true,
    });
    if (!config) {
      return NextResponse.json({ error: "tryon_not_available" }, { status: 404 });
    }

    const photoBuffer = Buffer.from(await file.arrayBuffer());
    const assetBuffer = await fetchBuffer(config.assetKey!);

    let landmarkResult;
    try {
      landmarkResult = await detectLandmarks(photoBuffer, config.jewelleryType!);
    } catch (err) {
      if (err instanceof DetectionError) {
        return NextResponse.json({ error: err.code }, { status: 422 });
      }
      throw err;
    }

    const placementConfig: PlacementConfig = {
      attachmentX:        config.attachmentX!,
      attachmentY:        config.attachmentY!,
      defaultScaleMm:     config.defaultScaleMm!,
      defaultRotationDeg: config.defaultRotationDeg ?? 0,
      mirrorForLeft:      config.mirrorForLeft ?? false,
    };

    const { compositeBuffer, blendMaskBuffer } = await compositeJewellery(
      photoBuffer, assetBuffer, placementConfig, landmarkResult.targets
    );

    const sid = crypto.randomUUID().replace(/-/g, "");

    const [{ url: photoUrl }, { url: previewUrl }, { url: blendMaskUrl }] = await Promise.all([
      uploadBuffer(photoBuffer,    `sundari/sessions/${sid}`, "photo"),
      uploadBuffer(compositeBuffer, `sundari/previews/${sid}`, "preview"),
      uploadBuffer(blendMaskBuffer, `sundari/masks/${sid}`,    "mask"),
    ]);

    const landmarkHash = crypto.createHash("sha256")
      .update(JSON.stringify(landmarkResult.targets))
      .digest("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await TryOnSession.create({
      sessionId: sid, ipAddress: ip, skuId, photoKey: photoUrl, expiresAt,
      landmarkHash,
      placementMeta: {
        bodyTargetX:     landmarkResult.targets[0].x,
        bodyTargetY:     landmarkResult.targets[0].y,
        appliedScale:    config.defaultScaleMm! / 3.78,
        appliedRotation: config.defaultRotationDeg ?? 0,
      },
    });

    const jobId = crypto.randomUUID().replace(/-/g, "");
    const seed  = Math.floor(Math.random() * 2 ** 32);

    await TryOnJob.create({
      jobId, sessionId: sid, skuId,
      status:            "preview_ready",
      previewUrl,
      seed,
      modelVersion:      FLUX_FILL_MODEL,
      inputAssetVersion: config.assetKey!,
      resultExpiresAt:   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await TryOnAnalytics.create({ sessionId: sid, jobId, skuId, event: "tryon_started" });
    await ProductTryonConfig.updateOne({ skuId }, { $inc: { totalTryons: 1 } });

    // Non-blocking — response already formed; defer to macrotask so the caller
    // can read preview_ready status before we update it to "processing".
    setImmediate(() => {
      void enqueueRefinement(jobId, {
        compositeUrl:     previewUrl,
        blendMaskUrl,
        jewelleryType:    config.jewelleryType!,
        promptDescriptor: config.promptDescriptor,
        seed,
      });
    });

    return NextResponse.json({ sessionId: sid, jobId, previewUrl, remaining }, { status: 201 });
  } catch (err) {
    console.error("[tryon/session]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
