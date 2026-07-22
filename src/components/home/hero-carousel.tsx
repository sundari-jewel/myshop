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
