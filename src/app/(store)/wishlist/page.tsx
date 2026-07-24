"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductGrid } from "@/components/commerce/product-grid";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";
import type { Product } from "@/types/commerce";

export default function WishlistPage() {
  const router = useRouter();
  const { customer, ready } = useCustomerAuth();
  const { items, clearWishlist } = useWishlist();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!items.length) { setSavedProducts([]); return; }
    setLoading(true);
    fetch(`/api/products?ids=${items.join(",")}`)
      .then((r) => r.json())
      .then((data: Product[]) => setSavedProducts(data))
      .catch(() => setSavedProducts([]))
      .finally(() => setLoading(false));
  }, [items]);

  if (!ready) return null;

  if (!customer) {
    router.replace("/signin?next=/wishlist" as Route);
    return null;
  }

  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "60vh" }}>
      <div className="container-shell py-7 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">
              <Heart size={16} />
              Wishlist
            </p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-5xl">Saved Jewellery</h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(245,230,200,0.55)" }}>
              {savedProducts.length} {savedProducts.length === 1 ? "piece" : "pieces"} saved to your account.
            </p>
          </div>
          {savedProducts.length > 0 ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="focus-ring inline-flex h-11 items-center justify-center rounded-sm border px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ruby)]"
              style={{ borderColor: "rgba(155,28,28,0.35)" }}
            >
              Clear wishlist
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="grid min-h-[360px] place-items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
          </div>
        ) : savedProducts.length > 0 ? (
          <ProductGrid products={savedProducts} />
        ) : (
          <div
            className="grid min-h-[360px] place-items-center border px-6 text-center"
            style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)" }}
          >
            <div>
              <Heart className="mx-auto text-[var(--gold-dim)]" size={34} />
              <h2 className="display-font mt-4 text-3xl font-semibold italic text-[var(--gold)] sm:text-4xl">Your wishlist is waiting</h2>
              <p className="mt-2 max-w-md text-sm leading-6" style={{ color: "rgba(245,230,200,0.55)" }}>
                Save pieces from the catalogue and they will stay here whenever you sign in.
              </p>
              <Link
                href={"/products" as Route}
                className="focus-ring mt-5 inline-flex h-11 items-center justify-center gap-2 border px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--bg-dark)]"
                style={{ borderColor: "rgba(201,169,110,0.35)" }}
              >
                <ShoppingBag size={15} />
                Browse Jewellery
              </Link>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={confirmClear}
        title="Clear your wishlist?"
        description="Every saved piece will be removed from your wishlist. This cannot be undone."
        confirmLabel="Clear wishlist"
        tone="danger"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearWishlist();
          setConfirmClear(false);
        }}
      />
    </div>
  );
}
