import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="grid min-h-[70vh] place-items-center py-20 text-center"
      style={{ background: "var(--bg-dark)" }}
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">
          Not Found
        </p>
        <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-6xl">
          This piece is missing
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[rgba(245,230,200,0.5)]">
          The page may have moved, or the product is waiting for its next collection drop.
        </p>
        <Link
          href="/products"
          className="focus-ring mt-8 inline-flex rounded-sm px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
          style={{ background: "var(--gold)", color: "#1a0d00" }}
        >
          Browse jewellery
        </Link>
      </div>
    </section>
  );
}
