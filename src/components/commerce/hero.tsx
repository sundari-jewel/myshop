import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ruby)]">
          Fine jewellery / India
        </p>
        <h1 className="display-font mt-5 text-6xl font-semibold leading-[0.94] sm:text-7xl lg:text-8xl">
          Sundari Jewels
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">
          Gold, diamond, and bridal pieces presented through a fast, search-ready storefront with
          refined React commerce interactions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="focus-ring rounded-full bg-[var(--surface-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--ruby)]"
            href="/products"
          >
            Explore jewellery
          </Link>
          <Link
            className="focus-ring rounded-full border border-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--gold)] hover:text-white"
            href="/collections/bridal"
          >
            Bridal edit
          </Link>
        </div>
      </div>
      <div className="relative min-h-[520px] overflow-hidden rounded-md bg-[var(--surface-deep)]">
        <Image
          src="/assets/golden-swirl-frame-dark-background-with-text-space.webp"
          alt="Gold jewellery campaign background"
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover"
        />
        <Image
          src="/assets/ChatGPT_Image_Apr_25__2026__01_41_00_PM_1.webp"
          alt="Sundari gold jewellery hero piece"
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-contain p-8"
        />
      </div>
    </section>
  );
}
