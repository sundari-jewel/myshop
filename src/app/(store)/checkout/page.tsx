"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Banknote, CreditCard, Loader2, LockKeyhole, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void };
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

interface AddressForm {
  name: string; email: string; phone: string;
  line1: string; line2: string; city: string; state: string; pincode: string;
  notes: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("rzp-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id  = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { customer, ready } = useCustomerAuth();
  const router = useRouter();
  const shipping = subtotal >= 50000 ? 0 : 1;

  const [method, setMethod]   = useState<"prepaid" | "cod" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState<AddressForm>({
    name: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
    notes: "",
  });

  function setField(key: keyof AddressForm, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  if (!ready) return null;

  if (!customer) {
    return (
      <div className="container-shell grid min-h-[60vh] place-items-center py-20 text-center">
        <div className="max-w-md">
          <LockKeyhole className="mx-auto text-[var(--gold-dim)]" size={34} />
          <h1 className="display-font mt-4 text-4xl font-semibold">Sign in to checkout</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
            Your cart is ready. Sign in or create an account to keep your order connected to your profile.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={"/signin?next=/checkout" as Route} className="btn-filled-gold">Sign In</Link>
            <Link href={"/signup?next=/checkout" as Route} className="btn-ghost-gold">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <p className="display-font text-3xl font-semibold">Your cart is empty</p>
        <Link href="/products" className="btn-filled-gold">Browse Jewellery</Link>
      </div>
    );
  }

  async function handleRazorpay(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    setError("");
    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { setError("Could not load payment gateway. Please try again."); return; }

      const createRes = await fetch("/api/payment/razorpay/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: subtotal + shipping }),
      });
      const createData = await createRes.json() as {
        orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string;
      };
      if (!createRes.ok || !createData.orderId) {
        setError(createData.error ?? "Could not initiate payment. Please try again.");
        return;
      }

      const customerInfo = {
        name:    form.name  || customer.name,
        email:   form.email || customer.email,
        phone:   form.phone || customer.phone || "",
        address: { line1: form.line1, line2: form.line2 || undefined, city: form.city, state: form.state, pincode: form.pincode },
      };

      const cartItems = items.map(i => ({ productId: i.productId, slug: i.slug, qty: i.qty, size: i.size }));

      const rzp = new window.Razorpay({
        key:         createData.keyId,
        amount:      createData.amount,
        currency:    createData.currency ?? "INR",
        name:        "Sundari Art Jewellery",
        description: "Jewellery Order",
        order_id:    createData.orderId,
        prefill: {
          name:    customerInfo.name,
          email:   customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: { color: "#C9A96E" },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/payment/razorpay/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId:   response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                items:             cartItems,
                customer:          customerInfo,
                notes:             form.notes || undefined,
              }),
            });
            const verifyData = await verifyRes.json() as { orderId?: string; error?: string };
            if (!verifyRes.ok || !verifyData.orderId) {
              setError(verifyData.error ?? "Payment verified but order creation failed. Please contact support.");
              setLoading(false);
              return;
            }
            clearCart();
            router.push(`/order-confirmation/${verifyData.orderId}` as Route);
          } catch {
            setError("Payment verified but order creation failed. Please contact support.");
            setLoading(false);
          }
        },
      });

      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleCod(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          items: items.map(i => ({ productId: i.productId, slug: i.slug, qty: i.qty, size: i.size })),
          customer: {
            name:    form.name  || customer.name,
            email:   form.email || customer.email,
            phone:   form.phone || customer.phone || "",
            address: { line1: form.line1, line2: form.line2 || undefined, city: form.city, state: form.state, pincode: form.pincode },
          },
          paymentMethod: "cod",
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json() as { orderId?: string; error?: string };
      if (!res.ok) { setError(data.error ?? "Checkout failed. Please try again."); return; }
      clearCart();
      router.push(`/order-confirmation/${data.orderId}` as Route);
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[rgba(138,106,58,0.5)]";
  const inpStyle = { background: "var(--surface-warm)", border: "1px solid rgba(138,106,58,0.25)", color: "var(--foreground)" };
  const lbl = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em]";

  const orderSummary = (
    <div className="sticky top-6 space-y-5 rounded-xl p-4 sm:p-6" style={{ background: "white", border: "1px solid rgba(138,106,58,0.15)" }}>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>Order Summary</h2>
      <ul className="space-y-4">
        {items.map(item => (
          <li key={`${item.productId}-${item.size ?? ""}`} className="flex min-w-0 gap-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm" style={{ background: "var(--surface-warm)" }}>
              <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: "var(--bg-dark)", color: "var(--gold-pale)" }}>
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>{item.name}</p>
              {item.size && <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>Size {item.size}</p>}
            </div>
            <p className="shrink-0 text-sm font-semibold" style={{ color: "var(--foreground)" }}>{formatPrice(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t pt-4 text-sm" style={{ borderColor: "rgba(138,106,58,0.15)" }}>
        <div className="flex justify-between" style={{ color: "var(--ink-soft)" }}>
          <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between" style={{ color: "var(--ink-soft)" }}>
          <span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-bold" style={{ borderColor: "rgba(138,106,58,0.15)", color: "var(--foreground)" }}>
          <span>Total</span>
          <span className="display-font text-xl">{formatPrice(subtotal + shipping)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-[10px]" style={{ color: "var(--ink-soft)" }}>
        <ShieldCheck size={13} />
        Secure checkout · Free returns within 30 days
      </div>
    </div>
  );

  const addressFormSections = (
    <>
      <section className="space-y-5 rounded-xl p-4 sm:p-6" style={{ background: "white", border: "1px solid rgba(138,106,58,0.15)" }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={lbl} style={{ color: "var(--ink-soft)" }}>Full Name *</label>
            <input className={inp} style={inpStyle} required value={form.name || customer.name} onChange={e => setField("name", e.target.value)} placeholder="Priya Sharma" />
          </div>
          <div>
            <label className={lbl} style={{ color: "var(--ink-soft)" }}>Email *</label>
            <input className={inp} style={inpStyle} type="email" required value={form.email || customer.email} onChange={e => setField("email", e.target.value)} placeholder="priya@example.com" />
          </div>
          <div>
            <label className={lbl} style={{ color: "var(--ink-soft)" }}>Phone *</label>
            <input className={inp} style={inpStyle} type="tel" required value={form.phone || customer.phone || ""} onChange={e => setField("phone", e.target.value)} placeholder="+91 98765 43210" />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl p-4 sm:p-6" style={{ background: "white", border: "1px solid rgba(138,106,58,0.15)" }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>Delivery Address</h2>
        <div className="grid gap-4">
          <div>
            <label className={lbl} style={{ color: "var(--ink-soft)" }}>Address Line 1 *</label>
            <input className={inp} style={inpStyle} required value={form.line1} onChange={e => setField("line1", e.target.value)} placeholder="House / Flat no., Street" />
          </div>
          <div>
            <label className={lbl} style={{ color: "var(--ink-soft)" }}>Address Line 2</label>
            <input className={inp} style={inpStyle} value={form.line2} onChange={e => setField("line2", e.target.value)} placeholder="Landmark, Area (optional)" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={lbl} style={{ color: "var(--ink-soft)" }}>City *</label>
              <input className={inp} style={inpStyle} required value={form.city} onChange={e => setField("city", e.target.value)} placeholder="Mumbai" />
            </div>
            <div>
              <label className={lbl} style={{ color: "var(--ink-soft)" }}>State *</label>
              <input className={inp} style={inpStyle} required value={form.state} onChange={e => setField("state", e.target.value)} placeholder="Maharashtra" />
            </div>
            <div>
              <label className={lbl} style={{ color: "var(--ink-soft)" }}>Pincode *</label>
              <input className={inp} style={inpStyle} required value={form.pincode} onChange={e => setField("pincode", e.target.value)} placeholder="400001" />
            </div>
          </div>
        </div>
      </section>

      <div>
        <label className={lbl} style={{ color: "var(--ink-soft)" }}>Order Notes (optional)</label>
        <textarea className={inp} style={{ ...inpStyle, resize: "none" }} rows={2}
          value={form.notes} onChange={e => setField("notes", e.target.value)} placeholder="Special instructions, gift message…" />
      </div>
    </>
  );

  return (
    <div style={{ background: "var(--surface)" }}>
      <div className="container-shell py-7 sm:py-12">
        <h1 className="display-font mb-7 text-3xl font-semibold sm:mb-10 sm:text-4xl" style={{ color: "var(--foreground)" }}>Checkout</h1>

        {/* ── Step 1: choose payment method ─────────────────── */}
        {!method && (
          <div className="grid gap-7 lg:grid-cols-[1fr_400px] lg:gap-10">
            <div className="space-y-5">
              <div>
                <p className="display-font text-2xl font-semibold" style={{ color: "var(--foreground)" }}>How would you like to pay?</p>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>Choose a payment method to continue.</p>
              </div>

              {/* Online Payment */}
              <button
                onClick={() => setMethod("prepaid")}
                className="group w-full rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(138,106,58,0.14)] sm:p-6"
                style={{ background: "var(--bg-dark)", border: "1.5px solid rgba(201,169,110,0.25)" }}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ background: "rgba(201,169,110,0.15)" }}>
                      <CreditCard size={22} style={{ color: "var(--gold)" }} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold sm:text-lg" style={{ color: "var(--gold-pale)" }}>Online Payment</span>
                        <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider sm:text-[9px] sm:tracking-widest" style={{ background: "rgba(201,169,110,0.18)", color: "var(--gold)" }}>Recommended</span>
                      </div>
                      <p className="mt-1 text-sm" style={{ color: "var(--cream-muted)" }}>Secure payment via Razorpay · Instant confirmation</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["UPI", "Credit Card", "Debit Card", "Net Banking"].map(tag => (
                          <span key={tag} className="rounded px-2 py-1 text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.07)", color: "var(--cream-muted)", border: "1px solid rgba(201,169,110,0.2)" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1" style={{ color: "var(--gold)" }} />
                </div>
              </button>

              {/* Cash on Delivery */}
              <button
                onClick={() => setMethod("cod")}
                className="group w-full rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(138,106,58,0.10)] sm:p-6"
                style={{ background: "white", border: "1.5px solid rgba(138,106,58,0.18)" }}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12" style={{ background: "rgba(138,106,58,0.08)" }}>
                      <Truck size={22} style={{ color: "var(--gold-dim)" }} />
                    </div>
                    <div>
                      <span className="text-base font-semibold sm:text-lg" style={{ color: "var(--foreground)" }}>Cash on Delivery</span>
                      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>Pay when your order arrives at your door</p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <Banknote size={13} style={{ color: "var(--gold-dim)" }} />
                        <span className="text-[11px]" style={{ color: "var(--ink-soft)" }}>No prepayment needed · Cash or UPI on delivery</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1" style={{ color: "var(--gold-dim)" }} />
                </div>
              </button>
            </div>
            <div>{orderSummary}</div>
          </div>
        )}

        {/* ── Prepaid: collect address then open Razorpay ───── */}
        {method === "prepaid" && (
          <form onSubmit={handleRazorpay} className="grid gap-7 lg:grid-cols-[1fr_400px] lg:gap-10">
            <div className="space-y-8">
              <button type="button" onClick={() => setMethod(null)} className="text-xs" style={{ color: "var(--ink-soft)" }}>
                ← Back
              </button>
              {addressFormSections}
            </div>
            <div className="space-y-6">
              <div className="sticky top-6 space-y-4">
                {orderSummary}
                {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-sm py-4 text-[11px] font-bold uppercase tracking-[0.26em] transition-opacity disabled:opacity-60"
                  style={{ background: "var(--bg-dark)", color: "var(--gold-pale)" }}>
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Opening Payment…" : `Pay ${formatPrice(subtotal + shipping)}`}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── COD: collect delivery details ─────────────────── */}
        {method === "cod" && (
          <form onSubmit={handleCod} className="grid gap-7 lg:grid-cols-[1fr_400px] lg:gap-10">
            <div className="space-y-8">
              <button type="button" onClick={() => setMethod(null)} className="text-xs" style={{ color: "var(--ink-soft)" }}>
                ← Back
              </button>
              {addressFormSections}
            </div>
            <div className="space-y-6">
              <div className="sticky top-6 space-y-4">
                {orderSummary}
                {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-sm py-4 text-[11px] font-bold uppercase tracking-[0.26em] transition-opacity disabled:opacity-60"
                  style={{ background: "var(--bg-dark)", color: "var(--gold-pale)" }}>
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Placing Order…" : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
