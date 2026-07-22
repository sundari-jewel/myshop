# Watches & Rakhi Homepage Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cinematic 50/50 split section (watches left, rakhi right) to the homepage between `<WeddingShop />` and `<TryBeforeShine />`.

**Architecture:** One new presentational component `WatchesAndRakhi` with no props — self-contained dark section, two `<Link>` panels with placeholder 2×2 background grids, gold ornament header. Wired into `page.tsx` with a single import and one JSX line.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, existing CSS tokens (`var(--bg-dark)`, `var(--gold)`, etc.), `next/link`, `next/image` (not used yet — placeholders are plain divs)

---

## File Map

| Action | Path | What it does |
|--------|------|--------------|
| Create | `src/components/home/watches-and-rakhi.tsx` | Full component — header, split panels, placeholder grid, editorial text, CTAs |
| Modify | `src/app/(store)/page.tsx` | Add import + `<WatchesAndRakhi />` between WeddingShop and TryBeforeShine |

---

## Task 1: Create the `WatchesAndRakhi` component

**Files:**
- Create: `src/components/home/watches-and-rakhi.tsx`

- [ ] **Step 1: Create the file**

`src/components/home/watches-and-rakhi.tsx`:

```tsx
import Link from "next/link";
import type { Route } from "next";

const WATCHES_CELLS = [
  "#1a0606",
  "#200808",
  "#160404",
  "#1e0707",
] as const;

const RAKHI_CELLS = [
  "#2a0e0e",
  "#321205",
  "#280c0c",
  "#2e1008",
] as const;

export function WatchesAndRakhi() {
  return (
    <section className="py-7 sm:py-8" style={{ background: "var(--bg-dark)" }}>

      {/* ── Header ── */}
      <div className="mb-5 flex items-center justify-center gap-5 sm:gap-7">
        <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
        <span className="display-font text-center text-[2.05rem] font-semibold italic leading-none tracking-[0.08em] text-[var(--gold)] drop-shadow-[0_2px_1px_rgba(70,40,0,0.32)] sm:text-[2.45rem]">
          Watches &amp; Rakhi
        </span>
        <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
      </div>

      {/* ── Split panels ── */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2">

        {/* Watches panel */}
        <Link
          href={"/collections/watches" as Route}
          className="focus-ring group relative block min-h-[320px] overflow-hidden sm:min-h-[420px]"
        >
          {/* Placeholder background grid */}
          <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 transition-transform duration-700 group-hover:scale-[1.04]">
            {WATCHES_CELLS.map((bg, i) => (
              <div
                key={i}
                style={{ background: bg, border: "1px solid rgba(201,169,110,0.1)" }}
              />
            ))}
          </div>

          {/* Gradient overlay — left to right fade */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to right, var(--bg-dark) 0%, rgba(24,6,6,0.8) 50%, transparent 100%)",
            }}
          />

          {/* Editorial text */}
          <div className="absolute bottom-0 left-0 z-20 p-6 sm:p-10">
            <p
              className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.28em]"
              style={{ color: "rgba(201,169,110,0.55)" }}
            >
              New Arrivals · 2026
            </p>
            <h2
              className="display-font mb-2 font-semibold italic leading-tight text-[var(--cream)]"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              Fine Watches
            </h2>
            <p
              className="mb-5 text-xs tracking-wide"
              style={{ color: "rgba(245,230,200,0.45)" }}
            >
              Precision-crafted timepieces for every occasion
            </p>
            <span className="btn-ghost-gold">Shop Watches →</span>
          </div>
        </Link>

        {/* Vertical divider — sm+ only */}
        <span
          className="absolute bottom-[10%] left-1/2 top-[10%] hidden w-px sm:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Rakhi panel */}
        <Link
          href={"/collections/rakhi" as Route}
          className="focus-ring group relative block min-h-[320px] overflow-hidden sm:min-h-[420px]"
        >
          {/* Placeholder background grid */}
          <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 transition-transform duration-700 group-hover:scale-[1.04]">
            {RAKHI_CELLS.map((bg, i) => (
              <div
                key={i}
                style={{ background: bg, border: "1px solid rgba(201,169,110,0.1)" }}
              />
            ))}
          </div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to right, var(--bg-maroon) 0%, rgba(42,14,14,0.8) 50%, transparent 100%)",
            }}
          />

          {/* Editorial text */}
          <div className="absolute bottom-0 left-0 z-20 p-6 sm:p-10">
            <p
              className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.28em]"
              style={{ color: "rgba(201,169,110,0.55)" }}
            >
              Raksha Bandhan · Festival Edit
            </p>
            <h2
              className="display-font mb-2 font-semibold italic leading-tight text-[var(--cream)]"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              Rakhi Collection
            </h2>
            <p
              className="mb-5 text-xs tracking-wide"
              style={{ color: "rgba(245,230,200,0.45)" }}
            >
              Gift in gold. Celebrate the bond that lasts forever.
            </p>
            <span className="btn-ghost-gold">Shop Rakhi →</span>
          </div>
        </Link>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `/collections/watches` or `/collections/rakhi` routes don't exist yet, Next.js typed routes will warn — cast with `as Route` is already in the code above to suppress this.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/watches-and-rakhi.tsx
git commit -m "feat: add WatchesAndRakhi component — cinematic 50/50 split with placeholder grids"
```

---

## Task 2: Wire into the homepage

**Files:**
- Modify: `src/app/(store)/page.tsx`

- [ ] **Step 1: Add import**

In `src/app/(store)/page.tsx`, add to the imports block after the `WeddingShop` import:

```tsx
import { WatchesAndRakhi }    from "@/components/home/watches-and-rakhi";
```

- [ ] **Step 2: Add to JSX**

In the same file, insert `<WatchesAndRakhi />` between `<WeddingShop />` and `<TryBeforeShine />`:

```tsx
      <WeddingShop />
      <WatchesAndRakhi />
      <TryBeforeShine />
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(store)/page.tsx
git commit -m "feat: wire WatchesAndRakhi into homepage between WeddingShop and TryBeforeShine"
```

---

## Task 3: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open the homepage**

Navigate to `http://localhost:3000` and scroll to the section between Wedding Shop and Try Before Shine.

Verify:
- Section has a dark background and gold ornament header reading "Watches & Rakhi"
- Two panels side-by-side on desktop, stacked on mobile
- Left panel shows "Fine Watches" editorial text with `Shop Watches →` button
- Right panel shows "Rakhi Collection" editorial text with `Shop Rakhi →` button
- Thin gold vertical line between the panels on desktop
- Hovering either panel causes the background grid to scale up subtly
- Both panels are keyboard-focusable (tab to them — gold outline should appear)

- [ ] **Step 3: Check mobile layout**

Resize to < 640px viewport width.

Verify:
- Panels stack vertically (watches above rakhi)
- Divider line is hidden
- Ornament lines flanking the header title are hidden (they use `hidden sm:block`)
- Both panels maintain readable text and correct padding (`p-6`)

- [ ] **Step 4: Commit if any polish fixes were needed**

```bash
git add -p
git commit -m "fix: watches-rakhi section visual polish"
```

---

## Spec coverage check

| Spec requirement | Task |
|-----------------|------|
| Component at `src/components/home/watches-and-rakhi.tsx` | Task 1 |
| Standard gold ornament header "Watches & Rakhi" | Task 1 Step 1 |
| 50/50 split, stacks on mobile | Task 1 Step 1 (`grid-cols-1 sm:grid-cols-2`) |
| Watches: dark bg, placeholder 2×2 grid, overlay, editorial text, CTA → `/collections/watches` | Task 1 Step 1 |
| Rakhi: maroon bg, placeholder 2×2 grid, overlay, editorial text, CTA → `/collections/rakhi` | Task 1 Step 1 |
| Vertical gold divider sm+ only | Task 1 Step 1 |
| Hover: background grid scales | Task 1 Step 1 (`group-hover:scale-[1.04]`) |
| No new CSS classes — only existing tokens | Task 1 Step 1 |
| Placed after WeddingShop, before TryBeforeShine | Task 2 |
