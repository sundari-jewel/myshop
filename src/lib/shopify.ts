const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token  = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!;
const endpoint = `https://${domain}/api/2025-01/graphql.json`;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data: T; errors?: unknown[] };
  return json.data;
}
