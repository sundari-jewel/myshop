import { shopifyFetch } from "@/lib/shopify";
import type { Product } from "@/types/commerce";

type MoneyV2 = { amount: string };

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  priceRange: { minVariantPrice: MoneyV2 };
  compareAtPriceRange: { minVariantPrice: MoneyV2 };
  featuredImage: { url: string } | null;
  images?: { nodes: { url: string }[] };
  tags: string[];
  metafields: Array<{ key: string; value: string | null } | null>;
  description?: string;
};

type CollectionData = {
  collection: {
    title: string;
    description: string;
    image: { url: string } | null;
    products: { nodes: ShopifyProductNode[] };
  } | null;
};

type ProductsData = {
  products: { nodes: ShopifyProductNode[] };
};

const PRODUCT_FIELDS = `
  id
  title
  handle
  priceRange { minVariantPrice { amount } }
  compareAtPriceRange { minVariantPrice { amount } }
  featuredImage { url }
  tags
  metafields(identifiers: [
    { namespace: "custom", key: "material" }
    { namespace: "custom", key: "stone" }
    { namespace: "shopify", key: "gender" }
    { namespace: "descriptors", key: "gender" }
  ]) {
    key
    value
  }
`;

const COLLECTION_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      description
      image { url }
      products(first: $first) {
        nodes { ${PRODUCT_FIELDS} }
      }
    }
  }
`;

const PRODUCTS_BY_GENDER_QUERY = `
  query ProductsByGender($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      nodes { ${PRODUCT_FIELDS} }
    }
  }
`;

export type ShopifyCollectionMeta = {
  title: string;
  description: string;
  image: string | null;
};

function mapNode(node: ShopifyProductNode, collectionHandle: string): Product {
  const price = Math.round(parseFloat(node.priceRange.minVariantPrice.amount));
  const compareAt = Math.round(
    parseFloat(node.compareAtPriceRange.minVariantPrice.amount),
  );
  const originalPrice = compareAt > price ? compareAt : undefined;

  const metafields = (node.metafields ?? []).filter(
    (m): m is { key: string; value: string | null } => m !== null,
  );
  const material =
    metafields.find((m) => m.key === "material")?.value ??
    node.tags.find((t) => t.startsWith("material:"))?.replace("material:", "") ??
    "Gold";
  const stone =
    metafields.find((m) => m.key === "stone")?.value ??
    node.tags.find((t) => t.startsWith("stone:"))?.replace("stone:", "") ??
    "";

  const badgeTag = node.tags.find((t) =>
    ["new", "bestseller", "signature"].includes(t.toLowerCase()),
  );
  const badge = badgeTag
    ? badgeTag.charAt(0).toUpperCase() + badgeTag.slice(1)
    : undefined;

  const images = node.images?.nodes.map((img) => img.url).filter(Boolean);

  return {
    id: node.id.split("/").pop() ?? node.id,
    name: node.title,
    slug: node.handle,
    collection: collectionHandle,
    price,
    originalPrice,
    currency: "INR",
    image: node.featuredImage?.url ?? (images?.[0] ?? ""),
    ...(images && images.length > 0 ? { images } : {}),
    material,
    stone,
    badge,
    ...(node.description ? { description: node.description } : {}),
  };
}

const ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: TITLE) {
      nodes { ${PRODUCT_FIELDS} }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

type AllProductsData = {
  products: {
    nodes: ShopifyProductNode[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  };
};

export async function fetchAllShopifyProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let after: string | undefined;

  try {
    for (;;) {
      const data = await shopifyFetch<AllProductsData>(ALL_PRODUCTS_QUERY, {
        first: 250,
        after: after ?? null,
      });
      for (const node of data.products.nodes) {
        all.push(mapNode(node, "shopify"));
      }
      if (!data.products.pageInfo.hasNextPage) break;
      after = data.products.pageInfo.endCursor;
    }
  } catch {
    return [];
  }

  return all;
}

// Fetch a Shopify collection by handle
export async function getShopifyCollection(
  handle: string,
): Promise<{ collection: ShopifyCollectionMeta; products: Product[] } | null> {
  try {
    const data = await shopifyFetch<CollectionData>(COLLECTION_QUERY, {
      handle,
      first: 50,
    });
    if (!data.collection) return null;

    return {
      collection: {
        title: data.collection.title,
        description: data.collection.description,
        image: data.collection.image?.url ?? null,
      },
      products: data.collection.products.nodes.map((n) => mapNode(n, handle)),
    };
  } catch {
    return null;
  }
}

const SINGLE_PRODUCT_QUERY = `
  query SingleProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange { minVariantPrice { amount } }
      compareAtPriceRange { minVariantPrice { amount } }
      featuredImage { url }
      images(first: 10) { nodes { url } }
      tags
      metafields(identifiers: [
        { namespace: "custom", key: "material" }
        { namespace: "custom", key: "stone" }
        { namespace: "shopify", key: "gender" }
        { namespace: "descriptors", key: "gender" }
      ]) {
        key
        value
      }
    }
  }
`;

type SingleProductData = { product: ShopifyProductNode | null };

export async function getShopifyProduct(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<SingleProductData>(SINGLE_PRODUCT_QUERY, { handle });
    if (!data.product) return null;
    return mapNode(data.product, "shopify");
  } catch {
    return null;
  }
}

const PRODUCTS_BY_IDS_QUERY = `
  query ProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        description
        priceRange { minVariantPrice { amount } }
        compareAtPriceRange { minVariantPrice { amount } }
        featuredImage { url }
        images(first: 1) { nodes { url } }
        tags
        metafields(identifiers: [
          { namespace: "custom", key: "material" }
          { namespace: "custom", key: "stone" }
        ]) {
          key
          value
        }
      }
    }
  }
`;

type ProductsByIdsData = { nodes: (ShopifyProductNode | null)[] };

export async function getShopifyProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  try {
    const gids = ids.map((id) => `gid://shopify/Product/${id}`);
    const data = await shopifyFetch<ProductsByIdsData>(PRODUCTS_BY_IDS_QUERY, { ids: gids });
    return data.nodes
      .filter((n): n is ShopifyProductNode => n !== null && "handle" in n)
      .map((n) => mapNode(n, "shopify"));
  } catch {
    return [];
  }
}

const RELATED_PRODUCTS_QUERY = `
  query RelatedProducts($first: Int!, $excludeHandle: String!) {
    products(first: $first, sortKey: BEST_SELLING, query: NOT handle:$excludeHandle) {
      nodes { ${PRODUCT_FIELDS} }
    }
  }
`;

export async function getRelatedShopifyProducts(excludeHandle: string, limit = 4): Promise<Product[]> {
  try {
    const data = await shopifyFetch<ProductsData>(RELATED_PRODUCTS_QUERY, {
      first: limit,
      excludeHandle,
    });
    return data.products.nodes.map((n) => mapNode(n, "shopify"));
  } catch {
    return [];
  }
}

// Gender values Shopify stores via the product details gender selector
const GENDER_QUERY_MAP: Record<string, string> = {
  female: "tag:female OR tag:women OR tag:Women OR metafield.shopify.gender:female OR metafield.shopify.gender:Female OR metafield.descriptors.gender:female",
  male:   "tag:male OR tag:men OR tag:Men OR metafield.shopify.gender:male OR metafield.shopify.gender:Male OR metafield.descriptors.gender:male",
};

// Fetch products by the gender field set in Shopify product details
export async function getProductsByGender(
  gender: "female" | "male",
  collectionHandle: string,
): Promise<Product[]> {
  try {
    const query = GENDER_QUERY_MAP[gender];
    const data = await shopifyFetch<ProductsData>(PRODUCTS_BY_GENDER_QUERY, {
      query,
      first: 50,
    });
    return data.products.nodes.map((n) => mapNode(n, collectionHandle));
  } catch {
    return [];
  }
}
