import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SectionHeader } from "@/components/ui/section-header";

const WEDDING_CARDS = [
  {
    title: "Bridal Sets",
    subtitle: "Complete your bridal look",
    href: "/collections/bridal",
    image: "/assets/golden-swirl-frame-dark-background-with-text-space_3.png",
    cta: "Shop Now",
  },
  {
    title: "Engagement Rings",
    subtitle: "Begin the forever story",
    href: "/collections/rings",
    image: "/assets/golden-swirl-frame-dark-background-with-text-space_4.png",
    cta: "Explore",
  },
  {
    title: "Wedding Earrings",
    subtitle: "Statement pieces for the big day",
    href: "/collections/earrings",
    image: "/assets/golden-swirl-frame-dark-background-with-text-space_6.png",
    cta: "View",
  },
  {
    title: "Maang Tikka",
    subtitle: "The crowning jewel of bridal adornment",
    href: "/collections/bridal",
    image: "/assets/golden-swirl-frame-dark-background-with-text-space_8.png",
    cta: "Shop Now",
  },
] as const;

export function WeddingShop() {
  return (
    <section className="py-16" style={{ background: "var(--surface)" }}>
      <div className="container-shell">
        <SectionHeader title="Shop for Wedding" className="mb-10" />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {WEDDING_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href as Route}
              className="group"
            >
              <div
                className="relative overflow-hidden mb-3"
                style={{
                  borderRadius: "6px",
                  aspectRatio: "3/3.5",
                  background: "var(--bg-dark)",
                }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(14,4,4,0.75) 0%, transparent 55%)",
                  }}
                />
                {/* CTA pill */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1"
                    style={{ color: "var(--cream-muted)" }}
                  >
                    {card.subtitle}
                  </p>
                  <h4
                    className="display-font font-semibold italic text-lg leading-tight mb-3"
                    style={{ color: "var(--cream)" }}
                  >
                    {card.title}
                  </h4>
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 border transition-all duration-200 group-hover:bg-[var(--gold)] group-hover:text-[var(--bg-deep)]"
                    style={{
                      borderColor: "var(--gold)",
                      color: "var(--gold)",
                      borderRadius: "2px",
                    }}
                  >
                    {card.cta}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
