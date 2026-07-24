import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import type { IOrderItem } from "@/models/Order";
import { getShopifyProduct } from "@/lib/shopify-collections";
import { createShopifyDraftOrder, completeDraftOrder } from "@/lib/shopify-admin";

async function nextOrderId(): Promise<string> {
  const last = await Order.findOne({}, { orderId: 1 }).sort({ createdAt: -1 }).lean() as { orderId: string } | null;
  if (!last) return "SJ-000001";
  const num = parseInt(last.orderId.split("-")[1] ?? "0", 10);
  return `SJ-${String(num + 1).padStart(6, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      razorpayPaymentId: string;
      razorpayOrderId:   string;
      razorpaySignature: string;
      items: { productId: string; slug: string; qty: number; size?: string }[];
      customer: {
        name:  string;
        email: string;
        phone: string;
        address: { line1: string; line2?: string; city: string; state: string; pincode: string };
      };
      notes?: string;
    };

    // Verify Razorpay signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
      .digest("hex");

    if (expected !== body.razorpaySignature) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
    }

    await connectDB();

    const orderItems: IOrderItem[] = [];
    for (const item of body.items) {
      const product = await getShopifyProduct(item.slug);
      if (!product) {
        return NextResponse.json({ error: `product_unavailable:${item.slug}` }, { status: 400 });
      }
      orderItems.push({
        productId: product.id,
        slug:      product.slug,
        name:      product.name,
        image:     product.images?.[0] ?? product.image,
        material:  product.material,
        price:     product.price,
        qty:       item.qty,
        size:      item.size,
      });
    }

    const subtotal       = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingCharge = subtotal >= 50000 ? 0 : 1;
    const total          = subtotal + shippingCharge;
    const orderId        = await nextOrderId();

    const order = await Order.create({
      orderId,
      items:             orderItems,
      customer:          body.customer,
      subtotal,
      shippingCharge,
      total,
      paymentMethod:     "prepaid",
      status:            "confirmed",
      paymentStatus:     "paid",
      razorpayPaymentId: body.razorpayPaymentId,
      razorpayOrderId:   body.razorpayOrderId,
      notes:             body.notes,
    });

    try {
      const draft = await createShopifyDraftOrder({
        items:         orderItems.map((i) => ({ name: i.name, price: i.price, qty: i.qty, size: i.size })),
        customer:      body.customer,
        orderId:       order.orderId,
        paymentMethod: "prepaid",
        shippingCharge,
      });
      if (draft) {
        await completeDraftOrder(draft.id);
      }
    } catch (err) {
      console.error("[razorpay/verify] shopify order failed:", err);
    }

    return NextResponse.json({ orderId: order.orderId });
  } catch (err) {
    console.error("[razorpay/verify]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
