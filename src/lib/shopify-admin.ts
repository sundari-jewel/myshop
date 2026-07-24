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

async function adminFetch<T>(query: string, variables?: Record<string, unknown>, cache: RequestCache = "no-store"): Promise<T> {
  const res = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
    cache,
  });

  if (!res.ok) throw new Error(`Shopify Admin fetch failed: ${res.status} ${res.statusText}`);

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

export async function getTopSellingProducts(): Promise<Product[]> {
  const data = await adminFetch<AdminProductsData>(CATEGORY_PRODUCTS_QUERY, {
    first: 20,
    after: null,
    query: "tag:top-selling AND status:active",
  });
  return data.products.nodes
    .filter((n) => n.status === "ACTIVE")
    .map((node) => {
      const price = Math.round(parseFloat(node.priceRangeV2.minVariantPrice.amount));
      const compareAt = node.compareAtPriceRange
        ? Math.round(parseFloat(node.compareAtPriceRange.minVariantCompareAtPrice.amount))
        : 0;
      return mapAdminProductToProduct(
        {
          id: node.id.split("/").pop() ?? node.id,
          title: node.title,
          handle: node.handle,
          image: node.featuredImage?.url ?? "",
          price,
          originalPrice: compareAt > price ? compareAt : undefined,
          tags: node.tags,
          targetGenderGid: null,
          material: "Gold",
        },
        "top-selling",
      );
    });
}

export async function getProductsOnSale(categorySlug?: string): Promise<Product[]> {
  if (categorySlug) {
    const categoryId = TAXONOMY_CATEGORY_IDS[categorySlug as keyof typeof TAXONOMY_CATEGORY_IDS];
    if (categoryId) {
      const products = await getProductsByTaxonomyCategory(categoryId, "sale");
      return products.filter((p) => p.originalPrice !== undefined && p.originalPrice > p.price);
    }
  }
  const all = await fetchAllAdminProducts();
  return all
    .filter((p) => p.originalPrice !== undefined && p.originalPrice > p.price)
    .map((p) => mapAdminProductToProduct(p, "sale"));
}

const DRAFT_ORDER_CREATE = `
  mutation DraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type DraftOrderCreateData = {
  draftOrderCreate: {
    draftOrder: { id: string; name: string; invoiceUrl: string } | null;
    userErrors: { field: string; message: string }[];
  };
};

export type DraftOrderInput = {
  items: { name: string; price: number; qty: number; size?: string }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: { line1: string; line2?: string; city: string; state: string; pincode: string };
  };
  orderId: string;
  paymentMethod: "cod" | "prepaid";
  shippingCharge: number;
};

export async function createShopifyDraftOrder(input: DraftOrderInput): Promise<{ id: string; name: string } | null> {
  const [firstName, ...rest] = input.customer.name.trim().split(" ");
  const lastName = rest.join(" ") || ".";

  const lineItems = input.items.map((item) => ({
    title: item.size ? `${item.name} (Size: ${item.size})` : item.name,
    originalUnitPrice: item.price.toFixed(2),
    quantity: item.qty,
    taxable: false,
    requiresShipping: true,
  }));

  const draftInput: Record<string, unknown> = {
    lineItems,
    shippingAddress: {
      firstName,
      lastName,
      address1: input.customer.address.line1,
      address2: input.customer.address.line2 ?? "",
      city: input.customer.address.city,
      province: input.customer.address.state,
      zip: input.customer.address.pincode,
      country: "IN",
      phone: input.customer.phone,
    },
    email: input.customer.email,
    note: `Internal Order ID: ${input.orderId} | Payment: ${input.paymentMethod.toUpperCase()} | Phone: ${input.customer.phone}`,
    tags: [input.paymentMethod === "cod" ? "COD" : "Prepaid", "website-order"],
  };

  if (input.shippingCharge > 0) {
    draftInput.shippingLine = {
      title: "Standard Shipping",
      price: input.shippingCharge.toFixed(2),
    };
  }

  console.log("[shopify-draft-order] creating draft for order:", input.orderId);

  const data = await adminFetch<DraftOrderCreateData>(DRAFT_ORDER_CREATE, { input: draftInput });

  if (data.draftOrderCreate.userErrors.length > 0) {
    console.error("[shopify-draft-order] userErrors:", JSON.stringify(data.draftOrderCreate.userErrors));
    return null;
  }

  const draft = data.draftOrderCreate.draftOrder;
  if (!draft) return null;
  console.log("[shopify-draft-order] created:", draft.name);
  return { id: draft.id, name: draft.name };
}

const DRAFT_ORDER_COMPLETE = `
  mutation DraftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id) {
      draftOrder {
        order { id name }
      }
      userErrors { field message }
    }
  }
`;

type DraftOrderCompleteData = {
  draftOrderComplete: {
    draftOrder: { order: { id: string; name: string } | null } | null;
    userErrors: { field: string; message: string }[];
  };
};

export async function completeDraftOrder(draftOrderGid: string): Promise<string | null> {
  const data = await adminFetch<DraftOrderCompleteData>(DRAFT_ORDER_COMPLETE, { id: draftOrderGid });

  if (data.draftOrderComplete.userErrors.length > 0) {
    console.error("[shopify-complete-draft] userErrors:", JSON.stringify(data.draftOrderComplete.userErrors));
    return null;
  }

  const orderName = data.draftOrderComplete.draftOrder?.order?.name ?? null;
  console.log("[shopify-complete-draft] confirmed order:", orderName);
  return orderName;
}
