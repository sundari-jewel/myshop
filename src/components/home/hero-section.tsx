import Image from "next/image";
import Link from "next/link";
import type { HeroBanner } from "@/lib/hero-banners";
import { HeroCarousel } from "@/components/home/hero-carousel";

const DESKTOP_BANNERS: HeroBanner[] = [
  { image: "/assets/hero/hero-launch-sale.png", link: "/collections/sale" },
];

export function HeroSection() {

  return (
    <section className="relative">
      <div className="md:hidden">
        <Link href="/collections/sale" className="relative block aspect-[1071/1469] w-full overflow-hidden" style={{ background: "var(--bg-dark)" }}>
          <Image
            src="/assets/hero/hero-launch-sale-mobile.png"
            alt="Sundari Art Jewellery — Launch Sale Is Live"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </Link>
      </div>

      <div className="hidden md:block">
        <HeroCarousel
          banners={DESKTOP_BANNERS}
          className="group relative aspect-[1922/818] min-h-[260px] w-full overflow-hidden"
        />
      </div>

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
