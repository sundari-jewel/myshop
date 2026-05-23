"use client";

import { X } from "lucide-react";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/35" role="dialog" aria-modal="true">
      <button className="absolute inset-0 size-full cursor-default" aria-label="Close cart" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ruby)]">
              Cart
            </p>
            <h2 className="display-font text-3xl font-semibold">Your selection</h2>
          </div>
          <button
            aria-label="Close cart"
            className="focus-ring grid size-10 place-items-center rounded-full border border-[var(--line)]"
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="display-font text-2xl font-semibold">A polished cart is ready.</p>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
            Product actions are wired as client components. The next step is connecting this drawer
            to inventory, variants, and checkout.
          </p>
        </div>
      </aside>
    </div>
  );
}
