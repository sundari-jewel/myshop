"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";

type AddToCartButtonProps = {
  productName: string;
};

export function AddToCartButton({ productName }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  return (
    <button
      className="focus-ring inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-pale)] transition-colors duration-200 hover:bg-[var(--ruby)]"
      style={{ background: "var(--bg-dark)" }}
      type="button"
      aria-label={`Add ${productName} to cart`}
      onClick={() => setAdded(true)}
    >
      <ShoppingBag size={17} />
      {added ? "Added" : "Add"}
    </button>
  );
}
