import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description: "The story behind Sundari Art Jewellery — rooted in Indian heritage, crafted for every woman.",
  path: "/about",
});

const MATERIALS = [
  {
    name: "Pure Brass",
    desc: "Traditional base metal worked into heirloom-quality forms, lightweight and long-lasting.",
  },
  {
    name: "Highgold",
    desc: "Rich gold-toned finish that holds its lustre — ideal for everyday and occasion wear alike.",
  },
  {
    name: "AD / CZ Diamond",
    desc: "American Diamond and cubic zirconia stones set with precision for brilliant, affordable sparkle.",
  },
  {
    name: "Bridal",
    desc: "Statement sets designed for brides — layered, ornate, and built to command the room.",
  },
];

const CATEGORIES = [
  "Earrings", "Necklaces", "Bangles", "Rings",
  "Tika", "Nath", "Hathful", "Watches", "Rakhi", "Gifting",
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/assets/golden-swirl-frame-dark-background-with-text-space.webp"
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden="true"
          />
        </div>
        <div className="container-shell relative py-14 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Our Story</p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic leading-tight text-[var(--gold)] sm:text-6xl">
              Celebrating the Art<br className="hidden sm:block" /> of Indian Heritage
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.55)]">
              Sundari Art Jewellery was born from a deep love for traditional Indian craft — a passion our family has carried <strong className="text-[var(--cream)]">since 1980</strong>. Every piece we make is a tribute to the artisans, the rituals, and the women who carry these traditions forward.
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-14">

          {/* ── Who We Are ──────────────────────────────────────── */}
          <section className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <SectionHeading title="Who We Are" />
              <div className="mt-5 space-y-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                <p>
                  We are <strong className="text-[var(--cream)]">Shree Vallabh Mangalam Art Jewels</strong>, rooted in <strong className="text-[var(--cream)]">Ujjain, Madhya Pradesh</strong> — the sacred city of <strong className="text-[var(--cream)]">Mahakal</strong>, where devotion and artistry have coexisted for millennia. Our store at Mangalam, 72 Lakherwadi has been a trusted name for jewellery that blends classical Indian aesthetics with wearable, modern sensibility.
                </p>
                <p>
                  Under the <strong className="text-[var(--cream)]">Sundari Art Jewellery</strong> brand, we bring that same craft and care to a wider audience — through a curated online collection built for women who appreciate beauty in detail.
                </p>
                <p>
                  Whether you&apos;re dressing for a wedding, a festival, a workday, or simply because you feel like it — Sundari has a piece for every side of you.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center sm:justify-end shrink-0">
              <Image
                src="/assets/logo.webp"
                alt="Sundari Art Jewellery logo"
                width={260}
                height={260}
                className="object-contain"
              />
            </div>
          </section>

          <Divider />

          {/* ── What We Make ──────────────────────────────────── */}
          <section>
            <SectionHeading title="What We Make" />
            <p className="mt-3 text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              We work across four primary materials — each chosen for quality, longevity, and beauty.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {MATERIALS.map((m) => (
                <div
                  key={m.name}
                  className="rounded-sm border p-5"
                  style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.03)" }}
                >
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">{m.name}</p>
                  <p className="text-xs leading-6 text-[rgba(245,230,200,0.6)]">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Our Range ─────────────────────────────────────── */}
          <section>
            <SectionHeading title="Our Range" />
            <p className="mt-3 mb-5 text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              From everyday studs to full bridal sets — we cover every jewellery occasion.
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="rounded-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    border: "1px solid rgba(201,169,110,0.22)",
                    background: "rgba(201,169,110,0.05)",
                    color: "rgba(201,169,110,0.8)",
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Our Promise ───────────────────────────────────── */}
          <section>
            <SectionHeading title="Our Promise" />
            <div className="mt-5 space-y-3">
              {[
                "We only sell through this website and our verified social media accounts — never through WhatsApp groups, Telegram, or unverified resellers.",
                "Every product description is honest — materials, purity, and stone details are captured accurately per piece.",
                "We ship securely across India and internationally, with trackable, insured delivery.",
                "Our customer support responds within 1–2 business days and we stand behind every order we send out.",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold-dim)]" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── CTA ───────────────────────────────────────────── */}
          <section className="flex flex-col items-center gap-5 py-4 text-center">
            <p className="display-font text-2xl font-semibold italic text-[var(--gold)] sm:text-3xl">
              Styled for Every Side of Her
            </p>
            <p className="max-w-md text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              Explore the full collection or reach out — we&apos;re always happy to help you find the perfect piece.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="rounded-sm px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
                style={{ background: "var(--gold)", color: "#1a0d00" }}
              >
                Shop Now
              </Link>
              <Link
                href={"/contact" as Route}
                className="rounded-sm px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
                style={{ border: "1px solid rgba(201,169,110,0.4)", color: "var(--gold)" }}
              >
                Contact Us
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-0.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
      <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">{title}</h2>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
    />
  );
}
