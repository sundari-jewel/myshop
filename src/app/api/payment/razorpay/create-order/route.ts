import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSession } from "@/lib/session";
import { resolveOrderItems, type CartInput } from "@/lib/resolve-order-items";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { items } = await req.json() as { items?: CartInput[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "no_items" }, { status: 400 });
    }

    const resolved = await resolveOrderItems(items);
    if (!resolved.ok) return NextResponse.json({ error: resolved.error }, { status: 400 });

    const shippingCharge = 0;
    const total          = resolved.data.subtotal + shippingCharge;

    if (total < 1) return NextResponse.json({ error: "invalid_amount" }, { status: 400 });

    const order = await razorpay.orders.create({
      amount:   Math.round(total * 100), // paise
      currency: "INR",
      receipt:  `sj_${Date.now()}`,
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[razorpay/create-order]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
