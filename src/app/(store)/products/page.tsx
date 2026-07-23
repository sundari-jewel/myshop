import type { Metadata } from "next";
import { ProductExplorer } from "@/components/commerce/product-explorer";
import { fetchAllShopifyProducts } from "@/lib/shopify-collections";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = createMetadata({
  title: "Jewellery",
  description: "Browse Sundari Jewels gold, diamond, bridal, and everyday jewellery collections.",
  path: "/products"
});

export default async function ProductsPage() {
  const products = await fetchAllShopifyProducts();
  return <ProductExplorer products={products} />;
}
