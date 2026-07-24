import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Shipping Policy",
  description: "Shipping options, delivery timelines, and international shipping details for Sundari Art Jewellery orders.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="border-b py-9 sm:py-14"
        style={{ borderColor: "rgba(201,169,110,0.15)" }}
      >
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Legal</p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-6xl">
              Shipping Policy
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              Everything you need to know about how we ship your Sundari Art Jewellery order.
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell py-9 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-10 sm:space-y-14">

          {/* Shipping Overview */}
          <section>
            <SectionHeading title="Shipping Options Overview" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Standard Shipping",
                  price: "₹99",
                  note: "Free on orders above ₹5,000",
                  detail: "Estimated delivery: 4–10 business days",
                },
                {
                  title: "Priority Shipping",
                  price: "₹299",
                  note: "Next Business Day Dispatch",
                  detail: "Estimated delivery: 3–6 business days",
                },
                {
                  title: "Store Pickup",
                  price: "Free",
                  note: "Collect from our store",
                  detail: "Ready confirmation shared via WhatsApp/Email",
                },
                {
                  title: "International Shipping",
                  price: "₹2,999",
                  note: "DDU basis",
                  detail: "Estimated delivery: 7–12 business days",
                },
              ].map((opt) => (
                <div
                  key={opt.title}
                  className="rounded-sm border p-5"
                  style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold-dim)]">{opt.title}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--cream)]">{opt.price}</p>
                  <p className="mt-2 text-xs font-medium text-[var(--gold)]">{opt.note}</p>
                  <p className="mt-1 text-xs text-[rgba(245,230,200,0.55)]">{opt.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Priority Shipping */}
          <section>
            <SectionHeading title="Priority Shipping — ₹299" />
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Need your order urgently? Choose Priority Shipping for faster processing.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "Guaranteed Next Business Day Dispatch — irrespective of operational load.",
                "Estimated delivery within 3–6 business days from dispatch.",
                "Orders are processed on priority over standard shipments.",
                "100% Secure OTP-Based Delivery to ensure verified handover.",
              ].map((item) => (
                <CheckItem key={item} text={item} />
              ))}
            </ul>
            <Note text="Delivery timelines are estimates and may occasionally be affected due to courier delays, unforeseen circumstances, or incomplete shipping details. However, in most cases, Priority orders are delivered within the promised timeframe." />
          </section>

          <Divider />

          {/* Standard Delivery */}
          <section>
            <SectionHeading title="Standard Delivery" />
            <div className="mt-5 space-y-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              <p>We offer <strong className="text-[var(--cream)]">free delivery</strong> on purchases over ₹5,000. Orders below ₹5,000 will have a delivery fee of ₹99.</p>
              <p>The estimated delivery time for Standard Delivery is <strong className="text-[var(--cream)]">4–10 business days</strong>.</p>
              <p>Cash On Delivery is currently <strong className="text-[var(--cream)]">not available</strong>.</p>
            </div>
          </section>

          <Divider />

          {/* Store Pickup */}
          <section>
            <SectionHeading title="Store Pickup (Free)" />
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Prefer to collect your order personally? You can choose Store Pickup at checkout.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "No shipping charges.",
                "Ready for pickup confirmation will be shared via WhatsApp/Email.",
                "Please carry your order confirmation and valid ID at the time of collection.",
              ].map((item) => (
                <CheckItem key={item} text={item} />
              ))}
            </ul>
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Orders are usually ready for pickup within <strong className="text-[var(--cream)]">12 hours</strong>. You may collect between <strong className="text-[var(--cream)]">10:30 AM – 8:00 PM</strong>.
            </p>
            <div
              className="mt-6 rounded-sm border p-5"
              style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)" }}
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">Important Terms for Store Pickup</p>
              <ul className="space-y-2.5 text-xs leading-6 text-[rgba(245,230,200,0.65)]">
                {[
                  "Customers must collect their order within 15 days from the date of placing the order.",
                  "If not collected within 15 days, the order will be automatically cancelled.",
                  "A service/restocking fee of ₹99 will be applicable on cancelled store pickup orders and deducted from the refund.",
                  "If Store Pickup is selected mistakenly, our team may offer shipping for an additional ₹99. If the customer still chooses to cancel, the ₹99 fee remains applicable.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 shrink-0 text-[var(--gold)]">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Divider />

          {/* International */}
          <section>
            <SectionHeading title="International Delivery" />
            <div className="mt-5 space-y-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              <p>We offer standard international shipping on all eligible products.</p>
              <p>A flat international shipping charge of <strong className="text-[var(--cream)]">₹2,999 per order</strong> applies. Estimated delivery time is <strong className="text-[var(--cream)]">7–12 business days</strong> from the date of order.</p>
            </div>
            <div
              className="mt-6 rounded-sm border p-5"
              style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)" }}
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">Customs & Import Duties (DDU — Delivery Duty Unpaid)</p>
              <ul className="space-y-2.5 text-xs leading-6 text-[rgba(245,230,200,0.65)]">
                {[
                  "All international shipments are sent on a DDU (Delivery Duty Unpaid) basis.",
                  "Product prices and shipping charges do not include import duties, customs fees, or local taxes.",
                  "The recipient is fully responsible for paying any applicable duties, taxes, or customs charges as per their country's regulations.",
                  "Orders may be held at customs until applicable charges are paid.",
                  "If a shipment is refused or returned due to unpaid duties, shipping charges will not be refunded and return charges (if applicable) will be deducted from the refund.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 shrink-0 text-[var(--gold)]">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Divider />

          {/* Delivered but Not Received */}
          <section>
            <SectionHeading title="Delivered but Not Received Policy" />
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              At Sundari Art Jewellery, we ensure that every order is shipped with secure and trackable courier partners. This policy explains the process and guidelines in cases where the tracking status shows &ldquo;Delivered&rdquo; but the customer claims they have not received the parcel.
            </p>

            <div className="mt-8 space-y-7">
              <PolicyBlock
                title="Courier Delivery Proof"
                items={[
                  "Delivery OTP confirmation.",
                  "Delivery signature (POD – Proof of Delivery).",
                  "Delivery photograph (if available).",
                  "GPS location of the delivered parcel.",
                  "Delivery agent's delivery report.",
                ]}
                footer="This delivery proof is considered final and binding unless proven otherwise through investigation."
              />
              <PolicyBlock
                title="Complaint Window — 24 to 48 Hours"
                items={[
                  `If a customer has not received the parcel despite the tracking showing "Delivered," they must contact our support team within 24–48 hours of the delivery update.`,
                  "Complaints raised after 48 hours will not be eligible for investigation, refund, or replacement.",
                ]}
              />
              <PolicyBlock
                title="Mandatory Customer Verification"
                items={[
                  "Whether any family member, neighbour, security guard, or reception desk received the parcel.",
                  "Whether the delivery address provided was accurate and accessible.",
                  "Whether the customer was available at the location on the day of delivery.",
                ]}
              />
              <PolicyBlock
                title="Courier Investigation — 5 to 7 Working Days"
                items={[
                  "After receiving the customer complaint, we initiate an official investigation with the courier partner.",
                  "The investigation may take 5–7 working days.",
                  "If the courier confirms a delivery error — a replacement or refund will be issued as per product availability.",
                  "If the courier provides valid delivery proof — the order will be considered successfully delivered, and no refund or replacement will be issued.",
                ]}
              />
              <PolicyBlock
                title="Conditions Where No Refund or Replacement Will Be Provided"
                items={[
                  "Valid delivery proof received from the courier.",
                  "Customer fails to contact us within 48 hours.",
                  "Wrong or incomplete address provided at checkout.",
                  "Customer unavailable at the delivery location.",
                  "Repeated false claims identified by our team.",
                  "Customer does not cooperate during investigation.",
                ]}
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-0.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
      <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">{title}</h2>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-[rgba(245,230,200,0.65)]">
      <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </li>
  );
}

function Note({ text }: { text: string }) {
  return (
    <p
      className="mt-5 rounded-sm border-l-2 py-3 pl-4 text-xs leading-6 text-[rgba(245,230,200,0.5)] italic"
      style={{ borderColor: "rgba(201,169,110,0.35)" }}
    >
      <strong className="not-italic text-[rgba(201,169,110,0.8)]">Please note:</strong> {text}
    </p>
  );
}

function PolicyBlock({ title, items, footer }: { title: string; items: string[]; footer?: string }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[rgba(201,169,110,0.8)]">→ {title}</p>
      <ul className="space-y-2 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold-dim)]" />
            {item}
          </li>
        ))}
      </ul>
      {footer && (
        <p className="mt-3 text-xs italic text-[rgba(245,230,200,0.45)]">{footer}</p>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }} />
  );
}
