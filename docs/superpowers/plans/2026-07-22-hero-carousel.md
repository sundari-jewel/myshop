# Hero Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hero image with a Shopify-metaobject-driven crossfade carousel, with a static image fallback when no banners are configured.

**Architecture:** A thin Storefront API client (`shopify.ts`) feeds a banner-fetching function (`hero-banners.ts`) that the converted-to-async server component (`hero-section.tsx`) calls at render time (ISR revalidates every 300s). Banner data is passed down to a `"use client"` carousel component. No banners → static fallback image.

**Tech Stack:** Next.js 16 App Router, Shopify Storefront API 2025-01 (GraphQL), Vitest (node env), Tailwind CSS v4, lucide-react (ChevronLeft/ChevronRight), TypeScript.

---

## Prerequisite: Create the Shopify Metaobject definition

This is a one-time manual step in the Shopify admin. Do it before running tests.

1. Go to **Shopify Admin → Content → Metaobjects → Add definition**.
2. Name: `Hero Banner`, type key: `hero_banner`.
3. Add field: key `image`, type **File reference** → check "Allow images".
4. Add field: key `link`, type **Single line text**.
5. Save.

Then create 2–3 test entries (Content → Metaobjects → Hero Banner → Add entry), upload images from Shopify Files, and add destination URLs.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/lib/shopify.ts` | Storefront API GraphQL fetch client |
| Create | `src/lib/__tests__/hero-banners.test.ts` | Unit tests for banner fetch logic |
| Create | `src/lib/hero-banners.ts` | `HeroBanner` type + `getHeroBanners()` |
| Create | `src/components/home/hero-carousel.tsx` | Client-side carousel component |
| Modify | `src/components/home/hero-section.tsx` | Convert to async server component |

---

## Task 1: Shopify Storefront API client

**Files:**
- Create: `src/lib/shopify.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/shopify.ts

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token  = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!;
const endpoint = `https://${domain}/api/2025-01/graphql.json`;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data: T; errors?: unknown[] };
  return json.data;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/shopify.ts
git commit -m "feat: add Shopify Storefront API GraphQL client"
```

---

## Task 2: Hero banner fetch function + tests

**Files:**
- Create: `src/lib/__tests__/hero-banners.test.ts`
- Create: `src/lib/hero-banners.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/__tests__/hero-banners.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";

// Must mock before importing the module under test
vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

import { shopifyFetch } from "@/lib/shopify";
import { getHeroBanners } from "@/lib/hero-banners";

const mockFetch = vi.mocked(shopifyFetch);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getHeroBanners", () => {
  it("returns banners with image and link", async () => {
    mockFetch.mockResolvedValue({
      metaobjects: {
        nodes: [
          {
            fields: [
              { key: "image", reference: { previewImage: { url: "https://cdn.shopify.com/a.jpg" } } },
              { key: "link", value: "/collections/bridal" },
            ],
          },
          {
            fields: [
              { key: "image", reference: { previewImage: { url: "https://cdn.shopify.com/b.jpg" } } },
              { key: "link", value: "/collections/rings" },
            ],
          },
        ],
      },
    });

    const banners = await getHeroBanners();

    expect(banners).toEqual([
      { image: "https://cdn.shopify.com/a.jpg", link: "/collections/bridal" },
      { image: "https://cdn.shopify.com/b.jpg", link: "/collections/rings" },
    ]);
  });

  it("returns empty array when no metaobjects exist", async () => {
    mockFetch.mockResolvedValue({ metaobjects: { nodes: [] } });
    const banners = await getHeroBanners();
    expect(banners).toEqual([]);
  });

  it("strips entries missing an image URL", async () => {
    mockFetch.mockResolvedValue({
      metaobjects: {
        nodes: [
          {
            fields: [
              { key: "image", reference: null },
              { key: "link", value: "/collections/bridal" },
            ],
          },
          {
            fields: [
              { key: "image", reference: { previewImage: { url: "https://cdn.shopify.com/b.jpg" } } },
              { key: "link", value: "/collections/rings" },
            ],
          },
        ],
      },
    });

    const banners = await getHeroBanners();
    expect(banners).toHaveLength(1);
    expect(banners[0].image).toBe("https://cdn.shopify.com/b.jpg");
  });

  it("returns empty array when shopifyFetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const banners = await getHeroBanners();
    expect(banners).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (module not found)**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run test -- --reporter=verbose src/lib/__tests__/hero-banners.test.ts
```

Expected: error like `Cannot find module '@/lib/hero-banners'`.

- [ ] **Step 3: Create the implementation**

```typescript
// src/lib/hero-banners.ts

import { shopifyFetch } from "@/lib/shopify";

export type HeroBanner = {
  image: string;
  link: string;
};

type MetaobjectField =
  | { key: "image"; reference: { previewImage: { url: string } } | null }
  | { key: "link"; value: string };

type HeroBannersData = {
  metaobjects: {
    nodes: Array<{ fields: MetaobjectField[] }>;
  };
};

const QUERY = `
  query HeroBanners {
    metaobjects(type: "hero_banner", first: 10) {
      nodes {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              previewImage {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const data = await shopifyFetch<HeroBannersData>(QUERY);
    return data.metaobjects.nodes.flatMap((node) => {
      const imageField = node.fields.find((f) => f.key === "image") as
        | { key: "image"; reference: { previewImage: { url: string } } | null }
        | undefined;
      const linkField = node.fields.find((f) => f.key === "link") as
        | { key: "link"; value: string }
        | undefined;

      const imageUrl = imageField?.reference?.previewImage?.url;
      const link = linkField?.value ?? "/";

      if (!imageUrl) return [];
      return [{ image: imageUrl, link }];
    });
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run test -- --reporter=verbose src/lib/__tests__/hero-banners.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Run full suite to confirm no regressions**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run test
```

Expected: all previously passing tests still pass, 4 new tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/hero-banners.ts src/lib/__tests__/hero-banners.test.ts
git commit -m "feat: add getHeroBanners — fetch hero banners from Shopify metaobjects"
```

---

## Task 3: Hero carousel client component

**Files:**
- Create: `src/components/home/hero-carousel.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/home/hero-carousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBanner } from "@/lib/hero-banners";

type HeroCarouselProps = {
  banners: HeroBanner[];
};

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = banners.length;

  function go(index: number) {
    setActive(((index % count) + count) % count);
  }

  useEffect(() => {
    if (count <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, paused]);

  return (
    <div
      className="relative min-h-[98vh] w-full overflow-hidden"
      style={{ background: "var(--bg-dark)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((banner, i) => (
        <div
          key={banner.image}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
          aria-hidden={i !== active}
        >
          <Link href={banner.link as Route} className="block h-full w-full">
            <Image
              src={banner.image}
              alt={`Hero banner ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-top"
            />
          </Link>
        </div>
      ))}

      {/* Prev / Next arrows — only shown when >1 banner */}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => go(active - 1)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-[rgba(201,169,110,0.35)] bg-[rgba(14,4,4,0.55)] text-[var(--gold)] opacity-0 transition hover:bg-[rgba(14,4,4,0.8)] group-hover:opacity-100 sm:opacity-60"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => go(active + 1)}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-[rgba(201,169,110,0.35)] bg-[rgba(14,4,4,0.55)] text-[var(--gold)] opacity-0 transition hover:bg-[rgba(14,4,4,0.8)] group-hover:opacity-100 sm:opacity-60"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot indicators — only shown when >1 banner */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className="size-2 rounded-full border border-[rgba(201,169,110,0.5)] transition-colors"
              style={{ background: i === active ? "var(--gold)" : "transparent" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/hero-carousel.tsx
git commit -m "feat: add HeroCarousel client component — crossfade, dots, arrows, auto-advance"
```

---

## Task 4: Convert HeroSection to async server component

**Files:**
- Modify: `src/components/home/hero-section.tsx`

- [ ] **Step 1: Replace the file contents**

```typescript
// src/components/home/hero-section.tsx

import Image from "next/image";
import { getHeroBanners } from "@/lib/hero-banners";
import { HeroCarousel } from "@/components/home/hero-carousel";

export async function HeroSection() {
  const banners = await getHeroBanners();

  if (banners.length === 0) {
    return (
      <section
        className="relative min-h-[98vh] w-full overflow-hidden"
        style={{ background: "var(--bg-dark)" }}
      >
        <Image
          src="/assets/hero/heroimage.png"
          alt="Sundari Jewellers bridal collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </section>
    );
  }

  return <HeroCarousel banners={banners} />;
}
```

- [ ] **Step 2: Typecheck**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run typecheck
```

Expected: no errors. If `Route` type complains about dynamic banner links, it is fine — they're cast with `as Route` inside the carousel.

- [ ] **Step 3: Run full test suite**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run test
```

Expected: all tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/hero-section.tsx
git commit -m "feat: convert HeroSection to async server component — fetches banners, falls back to static image"
```

---

## Task 5: Visual verification

- [ ] **Step 1: Start dev server**

```bash
cd /Users/archismandutta/IH/S/sundari && npm run dev
```

- [ ] **Step 2: Test with banners configured in Shopify**

Navigate to `http://localhost:3000`.

Verify:
- Hero section renders the first Shopify banner image full-bleed.
- Carousel auto-advances to next banner after ~5 seconds.
- Hovering pauses the timer (stay on current slide indefinitely).
- Dot indicators appear at the bottom; active dot is gold.
- Clicking a dot navigates to that slide.
- Clicking prev/next arrows steps through slides.
- Clicking anywhere on the slide navigates to `banner.link`.

- [ ] **Step 3: Test fallback**

Temporarily modify `src/lib/hero-banners.ts` — change `return [];` at the very end of the `try` block to always return early:

```typescript
// temporary: force fallback
export async function getHeroBanners(): Promise<HeroBanner[]> {
  return [];
}
```

Reload `http://localhost:3000`. Verify static `/assets/hero/heroimage.png` shows full-bleed with no arrows or dots. Then revert the change.

- [ ] **Step 4: Test single banner**

Remove all but one entry in Shopify Admin → Content → Metaobjects → Hero Banner.

Reload. Verify no arrows and no dots appear. Auto-advance does not fire. The single image displays full-bleed and clicking it navigates to its link.

- [ ] **Step 5: Revert any temporary changes**

```bash
git checkout src/lib/hero-banners.ts
```

---

## Spec Coverage Check

| Spec requirement | Task |
|-----------------|------|
| `src/lib/shopify.ts` — Storefront API client | Task 1 |
| `src/lib/hero-banners.ts` — `HeroBanner` type + `getHeroBanners()` | Task 2 |
| Unit tests: happy path, empty, missing image, error → `[]` | Task 2 |
| `src/components/home/hero-carousel.tsx` client component | Task 3 |
| Auto-advance 5s, pause on hover | Task 3 |
| Crossfade 700ms transition | Task 3 |
| Dot indicators, prev/next arrows | Task 3 |
| Each slide is full-bleed `<Link>` wrapping `<Image>` | Task 3 |
| Arrows/dots hidden for single banner | Task 3 |
| `hero-section.tsx` converted to async server component | Task 4 |
| Static fallback when banners empty | Task 4 |
| ISR `revalidate: 300` (set in `shopifyFetch` `next` option) | Task 1 |
| Visual verification with real Shopify data | Task 5 |
| Fallback verified | Task 5 |
