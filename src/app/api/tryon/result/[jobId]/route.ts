import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TryOnJob } from "@/models/TryOnJob";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectDB();
    const { jobId } = await params;
    const job = await TryOnJob.findOne({ jobId });

    if (!job) return NextResponse.json({ error: "not_found" }, { status: 404 });

    if (job.status === "preview_ready" || job.status === "processing") {
      return NextResponse.json({
        status:     job.status,
        previewUrl: job.previewUrl ?? null,
      });
    }

    if (job.status === "failed") {
      return NextResponse.json({
        status:     "failed",
        errorCode:  job.errorCode ?? "unknown",
        previewUrl: job.previewUrl ?? null,
      });
    }

    // complete (or expired / queued — fall through to complete response)
    return NextResponse.json({
      status:     "complete",
      previewUrl: job.previewUrl ?? null,
      resultUrl:  job.refinedUrl ?? job.previewUrl ?? null,
      elapsedMs:  job.elapsedMs ?? null,
    });
  } catch (err) {
    console.error("[tryon/result]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
