import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { collections } from "@/data/collections";

export function CollectionStrip() {
  return (
    <section className="container-shell py-10 sm:py-16">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ruby)]">
            Collections
          </p>
          <h2 className="display-font mt-2 text-4xl font-semibold sm:text-5xl">Shop by occasion</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)]">
          Server-rendered collection pages are ready for SEO growth, seasonal edits, and editorial
          buying journeys.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}` as Route}
            className="group relative min-h-64 overflow-hidden rounded-md bg-[var(--surface-deep)] text-white sm:min-h-80"
          >
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6">
              <h3 className="display-font text-3xl font-semibold">{collection.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#f1e5d7]">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
