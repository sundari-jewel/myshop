import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/lib/cloudinary", () => ({
  uploadFromUrl: vi.fn().mockResolvedValue({
    url: "https://res.cloudinary.com/t/refined.jpg",
    publicId: "t/refined",
  }),
}));

process.env.REPLICATE_WEBHOOK_SECRET = "test-secret";

import { POST } from "@/app/api/tryon/webhook/route";
import { TryOnJob } from "@/models/TryOnJob";

function makeSignedWebhook(body: object): NextRequest {
  const bodyStr = JSON.stringify(body);
  const sig = crypto.createHmac("sha256", "test-secret").update(bodyStr).digest("hex");
  return new NextRequest("http://localhost/api/tryon/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "webhook-signature": sig },
    body: bodyStr,
  });
}

function makeUnsignedWebhook(body: object): NextRequest {
  return new NextRequest("http://localhost/api/tryon/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "webhook-signature": "bad-sig" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/tryon/webhook", () => {
  it("ignores webhook with invalid HMAC", async () => {
    await TryOnJob.create({
      jobId: "job-hmac", sessionId: "s1", skuId: "sku1",
      status: "processing", providerJobId: "rep-hmac-test", previewUrl: "https://pre.jpg", seed: 1,
    });
    const res = await POST(makeUnsignedWebhook({ id: "rep-hmac-test", status: "succeeded", output: ["https://output.jpg"] }));
    expect(res.status).toBe(200);
    const job = await TryOnJob.findOne({ jobId: "job-hmac" });
    expect(job?.status).toBe("processing"); // unchanged
  });

  it("stores refinedUrl and sets complete on succeeded webhook", async () => {
    await TryOnJob.create({
      jobId: "job-ok", sessionId: "s2", skuId: "sku1",
      status: "processing", providerJobId: "rep-ok", previewUrl: "https://pre.jpg", seed: 2,
    });
    const res = await POST(makeSignedWebhook({
      id: "rep-ok", status: "succeeded",
      output: ["https://replicate.delivery/refined.png"],
      metrics: { predict_time: 3.2 },
    }));
    expect(res.status).toBe(200);
    const job = await TryOnJob.findOne({ jobId: "job-ok" });
    expect(job?.status).toBe("complete");
    expect(job?.refinedUrl).toBe("https://res.cloudinary.com/t/refined.jpg");
    expect(job?.elapsedMs).toBe(3200);
  });

  it("sets complete (previewUrl fallback) on failed webhook", async () => {
    await TryOnJob.create({
      jobId: "job-fail", sessionId: "s3", skuId: "sku1",
      status: "processing", providerJobId: "rep-fail", previewUrl: "https://pre.jpg", seed: 3,
    });
    const res = await POST(makeSignedWebhook({ id: "rep-fail", status: "failed", error: "timeout" }));
    expect(res.status).toBe(200);
    const job = await TryOnJob.findOne({ jobId: "job-fail" });
    expect(job?.status).toBe("complete");
    expect(job?.refinedUrl).toBeUndefined();
  });
});
