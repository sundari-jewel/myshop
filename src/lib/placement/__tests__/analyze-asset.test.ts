import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { analyzeAsset, type AssetCategory } from "@/lib/placement/analyze-asset";

async function makePng(
  width: number,
  height: number,
  fillX: number,
  fillY: number,
  fillW: number,
  fillH: number
): Promise<Buffer> {
  const data = Buffer.alloc(width * height * 4, 0);
  for (let y = fillY; y < fillY + fillH; y++) {
    for (let x = fillX; x < fillX + fillW; x++) {
      const i = (y * width + x) * 4;
      data[i] = 255; data[i+1] = 200; data[i+2] = 0; data[i+3] = 255;
    }
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

// 100x100 PNG, opaque region at x=20,y=10,w=60,h=80
// bboxCenter = (20+79)/2 = 49.5 → normalised ≈ 0.495
// attachmentY earring = top = 10/100 = 0.1
// attachmentY ring    = bottom = 89/100 = 0.89

describe("analyzeAsset", () => {
  it("detects bounding box correctly", async () => {
    const buf = await makePng(100, 100, 20, 10, 60, 80);
    const result = await analyzeAsset(buf, "earring");
    expect(result.boundingBox.x).toBe(20);
    expect(result.boundingBox.y).toBe(10);
    expect(result.boundingBox.w).toBe(60);
    expect(result.boundingBox.h).toBe(80);
    expect(result.naturalWidthPx).toBe(100);
    expect(result.naturalHeightPx).toBe(100);
  });

  it("earring: attachment at top-center", async () => {
    const buf = await makePng(100, 100, 20, 10, 60, 80);
    const { attachmentX, attachmentY } = await analyzeAsset(buf, "earring");
    expect(attachmentX).toBeCloseTo(0.495, 2);
    expect(attachmentY).toBe(0.1);
  });

  it("ring: attachment at bottom-center", async () => {
    const buf = await makePng(100, 100, 20, 10, 60, 80);
    const { attachmentY } = await analyzeAsset(buf, "ring");
    expect(attachmentY).toBe(0.89);
  });

  it("kada_bracelet: attachment at geometric center", async () => {
    const buf = await makePng(100, 100, 20, 10, 60, 80);
    const { attachmentY } = await analyzeAsset(buf, "kada_bracelet");
    expect(attachmentY).toBeCloseTo(0.495, 2);
  });

  it("suggests mirror when bbox is left-leaning", async () => {
    // opaque region at x=5..35 (center ≈ 20, clearly left of 50)
    const buf = await makePng(100, 100, 5, 10, 30, 80);
    const { suggestedMirror } = await analyzeAsset(buf, "earring");
    expect(suggestedMirror).toBe(true);
  });

  it("does not suggest mirror for centered asset", async () => {
    // opaque region centered at x=35..65
    const buf = await makePng(100, 100, 35, 10, 30, 80);
    const { suggestedMirror } = await analyzeAsset(buf, "earring");
    expect(suggestedMirror).toBe(false);
  });

  it("throws for fully transparent PNG", async () => {
    // 100x100 all-transparent PNG
    const transparent = await sharp({
      create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    }).png().toBuffer();
    await expect(analyzeAsset(transparent, "earring")).rejects.toThrow("no opaque pixels");
  });
});
