"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef } from "react";

const SUBCATEGORIES = [
  {
    label: "Long Necklace",
    image: "/assets/category-long-necklace.png",
    href: "/collections/necklaces?subcategory=long-necklace",
    key: "long-necklace",
  },
  {
    label: "Hasli Necklace",
    image: "/assets/category-hasli-necklace.png",
    href: "/collections/necklaces?subcategory=hasli-necklace",
    key: "hasli-necklace",
  },
  {
    label: "Choker Set",
    image: "/assets/category-choker-set.png",
    href: "/collections/necklaces?subcategory=choker-set",
    key: "choker-set",
  },
  {
    label: "Anti-Tarnish",
    image: "/assets/category-anti-tarnish-necklace.png",
    href: "/collections/necklaces?subcategory=anti-tarnish",
    key: "anti-tarnish",
  },
];

export function NecklaceSubcategories({ activeSubcategory }: { activeSubcategory?: string }) {
  const prevSubcategory = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (activeSubcategory && activeSubcategory !== prevSubcategory.current) {
      document
        .getElementById("necklace-products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevSubcategory.current = activeSubcategory;
  }, [activeSubcategory]);

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
          const isActive = activeSubcategory === sub.key;
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
