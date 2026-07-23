"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Heart, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice } from "@/lib/seo";

export default function AccountPage() {
  const router = useRouter();
  const { customer, ready, signOut } = useCustomerAuth();
  const { count, subtotal } = useCart();
  const wishlist = useWishlist();

  if (!ready) return null;

  if (!customer) {
    router.replace("/signin?next=/account" as Route);
    return null;
  }

  async function handleSignOut() {
    await signOut();
    router.push("/signin" as Route);
  }

  return (
    <div className="bg-[var(--surface)]">
      <div className="container-shell py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--ruby)]">
              <UserRound size={16} />
              Account
            </p>
            <h1 className="display-font mt-3 text-5xl font-semibold">Hello, {customer.name.split(" ")[0]}</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{customer.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-sm border px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ruby)]"
            style={{ borderColor: "rgba(155,28,28,0.24)" }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <AccountCard
            icon={<ShoppingBag size={20} />}
            title="Cart"
            value={`${count} ${count === 1 ? "item" : "items"}`}
            detail={`Current subtotal ${formatPrice(subtotal)}`}
            href="/checkout"
            action="Go to checkout"
          />
          <AccountCard
            icon={<Heart size={20} />}
            title="Wishlist"
            value={`${wishlist.count} saved`}
            detail="Keep favourites ready for your next visit."
            href="/wishlist"
            action="View wishlist"
          />
          <div className="border bg-[var(--surface-card)] p-5 shadow-[0_18px_50px_rgba(82,45,12,0.08)]" style={{ borderColor: "rgba(138,106,58,0.18)" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--gold-dim)]">Profile</p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-[var(--ink-soft)]">Name</dt>
                <dd className="font-semibold">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-soft)]">Phone</dt>
                <dd className="font-semibold">{customer.phone || "Not added"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountCard({
  icon,
  title,
  value,
  detail,
  href,
  action,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  detail: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href as Route}
      className="focus-ring group border bg-[var(--surface-card)] p-5 shadow-[0_18px_50px_rgba(82,45,12,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(82,45,12,0.14)]"
      style={{ borderColor: "rgba(138,106,58,0.18)" }}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-sm bg-[var(--bg-dark)] text-[var(--gold-pale)]">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ruby)]">{action}</span>
      </div>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--gold-dim)]">{title}</p>
      <h2 className="display-font mt-1 text-4xl font-semibold">{value}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{detail}</p>
    </Link>
  );
}
