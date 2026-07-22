if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
  throw new Error("Missing env: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
}
if (!process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN) {
  throw new Error("Missing env: SHOPIFY_STOREFRONT_PRIVATE_TOKEN");
}

const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
  const endpoint = `https://${domain}/api/2025-01/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data: T; errors?: unknown[] };
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}
