// src/components/home/hero-carousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
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

  if (count === 0) return null;

  return (
    <div
      className="group relative aspect-[1370/606] min-h-[150px] w-full overflow-hidden sm:min-h-[260px]"
      style={{ background: "var(--bg-dark)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((banner, i) => (
        <div
          key={banner.image + i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
          aria-hidden={i !== active}
        >
          <Link href={banner.link as Route} className="block h-full w-full">
            <Image
              src={banner.image}
              alt={`Hero banner ${i + 1}`}
              fill
              priority={i < 2}
              sizes="100vw"
              className="object-cover object-top"
            />
          </Link>
        </div>
      ))}

      {/* Dot indicators — only shown when >1 banner */}
      {count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className="focus-ring size-2 rounded-full border border-[rgba(201,169,110,0.5)] transition-colors"
              style={{ background: i === active ? "var(--gold)" : "transparent" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
