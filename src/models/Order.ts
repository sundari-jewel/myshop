import mongoose, { Schema, type Document } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "ready_for_pickup"
  | "picked_up"
  | "cancelled";

export type PaymentStatus    = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod    = "prepaid";
export type FulfillmentType  = "delivery" | "pickup";
export type ShippingTier     = "standard" | "express";

export interface IOrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  material: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  variantId?: string;
}

export interface IOrder extends Document {
  orderId: string;
  items: IOrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  fulfillmentType: FulfillmentType;
  pickupReceiver?: {
    name?:  string;
    phone?: string;
  };
  shippingTier?:  ShippingTier;
  subtotal: number;
  shippingCharge: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paidAmount?: number;
  amountDiscrepancy?: number;
  shopifyOrderName?: string;
  shopifySyncStatus?: "pending" | "synced" | "failed";
  shopifySyncError?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    slug:      { type: String, required: true },
    name:      { type: String, required: true },
    image:     { type: String, required: true },
    material:  { type: String, required: true },
    price:     { type: Number, required: true },
    qty:       { type: Number, required: true, min: 1 },
    size:      { type: String },
    color:     { type: String },
    variantId: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    items:   [OrderItemSchema],
    customer: {
      name:  { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        line1:   { type: String },
        line2:   { type: String },
        city:    { type: String },
        state:   { type: String },
        pincode: { type: String },
      },
    },
    fulfillmentType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
      default: "delivery",
      index: true,
    },
    pickupReceiver: {
      name:  { type: String },
      phone: { type: String },
    },
    shippingTier: {
      type: String,
      enum: ["standard", "express"],
    },
    subtotal:       { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    total:          { type: Number, required: true },
    status:         {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "ready_for_pickup", "picked_up", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["prepaid"],
      required: true,
      default: "prepaid",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpayPaymentId: { type: String, unique: true, sparse: true, index: true },
    razorpayOrderId:   { type: String, unique: true, sparse: true, index: true },
    paidAmount:        { type: Number },
    amountDiscrepancy: { type: Number, index: true },
    shopifyOrderName:  { type: String },
    shopifySyncStatus: { type: String, enum: ["pending", "synced", "failed"], default: "pending", index: true },
    shopifySyncError:  { type: String },
    trackingNumber:    { type: String },
    trackingUrl:       { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customer.email": 1 });

export const Order =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
