import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/lib/cloudinary", () => ({
  uploadBuffer: vi.fn(),
  fetchBuffer: vi.fn().mockResolvedValue(Buffer.from("asset-png")),
}));
vi.mock("@/lib/placement/landmarks", () => ({
  detectLandmarks: vi.fn().mockResolvedValue({
    targets: [{ side: "center", x: 320, y: 240, z: 0 }],
    imageWidth: 640, imageHeight: 480, confidence: 1.0,
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
    placedBbox: { x: 100, y: 100, w: 50, h: 50 },
  }),
}));
vi.mock("@/lib/replicate", () => ({
  defaultProvider: { startRefinement: vi.fn().mockResolvedValue("rep-001") },
  FLUX_FILL_MODEL: "black-forest-labs/flux-fill-pro",
  buildRefinementPrompt: vi.fn().mockReturnValue("test prompt"),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 9 }),
}));
vi.mock("@/models/TryOnAnalytics", () => ({
  TryOnAnalytics: { create: vi.fn() },
}));

import { POST } from "@/app/api/tryon/session/route";
import { ProductTryonConfig } from "@/models/ProductTryonConfig";
import { TryOnJob } from "@/models/TryOnJob";
import { uploadBuffer } from "@/lib/cloudinary";

function makeRequest(skuId: string): NextRequest {
  const fd = new FormData();
  fd.append("photo", new Blob([Buffer.from("fake-jpeg")], { type: "image/jpeg" }), "photo.jpg");
  fd.append("skuId", skuId);
  return new NextRequest("http://localhost/api/tryon/session", { method: "POST", body: fd });
}

describe("POST /api/tryon/session", () => {
  beforeEach(async () => {
    vi.mocked(uploadBuffer)
      .mockResolvedValueOnce({ url: "https://res.cloudinary.com/t/photo.jpg",   publicId: "t/photo" })
      .mockResolvedValueOnce({ url: "https://res.cloudinary.com/t/preview.jpg", publicId: "t/preview" })
      .mockResolvedValueOnce({ url: "https://res.cloudinary.com/t/mask.jpg",    publicId: "t/mask" });

    await ProductTryonConfig.create({
      skuId: "sku-earring",
      tryonEnabled: true,
      assetStatus: "ready",
      assetKey: "https://res.cloudinary.com/t/asset.png",
      jewelleryType: "earring_stud",
      attachmentX: 0.5, attachmentY: 0.1,
      defaultScaleMm: 12, defaultRotationDeg: 0, mirrorForLeft: true,
      assetReady: true, jewelleryTypeSet: true, calibrationReady: true,
    });
  });

  it("returns 201 with sessionId, jobId, previewUrl", async () => {
    const res  = await POST(makeRequest("sku-earring"));
    const body = await res.json() as { sessionId: string; jobId: string; previewUrl: string };
    expect(res.status).toBe(201);
    expect(body.sessionId).toBeDefined();
    expect(body.jobId).toBeDefined();
    expect(body.previewUrl).toBe("https://res.cloudinary.com/t/preview.jpg");
  });

  it("creates TryOnJob with status preview_ready", async () => {
    const res  = await POST(makeRequest("sku-earring"));
    const body = await res.json() as { jobId: string };
    const job  = await TryOnJob.findOne({ jobId: body.jobId });
    expect(job?.status).toBe("preview_ready");
    expect(job?.previewUrl).toBe("https://res.cloudinary.com/t/preview.jpg");
  });

  it("returns 422 with low_confidence when DetectionError thrown", async () => {
    const { detectLandmarks } = await import("@/lib/placement/landmarks");
    const { DetectionError } = await import("@/lib/placement/landmarks");
    vi.mocked(detectLandmarks).mockRejectedValueOnce(new DetectionError("low_confidence", "no face"));
    const res = await POST(makeRequest("sku-earring"));
    expect(res.status).toBe(422);
    const body = await res.json() as { error: string };
    expect(body.error).toBe("low_confidence");
  });

  it("returns 404 when config gates not satisfied", async () => {
    await ProductTryonConfig.create({
      skuId: "sku-no-calib",
      tryonEnabled: true,
      assetStatus: "ready",
      assetKey: "https://res.cloudinary.com/t/asset.png",
      jewelleryType: "earring_stud",
      attachmentX: 0.5, attachmentY: 0.1, defaultScaleMm: 12,
      assetReady: true, jewelleryTypeSet: true, calibrationReady: false,
    });
    const res = await POST(makeRequest("sku-no-calib"));
    expect(res.status).toBe(404);
  });

  it("returns 429 when rate limited", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0 });
    const res = await POST(makeRequest("sku-earring"));
    expect(res.status).toBe(429);
  });
});
