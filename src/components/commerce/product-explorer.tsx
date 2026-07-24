"use client";

import {
  ArrowDownAZ,
  Check,
  Gem,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/types/commerce";
import { ProductGrid } from "./product-grid";

type SortMode = "featured" | "price-low" | "price-high" | "name";
type PriceBand = "all" | "under-50" | "50-100" | "100-plus";

const priceBands: Array<{ label: string; value: PriceBand; helper: string }> = [
  { label: "All prices", value: "all", helper: "Every atelier piece" },
  { label: "Under 50k", value: "under-50", helper: "Lightweight daily edits" },
  { label: "50k - 1L", value: "50-100", helper: "Statement-ready pieces" },
  { label: "Above 1L", value: "100-plus", helper: "Heirloom investments" },
];

const sortOptions: Array<{ label: string; value: SortMode }> = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Name A-Z", value: "name" },
];

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function ProductExplorer({ products }: { products: Product[] }) {
  const [materialFilter, setMaterialFilter] = useState("all");
  const [stoneFilter, setStoneFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceBand>("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [query, setQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const materials = useMemo(() => uniqueValues(products.map((product) => product.material).filter(Boolean)), [products]);
  const stones = useMemo(() => uniqueValues(products.map((product) => product.stone).filter(Boolean)), [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesMaterial = materialFilter === "all" || product.material === materialFilter;
      const matchesStone = stoneFilter === "all" || product.stone === stoneFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [product.name, product.material, product.stone, product.badge]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under-50" && product.price < 50000) ||
        (priceFilter === "50-100" && product.price >= 50000 && product.price <= 100000) ||
        (priceFilter === "100-plus" && product.price > 100000);

      return matchesMaterial && matchesStone && matchesQuery && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "price-low") return a.price - b.price;
      if (sortMode === "price-high") return b.price - a.price;
      if (sortMode === "name") return a.name.localeCompare(b.name);
      return products.findIndex((product) => product.id === a.id) - products.findIndex((product) => product.id === b.id);
    });
  }, [materialFilter, priceFilter, products, query, sortMode, stoneFilter]);

  const activeFilterCount = [
    materialFilter !== "all",
    stoneFilter !== "all",
    priceFilter !== "all",
    query.trim().length > 0,
  ].filter(Boolean).length;

  function resetFilters() {
    setMaterialFilter("all");
    setStoneFilter("all");
    setPriceFilter("all");
    setQuery("");
    setSortMode("featured");
  }

  const filterPanel = (
    <aside
      className="h-fit border p-3 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur md:p-4 lg:sticky lg:top-6"
      style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}
    >
      <div className="flex items-center justify-between border-b pb-3 md:pb-4" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--gold-dim)]">Refine</p>
          <h2 className="mt-1 text-sm font-semibold text-[var(--cream)]">Find your finish</h2>
        </div>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            className="focus-ring inline-flex size-9 items-center justify-center rounded-sm border text-[var(--ruby)] transition hover:bg-[rgba(155,28,28,0.08)]"
            style={{ borderColor: "rgba(155,28,28,0.22)" }}
            onClick={resetFilters}
            aria-label="Reset all filters"
            title="Reset filters"
          >
            <RotateCcw size={16} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 md:mt-5 md:gap-6">
        <fieldset>
          <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[rgba(201,169,110,0.7)]">
            Price
          </legend>
          <div className="grid gap-2">
            {priceBands.map((band) => (
              <button
                key={band.value}
                type="button"
                className="focus-ring grid grid-cols-[1fr_auto] items-center gap-2 rounded-sm border border-[rgba(138,106,58,0.2)] px-2.5 py-2 text-left transition data-[active=true]:border-[var(--ruby)] data-[active=true]:bg-[rgba(155,28,28,0.06)] md:gap-3 md:px-3 md:py-2.5"
                data-active={priceFilter === band.value}
                onClick={() => setPriceFilter(band.value)}
              >
                <span>
                  <span className="block text-xs font-semibold text-[var(--cream)]">{band.label}</span>
                  <span className="mt-0.5 block text-[10px] text-[rgba(245,230,200,0.5)]">{band.helper}</span>
                </span>
                {priceFilter === band.value ? <Check size={14} className="text-[var(--ruby)]" /> : null}
              </button>
            ))}
          </div>
        </fieldset>

        <FilterChipGroup title="Material" options={materials} value={materialFilter} onChange={setMaterialFilter} />
        <FilterChipGroup title="Stone" options={stones} value={stoneFilter} onChange={setStoneFilter} />
      </div>
    </aside>
  );

  return (
    <section style={{ background: "var(--bg-dark)" }}>
      <div className="w-full px-2.5 py-4 md:px-8 md:py-14">
        <div
          className="relative overflow-hidden border bg-[var(--bg-dark)] px-3.5 py-4 text-[var(--cream)] md:px-8 md:py-8 lg:px-10 lg:py-11"
          style={{ borderColor: "rgba(201,169,110,0.24)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(105deg, rgba(14,4,4,0.95) 0%, rgba(42,14,14,0.86) 48%, rgba(155,28,28,0.34) 100%), url('/assets/golden-swirl-frame-dark-background-with-text-space.webp')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="relative grid gap-5 md:gap-8 lg:grid-cols-[1fr_330px] lg:items-end">
            <div>
              <h1 className="display-font max-w-3xl text-[2rem] font-semibold leading-none md:text-6xl lg:text-7xl">
                All Jewellery
              </h1>
              <p className="mt-2.5 max-w-2xl text-xs leading-5 text-[var(--cream-muted)] md:mt-5 md:text-base md:leading-7">
                Browse bridal heirlooms, daily gold, diamond essentials, and modern classics with filters tuned for real jewellery decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:mt-7 md:gap-5 lg:grid-cols-[286px_1fr] lg:items-start">
          <div className="hidden lg:block">{filterPanel}</div>

          <div className="min-w-0">
            <div
              className="mb-3 grid grid-cols-2 gap-2 border p-2 backdrop-blur md:mb-5 md:grid-cols-[1fr_auto_auto] md:gap-3 md:p-3"
              style={{ background: "rgba(201,169,110,0.05)", borderColor: "rgba(201,169,110,0.18)" }}
            >
              <label
                className="focus-within:ring-2 focus-within:ring-[var(--gold)] col-span-2 grid h-10 grid-cols-[auto_1fr] items-center gap-2 rounded-sm border px-2.5 md:col-span-1 md:h-12 md:gap-3 md:px-3"
                style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
              >
                <Search size={15} className="text-[var(--gold-dim)] md:size-[17px]" />
                <span className="sr-only">Search jewellery</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, material, stone..."
                  className="h-full min-w-0 bg-transparent text-xs text-[var(--cream)] outline-none placeholder:text-[rgba(245,230,200,0.35)] md:text-sm"
                />
              </label>

              <button
                type="button"
                className="focus-ring inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-sm border px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--bg-dark)] md:h-12 md:gap-2 md:px-4 md:text-xs md:tracking-[0.2em] lg:hidden"
                style={{ borderColor: "rgba(138,106,58,0.24)", background: "var(--gold-pale)" }}
                onClick={() => setShowMobileFilters((open) => !open)}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 ? <span className="text-[var(--ruby)]">({activeFilterCount})</span> : null}
              </button>

              <label
                className="grid h-10 min-w-0 grid-cols-[auto_1fr] items-center gap-1.5 rounded-sm border px-2 md:h-12 md:gap-3 md:px-3"
                style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
              >
                <ArrowDownAZ size={15} className="text-[var(--gold-dim)] md:size-[17px]" />
                <span className="sr-only">Sort products</span>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="h-full min-w-0 w-full bg-transparent text-xs font-semibold text-[var(--cream)] outline-none md:min-w-[168px] md:text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {showMobileFilters ? (
              <div className="mb-4 lg:hidden">
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 px-2 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ruby)]"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X size={15} />
                    Close
                  </button>
                </div>
                {filterPanel}
              </div>
            ) : null}

            <div className="mb-3 flex flex-col gap-2 md:mb-5 md:flex-row md:items-center md:justify-between md:gap-3">
              <p className="text-xs font-medium text-[rgba(245,230,200,0.55)] md:text-sm">
                Showing <span className="font-bold text-[var(--cream)]">{visibleProducts.length}</span> of {products.length} pieces
              </p>
              <div className="flex flex-wrap gap-2">
                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ruby)]"
                    style={{ borderColor: "rgba(155,28,28,0.25)" }}
                    onClick={resetFilters}
                  >
                    <RotateCcw size={14} />
                    Clear all
                  </button>
                ) : null}
              </div>
            </div>

            {visibleProducts.length > 0 ? (
              <ProductGrid products={visibleProducts} />
            ) : (
              <div
                className="grid min-h-[320px] place-items-center border px-6 text-center"
                style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)" }}
              >
                <div>
                  <Gem className="mx-auto text-[var(--gold-dim)]" size={30} />
                  <h2 className="display-font mt-4 text-3xl font-semibold text-[var(--cream)]">No pieces found</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[rgba(245,230,200,0.55)]">
                    Try removing a filter or searching for a broader material, stone, or collection.
                  </p>
                  <button
                    type="button"
                    className="focus-ring mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[var(--bg-dark)] px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold-pale)]"
                    onClick={resetFilters}
                  >
                    <RotateCcw size={15} />
                    Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterChipGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[rgba(201,169,110,0.7)]">
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="focus-ring rounded-sm border border-[rgba(138,106,58,0.22)] px-3 py-2 text-xs font-semibold text-[var(--cream)] transition data-[active=true]:border-[var(--ruby)] data-[active=true]:bg-[var(--ruby)] data-[active=true]:text-white"
          data-active={value === "all"}
          onClick={() => onChange("all")}
        >
          All
        </button>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="focus-ring rounded-sm border border-[rgba(138,106,58,0.22)] px-3 py-2 text-xs font-semibold text-[var(--cream)] transition data-[active=true]:border-[var(--ruby)] data-[active=true]:bg-[var(--ruby)] data-[active=true]:text-white"
            data-active={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
