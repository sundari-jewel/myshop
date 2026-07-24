import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/commerce/product-grid";
import { collections } from "@/data/collections";
import { getShopifyCollection } from "@/lib/shopify-collections";
import { getProductsByGenderGid, getProductsByTaxonomyCategory, getProductsOnSale, getTopSellingProducts, GENDER_GIDS, TAXONOMY_CATEGORY_IDS } from "@/lib/shopify-admin";
import { fetchAllShopifyProducts } from "@/lib/shopify-collections";
import { createMetadata } from "@/lib/seo";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;

  const staticCollection = collections.find((c) => c.slug === slug);
  if (staticCollection) {
    return createMetadata({
      title: staticCollection.name,
      description: staticCollection.description,
      path: `/collections/${slug}`,
      image: staticCollection.image,
    });
  }

  const categoryConfig = CATEGORY_SLUGS[slug];
  if (categoryConfig) {
    return createMetadata({
      title: categoryConfig.title,
      description: categoryConfig.description,
      path: `/collections/${slug}`,
    });
  }

  const genderConfig = GENDER_SLUGS[slug];
  if (genderConfig) {
    return createMetadata({
      title: genderConfig.title,
      description: genderConfig.description,
      path: `/collections/${slug}`,
    });
  }

  const shopify = await getShopifyCollection(slug);
  if (shopify) {
    return createMetadata({
      title: shopify.collection.title,
      description: shopify.collection.description,
      path: `/collections/${slug}`,
      image: shopify.collection.image ?? undefined,
    });
  }

  return createMetadata({
    title: "Collection",
    description: "Browse Sundari Jewellers collection.",
  });
}

// Maps collection slugs to Shopify taxonomy category IDs
const CATEGORY_SLUGS: Record<string, { categoryId: string; title: string; description: string }> = {
  necklaces: { categoryId: TAXONOMY_CATEGORY_IDS.necklaces, title: "Necklaces", description: "Discover our exquisite necklace collection." },
  earrings:  { categoryId: TAXONOMY_CATEGORY_IDS.earrings,  title: "Earrings",  description: "Elegant earrings for every occasion." },
  bangles:   { categoryId: TAXONOMY_CATEGORY_IDS.bangles,   title: "Bangles",   description: "Timeless bangles and bracelets." },
  rings:     { categoryId: TAXONOMY_CATEGORY_IDS.rings,     title: "Rings",     description: "Beautiful rings for every moment." },
  tika:      { categoryId: TAXONOMY_CATEGORY_IDS.tika,      title: "Tika",      description: "Traditional maang tikka and head jewellery." },
};

const GENDER_SLUGS: Record<string, { genderGid: string | null; title: string; description: string; image: string }> = {
  "womens-edit": {
    genderGid: GENDER_GIDS.female,
    title: "Crafted for Her",
    description: "Elegant jewellery for every woman, for every moment.",
    image: "/assets/CrafterForHerLeft.webp",
  },
  "mens-edit": {
    genderGid: GENDER_GIDS.male,
    title: "Crafted for Him",
    description: "Timeless jewellery for every man, for every occasion.",
    image: "/assets/CraftedForHimRight.webp",
  },
};

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const { category } = await searchParams;

  // 0b. Top selling page
  if (slug === "top-selling") {
    const products = await getTopSellingProducts();
    return (
      <CollectionLayout
        products={products}
        title="Top Selling"
        subtitle="Our community's most loved pieces — handpicked and highly sought after."
      />
    );
  }

  // 0a. Sale page — products with a compare-at price set in Shopify
  if (slug === "sale") {
    const products = await getProductsOnSale(category);
    const title = category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} on Sale`
      : "Grand Sale for All Sundaris";
    return (
      <CollectionLayout
        products={products}
        title={title}
        subtitle="Exquisite pieces from our finest collections — now at extraordinary savings."
      />
    );
  }

  // 0. Gifting page — random selection of products
  if (slug === "gifting") {
    const all = await fetchAllShopifyProducts();
    const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 12);
    return <CollectionLayout products={shuffled} title="Gifts They'll Love" subtitle="Handpicked for every occasion — thoughtful jewellery for the people who matter." />;
  }

  // 1. Jewellery category pages: fetch from Shopify Admin API by taxonomy category_id
  const categoryConfig = CATEGORY_SLUGS[slug];
  if (categoryConfig) {
    const products = await getProductsByTaxonomyCategory(categoryConfig.categoryId, slug);
    return <CollectionLayout products={products} />;
  }

  // 3. Gender-based pages: fetch from Shopify Admin API by target-gender metafield GID
  const genderConfig = GENDER_SLUGS[slug];
  if (genderConfig) {
    const products = genderConfig.genderGid
      ? await getProductsByGenderGid(genderConfig.genderGid, slug)
      : [];
    return <CollectionLayout products={products} />;
  }

  // 4. Any other Shopify collection by handle
  const shopify = await getShopifyCollection(slug);
  if (!shopify) notFound();

  return <CollectionLayout products={shopify.products} />;
}

function CollectionLayout({
  products,
  title,
  subtitle,
}: {
  products: import("@/types/commerce").Product[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "60vh" }}>
      {title && (
        <div className="container-shell pb-2 pt-8 text-center sm:pt-12">
          <h1 className="display-font text-4xl font-semibold italic text-[var(--gold)] sm:text-5xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.55)]">{subtitle}</p>}
          <div className="mx-auto mt-6 h-px w-24" style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }} />
        </div>
      )}
      <section className="container-shell py-7 sm:py-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="py-20 text-center text-sm text-[rgba(245,230,200,0.55)]">No products found in this collection.</p>
        )}
      </section>
    </div>
  );
}
