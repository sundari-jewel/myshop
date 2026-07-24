"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function CartDrawer() {
  const { items, count, subtotal, open, removeItem, updateQty, setOpen } = useCart();
  const { customer } = useCustomerAuth();
  const [pendingRemoval, setPendingRemoval] = useState<{
    productId: string;
    size?: string;
    name: string;
  } | null>(null);

  if (!open) return null;

  const shipping = subtotal >= 50000 ? 0 : 1;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button className="absolute inset-0 w-full cursor-default bg-black/70 backdrop-blur-sm" aria-label="Close cart" onClick={() => setOpen(false)} />

      {/* Panel */}
      <aside
        className="absolute right-0 top-0 flex h-full w-[92vw] max-w-sm flex-col pb-[env(safe-area-inset-bottom)] md:w-full md:max-w-md"
        style={{
          backgroundColor: "var(--bg-dark)",
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(201,169,110,0.1), transparent 36%), linear-gradient(180deg, rgba(42,14,14,0.35), transparent 28%)",
          borderLeft: "1px solid rgba(201,169,110,0.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 md:px-6 md:py-5" style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>Your Cart</p>
            <h2 className="display-font mt-0.5 text-xl font-semibold md:text-2xl" style={{ color: "var(--cream)" }}>
              {count} {count === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="grid size-8 place-items-center rounded-full transition-colors hover:bg-[rgba(201,169,110,0.12)] md:size-9"
            style={{ border: "1px solid rgba(201,169,110,0.38)", color: "var(--gold-pale)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center md:gap-4 md:py-16">
              <div
                className="grid size-12 place-items-center rounded-full md:size-16"
                style={{ border: "1px solid rgba(201,169,110,0.3)", background: "rgba(201,169,110,0.06)" }}
              >
                <ShoppingBag className="size-6 md:size-[30px]" strokeWidth={1.2} style={{ color: "var(--gold)" }} />
              </div>
              <p className="display-font text-xl font-semibold md:text-2xl" style={{ color: "var(--cream)" }}>Your cart is empty</p>
              <p className="text-xs md:text-sm" style={{ color: "var(--cream-muted)" }}>Add a piece to begin your collection.</p>
              <Link
                href={"/products" as Route}
                onClick={() => setOpen(false)}
                className="mt-1 rounded-sm px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-[var(--gold-light)] md:mt-2 md:px-6 md:py-3 md:text-[10px] md:tracking-[0.22em]"
                style={{ background: "var(--gold)", color: "var(--bg-deep)" }}
              >
                Browse Jewellery
              </Link>
            </div>
          ) : (
            <ul className="space-y-4 md:space-y-5">
              {items.map(item => (
                <li key={`${item.productId}-${item.size ?? ""}`} className="flex gap-3 sm:gap-4">
                  {/* Image */}
                  <div
                    className="relative h-[70px] w-14 shrink-0 overflow-hidden rounded-sm md:h-24 md:w-20"
                    style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.16)" }}
                  >
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em]" style={{ color: "var(--gold-dim)" }}>{item.material}</p>
                        <p className="mt-0.5 text-sm font-semibold leading-snug" style={{ color: "var(--cream)" }}>{item.name}</p>
                        {item.size && <p className="mt-0.5 text-[11px]" style={{ color: "var(--cream-muted)" }}>Size: {item.size}</p>}
                      </div>
                      <button
                        onClick={() => setPendingRemoval({ productId: item.productId, size: item.size, name: item.name })}
                        className="mt-0.5 shrink-0 transition-colors hover:text-[var(--gold)]"
                        style={{ color: "var(--cream-muted)" }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex items-center gap-2 rounded-sm" style={{ border: "1px solid rgba(201,169,110,0.28)" }}>
                        <button className="px-2.5 py-1 text-sm transition-colors hover:text-[var(--gold)]" style={{ color: "var(--cream-muted)" }}
                          onClick={() => item.qty === 1
                            ? setPendingRemoval({ productId: item.productId, size: item.size, name: item.name })
                            : updateQty(item.productId, item.size, item.qty - 1)}>
                          <Minus size={11} />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold" style={{ color: "var(--cream)" }}>{item.qty}</span>
                        <button className="px-2.5 py-1 text-sm transition-colors hover:text-[var(--gold)]" style={{ color: "var(--cream-muted)" }}
                          onClick={() => updateQty(item.productId, item.size, item.qty + 1)}>
                          <Plus size={11} />
                        </button>
                      </div>
                      <p className="display-font text-base font-semibold" style={{ color: "var(--gold-pale)" }}>
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-3 py-3 md:px-6 md:py-5" style={{ borderTop: "1px solid rgba(201,169,110,0.2)", background: "rgba(14,4,4,0.4)" }}>
            <div className="mb-3 space-y-1.5 text-sm">
              <div className="flex justify-between" style={{ color: "var(--cream-muted)" }}>
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: "var(--cream-muted)" }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold" style={{ borderColor: "rgba(201,169,110,0.2)", color: "var(--cream)" }}>
                <span>Total</span><span className="display-font text-lg">{formatPrice(subtotal + shipping)}</span>
              </div>
            </div>

            <Link href={(customer ? "/checkout" : "/signin?next=/checkout") as Route}
              onClick={() => setOpen(false)}
              className="block w-full py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.26em] transition-opacity hover:opacity-90"
              style={{ background: "var(--gold)", color: "var(--bg-deep)" }}>
              Checkout
            </Link>
            <button onClick={() => setOpen(false)}
              className="mt-2 w-full py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold)]"
              style={{ color: "var(--cream-muted)" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      <ConfirmationDialog
        open={pendingRemoval !== null}
        title="Remove this piece?"
        description={pendingRemoval
          ? `${pendingRemoval.name} will be removed from your cart.`
          : "This item will be removed from your cart."}
        confirmLabel="Remove"
        tone="danger"
        onCancel={() => setPendingRemoval(null)}
        onConfirm={() => {
          if (!pendingRemoval) return;
          removeItem(pendingRemoval.productId, pendingRemoval.size);
          setPendingRemoval(null);
        }}
      />
    </div>
  );
}
