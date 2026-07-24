"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";

interface Props {
  productId: string;
  slug: string;
  productName: string;
  image: string;
  material: string;
  price: number;
  selectedSize?: string;
  requiresSize?: boolean;
}

export function AddToCartButton({ productId, slug, productName, image, material, price, selectedSize, requiresSize }: Props) {
  const { addItem } = useCart();
  const { customer } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!customer) {
      router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (requiresSize && !selectedSize) return;

    addItem({ productId, slug, name: productName, image, material, price, qty: 1, size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className="focus-ring inline-flex h-10 w-full items-center justify-center gap-1 rounded-sm px-1.5 text-[8px] font-bold uppercase tracking-[0.08em] transition-all duration-200 md:h-12 md:gap-2 md:px-2 md:text-[11px] md:tracking-[0.22em]"
      style={{ background: added ? "var(--ruby)" : "var(--bg-dark)", color: "var(--gold-pale)" }}
      aria-label={`Add ${productName} to cart`}
    >
      {added ? <Check className="shrink-0" size={13} /> : <ShoppingBag className="shrink-0" size={13} />}
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
