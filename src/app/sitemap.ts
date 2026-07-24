import type { MetadataRoute } from "next";
import { fetchAllShopifyProducts } from "@/lib/shopify-collections";

const BASE_URL = "https://www.sundariartjewellery.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                               priority: 1.0,  changeFrequency: "daily" },
  { url: `${BASE_URL}/products`,                 priority: 0.9,  changeFrequency: "daily" },
  { url: `${BASE_URL}/collections/earrings`,     priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/necklaces`,    priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/bangles`,      priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/rings`,        priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/tika`,         priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/watches`,      priority: 0.7,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/rakhi`,        priority: 0.7,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/gifting`,      priority: 0.7,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/bridal`,       priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/diamond-edit`, priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/daily-gold`,   priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/womens-edit`,  priority: 0.7,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/collections/mens-edit`,    priority: 0.7,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/shipping`,                 priority: 0.4,  changeFrequency: "monthly" },
  { url: `${BASE_URL}/returns`,                  priority: 0.4,  changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const products = await fetchAllShopifyProducts();
    productRoutes = products.map((p) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    // If Shopify is unreachable, return static routes only
  }

  return [...STATIC_ROUTES, ...productRoutes];
}
