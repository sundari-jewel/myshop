import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/lib/cloudinary", () => ({
  uploadBuffer: vi.fn().mockResolvedValue({
    url: "https://res.cloudinary.com/t/asset.png",
    publicId: "t/asset",
  }),
}));
vi.mock("@/lib/placement/analyze-asset", () => ({
  analyzeAsset: vi.fn().mockResolvedValue({
    attachmentX: 0.5, attachmentY: 0.1,
    boundingBox: { x: 10, y: 5, w: 60, h: 80 },
    naturalWidthPx: 100, naturalHeightPx: 100,
    suggestedMirror: false,
  }),
}));

import { POST } from "@/app/api/admin/tryon/assets/[skuId]/route";
import { ProductTryonConfig } from "@/models/ProductTryonConfig";

function makeUpload(skuId: string, jewelleryType?: string): NextRequest {
  const fd = new FormData();
  fd.append("asset", new Blob([Buffer.from("fake-png")], { type: "image/png" }), "asset.png");
  if (jewelleryType) fd.append("jewelleryType", jewelleryType);
  return new NextRequest(`http://localhost/api/admin/tryon/assets/${skuId}`, { method: "POST", body: fd });
}

async function resolveParams(skuId: string) {
  return { params: Promise.resolve({ skuId }) };
}

describe("POST /api/admin/tryon/assets/:skuId", () => {
  it("stores assetKey and sets assetReady=true", async () => {
    const res = await POST(makeUpload("sku-a", "earring_stud"), await resolveParams("sku-a"));
    expect(res.status).toBe(200);
    const cfg = await ProductTryonConfig.findOne({ skuId: "sku-a" });
    expect(cfg?.assetKey).toBe("https://res.cloudinary.com/t/asset.png");
    expect(cfg?.assetReady).toBe(true);
  });

  it("stores analyzeAsset proposals when jewelleryType provided", async () => {
    await POST(makeUpload("sku-b", "earring_stud"), await resolveParams("sku-b"));
    const cfg = await ProductTryonConfig.findOne({ skuId: "sku-b" });
    expect(cfg?.attachmentX).toBe(0.5);
    expect(cfg?.attachmentY).toBe(0.1);
    expect(cfg?.calibrationReady).toBe(false);
    expect(cfg?.jewelleryTypeSet).toBe(true);
  });

  it("does not set calibrationReady=true automatically", async () => {
    await POST(makeUpload("sku-c", "ring"), await resolveParams("sku-c"));
    const cfg = await ProductTryonConfig.findOne({ skuId: "sku-c" });
    expect(cfg?.calibrationReady).toBe(false);
  });
});
