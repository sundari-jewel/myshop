import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const PANELS = [
  {
    label: "Women's Edit",
    href: "/collections/womens-edit",
    image: "/assets/Final_product_reveal.png",
  },
  {
    label: "Bridal Edit",
    href: "/collections/bridal",
    image: "/assets/Artisan_working_on_gold.png",
  },
  {
    label: "Workday Elegance",
    href: "/collections/daily-gold",
    image: "/assets/Diamond_close_up.png",
  },
  {
    label: "Feminine Gold",
    href: "/collections/daily-gold",
    image: "/assets/Gold_texture_reel.png",
  },
] as const;

export function StyledEditorial() {
  return (
    <section
      className="py-0 overflow-hidden"
      style={{ background: "var(--bg-dark)" }}
    >
      <div className="grid lg:grid-cols-[0.55fr_0.45fr]">

        {/* -- Left: editorial headline ----------------------------- */}
        <div className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
          {/* Background image with strong overlay */}
          <div className="absolute inset-0">
            <Image
              src="/assets/image_9.png"
              alt="Styled for every side of her"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-top"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,4,4,0.78) 0%, rgba(14,4,4,0.45) 100%)",
              }}
            />
          </div>
          <div className="relative z-10 p-12 lg:p-16 max-w-[480px]">
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.42em] mb-4"
              style={{ color: "var(--gold)" }}
            >
              *   Curated for her
            </p>
            <h2
              className="display-font font-semibold italic leading-[1.05] mb-6"
              style={{ color: "var(--cream)", fontSize: "clamp(2.4rem,4vw,3.8rem)" }}
            >
              Styled for every
              <br />
              side of her
            </h2>
            <p
              className="text-sm leading-7 max-w-[340px] mb-8"
              style={{ color: "var(--cream-muted)" }}
            >
              From heirloom bridal sets to everyday gold, each piece is
              crafted to celebrate every facet of the modern Indian woman.
            </p>
            <Link href="/collections/bridal" className="btn-ghost-gold focus-ring">
              Shop the Edit
            </Link>
          </div>
        </div>

        {/* -- Right: 2x2 editorial grid --------------------------- */}
        <div className="grid grid-cols-2">
          {PANELS.map((panel) => (
            <Link
              key={panel.label}
              href={panel.href as Route}
              className="group relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={panel.image}
                alt={panel.label}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="object-cover transition-transform duration-600 group-hover:scale-105"
              />
              {/* Label overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  background:
                    "linear-gradient(to top, rgba(14,4,4,0.72) 0%, transparent 55%)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 group-hover:text-[var(--gold-light)]"
                  style={{ color: "var(--cream)" }}
                >
                  {panel.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
