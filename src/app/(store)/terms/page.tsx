import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms & Legal",
  description: "Legal terms and conditions for shopping at Sundari Art Jewellery.",
  path: "/terms",
});

const SECTIONS = [
  {
    title: "Who We Are",
    items: [
      "This website is operated by Sundari Art Jewellery.",
      "By visiting or purchasing from this site, you agree to the terms below.",
      "These terms apply to all visitors, customers, and users of the site.",
      "We may update these terms at any time — continued use of the site means you accept any changes.",
    ],
  },
  {
    title: "Orders & Payment",
    items: [
      "All orders are subject to availability and confirmation.",
      "We accept online payments only — UPI, cards, and net banking.",
      "Your order is confirmed only after payment is successfully processed.",
      "We reserve the right to cancel any order due to pricing errors, stock issues, or suspected fraud.",
      "If we cancel your order, a full refund will be issued to the original payment method.",
    ],
  },
  {
    title: "Pricing",
    items: [
      "All prices are listed in Indian Rupees (₹) and include applicable taxes.",
      "Prices may change without notice.",
      "Sale prices apply only during the advertised sale period.",
      "We are not obligated to honour pricing errors on the website.",
    ],
  },
  {
    title: "Shipping",
    items: [
      "We ship across India. Delivery timelines are estimates and not guaranteed.",
      "Risk of loss passes to you once the order is handed to the courier.",
      "We are not responsible for delays caused by the courier, natural events, or incorrect addresses.",
      "Please report any damage or missing items within 24 hours of delivery.",
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      "Return requests must be raised within 24 hours of delivery.",
      "Items must be unused, unworn, and in original packaging.",
      "Sale items, customised pieces, and items without tags are not eligible for return.",
      "Refunds are processed to the original payment method within 2–3 working days after verification.",
      "We reserve the right to reject returns that do not meet our policy.",
    ],
  },
  {
    title: "Your Responsibilities",
    items: [
      "You must provide accurate name, address, and contact information when placing an order.",
      "You are responsible for keeping your account credentials secure.",
      "You agree not to misuse the site, submit false information, or engage in fraud.",
      "You must not copy, reproduce, or resell any content or products from this site without our written permission.",
    ],
  },
  {
    title: "Intellectual Property",
    items: [
      "All content on this site — including images, designs, text, and logos — belongs to Sundari Art Jewellery.",
      "You may not use, copy, or distribute our content without prior written consent.",
      "Product designs are proprietary and protected under applicable law.",
    ],
  },
  {
    title: "Limitation of Liability",
    items: [
      "We are not liable for indirect, incidental, or consequential damages arising from your use of this site.",
      "Our total liability in any dispute is limited to the amount you paid for the specific order in question.",
      "We do not guarantee the site will be error-free or available at all times.",
      "Product colours may appear slightly different on screen compared to the actual item.",
    ],
  },
  {
    title: "Privacy",
    items: [
      "We collect and use your personal information only to process orders and improve your experience.",
      "We do not sell your data to third parties.",
      "See our full Privacy Policy for details on data collection and storage.",
    ],
  },
  {
    title: "Governing Law",
    items: [
      "These terms are governed by the laws of India.",
      "Any disputes shall be subject to the exclusive jurisdiction of courts in India.",
      "By using this site, you consent to this jurisdiction.",
    ],
  },
  {
    title: "Fraud & Scam Awareness",
    items: [
      "Sundari Art Jewellery only sells through this official website (sundariartjewellery.com) and our verified social media accounts.",
      "We do NOT sell through WhatsApp groups, Telegram, random Instagram DMs, or third-party resellers unless explicitly announced on our official channels.",
      "We will NEVER ask you to transfer money to a personal bank account, UPI ID, or phone number outside the official checkout on this website.",
      "Beware of fake websites, fake Instagram pages, or accounts impersonating Sundari Art Jewellery — always verify the URL and handle before making any payment.",
      "If you receive a suspicious call, message, or link claiming to be from us, do NOT share your OTP, card details, or banking information.",
      "We will never ask for your OTP, CVV, or full card number over call, chat, or email.",
    ],
  },
  {
    title: "If You Suspect Fraud",
    items: [
      "Stop all communication with the suspected fraudster immediately.",
      "Do NOT make any payment if something feels off — contact us first to verify.",
      "Report the incident to us right away via our customer support contact.",
      "If you have already made a payment to a fraudulent account, immediately contact your bank or payment provider to dispute the transaction.",
      "File a cybercrime complaint at cybercrime.gov.in or call the National Cyber Helpline at 1930.",
      "Screenshot and preserve all suspicious messages, payment receipts, and account details as evidence.",
      "We cooperate fully with law enforcement investigations related to fraud involving our brand.",
    ],
  },
  {
    title: "Our Responsibility in Fraud Cases",
    items: [
      "Sundari Art Jewellery is not liable for payments made to fraudulent or impersonating accounts.",
      "We are not responsible for losses arising from transactions made outside our official website checkout.",
      "If you were defrauded by someone impersonating our brand, we will assist with reporting and investigation but cannot issue refunds for payments not made through our platform.",
      "We actively work to report and take down fake accounts and fraudulent listings whenever we become aware of them.",
    ],
  },
  {
    title: "Contact Us",
    items: [
      "For any questions about these terms, reach out to our customer support team.",
      "To report fraud or impersonation involving our brand, contact us immediately.",
      "We aim to respond to all queries within 1–2 business days.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="border-b py-9 sm:py-14" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Legal</p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-6xl">
              Terms & Legal
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              Simple, plain-language terms for shopping with Sundari Art Jewellery. By using our site or placing an order, you agree to these.
            </p>
            <p className="mt-3 text-xs text-[rgba(245,230,200,0.35)]">Last updated: August 2026</p>
          </div>
        </div>
      </div>

      <div className="container-shell py-9 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-10 sm:space-y-14">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <SectionHeading title={section.title} />
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold-dim)]" />
                    {item}
                  </li>
                ))}
              </ul>
              {i < SECTIONS.length - 1 && <Divider />}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-1 flex items-center gap-3">
      <span className="h-5 w-0.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
      <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">{title}</h2>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mt-10 h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
    />
  );
}
