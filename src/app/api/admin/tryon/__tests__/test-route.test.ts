import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/lib/cloudinary", () => ({
  uploadBuffer: vi.fn().mockResolvedValue({ url: "https://res.cloudinary.com/t/preview.jpg", publicId: "t/preview" }),
  fetchBuffer: vi.fn().mockResolvedValue(Buffer.alloc(100)),
}));
vi.mock("fs/promises", () => ({
  default: { readFile: vi.fn().mockResolvedValue(Buffer.from("fake-jpeg")) },
  readFile: vi.fn().mockResolvedValue(Buffer.from("fake-jpeg")),
}));
vi.mock("@/lib/placement/landmarks", () => ({
  detectLandmarks: vi.fn().mockResolvedValue({
    targets: [{ side: "left", x: 150, y: 300, z: 0 }, { side: "right", x: 330, y: 300, z: 0 }],
    imageWidth: 480, imageHeight: 640, confidence: 1.0,
  }),
  DetectionError: class DetectionError extends Error {
    code: string;
    constructor(code: string, message: string) { super(message); this.code = code; }
  },
}));
vi.mock("@/lib/placement/composite", () => ({
  compositeJewellery: vi.fn().mockResolvedValue({
    compositeBuffer: Buffer.from("composite"),
    blendMaskBuffer: Buffer.from("mask"),
    placedBbox: { x: 100, y: 100, w: 50, h: 80 },
  }),
}));

import { POST } from "@/app/api/admin/tryon/test/[skuId]/route";
import { ProductTryonConfig } from "@/models/ProductTryonConfig";
import { TryOnJob } from "@/models/TryOnJob";

function makePost(skuId: string) {
  return new NextRequest(`http://localhost/api/admin/tryon/test/${skuId}`, { method: "POST" });
}

async function resolveParams(skuId: string) {
  return { params: Promise.resolve({ skuId }) };
}

describe("POST /api/admin/tryon/test/:skuId", () => {
  it("returns previewUrl without creating a TryOnJob", async () => {
    await ProductTryonConfig.create({
      skuId: "sku-test",
      assetKey: "https://res.cloudinary.com/t/asset.png",
      jewelleryType: "earring_stud",
      attachmentX: 0.5, attachmentY: 0.1, defaultScaleMm: 12,
      assetReady: true, jewelleryTypeSet: true, calibrationReady: true,
    });

    const res  = await POST(makePost("sku-test"), await resolveParams("sku-test"));
    const body = await res.json() as { previewUrl: string };
    expect(res.status).toBe(200);
    expect(body.previewUrl).toBe("https://res.cloudinary.com/t/preview.jpg");

    const jobCount = await TryOnJob.countDocuments({});
    expect(jobCount).toBe(0);
  });

  it("returns 422 when config not calibrated", async () => {
    await ProductTryonConfig.create({
      skuId: "sku-uncal", assetKey: "https://x.jpg",
      jewelleryType: "earring_stud", attachmentX: 0.5, attachmentY: 0.1, defaultScaleMm: 12,
      assetReady: true, jewelleryTypeSet: true, calibrationReady: false,
    });
    const res = await POST(makePost("sku-uncal"), await resolveParams("sku-uncal"));
    expect(res.status).toBe(422);
  });
});
