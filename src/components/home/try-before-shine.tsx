import Image from "next/image";

export function TryBeforeShine() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--bg-dark)" }}
    >
      <div className="grid lg:grid-cols-2 min-h-[520px]">

        {/* -- Left: Text + CTA ----------------------------------- */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20 relative z-10">
          {/* Ornament */}
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8" style={{ background: "var(--gold)" }} />
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.42em]" style={{ color: "var(--gold)" }}>
              Sundari Jewellers
            </p>
          </div>

          <h2
            className="display-font font-semibold italic leading-[1.05] mb-3"
            style={{ color: "var(--cream)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}
          >
            Try Before
            <br />
            You Shine
          </h2>

          <p
            className="text-sm leading-7 max-w-[380px] mb-4"
            style={{ color: "var(--cream-muted)" }}
          >
            Experience the future of heritage craftsmanship. Our digital mannequin
            allows you to harmonise our finest jewellery pieces with your own gorgeous
            features - before the first box even opens.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mb-8 py-5 border-y" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
            {[
              { num: "2K+", label: "Pieces" },
              { num: "15+", label: "Collections" },
              { num: "AR", label: "Try-On" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="display-font text-xl font-semibold" style={{ color: "var(--gold-light)" }}>
                  {stat.num}
                </p>
                <p className="text-[9px] uppercase tracking-[0.22em] mt-0.5" style={{ color: "var(--cream-muted)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-filled-gold focus-ring"
            >
              Upload Your Selfie
            </button>
            <button
              type="button"
              className="btn-ghost-gold focus-ring"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* -- Right: Model image ------------------------------- */}
        <div className="relative min-h-[380px] lg:min-h-0 overflow-hidden">
          <Image
            src="/assets/ChatGPT_Image_Apr_23__2026__08_37_51_AM_1.png"
            alt="Virtual try-on jewellery experience"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
          {/* Left fade to merge with text section on desktop */}
          <div
            className="absolute inset-y-0 left-0 w-24 hidden lg:block"
            style={{
              background: "linear-gradient(to right, var(--bg-dark) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
