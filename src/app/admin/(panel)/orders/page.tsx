"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const STATUSES        = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

type Status        = typeof STATUSES[number];
type PaymentStatus = typeof PAYMENT_STATUSES[number];

const STATUS_COLORS: Record<string, string> = {
  pending:    "text-yellow-400 bg-yellow-400/10",
  confirmed:  "text-blue-400 bg-blue-400/10",
  processing: "text-purple-400 bg-purple-400/10",
  shipped:    "text-indigo-400 bg-indigo-400/10",
  delivered:  "text-emerald-400 bg-emerald-400/10",
  cancelled:  "text-red-400 bg-red-400/10",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending:  "text-yellow-400",
  paid:     "text-emerald-400",
  failed:   "text-red-400",
  refunded: "text-purple-400",
};

interface Order {
  _id:            string;
  orderId:        string;
  customer: {
    name:    string;
    email:   string;
    phone:   string;
    address: {
      line1:   string;
      line2?:  string;
      city:    string;
      state:   string;
      pincode: string;
    };
  };
  items:          { name: string; qty: number; price: number }[];
  subtotal:       number;
  shippingCharge: number;
  total:          number;
  status:         string;
  paymentMethod:  string;
  paymentStatus:  string;
  createdAt:      string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [filterStatus, setFilterStatus] = useState<Status>("");
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [page,         setPage]         = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function load(status: Status, pg: number) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg) });
    if (status) params.set("status", status);
    const res  = await fetch(`/api/admin/orders?${params}`);
    const data = (res.ok ? await res.json() : { items: [], total: 0 }) as { items: Order[]; total: number };
    setOrders(data.items);
    setTotal(data.total);
    setLoading(false);
  }

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
    load(filterStatus, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  // Load when page changes (but not on initial render which is handled above)
  useEffect(() => {
    if (page !== 1) load(filterStatus, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function updateOrder(id: string, patch: { status?: string; paymentStatus?: PaymentStatus }) {
    await fetch(`/api/admin/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(patch),
    });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, ...patch } : o));
  }

  return (
    <div className="p-4 sm:p-8" style={{ color: "var(--cream)" }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-[var(--gold)]">Orders</h1>
          <p className="mt-1 text-sm text-[var(--cream-muted)]">{total} total</p>
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as Status)}
            className="admin-input appearance-none pr-8 capitalize"
            style={{ width: "160px" }}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s || "All Status"}</option>)}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gold-dim)]" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[var(--gold)]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl py-20 text-center" style={{ background: "var(--bg-dark)", border: "1px solid rgba(138,106,58,0.15)" }}>
          <p className="text-[var(--cream-muted)]">No orders yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order._id} className="overflow-hidden rounded-xl" style={{ background: "var(--bg-dark)", border: "1px solid rgba(138,106,58,0.18)" }}>

                {/* Header row */}
                <button
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-2 px-4 py-4 text-left sm:flex sm:gap-4 sm:px-6"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <code className="shrink-0 text-xs font-semibold text-[var(--gold)]">{order.orderId}</code>
                  <span className="min-w-0 truncate text-sm text-[var(--cream)] sm:flex-1">{order.customer.name}</span>
                  <span className="text-sm font-medium text-[var(--cream)]">{formatPrice(order.total)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${STATUS_COLORS[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                  <span className="hidden text-xs text-[var(--cream-muted)] sm:inline">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-[var(--cream-muted)] transition-transform ${expanded === order._id ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Expanded detail */}
                {expanded === order._id && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6" style={{ borderTop: "1px solid rgba(138,106,58,0.1)" }}>

                    {/* Info grid */}
                    <div className="mt-5 grid gap-6 md:grid-cols-3">

                      {/* Customer contact */}
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-dim)]">Customer</p>
                        <p className="text-sm font-medium text-[var(--cream)]">{order.customer.name}</p>
                        <p className="text-xs text-[var(--cream-muted)]">{order.customer.email}</p>
                        <p className="text-xs text-[var(--cream-muted)]">{order.customer.phone}</p>
                      </div>

                      {/* Shipping address */}
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-dim)]">Ship To</p>
                        <p className="text-sm text-[var(--cream)]">{order.customer.address.line1}</p>
                        {order.customer.address.line2 && (
                          <p className="text-sm text-[var(--cream)]">{order.customer.address.line2}</p>
                        )}
                        <p className="text-xs text-[var(--cream-muted)]">
                          {order.customer.address.city}, {order.customer.address.state} — {order.customer.address.pincode}
                        </p>
                      </div>

                      {/* Items + price breakdown */}
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-dim)]">Items</p>
                        {order.items.map((item, i) => (
                          <p key={i} className="text-sm text-[var(--cream)]">
                            {item.name} × {item.qty} — {formatPrice(item.price * item.qty)}
                          </p>
                        ))}
                        <div className="mt-3 space-y-0.5 border-t pt-2" style={{ borderColor: "rgba(138,106,58,0.15)" }}>
                          <p className="text-xs text-[var(--cream-muted)]">Subtotal: {formatPrice(order.subtotal)}</p>
                          <p className="text-xs text-[var(--cream-muted)]">Shipping: {formatPrice(order.shippingCharge)}</p>
                          <p className="text-sm font-semibold text-[var(--cream)]">Total: {formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status controls */}
                    <div
                      className="mt-5 flex flex-wrap items-center gap-6"
                      style={{ borderTop: "1px solid rgba(138,106,58,0.1)", paddingTop: "1.25rem" }}
                    >
                      {/* Order status */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-dim)]">Order Status</span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => updateOrder(order._id, { status: e.target.value })}
                            className="admin-input appearance-none pr-8 capitalize"
                            style={{ width: "160px" }}
                          >
                            {STATUSES.filter(s => s !== "").map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gold-dim)]" />
                        </div>
                      </div>

                      {/* Payment status */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-dim)]">Payment</span>
                        <div className="relative">
                          <select
                            value={order.paymentStatus}
                            onChange={e => updateOrder(order._id, { paymentStatus: e.target.value as PaymentStatus })}
                            className="admin-input appearance-none pr-8 capitalize"
                            style={{ width: "140px" }}
                          >
                            {PAYMENT_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gold-dim)]" />
                        </div>
                        <span className={`text-xs font-medium capitalize ${PAYMENT_COLORS[order.paymentStatus] ?? ""}`}>
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm disabled:opacity-40"
                style={{ background: "var(--bg-dark)", border: "1px solid rgba(138,106,58,0.2)", color: "var(--cream-muted)" }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-sm text-[var(--cream-muted)]">
                Page <span className="font-semibold text-[var(--cream)]">{page}</span> of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm disabled:opacity-40"
                style={{ background: "var(--bg-dark)", border: "1px solid rgba(138,106,58,0.2)", color: "var(--cream-muted)" }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
