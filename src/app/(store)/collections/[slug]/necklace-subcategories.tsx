"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef } from "react";

const SUBCATEGORIES: { label: string; image: string | null; href: string; key: string }[] = [
  { label: "Oxidized Necklace",   image: "/assets/category-oxidised-necklace.webp", href: "/collections/necklaces?tag=Oxidized+Necklace",   key: "oxidized-necklace" },
  { label: "Haldi Necklace",      image: "/assets/category-haldi-mehendi-necklace.webp", href: "/collections/necklaces?tag=Haldi+Necklace",      key: "haldi-necklace" },
  { label: "Mehendi Necklace",    image: "/assets/category-haldi-mehendi-necklace.webp", href: "/collections/necklaces?tag=Mehendi+Necklace",    key: "mehendi-necklace" },
  { label: "Temple Necklace",     image: "/assets/category-temple-necklace.webp", href: "/collections/necklaces?tag=Temple+Necklace",     key: "temple-necklace" },
  { label: "Kundan Necklace",     image: "/assets/category-kundan-necklace.webp", href: "/collections/necklaces?tag=Kundan+Necklace",     key: "kundan-necklace" },
  { label: "Bridal Necklace",     image: "/assets/category-bridal-necklace.webp", href: "/collections/necklaces?tag=Bridal+Necklace",     key: "bridal-necklace" },
  { label: "Long Necklace",       image: "/assets/category-long-necklace.png", href: "/collections/necklaces?tag=Long+Necklace",       key: "long-necklace" },
  { label: "Choker Set",          image: "/assets/category-choker-set.png",    href: "/collections/necklaces?tag=Choker+Set",          key: "choker-set" },
  { label: "Hasli Set",           image: "/assets/category-hasli-necklace.png",href: "/collections/necklaces?tag=Hasli+Set",           key: "hasli-set" },
  { label: "AD Necklace",         image: "/assets/category-ad-necklace.webp", href: "/collections/necklaces?tag=AD+Necklace",         key: "ad-necklace" },
  { label: "High Gold Necklace",  image: "/assets/category-high-gold-necklace.webp", href: "/collections/necklaces?tag=High+Gold+Necklace",  key: "high-gold-necklace" },
  { label: "Heritage Necklace",   image: "/assets/category-heritage-necklace.webp", href: "/collections/necklaces?tag=Heritage+Necklace",   key: "heritage-necklace" },
  { label: "Mosaic Necklace",     image: null, href: "/collections/necklaces?tag=Mosaic+Necklace",     key: "mosaic-necklace" },
];

export function NecklaceSubcategories({ activeTag }: { activeTag?: string }) {
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
              key={sub.key}
              href={sub.href as Route}
              className={`group relative aspect-[3/4] max-h-56 w-full overflow-hidden rounded-xl shadow-[0_4px_18px_rgba(33,20,12,0.32)] sm:max-h-72 ${isActive ? "ring-2 ring-[var(--gold)]" : ""}`}
              style={{ background: "rgba(28,10,4,0.72)" }}
            >
              {sub.image && (
                <Image
                  src={sub.image}
                  alt={sub.label}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
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
