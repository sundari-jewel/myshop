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
  collection: CollectionSlug;
  price: number;
  currency: "INR";
  image: string;
  material: string;
  stone: string;
  badge?: string;
};
