import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/commerce/product-grid";
import { collections, getCollection, getProductsByCollection } from "@/data/catalog";
import { createMetadata } from "@/lib/seo";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return createMetadata({
      title: "Collection not found",
      description: "The requested Sundari Jewels collection could not be found."
    });
  }

  return createMetadata({
    title: collection.name,
    description: collection.description,
    path: `/collections/${collection.slug}`,
    image: collection.image
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = getProductsByCollection(slug);

  return (
    <>
      <section className="relative min-h-[460px] overflow-hidden bg-[var(--surface-deep)] text-white">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="container-shell relative flex min-h-[460px] items-end pb-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
              Collection
            </p>
            <h1 className="display-font mt-3 text-6xl font-semibold">{collection.name}</h1>
            <p className="mt-4 text-lg leading-8 text-[#f1e5d7]">{collection.description}</p>
          </div>
        </div>
      </section>
      <section className="container-shell py-12">
        <ProductGrid products={collectionProducts} />
      </section>
    </>
  );
}
