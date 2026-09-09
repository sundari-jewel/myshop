"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef } from "react";

const SUBCATEGORIES = [
  {
    label: "CNC Bangles",
    image: "/assets/category-cnc-bangles.png",
    href: "/collections/bangles?tag=CNC+Bangle",
    key: "cnc-bangle",
  },
  {
    label: "Ad Bangles",
    image: "/assets/category-ad-bangles.png",
    href: "/collections/bangles?tag=Ad+Bangle",
    key: "ad-bangle",
  },
  {
    label: "High Gold Bangles",
    image: "/assets/category-high-gold-bangles.png",
    href: "/collections/bangles?tag=High+Gold+Bangle",
    key: "high-gold-bangle",
  },
  {
    label: "Heritage Bangles",
    image: "/assets/category-heritage-bangles.png",
    href: "/collections/bangles?tag=Heritage+Bangle",
    key: "heritage-bangle",
  },
  {
    label: "Moissanite Bangles",
    image: "/assets/category-moissanite-bangles.png",
    href: "/collections/bangles?tag=Moissanite+Bangle",
    key: "moissanite-bangle",
  },
  {
    label: "Daily Use Bangles",
    image: "/assets/category-daily-use-bangles.png",
    href: "/collections/bangles?tag=dail-use+bangle",
    key: "dail-use-bangle",
  },
  {
    label: "Bridal Chuda",
    image: "/assets/category-bridal-chuda.png",
    href: "/collections/bangles?tag=Bridal+Bangle",
    key: "bridal-bangle",
  },
];

export function BangleSubcategories({ activeTag }: { activeTag?: string }) {
  const prevTag = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (activeTag && activeTag !== prevTag.current) {
      document
        .getElementById("necklace-products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevTag.current = activeTag;
  }, [activeTag]);

  return (
    <div className="container-shell pt-8 pb-2">
      <div className="mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">
          Browse by Category
        </p>
        <div
          className="mx-auto mt-2 h-px w-16"
          style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
        {SUBCATEGORIES.map((sub) => {
          const isActive = activeTag === sub.key;
          return (
            <Link
              key={sub.label}
              href={sub.href as Route}
              className={`group relative aspect-[3/4] max-h-56 w-full overflow-hidden rounded-xl shadow-[0_4px_18px_rgba(33,20,12,0.32)] sm:max-h-72 ${isActive ? "ring-2 ring-[var(--gold)]" : ""}`}
            >
              <Image
                src={sub.image}
                alt={sub.label}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(28,10,4,0.86) 0%, rgba(28,10,4,0.22) 55%, transparent 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                <h3 className="display-font text-[1.1rem] italic leading-tight text-white sm:text-[1.45rem]">
                  {sub.label}
                </h3>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] sm:text-[10px]">
                  Shop Now
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div
        className="mx-auto mt-8 h-px w-full max-w-lg"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent)" }}
      />
    </div>
  );
}
