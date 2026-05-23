import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SectionHeader } from "@/components/ui/section-header";

const PRODUCTS = [
  {
    id: 1,
    name: "Aarohi Temple Necklace",
    price: "Rs.1,89,000",
    originalPrice: "Rs.2,10,000",
    tag: "Bestseller",
    image: "/assets/image_24.png",
    href: "/products/aarohi-temple-necklace",
    metal: "22K Gold",
  },
  {
    id: 2,
    name: "Meera Pearl Choker",
    price: "Rs.1,46,500",
    originalPrice: null,
    tag: null,
    image: "/assets/image_24_2.png",
    href: "/products/meera-pearl-choker",
    metal: "18K Gold",
  },
  {
    id: 3,
    name: "Noor Diamond Hoops",
    price: "Rs.78,000",
    originalPrice: "Rs.92,000",
    tag: "New",
    image: "/assets/image_24_3.png",
    href: "/products/noor-diamond-hoops",
    metal: "18K Gold",
  },
  {
    id: 4,
    name: "Vanya Polki Earrings",
    price: "Rs.98,500",
    originalPrice: null,
    tag: "Signature",
    image: "/assets/image_24_4.png",
    href: "/products/vanya-polki-drops",
    metal: "22K Gold",
  },
  {
    id: 5,
    name: "Tara Everyday Kada",
    price: "Rs.64,200",
    originalPrice: "Rs.72,000",
    tag: null,
    image: "/assets/image_24_5.png",
    href: "/products/tara-everyday-kada",
    metal: "22K Gold",
  },
] as const;

export function ArchivalCollection() {
  return (
    <section className="py-16" style={{ background: "var(--surface)" }}>
      <div className="container-shell">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <SectionHeader title="The Archival Edit Collection" />
            <p
              className="mt-3 text-sm text-center sm:text-left"
              style={{ color: "var(--ink-soft)" }}
            >
              Pieces that transcend seasons - curated for the discerning collector.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.25em] group focus-ring"
            style={{ color: "var(--gold-dim)" }}
          >
            View All
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&#8250;</span>
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={product.href as Route}
              className="group"
            >
              <article>
                {/* Image container */}
                <div
                  className="relative overflow-hidden mb-3"
                  style={{ aspectRatio: "3/4", background: "var(--surface-warm)", borderRadius: "4px" }}
                >
                  {product.tag && (
                    <span
                      className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5"
                      style={{
                        background: "var(--bg-dark)",
                        color: "var(--gold)",
                        borderRadius: "2px",
                      }}
                    >
                      {product.tag}
                    </span>
                  )}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Wishlist hover button */}
                  <button
                    type="button"
                    aria-label={"Add " + product.name + " to wishlist"}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 size-8 rounded-full grid place-items-center"
                    style={{ background: "rgba(255,255,255,0.9)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ruby)" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Product info */}
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.16em] mb-1 font-medium"
                    style={{ color: "var(--gold-dim)" }}
                  >
                    {product.metal}
                  </p>
                  <h3
                    className="text-sm font-semibold leading-snug mb-1.5 transition-colors duration-200 group-hover:text-[var(--ruby)]"
                    style={{ color: "var(--foreground)" }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="display-font text-base font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span
                        className="text-xs line-through"
                        style={{ color: "var(--cream-muted)" }}
                      >
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-ghost-gold focus-ring text-sm">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
