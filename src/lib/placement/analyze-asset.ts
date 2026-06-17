import sharp from "sharp";

export type AssetCategory = "earring" | "necklace" | "ring" | "kada_bracelet";

export interface AssetAnalysis {
  attachmentX:     number;
  attachmentY:     number;
  boundingBox:     { x: number; y: number; w: number; h: number };
  naturalWidthPx:  number;
  naturalHeightPx: number;
  suggestedMirror: boolean;
}

export async function analyzeAsset(
  pngBuffer: Buffer,
  category: AssetCategory
): Promise<AssetAnalysis> {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * channels + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const bbox = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  const centerX = (minX + maxX) / 2;

  let attachmentX: number;
  let attachmentY: number;

  switch (category) {
    case "earring":
    case "necklace":
      attachmentX = centerX / width;
      attachmentY = minY / height;
      break;
    case "ring":
      attachmentX = centerX / width;
      attachmentY = maxY / height;
      break;
    case "kada_bracelet":
      attachmentX = centerX / width;
      attachmentY = (minY + maxY) / 2 / height;
      break;
  }

  return {
    attachmentX,
    attachmentY,
    boundingBox: bbox,
    naturalWidthPx: width,
    naturalHeightPx: height,
    suggestedMirror: centerX < width * 0.5 - 5,
  };
}
