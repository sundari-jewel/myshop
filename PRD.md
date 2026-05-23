# Product Requirements Document (PRD)
## Jewellery Brand E-Commerce Platform
### Hybrid Architecture: React (Functional App) + Next.js (SEO Layer)

---

**Document Version:** 2.0  
**Status:** Draft  
**Last Updated:** May 2026  
**Owner:** Product Team  
**Stack:** Next.js 15 (SEO/ISR) · React 18 + Vite (Functional App) · TypeScript · Tailwind CSS · Prisma ORM · PostgreSQL · Redis · Stripe · Razorpay · Cloudinary · Algolia

---

## Architecture Decision: Why React + Next.js (Split)

The platform uses a **deliberate hybrid architecture** where responsibility is cleanly divided by purpose:

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **SEO Layer** | **Next.js 15** (App Router, ISR/SSG) | Homepage, PDPs, Collection pages, Blog, Static pages, Sitemap — all public, crawlable, fast-loading |
| **Functional App** | **React 18 + Vite** (SPA) | Cart, Checkout, Account dashboard, Wishlist, Order tracking, Gift Finder — all interactive, auth-gated |
| **Admin Panel** | **React 18 + Vite** (SPA) | Full back-office on a separate SPA; no SEO needed |
| **API Layer** | **Next.js API Routes** | REST API served from Next.js; consumed by both the React SPA and the Next.js pages |

### Why Not Pure Next.js?

Next.js is excellent at server-rendering and SEO but adds unnecessary complexity for heavily interactive, auth-gated surfaces (checkout multi-step flow, account dashboard, admin panel). Using a React SPA for these surfaces gives:

- **Faster iteration** — no RSC/SSR mental overhead for pure client flows
- **Simpler state management** — Zustand + React Query work natively without hydration concerns
- **Better DX for complex forms** — multi-step checkout, dynamic variant configuration, admin tables
- **Leaner bundle** — SEO pages stay tiny; the SPA loads once and is thereafter instant

### Why Not Pure React SPA?

A pure SPA would destroy SEO. Product pages, collection pages, and editorial content **must** be server-rendered with full HTML for Google, rich previews, and social sharing. Next.js with ISR gives us pre-rendered HTML with near-zero TTFB for these pages.

### How They Communicate

- Both apps are served under the same domain (`yourbrand.com`) via Cloudflare routing rules
- Next.js serves `/`, `/products/*`, `/collections/*`, `/journal/*`, `/search`, and static pages
- React SPA is served at `/app/*` (cart, checkout, account) and `/admin/*`
- Both consume the same REST API at `/api/v1/*` (hosted on Next.js)
- Auth tokens (JWT) are stored in HTTP-only cookies and shared across the same domain
- Cart state is persisted server-side (Redis + DB); the React SPA reads it via API on mount

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Target Users & Personas](#3-target-users--personas)
4. [System Architecture](#4-system-architecture)
5. [Tech Stack](#5-tech-stack)
6. [Storefront — Customer-Facing Features](#6-storefront--customer-facing-features)
7. [Product Catalogue & Inventory](#7-product-catalogue--inventory)
8. [Shopping Cart & Checkout](#8-shopping-cart--checkout)
9. [User Accounts & Authentication](#9-user-accounts--authentication)
10. [Order Management](#10-order-management)
11. [Jewellery-Specific Features](#11-jewellery-specific-features)
12. [Admin Panel](#12-admin-panel)
13. [Marketing & Growth](#13-marketing--growth)
14. [Search & Discovery](#14-search--discovery)
15. [Payments & Financial](#15-payments--financial)
16. [Shipping & Fulfilment](#16-shipping--fulfilment)
17. [Customer Support & CRM](#17-customer-support--crm)
18. [Analytics & Reporting](#18-analytics--reporting)
19. [Internationalisation & Localisation](#19-internationalisation--localisation)
20. [Performance & Scalability](#20-performance--scalability)
21. [Security & Compliance](#21-security--compliance)
22. [SEO & Content Marketing](#22-seo--content-marketing)
23. [Integrations & APIs](#23-integrations--apis)
24. [Development Phases & Milestones](#24-development-phases--milestones)
25. [Non-Functional Requirements](#25-non-functional-requirements)
26. [Open Questions & Future Scope](#26-open-questions--future-scope)

---

## 1. Executive Summary

This document defines the full product requirements for a **custom-built, headless jewellery brand e-commerce platform** using a hybrid React + Next.js architecture. The platform serves as a direct-to-consumer (DTC) digital flagship — blending luxury visual storytelling with enterprise-grade commerce capabilities.

The global online jewellery market reached USD 342.66B in 2025, with an online-specific CAGR of 22.1% forecast through 2029. Mobile commerce now accounts for over 60% of jewellery browsing sessions. This platform must deliver a best-in-class shopping experience across all devices while providing a powerful admin system for operations, marketing, and fulfilment teams.

Unlike off-the-shelf solutions (Shopify, BigCommerce), this platform is fully owned, white-labelled, and extensible — giving the brand complete control over data, UX, performance, and integrations with no per-transaction fees.

### Core Principles

- **SEO-first discovery** — Next.js ISR ensures every product, collection, and editorial page is fully crawlable, fast, and social-shareable
- **React-native interactions** — Cart, checkout, and account flows are pure React SPAs — no SSR friction, no hydration mismatches, full interactivity
- **Luxury-first UX** — Every pixel reflects the brand's premium positioning
- **Mobile-native** — 60%+ traffic is mobile; every flow optimised for thumbs
- **Trust by design** — Certifications, reviews, secure badges, and transparent policies are first-class UI elements
- **Personalisation** — AI-powered recommendations, wishlists, and saved preferences
- **Operational excellence** — React-based admin that moves fast without server complexity
- **Scalability** — Architecture that handles 1 product today and 100,000 products tomorrow

---

## 2. Goals & Success Metrics

### Business Goals

| Goal | KPI | Target (12 months) |
|------|-----|-------------------|
| Grow online revenue | Monthly GMV | ₹1Cr / $120K/month |
| Reduce cart abandonment | Cart-to-purchase rate | > 65% |
| Increase retention | Repeat purchase rate | > 35% |
| Improve discovery | Organic search traffic | +80% YoY |
| Reduce support load | Self-service resolution rate | > 70% |
| Increase AOV | Average order value | +25% vs baseline |

### Technical Goals

- Core Web Vitals (Next.js SEO pages): LCP < 2.5s, CLS < 0.1, INP < 200ms
- React SPA first load (cached): < 1.5s (pre-cached JS bundle via Cloudflare)
- API response time: P95 < 300ms
- Lighthouse score on Next.js pages: > 90 (performance, accessibility, SEO)
- Uptime: 99.9% SLA
- Zero PCI-DSS scope via tokenised payments

---

## 3. Target Users & Personas

### 3.1 Customer Personas

**Persona A — The Occasion Buyer (Primary)**
- Age: 28–45, urban, upper-middle-income
- Discovers via Google search or social → lands on Next.js product page (SEO) → adds to cart (React SPA) → completes checkout (React SPA)
- High consideration cycle (3–7 day research); needs detailed product information, certifications, and easy returns
- Browses on mobile, often converts on desktop
- Values: Brand story, hallmark authenticity, emotional resonance

**Persona B — The Fashion-Forward Millennial**
- Age: 22–32, digital-native, social-media-influenced
- Discovers via Instagram/Pinterest → clicks link to Next.js PDP → quick add to cart (React SPA overlay)
- Impulse-buys at lower price points; interested in customisation
- Mobile-first
- Values: Visual design, personalisation, sustainable sourcing

**Persona C — The Fine Jewellery Connoisseur**
- Age: 40–65, high net worth, luxury-oriented
- Discovers via Google ("18K solitaire ring India") → Next.js SEO page → deep product research → React SPA checkout
- Needs gemstone certificates (GIA/IGI), metal purity clarity, valuation documents
- Prefers white-glove service; may want appointment booking
- Values: Trust, provenance, exclusivity, post-sale care

**Persona D — The B2B Buyer (Corporate/Wholesale)**
- HR managers ordering corporate gifts; jewellery retailers ordering wholesale
- Accesses dedicated B2B portal (React SPA); no SEO surface needed
- Values: Bulk order tools, custom branding, Net-30 payment terms

### 3.2 Internal Users (Admin Personas)

- **Super Admin** — Full React admin SPA access; manages system config and users
- **Catalogue Manager** — Creates/edits products, collections, pricing in React admin
- **Orders & Fulfilment Manager** — Processes orders, manages returns via React admin
- **Marketing Manager** — Manages promotions, coupons, email campaigns, SEO content
- **Customer Support Agent** — Views customer data, manages tickets, processes refunds
- **Finance Admin** — Reconciliation, reports, payout management
- **Content Editor** — Manages editorial content in Sanity CMS; banners via React admin

---

## 4. System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          Cloudflare CDN / WAF                             │
│            (static assets, DDoS, bot protection, geo-routing)             │
└─────────────────────────────┬────────────────────────────────────────────┘
                              │
           ┌──────────────────┴────────────────────┐
           │    URL-based Routing (Cloudflare)      │
           │                                        │
   /*, /products/*, /collections/*          /app/*, /admin/*
   /search, /journal/*, static pages        (React SPA routes)
           │                                        │
           ▼                                        ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│   Next.js 15 (Vercel)   │           │  React 18 + Vite (SPA)  │
│                         │           │                         │
│  ┌───────────────────┐  │           │  ┌───────────────────┐  │
│  │  App Router (ISR) │  │           │  │  React Router v7  │  │
│  │  ─ Homepage       │  │           │  │  ─ /app/cart      │  │
│  │  ─ /products/[s]  │  │           │  │  ─ /app/checkout  │  │
│  │  ─ /collections/  │  │           │  │  ─ /app/account/* │  │
│  │  ─ /journal/      │  │           │  │  ─ /app/wishlist  │  │
│  │  ─ /search        │  │           │  │  ─ /app/track/*   │  │
│  │  ─ /about, /faq   │  │           │  └───────────────────┘  │
│  └───────────────────┘  │           │                         │
│  ┌───────────────────┐  │           │  ┌───────────────────┐  │
│  │   API Routes      │◄─┼───────────┼──│  React Admin SPA  │  │
│  │   /api/v1/*       │  │           │  │  /admin/*         │  │
│  └───────────────────┘  │           │  └───────────────────┘  │
└─────────────────────────┘           └─────────────────────────┘
           │                                        │
           └──────────────────┬─────────────────────┘
                              │  Shared REST API  /api/v1/*
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼──────┐   ┌─────────▼──────┐   ┌────────▼───────┐
│  PostgreSQL   │   │  Redis (Upstash)│   │    Algolia     │
│  via Prisma   │   │  Cart · Session │   │  Product Index │
│  (Neon/Supa)  │   │  Rate Limiting  │   │                │
└───────────────┘   └────────────────┘   └────────────────┘
         │                    │                    │
┌────────▼──────┐   ┌─────────▼──────┐   ┌────────▼───────┐
│  Cloudinary   │   │  Stripe +       │   │  Resend /      │
│  Media CDN    │   │  Razorpay       │   │  Postmark      │
└───────────────┘   └────────────────┘   └────────────────┘
```

### Request Flow by Page Type

| User Action | Entry Point | Rendering | App |
|-------------|------------|-----------|-----|
| Google search → product page | `/products/[slug]` | ISR (Next.js) | Next.js |
| Browse collections | `/collections/[slug]` | ISR (Next.js) | Next.js |
| Homepage | `/` | ISR (Next.js) | Next.js |
| Search results | `/search?q=...` | SSR (Next.js) | Next.js |
| Add to cart (CTA click) | `/app/cart` | CSR (React SPA) | React |
| Checkout | `/app/checkout` | CSR (React SPA) | React |
| Account / Orders | `/app/account/*` | CSR (React SPA) | React |
| Wishlist | `/app/wishlist` | CSR (React SPA) | React |
| Admin panel | `/admin/*` | CSR (React SPA) | React Admin |
| Blog / editorial | `/journal/[slug]` | ISR (Next.js) | Next.js |
| Order tracking | `/app/track/[id]` | CSR (React SPA) | React |

### Cross-App Handoff Pattern

When a user on a Next.js page triggers a functional action (e.g., "Add to Cart"), the CTA either:
1. **Opens a React-powered cart drawer** that is injected into the Next.js page as a lightweight micro-frontend (shared `CartDrawer` React component, loaded client-side via a `<script>` bundle)
2. **Redirects** to `/app/cart` (the React SPA route)

The cart drawer approach (Option 1) is preferred for UX continuity — the user never leaves the product page.

---

## 5. Tech Stack

### SEO Layer — Next.js Application

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 15** (App Router) | ISR, SSG, RSC, edge middleware; best-in-class for crawlable, fast public pages |
| Language | TypeScript | Type safety across the codebase |
| Rendering | ISR + SSG + Edge SSR | Products/collections via ISR; search via SSR; static pages via SSG |
| Styling | Tailwind CSS | Utility-first; shared design tokens with React SPA |
| API Routes | Next.js Route Handlers | `/api/v1/*` — single API surface consumed by both apps |
| Middleware | Next.js Edge Middleware | Auth checks, geo-routing, rate limiting, bot detection, A/B flags |
| CMS | Sanity.io | Editorial content (blog, banners, homepage sections) via GROQ |
| Image Optimisation | Next.js Image + Cloudinary | Automatic WebP/AVIF, responsive srcset, blur placeholder |
| SEO | next-sitemap + Schema.org | Auto-generated sitemaps, structured data injection |

### Functional App — React SPA

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **React 18** + **Vite 6** | Fastest dev server; sub-100ms HMR; optimal SPA bundle splitting |
| Language | TypeScript | Shared types with Next.js app via monorepo |
| Routing | React Router v7 | Client-side routing for all `/app/*` and `/admin/*` routes |
| Styling | Tailwind CSS | Same config/tokens as Next.js app — consistent UI |
| UI Components | shadcn/ui + Radix UI | Accessible, headless, consistent with Next.js pages |
| Server State | **TanStack Query v5** | API calls, caching, background refetch, pagination, optimistic updates |
| Client State | **Zustand** | Cart drawer, UI state (modals, drawers), user session cache |
| Forms | React Hook Form + Zod | Checkout form, address form, review form |
| Animations | Framer Motion | Page transitions, cart drawer, modals |
| Auth | JWT via HTTP-only cookie | Shared auth cookie set by Next.js `/api/auth`; React SPA reads from `/api/v1/customers/me` |

### Admin SPA — React + Vite

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **React 18** + **Vite 6** | Same as functional app; no SEO requirements |
| Routing | React Router v7 | `/admin/*` routes |
| UI Library | shadcn/ui + Recharts | Data tables, charts, forms — admin-grade |
| Tables | TanStack Table v8 | Virtualised, sortable, filterable data tables |
| Rich Text Editor | TipTap | Product description editor with image embedding |
| File Upload | React Dropzone + Cloudinary | Drag-and-drop media upload |
| Charts | Recharts | Dashboard analytics charts |

### Shared / Backend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| ORM | Prisma | Type-safe DB access; shared across API routes |
| Database | PostgreSQL (Neon / Supabase) | Relational; connection pooling built-in |
| Cache | Redis (Upstash) | Cart sessions, rate limiting, ISR revalidation triggers |
| Payments | Stripe + Razorpay | International + India-local; webhooks handled in Next.js API |
| Auth | Auth.js (NextAuth v5) | Session management in Next.js; JWT shared via cookie |
| Email | Resend (React Email) | Transactional email from Next.js API routes |
| Search | Algolia | Direct client calls from React SPA; index management via Next.js API |
| Shipping | Shiprocket | API calls from Next.js API routes only |
| Monitoring | Sentry (both apps) | Separate Sentry projects; same DSN organisation |
| Analytics | PostHog + GA4 | Loaded in both Next.js (via Script) and React SPA (via provider) |
| Deployment | Vercel (Next.js) + Cloudflare Pages (React SPAs) | Optimal per runtime |
| Queues | BullMQ (Redis-backed) | Heavy jobs from Next.js API |
| Storage | Cloudflare R2 | Invoices, certificates, bulk exports |

---

## 6. Storefront — Customer-Facing Features

> **App boundary note:** All pages in sections 6.1–6.5 are rendered by **Next.js** (ISR/SSG). Interactive overlays (cart drawer, wishlist toggle, quick-add button) are React components loaded client-side as micro-frontend islands within the Next.js pages. Full interactive flows (cart page, checkout) redirect to the **React SPA** at `/app/*`.

### 6.1 Homepage

**Rendered by: Next.js ISR (revalidate: 5 min)**

**Requirements:**
- Full-viewport hero section: auto-playing video (muted) or full-bleed image with overlay text + CTA
- Scrolling marquee banner for announcements (free shipping thresholds, sale, new arrivals)
- Featured collection grid (2–4 collections with hover animation)
- "New Arrivals" horizontal scroll section
- Trending / bestseller carousel with quick-add to cart (quick-add opens React cart drawer island)
- Brand story editorial block (image + copy + link to About)
- Instagram/UGC feed section (latest 8–12 posts)
- Trust bar: Hallmark Certified, Free Shipping, Easy Returns, Secure Payment
- Press/media logos strip
- Email capture pop-up (React island — exit-intent or timed, 10s delay; dismissable)
- Testimonials / star rating strip

**Performance:** LCP < 2.5s. Hero video lazy-loads below-fold. All images via Cloudinary with `srcset`.

---

### 6.2 Collection / Category Pages

**Rendered by: Next.js ISR (revalidate: 5 min)**

- URL structure: `/collections/[slug]`
- Collection hero: editorial image + title + short description (from Sanity)
- **Filter sidebar (desktop) / Filter drawer (mobile):**
  - Implemented as React island (client-side); filter state synced to URL query params via `nuqs`
  - Metal Type: Gold (14K, 18K, 22K), Silver, Platinum, Rose Gold
  - Stone Type: Diamond, Ruby, Emerald, Sapphire, Pearl, No Stone
  - Price Range: slider (min/max)
  - Occasion: Wedding, Engagement, Daily Wear, Gifting, Festive
  - Gender: Women, Men, Unisex, Kids
  - Certification: GIA, IGI, BIS Hallmark
  - Weight Range, Rating, Availability, Discount toggles
- **Sort options:** Featured, Newest, Price ↑↓, Bestselling, Rating, Discount
- **View toggle:** 2/3/4-column (desktop); 1/2-column (mobile)
- **Product card:** primary + alternate image on hover; price with strikethrough; variant swatches; wishlist heart (React island); quick-add (React island); New/Low Stock/Sale badges
- Infinite scroll (React island managing pagination state)
- Active filter chips (React island)
- SEO-friendly pagination via `rel="next"/"prev"` canonical links for crawlers

---

### 6.3 Product Detail Page (PDP)

**Rendered by: Next.js ISR (revalidate: 10 min)**
**Interactive elements: React islands injected into the static page**

**Media Gallery (React island):**
- Min 5 images: front, back, side, on-model, macro close-up
- Desktop: vertical thumbnail strip + large primary viewer with scroll-zoom
- Mobile: full-width swipeable carousel (Embla Carousel)
- 360° spin viewer; product video (auto-play muted)
- Pinch-to-zoom on mobile

**Product Info (Next.js SSR — static HTML):**
- Product name (H1), collection name, price with sale callout
- Metal/stone/certification summary as static copy
- Schema.org Product structured data injected server-side

**Variant Selector (React island):**
- Cascading selectors: Metal → Purity → Stone/Colour → Size
- Metal swatches with availability-awareness
- Real-time price update on selection
- "Only 2 left" stock badge updates client-side

**Add-to-Cart / Wishlist (React island):**
- Add to Cart → opens React cart drawer (no page navigation)
- Buy Now → navigates to `/app/checkout` (React SPA)
- Wishlist heart → auth check → toggle (or redirect to login)

**Personalisation Panel (React island):**
- Engraving text input, font selector, live preview
- Available only on customisable products

**Certifications, Accordion, Reviews — static HTML from Next.js ISR**

**Gold Rate Display (React island):**
- Fetches live gold rate from `/api/v1/gold-rate` client-side (not ISR — must be current)
- Shows today's rate + making charge breakdown

**EMI Calculator (React island):**
- Interactive EMI slider; calls Razorpay EMI API

**Review section:**
- Rating summary + top 3 reviews: **static HTML** from Next.js ISR
- "Load more reviews" + review submission form: **React island**

---

### 6.4 Search

**Search results page: Next.js SSR at `/search?q=...`**
**Search overlay: React island injected into Next.js layout**

- Instant / predictive search: Algolia client called directly from React island (debounced 250ms)
- Full results page: SSR render of first page for SEO; subsequent pages client-side via Algolia
- Filters on search results: React island (same pattern as collection page)

---

### 6.5 Editorial & CMS Pages

**Rendered by: Next.js ISR**

- `/journal` — blog listing from Sanity CMS
- `/journal/[slug]` — full article with shoppable image tags (React island for the "add to cart" overlays)
- Lookbook pages, About, Sustainability, FAQ, Size Guides — all Next.js ISR from Sanity content
- Size guide interactive tools (ring sizer, chain length guide) — React islands

---

### 6.6 Functional App Pages (React SPA — `/app/*`)

**Served by: React 18 + Vite SPA hosted on Cloudflare Pages**

These pages have no SEO value and are fully client-rendered:

| Route | Feature |
|-------|---------|
| `/app/cart` | Full cart page |
| `/app/checkout` | Multi-step checkout (address → shipping → payment) |
| `/app/checkout/confirmation` | Order confirmation |
| `/app/account` | Account dashboard overview |
| `/app/account/orders` | Order history |
| `/app/account/orders/:id` | Order detail + return initiation |
| `/app/account/wishlist` | Saved products |
| `/app/account/addresses` | Manage addresses |
| `/app/account/profile` | Edit profile |
| `/app/account/rewards` | Loyalty points + tier |
| `/app/account/security` | Password, 2FA |
| `/app/track/:orderNumber` | Public order tracking (no auth) |
| `/app/gift-finder` | Interactive quiz |
| `/app/book-appointment` | Virtual consultation booking |

---

## 7. Product Catalogue & Inventory

*(Unchanged from v1.0 — data model is backend-independent)*

### 7.1 Product Data Model

```typescript
Product {
  id: UUID
  sku: string
  name: string
  slug: string
  description: RichText          // Sanity portable text
  shortDescription: string

  basePrice: Decimal
  salePrice: Decimal?
  costPrice: Decimal
  taxClass: enum(GST_3, GST_5, GST_12, GST_18)

  categoryId: UUID
  collectionIds: UUID[]
  tags: string[]
  occasion: string[]
  gender: enum(WOMEN, MEN, UNISEX, KIDS)

  metalType: enum(GOLD, SILVER, PLATINUM, ROSE_GOLD, WHITE_GOLD)
  metalPurity: string
  metalWeight: Decimal
  grossWeight: Decimal
  stoneTypes: string[]
  stoneCarat: Decimal?
  stoneCut: string?
  stoneClarity: string?
  stoneColour: string?
  certificationNumber: string?
  certificationBody: enum(GIA, IGI, HRD, BIS, NONE)
  certificationDocUrl: string?

  isCustomisable: boolean
  customisationConfig: JSON?

  variants: ProductVariant[]
  media: ProductMedia[]

  metaTitle: string?
  metaDescription: string?
  canonicalUrl: string?
  structuredData: JSON?          // Schema.org Product markup

  status: enum(DRAFT, ACTIVE, ARCHIVED)
  isFeatured: boolean
  isNewArrival: boolean
  publishedAt: DateTime?

  createdAt: DateTime
  updatedAt: DateTime
}
```

### 7.2 Categories & Collections

**Categories** (hierarchical, up to 3 levels — same as v1.0):
Rings, Necklaces, Earrings, Bracelets, Anklets, Nose Pins, Mangalsutra, Men's Jewellery

**Collections** (merchandising, cross-category — same as v1.0)

### 7.3 Inventory Management

- Real-time inventory at variant level
- Reserved stock system (decremented at checkout start, released after 15 min on payment failure)
- Oversell protection; low stock alerts; bulk CSV/XLSX import/export
- Inventory audit log; reorder point tracking; dead stock report

---

## 8. Shopping Cart & Checkout

> **Architecture note:** The cart drawer is a React component island injected into Next.js pages. The full cart page and entire checkout flow live in the React SPA at `/app/cart` and `/app/checkout`.

### 8.1 Cart (React SPA + React Island in Next.js)

- **Cart Drawer (island in Next.js pages):**
  - Slide-in panel from right; triggered by "Add to Cart" on any Next.js page
  - Reads cart from `/api/v1/cart` on mount; mutations via React Query + optimistic updates
  - Shows items, subtotal, "View Cart" (→ `/app/cart`) and "Checkout" (→ `/app/checkout`)
  - Coupon code input, gifting option toggle
  - "You might also like" recommendation row

- **Full Cart Page (`/app/cart` — React SPA):**
  - Per-line-item: image, name, variant, customisation note, qty selector, remove
  - Out-of-stock / price-change warnings fetched on mount
  - Cart summary with apply-coupon, gift options, estimated shipping
  - Persistent cart (server-side Redis + DB, 30-day TTL)
  - Guest cart (session cookie); merged on login

### 8.2 Checkout Flow (React SPA — `/app/checkout`)

Single-page multi-step checkout rendered entirely in the React SPA.

**Step 1 — Contact & Delivery:**
- Guest email / logged-in detection
- Address form (React Hook Form + Zod validation)
- Google Places autocomplete for address input
- Saved addresses for logged-in users
- Delivery method selector with live rate calculation from `/api/v1/shipping/rates`

**Step 2 — Payment:**
- Stripe Elements (embedded React component; PCI-compliant)
- Razorpay React SDK for INR payments
- Payment methods: Card, UPI, Net Banking, EMI, BNPL, Wallets, COD
- Order summary sticky sidebar
- "Place Order" button labelled with total amount

**Step 3 — Confirmation (`/app/checkout/confirmation`):**
- Thank-you screen with order ID and summary
- "Track Your Order" link → `/app/track/:id`
- Recommended products from Algolia Recommend API
- Immediate email + WhatsApp confirmation triggered server-side

### 8.3 Checkout Optimisations

- Auto-fill via browser `autocomplete` attributes
- Progress indicator (3-step stepper component)
- Abandoned cart recovery: Klaviyo webhook fires when cart is created and checkout not completed (T+1h, T+24h, T+72h email; T+30min SMS)
- Exit-intent prompt on checkout tab close

---

## 9. User Accounts & Authentication

### 9.1 Authentication

Auth is managed by **Auth.js (NextAuth v5)** running in Next.js API routes. The React SPA consumes the resulting JWT via HTTP-only cookie.

- **Sign Up / Login:** Email + Password, Magic Link, Google OAuth, Facebook OAuth, Apple Sign-In, OTP (phone)
- **React SPA auth state:** On mount, React SPA calls `/api/v1/customers/me`; if 401 → redirect to Next.js login page at `/login` (with `callbackUrl=/app/...`)
- **Post-login redirect:** Next.js `/login` page sets cookie and redirects to `callbackUrl` which lands back in the React SPA
- **2FA:** TOTP (optional); enforced for admin users
- **Session:** JWT access token (15min) + HTTP-only refresh token cookie (30 days)

### 9.2 Customer Account Dashboard (React SPA — `/app/account/*`)

Fully client-rendered. All data fetched via TanStack Query from `/api/v1/*`.

- **Overview:** Recent orders, loyalty points, wishlist count, greeting
- **Orders:** Full history; status badges; invoice download
- **Order Detail:** Full breakdown; return/exchange CTA → return flow (React multi-step form)
- **Wishlist:** Saved products; add to cart; availability indicator
- **Addresses:** CRUD; default flag
- **Profile:** Name, email, phone, birthday, anniversary
- **Rewards:** Points balance, tier progress bar, transaction history, redemption
- **Referrals:** Unique code, share link, earnings tracker
- **Security:** Password change, 2FA toggle, active sessions
- **Delete Account:** GDPR-compliant soft delete

---

## 10. Order Management

*(Order lifecycle and data model unchanged from v1.0)*

Order status flow:
```
PENDING_PAYMENT → PAYMENT_CONFIRMED → PROCESSING → PACKED →
SHIPPED → OUT_FOR_DELIVERY → DELIVERED → [RETURN_REQUESTED →
RETURN_PICKED → RETURN_RECEIVED → REFUNDED]
```

Customer-facing order management lives in the React SPA (`/app/account/orders`).
Admin-facing order management lives in the React Admin SPA (`/admin/orders`).
Order events (status changes) trigger emails from Next.js API webhook handlers.

---

## 11. Jewellery-Specific Features

*(All features unchanged from v1.0; implementation notes updated)*

### 11.1 Virtual Try-On (AR)
- React island on Next.js PDP (Phase 1: static overlay); React component in React SPA product view (Phase 2: live WebAR)

### 11.2 Ring Sizer
- React island on Next.js PDP (all 3 methods: printable PDF, on-screen coin drag, diameter input)

### 11.3 Personalisation / Customisation Engine
- React island on Next.js PDP; customisation config passed to cart item via API

### 11.4 Certification & Authenticity
- Certificate details statically rendered on Next.js PDP (ISR); QR code verification page at `/cert/[id]` (Next.js SSG)

### 11.5 Gold Rate Integration
- Fetched by Next.js API cron (`/api/cron/gold-rate` daily); displayed via React island on PDP (client fetch for freshness)

### 11.6 Occasion & Gift Finder
- Full interactive quiz at `/app/gift-finder` (React SPA)

### 11.7 Complete the Look / Style Curation
- "Pair with this" row: Next.js ISR (Algolia Recommend, pre-fetched server-side)
- "Build Your Stack": React island with interactive multi-select

### 11.8 Virtual Appointment Booking
- React SPA at `/app/book-appointment`

---

## 12. Admin Panel

**Rendered by: React 18 + Vite SPA at `/admin/*`**
**Hosted on: Cloudflare Pages (separate deployment)**
**Auth: Admin JWT via HTTP-only cookie set by `/api/admin/auth`**

The admin panel is a fully client-rendered React SPA. No SSR is needed — admin users are authenticated, speed of interaction matters more than initial load time, and the complexity of admin forms (variant matrix builder, bulk editors, analytics charts) is far better served by React than by SSR.

### 12.1 Dashboard (React SPA)
- KPI cards (Revenue, Orders, Sessions, Conversion Rate) via TanStack Query polling every 60s
- Revenue chart (Recharts), top products, low stock alerts, recent orders table (TanStack Table)
- Announcement banner editor

### 12.2 Product Management (React SPA)
- TanStack Table with virtualisation for large catalogues
- Product editor: TipTap rich text, React Dropzone + Cloudinary upload, variant matrix builder
- Bulk actions, CSV import/export

### 12.3 Order Management (React SPA)
- Real-time order queue (React Query with 30s polling)
- Order detail: status timeline, refund flow (React multi-step form), shipping label generation

### 12.4 Customer Management (React SPA)
- Customer list with TanStack Table; Customer profile with full order history and CRM notes

### 12.5 Returns & Refund Management (React SPA)
- Returns pipeline view; approve/reject flow; Shiprocket pickup scheduling

### 12.6 Promotions & Discounts (React SPA)
- Coupon CRUD; Flash sale scheduler; Automatic discount rules builder

### 12.7 Content Management (React SPA)
- Hero banner manager; Homepage section editor; Navigation editor

### 12.8 Analytics (React SPA)
- Recharts dashboards for sales, inventory, customer, marketing, search reports
- All data from `/api/admin/analytics/*` endpoints

### 12.9 Settings & User Management (React SPA)
- Store config, shipping zones, payment settings, email templates, RBAC user management

---

## 13–19. Marketing, Search, Payments, Shipping, Support, Analytics, i18n

*(All requirements unchanged from v1.0 — implementation surfaces noted inline)*

**Marketing emails / SMS / push:** Triggered from Next.js API routes (Klaviyo webhooks, Resend, MSG91)
**Loyalty programme:** State managed server-side; displayed in React SPA `/app/account/rewards`
**Algolia search:** Index managed via Next.js API; queried directly from React islands and React SPA
**Payments:** Stripe Elements + Razorpay SDK rendered in React SPA checkout; webhooks handled in Next.js API routes
**Shipping rate calculation:** `/api/v1/shipping/rates` called from React SPA checkout
**Customer support chat widget (Intercom):** Loaded in both Next.js layout and React SPA layout
**Analytics events:** GA4 + PostHog loaded in Next.js `_document` and React SPA `main.tsx`
**i18n:** Next.js built-in i18n routing for SEO pages; React SPA uses i18next

---

## 20. Performance & Scalability

### 20.1 Rendering Strategy by Page

| Page | App | Strategy | Cache TTL |
|------|-----|----------|-----------|
| Homepage | **Next.js** | ISR | 5 min |
| Collection pages | **Next.js** | ISR | 5 min |
| Product Detail Pages | **Next.js** | ISR | 10 min |
| Blog / Editorial | **Next.js** | ISR | 60 min |
| Search results (first page) | **Next.js** | SSR | No cache |
| About, FAQ, static pages | **Next.js** | SSG | Build-time |
| Sitemap, robots.txt | **Next.js** | Static | 24 hours |
| Cart | **React SPA** | CSR | API-driven |
| Checkout | **React SPA** | CSR | API-driven |
| Account / Orders | **React SPA** | CSR | TanStack Query |
| Admin panel | **React Admin SPA** | CSR | TanStack Query |

### 20.2 React SPA Performance

- **Code splitting:** React Router route-level code splitting via `lazy()` + `Suspense`; each route loaded on demand
- **Initial load:** Only `main.tsx` + route chunk loaded; subsequent routes pre-fetched on link hover via `prefetch`
- **Cloudflare Pages hosting:** React SPA assets served from 300+ edge PoPs; global < 50ms asset delivery
- **Service Worker (PWA):** Caches SPA shell and static assets; offline fallback for account/wishlist read-only views
- **TanStack Query cache:** In-memory cache of API responses; background refetch; stale-while-revalidate

### 20.3 Next.js SEO Layer Performance

- ISR cache on Vercel's edge; revalidated on product/collection admin publish via `revalidateTag()`
- Next.js `<Image>` component: automatic WebP/AVIF, `srcset`, blur placeholder (base64 LQIP from Cloudinary)
- Hero images: `priority` prop (preloaded); below-fold: lazy
- All static assets (JS, CSS, fonts): 1-year Cache-Control on Cloudflare

### 20.4 Cart Drawer Island Performance

The React cart drawer island injected into Next.js pages must not block Next.js page rendering:
- Loaded via dynamic import with `next/dynamic` and `ssr: false`
- React bundle for islands served from same Cloudflare CDN; cached aggressively
- Island hydrates client-side after Next.js page is interactive

### 20.5 Scalability Targets

- **Load testing:** 10,000 concurrent sessions; 500 orders/minute (Diwali peak)
- **Next.js:** Vercel serverless auto-scales; ISR cache absorbs catalogue traffic spikes
- **React SPA:** Static files; scales infinitely on Cloudflare Pages
- **Database:** PgBouncer / Supabase pooler; max 20 connections per serverless instance
- **Queue:** BullMQ workers on Railway/Render for heavy jobs (invoice gen, bulk import, report export)

---

## 21. Security & Compliance

### 21.1 Auth Architecture (Cross-App)

- Auth.js runs in Next.js; issues JWT as HTTP-only, SameSite=Strict, Secure cookie on `yourbrand.com`
- React SPA reads auth state by calling `/api/v1/customers/me` on mount
- React Admin SPA reads auth state by calling `/api/admin/me`; admin role validated server-side
- Both SPAs redirect to `/login` (Next.js page) on 401 response
- CORS: Next.js API accepts requests from `yourbrand.com` only (same-origin)
- Rate limiting on all auth endpoints: Upstash Ratelimit in Next.js middleware
- 2FA enforced for all admin accounts

### 21.2–21.5 Data Security, Application Security, GDPR, Business Continuity

*(Unchanged from v1.0)*

---

## 22. SEO & Content Marketing

### 22.1 Technical SEO (Next.js)

- **URL structure:** `/products/[slug]`, `/collections/[slug]`, `/journal/[slug]`, `/search?q=...`
- **Schema.org structured data:** Product (with aggregateRating, offers), BreadcrumbList, BlogPosting, Organization — all server-rendered in Next.js ISR pages
- **Canonical tags:** auto-generated; override available in Sanity CMS
- **XML Sitemaps:** auto-generated via `next-sitemap`; updated on product publish webhook
- **Robots.txt:** blocks `/app/*`, `/admin/*`, `/api/*`; allows all public Next.js routes
- **Open Graph + Twitter Cards:** Next.js Metadata API per page with Cloudinary OG images
- **Core Web Vitals:** Measured on Next.js pages only (React SPA pages are not indexed); Vercel Analytics + Sentry tracing

### 22.2 Why the React SPA Does Not Hurt SEO

- All product, collection, and editorial pages are on Next.js with full SSR/ISR HTML — these are the pages Google indexes
- `/app/*` routes are excluded from sitemap and blocked in robots.txt
- The React SPA never appears in Google search results; it handles post-discovery interactions only
- Social sharing links always point to Next.js product/collection URLs

---

## 23. Integrations & APIs

*(P0/P1/P2 priorities unchanged; implementation surface noted)*

| Integration | Surface | Priority |
|------------|---------|----------|
| Stripe | React SPA Checkout + Next.js Webhooks | P0 |
| Razorpay | React SPA Checkout + Next.js Webhooks | P0 |
| Algolia | React Islands (search) + React SPA + Next.js API (indexing) | P0 |
| Cloudinary | Next.js Image + React SPA uploader (admin) | P0 |
| Shiprocket | Next.js API Routes only | P0 |
| Sanity.io | Next.js ISR pages + Next.js API webhook | P0 |
| Resend / React Email | Next.js API Routes only | P0 |
| Auth.js | Next.js API Routes; cookie shared with React SPA | P0 |
| GA4 | Next.js `<Script>` + React SPA provider | P0 |
| Klaviyo | Next.js API Routes (webhook triggers) | P1 |
| Freshdesk | React SPA account area + Intercom widget in both apps | P1 |
| Intercom | Loaded in Next.js layout + React SPA layout | P1 |
| PostHog | Both apps | P1 |
| Sentry | Separate projects: `web-nextjs` and `web-react` | P1 |
| Zakeke (3D/AR) | React Island on Next.js PDP + React SPA | P2 |
| Meta Commerce Manager | Next.js product feed generation | P2 |
| Google Merchant Centre | Next.js product feed generation | P2 |

---

## 24. Development Phases & Milestones

### Phase 1 — MVP (Weeks 1–12)

- [ ] Monorepo setup: Turborepo + pnpm workspaces; `apps/web` (Next.js), `apps/app` (React SPA), `apps/admin` (React Admin), `packages/db`, `packages/ui`, `packages/types`
- [ ] Shared Prisma schema + PostgreSQL; Redis (Upstash)
- [ ] Auth.js in Next.js; JWT cookie shared with React SPAs
- [ ] Next.js: Homepage, Collection pages, PDP (ISR), Blog (ISR), Search (SSR), static pages
- [ ] React islands: Cart drawer, Variant selector, Quick-add, Wishlist button, Search overlay, Filter sidebar
- [ ] React SPA (`/app/*`): Cart page, Checkout (3-step), Order confirmation, Account (orders, profile, addresses)
- [ ] React Admin (`/admin/*`): Dashboard, Product management, Order management, Customer management
- [ ] Payments: Stripe Elements + Razorpay in React SPA checkout; webhooks in Next.js API
- [ ] Shipping: Shiprocket integration in Next.js API; rate display in React SPA
- [ ] Transactional email: Resend + React Email templates from Next.js API
- [ ] Algolia: Product indexing via Next.js API; search island + search results page
- [ ] Cloudinary: Image upload in Next.js admin API; Next.js Image on all pages
- [ ] SEO: Sitemap, robots.txt, Schema.org, OG tags on all Next.js pages
- [ ] Sanity CMS: Blog, homepage banners, editorial pages

**Milestone: Production launch**

---

### Phase 2 — Growth (Weeks 13–22)

- [ ] Loyalty & rewards (React SPA `/app/account/rewards`)
- [ ] Coupons & promotions (React Admin + checkout integration)
- [ ] Product reviews with photos (React island on Next.js PDP + React SPA form)
- [ ] Email automation flows (Klaviyo)
- [ ] Ring sizer React island; Gift finder React SPA
- [ ] AR try-on (static photo) React island on PDP
- [ ] Referral programme (React SPA)
- [ ] Multi-currency display (React island in Next.js header)
- [ ] Live gold rate display (React island on PDP)
- [ ] Gift cards (React Admin issuance + React SPA redemption at checkout)
- [ ] WhatsApp notifications via MSG91

---

### Phase 3 — Scale (Weeks 23–36)

- [ ] Live WebAR try-on (Zakeke SDK in React island)
- [ ] 3D product configurator (Zakeke)
- [ ] Subscription box (Stripe Subscriptions via React SPA)
- [ ] React Native mobile app (code-shares React SPA logic via shared packages)
- [ ] Hindi / regional language (Next.js i18n + i18next in React SPA)
- [ ] B2B wholesale portal (new React SPA route group `/b2b/*`)
- [ ] Instagram Shopping + Google Shopping feeds (Next.js API product feed endpoints)
- [ ] Blockchain provenance (Everledger)
- [ ] Advanced analytics: cohort retention, LTV prediction

---

## 25. Non-Functional Requirements

| Requirement | Specification |
|------------|--------------|
| Availability | 99.9% uptime |
| Performance (Next.js pages) | LCP < 2.5s (p75); Lighthouse > 90 |
| Performance (React SPA) | First meaningful paint < 1.5s (cached) |
| API response time | P95 < 300ms |
| Scalability | 10,000 concurrent users; 500 orders/minute |
| Accessibility | WCAG 2.1 AA on both apps |
| Browser support | Chrome 90+, Safari 14+, Firefox 90+, Edge 90+; iOS 14+; Android 8+ |
| Code quality | 80%+ test coverage on cart, checkout, auth, order flows |
| Documentation | OpenAPI 3.0 for all API routes; ADRs for architecture decisions |

---

## 26. Open Questions & Future Scope

### Open Questions

1. **Cart drawer vs redirect:** Should "Add to Cart" on Next.js pages open a React cart drawer island, or always navigate to `/app/cart`? (Recommendation: island for better UX on PDP and collection pages; redirect on mobile if drawer hurts layout)
2. **Island bundling:** Should React islands (cart drawer, variant selector, filter sidebar) be shipped as a single shared bundle or as individual micro-bundles? (Recommendation: single shared bundle, code-split by island via dynamic imports)
3. **Deployment target for React SPAs:** Cloudflare Pages (recommended — edge CDN, 0ms TTFB for static) vs Vercel (simpler if already on Vercel for Next.js)?
4. **Auth redirect UX:** When a guest user on a Next.js PDP clicks "Wishlist," what is the UX? Options: (a) modal login prompt (React island), (b) redirect to `/login?callbackUrl=...`, (c) add to guest wishlist and prompt on checkout. (Recommendation: modal login prompt)
5. **COD policy, returns window, B2B scope** — same as v1.0 open questions

### Future Scope (Post Phase 3)

*(Same as v1.0: virtual showroom, NFT certificates, AI design studio, POS integration, rental model, resale marketplace, React Native app, voice commerce, live commerce)*

---

*Document Version 2.0 — Updated to reflect React (functional) + Next.js (SEO) hybrid architecture.*  
*Companion documents: PRD-Appendices.md · PRD-Technical-Implementation.md*
