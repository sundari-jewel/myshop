"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ChevronDown, Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { useCart } from "@/context/cart-context";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { useWishlist } from "@/context/wishlist-context";

const NAV_LINKS: Array<{ href: string; label: string; highlight?: boolean }> = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Jewellery" },
  { href: "/collections/daily-gold", label: "Daily Wear" },
  { href: "/collections/bridal", label: "Occasion Wear" },
  { href: "/collections/gifting", label: "Gifting" },
  { href: "/collections/sale", label: "Sale", highlight: true },
];

const CATEGORY_LINKS = [
  { label: "Bangles",   href: "/collections/bangles" },
  { label: "Necklace",  href: "/collections/necklaces" },
  { label: "Earrings",  href: "/collections/earrings" },
  { label: "Hathful",   href: "/collections/hathful" },
  { label: "Bracelet",  href: "/collections/bracelet" },
  { label: "Watches",   href: "/collections/watches" },
  { label: "Rakhis",    href: "/collections/rakhis" },
  { label: "Tika",      href: "/collections/tika" },
  { label: "Rings",     href: "/collections/rings" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const categoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openCategory() {
    if (categoryCloseTimer.current) clearTimeout(categoryCloseTimer.current);
    setCategoryOpen(true);
  }
  function closeCategory() {
    categoryCloseTimer.current = setTimeout(() => setCategoryOpen(false), 120);
  }
  const { count, setOpen: setCartOpen } = useCart();
  const { customer } = useCustomerAuth();
  const wishlist = useWishlist();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);


  return (
    <>
      <style>{`
        @keyframes sale-fire {
          0%, 100% { color: #e03030; filter: drop-shadow(0 0 5px rgba(220,40,40,0.85)) drop-shadow(0 0 12px rgba(220,40,40,0.5)); }
          33%       { color: #ff6a1a; filter: drop-shadow(0 0 8px rgba(255,100,20,0.9)) drop-shadow(0 0 18px rgba(255,100,20,0.55)); }
          66%       { color: #e8b800; filter: drop-shadow(0 0 6px rgba(230,180,0,0.85)) drop-shadow(0 0 14px rgba(230,180,0,0.5)); }
        }
        @keyframes sale-shake {
          0%, 72%, 100% { transform: rotate(0deg) scale(1); }
          73%  { transform: rotate(-4deg) scale(1.08); }
          75%  { transform: rotate(4deg)  scale(1.1); }
          77%  { transform: rotate(-3deg) scale(1.08); }
          79%  { transform: rotate(3deg)  scale(1.06); }
          81%  { transform: rotate(0deg)  scale(1); }
        }
        .sale-link {
          animation: sale-fire 2s ease-in-out infinite, sale-shake 3.5s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      {/* Main navbar */}
      <header
        className="relative z-50 w-full transition-shadow duration-300"
        style={{
          backgroundColor: "var(--bg-dark)",
          backgroundImage: "url('/assets/navbar/navbg.webp')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          borderBottom: "1px solid rgba(201,169,110,0.22)",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,4,4,0.18) 0%, rgba(14,4,4,0.05) 42%, rgba(14,4,4,0.34) 100%)",
          }}
        />

        {/* Brand name — centered at the top of the header */}
        <div className="pointer-events-none absolute inset-x-0 top-14 hidden justify-center lg:flex">
          <span
            className="font-cormorant text-center text-[52px] font-bold italic leading-none tracking-[0.14em]"
            style={{ color: "var(--gold)" }}
          >
            Sundari Art Jewellery
          </span>
        </div>

        {/* Desktop logo — pinned to top-left corner of the full-bleed header */}
        <Link href="/" className="focus-ring absolute left-12 top-6 z-10 hidden lg:block" aria-label="Sundari Jewellers">
          <Image
            src="/assets/logo.webp"
            alt="Sundari Jewellers"
            width={160}
            height={160}
            priority
            className="h-auto w-[160px] rounded-t-full shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
          />
        </Link>

        <div className="relative mx-auto flex min-h-[106px] w-[min(980px,calc(100%-24px))] flex-col justify-end pb-4 pt-4 lg:min-h-[226px] lg:w-[min(980px,calc(100%-40px))] lg:pb-9 lg:pt-10">
          <div className="relative flex items-end">

            {/* Mobile logo */}
            <Link href="/" className="focus-ring shrink-0 lg:hidden" aria-label="Sundari Jewellers">
              <Image
                src="/assets/logo.webp"
                alt="Sundari Jewellers"
                width={88}
                height={88}
                priority
                className="h-auto w-[72px] rounded-t-full shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:w-[88px]"
              />
            </Link>

            {/* Desktop left: Account / Sign In */}
            <div className="hidden items-end pb-1 lg:flex">
              <Link
                href={customer ? "/account" : "/signin"}
                className="focus-ring text-[10px] font-medium uppercase tracking-[0.3em] transition-colors hover:text-[var(--gold-light)]"
                style={{ color: "var(--gold-pale)" }}
              >
                {customer ? "Account" : "Sign In"}
              </Link>
            </div>

            {/* Desktop right: Wishlist + Cart (logged in only) */}
            {customer && (
              <div className="ml-auto hidden items-end gap-5 pb-1 lg:flex">
                <Link href="/wishlist" aria-label="Wishlist" className="focus-ring group relative">
                  <Heart
                    size={18}
                    strokeWidth={1.8}
                    className="transition-all duration-300 ease-out group-hover:scale-125 group-hover:fill-white group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                    style={{ color: "var(--gold-pale)" }}
                  />
                  {wishlist.count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: "var(--ruby)", color: "white" }}>
                      {wishlist.count}
                    </span>
                  )}
                </Link>
                <button
                  aria-label="Open cart"
                  type="button"
                  className="focus-ring relative inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em] transition-colors hover:text-[var(--gold-light)]"
                  style={{ color: "var(--gold-pale)" }}
                  onClick={() => setCartOpen(true)}
                >
                  Cart
                  <ShoppingCart size={13} strokeWidth={1.7} aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -right-4 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: "var(--ruby)", color: "white" }}>
                      {count}
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1 lg:hidden">
              {customer && (
                <button
                  aria-label="Open cart"
                  type="button"
                  className="focus-ring relative inline-flex h-9 items-center gap-1 rounded-sm border px-2 text-[9px] font-semibold uppercase tracking-[0.16em] sm:gap-1.5 sm:px-3 sm:text-[10px] sm:tracking-[0.22em]"
                  style={{ borderColor: "rgba(228,200,138,0.45)", color: "var(--gold-pale)" }}
                  onClick={() => setCartOpen(true)}
                >
                  Cart
                  <ShoppingCart size={13} strokeWidth={1.8} aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: "var(--ruby)", color: "white" }}>
                      {count}
                    </span>
                  )}
                </button>
              )}
              <button
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                type="button"
                className="focus-ring grid size-9 place-items-center rounded-sm border transition-colors duration-200 hover:text-[var(--gold)]"
                style={{ borderColor: "rgba(228,200,138,0.45)", color: "var(--gold-pale)" }}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? <X size={19} strokeWidth={1.6} /> : <Menu size={19} strokeWidth={1.6} />}
              </button>
            </div>
          </div>

          <div className="mt-4 hidden h-px w-full lg:block" style={{ background: "rgba(240,221,176,0.38)" }} />

          <nav className="mt-6 hidden items-center justify-between lg:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className="focus-ring group relative text-[15px] font-bold uppercase tracking-[0.18em]"
                style={{ color: item.highlight ? "var(--ruby)" : "var(--gold-pale)" }}
              >
                {item.highlight ? (
                  <span className="sale-link">{item.label}</span>
                ) : (
                  <>
                    <span className="transition-colors duration-200 group-hover:text-[var(--gold-light)]">
                      {item.label}
                    </span>
                    <span
                      className="absolute -bottom-2 left-0 h-px w-0 transition-all duration-300 ease-out group-hover:w-full"
                      style={{ background: "var(--gold-light)" }}
                    />
                  </>
                )}
              </Link>
            ))}

            {/* Shop by Category dropdown */}
            <div
              className="relative"
              onMouseEnter={openCategory}
              onMouseLeave={closeCategory}
            >
              <button
                type="button"
                className="focus-ring group relative flex items-center gap-1 text-[15px] font-bold uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: "var(--gold-pale)" }}
              >
                <span className="transition-colors duration-200 group-hover:text-[var(--gold-light)]">
                  Shop by Category
                </span>
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className="transition-transform duration-200"
                  style={{ transform: categoryOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--gold-dim)" }}
                />
                <span
                  className="absolute -bottom-2 left-0 h-px w-0 transition-all duration-300 ease-out group-hover:w-full"
                  style={{ background: "var(--gold-light)" }}
                />
              </button>

              {categoryOpen && (
                <div
                  className="absolute left-1/2 top-full z-[100] mt-3 w-52 -translate-x-1/2 rounded-lg py-2 shadow-2xl"
                  style={{ background: "var(--bg-dark)", border: "1px solid rgba(201,169,110,0.22)" }}
                >
                  {/* Arrow */}
                  <span
                    className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45"
                    style={{ background: "var(--bg-dark)", border: "1px solid rgba(201,169,110,0.22)", borderBottom: "none", borderRight: "none" }}
                  />
                  {CATEGORY_LINKS.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href as Route}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-150 hover:bg-[rgba(201,169,110,0.08)] hover:text-[var(--gold)]"
                      style={{ color: "var(--cream-muted)" }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav
            className="border-t lg:hidden"
            style={{ borderColor: "rgba(201,169,110,0.18)", background: "var(--bg-maroon)" }}
          >
            <div className="container-shell flex flex-col gap-0.5 py-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className="rounded px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold-light)]"
                  style={{ color: item.highlight ? "var(--ruby)" : "var(--cream-muted)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile: Shop by Category expandable */}
              <button
                type="button"
                onClick={() => setMobileCategoryOpen((o) => !o)}
                className="flex items-center justify-between rounded px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold-light)]"
                style={{ color: "var(--cream-muted)" }}
              >
                Shop by Category
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className="transition-transform duration-200"
                  style={{ transform: mobileCategoryOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {mobileCategoryOpen && (
                <div
                  className="mx-3 mb-1 overflow-hidden rounded"
                  style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.12)" }}
                >
                  {CATEGORY_LINKS.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href as Route}
                      onClick={() => { setMenuOpen(false); setMobileCategoryOpen(false); }}
                      className="block px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold)]"
                      style={{ color: "var(--cream-muted)" }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-3 h-px mx-3" style={{ background: "rgba(201,169,110,0.18)" }} />
              <div className="flex gap-5 px-3 pt-3 pb-1">
                {customer ? (
                  <>
                    <Link href="/account" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--cream-muted)" }} onClick={() => setMenuOpen(false)}>
                      <User size={15} strokeWidth={1.5} /> Account
                    </Link>
                    <Link href="/wishlist" className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--cream-muted)" }} onClick={() => setMenuOpen(false)}>
                      <Heart size={18} strokeWidth={1.5} className="transition-all duration-300 ease-out group-hover:scale-125 group-hover:fill-white" style={{ color: "white" }} />
                      Wishlist {wishlist.count > 0 ? `(${wishlist.count})` : ""}
                    </Link>
                  </>
                ) : (
                  <Link href="/signin" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--cream-muted)" }} onClick={() => setMenuOpen(false)}>
                    <User size={15} strokeWidth={1.5} /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
