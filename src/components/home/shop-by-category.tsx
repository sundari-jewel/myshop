"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  { label: "Earing",   href: "/collections/earrings",  image: "/assets/category-earring.webp" },
  { label: "Bangles",  href: "/collections/bangles",   image: "/assets/category-bangles.webp" },
  { label: "Rings",    href: "/collections/rings",     image: "/assets/category-ring.webp" },
  { label: "Tika",     href: "/collections/tika",      image: "/assets/category-tika.webp" },
  { label: "Necklace", href: "/collections/necklaces", image: "/assets/category-necklace.webp" },
] as const;

const CARD_HEIGHT = 520;
const W_EXPANDED  = 540;
const W_ADJACENT  = 190;
const W_FAR       = 120;

const SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

export function cardMotionProps(distance: number): { width: number; opacity: number } {
  if (distance === 0)           return { width: W_EXPANDED,  opacity: 1    };
  if (Math.abs(distance) === 1) return { width: W_ADJACENT,  opacity: 0.82 };
  return                               { width: W_FAR,        opacity: 0.55 };
}

export function ShopByCategory() {
  const [activeIndex,  setActiveIndex]  = useState(2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isPaused   = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const expandedIndex = hoveredIndex ?? activeIndex;

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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
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
          100% { background-position: 0%   center; }
        }
      `}</style>
      <section
        className="py-10 sm:py-20"
        style={{ background: "var(--bg-dark)" }}
      >
        {/* Heading */}
        <div className="mx-auto mb-7 flex w-[min(1160px,calc(100%-24px))] items-center justify-center gap-5 sm:mb-10 sm:w-[min(1160px,calc(100%-40px))] sm:gap-7">
          <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
          <span className="display-font text-center text-[1.75rem] font-semibold italic leading-none tracking-[0.05em] text-[var(--gold)] drop-shadow-[0_2px_1px_rgba(70,40,0,0.32)] sm:text-[2.45rem] sm:tracking-[0.08em]">
            Shop by Category
          </span>
          <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
        </div>

        {/* ── Desktop: accordion carousel (full-bleed) ─────────────── */}
        <div
          className="hidden overflow-hidden lg:block"
          onMouseLeave={() => {
            isPaused.current = false;
            setHoveredIndex(null);
          }}
        >
          <div className="flex items-stretch justify-center gap-2 px-4">
            {CATEGORIES.map((cat, index) => {
              const distance  = index - expandedIndex;
              const isCenter  = distance === 0;
              const motProps  = cardMotionProps(distance);

              return (
                <motion.div
                  key={cat.label}
                  animate={motProps}
                  transition={SPRING}
                  className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-[0_4px_18px_rgba(33,20,12,0.22)]"
                  style={{ height: CARD_HEIGHT }}
                  onMouseEnter={() => {
                    isPaused.current = true;
                    setHoveredIndex(index);
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <Link
                    href={cat.href as Route}
                    className="focus-ring block h-full w-full"
                    tabIndex={-1}
                  >
                    {/* Image */}
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="390px"
                      className="object-cover transition-transform duration-700 ease-out"
                      style={{ transform: isCenter ? "scale(1.04)" : "scale(1)" }}
                    />

                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isCenter
                          ? "linear-gradient(to top, rgba(28,10,4,0.78) 0%, rgba(28,10,4,0.22) 48%, transparent 100%)"
                          : "linear-gradient(to top, rgba(28,10,4,0.60) 0%, rgba(28,10,4,0.30) 60%, rgba(28,10,4,0.10) 100%)",
                      }}
                    />

                    {/* Label — expanded: bottom-left with arrow; collapsed: rotated */}
                    {isCenter ? (
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold)]">
                          Collection
                        </p>
                        <h3 className="display-font mt-1 text-[2rem] italic leading-none text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">
                          {cat.label}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                          Shop Now
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-end justify-center pb-5">
                        <span
                          className="display-font whitespace-nowrap text-[1.15rem] italic text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          {cat.label}
                        </span>
                      </div>
                    )}

                    {/* Gold top-edge accent on active */}
                    {isCenter && (
                      <div
                        className="absolute inset-x-0 top-0 h-[3px]"
                        style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>{/* end overflow-hidden */}

        {/* Dot navigation — desktop only */}
        <div className="mt-6 hidden justify-center gap-2 lg:flex">
          {CATEGORIES.map((cat, index) => (
            <button
              key={cat.label}
              aria-label={`Go to ${cat.label}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => handleCardClick(index)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "h-2.5 w-2.5 bg-[var(--gold)]"
                  : "h-2 w-2 border border-[var(--gold)] bg-transparent opacity-50"
              }`}
            />
          ))}
        </div>

        {/* ── Mobile: static grid ─────────────────────────────────── */}
        <div className="mx-auto w-[min(1160px,calc(100%-24px))] sm:w-[min(1160px,calc(100%-40px))]">
          <div className="grid grid-cols-2 items-center gap-2.5 sm:grid-cols-3 sm:gap-3 lg:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href as Route}
                className="focus-ring group w-full"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_2px_7px_rgba(33,20,12,0.28)] transition-transform duration-300 group-hover:-translate-y-1 sm:aspect-[4/5.15] sm:rounded-xl"
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
                  <span className="display-font absolute bottom-3 left-3 text-[1.35rem] italic leading-none text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.58)] sm:bottom-4 sm:left-4 sm:text-[1.9rem]">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
