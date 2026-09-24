"use client";

import { useMemo, useState } from "react";
import { ImageGallery } from "./image-gallery";
import { ProductActions } from "./product-actions";
import { ProductAccordion } from "./product-accordion";
import { formatPrice } from "@/lib/seo";
import type { ColorVariant, ProductVariant } from "@/types/commerce";

type ProductViewProps = {
  productId: string;
  slug: string;
  productName: string;
  collectionName: string;
  badge?: string;
  images: string[];
  material: string;
  stone: string;
  weight?: string;
  purity?: string;
  price: number;
  originalPrice?: number;
  sizes?: string[];
  colorVariants?: ColorVariant[];
  variants?: ProductVariant[];
  description: string;
};

export function ProductView({
  productId,
  slug,
  productName,
  collectionName,
  badge,
  images,
  material,
  stone,
  weight,
  purity,
  price,
  originalPrice,
  sizes,
  colorVariants,
  variants,
  description,
}: ProductViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);

  const currentPrice = selectedVariant?.price ?? price;
  const heroImage = selectedVariant?.image;

  // Map every variant image URL to its color name so we can filter thumbnails.
  const imageColorMap = useMemo(() => {
    const map = new Map<string, string>();
    colorVariants?.forEach((v) => {
      if (v.image) map.set(v.image, v.color);
      v.images?.forEach((img) => map.set(img, v.color));
    });
    return map;
  }, [colorVariants]);

  // When a color is selected, hide images tied to other colors.
  // Images that aren't tied to any variant (product-level) stay visible.
  const galleryImages = useMemo(() => {
    if (!selectedVariant) return images;
    const filtered = images.filter((img) => {
      const owningColor = imageColorMap.get(img);
      return !owningColor || owningColor === selectedVariant.color;
    });
    return filtered.length ? filtered : images;
  }, [images, selectedVariant, imageColorMap]);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_420px] lg:gap-12 xl:grid-cols-[1fr_460px] lg:items-start">
      {/* Left – image gallery */}
      <ImageGallery images={galleryImages} productName={productName} heroImage={heroImage} />

      {/* Right – product info */}
      <div className="flex min-w-0 flex-col gap-4">

        {/* Collection tag + badge */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold-dim)" }}>
            {collectionName}
          </span>
          {badge && (
            <span
              className="rounded-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ background: "var(--bg-dark)", color: "var(--gold)" }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Name */}
        <h1
          className="display-font text-3xl font-semibold leading-[1.1] tracking-[0.02em] sm:text-5xl"
          style={{ color: "var(--cream)" }}
        >
          {productName}
        </h1>

        {/* Price — reactive to selected color variant */}
        <div className="flex items-baseline gap-3">
          <span className="display-font text-3xl font-semibold" style={{ color: "var(--cream)" }}>
            {formatPrice(currentPrice)}
          </span>
          {originalPrice && (
            <span className="text-base line-through" style={{ color: "var(--cream-muted)" }}>
              {formatPrice(originalPrice)}
            </span>
          )}
          {originalPrice && (
            <span
              className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: "#e8f5e9", color: "#2e7d32" }}
            >
              {Math.round((1 - currentPrice / originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Material / stone chips */}
        <div className="flex flex-wrap gap-2">
          {[material, stone, ...(purity ? [purity] : [])].filter(Boolean).map((tag) => (
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
          ))}
        </div>

        {/* Weight */}
        {weight && (
          <p className="text-[13px]" style={{ color: "rgba(245,230,200,0.55)" }}>
            Net weight:{" "}
            <span className="font-semibold" style={{ color: "var(--cream)" }}>{weight}</span>
          </p>
        )}

        <div style={{ height: 1, background: "rgba(138,106,58,0.2)" }} />

        {/* Interactive actions */}
        <ProductActions
          productId={productId}
          slug={slug}
          productName={productName}
          image={selectedVariant?.image ?? images[0]}
          material={material}
          price={currentPrice}
          sizes={sizes}
          colorVariants={colorVariants}
          variants={variants}
          onColorChange={setSelectedVariant}
        />

        <div style={{ height: 1, background: "rgba(138,106,58,0.2)" }} />

        {/* Accordion: description / specs / care */}
        <ProductAccordion
          description={description}
          material={material}
          stone={stone}
          weight={weight}
          purity={purity}
        />
      </div>
    </div>
  );
}
