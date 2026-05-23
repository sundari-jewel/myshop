import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

export function FeatureBanners() {
  return (
    <section className="py-0" style={{ background: "var(--bg-dark)" }}>
      <div className="grid lg:grid-cols-2">

        {/* -- Banner 1: Exquisite Heritage ----------------------- */}
        <Link
          href={"/collections/bridal" as Route}
          className="group relative overflow-hidden flex items-center justify-start min-h-[360px]"
        >
          <Image
            src="/assets/Jewelry_Sale__5_.png"
            alt="Exquisite Heritage Collection"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(14,4,4,0.78) 0%, rgba(14,4,4,0.25) 100%)",
            }}
          />
          <div className="relative z-10 p-10 lg:p-12">
            <p
              className="text-[0.6rem] uppercase tracking-[0.4em] mb-3"
              style={{ color: "var(--gold)" }}
            >
              * Heritage
            </p>
            <h3
              className="display-font font-semibold italic leading-tight mb-2"
              style={{ color: "var(--cream)", fontSize: "2.2rem" }}
            >
              Exquisite
              <br />
              Heritage
            </h3>
            <p
              className="text-xs leading-6 max-w-[260px] mb-6"
              style={{ color: "var(--cream-muted)" }}
            >
              Temple jewellery and heirloom pieces rooted in centuries of craft.
            </p>
            <span className="btn-ghost-gold text-[11px]">Discover More &#8250;</span>
          </div>
        </Link>

        {/* -- Banner 2: Mangalsutra Designs ---------------------- */}
        <Link
          href={"/collections/mangalsutra" as Route}
          className="group relative overflow-hidden flex items-center justify-start min-h-[360px]"
        >
          <Image
            src="/assets/Jewelry_Sale__5__2.png"
            alt="Mangalsutra Designs"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(14,4,4,0.72) 0%, rgba(14,4,4,0.2) 100%)",
            }}
          />
          <div className="relative z-10 p-10 lg:p-12">
            <p
              className="text-[0.6rem] uppercase tracking-[0.4em] mb-3"
              style={{ color: "var(--gold)" }}
            >
              * Tradition
            </p>
            <h3
              className="display-font font-semibold italic leading-tight mb-2"
              style={{ color: "var(--cream)", fontSize: "2.2rem" }}
            >
              Mangalsutra
              <br />
              Designs
            </h3>
            <p
              className="text-xs leading-6 max-w-[260px] mb-6"
              style={{ color: "var(--cream-muted)" }}
            >
              New arrivals - timeless symbols reimagined for the modern bride.
            </p>
            <span className="btn-ghost-gold text-[11px]">Explore Collection &#8250;</span>
          </div>
        </Link>

      </div>
    </section>
  );
}
