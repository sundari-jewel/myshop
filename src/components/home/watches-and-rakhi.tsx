import Image from "next/image";
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
    <section className="py-10 sm:py-20" style={{ background: "var(--bg-dark)" }}>

      {/* ── Header ── */}
      <div className="mb-7 flex items-center justify-center gap-5 sm:mb-14 sm:gap-7">
        <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
        <span className="display-font text-center text-[1.75rem] font-semibold italic leading-none tracking-[0.05em] text-[var(--gold)] drop-shadow-[0_2px_1px_rgba(70,40,0,0.32)] sm:text-[2.45rem] sm:tracking-[0.08em]">
          Watches &amp; Rakhi
        </span>
        <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
      </div>

      {/* ── Split panels ── */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2">

        {/* Watches panel */}
        <Link
          href={"/collections/watches" as Route}
          className="focus-ring group relative block min-h-[260px] overflow-hidden sm:min-h-[420px]"
        >
          <Image
            src="/assets/watches-collection.webp"
            alt="Fine Watches Collection"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Gradient overlay — left to right fade */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to right, var(--bg-dark) 0%, rgba(24,6,6,0.8) 50%, transparent 100%)",
            }}
          />

          {/* Editorial text */}
          <div className="absolute bottom-0 left-0 z-20 p-5 sm:p-10">
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
          className="focus-ring group relative block min-h-[260px] overflow-hidden sm:min-h-[420px]"
        >
          <Image
            src="/assets/rakhi-collection.webp"
            alt="Rakhi Collection"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to right, var(--bg-maroon) 0%, rgba(42,14,14,0.8) 50%, transparent 100%)",
            }}
          />

          {/* Editorial text */}
          <div className="absolute bottom-0 left-0 z-20 p-5 sm:p-10">
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
