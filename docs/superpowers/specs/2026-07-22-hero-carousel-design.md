# Hero Carousel Design Spec

**Date:** 2026-07-22
**Status:** Approved

---

## Goal

Replace the static single-image hero section with a Shopify-driven carousel. The admin uploads hero banners directly inside Shopify (Content → Metaobjects), each with an image and a link. The homepage fetches and displays them as a smooth crossfade carousel with a static fallback image.

---

## Architecture

### CMS Layer — Shopify Metaobjects

The admin creates a Metaobject definition in Shopify with the type key `hero_banner`. Each entry has exactly two fields:

| Field key | Type | Description |
|-----------|------|-------------|
| `image` | File reference | The banner image (uploaded to Shopify Files) |
| `link` | Single line text | URL the banner links to (absolute or relative) |

Ordering is controlled by the display order of metaobject entries in the Shopify admin. Only published entries are shown. A maximum of 10 banners is enforced at query time to keep payloads lean.

### Data Fetching Layer

**`src/lib/shopify.ts`** — Thin Storefront API GraphQL client.

- Uses `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` (server-only; not prefixed `NEXT_PUBLIC_`).
- Base URL constructed from `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` + `/api/2025-01/graphql.json`.
- Exports a single `shopifyFetch<T>(query, variables?)` async function.
- Throws on HTTP errors; passes GraphQL errors through as-is so callers can decide.

**`src/lib/hero-banners.ts`** — Hero banner query + TypeScript types.

- Exports `HeroBanner` type: `{ image: string; link: string }`.
- Exports `getHeroBanners(): Promise<HeroBanner[]>`.
- Queries `metaobjects(type: "hero_banner", first: 10)` via Storefront API.
- Resolves the `image` field reference to its `previewImage.url`.
- Strips entries where `image` URL is missing (defensive).
- Returns `[]` on any error rather than throwing — the fallback handles it.

### Presentation Layer

**`src/components/home/hero-section.tsx`** — Converted from client to **server component**.

- `async` function; calls `getHeroBanners()`.
- If banners returned: renders `<HeroCarousel banners={banners} />`.
- If empty: renders the static fallback `<Image src="/assets/hero/heroimage.png" … />` with the same `min-h-[98vh]` shell.
- No `"use client"` directive.

**`src/components/home/hero-carousel.tsx`** — New **client component**.

Props: `{ banners: HeroBanner[] }` — always non-empty (server component handles empty case).

Behaviour:
- Auto-advances every 5 seconds.
- Pauses auto-advance while the mouse hovers over the section.
- Crossfade transition between slides (opacity 0→1 over 700ms).
- Dot indicators — one per slide, active dot gold-filled, inactive unfilled.
- Previous / next arrow buttons (chevron icons, visible on hover on desktop, always visible on mobile).
- Each slide is a full-bleed `<Link href={banner.link}>` wrapping a `<Image fill object-cover>`.
- Keyboard accessible: arrow buttons have `aria-label`; dot buttons have `aria-label="Go to slide N"`.
- No SSR issues: uses `useEffect` for the auto-advance timer.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/lib/shopify.ts` | Storefront API GraphQL client |
| Create | `src/lib/hero-banners.ts` | HeroBanner type + fetch function |
| Create | `src/components/home/hero-carousel.tsx` | Client carousel component |
| Modify | `src/components/home/hero-section.tsx` | Convert to server component, wire up fetch + carousel |

---

## Data Flow

```
Shopify Admin
  └─ Metaobject: hero_banner (image file + link text)
        │
        ▼  (Storefront API, server-side, ISR 300s)
src/lib/hero-banners.ts → getHeroBanners()
        │
        ▼
src/components/home/hero-section.tsx (server component)
        │          │
        │          └─ empty → static fallback image
        ▼
src/components/home/hero-carousel.tsx (client component)
        └─ auto-advance, crossfade, dots, arrows
```

---

## Fallback Behaviour

| Condition | Result |
|-----------|--------|
| No metaobjects defined in Shopify | Static `/assets/hero/heroimage.png` |
| Shopify API unreachable | Static fallback (error swallowed in `getHeroBanners`) |
| Single banner returned | Carousel renders with 1 slide; no auto-advance; dots/arrows hidden |

---

## Out of Scope

- Admin-side Shopify Metaobject definition setup (manual one-time step, documented in implementation plan).
- Headline text or CTA copy overlaid on banner (banners are image-only per approved design).
- Video banners.
- Mobile-specific cropping (same image URL used across viewports; Shopify's CDN handles resizing).
- Drag/swipe gestures (touch-friendly arrow buttons are sufficient for v1).

---

## Environment Variables Used

| Variable | Used in |
|----------|---------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `src/lib/shopify.ts` |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | `src/lib/shopify.ts` (server-only) |

---

## Testing

- Unit: `getHeroBanners` with a mocked `shopifyFetch` — happy path, empty result, error path.
- Visual: dev server, swap between ≥2 banners in Shopify and verify crossfade; verify fallback by temporarily returning `[]`.
- Accessibility: tab to dots and arrows; verify `aria-label` announced correctly.
