"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { collections, products } from "@/data/catalog";
import type { CollectionSlug } from "@/types/commerce";
import { ProductGrid } from "./product-grid";

type Filter = "all" | CollectionSlug;

export function ProductExplorer() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleProducts = useMemo(() => {
    if (filter === "all") {
      return products;
    }

    return products.filter((product) => product.collection === filter);
  }, [filter]);

  return (
    <section className="container-shell py-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ruby)]">
            <SlidersHorizontal size={16} />
            Browse
          </p>
          <h1 className="display-font mt-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">All jewellery</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="focus-ring rounded-full border border-[rgba(138,106,58,0.25)] px-4 py-2 text-sm font-semibold data-[active=true]:border-[var(--ruby)] data-[active=true]:bg-[var(--ruby)] data-[active=true]:text-white"
            type="button"
            data-active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {collections.map((collection) => (
            <button
              key={collection.slug}
              className="focus-ring rounded-full border border-[rgba(138,106,58,0.25)] px-4 py-2 text-sm font-semibold data-[active=true]:border-[var(--ruby)] data-[active=true]:bg-[var(--ruby)] data-[active=true]:text-white"
              type="button"
              data-active={filter === collection.slug}
              onClick={() => setFilter(collection.slug)}
            >
              {collection.name}
            </button>
          ))}
        </div>
      </div>
      <ProductGrid products={visibleProducts} />
    </section>
  );
}
