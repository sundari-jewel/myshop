import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:        { type: String, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer ?? mongoose.model<ICustomer>("Customer", CustomerSchema);
