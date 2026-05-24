"use client";

import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-start">
      {/* Main image */}
      <div
        className="relative flex-1 min-w-0 overflow-hidden"
        style={{
          background: "var(--surface-warm)",
          borderRadius: "6px",
          aspectRatio: "1 / 1",
        }}
      >
        <Image
          key={active}
          src={images[active]}
          alt={productName}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-contain p-10 transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 lg:flex-col lg:w-[88px] lg:shrink-0">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className="relative shrink-0 overflow-hidden transition-all duration-200"
              style={{
                width: 80,
                height: 80,
                borderRadius: "4px",
                background: "var(--surface-warm)",
                border: active === i
                  ? "2px solid var(--gold)"
                  : "2px solid transparent",
                opacity: active === i ? 1 : 0.6,
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
