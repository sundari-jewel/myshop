import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/commerce/product-grid";
import { collections } from "@/data/collections";
import { getShopifyCollection, fetchAllShopifyProducts, getProductsByTag } from "@/lib/shopify-collections";
import { getProductsByGenderGid, getTopSellingProducts, getAntiTarnishProducts, getAntiTarnishProductsByGender, GENDER_GIDS } from "@/lib/shopify-admin";
import { createMetadata } from "@/lib/seo";
import { NecklaceSubcategories } from "./necklace-subcategories";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 300;

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

  const genderConfig = GENDER_SLUGS[slug];
  if (genderConfig) {
    return createMetadata({
      title: genderConfig.title,
      description: genderConfig.description,
      path: `/collections/${slug}`,
    });
  }

  const handle = HANDLE_ALIASES[slug] ?? slug;
  const shopify = await getShopifyCollection(handle);
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

// Slugs where our URL doesn't match the Shopify collection handle — map to the real handle
const HANDLE_ALIASES: Record<string, string> = {
  necklaces: "necklace",
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
  const sp = searchParams ? await searchParams : {};

  // 0c. Anti-tarnish gender pages
  if (slug === "anti-tarnish-womens") {
    const products = await getAntiTarnishProductsByGender("female");
    return (
      <CollectionLayout
        products={products}
        title="Anti-Tarnish Jewellery for Her"
        subtitle="Timeless shine, every day — crafted for her, made to last."
      />
    );
  }

  if (slug === "anti-tarnish-mens") {
    const products = await getAntiTarnishProductsByGender("male");
    return (
      <CollectionLayout
        products={products}
        title="Anti-Tarnish Jewellery for Him"
        subtitle="Built for strength, made to last — jewellery that keeps its edge."
      />
    );
  }

  if (slug === "anti-tarnish-jewellery") {
    const products = await getAntiTarnishProducts();
    return (
      <CollectionLayout
        products={products}
        title="Anti-tarnish Jewellery"
        subtitle="Jewellery that keeps its shine — crafted to stay brilliant every day."
      />
    );
  }

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

  // 0a. Sale page — all jewellery
  if (slug === "sale") {
    const products = await fetchAllShopifyProducts();
    return (
      <CollectionLayout
        products={products}
        title="Mega Launch Sale"
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

  // 1. Gender-based pages: fetch from Shopify Admin API by target-gender metafield GID
  const genderConfig = GENDER_SLUGS[slug];
  if (genderConfig) {
    const products = genderConfig.genderGid
      ? await getProductsByGenderGid(genderConfig.genderGid, slug)
      : [];
    return <CollectionLayout products={products} />;
  }

  // 1c. Bridal / wedding — fetch by event tag directly from Shopify
  if (slug === "bridal") {
    const EVENT_TITLES: Record<string, string> = {
      haldi:     "Haldi Collection",
      bridal:    "Bridal Collection",
      mehendi:   "Mehendi Collection",
      sangeet:   "Sangeet Collection",
      reception: "Reception Collection",
    };

    const event    = typeof sp.event === "string" ? sp.event : undefined;
    const products = event && EVENT_TITLES[event]
      ? await getProductsByTag(event)
      : await getProductsByTag("haldi OR tag:bridal OR tag:mehendi OR tag:sangeet OR tag:reception", 200);

    return (
      <CollectionLayout
        products={products}
        title={event && EVENT_TITLES[event] ? EVENT_TITLES[event] : "Shop for Wedding"}
        subtitle={event ? undefined : "Jewellery for every wedding ceremony — from Haldi to Reception."}
      />
    );
  }

  // 1b. Necklaces — with subcategory browse section and optional tag filtering
  if (slug === "necklaces") {
    const shopify = await getShopifyCollection("necklace");
    if (!shopify) notFound();

    const SUBCATEGORY_TAGS: Record<string, string> = {
      "long-necklace":  "long necklace",
      "hasli-necklace": "hasli necklace",
      "choker-set":     "choker set",
      "anti-tarnish":   "anti tarnish",
    };

    const subcategory = typeof sp.subcategory === "string" ? sp.subcategory : undefined;
    const tagFilter   = subcategory ? SUBCATEGORY_TAGS[subcategory] : undefined;

    const products = tagFilter
      ? shopify.products.filter((p) =>
          p.tags?.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))
        )
      : shopify.products;

    return (
      <CollectionLayout
        products={products}
        subcategorySection={<NecklaceSubcategories activeSubcategory={subcategory} />}
      />
    );
  }

  // 2. All other collections — resolve handle alias if needed, then fetch from Shopify
  const handle = HANDLE_ALIASES[slug] ?? slug;
  const shopify = await getShopifyCollection(handle);
  if (!shopify) notFound();

  // Rakhi products can be miscategorised into bracelet/bangle collections in Shopify — exclude them here
  const NON_RAKHI_SLUGS = ["bracelet", "bracelets", "bangles"];
  const products = NON_RAKHI_SLUGS.includes(slug)
    ? shopify.products.filter((p) => !p.tags?.some((t) => t.toLowerCase().includes("rakhi")))
    : shopify.products;

  return <CollectionLayout products={products} />;
}

function CollectionLayout({
  products,
  title,
  subtitle,
  subcategorySection,
}: {
  products: import("@/types/commerce").Product[];
  title?: string;
  subtitle?: string;
  subcategorySection?: ReactNode;
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
      {subcategorySection}
      {subcategorySection && (
        <div className="container-shell pb-1 pt-6 text-center">
          <h2 className="display-font text-2xl italic text-[var(--gold)] sm:text-3xl">Our Products</h2>
          <div
            className="mx-auto mt-3 h-px w-20"
            style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
          />
        </div>
      )}
      <section id="necklace-products" className="container-shell py-7 sm:py-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="py-20 text-center text-sm text-[rgba(245,230,200,0.55)]">No products found in this collection.</p>
        )}
      </section>
    </div>
  );
}

