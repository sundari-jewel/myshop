"use client";

import { ExternalLink, Heart, MapPin, ShoppingBag, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";

const STORE = {
  name: "Sundari Art Jewellery",
  lines: ["Mangalam, 72 Lakherwadi", "Ujjain, Madhya Pradesh"],
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mangalam+72+Lakherwadi+Ujjain+Madhya+Pradesh",
};

type ProductActionsProps = {
  productId: string;
  slug: string;
  productName: string;
  image: string;
  material: string;
  price: number;
  sizes?: string[];
};

export function ProductActions({ productId, slug, productName, image, material, price, sizes }: ProductActionsProps) {
  const { addItem } = useCart();
  const { customer } = useCustomerAuth();
  const wishlist = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty,          setQty]          = useState(1);
  const [added,        setAdded]        = useState(false);
  const [sizeError,    setSizeError]    = useState(false);
  const [pickupOpen,   setPickupOpen]   = useState(false);
  const pickupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickupOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) {
        setPickupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickupOpen]);

  const saved = wishlist.isSaved(productId);

  function requireAuth() {
    router.push(`/signin?next=${encodeURIComponent(pathname)}`);
  }

  function handleAddToCart() {
    if (!customer) { requireAuth(); return; }
    if (sizes?.length && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    for (let i = 0; i < qty; i++) {
      addItem({ productId, slug, name: productName, image, material, price, qty: 1, size: selectedSize ?? undefined });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleBuyNow() {
    if (!customer) { requireAuth(); return; }
    if (sizes?.length && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem({ productId, slug, name: productName, image, material, price, qty, size: selectedSize ?? undefined });
    router.push("/checkout");
  }

  function handleWishlist() {
    if (!customer) { requireAuth(); return; }
    wishlist.toggle(productId);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Size selector */}
      {sizes && sizes.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--cream)" }}>Bangle Size</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map(s => (
              <button key={s} type="button" onClick={() => { setSelectedSize(s); setSizeError(false); }}
                className="h-9 w-9 rounded-sm text-sm font-medium transition-all duration-150"
                style={{
                  border:      selectedSize === s ? "1.5px solid var(--gold)" : "1.5px solid rgba(138,106,58,0.3)",
                  background:  selectedSize === s ? "var(--gold)" : "transparent",
                  color:       selectedSize === s ? "var(--bg-dark)" : "var(--foreground)",
                }}>
                {s}
              </button>
            ))}
          </div>
          {sizeError && <p className="mt-1.5 text-[11px]" style={{ color: "var(--ruby)" }}>Please select a size</p>}
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--cream)" }}>Qty</span>
        <div className="flex items-center overflow-hidden rounded-sm" style={{ border: "1.5px solid rgba(138,106,58,0.3)" }}>
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center text-lg text-[var(--cream)] transition-colors hover:bg-[rgba(201,169,110,0.12)]">−</button>
          <span className="flex h-9 w-10 items-center justify-center text-sm font-semibold text-[var(--cream)]">{qty}</span>
          <button type="button" onClick={() => setQty(q => q + 1)} className="flex h-9 w-9 items-center justify-center text-lg text-[var(--cream)] transition-colors hover:bg-[rgba(201,169,110,0.12)]">+</button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button type="button" onClick={handleAddToCart}
          className="focus-ring flex items-center justify-center gap-2.5 rounded-sm text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-200"
          style={{ height: 52, background: added ? "var(--ruby)" : "var(--bg-dark)", color: "var(--gold-pale)" }}>
          <ShoppingBag size={16} strokeWidth={1.8} />
          {added ? "Added to Cart" : "Add to Cart"}
        </button>

        <button type="button" onClick={handleBuyNow}
          className="focus-ring flex items-center justify-center gap-2.5 rounded-sm border text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] transition-colors duration-200 hover:bg-[var(--gold)] hover:text-[var(--bg-dark)]"
          style={{ height: 52, border: "1.5px solid var(--gold)" }}>
          <Zap size={15} strokeWidth={1.8} />
          Buy Now
        </button>
      </div>

      {/* Wishlist */}
      <button type="button" onClick={handleWishlist}
        className="flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.18em] transition-colors"
        style={{ color: saved ? "var(--ruby)" : "var(--cream-muted)" }}>
        <Heart size={14} strokeWidth={1.8} fill={saved ? "var(--ruby)" : "none"} />
        {saved ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>

      {/* Store Pickup */}
      <div ref={pickupRef} className="relative self-start">
        <button
          type="button"
          onClick={() => setPickupOpen(o => !o)}
          className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-[var(--gold)]"
          style={{ color: "var(--cream-muted)" }}
        >
          <MapPin size={14} strokeWidth={1.8} />
          Store Pickup Available
        </button>

        {pickupOpen && (
          <div
            className="absolute left-0 top-full z-30 mt-2 w-64 rounded-lg p-4 shadow-2xl"
            style={{ background: "var(--bg-dark)", border: "1px solid rgba(201,169,110,0.25)" }}
          >
            {/* Arrow */}
            <span
              className="absolute -top-1.5 left-4 h-3 w-3 rotate-45"
              style={{ background: "var(--bg-dark)", border: "1px solid rgba(201,169,110,0.25)", borderBottom: "none", borderRight: "none" }}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--gold)" }}>
              {STORE.name}
            </p>
            <div className="mt-2 space-y-0.5">
              {STORE.lines.map(line => (
                <p key={line} className="text-xs leading-5" style={{ color: "rgba(245,230,200,0.7)" }}>{line}</p>
              ))}
            </div>
            <p className="mt-2 text-[10px]" style={{ color: "rgba(245,230,200,0.45)" }}>
              Mon – Sun · 10:30 AM – 8:00 PM
            </p>
            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:text-[var(--gold-light)]"
              style={{ color: "var(--gold)" }}
            >
              <ExternalLink size={11} strokeWidth={2} />
              Get Directions
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
