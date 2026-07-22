import { describe, it, expect, vi, beforeEach } from "vitest";

// Must mock before importing the module under test
vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

import { shopifyFetch } from "@/lib/shopify";
import { getHeroBanners } from "@/lib/hero-banners";

const mockFetch = vi.mocked(shopifyFetch);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getHeroBanners", () => {
  it("returns banners with image and link", async () => {
    mockFetch.mockResolvedValue({
      metaobjects: {
        nodes: [
          {
            fields: [
              { key: "image", reference: { previewImage: { url: "https://cdn.shopify.com/a.jpg" } } },
              { key: "link", value: "/collections/bridal" },
            ],
          },
          {
            fields: [
              { key: "image", reference: { previewImage: { url: "https://cdn.shopify.com/b.jpg" } } },
              { key: "link", value: "/collections/rings" },
            ],
          },
        ],
      },
    });

    const banners = await getHeroBanners();

    expect(banners).toEqual([
      { image: "https://cdn.shopify.com/a.jpg", link: "/collections/bridal" },
      { image: "https://cdn.shopify.com/b.jpg", link: "/collections/rings" },
    ]);
  });

  it("returns empty array when no metaobjects exist", async () => {
    mockFetch.mockResolvedValue({ metaobjects: { nodes: [] } });
    const banners = await getHeroBanners();
    expect(banners).toEqual([]);
  });

  it("strips entries missing an image URL", async () => {
    mockFetch.mockResolvedValue({
      metaobjects: {
        nodes: [
          {
            fields: [
              { key: "image", reference: null },
              { key: "link", value: "/collections/bridal" },
            ],
          },
          {
            fields: [
              { key: "image", reference: { previewImage: { url: "https://cdn.shopify.com/b.jpg" } } },
              { key: "link", value: "/collections/rings" },
            ],
          },
        ],
      },
    });

    const banners = await getHeroBanners();
    expect(banners).toHaveLength(1);
    expect(banners[0].image).toBe("https://cdn.shopify.com/b.jpg");
  });

  it("returns empty array when shopifyFetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const banners = await getHeroBanners();
    expect(banners).toEqual([]);
  });
});
