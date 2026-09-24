import { connectDB } from "./mongodb";
import mongoose, { Schema } from "mongoose";

interface IRateLimit {
  key: string;
  count: number;
  windowStart: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key:         { type: String, required: true, unique: true, index: true },
  count:       { type: Number, default: 0 },
  windowStart: { type: Date,   required: true },
});

// TTL — documents older than 1 hour are auto-deleted
RateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 3600 });

const RateLimitModel =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

export type RateLimitConfig = {
  scope:      string;
  identifier: string;
  max:        number;
  windowMs:   number;
};

// Generic sliding-window (fixed-bucket) rate limiter backed by MongoDB.
// The counter document auto-expires after 1 hour via TTL index, so long windows
// beyond that will still work but the bookkeeping doc will be recycled.
export async function checkRateLimit(
  configOrIp: RateLimitConfig | string,
): Promise<{ allowed: boolean; remaining: number }> {
  const config: RateLimitConfig = typeof configOrIp === "string"
    ? { scope: "tryon", identifier: configOrIp, max: 10, windowMs: 60 * 60 * 1000 }
    : configOrIp;

  await connectDB();

  const now       = new Date();
  const windowKey = `${config.scope}:${config.identifier}`;

  const doc = await RateLimitModel.findOneAndUpdate(
    { key: windowKey },
    {
      $inc:         { count: 1 },
      $setOnInsert: { windowStart: now },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Reset if outside window
  if (now.getTime() - doc.windowStart.getTime() > config.windowMs) {
    await RateLimitModel.updateOne(
      { key: windowKey },
      { $set: { count: 1, windowStart: now } }
    );
    return { allowed: true, remaining: config.max - 1 };
  }

  const remaining = Math.max(0, config.max - doc.count);
  return { allowed: doc.count <= config.max, remaining };
}
