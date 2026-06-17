import mongoose, { Schema, type Document } from "mongoose";

export type JewelleryType =
  | "earring_stud"
  | "earring_drop"
  | "earring_jhumka"
  | "necklace_choker"
  | "necklace_long"
  | "ring"
  | "kada"
  | "bracelet";

export type AssetStatus = "pending" | "ready" | "error";

export interface IProductTryonConfig extends Document {
  skuId:              string;
  tryonEnabled:       boolean;
  assetKey?:          string;
  assetStatus:        AssetStatus;
  jewelleryType?:     JewelleryType;
  promptDescriptor?:  string;
  // Calibration fields
  attachmentX?:       number;
  attachmentY?:       number;
  defaultScaleMm?:    number;
  defaultRotationDeg?: number;
  mirrorForLeft?:     boolean;
  // Three-gate readiness
  assetReady:         boolean;
  jewelleryTypeSet:   boolean;
  calibrationReady:   boolean;
  totalTryons:        number;
}

const ProductTryonConfigSchema = new Schema<IProductTryonConfig>(
  {
    skuId:              { type: String, required: true, unique: true, index: true },
    tryonEnabled:       { type: Boolean, default: false },
    assetKey:           { type: String },
    assetStatus:        { type: String, enum: ["pending", "ready", "error"], default: "pending" },
    jewelleryType: {
      type: String,
      enum: [
        "earring_stud", "earring_drop", "earring_jhumka",
        "necklace_choker", "necklace_long",
        "ring", "kada", "bracelet",
      ],
    },
    promptDescriptor:   { type: String, maxlength: 256 },
    attachmentX:        { type: Number },
    attachmentY:        { type: Number },
    defaultScaleMm:     { type: Number },
    defaultRotationDeg: { type: Number, default: 0 },
    mirrorForLeft:      { type: Boolean, default: false },
    assetReady:         { type: Boolean, default: false },
    jewelleryTypeSet:   { type: Boolean, default: false },
    calibrationReady:   { type: Boolean, default: false },
    totalTryons:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductTryonConfig =
  mongoose.models.ProductTryonConfig ||
  mongoose.model<IProductTryonConfig>("ProductTryonConfig", ProductTryonConfigSchema);
