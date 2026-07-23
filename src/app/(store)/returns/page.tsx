import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Returns & Exchanges",
  description: "Return and refund policy for Sundari Art Jewellery orders — eligibility, process, timelines, and international return terms.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="border-b py-14"
        style={{ borderColor: "rgba(201,169,110,0.15)" }}
      >
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Legal</p>
            <h1 className="display-font mt-3 text-5xl font-semibold italic text-[var(--gold)] sm:text-6xl">
              Return &amp; Refunds Policy
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              We want you to have a smooth shopping experience. Please read our Return &amp; Refund Policy carefully before placing an order. By placing an order on our website, you agree to the policy mentioned below.
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell py-14">
        <div className="mx-auto max-w-3xl space-y-14">

          {/* Sale Items Warning */}
          <div
            className="rounded-sm border p-6"
            style={{ borderColor: "rgba(201,169,110,0.35)", background: "rgba(201,169,110,0.06)" }}
          >
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
              Sale Items — No Return &amp; Exchange Policy
            </p>
            <ul className="space-y-2.5 text-sm leading-7" style={{ color: "var(--cream)" }}>
              {[
                "Any product purchased during a Sale or at a Discounted Price is NOT eligible for return.",
                "Sale items are limited, single-piece products offered at special discounted rates.",
                "Due to the nature of sale inventory, returns are strictly not accepted on sale items under any circumstances.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <Divider />

          {/* 1. Return Window */}
          <section>
            <SectionHeading number="1" title="Return Window" />
            <ul className="mt-5 space-y-3">
              {[
                "Customers can request a return within 24 hours of product delivery only.",
                "The return request must be raised from the Login section of our website.",
                "Any return request made after 24 hours will not be accepted, and the return window will be permanently closed.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 2. Return Request Review */}
          <section>
            <SectionHeading number="2" title="Return Request Review & Approval" />
            <ul className="mt-5 space-y-3">
              {[
                "Once we receive your return request, our team will review it.",
                "The review process may take 1–2 working days.",
                "If the request is found to be genuine and valid, it will be approved.",
                "After approval, you will receive a confirmation message/email regarding the return request.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 3. Product Pickup */}
          <section>
            <SectionHeading number="3" title="Product Pickup Process" />
            <ul className="mt-5 space-y-3">
              {[
                "After approval, the pickup will be scheduled within 1–2 working days.",
                "Our delivery partner will come to your registered address for pickup.",
                "The jewellery must be properly packed in a box to avoid any damage during transit.",
                "Improper or loose packing may lead to damage, which can affect your return eligibility or refund.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 4. Refund Mode */}
          <section>
            <SectionHeading number="4" title="Refund Mode — Original Payment Method" />
            <ul className="mt-5 space-y-3">
              {[
                "Once the returned product is picked up and received by us, it will be inspected and verified.",
                "After successful verification, the refund amount will be processed to the original payment method within 2–3 working days.",
                "Refunds will be initiated only after the product passes the quality check.",
                "The refunded amount may take additional time to reflect in your account depending on your Bank/Payment provider.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 5. Return Shipping Charges */}
          <section>
            <SectionHeading number="5" title="Return Shipping Charges" />
            <ul className="mt-5 space-y-3">
              {[
                "A return shipping fee of ₹99 is mandatory for all return requests.",
                "This charge applies to all customers, without exception.",
                "Due to our limited margins, return shipping costs cannot be borne by us.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 6. Damaged or Repairable */}
          <section>
            <SectionHeading number="6" title="Damaged or Repairable Products" />
            <ul className="mt-5 space-y-3">
              {[
                "If the product has minor damage or requires repair due to transit issues, the return will still be processed.",
                "However, a ₹99 return shipping fee will still be applicable in such cases.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 7. Acceptance */}
          <section>
            <SectionHeading number="7" title="Acceptance of Policy" />
            <ul className="mt-5 space-y-3">
              {[
                "By placing an order on our website, you automatically accept this Return & Store Credit Policy.",
                "We strictly follow the above policy for all orders.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
          </section>

          <Divider />

          {/* 8. International EU Zone F */}
          <section>
            <SectionHeading number="8" title="International Orders (EU Zone F) — Returns & Cancellations" />
            <div className="mt-5 space-y-3">
              {[
                { label: "Return Window", text: "You have 14 days to request a return, starting from the day the last item in your order is delivered. This window is automatically extended to account for weekends or holidays." },
                { label: "Return Shipping Cost", text: "A flat-rate return shipping fee of ₹7,405.00 INR applies. This amount is charged only once per return request. We do not charge any additional restocking fees." },
                { label: "Cancellations", text: "Orders can be cancelled at any time until the item is fulfilled." },
                { label: "Final Sale Items", text: "Customers cannot request returns or cancellations for specific collections marked as final sale products." },
                { label: "Applicability", text: "These specific return and cancellation rules will only apply to items purchased after these rules were updated on our website." },
              ].map(({ label, text }) => (
                <div key={label} className="flex gap-3 text-sm leading-7">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold-dim)" }} />
                  <p style={{ color: "rgba(245,230,200,0.85)" }}>
                    <strong className="font-semibold text-[var(--cream)]">{label}:</strong>{" "}{text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 9. International US Mexico Zone G */}
          <section>
            <SectionHeading number="9" title="International Orders (US Mexico Zone G) — Returns & Cancellations" />
            <p className="mt-4 text-sm leading-7" style={{ color: "rgba(245,230,200,0.85)" }}>
              For our customers in US Mexico Zone G, the following specific rules apply in addition to our standard policy procedures:
            </p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Return Window", text: "You have 14 days to request a return, starting from the day the last item in your order is delivered. This window is automatically extended to account for weekends or holidays." },
                { label: "Return Shipping Cost", text: "A flat-rate return shipping fee of ₹7,741.00 INR applies. This amount is charged only once per return request. We do not charge any additional restocking fees." },
                { label: "Cancellations", text: "Orders can be cancelled at any time until the item is fulfilled." },
                { label: "Final Sale Items", text: "Customers cannot request returns or cancellations for specific collections marked as final sale products." },
                { label: "Applicability", text: "These specific return and cancellation rules will only apply to items purchased after these rules were updated on our website." },
              ].map(({ label, text }) => (
                <div key={label} className="flex gap-3 text-sm leading-7">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold-dim)" }} />
                  <p style={{ color: "rgba(245,230,200,0.85)" }}>
                    <strong className="font-semibold text-[var(--cream)]">{label}:</strong>{" "}{text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 10. International EU Zone I */}
          <section>
            <SectionHeading number="10" title="International Orders (EU Zone I) — Returns & Cancellations" />
            <p className="mt-4 text-sm leading-7" style={{ color: "rgba(245,230,200,0.85)" }}>
              For our customers in EU Zone I, the following specific rules apply in addition to our standard policy procedures:
            </p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Return Window", text: "You have 14 days to request a return, starting from the day the last item in your order is delivered. This window is automatically extended to account for weekends or holidays." },
                { label: "Return Shipping Cost", text: "A flat-rate return shipping fee of ₹9,741.00 INR applies. This amount is charged only once per return request. We do not charge any additional restocking fees." },
                { label: "Cancellations", text: "Orders can be cancelled at any time until the item is fulfilled." },
                { label: "Final Sale Items", text: "Customers cannot request returns or cancellations for specific collections marked as final sale products." },
                { label: "Applicability", text: "These specific return and cancellation rules will only apply to items purchased after these rules were updated on our website." },
              ].map(({ label, text }) => (
                <div key={label} className="flex gap-3 text-sm leading-7">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold-dim)" }} />
                  <p style={{ color: "rgba(245,230,200,0.85)" }}>
                    <strong className="font-semibold text-[var(--cream)]">{label}:</strong>{" "}{text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Footer note */}
          <p
            className="rounded-sm border-l-2 py-3 pl-4 text-xs leading-6 text-[rgba(245,230,200,0.5)] italic"
            style={{ borderColor: "rgba(201,169,110,0.35)" }}
          >
            For any further queries, please contact our customer support team before placing your order. Sundari Art Jewellery reserves the right to make changes to this return policy at any time. Any modifications will be updated on our website.
          </p>

        </div>
      </div>
    </div>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="shrink-0 text-[11px] font-bold tabular-nums"
        style={{ color: "var(--gold-dim)" }}
      >
        {number}.
      </span>
      <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">{title}</h2>
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-sm leading-7" style={{ color: "rgba(245,230,200,0.85)" }}>
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold-dim)" }} />
      {text}
    </li>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
    />
  );
}
