"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  productName: string;
  heroImage?: string;
};

export function ImageGallery({ images, productName, heroImage }: ImageGalleryProps) {
  // Local override lets thumbnail clicks win over the color-driven heroImage.
  // When heroImage changes (user picks a new color), reset the override.
  const [override, setOverride] = useState<string | null>(null);
  useEffect(() => { setOverride(null); }, [heroImage]);

  const displaySrc = override ?? heroImage ?? images[0];

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:flex-row-reverse lg:items-start">
      {/* Main image */}
      <div
        className="relative flex-1 min-w-0 overflow-hidden"
        style={{
          background: "rgba(201,169,110,0.07)",
          borderRadius: "6px",
          aspectRatio: "1 / 1",
        }}
      >
        <Image
          key={displaySrc}
          src={displaySrc}
          alt={productName}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-contain p-5 transition-opacity duration-300 sm:p-10"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="no-scrollbar flex w-full min-w-0 gap-2 overflow-x-auto pb-1 lg:w-[88px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setOverride(src)}
              className="relative shrink-0 overflow-hidden transition-all duration-200"
              style={{
                width: "clamp(64px, 20vw, 80px)",
                height: "clamp(64px, 20vw, 80px)",
                borderRadius: "4px",
                background: "rgba(201,169,110,0.07)",
                border: displaySrc === src
                  ? "2px solid var(--gold)"
                  : "2px solid transparent",
                opacity: displaySrc === src ? 1 : 0.6,
              }}
            >
              <Image
                src={src}
                alt={`${productName} view ${i + 1}`}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
