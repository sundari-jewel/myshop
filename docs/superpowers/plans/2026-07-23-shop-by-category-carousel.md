# Shop by Category Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Framer Motion spotlight-center carousel and soft shimmer gradient background to the Shop by Category section.

**Architecture:** Convert `ShopByCategory` from a static server component to a `"use client"` component. Desktop renders 5 `<motion.div>`-wrapped cards driven by `activeIndex` state, auto-advancing every 3 s; mobile renders the original static grid unchanged. An inline `@keyframes shimmer` animates the section background across all sizes.

**Tech Stack:** React 19, Next.js 16, Framer Motion, Tailwind CSS 4, TypeScript

---

## File Map

| File | Action |
|------|--------|
| `src/components/home/shop-by-category.tsx` | Full rewrite — client component, shimmer bg, carousel, dots |
| `src/components/home/__tests__/shop-by-category.test.ts` | New — unit test for `cardMotionProps` pure helper |
| `package.json` | Add `framer-motion` dependency |

---

## Task 1: Install framer-motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install framer-motion
```

- [ ] **Step 2: Verify it appears in dependencies**

```bash
grep framer-motion package.json
```

Expected output:
```
    "framer-motion": "^<version>",
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion"
```

---

## Task 2: Write failing test for cardMotionProps helper

**Files:**
- Create: `src/components/home/__tests__/shop-by-category.test.ts`

The `cardMotionProps` helper is a pure function — testable in the node vitest environment without jsdom.

- [ ] **Step 1: Create the test file**

```typescript
// src/components/home/__tests__/shop-by-category.test.ts
import { describe, it, expect } from "vitest";
import { cardMotionProps } from "../shop-by-category";

describe("cardMotionProps", () => {
  it("active card (distance 0) gets full opacity, scale 1.12, zIndex 10", () => {
    const props = cardMotionProps(0);
    expect(props.scale).toBe(1.12);
    expect(props.opacity).toBe(1);
    expect(props.zIndex).toBe(10);
  });

  it("adjacent card (distance 1) gets opacity 0.75, scale 1.0, zIndex 5", () => {
    const props = cardMotionProps(1);
    expect(props.scale).toBe(1.0);
    expect(props.opacity).toBe(0.75);
    expect(props.zIndex).toBe(5);
  });

  it("adjacent card (distance -1) gets same treatment as distance 1", () => {
    const props = cardMotionProps(-1);
    expect(props.scale).toBe(1.0);
    expect(props.opacity).toBe(0.75);
    expect(props.zIndex).toBe(5);
  });

  it("outer card (distance 2) gets opacity 0.5, scale 0.9, zIndex 1", () => {
    const props = cardMotionProps(2);
    expect(props.scale).toBe(0.9);
    expect(props.opacity).toBe(0.5);
    expect(props.zIndex).toBe(1);
  });

  it("outer card (distance -2) gets same treatment as distance 2", () => {
    const props = cardMotionProps(-2);
    expect(props.scale).toBe(0.9);
    expect(props.opacity).toBe(0.5);
    expect(props.zIndex).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests — expect failure (function not exported yet)**

```bash
npx vitest run src/components/home/__tests__/shop-by-category.test.ts
```

Expected: FAIL — `cardMotionProps` is not exported

---

## Task 3: Rewrite ShopByCategory with shimmer bg + carousel state

**Files:**
- Modify: `src/components/home/shop-by-category.tsx`

- [ ] **Step 1: Replace the file with the full implementation**

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  { label: "Earing",   href: "/collections/earrings",  image: "/assets/image_11.png" },
  { label: "Bangles",  href: "/collections/bangles",   image: "/assets/image_12.png" },
  { label: "Rings",    href: "/collections/rings",     image: "/assets/image_13.png" },
  { label: "Tika",     href: "/collections/tika",      image: "/assets/image_14.png" },
  { label: "Necklace", href: "/collections/necklaces", image: "/assets/image_15.png" },
] as const;

const CARD_SIZES = [
  "w-[200px]",
  "w-[224px]",
  "w-[252px]",
  "w-[224px]",
  "w-[200px]",
] as const;

const SPRING = { type: "spring", stiffness: 280, damping: 26 } as const;

export function cardMotionProps(distance: number) {
  if (distance === 0) {
    return {
      scale: 1.12,
      opacity: 1,
      zIndex: 10,
      filter: "drop-shadow(0 0 14px rgba(201,169,110,0.55))",
    };
  }
  if (Math.abs(distance) === 1) {
    return { scale: 1.0, opacity: 0.75, zIndex: 5, filter: "none" };
  }
  return { scale: 0.9, opacity: 0.5, zIndex: 1, filter: "none" };
}

export function ShopByCategory() {
  const [activeIndex, setActiveIndex] = useState(2);
  const isPaused = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function resetInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex((i) => (i + 1) % CATEGORIES.length);
      }
    }, 3000);
  }

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCardClick(index: number) {
    setActiveIndex(index);
    resetInterval();
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: 0% center;   }
        }
      `}</style>
      <section
        className="py-14 sm:py-20"
        style={{
          background:
            "linear-gradient(110deg, #f4f3f4 0%, #fdf8ee 35%, #f5e9c8 50%, #fdf8ee 65%, #f4f3f4 100%)",
          backgroundSize: "250% 100%",
          animation: "shimmer 6s linear infinite",
        }}
        onMouseEnter={() => {
          isPaused.current = true;
        }}
        onMouseLeave={() => {
          isPaused.current = false;
        }}
      >
        <div className="mx-auto w-[min(1160px,calc(100%-40px))]">
          {/* Heading */}
          <div className="mb-8 flex items-center justify-center gap-5 sm:gap-7">
            <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
            <span className="display-font text-center text-[2.05rem] font-semibold italic leading-none tracking-[0.08em] text-[var(--gold)] drop-shadow-[0_2px_1px_rgba(70,40,0,0.32)] sm:text-[2.45rem]">
              Shop by Category
            </span>
            <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
          </div>

          {/* Desktop carousel — Framer Motion spotlight */}
          <div className="hidden items-center justify-center gap-3 lg:flex">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.label}
                animate={cardMotionProps(index - activeIndex)}
                transition={SPRING}
                className={`relative ${CARD_SIZES[index]}`}
              >
                <Link
                  href={cat.href as Route}
                  className="focus-ring group block"
                  onClick={() => handleCardClick(index)}
                >
                  <div
                    className="relative aspect-[4/5.15] overflow-hidden rounded-[5px] shadow-[0_2px_7px_rgba(33,20,12,0.28)]"
                    style={{ background: "var(--bg-dark)" }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="252px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(35,12,6,0.72) 0%, rgba(35,12,6,0.18) 55%, transparent 100%)",
                      }}
                    />
                    <span className="display-font absolute bottom-4 left-4 text-[1.85rem] italic leading-none text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.58)]">
                      {cat.label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile static grid — no carousel effects */}
          <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href as Route}
                className="focus-ring group w-full"
              >
                <div
                  className="relative aspect-[4/5.15] overflow-hidden rounded-[5px] shadow-[0_2px_7px_rgba(33,20,12,0.28)] transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ background: "var(--bg-dark)" }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(35,12,6,0.72) 0%, rgba(35,12,6,0.18) 55%, transparent 100%)",
                    }}
                  />
                  <span className="display-font absolute bottom-4 left-4 text-[1.65rem] italic leading-none text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.58)] sm:text-[1.9rem]">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Dot navigation — desktop only */}
          <div className="mt-6 hidden justify-center gap-2 lg:flex">
            {CATEGORIES.map((cat, index) => (
              <button
                key={cat.label}
                aria-label={`Go to category ${cat.label}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => handleCardClick(index)}
                className={`rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "h-2.5 w-2.5 scale-110 bg-[var(--gold)]"
                    : "h-2 w-2 border border-[var(--gold)] bg-transparent opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run the failing test — now expect it to pass**

```bash
npx vitest run src/components/home/__tests__/shop-by-category.test.ts
```

Expected: All 5 tests PASS

- [ ] **Step 3: Run full test suite to check for regressions**

```bash
npm run test
```

Expected: All tests pass (same result as before this task)

- [ ] **Step 4: TypeScript check**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/home/shop-by-category.tsx src/components/home/__tests__/shop-by-category.test.ts
git commit -m "feat: Shop by Category — Framer Motion spotlight carousel + shimmer bg"
```

---

## Task 4: Visual verification

**Files:** (none changed)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser and scroll to the "Shop by Category" section.

- [ ] **Step 2: Verify shimmer background**

The section background should show a gentle warm ivory-to-pale-gold wave sweeping left to right every 6 seconds. It should be subtle — not competing with the cards.

- [ ] **Step 3: Verify desktop carousel**

At viewport width ≥ 1024 px:
- The center card (Rings) starts foregrounded: slightly larger, full opacity, gold glow
- Side cards are visibly smaller and dimmer
- Cards auto-advance every 3 seconds (Rings → Tika → Necklace → Earing → Bangles → Rings…)
- Hovering the section pauses auto-advance
- Clicking a card immediately brings it to the front and resets the timer
- Spring animation feels snappy (~0.45 s), not sluggish

- [ ] **Step 4: Verify dot navigation**

At viewport width ≥ 1024 px:
- 5 dots appear below the cards
- Active dot is filled gold and slightly larger
- Clicking a dot jumps to that card
- Dots are not visible on mobile

- [ ] **Step 5: Verify mobile**

At viewport width < 1024 px:
- Static 2-column grid renders (same as before)
- No carousel effects, no dots
- Shimmer background still visible
- All 5 cards display correctly in grid

- [ ] **Step 6: Verify no regressions on other home sections**

Scroll the full home page — hero, customer reels, wedding shop, footer — and confirm nothing is broken.
