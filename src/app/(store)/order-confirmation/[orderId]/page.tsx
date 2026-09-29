import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Package, Home, Store } from "lucide-react";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/seo";
import { STORE_INFO } from "@/lib/store-info";
import { SHIPPING_TIERS, type ShippingTier } from "@/lib/shipping";

type Props = { params: Promise<{ orderId: string }> };

type OrderDoc = {
  orderId: string;
  items: { name: string; image: string; price: number; qty: number; size?: string; color?: string; slug: string }[];
  customer: { email: string };
  fulfillmentType?: "delivery" | "pickup";
  pickupReceiver?: { name?: string; phone?: string };
  shippingTier?:   ShippingTier;
  subtotal: number;
  shippingCharge: number;
  total: number;
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;

  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(`/order-confirmation/${orderId}`)}`);

  await connectDB();
  const order = await Order.findOne({ orderId }).lean() as OrderDoc | null;

  if (!order) notFound();
  if (order.customer.email.toLowerCase() !== session.email.toLowerCase()) notFound();

  const isPickup = order.fulfillmentType === "pickup";

  return (
    <div style={{ background: "var(--surface)" }}>
      <div className="container-shell flex min-h-[72vh] flex-col items-center py-12 sm:py-16">
        <CheckCircle2 size={56} strokeWidth={1.2} className="mb-6" style={{ color: "var(--gold)" }} />
        <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--ruby)" }}>Order Confirmed</p>
        <h1 className="display-font mt-2 text-3xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
          Thank you for your order
        </h1>
        <p className="mt-4 max-w-md text-center text-base" style={{ color: "var(--ink-soft)" }}>
          {isPickup
            ? "We’ve received your order. Please visit our store to collect it during business hours."
            : "We’ve received your order and will confirm it shortly. You’ll receive updates on your email."}
        </p>

        {isPickup && (
          <div className="mt-8 w-full max-w-2xl rounded-xl px-5 py-5 sm:px-8 sm:py-6" style={{ background: "var(--surface-warm)", border: "1px solid rgba(138,106,58,0.25)" }}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--gold)" }}>
              <Store size={14} />
              Pickup Location
            </div>
            <p className="mt-3 text-base font-semibold" style={{ color: "var(--foreground)" }}>{STORE_INFO.name}</p>
            <p className="text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
              {STORE_INFO.address.line1}<br />
              {STORE_INFO.address.city}, {STORE_INFO.address.state} — {STORE_INFO.address.pincode}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--ink-soft)" }}>
              {STORE_INFO.hours} · {STORE_INFO.phone}
            </p>
            <p className="mt-4 text-xs leading-6" style={{ color: "var(--ink-soft)" }}>
              Please bring this order ID and a valid ID.
              {order.pickupReceiver?.name && ` If ${order.pickupReceiver.name} is collecting on your behalf, they should carry the same.`}
            </p>
          </div>
        )}

        <div className="mt-8 w-full max-w-2xl rounded-xl px-5 py-5 sm:px-8 sm:py-6" style={{ background: "white", border: "1px solid rgba(138,106,58,0.18)" }}>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: "rgba(138,106,58,0.15)" }}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>Order ID</p>
              <p className="display-font mt-1 break-all text-xl font-semibold sm:text-2xl" style={{ color: "var(--gold)" }}>{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>Total</p>
              <p className="display-font mt-1 text-xl font-semibold sm:text-2xl" style={{ color: "var(--foreground)" }}>{formatPrice(order.total)}</p>
            </div>
          </div>

          <ul className="mt-5 space-y-4">
            {order.items.map((item, i) => (
              <li key={`${item.slug}-${item.size ?? ""}-${i}`} className="flex min-w-0 gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm" style={{ background: "var(--surface-warm)" }}>
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1.5" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: "var(--bg-dark)", color: "var(--gold-pale)" }}>
                    {item.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>{item.name}</p>
                  {(item.color || item.size) && (
                    <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>
                      {[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-sm font-semibold" style={{ color: "var(--foreground)" }}>{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-1.5 border-t pt-4 text-sm" style={{ borderColor: "rgba(138,106,58,0.15)" }}>
            <div className="flex justify-between" style={{ color: "var(--ink-soft)" }}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between" style={{ color: "var(--ink-soft)" }}>
              <span>
                Shipping
                {order.fulfillmentType !== "pickup" && order.shippingTier &&
                  ` (${SHIPPING_TIERS[order.shippingTier].label})`}
              </span>
              <span>{order.shippingCharge === 0 ? "Free" : formatPrice(order.shippingCharge)}</span>
            </div>
            <div className="flex justify-between pt-1.5 text-base font-semibold" style={{ color: "var(--foreground)" }}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Link href="/" className="flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] sm:px-8 sm:text-[11px] sm:tracking-[0.2em]"
            style={{ background: "var(--bg-dark)", color: "var(--gold-pale)" }}>
            <Home size={14} /> Back to Home
          </Link>
          <Link href="/products" className="flex items-center justify-center gap-2 rounded-sm border px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-[var(--gold)] hover:text-[var(--bg-dark)] sm:px-8 sm:text-[11px] sm:tracking-[0.2em]"
            style={{ border: "1.5px solid var(--gold)", color: "var(--gold)" }}>
            <Package size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
