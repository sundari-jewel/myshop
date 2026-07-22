import { shopifyFetch } from "@/lib/shopify";

export type HeroBanner = {
  image: string;
  link: string;
};

type MetaobjectField = {
  key: string;
  value: string | null;
  reference: { previewImage: { url: string } } | null;
};

type HeroBannersData = {
  metaobjects: {
    nodes: Array<{ fields: MetaobjectField[] }>;
  };
};

const QUERY = `
  query HeroBanners {
    metaobjects(type: "hero_banner", first: 10) {
      nodes {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              previewImage {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const data = await shopifyFetch<HeroBannersData>(QUERY);
    return data.metaobjects.nodes.flatMap((node) => {
      const imageField = node.fields.find((f) => f.key === "image");
      const linkField = node.fields.find((f) => f.key === "link");

      const imageUrl = imageField?.reference?.previewImage?.url;
      const link = linkField?.value ?? "/";

      if (!imageUrl) return [];
      return [{ image: imageUrl, link }];
    });
  } catch {
    return [];
  }
}
