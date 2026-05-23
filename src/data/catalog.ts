import type { Collection, Product } from "@/types/commerce";

export const collections: Collection[] = [
  {
    slug: "bridal",
    name: "Bridal Heirlooms",
    description: "Statement sets designed for wedding rituals, receptions, and family keepsakes.",
    image: "/assets/Final_product_reveal.png"
  },
  {
    slug: "daily-gold",
    name: "Daily Gold",
    description: "Lightweight gold pieces for office days, dinners, and effortless gifting.",
    image: "/assets/2567012-removebg-preview_2.png"
  },
  {
    slug: "diamond-edit",
    name: "Diamond Edit",
    description: "Clean diamond silhouettes with refined settings and modern proportions.",
    image: "/assets/Diamond_close_up.png"
  }
];

export const products: Product[] = [
  {
    id: "sj-001",
    name: "Aarohi Temple Necklace",
    slug: "aarohi-temple-necklace",
    collection: "bridal",
    price: 189000,
    currency: "INR",
    image: "/assets/3d70f83f-42c8-45a5-ac77-ba56028663a3_1.png",
    material: "22K Gold",
    stone: "Ruby accents",
    badge: "Signature"
  },
  {
    id: "sj-002",
    name: "Meera Pearl Choker",
    slug: "meera-pearl-choker",
    collection: "bridal",
    price: 146500,
    currency: "INR",
    image: "/assets/3d70f83f-42c8-45a5-ac77-ba56028663a3_2.png",
    material: "18K Gold",
    stone: "Freshwater pearls"
  },
  {
    id: "sj-003",
    name: "Noor Diamond Hoops",
    slug: "noor-diamond-hoops",
    collection: "diamond-edit",
    price: 78000,
    currency: "INR",
    image: "/assets/catalog-asset-01.png",
    material: "18K Gold",
    stone: "Lab-grown diamonds",
    badge: "New"
  },
  {
    id: "sj-004",
    name: "Ira Gold Stack Ring",
    slug: "ira-gold-stack-ring",
    collection: "daily-gold",
    price: 32500,
    currency: "INR",
    image: "/assets/9110-removebg-preview_1.png",
    material: "18K Gold",
    stone: "Plain gold"
  },
  {
    id: "sj-005",
    name: "Vanya Polki Drops",
    slug: "vanya-polki-drops",
    collection: "bridal",
    price: 98500,
    currency: "INR",
    image: "/assets/catalog-asset-05.png",
    material: "22K Gold",
    stone: "Polki"
  },
  {
    id: "sj-006",
    name: "Tara Everyday Kada",
    slug: "tara-everyday-kada",
    collection: "daily-gold",
    price: 64200,
    currency: "INR",
    image: "/assets/2567012-removebg-preview_1.png",
    material: "22K Gold",
    stone: "Plain gold",
    badge: "Bestseller"
  }
];

export const featuredProducts = products.slice(0, 4);

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((product) => product.collection === slug);
}
