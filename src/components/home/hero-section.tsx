import Image from "next/image";
import { getHeroBanners } from "@/lib/hero-banners";
import { HeroCarousel } from "@/components/home/hero-carousel";

export async function HeroSection() {
  const banners = await getHeroBanners();

  if (banners.length === 0) {
    return (
      <section
        className="relative min-h-[98vh] w-full overflow-hidden"
        style={{ background: "var(--bg-dark)" }}
      >
        <Image
          src="/assets/hero/heroimage.png"
          alt="Sundari Jewellers bridal collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </section>
    );
  }

  return (
    <section>
      <HeroCarousel banners={banners} />
    </section>
  );
}
