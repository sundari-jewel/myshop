import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Package, Home } from "lucide-react";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/seo";

type Props = { params: Promise<{ orderId: string }> };

type OrderDoc = {
  orderId: string;
  items: { name: string; image: string; price: number; qty: number; size?: string; color?: string; slug: string }[];
  customer: { email: string };
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

  return (
    <div style={{ background: "var(--surface)" }}>
      <div className="container-shell flex min-h-[72vh] flex-col items-center py-12 sm:py-16">
        <CheckCircle2 size={56} strokeWidth={1.2} className="mb-6" style={{ color: "var(--gold)" }} />
        <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--ruby)" }}>Order Confirmed</p>
        <h1 className="display-font mt-2 text-3xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
          Thank you for your order
        </h1>
        <p className="mt-4 max-w-md text-center text-base" style={{ color: "var(--ink-soft)" }}>
          We&apos;ve received your order and will confirm it shortly. You&apos;ll receive updates on your email.
        </p>

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
