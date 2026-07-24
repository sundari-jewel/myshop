"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Heart, LogOut, Package, ShoppingBag, UserRound } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice } from "@/lib/seo";

type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  material: string;
  price: number;
  qty: number;
  size?: string;
};

type Order = {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:    "rgba(201,169,110,0.15)",
  confirmed:  "rgba(34,197,94,0.15)",
  processing: "rgba(59,130,246,0.15)",
  shipped:    "rgba(168,85,247,0.15)",
  delivered:  "rgba(34,197,94,0.2)",
  cancelled:  "rgba(239,68,68,0.15)",
};

const STATUS_TEXT: Record<string, string> = {
  pending:    "rgba(201,169,110,1)",
  confirmed:  "rgb(134,239,172)",
  processing: "rgb(147,197,253)",
  shipped:    "rgb(216,180,254)",
  delivered:  "rgb(134,239,172)",
  cancelled:  "rgb(252,165,165)",
};

export default function AccountPage() {
  const router = useRouter();
  const { customer, ready, signOut } = useCustomerAuth();
  const { count, subtotal } = useCart();
  const wishlist = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => {
    if (!customer) return;
    fetch("/api/orders/my")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data); })
      .finally(() => setOrdersLoading(false));
  }, [customer]);

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
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      <div className="container-shell py-7 sm:py-14">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--ruby)]">
              <UserRound size={16} />
              Account
            </p>
            <h1 className="display-font mt-3 text-4xl font-semibold text-[var(--cream)] sm:text-5xl">Hello, {customer.name.split(" ")[0]}</h1>
            <p className="mt-2 text-sm text-[rgba(245,230,200,0.55)]">{customer.email}</p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-sm border px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ruby)]"
            style={{ borderColor: "rgba(155,28,28,0.24)" }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        {/* Quick action cards */}
        <div className="grid gap-3 sm:gap-5 md:grid-cols-3">
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
          <div
            className="border p-4 sm:p-5"
            style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.05)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--gold-dim)]">Profile</p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-[rgba(245,230,200,0.5)]">Name</dt>
                <dd className="font-semibold text-[var(--cream)]">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-[rgba(245,230,200,0.5)]">Phone</dt>
                <dd className="font-semibold text-[var(--cream)]">{customer.phone || "Not added"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <Package size={18} style={{ color: "var(--gold)" }} />
            <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">Order History</h2>
            <span className="flex-1 h-px" style={{ background: "rgba(201,169,110,0.18)" }} />
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-sm border py-16 text-center"
              style={{ borderColor: "rgba(201,169,110,0.15)", background: "rgba(201,169,110,0.03)" }}
            >
              <Package size={32} style={{ color: "rgba(201,169,110,0.4)" }} />
              <p className="text-sm text-[rgba(245,230,200,0.45)]">No orders yet. Start shopping to see your history here.</p>
              <Link
                href="/products"
                className="mt-2 inline-flex h-10 items-center gap-2 rounded-sm border px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--bg-dark)]"
                style={{ borderColor: "rgba(201,169,110,0.35)" }}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-sm border p-4 sm:p-5"
                  style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)" }}
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: "rgba(201,169,110,0.12)" }}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold-dim)]">Order</p>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--cream)]">#{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[rgba(245,230,200,0.45)]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[var(--cream)]">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                        style={{
                          background: STATUS_COLORS[order.status] ?? "rgba(201,169,110,0.1)",
                          color: STATUS_TEXT[order.status] ?? "var(--cream)",
                        }}
                      >
                        {order.status}
                      </span>
                      <span
                        className="rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                        style={{ background: "rgba(201,169,110,0.08)", color: "rgba(245,230,200,0.6)" }}
                      >
                        {order.paymentMethod === "cod" ? "Cash on delivery" : "Prepaid"}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 flex flex-col gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm"
                          style={{ background: "rgba(201,169,110,0.08)" }}
                        >
                          <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.slug}` as Route}
                            className="truncate text-sm font-semibold text-[var(--cream)] hover:text-[var(--gold)]"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[11px] text-[rgba(245,230,200,0.45)]">
                            {item.material}{item.size ? ` · Size ${item.size}` : ""} · Qty {item.qty}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-[var(--cream)]">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div
                      className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-sm border px-4 py-3"
                      style={{ borderColor: "rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.06)" }}
                    >
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(216,180,254)]">Tracking</p>
                        <p className="mt-0.5 font-mono text-xs text-[var(--cream)]">{order.trackingNumber}</p>
                      </div>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold uppercase tracking-[0.15em] text-[rgb(216,180,254)] hover:underline"
                        >
                          Track Shipment →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ConfirmationDialog
        open={confirmSignOut}
        title="Sign out of your account?"
        description="You will need to sign in again to access your orders and saved jewellery."
        confirmLabel="Sign out"
        onCancel={() => setConfirmSignOut(false)}
        onConfirm={handleSignOut}
      />
    </div>
  );
}

function AccountCard({
  icon, title, value, detail, href, action,
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
      className="focus-ring group border p-4 transition hover:-translate-y-1 sm:p-5"
      style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-sm bg-[var(--bg-dark)] text-[var(--gold-pale)]">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ruby)]">{action}</span>
      </div>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--gold-dim)]">{title}</p>
      <h2 className="display-font mt-1 text-3xl font-semibold text-[var(--cream)] sm:text-4xl">{value}</h2>
      <p className="mt-2 text-sm leading-6 text-[rgba(245,230,200,0.5)]">{detail}</p>
    </Link>
  );
}
