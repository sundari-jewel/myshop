import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import type { IOrderItem } from "@/models/Order";
import { getShopifyProduct } from "@/lib/shopify-collections";
import { createShopifyDraftOrder, completeDraftOrder } from "@/lib/shopify-admin";

async function nextOrderId(): Promise<string> {
  const last = await Order.findOne({}, { orderId: 1 }).sort({ createdAt: -1 }).lean();
  if (!last) return "SJ-000001";
  const num = parseInt(last.orderId.split("-")[1] ?? "0", 10);
  return `SJ-${String(num + 1).padStart(6, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json() as {
      items: { productId: string; slug: string; qty: number; size?: string }[];
      customer: {
        name: string; email: string; phone: string;
        address: { line1: string; line2?: string; city: string; state: string; pincode: string };
      };
      paymentMethod: "cod" | "prepaid";
      notes?: string;
    };

    if (!body.items?.length || !body.customer || !body.paymentMethod) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

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
      items:          orderItems,
      customer:       body.customer,
      subtotal,
      shippingCharge,
      total,
      paymentMethod:  body.paymentMethod,
      status:         "confirmed",
      paymentStatus:  "pending",
      notes:          body.notes,
    });

    // Push to Shopify as a draft then immediately complete it so Delhivery sees a confirmed order
    let shopifyOrderName: string | null = null;
    try {
      const draft = await createShopifyDraftOrder({
        items: orderItems.map((i) => ({ name: i.name, price: i.price, qty: i.qty, size: i.size })),
        customer: body.customer,
        orderId: order.orderId,
        paymentMethod: body.paymentMethod,
        shippingCharge,
      });
      if (draft) {
        shopifyOrderName = await completeDraftOrder(draft.id, body.paymentMethod === "cod");
      }
    } catch (err) {
      console.error("[checkout] shopify order failed:", err);
    }

    return NextResponse.json({ orderId: order.orderId, total: order.total, shopifyOrder: shopifyOrderName }, { status: 201 });
  } catch (err: unknown) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
