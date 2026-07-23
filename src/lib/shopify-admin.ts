// Server-only — never import this in client components

// Shopify taxonomy category IDs for jewellery types
export const TAXONOMY_CATEGORY_IDS = {
  necklaces: "aa-6-8",
  earrings:  "aa-6-6",
  bangles:   "aa-6-3", // Bracelets — closest match for bangles
  rings:     "aa-6-9",
  tika:      "aa-6-2", // Body Jewelry — closest match for maang tikka
} as const;

const ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL!;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

// GIDs for the shopify--target-gender metaobjects
export const GENDER_GIDS = {
  female: "gid://shopify/Metaobject/251505311879",
  // male GID will be added once male products are uploaded to Shopify
  male: null as string | null,
} as const;

async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Shopify Admin fetch failed: ${res.status}`);

  const json = (await res.json()) as { data: T; errors?: unknown[] };
  if (json.errors?.length) throw new Error(`Shopify Admin GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data;
}

type AdminProductNode = {
  id: string;
  title: string;
  handle: string;
  status: string;
  featuredImage: { url: string } | null;
  priceRangeV2: {
    minVariantPrice: { amount: string };
    maxVariantPrice: { amount: string };
  };
  compareAtPriceRange: {
    minVariantCompareAtPrice: { amount: string };
  } | null;
  tags: string[];
  metafields: {
    nodes: Array<{ namespace: string; key: string; value: string }>;
  };
};

type AdminProductsData = {
  products: {
    nodes: AdminProductNode[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  };
};

const PRODUCTS_QUERY = `
  query AdminProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        id
        title
        handle
        status
        featuredImage { url }
        priceRangeV2 {
          minVariantPrice { amount }
        }
        compareAtPriceRange {
          minVariantCompareAtPrice { amount }
        }
        tags
        metafields(first: 10, namespace: "shopify") {
          nodes { namespace key value }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export type AdminProduct = {
  id: string;
  title: string;
  handle: string;
  image: string;
  price: number;
  originalPrice?: number;
  tags: string[];
  targetGenderGid: string | null;
  material: string;
};

export async function fetchAllAdminProducts(): Promise<AdminProduct[]> {
  const all: AdminProduct[] = [];
  let after: string | undefined;

  for (;;) {
    const data = await adminFetch<AdminProductsData>(PRODUCTS_QUERY, { first: 50, after: after ?? null });
    const { nodes, pageInfo } = data.products;

    for (const node of nodes) {
      if (node.status !== "ACTIVE") continue;

      const metafields = node.metafields.nodes;
      const genderField = metafields.find((m) => m.key === "target-gender");
      const rawGid = genderField?.value ?? null;

      // value is stored as JSON array: '["gid://..."]'
      let targetGenderGid: string | null = null;
      if (rawGid) {
        try {
          const parsed = JSON.parse(rawGid);
          targetGenderGid = Array.isArray(parsed) ? (parsed[0] ?? null) : rawGid;
        } catch {
          targetGenderGid = rawGid;
        }
      }

      const price = Math.round(parseFloat(node.priceRangeV2.minVariantPrice.amount));
      const compareAt = node.compareAtPriceRange
        ? Math.round(parseFloat(node.compareAtPriceRange.minVariantCompareAtPrice.amount))
        : 0;

      all.push({
        id: node.id.split("/").pop() ?? node.id,
        title: node.title,
        handle: node.handle,
        image: node.featuredImage?.url ?? "",
        price,
        originalPrice: compareAt > price ? compareAt : undefined,
        tags: node.tags,
        targetGenderGid,
        material: "Gold",
      });
    }

    if (!pageInfo.hasNextPage) break;
    after = pageInfo.endCursor;
  }

  return all;
}

import type { Product } from "@/types/commerce";

function mapAdminProductToProduct(p: AdminProduct, collectionHandle: string): Product {
  return {
    id: p.id,
    name: p.title,
    slug: p.handle,
    collection: collectionHandle,
    price: p.price,
    originalPrice: p.originalPrice,
    currency: "INR" as const,
    image: p.image,
    material: p.material,
    stone: "",
    badge: p.tags.find((t) => ["new", "bestseller", "signature"].includes(t.toLowerCase()))
      ? (p.tags.find((t) => ["new", "bestseller", "signature"].includes(t.toLowerCase()))!.charAt(0).toUpperCase() +
        p.tags.find((t) => ["new", "bestseller", "signature"].includes(t.toLowerCase()))!.slice(1))
      : undefined,
  };
}

// Fetch products filtered by Shopify taxonomy category_id (e.g. "aa-6-8" for Necklaces)
const CATEGORY_PRODUCTS_QUERY = `
  query CategoryProducts($first: Int!, $after: String, $query: String!) {
    products(first: $first, after: $after, query: $query) {
      nodes {
        id
        title
        handle
        status
        featuredImage { url }
        priceRangeV2 {
          minVariantPrice { amount }
        }
        compareAtPriceRange {
          minVariantCompareAtPrice { amount }
        }
        tags
        metafields(first: 10, namespace: "shopify") {
          nodes { namespace key value }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export async function getProductsByTaxonomyCategory(
  categoryId: string,
  collectionHandle: string,
): Promise<Product[]> {
  const all: AdminProduct[] = [];
  let after: string | undefined;
  const query = `category_id:${categoryId} AND status:active`;

  for (;;) {
    const data = await adminFetch<AdminProductsData>(CATEGORY_PRODUCTS_QUERY, {
      first: 50,
      after: after ?? null,
      query,
    });
    const { nodes, pageInfo } = data.products;

    for (const node of nodes) {
      const price = Math.round(parseFloat(node.priceRangeV2.minVariantPrice.amount));
      const compareAt = node.compareAtPriceRange
        ? Math.round(parseFloat(node.compareAtPriceRange.minVariantCompareAtPrice.amount))
        : 0;

      all.push({
        id: node.id.split("/").pop() ?? node.id,
        title: node.title,
        handle: node.handle,
        image: node.featuredImage?.url ?? "",
        price,
        originalPrice: compareAt > price ? compareAt : undefined,
        tags: node.tags,
        targetGenderGid: null,
        material: "Gold",
      });
    }

    if (!pageInfo.hasNextPage) break;
    after = pageInfo.endCursor;
  }

  return all.map((p) => mapAdminProductToProduct(p, collectionHandle));
}

export async function getProductsByGenderGid(
  genderGid: string,
  collectionHandle: string,
): Promise<Product[]> {
  const all = await fetchAllAdminProducts();
  return all
    .filter((p) => p.targetGenderGid === genderGid)
    .map((p) => mapAdminProductToProduct(p, collectionHandle));
}
