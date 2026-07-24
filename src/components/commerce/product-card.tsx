"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { Eye, Heart, Sparkles } from "lucide-react";
import type { Product } from "@/types/commerce";
import { formatPrice } from "@/lib/seo";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { AddToCartButton } from "./add-to-cart-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { customer } = useCustomerAuth();
  const wishlist = useWishlist();
  const hasMarkdown = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discount = hasMarkdown && product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const saved = wishlist.isSaved(product.id);

  function handleWishlist() {
    if (!customer) {
      router.push(`/signin?next=${encodeURIComponent(pathname)}` as Route);
      return;
    }
    wishlist.toggle(product.id);
  }

  return (
    <article
      className="group relative overflow-hidden rounded-sm transition duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(201,169,110,0.05)",
        border: "1px solid rgba(201,169,110,0.18)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <button
        type="button"
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        title={saved ? "Saved to wishlist" : "Save to wishlist"}
        onClick={handleWishlist}
        className="focus-ring absolute right-1.5 top-1.5 z-20 grid size-8 place-items-center rounded-full border bg-[rgba(24,6,6,0.85)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out hover:scale-110 active:scale-95 md:right-3 md:top-3 md:size-10"
        style={{
          borderColor: saved ? "rgba(220,38,38,0.6)" : "rgba(255,255,255,0.25)",
          color: saved ? "rgb(220,38,38)" : "white",
        }}
      >
        <Heart
          size={15}
          strokeWidth={1.8}
          fill={saved ? "rgb(220,38,38)" : "none"}
          className={saved ? "drop-shadow-[0_0_8px_rgba(220,38,38,0.7)]" : ""}
        />
      </button>
      <Link href={`/products/${product.slug}` as Route} className="block">
        <div className="relative aspect-square overflow-hidden md:aspect-[4/5]" style={{ background: "rgba(201,169,110,0.07)" }}>
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 50% 18%, rgba(240,221,176,0.72), transparent 42%), linear-gradient(180deg, rgba(255,251,245,0), rgba(155,28,28,0.1))",
            }}
          />
          {product.badge ? (
            <span
              className="absolute left-1.5 top-1.5 z-10 max-w-[calc(100%-42px)] truncate rounded-sm px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.08em] md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.14em]"
              style={{ background: "var(--bg-dark)", color: "var(--gold)" }}
            >
              {product.badge}
            </span>
          ) : null}
          {hasMarkdown ? (
            <span
              className="absolute bottom-1.5 right-1.5 z-10 rounded-sm px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.08em] md:bottom-3 md:right-3 md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.14em]"
              style={{ background: "var(--ruby)", color: "white" }}
            >
              {discount}% off
            </span>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span
            className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] opacity-0 shadow-[0_12px_28px_rgba(14,4,4,0.24)] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ borderColor: "rgba(201,169,110,0.36)", background: "rgba(24,6,6,0.9)", color: "var(--gold-pale)" }}
          >
            <Eye size={14} />
            View
          </span>
        </div>
      </Link>
      <div className="grid gap-2 p-2 md:gap-4 md:p-4">
        <div>
          <p className="hidden max-w-full items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] md:inline-flex" style={{ color: "var(--gold-dim)" }}>
            <Sparkles className="shrink-0" size={9} />
            {product.material} / {product.stone}
          </p>
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug md:mt-1.5 md:text-base" style={{ color: "var(--cream)" }}>{product.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-1 md:mt-2 md:gap-2">
            <p className="text-xs font-bold md:text-sm" style={{ color: "var(--cream)" }}>{formatPrice(product.price)}</p>
            {hasMarkdown && product.originalPrice ? (
              <p className="text-[9px] font-medium line-through md:text-xs" style={{ color: "rgba(245,230,200,0.38)" }}>
                {formatPrice(product.originalPrice)}
              </p>
            ) : null}
          </div>
        </div>
        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          productName={product.name}
          image={product.image}
          material={product.material}
          price={product.price}
        />
      </div>
    </article>
  );
}
