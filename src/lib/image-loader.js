/**
 * Custom Next.js image loader.
 * Routes Shopify images through Shopify's native CDN resizing (?width=X)
 * and Cloudinary images through Cloudinary transformations,
 * avoiding Vercel's /_next/image quota entirely.
 */
export default function imageLoader({ src, width, quality }) {
  if (src.includes("cdn.shopify.com") || src.includes("cdn.shop.app")) {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    if (quality) url.searchParams.set("quality", String(quality));
    return url.toString();
  }

  if (src.includes("res.cloudinary.com")) {
    return src.replace("/upload/", `/upload/w_${width},q_${quality ?? "auto"}/`);
  }

  return src;
}
