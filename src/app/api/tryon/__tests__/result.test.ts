import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));

import { GET } from "@/app/api/tryon/result/[jobId]/route";
import { TryOnJob } from "@/models/TryOnJob";

function makeGet(jobId: string) {
  return new NextRequest(`http://localhost/api/tryon/result/${jobId}`);
}

async function resolveParams(jobId: string) {
  return { params: Promise.resolve({ jobId }) };
}

describe("GET /api/tryon/result/:jobId", () => {
  it("returns preview_ready with previewUrl when job is in preview_ready state", async () => {
    await TryOnJob.create({
      jobId: "job-pr", sessionId: "s1", skuId: "sku1",
      status: "preview_ready",
      previewUrl: "https://res.cloudinary.com/t/preview.jpg",
      seed: 1,
    });
    const res  = await GET(makeGet("job-pr"), await resolveParams("job-pr"));
    const body = await res.json() as { status: string; previewUrl: string };
    expect(res.status).toBe(200);
    expect(body.status).toBe("preview_ready");
    expect(body.previewUrl).toBe("https://res.cloudinary.com/t/preview.jpg");
  });

  it("returns complete with refinedUrl when refinement done", async () => {
    await TryOnJob.create({
      jobId: "job-done", sessionId: "s2", skuId: "sku1",
      status: "complete",
      previewUrl:  "https://res.cloudinary.com/t/preview.jpg",
      refinedUrl:  "https://res.cloudinary.com/t/refined.jpg",
      seed: 2, elapsedMs: 3200,
    });
    const res  = await GET(makeGet("job-done"), await resolveParams("job-done"));
    const body = await res.json() as { status: string; resultUrl: string; previewUrl: string; elapsedMs: number };
    expect(body.status).toBe("complete");
    expect(body.resultUrl).toBe("https://res.cloudinary.com/t/refined.jpg");
    expect(body.previewUrl).toBe("https://res.cloudinary.com/t/preview.jpg");
  });

  it("falls back to previewUrl as resultUrl when no refinedUrl", async () => {
    await TryOnJob.create({
      jobId: "job-fallback", sessionId: "s3", skuId: "sku1",
      status: "complete",
      previewUrl: "https://res.cloudinary.com/t/preview.jpg",
      seed: 3,
    });
    const res  = await GET(makeGet("job-fallback"), await resolveParams("job-fallback"));
    const body = await res.json() as { resultUrl: string };
    expect(body.resultUrl).toBe("https://res.cloudinary.com/t/preview.jpg");
  });

  it("returns 404 for unknown jobId", async () => {
    const res = await GET(makeGet("job-unknown"), await resolveParams("job-unknown"));
    expect(res.status).toBe(404);
  });
});
