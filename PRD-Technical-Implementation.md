# Technical Implementation Guide
## Jewellery Brand E-Commerce Platform

---

**Companion to:** PRD.md + PRD-Appendices.md  
**Audience:** Engineering team (frontend, backend, DevOps)  
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Redis · Algolia · Stripe · Razorpay

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Environment Configuration](#2-environment-configuration)
3. [Component Architecture](#3-component-architecture)
4. [Server vs Client Components Strategy](#4-server-vs-client-components-strategy)
5. [Data Fetching Patterns](#5-data-fetching-patterns)
6. [State Management](#6-state-management)
7. [Key Feature Implementation Guides](#7-key-feature-implementation-guides)
8. [API Route Conventions](#8-api-route-conventions)
9. [Middleware Architecture](#9-middleware-architecture)
10. [Testing Strategy](#10-testing-strategy)
11. [CI/CD Pipeline](#11-cicd-pipeline)
12. [Performance Optimisation Playbook](#12-performance-optimisation-playbook)
13. [Admin Panel Architecture](#13-admin-panel-architecture)
14. [Error Handling Conventions](#14-error-handling-conventions)
15. [Logging & Observability](#15-logging--observability)
16. [Developer Onboarding Checklist](#16-developer-onboarding-checklist)

---

## 1. Project Structure

```
jewellery-platform/
│
├── apps/
│   ├── web/                          # Next.js storefront (primary app)
│   └── admin/                        # Next.js admin panel (separate Next.js app)
│
├── packages/
│   ├── db/                           # Prisma schema + generated client + seed
│   ├── ui/                           # Shared UI component library (shadcn-based)
│   ├── config/                       # Shared ESLint, Tailwind, TypeScript configs
│   ├── types/                        # Shared TypeScript types across apps
│   └── utils/                        # Pure utility functions (formatters, validators)
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Test + lint on every PR
│       ├── deploy-staging.yml        # Auto-deploy to staging on merge to develop
│       └── deploy-production.yml     # Deploy to production on release tag
│
├── turbo.json                        # Turborepo pipeline config
├── package.json                      # Root workspace config
└── pnpm-workspace.yaml               # Monorepo workspace definition
```

### Storefront App (`apps/web`) — Detailed

```
apps/web/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (storefront)/             # Route group — customer-facing layout
│   │   │   ├── layout.tsx            # Storefront root layout (header, footer, cart drawer)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── collections/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Collection listing page
│   │   │   ├── products/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Product detail page
│   │   │   ├── search/
│   │   │   │   └── page.tsx          # Search results page
│   │   │   ├── cart/
│   │   │   │   └── page.tsx          # Full cart page
│   │   │   ├── checkout/
│   │   │   │   ├── layout.tsx        # Minimal checkout layout
│   │   │   │   ├── page.tsx          # Checkout flow
│   │   │   │   └── confirmation/
│   │   │   │       └── page.tsx      # Order confirmation
│   │   │   ├── account/
│   │   │   │   ├── layout.tsx        # Account sidebar layout
│   │   │   │   ├── page.tsx          # Account overview
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx      # Order history
│   │   │   │   │   └── [id]/page.tsx # Order detail
│   │   │   │   ├── wishlist/page.tsx
│   │   │   │   ├── addresses/page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── rewards/page.tsx
│   │   │   │   └── security/page.tsx
│   │   │   ├── journal/
│   │   │   │   ├── page.tsx          # Blog listing
│   │   │   │   └── [slug]/page.tsx   # Blog article
│   │   │   ├── gift-finder/page.tsx
│   │   │   ├── track/[orderNumber]/page.tsx
│   │   │   └── [slug]/page.tsx       # CMS pages (About, FAQ, Sustainability)
│   │   │
│   │   ├── (auth)/                   # Auth route group — no header/footer
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── verify-email/page.tsx
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── v1/
│   │   │   │   ├── products/
│   │   │   │   │   ├── route.ts      # GET /api/v1/products
│   │   │   │   │   └── [slug]/route.ts
│   │   │   │   ├── collections/route.ts
│   │   │   │   ├── cart/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── items/route.ts
│   │   │   │   │   ├── items/[itemId]/route.ts
│   │   │   │   │   └── coupon/route.ts
│   │   │   │   ├── orders/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts
│   │   │   │   │       ├── cancel/route.ts
│   │   │   │   │       └── returns/route.ts
│   │   │   │   ├── customers/
│   │   │   │   │   └── me/
│   │   │   │   │       ├── route.ts
│   │   │   │   │       ├── addresses/route.ts
│   │   │   │   │       ├── wishlist/route.ts
│   │   │   │   │       └── loyalty/route.ts
│   │   │   │   ├── search/route.ts
│   │   │   │   ├── shipping/
│   │   │   │   │   ├── rates/route.ts
│   │   │   │   │   └── serviceability/route.ts
│   │   │   │   ├── gold-rate/route.ts
│   │   │   │   ├── reviews/route.ts
│   │   │   │   └── health/route.ts
│   │   │   │
│   │   │   ├── auth/[...nextauth]/route.ts  # Auth.js handler
│   │   │   │
│   │   │   └── webhooks/
│   │   │       ├── stripe/route.ts
│   │   │       ├── razorpay/route.ts
│   │   │       └── shiprocket/route.ts
│   │   │
│   │   ├── sitemap.ts                # Auto-generated XML sitemap
│   │   ├── robots.ts                 # robots.txt generation
│   │   ├── manifest.ts               # PWA manifest
│   │   ├── not-found.tsx             # Global 404 page
│   │   └── error.tsx                 # Global error boundary
│   │
│   ├── components/                   # React components
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── NavMenu.tsx
│   │   │   │   ├── MegaMenu.tsx
│   │   │   │   ├── MobileDrawer.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── NewsletterForm.tsx
│   │   │   ├── CartDrawer/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   └── AnnouncementBar.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedCollections.tsx
│   │   │   ├── NewArrivalsCarousel.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── InstagramFeed.tsx
│   │   │   └── BrandStory.tsx
│   │   │
│   │   ├── catalogue/
│   │   │   ├── ProductCard/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductCardSkeleton.tsx
│   │   │   │   └── QuickAddButton.tsx
│   │   │   ├── ProductGrid/
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   └── InfiniteProductGrid.tsx
│   │   │   ├── Filters/
│   │   │   │   ├── FilterSidebar.tsx     # Desktop
│   │   │   │   ├── FilterDrawer.tsx      # Mobile
│   │   │   │   ├── PriceRangeSlider.tsx
│   │   │   │   ├── CheckboxFilter.tsx
│   │   │   │   ├── ColourSwatchFilter.tsx
│   │   │   │   └── ActiveFilterChips.tsx
│   │   │   ├── SortDropdown.tsx
│   │   │   └── CollectionHero.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── MediaGallery/
│   │   │   │   ├── MediaGallery.tsx
│   │   │   │   ├── ImageViewer.tsx
│   │   │   │   ├── ThumbnailStrip.tsx
│   │   │   │   └── ZoomModal.tsx
│   │   │   ├── VariantSelector/
│   │   │   │   ├── VariantSelector.tsx
│   │   │   │   ├── MetalSwatch.tsx
│   │   │   │   ├── SizeSelector.tsx
│   │   │   │   └── OptionButton.tsx
│   │   │   ├── PersonalisationPanel/
│   │   │   │   ├── PersonalisationPanel.tsx
│   │   │   │   ├── EngravingInput.tsx
│   │   │   │   └── FontPicker.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   ├── StockBadge.tsx
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── WishlistButton.tsx
│   │   │   ├── CertificationBadge.tsx
│   │   │   ├── GoldRateDisplay.tsx
│   │   │   ├── EMICalculator.tsx
│   │   │   ├── SizeGuideModal.tsx
│   │   │   ├── ProductAccordion.tsx
│   │   │   ├── ReviewSection/
│   │   │   │   ├── ReviewSection.tsx
│   │   │   │   ├── RatingSummary.tsx
│   │   │   │   ├── ReviewCard.tsx
│   │   │   │   └── ReviewForm.tsx
│   │   │   ├── RelatedProducts.tsx
│   │   │   └── RecentlyViewed.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartLineItem.tsx
│   │   │   ├── CartPriceSummary.tsx
│   │   │   ├── CouponInput.tsx
│   │   │   └── GiftOptions.tsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutStepper.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── ShippingMethodSelector.tsx
│   │   │   ├── PaymentForm/
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   ├── StripeCardElement.tsx
│   │   │   │   ├── RazorpayButton.tsx
│   │   │   │   ├── UPIForm.tsx
│   │   │   │   └── CODOption.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── CheckoutTrustSignals.tsx
│   │   │
│   │   ├── account/
│   │   │   ├── AccountSidebar.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── AddressCard.tsx
│   │   │   ├── LoyaltyDashboard.tsx
│   │   │   └── ReturnInitiator.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchOverlay.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── SearchSuggestions.tsx
│   │   │   └── SearchResultsPage.tsx
│   │   │
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── Drawer.tsx
│   │       ├── Badge.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Breadcrumbs.tsx
│   │       ├── Rating.tsx
│   │       ├── Pagination.tsx
│   │       ├── InfiniteScroll.tsx
│   │       ├── OptimisedImage.tsx
│   │       ├── RichText.tsx           # Render Sanity/Tiptap portable text
│   │       ├── Toast.tsx
│   │       ├── Tooltip.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/                          # Service clients and utilities
│   │   ├── db.ts                     # Prisma singleton
│   │   ├── redis.ts                  # Upstash Redis client
│   │   ├── algolia.ts                # Algolia search client
│   │   ├── cloudinary.ts             # Cloudinary SDK config
│   │   ├── stripe.ts                 # Stripe server client
│   │   ├── razorpay.ts               # Razorpay client
│   │   ├── sanity/
│   │   │   ├── client.ts             # Sanity client
│   │   │   ├── queries.ts            # GROQ queries
│   │   │   └── image.ts              # Sanity image URL builder
│   │   ├── email/
│   │   │   ├── client.ts             # Resend client
│   │   │   └── templates/            # React Email templates
│   │   │       ├── OrderConfirmation.tsx
│   │   │       ├── ShippingNotification.tsx
│   │   │       ├── ReturnConfirmation.tsx
│   │   │       ├── PasswordReset.tsx
│   │   │       └── WelcomeSeries.tsx
│   │   ├── shiprocket.ts             # Shiprocket API wrapper
│   │   ├── auth.ts                   # Auth.js config
│   │   ├── ratelimit.ts              # Upstash rate limit helpers
│   │   └── analytics.ts             # PostHog + GA4 event helpers
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useCart.ts                # Cart state + mutations
│   │   ├── useWishlist.ts            # Wishlist state + mutations
│   │   ├── useSearch.ts              # Search state + Algolia calls
│   │   ├── useFilters.ts             # Filter + sort URL state (nuqs)
│   │   ├── useMediaQuery.ts          # Responsive breakpoint detection
│   │   ├── useLocalStorage.ts        # Type-safe localStorage
│   │   ├── useIntersectionObserver.ts
│   │   ├── useDebounce.ts
│   │   ├── useScrollLock.ts          # For modals/drawers
│   │   └── useRecentlyViewed.ts      # Product view history
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── cartStore.ts
│   │   ├── searchStore.ts
│   │   └── uiStore.ts                # Drawer/modal open states
│   │
│   ├── actions/                      # Next.js Server Actions
│   │   ├── cart.ts                   # addToCart, updateQty, removeItem
│   │   ├── checkout.ts               # createOrder, processPayment
│   │   ├── account.ts                # updateProfile, addAddress
│   │   ├── wishlist.ts               # toggle wishlist
│   │   └── reviews.ts                # submitReview
│   │
│   ├── types/                        # TypeScript types (storefront-specific)
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── config/
│   │   ├── site.ts                   # Site metadata, base URL, socials
│   │   ├── nav.ts                    # Header/footer nav structure
│   │   └── filters.ts                # Filter option definitions
│   │
│   └── styles/
│       ├── globals.css               # Tailwind base + CSS variables (design tokens)
│       └── typography.css            # Prose styles for editorial content
│
├── public/
│   ├── icons/                        # Favicon set, PWA icons
│   ├── fonts/                        # Self-hosted font files (WOFF2)
│   └── images/                       # Static images (logos, fallbacks)
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── .env.example
```

---

## 2. Environment Configuration

### `.env.example` — Full variable reference

```bash
# ─── APP ────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://yourbrand.com
NEXT_PUBLIC_APP_NAME="Your Jewellery Brand"
NODE_ENV=production

# ─── DATABASE ────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/jewellery_prod?pgbouncer=true&connection_limit=1"
DATABASE_URL_UNPOOLED="postgresql://user:password@host:5432/jewellery_prod"
# ^ Unpooled URL required for Prisma migrations

# ─── REDIS ───────────────────────────────────────────────────────────
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxx"
# Session / cart TTL (seconds)
REDIS_CART_TTL=2592000        # 30 days
REDIS_SESSION_TTL=1296000     # 15 days

# ─── AUTH ────────────────────────────────────────────────────────────
NEXTAUTH_URL=https://yourbrand.com
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
# OAuth providers
GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxx"
FACEBOOK_CLIENT_ID="xxxx"
FACEBOOK_CLIENT_SECRET="xxxx"

# ─── PAYMENTS ────────────────────────────────────────────────────────
# Stripe
STRIPE_SECRET_KEY="sk_live_xxxx"
STRIPE_PUBLISHABLE_KEY="pk_live_xxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxx"
# Razorpay
RAZORPAY_KEY_ID="rzp_live_xxxx"
RAZORPAY_KEY_SECRET="xxxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxx"
RAZORPAY_WEBHOOK_SECRET="xxxx"

# ─── MEDIA ───────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="xxxx"
CLOUDINARY_API_SECRET="xxxx"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud"

# ─── SEARCH ──────────────────────────────────────────────────────────
ALGOLIA_APP_ID="xxxx"
ALGOLIA_ADMIN_API_KEY="xxxx"        # Server-side only — never expose
NEXT_PUBLIC_ALGOLIA_APP_ID="xxxx"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY="xxxx"  # Search-only key, safe to expose
ALGOLIA_PRODUCTS_INDEX="products_prod"

# ─── EMAIL ───────────────────────────────────────────────────────────
RESEND_API_KEY="re_xxxx"
EMAIL_FROM="orders@yourbrand.com"
EMAIL_REPLY_TO="support@yourbrand.com"

# ─── CMS ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SANITY_PROJECT_ID="xxxx"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="xxxx"             # Server-side write access
SANITY_WEBHOOK_SECRET="xxxx"

# ─── SHIPPING ────────────────────────────────────────────────────────
SHIPROCKET_EMAIL="logistics@yourbrand.com"
SHIPROCKET_PASSWORD="xxxx"
SHIPROCKET_CHANNEL_ID="xxxx"

# ─── SMS / WHATSAPP ──────────────────────────────────────────────────
MSG91_AUTH_KEY="xxxx"
MSG91_SENDER_ID="JWLBRD"
MSG91_OTP_TEMPLATE_ID="xxxx"
WATI_API_URL="https://live-mt-server.wati.io/xxxx"
WATI_ACCESS_TOKEN="xxxx"

# ─── ANALYTICS ───────────────────────────────────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-xxxx"
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxx"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# ─── MONITORING ──────────────────────────────────────────────────────
SENTRY_DSN="https://xxxx@o123.ingest.sentry.io/xxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxxx@o123.ingest.sentry.io/xxxx"
SENTRY_AUTH_TOKEN="xxxx"            # For source map upload in CI

# ─── RATE LIMITING ───────────────────────────────────────────────────
RATE_LIMIT_AUTH=20                  # req/min on auth endpoints
RATE_LIMIT_CART=60                  # req/min on cart mutations
RATE_LIMIT_CHECKOUT=10              # req/min on checkout
RATE_LIMIT_API=300                  # req/min on general API

# ─── FEATURE FLAGS ───────────────────────────────────────────────────
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_ENABLE_AR_TRYON=false
NEXT_PUBLIC_ENABLE_GOLD_RATE=true
NEXT_PUBLIC_ENABLE_COD=true
NEXT_PUBLIC_ENABLE_BNPL=true
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=2000

# ─── GOLD RATE ───────────────────────────────────────────────────────
GOLD_RATE_API_KEY="xxxx"           # IBJA or equivalent
GOLD_RATE_CRON_SECRET="xxxx"       # For secured cron endpoint

# ─── MISC ────────────────────────────────────────────────────────────
CRON_SECRET="xxxx"                 # Shared secret for all cron endpoints
ADMIN_JWT_SECRET="xxxx"            # Separate secret for admin JWTs
```

---

## 3. Component Architecture

### Naming Conventions

```
PascalCase for components:    ProductCard, CartDrawer, CheckoutStepper
camelCase for hooks:          useCart, useFilters, useDebounce
camelCase for actions:        addToCart, processPayment
SCREAMING_SNAKE for constants: MAX_CART_ITEMS, FREE_SHIPPING_THRESHOLD
kebab-case for CSS classes:   product-card__image, cart-drawer--open
```

### Component Template

Every component follows this structure:

```tsx
// components/catalogue/ProductCard/ProductCard.tsx

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/currency'
import { WishlistButton } from '@/components/product/WishlistButton'
import { QuickAddButton } from './QuickAddButton'
import type { ProductCardProps } from './ProductCard.types'

// ── Types ──────────────────────────────────────────────────────────────────
export interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    basePrice: number
    salePrice: number | null
    images: { url: string; altText: string }[]
    metalType: string
    metalPurity: string
    stock: number
    isNewArrival: boolean
    rating: number
    reviewCount: number
  }
  priority?: boolean      // true for above-fold images (LCP optimisation)
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────────
export const ProductCard: FC<ProductCardProps> = ({
  product,
  priority = false,
  className,
}) => {
  const isOnSale = product.salePrice !== null && product.salePrice < product.basePrice
  const isLowStock = product.stock > 0 && product.stock <= 3
  const isOutOfStock = product.stock === 0

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-white rounded-md overflow-hidden',
        'transition-shadow duration-250 hover:shadow-md',
        className,
      )}
    >
      {/* Media */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.altText ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-500',
              'group-hover:scale-105',
              // Crossfade to alternate image on hover (if available)
              product.images[1] && 'group-hover:opacity-0',
            )}
            priority={priority}
          />
          {product.images[1] && (
            <Image
              src={product.images[1].url}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="badge-new">New</span>
          )}
          {isOnSale && (
            <span className="badge-sale">
              {Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)}% Off
            </span>
          )}
          {isLowStock && (
            <span className="badge-low-stock">Only {product.stock} left</span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistButton
          productId={product.id}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        />

        {/* Quick add — revealed on hover */}
        {!isOutOfStock && (
          <QuickAddButton
            productId={product.id}
            className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          />
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-xs text-neutral-400 uppercase tracking-widest">
          {product.metalPurity} {product.metalType}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-neutral-900 line-clamp-2 hover:text-brand-600 transition-colors"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {isOnSale ? (
            <>
              <span className="text-brand-600 font-semibold">
                {formatPrice(product.salePrice!)}
              </span>
              <span className="text-neutral-400 text-sm line-through">
                {formatPrice(product.basePrice)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-neutral-900">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <span className="text-amber-400">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        )}
        {isOutOfStock && (
          <p className="text-xs text-neutral-400 mt-1">Out of stock</p>
        )}
      </div>
    </article>
  )
}
```

---

## 4. Server vs Client Components Strategy

The decision matrix for every component:

```
┌─────────────────────────────────────────────────────────────┐
│                  Is it interactive?                          │
│          (onClick, onChange, hover, animation)               │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │       YES         │          NO → Server Component (default)
         └─────────┬─────────┘
                   │
    ┌──────────────▼──────────────────┐
    │  Does it need browser APIs?     │
    │  (localStorage, window, refs)   │
    └──────────────┬──────────────────┘
                   │
         ┌─────────▼─────────┐
         │  "use client"     │
         └───────────────────┘
```

### Concrete Decisions

| Component | Type | Reason |
|-----------|------|--------|
| `Header` | Server (outer) + Client (inner) | Static nav is Server; search bar + cart count are Client |
| `ProductGrid` | Server Component | Static product list; fetched server-side |
| `ProductCard` | Server Component | Pure display; no interactivity |
| `QuickAddButton` | **Client** | `onClick` → cart mutation |
| `WishlistButton` | **Client** | Toggle state; needs auth check |
| `MediaGallery` | **Client** | Swipe, zoom, thumbnail click |
| `VariantSelector` | **Client** | Interactive state changes affect price + stock |
| `AddToCartButton` | **Client** | Server Action trigger |
| `CartDrawer` | **Client** | Slide animation, cart state |
| `FilterSidebar` | **Client** | URL state via `nuqs` |
| `SearchOverlay` | **Client** | Input, keyboard events |
| `ReviewForm` | **Client** | Form submission |
| `CheckoutForm` | **Client** | Stripe Elements, payment |
| `OrderHistory` | Server Component | Read-only list |
| `HeroSection` | Server (markup) + Client (video) | Static HTML; video needs ref |
| `EMICalculator` | **Client** | Interactive slider |
| `GoldRateDisplay` | Server (ISR) | Refreshed via ISR every 5 min |

### The "Client Boundary" Pattern

Push `"use client"` as deep down the tree as possible:

```tsx
// ✅ CORRECT — Only the button is client-side
// ProductCard.tsx (Server Component)
import { QuickAddButton } from './QuickAddButton' // "use client" inside

export function ProductCard({ product }) {
  return (
    <article>
      <Image src={product.image} ... />    {/* Server */}
      <h3>{product.name}</h3>              {/* Server */}
      <QuickAddButton productId={product.id} />  {/* Client boundary here */}
    </article>
  )
}

// ❌ WRONG — Entire card unnecessarily client-side
'use client'
export function ProductCard({ product }) { ... }
```

---

## 5. Data Fetching Patterns

### Pattern 1 — ISR Page (Product Detail)

```tsx
// app/(storefront)/products/[slug]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { generateProductMetadata } from '@/lib/seo'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'

// ISR: revalidate every 10 minutes, or on-demand via revalidateTag
export const revalidate = 600

interface Props {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {}
  return generateProductMetadata(product)
}

// Pre-generate most popular product slugs at build time
export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { status: 'ACTIVE', isFeatured: true },
    select: { slug: true },
    take: 500,  // Top 500 pre-rendered; rest generated on first request
  })
  return products.map(p => ({ slug: p.slug }))
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug, status: 'ACTIVE' },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: {
        include: { options: { include: { optionValue: true } } },
        orderBy: { isDefault: 'desc' },
      },
      reviews: {
        where: { isApproved: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { reviews: { where: { isApproved: true } } } },
    },
  })
  return product
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  // Fetch related products (same category, different product)
  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: 'ACTIVE',
      id: { not: product.id },
    },
    take: 8,
    include: { media: { where: { isPrimary: true }, take: 1 } },
  })

  return (
    <main>
      <ProductDetailClient product={product} relatedProducts={related} />
    </main>
  )
}
```

### Pattern 2 — Server Action (Add to Cart)

```ts
// actions/cart.ts
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { redis } from '@/lib/redis'
import { db } from '@/lib/db'
import { z } from 'zod'

const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  customisation: z.record(z.string()).optional(),
})

export async function addToCartAction(input: z.infer<typeof AddToCartSchema>) {
  // 1. Validate input
  const parsed = AddToCartSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() }
  }

  const { productId, variantId, quantity, customisation } = parsed.data

  // 2. Check stock
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
    select: { stock: true, reservedStock: true, isAvailable: true, price: true, product: { select: { basePrice: true } } },
  })

  if (!variant || !variant.isAvailable) {
    return { error: 'Product is not available' }
  }

  const availableStock = variant.stock - variant.reservedStock
  if (availableStock < quantity) {
    return { error: `Only ${availableStock} items available` }
  }

  // 3. Get or create cart
  const session = await auth()
  const cookieStore = cookies()
  
  let cartId: string
  
  if (session?.user?.id) {
    // Authenticated: use DB cart
    const cart = await db.cart.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
      select: { id: true },
    })
    cartId = cart.id
  } else {
    // Guest: use session cookie
    const sessionId = cookieStore.get('guest_session')?.value ?? crypto.randomUUID()
    cookieStore.set('guest_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    
    const cart = await db.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
      select: { id: true },
    })
    cartId = cart.id
  }

  // 4. Upsert cart item (increment if already exists)
  const unitPrice = variant.price ?? variant.product.basePrice
  
  const existingItem = await db.cartItem.findFirst({
    where: { cartId, variantId },
  })

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    })
  } else {
    await db.cartItem.create({
      data: { cartId, productId, variantId, quantity, unitPrice, customisation },
    })
  }

  // 5. Reserve stock (prevent overselling)
  await db.productVariant.update({
    where: { id: variantId },
    data: { reservedStock: { increment: quantity } },
  })

  // 6. Invalidate cart cache
  await redis.del(`cart:${cartId}`)

  return { success: true }
}
```

### Pattern 3 — API Route with Auth Guard

```ts
// app/api/v1/orders/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ratelimit } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  // Auth check
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Rate limiting
  const { success } = await ratelimit.limit(session.user.id)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Parse pagination
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(50, Number(searchParams.get('limit') ?? 20))
  const skip = (page - 1) * limit

  // Query
  const [orders, total] = await Promise.all([
    db.order.findMany({
      where: { customerId: session.user.id },
      include: {
        items: {
          include: {
            product: { select: { name: true, slug: true } },
            variant: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    db.order.count({ where: { customerId: session.user.id } }),
  ])

  return NextResponse.json({
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  })
}
```

---

## 6. State Management

### Cart Store (Zustand)

```ts
// stores/cartStore.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface CartItem {
  id: string
  productId: string
  variantId: string
  productName: string
  variantName: string
  imageUrl: string
  unitPrice: number
  quantity: number
  customisation?: Record<string, string>
}

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  isLoading: boolean

  // Computed
  itemCount: () => number
  subtotal: () => number

  // Actions
  openDrawer: () => void
  closeDrawer: () => void
  setItems: (items: CartItem[]) => void
  optimisticAdd: (item: CartItem) => void
  optimisticRemove: (itemId: string) => void
  optimisticUpdateQty: (itemId: string, qty: number) => void
  reset: () => void
}

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    items: [],
    isDrawerOpen: false,
    isLoading: false,

    itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    setItems: (items) => set({ items }),

    optimisticAdd: (item) => set(state => {
      const existing = state.items.find(i => i.variantId === item.variantId)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

    optimisticRemove: (itemId) => set(state => ({
      items: state.items.filter(i => i.id !== itemId),
    })),

    optimisticUpdateQty: (itemId, qty) => set(state => ({
      items: qty === 0
        ? state.items.filter(i => i.id !== itemId)
        : state.items.map(i => i.id === itemId ? { ...i, quantity: qty } : i),
    })),

    reset: () => set({ items: [], isDrawerOpen: false }),
  }))
)
```

### URL-based Filter State (nuqs)

```ts
// hooks/useFilters.ts
import { parseAsArrayOf, parseAsString, parseAsFloat, parseAsInteger, useQueryStates } from 'nuqs'

export function useFilters() {
  const [filters, setFilters] = useQueryStates({
    metalType:  parseAsArrayOf(parseAsString).withDefault([]),
    stoneType:  parseAsArrayOf(parseAsString).withDefault([]),
    occasion:   parseAsArrayOf(parseAsString).withDefault([]),
    gender:     parseAsString.withDefault(''),
    minPrice:   parseAsFloat.withDefault(0),
    maxPrice:   parseAsFloat.withDefault(999999),
    inStock:    parseAsString.withDefault(''),
    rating:     parseAsFloat.withDefault(0),
    sort:       parseAsString.withDefault('featured'),
    page:       parseAsInteger.withDefault(1),
  }, { history: 'push' })  // pushes to browser history (supports back button)

  const clearFilters = () => setFilters({
    metalType: [], stoneType: [], occasion: [], gender: '',
    minPrice: 0, maxPrice: 999999, inStock: '', rating: 0,
    sort: 'featured', page: 1,
  })

  const activeCount = [
    filters.metalType.length > 0,
    filters.stoneType.length > 0,
    filters.occasion.length > 0,
    filters.gender !== '',
    filters.minPrice > 0 || filters.maxPrice < 999999,
    filters.inStock !== '',
    filters.rating > 0,
  ].filter(Boolean).length

  return { filters, setFilters, clearFilters, activeCount }
}
```

---

## 7. Key Feature Implementation Guides

### 7.1 Checkout — Stripe Integration

```tsx
// components/checkout/PaymentForm/StripeCardElement.tsx
'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createPaymentIntent } from '@/actions/checkout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function StripeCheckout({ orderId, amount }: { orderId: string; amount: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Create payment intent on mount
  useState(() => {
    createPaymentIntent({ orderId, amount }).then(({ clientSecret }) => {
      setClientSecret(clientSecret)
    })
  })

  if (!clientSecret) return <PaymentSkeleton />

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
      <StripePaymentForm orderId={orderId} />
    </Elements>
  )
}

function StripePaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Payment failed')
      setIsProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirmation?order=${orderId}`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed')
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'auto', googlePay: 'auto' },
        }}
      />
      {error && (
        <p className="text-sm text-error bg-error-light p-3 rounded-md">{error}</p>
      )}
      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="btn-primary w-full"
      >
        {isProcessing ? 'Processing...' : `Pay ${formatPrice(amount / 100)}`}
      </button>
    </form>
  )
}

// Stripe Elements appearance — matches brand tokens
const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#b07d2a',
    colorBackground: '#ffffff',
    colorText: '#171717',
    colorDanger: '#dc2626',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    spacingUnit: '4px',
  },
}
```

### 7.2 Algolia Search Integration

```tsx
// components/search/SearchOverlay.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { algoliasearch } from 'algoliasearch'
import { useDebounce } from '@/hooks/useDebounce'
import { OptimisedImage } from '@/components/shared/OptimisedImage'
import { formatPrice } from '@/utils/currency'
import Link from 'next/link'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!,
)

interface SearchResult {
  objectID: string
  name: string
  slug: string
  imageUrl: string
  basePrice: number
  salePrice: number | null
  metalPurity: string
  categoryName: string
}

export function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 250)

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // Keyboard: Escape closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    searchClient
      .searchSingleIndex({
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX ?? 'products',
        searchParams: {
          query: debouncedQuery,
          hitsPerPage: 6,
          attributesToRetrieve: ['name', 'slug', 'imageUrl', 'basePrice', 'salePrice', 'metalPurity', 'categoryName'],
          filters: 'status:ACTIVE',
        },
      })
      .then(({ hits }) => {
        setResults(hits as SearchResult[])
      })
      .finally(() => setIsLoading(false))
  }, [debouncedQuery])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 left-0 right-0 bg-white z-modal shadow-2xl"
        role="dialog"
        aria-label="Search products"
      >
        <div className="max-w-content mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <SearchIcon className="text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search jewellery, collections, metals..."
              className="flex-1 text-lg outline-none placeholder:text-neutral-400"
              autoComplete="off"
            />
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="Close search"
            >
              <XIcon />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-3">
                Products
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.map(product => (
                  <Link
                    key={product.objectID}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-neutral-100">
                      <OptimisedImage
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-neutral-400">{product.metalPurity}</p>
                      <p className="text-xs font-semibold text-brand-600">
                        {formatPrice(product.salePrice ?? product.basePrice)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-sm text-brand-600 hover:underline"
                >
                  See all results for "{query}" →
                </Link>
              </div>
            </div>
          )}

          {debouncedQuery && results.length === 0 && !isLoading && (
            <div className="mt-4 border-t pt-4 text-center text-neutral-400 py-8">
              No results for "{debouncedQuery}"
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

### 7.3 Webhook Handler — Stripe

```ts
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/email/client'
import { updateLoyaltyPoints } from '@/lib/loyalty'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent
      const orderId = intent.metadata.orderId

      if (!orderId) break

      await db.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'CAPTURED',
            status: 'PAYMENT_CONFIRMED',
            paymentReference: intent.id,
          },
        })

        // Decrement reserved stock → actual stock decrement
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })

        if (order) {
          for (const item of order.items) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: { decrement: item.quantity },
                reservedStock: { decrement: item.quantity },
              },
            })

            await tx.inventoryLog.create({
              data: {
                variantId: item.variantId,
                change: -item.quantity,
                reason: 'SALE',
                reference: orderId,
                stockBefore: 0, // Will be set by trigger or separate query
                stockAfter: 0,
              },
            })
          }

          // Award loyalty points
          if (order.customerId) {
            await updateLoyaltyPoints({
              tx,
              userId: order.customerId,
              amount: order.totalAmount.toNumber(),
              type: 'PURCHASE',
              reference: orderId,
            })
          }

          // Send confirmation email (async, non-blocking)
          sendOrderConfirmationEmail(order).catch(console.error)
        }
      })
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      const orderId = intent.metadata.orderId

      if (!orderId) break

      // Release reserved stock
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (order) {
        await db.$transaction([
          db.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'FAILED', status: 'PAYMENT_FAILED' },
          }),
          ...order.items.map(item =>
            db.productVariant.update({
              where: { id: item.variantId },
              data: { reservedStock: { decrement: item.quantity } },
            })
          ),
        ])
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      // Handle full/partial refund — update order status and create refund record
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

---

## 8. API Route Conventions

### Response Envelope

All API responses follow a consistent envelope:

```ts
// lib/api-response.ts
import { NextResponse } from 'next/server'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status })
}

export function created<T>(data: T) {
  return NextResponse.json({ data, error: null }, { status: 201 })
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { data: null, error: { message, details } },
    { status: 400 }
  )
}

export function unauthorised(message = 'Unauthorised') {
  return NextResponse.json({ data: null, error: { message } }, { status: 401 })
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ data: null, error: { message } }, { status: 403 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ data: null, error: { message } }, { status: 404 })
}

export function serverError(message = 'Internal server error') {
  return NextResponse.json({ data: null, error: { message } }, { status: 500 })
}
```

### Zod Validation Middleware

```ts
// lib/validate.ts
import { z } from 'zod'
import { badRequest } from './api-response'
import { NextRequest } from 'next/server'

export async function validateBody<T extends z.ZodTypeAny>(
  request: NextRequest,
  schema: T
): Promise<{ data: z.infer<T>; error: null } | { data: null; error: NextResponse }> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return { data: null, error: badRequest('Invalid JSON body') }
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      data: null,
      error: badRequest('Validation failed', result.error.flatten()),
    }
  }

  return { data: result.data, error: null }
}
```

---

## 9. Middleware Architecture

```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(300, '60 s'),
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. MAINTENANCE MODE ──────────────────────────────────────────────
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    if (!pathname.startsWith('/maintenance') && !pathname.startsWith('/api/health')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }
  }

  // ── 2. RATE LIMITING (API routes only) ───────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(reset),
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
          },
        }
      )
    }
  }

  // ── 3. AUTH-PROTECTED ROUTES ─────────────────────────────────────────
  const protectedPaths = ['/account', '/checkout']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected) {
    const session = await auth()
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── 4. SECURITY HEADERS ──────────────────────────────────────────────
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://res.cloudinary.com https://cdn.sanity.io blob:",
    "connect-src 'self' https://api.stripe.com https://*.algolia.net https://*.algolianet.com https://app.posthog.com",
    "frame-src https://js.stripe.com https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
```

---

## 10. Testing Strategy

### Test Pyramid

```
         ┌──────────────────────┐
         │   E2E Tests (10%)    │  Playwright — critical user journeys
         ├──────────────────────┤
         │ Integration (30%)    │  Vitest — API routes, Server Actions, DB queries
         ├──────────────────────┤
         │   Unit Tests (60%)   │  Vitest — utils, hooks, store logic, validators
         └──────────────────────┘
```

### Test File Conventions

```
src/
├── components/
│   └── catalogue/
│       └── ProductCard/
│           ├── ProductCard.tsx
│           └── ProductCard.test.tsx     # Co-located unit test
│
├── actions/
│   └── cart.ts
│   └── cart.test.ts                     # Integration test (uses test DB)
│
tests/
├── e2e/
│   ├── checkout.spec.ts                 # Complete checkout E2E
│   ├── cart.spec.ts                     # Cart interactions
│   ├── search.spec.ts                   # Search functionality
│   ├── account.spec.ts                  # Account management
│   └── pdp.spec.ts                      # Product detail page
│
└── fixtures/
    ├── products.ts                      # Test product fixtures
    ├── users.ts                         # Test user fixtures
    └── orders.ts                        # Test order fixtures
```

### Sample E2E Test — Checkout Flow

```ts
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Seed test data and navigate to a product
    await page.goto('/products/test-gold-ring-18k')
  })

  test('completes a guest checkout successfully', async ({ page }) => {
    // 1. Select variant
    await page.getByRole('button', { name: 'Size 7' }).click()

    // 2. Add to cart
    await page.getByRole('button', { name: 'Add to Cart' }).click()
    await expect(page.getByText('1 item')).toBeVisible()

    // 3. Go to checkout
    await page.getByRole('link', { name: 'Proceed to Checkout' }).click()
    await expect(page).toHaveURL('/checkout')

    // 4. Fill address form
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('First Name').fill('Test')
    await page.getByLabel('Last Name').fill('User')
    await page.getByLabel('Phone').fill('9999999999')
    await page.getByLabel('Address').fill('123 Test Street')
    await page.getByLabel('City').fill('Mumbai')
    await page.getByLabel('State').selectOption('Maharashtra')
    await page.getByLabel('PIN Code').fill('400001')

    // 5. Select shipping
    await page.getByLabel('Standard Shipping').check()
    await page.getByRole('button', { name: 'Continue to Payment' }).click()

    // 6. Fill Stripe test card
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
    await stripeFrame.getByPlaceholder('Card number').fill('4242424242424242')
    await stripeFrame.getByPlaceholder('MM / YY').fill('12/30')
    await stripeFrame.getByPlaceholder('CVC').fill('123')

    // 7. Place order
    await page.getByRole('button', { name: /Pay ₹/ }).click()

    // 8. Confirm success
    await expect(page).toHaveURL(/\/checkout\/confirmation/)
    await expect(page.getByText('Order Confirmed')).toBeVisible()
    await expect(page.getByText(/JW-\d{4}-\d{6}/)).toBeVisible()
  })

  test('shows low stock warning when stock <= 3', async ({ page }) => {
    // Seed product with stock = 2
    await page.goto('/products/low-stock-product')
    await expect(page.getByText('Only 2 left')).toBeVisible()
  })

  test('prevents checkout of out-of-stock variants', async ({ page }) => {
    await page.goto('/products/out-of-stock-product')
    const addButton = page.getByRole('button', { name: 'Add to Cart' })
    await expect(addButton).toBeDisabled()
    await expect(page.getByText('Out of Stock')).toBeVisible()
  })
})
```

### Unit Test — Utility Functions

```ts
// utils/currency.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, calculateDiscount, formatPriceWithCurrency } from './currency'

describe('formatPrice', () => {
  it('formats INR prices correctly', () => {
    expect(formatPrice(1000)).toBe('₹1,000')
    expect(formatPrice(1234567)).toBe('₹12,34,567')  // Indian numbering system
    expect(formatPrice(0)).toBe('₹0')
  })

  it('handles decimal places', () => {
    expect(formatPrice(1999.99)).toBe('₹1,999.99')
    expect(formatPrice(2000.00)).toBe('₹2,000')  // No trailing zeros
  })
})

describe('calculateDiscount', () => {
  it('calculates percentage discount correctly', () => {
    expect(calculateDiscount(1000, 800)).toBe(20)  // 20% off
    expect(calculateDiscount(500, 500)).toBe(0)    // No discount
    expect(calculateDiscount(1500, 750)).toBe(50)  // 50% off
  })
})
```

---

## 11. CI/CD Pipeline

### GitHub Actions — CI (`ci.yml`)

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [develop]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test-unit:
    name: Unit + Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: jewellery_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379
    env:
      DATABASE_URL: postgresql://postgres:test@localhost:5432/jewellery_test
      REDIS_URL: redis://localhost:6379
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:migrate:test
      - run: pnpm test:unit --coverage
      - uses: codecov/codecov-action@v4

  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [lint-typecheck]
    env:
      DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      # All other test env vars from GitHub Secrets
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm playwright install --with-deps chromium
      - run: pnpm build
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build-check:
    name: Build Check
    runs-on: ubuntu-latest
    needs: [lint-typecheck]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          # Use CI-safe env vars (no real secrets needed for build check)
          NEXT_PUBLIC_APP_URL: https://staging.yourbrand.com
          NEXT_PUBLIC_ALGOLIA_APP_ID: fake
          NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: fake
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_fake
          NEXT_PUBLIC_SANITY_PROJECT_ID: fake
          NEXT_PUBLIC_SANITY_DATASET: production
```

### Deployment — Vercel

```json
// vercel.json
{
  "buildCommand": "pnpm turbo build --filter=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/gold-rate",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/release-reserved-stock",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/send-restock-notifications",
      "schedule": "0 */2 * * *"
    },
    {
      "path": "/api/cron/loyalty-tier-recalculation",
      "schedule": "0 2 * * 0"
    }
  ],
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 12. Performance Optimisation Playbook

### Bundle Analysis

```bash
# Analyse bundle size
ANALYZE=true pnpm build

# Check for large dependencies
pnpm dlx bundlephobia [package-name]
```

### Image Optimisation Checklist

```tsx
// ✅ Hero image — above fold, high priority
<Image
  src={hero.url}
  alt={hero.altText}
  fill
  priority                           // Preloads; disables lazy loading
  sizes="100vw"
  quality={85}                       // Balance quality vs size
  placeholder="blur"
  blurDataURL={hero.lqip}            // Base64 low-quality placeholder from Cloudinary
/>

// ✅ Product cards — responsive, lazy
<Image
  src={product.imageUrl}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
  // No priority — lazy by default
/>

// ✅ Cloudinary transformation URL builder
export function buildCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number; format?: 'auto' | 'webp' | 'avif' }
) {
  const { width = 'auto', height, quality = 'auto', format = 'auto' } = options
  const transforms = [
    `w_${width}`,
    height ? `h_${height}` : null,
    `q_${quality}`,
    `f_${format}`,
    'c_fill',
    'g_auto',                        // Smart cropping — focus on subject
  ].filter(Boolean).join(',')

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}
```

### React Performance

```tsx
// ✅ Memoise expensive renders
const MemoProductGrid = memo(ProductGrid, (prev, next) =>
  prev.products.length === next.products.length &&
  prev.products.every((p, i) => p.id === next.products[i].id)
)

// ✅ Virtualise long lists (react-virtual)
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualProductList({ products }: { products: Product[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,         // Estimated card height
    overscan: 5,
  })

  return (
    <div ref={parentRef} className="overflow-auto h-screen">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(vItem => (
          <div
            key={vItem.key}
            data-index={vItem.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{ transform: `translateY(${vItem.start}px)` }}
          >
            <ProductCard product={products[vItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Database Query Optimisation

```ts
// ✅ Use select to fetch only needed fields
// BAD: fetches all 30+ fields
const products = await db.product.findMany()

// GOOD: fetches only needed fields for card display
const products = await db.product.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    basePrice: true,
    salePrice: true,
    media: {
      where: { isPrimary: true },
      select: { url: true, altText: true },
      take: 2,       // Primary + hover image
    },
    _count: { select: { reviews: { where: { isApproved: true } } } },
  },
})

// ✅ Use cursor-based pagination for large tables (faster than offset)
const products = await db.product.findMany({
  where: { status: 'ACTIVE', categoryId },
  take: 24,
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  orderBy: { createdAt: 'desc' },
})

// ✅ Batch related queries with Promise.all
const [product, relatedProducts, reviews] = await Promise.all([
  db.product.findUnique({ where: { slug } }),
  db.product.findMany({ where: { categoryId, id: { not: productId } }, take: 8 }),
  db.review.findMany({ where: { productId, isApproved: true }, take: 10 }),
])
```

---

## 13. Admin Panel Architecture

The admin panel is a separate Next.js app at `apps/admin`, sharing the `packages/db` Prisma client.

### Admin App Structure

```
apps/admin/src/app/
├── layout.tsx                    # Admin shell (sidebar + topbar)
├── page.tsx                      # Dashboard
├── products/
│   ├── page.tsx                  # Product list
│   ├── new/page.tsx              # Create product
│   └── [id]/
│       ├── page.tsx              # Edit product
│       └── variants/page.tsx
├── collections/page.tsx
├── orders/
│   ├── page.tsx                  # Order queue
│   └── [id]/page.tsx             # Order detail + actions
├── customers/
│   ├── page.tsx
│   └── [id]/page.tsx
├── returns/page.tsx
├── promotions/
│   ├── coupons/page.tsx
│   └── flash-sales/page.tsx
├── marketing/
│   ├── banners/page.tsx
│   └── email/page.tsx
├── analytics/page.tsx
├── settings/
│   ├── general/page.tsx
│   ├── shipping/page.tsx
│   ├── payments/page.tsx
│   ├── taxes/page.tsx
│   ├── emails/page.tsx
│   └── team/page.tsx
└── api/
    └── admin/                    # Admin-specific API routes
        ├── products/route.ts
        ├── orders/route.ts
        └── analytics/route.ts
```

### Admin Auth Guard

```tsx
// apps/admin/middleware.ts
import { NextResponse } from 'next/server'
import { auth } from './lib/admin-auth'

export async function middleware(request) {
  const session = await auth()

  if (!session?.user?.isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based route protection
  const { pathname } = request.nextUrl
  const role = session.user.role

  const restrictedRoutes = {
    '/settings/team': ['SUPER_ADMIN'],
    '/settings/payments': ['SUPER_ADMIN', 'FINANCE_ADMIN'],
    '/analytics': ['SUPER_ADMIN', 'FINANCE_ADMIN', 'MARKETING_MANAGER'],
    '/promotions': ['SUPER_ADMIN', 'MARKETING_MANAGER'],
  }

  for (const [route, allowed] of Object.entries(restrictedRoutes)) {
    if (pathname.startsWith(route) && !allowed.includes(role)) {
      return NextResponse.redirect(new URL('/403', request.url))
    }
  }

  return NextResponse.next()
}
```

---

## 14. Error Handling Conventions

### Global Error Boundary

```tsx
// app/error.tsx
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="text-center max-w-md px-6">
        <h1 className="font-display text-4xl text-neutral-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-neutral-500 mb-8">
          We've been notified and are looking into it. Please try again.
        </p>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  )
}
```

### API Error Classification

```ts
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
  }
}

export class InsufficientStockError extends AppError {
  constructor(available: number) {
    super(
      `Insufficient stock. Only ${available} available.`,
      'INSUFFICIENT_STOCK',
      409,
      { available }
    )
  }
}

export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 'PAYMENT_ERROR', 422)
  }
}

// Use in API routes
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { message: error.message, code: error.code, details: error.details } },
      { status: error.statusCode }
    )
  }

  // Unexpected error
  Sentry.captureException(error)
  return NextResponse.json(
    { error: { message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' } },
    { status: 500 }
  )
}
```

---

## 15. Logging & Observability

### Structured Logging

```ts
// lib/logger.ts
import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  orderId?: string
  [key: string]: unknown
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    env: process.env.NODE_ENV,
    ...context,
  }

  if (level === 'error') {
    console.error(JSON.stringify(entry))
    Sentry.addBreadcrumb({ message, level: 'error', data: context })
  } else if (process.env.NODE_ENV !== 'production' || level !== 'debug') {
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log('debug', msg, ctx),
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
}
```

### Key Observability Points

Every critical business event should be logged AND tracked in analytics:

```ts
// Order placed
logger.info('Order created', { orderId, customerId, amount, paymentMethod })
analytics.track('order_placed', { orderId, value: amount, currency: 'INR', items })

// Payment failed
logger.error('Payment failed', { orderId, gateway, errorCode })
analytics.track('payment_failed', { orderId, reason: errorCode })

// Cart abandoned (tracked by scheduled job)
logger.info('Cart abandoned', { cartId, userId, value: cartTotal, itemCount })

// Out of stock
logger.warn('Product out of stock', { variantId, productName, lastOrderId })
```

---

## 16. Developer Onboarding Checklist

For every new engineer joining the team:

### Environment Setup

```bash
# 1. Clone and install
git clone git@github.com:yourorg/jewellery-platform.git
cd jewellery-platform
pnpm install

# 2. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
# Fill in values from team 1Password vault

# 3. Set up local database
docker compose up -d  # Starts PostgreSQL + Redis locally
pnpm db:migrate       # Run all Prisma migrations
pnpm db:seed          # Seed with test products, categories, admin user

# 4. Start development servers
pnpm dev              # Starts both web (3000) and admin (3001) concurrently

# 5. Verify setup
open http://localhost:3000         # Storefront
open http://localhost:3001         # Admin panel
# Admin login: admin@test.com / Password123!
```

### Key Commands

```bash
pnpm dev              # Start all apps in dev mode (Turborepo)
pnpm build            # Production build
pnpm test             # Run all tests
pnpm test:e2e         # Run Playwright tests
pnpm lint             # ESLint check
pnpm typecheck        # TypeScript check
pnpm db:migrate       # Apply pending Prisma migrations
pnpm db:migrate:reset # Reset DB and re-apply all migrations (DESTRUCTIVE)
pnpm db:seed          # Seed dev data
pnpm db:studio        # Open Prisma Studio (visual DB browser)
pnpm algolia:sync     # Re-index all products in Algolia
pnpm email:preview    # Preview email templates (React Email dev server)
pnpm bundle:analyze   # Analyse Next.js bundle sizes
```

### Code Review Checklist

Before requesting review, verify:

- [ ] TypeScript — no `any` types; all props typed
- [ ] Server/Client boundary — `"use client"` only where needed
- [ ] Images — all `<Image>` tags have `alt`, `sizes`, and appropriate `priority`
- [ ] Forms — all inputs have `label`, `aria-label`, or `aria-labelledby`
- [ ] API routes — input validated with Zod; auth checked; rate limit applied
- [ ] Server Actions — validated with Zod; auth checked where needed
- [ ] Queries — uses `select` to fetch only needed fields; no N+1 queries
- [ ] Tests — new features have unit tests; new user flows have E2E coverage
- [ ] No secrets committed — check `.env.local` is in `.gitignore`
- [ ] Responsive — tested at 375px (mobile), 768px (tablet), 1280px (desktop)

---

*End of Technical Implementation Guide.*  
*Related documents: PRD.md · PRD-Appendices.md*
