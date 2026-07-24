"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

const SHOP_LINKS = [
  { label: "All Jewellery",    href: "/products" },
  { label: "Earrings",         href: "/collections/earrings" },
  { label: "Necklaces",        href: "/collections/necklaces" },
  { label: "Bangles",          href: "/collections/bangles" },
  { label: "Rings",            href: "/collections/rings" },
  { label: "Tika",             href: "/collections/tika" },
  { label: "Watches",          href: "/collections/watches" },
  { label: "Rakhi",            href: "/collections/rakhi" },
  { label: "Gifting",          href: "/collections/gifting" },
];

const COLLECTION_LINKS = [
  { label: "Bridal Collection", href: "/collections/bridal" },
  { label: "Diamond Edit",      href: "/collections/diamond-edit" },
  { label: "Daily Wear",        href: "/collections/daily-gold" },
  { label: "Women's Edit",      href: "/collections/womens-edit" },
  { label: "Men's Edit",        href: "/collections/mens-edit" },
];

const SUPPORT_LINKS: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "Track Your Order",   href: "https://shiprocket.co/tracking/", external: true },
  { label: "My Account",         href: "/account" },
  { label: "My Wishlist",        href: "/wishlist" },
  { label: "Shipping Policy",    href: "/shipping" },
  { label: "Returns & Exchanges",href: "/returns" },
  { label: "Contact Us",         href: "/contact" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  }

  return (
    <footer style={{ background: "var(--bg-deep)", color: "var(--cream)" }}>

      {/* ---- Newsletter strip ---------------------------------------- */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(201,169,110,0.18)" }}
      >
        <div className="container-shell flex flex-col gap-6 py-9 sm:gap-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <p
              className="display-font font-semibold italic leading-tight mb-2"
              style={{ color: "var(--gold-light)", fontSize: "1.6rem" }}
            >
              Stay in the know
            </p>
            <p className="text-xs leading-6" style={{ color: "var(--cream-muted)" }}>
              New arrivals, exclusive offers, and stories of craft delivered to your inbox.
            </p>
          </div>
          {!subscribed ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 text-sm bg-transparent border outline-none focus:border-[var(--gold)] transition-colors placeholder-[var(--cream-muted)]"
                style={{
                  borderColor: "rgba(201,169,110,0.35)",
                  color: "var(--cream)",
                  borderRadius: "2px",
                }}
              />
              <button
                type="submit"
                className="btn-filled-gold px-6 py-3 text-xs whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p
              className="text-sm font-medium"
              style={{ color: "var(--gold)" }}
            >
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>

      {/* ---- Main footer grid ---------------------------------------- */}
      <div className="container-shell py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-10 lg:grid-cols-4">

          {/* Col 1 - Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span
                className="display-font font-bold italic leading-none"
                style={{ color: "var(--gold)", fontSize: "1.6rem", letterSpacing: "0.02em" }}
              >
                Sundari
              </span>
              <span
                className="block text-[0.6rem] font-medium tracking-[0.4em] uppercase"
                style={{ color: "var(--cream-muted)" }}
              >
                Art Jewellery
              </span>
            </Link>
            <p
              className="text-xs leading-6 mb-6 max-w-[220px]"
              style={{ color: "var(--cream-muted)" }}
            >
              Fine gold, diamond &amp; bridal jewellery celebrating the art of Indian heritage.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {[
                { label: "Instagram", href: "https://www.instagram.com/sundariartjewellery/", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="size-8 rounded-full grid place-items-center transition-colors duration-200 hover:bg-[rgba(201,169,110,0.15)]"
                  style={{ border: "1px solid rgba(201,169,110,0.25)" }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--cream-muted)">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Shop */}
          <div className="hidden sm:block">
            <h4
              className="text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--gold)" }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href as Route}
                    className="text-xs transition-colors duration-200 hover:text-[var(--gold)]"
                    style={{ color: "var(--cream-muted)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Collections */}
          <div>
            <h4
              className="text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--gold)" }}
            >
              Collections
            </h4>
            <ul className="space-y-3">
              {COLLECTION_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href as Route}
                    className="text-xs transition-colors duration-200 hover:text-[var(--gold)]"
                    style={{ color: "var(--cream-muted)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Support + Trust badges */}
          <div>
            <h4
              className="text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--gold)" }}
            >
              Support
            </h4>
            <ul className="space-y-3 mb-8">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs transition-colors duration-200 hover:text-[var(--gold)]"
                      style={{ color: "var(--cream-muted)" }}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href as Route}
                      className="text-xs transition-colors duration-200 hover:text-[var(--gold)]"
                      style={{ color: "var(--cream-muted)" }}
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>

      {/* ---- Bottom bar --------------------------------------------- */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(201,169,110,0.12)" }}
      >
        <div className="container-shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] tracking-wide" style={{ color: "rgba(200,160,112,0.45)" }}>
            &copy; {new Date().getFullYear()} Sundari Art Jewellery. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href as Route}
                className="text-[10px] tracking-wide transition-colors duration-200 hover:text-[var(--gold)]"
                style={{ color: "rgba(200,160,112,0.45)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
