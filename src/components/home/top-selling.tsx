import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { Product } from "@/types/commerce";
import { formatPrice } from "@/lib/seo";

export function TopSelling({ products }: { products: Product[] }) {
  if (!products.length) return null;

  // Repeat enough times so the track is always wider than the viewport
  const repeatCount = Math.max(2, Math.ceil(12 / products.length));
  const items = Array.from({ length: repeatCount * 2 }, () => products).flat();

  return (
    <section className="overflow-hidden py-10 sm:py-16" style={{ background: "var(--bg-dark)" }}>
      <div className="container-shell mb-6 flex items-end justify-between sm:mb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">
            Community Favourites
          </p>
          <h2 className="display-font mt-2 text-3xl font-semibold italic text-[var(--gold)] sm:text-4xl">
            Top Selling
          </h2>
        </div>
        <Link
          href={"/collections/top-selling" as Route}
          className="inline-flex h-9 items-center gap-2 border px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--bg-dark)]"
          style={{ borderColor: "rgba(201,169,110,0.35)" }}
        >
          View All
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Scrolling track */}
      <div className="overflow-hidden">
        <div className="top-selling-track flex w-max gap-4 sm:gap-6">
          {items.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/products/${product.slug}` as Route}
              className="group relative w-44 shrink-0 overflow-hidden rounded-sm sm:w-56"
              style={{
                border: "1px solid rgba(201,169,110,0.18)",
                background: "rgba(201,169,110,0.04)",
              }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden" style={{ background: "rgba(201,169,110,0.07)" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="224px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <div
                    className="absolute left-0 top-0 z-10 flex h-12 w-12 items-start justify-start"
                    style={{
                      background: "var(--ruby)",
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                    }}
                  >
                    <span className="absolute left-1.5 top-1.5 text-[7px] font-black leading-none text-white">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%<br />OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--cream)] sm:text-sm">
                  {product.name}
                </p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-[var(--cream)]">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[9px] font-medium line-through" style={{ color: "rgba(245,230,200,0.38)" }}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
