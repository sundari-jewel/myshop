import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Sundari Jewels";

type SeoInput = {
  title?: string;
  description: string;
  path?: string;
  image?: string;
};

export function createMetadata({ title, description, path = "/", image }: SeoInput): Metadata {
  const resolvedTitle = title ? `${title} | ${brandName}` : brandName;
  const url = new URL(path, siteUrl).toString();
  const imageUrl = image ? new URL(image, siteUrl).toString() : new URL("/assets/Final_product_reveal.png", siteUrl).toString();

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: brandName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: resolvedTitle
        }
      ],
      locale: "en_IN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl]
    }
  };
}

export function formatPrice(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}
