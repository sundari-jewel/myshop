import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";

const REEL_IMAGES = [
  { src: "/assets/image_25.png", alt: "Customer wearing Sundari necklace" },
  { src: "/assets/image_26.png", alt: "Customer wearing Sundari earrings" },
  { src: "/assets/image_27.png", alt: "Customer wearing Sundari bangles" },
  { src: "/assets/image_28.png", alt: "Customer wearing Sundari ring" },
  { src: "/assets/image_23.png", alt: "Customer wearing Sundari jewellery" },
  { src: "/assets/catalog-asset-01.png", alt: "Sundari jewellery close-up" },
  { src: "/assets/catalog-asset-02.png", alt: "Sundari gold necklace" },
  { src: "/assets/catalog-asset-03.png", alt: "Sundari diamond earrings" },
] as const;

export function CustomerReels() {
  return (
    <section className="py-14" style={{ background: "var(--surface)" }}>
      <div className="container-shell">
        <SectionHeader title="Customers Reel" className="mb-3" />
        <p
          className="text-center text-sm mb-8"
          style={{ color: "var(--ink-soft)" }}
        >
          Tag us{" "}
          <span style={{ color: "var(--gold-dim)" }} className="font-semibold">
            @SundariJewellers
          </span>{" "}
          to be featured
        </p>

        {/* Horizontal scrollable grid */}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {REEL_IMAGES.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: "1/1", borderRadius: "4px", background: "var(--surface-warm)" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 12.5vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Instagram icon on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "rgba(14,4,4,0.45)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
