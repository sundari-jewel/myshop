"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const ALL_CATEGORIES = [
  { label: "Necklaces",  discount: "Up to 20% Off", image: "/assets/sale-necklace.webp",           href: "/collections/sale?category=necklaces", tag: "Bestsellers" },
  { label: "Rings",      discount: "Up to 25% Off", image: "/assets/sale-ring.webp",                href: "/collections/sale?category=rings",     tag: "New Arrivals" },
  { label: "Earrings",   discount: "Up to 20% Off", image: "/assets/sale-earring.webp",             href: "/collections/sale?category=earrings",  tag: "Signature" },
  { label: "Hathful",    discount: "Up to 15% Off", image: "/assets/category-hathful.webp",         href: "/collections/sale?category=hathful",   tag: "Exclusive" },
  { label: "Watches",    discount: "Up to 20% Off", image: "/assets/watches-collection.webp",       href: "/collections/sale?category=watches",   tag: "New Arrivals" },
  { label: "Tikka",      discount: "Up to 18% Off", image: "/assets/category-tika.webp",            href: "/collections/sale?category=tika",      tag: "Bridal Picks" },
  { label: "Nath",       discount: "Up to 15% Off", image: "/assets/category-nath.webp",            href: "/collections/sale?category=nath",      tag: "Traditional" },
  { label: "Bangles",    discount: "Up to 20% Off", image: "/assets/category-bangles.webp",         href: "/collections/sale?category=bangles",   tag: "Stack Faves" },
  { label: "Bracelets",  discount: "Up to 15% Off", image: "/assets/category-bracelet-hero.png",    href: "/collections/bracelet",                tag: "Trending" },
  { label: "Rakhi",      discount: "Up to 10% Off", image: "/assets/rakhi-collection.webp",         href: "/collections/rakhis",                  tag: "Festival" },
];

type SlotPhase = "idle" | "leaving" | "entering";
interface Slot { cat: typeof ALL_CATEGORIES[number]; phase: SlotPhase; }

const SLOT_COUNT  = 3;
const INTERVAL_MS = 3000;
const FADE_MS     = 420;

export function ArchivalCollection() {
  const [slots, setSlots] = useState<Slot[]>([
    { cat: ALL_CATEGORIES[0], phase: "idle" },
    { cat: ALL_CATEGORIES[1], phase: "idle" },
    { cat: ALL_CATEGORIES[2], phase: "idle" },
  ]);

  const nextCatRef  = useRef(SLOT_COUNT);
  const nextSlotRef = useRef(0);
  const hoveredRef  = useRef<number | null>(null);

  useEffect(() => {
    const cycle = () => {
      if (hoveredRef.current === nextSlotRef.current) return;
      const slotIdx = nextSlotRef.current;
      const newCat  = ALL_CATEGORIES[nextCatRef.current % ALL_CATEGORIES.length];

      setSlots(prev => prev.map((s, i) => i === slotIdx ? { ...s, phase: "leaving" } : s));

      setTimeout(() => {
        setSlots(prev => prev.map((s, i) => i === slotIdx ? { cat: newCat, phase: "entering" } : s));
        nextCatRef.current  = (nextCatRef.current  + 1) % ALL_CATEGORIES.length;
        nextSlotRef.current = (nextSlotRef.current + 1) % SLOT_COUNT;
      }, FADE_MS);

      setTimeout(() => {
        setSlots(prev => prev.map((s, i) => i === slotIdx ? { ...s, phase: "idle" } : s));
      }, FADE_MS * 2);
    };

    const id = setInterval(cycle, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sale-section">
      <div className="sale-beam-track" aria-hidden="true"><div className="sale-beam" /></div>
      <div className="sale-rule sale-rule-top" aria-hidden="true" />

      <div className="container-shell">
        <div className="sale-header">
          <div className="sale-title-row">
            <span className="sale-ornament-line" />
            <h2 className="display-font sale-title">The Grand Sales for All Sundaris</h2>
            <span className="sale-ornament-line" />
          </div>
          <p className="sale-subtitle">
            Exquisite pieces from our finest collections — now at extraordinary savings.
          </p>
        </div>

        <div className="sale-cat-grid">
          {slots.map((slot, i) => (
            <Link
              key={i}
              href={slot.cat.href as any}
              className="sale-cat-card"
              onMouseEnter={() => { hoveredRef.current = i; }}
              onMouseLeave={() => { hoveredRef.current = null; }}
              style={slot.phase !== "idle" ? {
                opacity: slot.phase === "leaving" ? 0 : 1,
                transition: "opacity 0.42s ease",
                pointerEvents: slot.phase === "leaving" ? "none" : undefined,
              } : undefined}
            >
              <Image
                src={slot.cat.image}
                alt={slot.cat.label}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="sale-cat-img"
              />
              <div className="sale-cat-overlay" aria-hidden="true" />
              <div className="sale-cat-content">
                <span className="sale-cat-tag">{slot.cat.tag}</span>
                <h3 className="sale-cat-label">{slot.cat.label}</h3>
                <span className="sale-cat-discount">{slot.cat.discount}</span>
                <span className="sale-cat-cta">
                  Shop Now
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="sale-rule sale-rule-bottom" aria-hidden="true" />
    </section>
  );
}
