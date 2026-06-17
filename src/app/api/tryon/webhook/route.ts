import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { uploadFromUrl } from "@/lib/cloudinary";
import { TryOnJob } from "@/models/TryOnJob";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const bodyText = await req.text();
    const sig      = req.headers.get("webhook-signature") ?? "";
    const expected = crypto
      .createHmac("sha256", process.env.REPLICATE_WEBHOOK_SECRET!)
      .update(bodyText)
      .digest("hex");

    if (sig !== expected) {
      // Silent ignore — job stays in current state, fallback poll will catch it
      return NextResponse.json({ ok: true });
    }

    const body = JSON.parse(bodyText) as {
      id:       string;
      status:   string;
      output?:  string | string[];
      error?:   string;
      metrics?: { predict_time?: number };
    };

    const job = await TryOnJob.findOne({ providerJobId: body.id });
    if (!job) return NextResponse.json({ ok: true });

    if (body.status === "succeeded") {
      const outputUrl = Array.isArray(body.output) ? body.output[0] : body.output;
      if (!outputUrl) {
        await TryOnJob.updateOne({ providerJobId: body.id }, { $set: { status: "complete", completedAt: new Date() } });
        return NextResponse.json({ ok: true });
      }

      const { url: refinedUrl } = await uploadFromUrl(
        outputUrl,
        `sundari/results/${job.jobId}`,
        "refined"
      );
      const elapsedMs = body.metrics?.predict_time
        ? Math.round(body.metrics.predict_time * 1000)
        : undefined;

      await TryOnJob.updateOne(
        { providerJobId: body.id },
        { $set: { status: "complete", refinedUrl, elapsedMs, completedAt: new Date() } }
      );
    } else if (body.status === "failed" || body.status === "canceled") {
      // previewUrl remains — set complete so polling client gets a result
      await TryOnJob.updateOne(
        { providerJobId: body.id },
        { $set: { status: "complete", completedAt: new Date() } }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[tryon/webhook]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
