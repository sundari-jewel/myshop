import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { products } from "@/data/catalog";
import { createMetadata, formatPrice } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return createMetadata({
      title: "Product not found",
      description: "The requested Sundari Jewels product could not be found."
    });
  }

  return createMetadata({
    title: product.name,
    description: `${product.name} in ${product.material} with ${product.stone}.`,
    path: `/products/${product.slug}`,
    image: product.image
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_0.85fr]">
      <div className="relative min-h-[620px] overflow-hidden rounded-md bg-[#f4eadc]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-contain p-10"
        />
      </div>
      <div className="self-center">
        {product.badge ? (
          <p className="mb-4 inline-flex rounded-full bg-[var(--ruby)] px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </p>
        ) : null}
        <h1 className="display-font text-6xl font-semibold leading-none">{product.name}</h1>
        <p className="mt-5 text-2xl font-semibold">{formatPrice(product.price)}</p>
        <div className="mt-8 grid gap-4 border-y border-[var(--line)] py-6 text-sm">
          <p>
            <span className="font-semibold">Material:</span> {product.material}
          </p>
          <p>
            <span className="font-semibold">Stone:</span> {product.stone}
          </p>
          <p>
            <span className="font-semibold">Care:</span> Store separately and avoid perfume,
            chlorine, or abrasive cloths.
          </p>
        </div>
        <div className="mt-8">
          <AddToCartButton productName={product.name} />
        </div>
      </div>
    </section>
  );
}
