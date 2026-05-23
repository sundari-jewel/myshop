import Image from "next/image";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[98vh] w-full overflow-hidden flex items-center"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* -- Background image --------------------------------------- */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero/heroimage.png"
          alt="Sundari Jewellers bridal collection hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Multi-layer dark overlay for luxury feel */}
        {/* <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(14,4,4,0.82) 0%, rgba(14,4,4,0.55) 55%, rgba(14,4,4,0.18) 100%)",
          }}
        /> */}
        {/* Bottom fade */}
        {/* <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(to top, var(--bg-dark) 0%, transparent 100%)",
          }}
        /> */}
      </div>

      {/* -- Content ------------------------------------------------ */}
      

      {/* -- Floating product image (right side, desktop) ----------- */}
      {/* <div className="absolute right-0 bottom-0 top-0 hidden xl:flex items-end justify-end w-[45%] overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/assets/ChatGPT_Image_Apr_25__2026__01_41_00_PM_1.png"
            alt="Featured bridal jewellery"
            fill
            priority
            sizes="45vw"
            className="object-contain object-right-bottom pb-0"
            quality={85}
          />
        </div>
      </div> */}
    </section>
  );
}
