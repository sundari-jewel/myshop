import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

export function ShopByGender() {
  return (
    <section className="py-10 sm:py-20" style={{ background: "var(--bg-dark)" }}>
      <div className="mb-7 flex items-center justify-center gap-5 sm:mb-14 sm:gap-7">
        <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
        <span className="display-font text-center text-[1.75rem] font-semibold italic leading-none tracking-[0.05em] text-[var(--gold)] drop-shadow-[0_2px_1px_rgba(70,40,0,0.32)] sm:text-[2.45rem] sm:tracking-[0.08em]">
          Shop Anti-Tarnish Jewellery
        </span>
        <span className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <Link
          href={"/collections/anti-tarnish-womens" as Route}
          className="focus-ring group relative block overflow-hidden"
        >
          <Image
            src="/assets/AntiTarnishForHer.png"
            alt="Anti Tarnish jewellery for her"
            width={1180}
            height={1333}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </Link>

        <Link
          href={"/collections/anti-tarnish-mens" as Route}
          className="focus-ring group relative block overflow-hidden"
        >
          <Image
            src="/assets/AntiTarnishForHim.png"
            alt="Anti Tarnish jewellery for him"
            width={1180}
            height={1333}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </Link>
      </div>
    </section>
  );
}
