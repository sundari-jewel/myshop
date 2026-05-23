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
      className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--surface-deep)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--ruby)]"
      type="button"
      aria-label={`Add ${productName} to cart`}
      onClick={() => setAdded(true)}
    >
      <ShoppingBag size={17} />
      {added ? "Added" : "Add"}
    </button>
  );
}
