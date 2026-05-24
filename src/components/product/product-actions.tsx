"use client";

import { Heart, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";

type ProductActionsProps = {
  productName: string;
  sizes?: string[];
};

export function ProductActions({ productName, sizes }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes ? null : undefined as unknown as null
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  function handleAddToCart() {
    if (sizes && !selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Size selector */}
      {sizes && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--foreground)" }}>
              Ring Size
            </span>
            <button type="button" className="text-[11px] underline underline-offset-2" style={{ color: "var(--gold-dim)" }}>
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className="h-9 w-9 rounded-sm text-sm font-medium transition-all duration-150"
                style={{
                  border: selectedSize === s
                    ? "1.5px solid var(--gold)"
                    : "1.5px solid rgba(138,106,58,0.3)",
                  background: selectedSize === s ? "var(--gold)" : "transparent",
                  color: selectedSize === s ? "var(--bg-dark)" : "var(--foreground)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {sizes && !selectedSize && (
            <p className="mt-1.5 text-[11px]" style={{ color: "var(--ruby)" }}>
              Please select a size
            </p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--foreground)" }}>
          Qty
        </span>
        <div
          className="flex items-center overflow-hidden rounded-sm"
          style={{ border: "1.5px solid rgba(138,106,58,0.3)" }}
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-lg transition-colors hover:bg-[var(--surface-warm)]"
          >
            −
          </button>
          <span className="flex h-9 w-10 items-center justify-center text-sm font-semibold">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-lg transition-colors hover:bg-[var(--surface-warm)]"
          >
            +
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!!sizes && !selectedSize}
          className="focus-ring flex h-13 items-center justify-center gap-2.5 rounded-sm text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: added ? "var(--ruby)" : "var(--bg-dark)",
            color: "var(--gold-pale)",
            height: 52,
          }}
        >
          <ShoppingBag size={16} strokeWidth={1.8} />
          {added ? "Added to Cart" : "Add to Cart"}
        </button>

        <button
          type="button"
          className="focus-ring flex items-center justify-center gap-2.5 rounded-sm border text-[11px] font-bold uppercase tracking-[0.22em] transition-colors duration-200 hover:bg-[var(--gold)] hover:text-[var(--bg-dark)]"
          style={{
            height: 52,
            border: "1.5px solid var(--gold)",
            color: "var(--gold)",
          }}
        >
          <Zap size={15} strokeWidth={1.8} />
          Buy Now
        </button>
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={() => setWishlisted((w) => !w)}
        className="flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.18em] transition-colors"
        style={{ color: wishlisted ? "var(--ruby)" : "var(--ink-soft)" }}
      >
        <Heart
          size={14}
          strokeWidth={1.8}
          fill={wishlisted ? "var(--ruby)" : "none"}
        />
        {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}
