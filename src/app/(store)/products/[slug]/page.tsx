import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { RefreshCw, Truck, Award } from "lucide-react";

import { ImageGallery } from "@/components/product/image-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductAccordion } from "@/components/product/product-accordion";
import { getShopifyProduct, getRelatedShopifyProducts } from "@/lib/shopify-collections";
import { createMetadata, formatPrice } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopifyProduct(slug);
  if (!product) return createMetadata({ title: "Not found", description: "Product not found." });
  return createMetadata({
    title: product.name,
    description: `${product.name} in ${product.material}${product.stone ? ` with ${product.stone}` : ""}. ${product.purity ?? ""}`,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

const TRUST_ITEMS = [
  { icon: Truck,       label: "Free Shipping",  sub: "Across India" },
  { icon: RefreshCw,   label: "30-Day Exchange", sub: "Hassle-free" },
  { icon: Award,       label: "Handcrafted",     sub: "By master karigar" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, related] = await Promise.all([
    getShopifyProduct(slug),
    getRelatedShopifyProducts(slug),
  ]);
  if (!product) notFound();

  const gallery = product.images?.length ? product.images : [product.image];
  const collectionName =
    product.collection === "bridal"
      ? "Bridal Heirlooms"
      : product.collection === "daily-gold"
      ? "Daily Gold"
      : product.collection === "diamond-edit"
      ? "Diamond Edit"
      : "Jewellery";

  return (
    <div style={{ background: "var(--bg-dark)" }}>
      {/* ── Breadcrumb ──────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(138,106,58,0.15)" }}>
        <nav
          className="container-shell flex min-w-0 items-center gap-2 overflow-hidden py-3 text-[9px] uppercase tracking-[0.12em] sm:py-3.5 sm:text-[11px] sm:tracking-[0.18em]"
          style={{ color: "rgba(201,169,110,0.6)" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-[var(--gold)]">Home</Link>
          <span style={{ color: "var(--gold-dim)" }}>›</span>
          <Link href="/products" className="transition-colors hover:text-[var(--gold)]">Jewellery</Link>
          <span style={{ color: "var(--gold-dim)" }}>›</span>
          <span className="truncate" style={{ color: "var(--cream)" }}>{product.name}</span>
        </nav>
      </div>

      {/* ── Main product grid ───────────────────────── */}
      <div className="container-shell py-7 sm:py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-12 xl:grid-cols-[1fr_460px] lg:items-start">

          {/* Left – image gallery */}
          <ImageGallery images={gallery} productName={product.name} />

          {/* Right – product info */}
          <div className="flex flex-col gap-4">

            {/* Collection tag + badge */}
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: "var(--gold-dim)" }}
              >
                {collectionName}
              </span>
              {product.badge && (
                <span
                  className="rounded-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    background: "var(--bg-dark)",
                    color: "var(--gold)",
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Name */}
            <h1
              className="display-font text-3xl font-semibold leading-[1.1] tracking-[0.02em] sm:text-5xl"
              style={{ color: "var(--cream)" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="display-font text-3xl font-semibold"
                style={{ color: "var(--cream)" }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span
                  className="text-base line-through"
                  style={{ color: "var(--cream-muted)" }}
                >
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span
                  className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ background: "#e8f5e9", color: "#2e7d32" }}
                >
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              )}
            </div>

            {/* Material / stone chips */}
            <div className="flex flex-wrap gap-2">
              {[product.material, product.stone, ...(product.purity ? [product.purity] : [])].filter(Boolean).map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-sm px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
                    style={{
                      background: "rgba(201,169,110,0.08)",
                      color: "rgba(245,230,200,0.7)",
                      border: "1px solid rgba(201,169,110,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            {/* Weight */}
            {product.weight && (
              <p className="text-[13px]" style={{ color: "rgba(245,230,200,0.55)" }}>
                Net weight:{" "}
                <span className="font-semibold" style={{ color: "var(--cream)" }}>
                  {product.weight}
                </span>
              </p>
            )}

            <div style={{ height: 1, background: "rgba(138,106,58,0.2)" }} />

            {/* Interactive actions */}
            <ProductActions
              productId={product.id}
              slug={product.slug}
              productName={product.name}
              image={product.images?.[0] ?? product.image}
              material={product.material}
              price={product.price}
              sizes={product.sizes}
            />

            <div style={{ height: 1, background: "rgba(138,106,58,0.2)" }} />

            {/* Accordion: description / specs / care */}
            <ProductAccordion
              description={product.description ?? `${product.name} — ${product.material} with ${product.stone}.`}
              material={product.material}
              stone={product.stone}
              weight={product.weight}
              purity={product.purity}
            />
          </div>
        </div>
      </div>

      {/* ── Trust bar ───────────────────────────────── */}
      <div style={{ background: "var(--bg-dark)", borderTop: "1px solid rgba(201,169,110,0.15)" }}>
        <div className="container-shell grid grid-cols-3 gap-2 py-6 sm:gap-6 sm:py-8">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={22} strokeWidth={1.4} style={{ color: "var(--gold)" }} />
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.2em]" style={{ color: "var(--gold-pale)" }}>
                {label}
              </p>
              <p className="text-[8px] uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.14em]" style={{ color: "var(--cream-muted)" }}>
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Related products ────────────────────────── */}
      {related.length > 0 && (
        <div className="py-10 sm:py-14" style={{ background: "var(--bg-dark)" }}>
          <div className="container-shell">
            <div className="mb-8 flex items-center gap-4">
              <span className="flex-1 h-px" style={{ background: "rgba(138,106,58,0.2)" }} />
              <h2
                className="display-font text-2xl font-semibold italic tracking-[0.06em]"
                style={{ color: "var(--gold)" }}
              >
                You May Also Like
              </h2>
              <span className="flex-1 h-px" style={{ background: "rgba(138,106,58,0.2)" }} />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}` as Route}
                  className="group"
                >
                  <article>
                    <div
                      className="relative overflow-hidden mb-3"
                      style={{
                        aspectRatio: "3/4",
                        background: "rgba(201,169,110,0.05)",
                        borderRadius: "4px",
                      }}
                    >
                      {p.badge && (
                        <span
                          className="absolute left-3 top-3 z-10 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                          style={{ background: "var(--bg-dark)", color: "var(--gold)" }}
                        >
                          {p.badge}
                        </span>
                      )}
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-6"
                      />
                    </div>
                    <p
                      className="text-[10px] uppercase tracking-[0.16em] mb-1"
                      style={{ color: "var(--gold-dim)" }}
                    >
                      {p.material}
                    </p>
                    <h3
                      className="text-sm font-semibold leading-snug mb-1 transition-colors duration-200 group-hover:text-[var(--ruby)]"
                      style={{ color: "var(--cream)" }}
                    >
                      {p.name}
                    </h3>
                    <p className="display-font text-base font-semibold" style={{ color: "var(--cream)" }}>
                      {formatPrice(p.price)}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
