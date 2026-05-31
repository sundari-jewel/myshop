"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductGrid } from "@/components/commerce/product-grid";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { products } from "@/data/catalog";

export default function WishlistPage() {
  const router = useRouter();
  const { customer, ready } = useCustomerAuth();
  const { items, clearWishlist } = useWishlist();
  const savedProducts = products.filter((product) => items.includes(product.id));

  if (!ready) return null;

  if (!customer) {
    router.replace("/signin?next=/wishlist" as Route);
    return null;
  }

  return (
    <div className="bg-[var(--surface)]">
      <div className="container-shell py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--ruby)]">
              <Heart size={16} />
              Wishlist
            </p>
            <h1 className="display-font mt-3 text-5xl font-semibold">Saved Jewellery</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {savedProducts.length} {savedProducts.length === 1 ? "piece" : "pieces"} saved to your account.
            </p>
          </div>
          {savedProducts.length > 0 ? (
            <button
              type="button"
              onClick={clearWishlist}
              className="focus-ring inline-flex h-11 items-center justify-center rounded-sm border px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ruby)]"
              style={{ borderColor: "rgba(155,28,28,0.24)" }}
            >
              Clear wishlist
            </button>
          ) : null}
        </div>

        {savedProducts.length > 0 ? (
          <ProductGrid products={savedProducts} />
        ) : (
          <div className="grid min-h-[360px] place-items-center border bg-[var(--surface-card)] px-6 text-center" style={{ borderColor: "rgba(138,106,58,0.18)" }}>
            <div>
              <Heart className="mx-auto text-[var(--gold-dim)]" size={34} />
              <h2 className="display-font mt-4 text-4xl font-semibold">Your wishlist is waiting</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
                Save pieces from the catalogue and they will stay here whenever you sign in.
              </p>
              <Link
                href={"/products" as Route}
                className="focus-ring mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[var(--bg-dark)] px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold-pale)]"
              >
                <ShoppingBag size={15} />
                Browse Jewellery
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
