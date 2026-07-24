import Image from "next/image";
import Link from "next/link";
import { getHeroBanners } from "@/lib/hero-banners";
import { HeroCarousel } from "@/components/home/hero-carousel";

export async function HeroSection() {
  const banners = await getHeroBanners();

  return (
    <section className="relative">
      <div className="md:hidden">
        {banners.length === 0 ? (
          <div
            className="relative aspect-[1370/606] min-h-[150px] w-full overflow-hidden sm:min-h-[260px]"
            style={{ background: "var(--bg-dark)" }}
          >
            <Image
              src="/assets/hero/heroimage.webp"
              alt="Sundari Jewellers bridal collection"
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <HeroCarousel banners={banners} />
        )}
      </div>

      <Link
        href="/products"
        className="group relative hidden aspect-[1923/818] min-h-[260px] w-full overflow-hidden md:block"
        style={{ background: "var(--bg-dark)" }}
      >
        <Image
          src="/assets/hero/hero-sundari-v2.webp"
          alt="Sundari Art Jewellery kundan necklace and earrings"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.015]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(14,4,4,0.58) 0%, rgba(14,4,4,0.2) 42%, transparent 68%)",
          }}
        />
        <div className="absolute inset-y-0 left-0 z-10 flex w-[58%] items-center px-4 pb-5 md:w-1/2 md:px-[7vw] md:pb-10">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.24em] text-[var(--gold)] md:text-[11px] md:tracking-[0.32em]">
              Sundari Art Jewellery
            </p>
            <h1 className="display-font mt-2 text-[1.65rem] font-semibold leading-[0.9] text-[var(--cream)] md:mt-4 md:text-5xl lg:text-6xl">
              Jewellery,
              <span className="mt-1 block italic text-[var(--gold-pale)]">beautifully yours.</span>
            </h1>
            <p className="mt-4 hidden max-w-md text-sm leading-6 text-[var(--cream-muted)] md:block">
              Artfully crafted pieces for celebrations, traditions, and every moment between.
            </p>
            <span className="mt-3 inline-flex border-b border-[var(--gold)] pb-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--gold-pale)] md:mt-6 md:text-[10px] md:tracking-[0.24em]">
              Explore the collection
            </span>
          </div>
        </div>
      </Link>

      <div className="hero-banner-cutout" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            d="M0 120V76C0 49 20 34 48 34H570C632 34 676 28 712 5L720 0L728 5C764 28 808 34 870 34H1392C1420 34 1440 49 1440 76V120Z"
            fill="var(--bg-dark)"
          />
          <path
            d="M0 106H13V78C13 58 27 47 49 47H574C637 47 682 39 716 17L720 14L724 17C758 39 803 47 866 47H1391C1413 47 1427 58 1427 78V106H1440"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <svg
          className="hero-banner-ornament"
          viewBox="0 0 116 30"
          focusable="false"
        >
          <path d="M0 19H36M80 19H116" fill="none" stroke="var(--gold)" strokeWidth="1.4" />
          <path
            d="M58 4C53 10 52 15 58 25C64 15 63 10 58 4Z"
            fill="var(--gold)"
          />
          <path
            d="M57 17C49 10 44 12 46 18C48 23 53 25 58 25M59 17C67 10 72 12 70 18C68 23 63 25 58 25"
            fill="none"
            stroke="var(--gold)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      </div>
    </section>
  );
}
