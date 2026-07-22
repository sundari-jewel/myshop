# Watches & Rakhi Homepage Section — Design Spec
**Date:** 2026-07-22  
**Status:** Approved

---

## Overview

Add a single new homepage section between `<WeddingShop />` and `<TryBeforeShine />` that showcases watches and rakhi as a cinematic 50/50 split. One component, two panels, one unified dark section.

---

## Component

**File:** `src/components/home/watches-and-rakhi.tsx`  
**Export:** `WatchesAndRakhi`

---

## Layout

### Section wrapper
- Background: `var(--bg-dark)` (`#180606`)
- Padding top: matches adjacent sections (`py-7 sm:py-8`)

### Header
- Standard site ornament pattern: gold line — italic Cormorant title — gold line
- Title text: *"Watches & Rakhi"*
- CSS classes match existing sections: `display-font`, `text-[var(--gold)]`, `drop-shadow`, `tracking-[0.08em]`

### Split grid
- `grid grid-cols-1 sm:grid-cols-2` — stacks on mobile, side-by-side on sm+
- Each column is a `<Link>` wrapping the full panel (entire panel is clickable)

### Left panel — Watches
- Background base: `var(--bg-dark)` (`#180606`)
- **Background grid:** 2×2 grid of placeholder cells using `var(--bg-maroon)` fills with gold-tinted borders (`rgba(201,169,110,0.12)`). Positioned `absolute inset-0`, `z-0`.
- **Gradient overlay:** `linear-gradient(to right, var(--bg-dark) 0%, rgba(24,6,6,0.75) 45%, transparent 100%)` — fades the grid left so text is readable, grid peeks through on the right
- **Editorial text** (z-10, positioned bottom-left):
  - Overline: `"New Arrivals · 2026"` — 10px, uppercase, `rgba(201,169,110,0.55)`
  - Title: `"Fine Watches"` — Cormorant italic, `clamp(2rem, 4vw, 2.8rem)`, `var(--cream)`
  - Subtitle: `"Precision-crafted timepieces for every occasion"` — 12px, `rgba(245,230,200,0.45)`
  - CTA: `btn-ghost-gold` button — `"Shop Watches →"`
- **Href:** `/collections/watches`
- **Hover:** background grid `scale-[1.04]` with `transition-transform duration-700`

### Right panel — Rakhi
- Background base: `var(--bg-maroon)` (`#2a0e0e`)
- **Background grid:** same 2×2 placeholder structure, slightly warmer cell fills (`#3d1a1a`, `#2a1005`)
- **Gradient overlay:** same direction and stops, from `var(--bg-maroon)` to transparent
- **Editorial text** (z-10, positioned bottom-left):
  - Overline: `"Raksha Bandhan · Festival Edit"` — same style
  - Title: `"Rakhi Collection"` — same style
  - Subtitle: `"Gift in gold. Celebrate the bond that lasts forever."` — same style
  - CTA: `btn-ghost-gold` — `"Shop Rakhi →"`
- **Href:** `/collections/rakhi`
- **Hover:** same scale transition on background grid

### Divider
- Thin vertical gold ornament line between the two panels on `sm+`
- `absolute` positioned at panel midpoint, `top-[10%] bottom-[10%]`
- `background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)`
- Hidden on mobile (single column, no divider needed)

### Mobile behaviour
- `grid-cols-1`: panels stack vertically, watches first
- Each panel gets a fixed height of `320px` on mobile, `min-h-[420px]` on sm+
- Divider hidden
- Text padding reduced: `p-6` mobile vs `p-10` desktop

---

## Placeholder cells

Until real product images are available, the 2×2 background grid uses styled `<div>` cells:

```
[ cell 1 ] [ cell 2 ]
[ cell 3 ] [ cell 4 ]
```

Each cell: `background` from the maroon palette, `border: 1px solid rgba(201,169,110,0.1)`, no content. The gradient overlay makes them read as atmosphere rather than empty boxes.

When real images are ready, each cell becomes a `<Image fill>` with `object-cover`.

---

## Homepage integration

`src/app/(store)/page.tsx`:

```tsx
import { WatchesAndRakhi } from "@/components/home/watches-and-rakhi";

// between WeddingShop and TryBeforeShine:
<WeddingShop />
<WatchesAndRakhi />
<TryBeforeShine />
```

---

## Styling approach

- No new CSS classes — uses only existing tokens (`--bg-dark`, `--bg-maroon`, `--gold`, `--cream`, `btn-ghost-gold`, `display-font`, `focus-ring`)
- Tailwind inline for layout/spacing
- Hover effects via Tailwind `group` / `group-hover` pattern already used across the site

---

## Out of scope

- Real product images (placeholder cells ship first)
- Filtering or product counts
- Any animation beyond the existing hover scale/translate patterns
