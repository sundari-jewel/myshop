import mongoose, { Schema, type Document } from "mongoose";

export interface ITryOnSession extends Document {
  sessionId:    string;
  ipAddress:    string;
  skuId:        string;
  photoKey:     string;
  createdAt:    Date;
  expiresAt:    Date;
  regenCount:   number;
  landmarkHash?: string;
  placementMeta?: {
    bodyTargetX:     number;
    bodyTargetY:     number;
    appliedScale:    number;
    appliedRotation: number;
  };
}

const TryOnSessionSchema = new Schema<ITryOnSession>(
  {
    sessionId:  { type: String, required: true, unique: true, index: true },
    ipAddress:  { type: String, required: true },
    skuId:      { type: String, required: true },
    photoKey:   { type: String, required: true },
    expiresAt:  { type: Date, required: true },
    regenCount: { type: Number, default: 0 },
    landmarkHash: { type: String },
    placementMeta: {
      bodyTargetX:     { type: Number },
      bodyTargetY:     { type: Number },
      appliedScale:    { type: Number },
      appliedRotation: { type: Number },
    },
  },
  { timestamps: true }
);

TryOnSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TryOnSession =
  mongoose.models.TryOnSession ||
  mongoose.model<ITryOnSession>("TryOnSession", TryOnSessionSchema);
