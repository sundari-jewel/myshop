import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SectionHeader } from "@/components/ui/section-header";

export function ShopByGender() {
  return (
    <section className="py-16" style={{ background: "var(--surface-warm)" }}>
      <div className="container-shell">
        <SectionHeader title="Shop by Gender" className="mb-10" />

        <div className="grid sm:grid-cols-2 gap-5">
          {/* -- Crafted for Her ----------------------------------- */}
          <Link
            href={"/collections/womens-edit" as Route}
            className="group relative overflow-hidden rounded-sm"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src="/assets/image_19.png"
              alt="Jewellery crafted for her"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(14,4,4,0.8) 0%, rgba(14,4,4,0.1) 60%)",
              }}
            />
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p
                className="text-[0.6rem] uppercase tracking-[0.4em] mb-2"
                style={{ color: "var(--gold)" }}
              >
                * For Her
              </p>
              <h3
                className="display-font font-semibold italic leading-tight mb-4"
                style={{ color: "var(--cream)", fontSize: "2rem" }}
              >
                Crafted
                <br />
                for her
              </h3>
              <span className="btn-ghost-gold text-xs group-hover:bg-[var(--gold)] group-hover:text-[var(--bg-deep)] transition-all duration-200 focus-ring">
                Explore
              </span>
            </div>
          </Link>

          {/* -- Crafted for Him ----------------------------------- */}
          <Link
            href={"/collections/mens-edit" as Route}
            className="group relative overflow-hidden rounded-sm"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src="/assets/image_20.png"
              alt="Jewellery crafted for him"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(14,4,4,0.8) 0%, rgba(14,4,4,0.1) 60%)",
              }}
            />
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p
                className="text-[0.6rem] uppercase tracking-[0.4em] mb-2"
                style={{ color: "var(--gold)" }}
              >
                * For Him
              </p>
              <h3
                className="display-font font-semibold italic leading-tight mb-4"
                style={{ color: "var(--cream)", fontSize: "2rem" }}
              >
                Crafted
                <br />
                for him
              </h3>
              <span className="btn-ghost-gold text-xs group-hover:bg-[var(--gold)] group-hover:text-[var(--bg-deep)] transition-all duration-200 focus-ring">
                Explore
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
