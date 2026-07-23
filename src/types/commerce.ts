export type CollectionSlug = "bridal" | "daily-gold" | "diamond-edit";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  originalPrice?: number;
  currency: "INR";
  image: string;
  images?: string[];
  material: string;
  stone: string;
  weight?: string;
  purity?: string;
  badge?: string;
  description?: string;
  sizes?: string[];
};
