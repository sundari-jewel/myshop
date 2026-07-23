import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const orders = await Order.find({ "customer.email": session.email })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json(orders);
}
