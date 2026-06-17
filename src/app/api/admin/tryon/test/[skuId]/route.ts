import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { connectDB } from "@/lib/mongodb";
import { uploadBuffer, fetchBuffer } from "@/lib/cloudinary";
import { detectLandmarks, DetectionError } from "@/lib/placement/landmarks";
import { compositeJewellery, type PlacementConfig } from "@/lib/placement/composite";
import { ProductTryonConfig } from "@/models/ProductTryonConfig";

const SAMPLE_FACE = path.join(process.cwd(), "public/tryon-sample/neutral-face.jpg");
const SAMPLE_HAND = path.join(process.cwd(), "public/tryon-sample/hand-palm.jpg");

const HAND_TYPES = ["ring", "kada", "bracelet"];

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ skuId: string }> }
) {
  try {
    await connectDB();
    const { skuId } = await params;

    const config = await ProductTryonConfig.findOne({ skuId });
    if (!config?.assetReady || !config?.calibrationReady || !config?.jewelleryTypeSet) {
      return NextResponse.json({ error: "not_calibrated" }, { status: 422 });
    }

    const samplePath = HAND_TYPES.includes(config.jewelleryType!) ? SAMPLE_HAND : SAMPLE_FACE;
    const photoBuffer = await fs.readFile(samplePath);
    const assetBuffer = await fetchBuffer(config.assetKey!);

    let targets;
    try {
      const lr = await detectLandmarks(photoBuffer, config.jewelleryType!);
      targets = lr.targets;
    } catch (err) {
      if (err instanceof DetectionError) {
        return NextResponse.json({ error: err.code }, { status: 422 });
      }
      throw err;
    }

    const placementConfig: PlacementConfig = {
      attachmentX:        config.attachmentX!,
      attachmentY:        config.attachmentY!,
      defaultScaleMm:     config.defaultScaleMm!,
      defaultRotationDeg: config.defaultRotationDeg ?? 0,
      mirrorForLeft:      config.mirrorForLeft ?? false,
    };

    const { compositeBuffer } = await compositeJewellery(
      photoBuffer, assetBuffer, placementConfig, targets
    );

    const { url: previewUrl } = await uploadBuffer(
      compositeBuffer,
      `sundari/admin-test/${skuId}`,
      "preview"
    );

    return NextResponse.json({ ok: true, previewUrl });
  } catch (err) {
    console.error("[admin/tryon/test]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
