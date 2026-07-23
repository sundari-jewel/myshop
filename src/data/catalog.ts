import type { Collection, Product } from "@/types/commerce";

export const collections: Collection[] = [
  {
    slug: "bridal",
    name: "Bridal Heirlooms",
    description: "Statement sets designed for wedding rituals, receptions, and family keepsakes.",
    image: "/assets/Final_product_reveal.webp"
  },
  {
    slug: "daily-gold",
    name: "Daily Gold",
    description: "Lightweight gold pieces for office days, dinners, and effortless gifting.",
    image: "/assets/2567012-removebg-preview_2.webp"
  },
  {
    slug: "diamond-edit",
    name: "Diamond Edit",
    description: "Clean diamond silhouettes with refined settings and modern proportions.",
    image: "/assets/Diamond_close_up.webp"
  }
];

export const products: Product[] = [
  {
    id: "sj-001",
    name: "Aarohi Temple Necklace",
    slug: "aarohi-temple-necklace",
    collection: "bridal",
    price: 189000,
    originalPrice: 210000,
    currency: "INR",
    image: "/assets/3d70f83f-42c8-45a5-ac77-ba56028663a3_1.webp",
    images: [
      "/assets/3d70f83f-42c8-45a5-ac77-ba56028663a3_1.webp",
      "/assets/image_24.webp",
      "/assets/Final_product_reveal.webp",
    ],
    material: "22K Gold",
    stone: "Ruby accents",
    weight: "48.2g",
    purity: "916 BIS Hallmark",
    badge: "Signature",
    description:
      "The Aarohi Temple Necklace draws from the grandeur of South Indian temple architecture — intricate deity motifs and filigree borders crafted by our master karigar. Designed to anchor a bridal ensemble or elevate a festive drape, this piece carries the weight of heritage in every link.",
  },
  {
    id: "sj-002",
    name: "Meera Pearl Choker",
    slug: "meera-pearl-choker",
    collection: "bridal",
    price: 146500,
    currency: "INR",
    image: "/assets/3d70f83f-42c8-45a5-ac77-ba56028663a3_2.webp",
    images: [
      "/assets/3d70f83f-42c8-45a5-ac77-ba56028663a3_2.webp",
      "/assets/image_24_2.webp",
    ],
    material: "18K Gold",
    stone: "Freshwater pearls",
    weight: "32.7g",
    purity: "750 BIS Hallmark",
    description:
      "Named after the poet-saint Meera, this choker pairs luminous AA-grade freshwater pearls with hand-engraved gold links. The graduated pearl arrangement creates a natural drape that sits close to the collarbone — equally at home at a mehendi ceremony or a formal evening.",
  },
  {
    id: "sj-003",
    name: "Noor Diamond Hoops",
    slug: "noor-diamond-hoops",
    collection: "diamond-edit",
    price: 78000,
    originalPrice: 92000,
    currency: "INR",
    image: "/assets/catalog-asset-01.webp",
    images: [
      "/assets/catalog-asset-01.webp",
      "/assets/image_24_3.webp",
      "/assets/Diamond_close_up.webp",
    ],
    material: "18K Gold",
    stone: "Lab-grown diamonds",
    weight: "6.8g",
    purity: "750 BIS Hallmark",
    badge: "New",
    description:
      "The Noor Hoops redefine everyday luxury — a continuous arc set with F/VS lab-grown diamonds that catch light from every angle. The low-profile clasp sits flush behind the ear so the stones remain the sole focus. Designed for the woman who refuses to choose between elegance and comfort.",
  },
  {
    id: "sj-004",
    name: "Ira Gold Stack Ring",
    slug: "ira-gold-stack-ring",
    collection: "daily-gold",
    price: 32500,
    currency: "INR",
    image: "/assets/9110-removebg-preview_1.webp",
    images: ["/assets/9110-removebg-preview_1.webp"],
    material: "18K Gold",
    stone: "Plain gold",
    weight: "4.1g",
    purity: "750 BIS Hallmark",
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    description:
      "The Ira Stack Ring is designed to be worn alone as a quiet statement or layered with our other Ira variants for a curated stack. The domed profile and brushed inner band ensure all-day comfort. Lightweight enough for daily wear, yet crafted with the same care as our heirloom pieces.",
  },
  {
    id: "sj-005",
    name: "Vanya Polki Drops",
    slug: "vanya-polki-drops",
    collection: "bridal",
    price: 98500,
    currency: "INR",
    image: "/assets/catalog-asset-05.webp",
    images: ["/assets/catalog-asset-05.webp", "/assets/image_24_4.webp"],
    material: "22K Gold",
    stone: "Polki",
    weight: "18.5g",
    purity: "916 BIS Hallmark",
    description:
      "Polki — uncut diamonds set in their natural form — are the soul of Mughal jewellery. The Vanya Drops frame each stone in 22K foil-backed gold settings, letting the raw facets scatter candlelight just as they were intended centuries ago. A piece that belongs on a bride and in her heirloom collection.",
  },
  {
    id: "sj-006",
    name: "Tara Everyday Kada",
    slug: "tara-everyday-kada",
    collection: "daily-gold",
    price: 64200,
    originalPrice: 72000,
    currency: "INR",
    image: "/assets/2567012-removebg-preview_1.webp",
    images: ["/assets/2567012-removebg-preview_1.webp", "/assets/image_24_5.webp"],
    material: "22K Gold",
    stone: "Plain gold",
    weight: "22.3g",
    purity: "916 BIS Hallmark",
    badge: "Bestseller",
    description:
      "The Tara Kada is our most-loved piece for a reason — the slight taper from back to front makes it lighter on the wrist than its weight suggests, while the hand-engraved border adds depth without fussiness. It slides on over most wrists without a clasp, and complements both ethnic and contemporary dressing.",
  },
];

export const featuredProducts = products.slice(0, 4);

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((product) => product.collection === slug);
}

export function getRelatedProducts(currentSlug: string, collection: string, limit = 4) {
  return products
    .filter((p) => p.slug !== currentSlug && p.collection === collection)
    .slice(0, limit);
}
