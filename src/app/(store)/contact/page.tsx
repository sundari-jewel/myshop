import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with Sundari Art Jewellery. We're here to help.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>

      {/* Hero */}
      <div className="border-b py-9 sm:py-14" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Get in Touch</p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              Have a question about an order, a product, or just want to say hello? We&apos;d love to hear from you. Reach us through any of the details below.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="container-shell py-9 sm:py-14">
        <div className="mx-auto max-w-3xl">

          <div className="grid gap-5 sm:grid-cols-3">

            {/* Address */}
            <div
              className="rounded-sm border p-6"
              style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.03)" }}
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full" style={{ border: "1px solid rgba(201,169,110,0.3)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">Visit Us</p>
              <p className="text-sm font-medium leading-6 text-[rgba(245,230,200,0.85)]">
                Shree Vallabh Mangalam<br />Art Jewels
              </p>
              <p className="mt-1 text-xs leading-6 text-[rgba(245,230,200,0.5)]">
                72 Lakherwadi<br />Ujjain, Madhya Pradesh
              </p>
            </div>

            {/* Phone */}
            <div
              className="rounded-sm border p-6"
              style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.03)" }}
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full" style={{ border: "1px solid rgba(201,169,110,0.3)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006 6l1.52-1.52a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">Call Us</p>
              <a
                href="tel:+919826872890"
                className="block text-sm font-medium leading-6 text-[rgba(245,230,200,0.85)] transition-colors hover:text-[var(--gold)]"
              >
                +91 98268 72890
              </a>
              <p className="mt-1 text-xs leading-6 text-[rgba(245,230,200,0.5)]">
                Anshul Jain<br />Mon – Sat, 10am – 7pm
              </p>
            </div>

            {/* Email */}
            <div
              className="rounded-sm border p-6"
              style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.03)" }}
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full" style={{ border: "1px solid rgba(201,169,110,0.3)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">Email Us</p>
              <a
                href="mailto:contactsundariart@gmail.com"
                className="block text-sm font-medium leading-6 text-[rgba(245,230,200,0.85)] transition-colors hover:text-[var(--gold)]"
              >
                contactsundariart@gmail.com
              </a>
              <p className="mt-1 text-xs leading-6 text-[rgba(245,230,200,0.5)]">
                We reply within<br />1–2 business days
              </p>
            </div>

          </div>

          {/* Divider */}
          <div
            className="my-10 h-px w-full"
            style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
          />

          {/* Note */}
          <div className="rounded-sm border p-6" style={{ borderColor: "rgba(201,169,110,0.15)", background: "rgba(201,169,110,0.02)" }}>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold-dim)]">A note on fraud</p>
            <p className="text-sm leading-7 text-[rgba(245,230,200,0.55)]">
              We only communicate through the email above and our official social media accounts. We will never ask you to transfer money to a personal account or share your OTP. If something feels off, please contact us directly before making any payment.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
