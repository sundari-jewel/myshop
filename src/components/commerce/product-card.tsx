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
        className="focus-ring absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full border bg-[rgba(24,6,6,0.85)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out hover:scale-125 active:scale-95"
        style={{
          borderColor: saved ? "rgba(220,38,38,0.6)" : "rgba(255,255,255,0.25)",
          color: saved ? "rgb(220,38,38)" : "white",
        }}
      >
        <Heart
          size={19}
          strokeWidth={1.8}
          fill={saved ? "rgb(220,38,38)" : "none"}
          className={saved ? "drop-shadow-[0_0_8px_rgba(220,38,38,0.7)]" : ""}
        />
      </button>
      <Link href={`/products/${product.slug}` as Route} className="block">
        <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "rgba(201,169,110,0.07)" }}>
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
              className="absolute left-3 top-3 z-10 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: "var(--bg-dark)", color: "var(--gold)" }}
            >
              {product.badge}
            </span>
          ) : null}
          {hasMarkdown ? (
            <span
              className="absolute right-3 top-3 z-10 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: "var(--ruby)", color: "white" }}
            >
              {discount}% off
            </span>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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
      <div className="grid gap-4 p-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--gold-dim)" }}>
            <Sparkles size={12} />
            {product.material} / {product.stone}
          </p>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug sm:text-base" style={{ color: "var(--cream)" }}>{product.name}</h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-sm font-bold" style={{ color: "var(--cream)" }}>{formatPrice(product.price)}</p>
            {hasMarkdown && product.originalPrice ? (
              <p className="text-xs font-medium line-through" style={{ color: "rgba(245,230,200,0.38)" }}>
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
