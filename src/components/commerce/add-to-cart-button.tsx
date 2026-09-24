"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

interface Props {
  slug:        string;
  productName: string;
}

// Quick-add on product cards intentionally routes to the product page so the shopper
// can select size / colour and we can capture the exact Shopify variantId. Adding to
// cart directly from the listing would produce orphan line items on Shopify (no
// variant, no inventory tracking, no weight for Delhivery).
export function AddToCartButton({ slug, productName }: Props) {
  return (
    <Link
      href={`/products/${slug}` as Route}
      className="focus-ring inline-flex h-10 w-full items-center justify-center gap-1 rounded-sm px-1.5 text-[8px] font-bold uppercase tracking-[0.08em] transition-all duration-200 md:h-12 md:gap-2 md:px-2 md:text-[11px] md:tracking-[0.22em]"
      style={{ background: "var(--bg-dark)", color: "var(--gold-pale)" }}
      aria-label={`Shop ${productName}`}
    >
      <ShoppingBag className="shrink-0" size={13} />
      Shop Now
    </Link>
  );
}
