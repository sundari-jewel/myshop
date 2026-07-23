# Shop by Category — Carousel + Background Design

**Date:** 2026-07-23
**Component:** `src/components/home/shop-by-category.tsx`

---

## Overview

Enhance the "Shop by Category" section with two improvements:
1. A soft shimmer gradient animation replacing the flat grey background
2. A Framer Motion spotlight-center carousel where the active card is foregrounded and auto-advances every 3 seconds

---

## Background

The section background changes from flat `#f4f3f4` to an animated shimmer gradient.

- **Gradient:** `linear-gradient(110deg, #f4f3f4 0%, #fdf8ee 35%, #f5e9c8 50%, #fdf8ee 65%, #f4f3f4 100%)`
- **Size:** `background-size: 250% 100%`
- **Animation:** `@keyframes shimmer` slides `background-position` from `200% center` to `0% center` over **6 s**, looping infinitely
- **Effect:** A warm ivory-to-pale-gold wave sweeps across the section, subtle enough not to compete with the cards

Implementation: inline `<style>` block in the component (no new CSS file needed since this is a single isolated keyframe).

---

## Component Architecture

`ShopByCategory` becomes a `"use client"` component.

**State & refs:**
- `activeIndex: number` — starts at `2` (the center Rings card)
- `isPaused: React.MutableRefObject<boolean>` — toggled by mouse enter/leave on the section element; prevents state updates without re-render overhead

**Auto-advance:**
```
useEffect → setInterval(3000) → if (!isPaused.current) setActiveIndex(i => (i + 1) % 5)
clearInterval on unmount
```

**Manual advance:** Clicking any card calls `setActiveIndex(index)` and resets the interval timer (clear + restart).

---

## Card Animation (Framer Motion)

Each card `<Link>` is wrapped in `<motion.div>` with `animate` props driven by distance from `activeIndex`.

| Position | scale | opacity | zIndex | filter |
|----------|-------|---------|--------|--------|
| Active (0) | 1.12 | 1.0 | 10 | `drop-shadow(0 0 14px rgba(184,142,60,0.55))` |
| Adjacent (±1) | 1.0 | 0.75 | 5 | none |
| Outer (±2) | 0.9 | 0.5 | 1 | none |

**Spring config:** `{ type: "spring", stiffness: 280, damping: 26 }` applied to all animated properties. Effective transition duration ~0.45 s.

The existing image zoom on hover (`group-hover:scale-105`) is preserved — it layers on top of the Framer scale and still works per-card.

**Install:** `framer-motion` added as a production dependency.

---

## Dot Navigation

A row of 5 `<button>` elements centered below the card row (`mt-6`, `gap-2`).

- **Active dot:** `bg-[var(--gold)] scale-110 w-2.5 h-2.5 rounded-full`
- **Inactive dot:** `border border-[var(--gold)] opacity-50 w-2 h-2 rounded-full bg-transparent`
- Each dot calls `setActiveIndex(i)` on click
- Dots have `aria-label="Go to category X"` and `aria-current="true"` on the active one

---

## Mobile Behaviour

- On `sm` and below (`< 640px`): cards render as the existing 2-col static grid — Framer Motion scale/opacity effects are **disabled** (active index has no visual effect at this breakpoint). The `useEffect` interval still runs but doesn't affect layout.
- The shimmer background animation is **active on all screen sizes**.
- Dot nav is **hidden on mobile** (`hidden sm:flex`) — the static grid doesn't need it.

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/home/shop-by-category.tsx` | Convert to client component; add shimmer bg, Framer carousel, dots |
| `package.json` / `package-lock.json` | Add `framer-motion` |

---

## Out of Scope

- No changes to card images, labels, or hrefs
- No changes to other home-page sections
- No server-side data fetching changes
