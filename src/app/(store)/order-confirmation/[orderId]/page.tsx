import Link from "next/link";
import { CheckCircle2, Package, Home } from "lucide-react";

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;

  return (
    <div style={{ background: "var(--surface)" }}>
      <div className="container-shell flex min-h-[72vh] flex-col items-center justify-center py-12 text-center sm:min-h-[80vh] sm:py-20">
        <CheckCircle2 size={56} strokeWidth={1.2} className="mb-6" style={{ color: "var(--gold)" }} />

        <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--ruby)" }}>Order Confirmed</p>
        <h1 className="display-font mt-2 text-3xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
          Thank you for your order
        </h1>
        <p className="mt-4 max-w-md text-base" style={{ color: "var(--ink-soft)" }}>
          We&apos;ve received your order and will confirm it shortly. You&apos;ll receive updates on your email.
        </p>

        <div className="mt-8 max-w-full rounded-xl px-5 py-5 sm:px-10 sm:py-6" style={{ background: "white", border: "1px solid rgba(138,106,58,0.18)" }}>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>Order ID</p>
          <p className="display-font mt-1 break-all text-xl font-semibold sm:text-2xl" style={{ color: "var(--gold)" }}>{orderId}</p>
          <p className="mt-2 text-xs" style={{ color: "var(--ink-soft)" }}>Save this for your reference</p>
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
