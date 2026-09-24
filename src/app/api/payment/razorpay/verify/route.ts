import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getSession } from "@/lib/session";
import { createShopifyDraftOrder, completeDraftOrder } from "@/lib/shopify-admin";
import { nextOrderId } from "@/lib/order-id";
import { resolveOrderItems, type CartInput } from "@/lib/resolve-order-items";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Tolerance in rupees for float/rounding drift between server total and Razorpay paid amount.
const AMOUNT_TOLERANCE = 1;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json() as {
      razorpayPaymentId: string;
      razorpayOrderId:   string;
      razorpaySignature: string;
      items: CartInput[];
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

    // Idempotency: if this payment has already been recorded, return the existing order
    await connectDB();
    const existing = await Order.findOne({ razorpayPaymentId: body.razorpayPaymentId }, { orderId: 1 }).lean() as { orderId: string } | null;
    if (existing) {
      return NextResponse.json({ orderId: existing.orderId });
    }

    // Server-side resolve items and total from Shopify (source of truth)
    const resolved = await resolveOrderItems(body.items);
    if (!resolved.ok) return NextResponse.json({ error: resolved.error }, { status: 400 });

    const shippingCharge = 0;
    const total          = resolved.data.subtotal + shippingCharge;

    // Fetch the amount actually captured by Razorpay
    let paidAmount: number;
    try {
      const rzpOrder = await razorpay.orders.fetch(body.razorpayOrderId);
      paidAmount = Number(rzpOrder.amount) / 100;
    } catch (err) {
      console.error("[razorpay/verify] failed to fetch razorpay order:", err);
      return NextResponse.json({ error: "payment_verification_failed" }, { status: 502 });
    }

    // Underpayment guard — if Razorpay captured less than the server-side total (beyond tolerance),
    // do NOT create the order and do NOT sync to Shopify. This blocks tampered client amounts.
    if (paidAmount + AMOUNT_TOLERANCE < total) {
      console.warn(`[razorpay/verify] underpayment blocked: paid=${paidAmount} expected=${total} payment=${body.razorpayPaymentId}`);
      return NextResponse.json({
        error: "underpayment",
        paid:  paidAmount,
        expected: total,
      }, { status: 400 });
    }

    const delta             = Math.round((paidAmount - total) * 100) / 100;
    const amountDiscrepancy = Math.abs(delta) > AMOUNT_TOLERANCE ? delta : undefined;
    const orderId           = await nextOrderId();

    const order = await Order.create({
      orderId,
      items:             resolved.data.items,
      customer:          body.customer,
      subtotal:          resolved.data.subtotal,
      shippingCharge,
      total,
      paidAmount,
      amountDiscrepancy,
      paymentMethod:     "prepaid",
      status:            "confirmed",
      paymentStatus:     "paid",
      razorpayPaymentId: body.razorpayPaymentId,
      razorpayOrderId:   body.razorpayOrderId,
      notes:             body.notes,
    });

    if (amountDiscrepancy !== undefined) {
      console.warn(`[razorpay/verify] amount overpayment on ${orderId}: paid=${paidAmount} expected=${total} delta=${amountDiscrepancy}`);
    }

    // Push to Shopify → Delhivery (only reached when payment is at-or-above server total)
    try {
      const draft = await createShopifyDraftOrder({
        items:         resolved.data.items.map((i) => ({ name: i.name, price: i.price, qty: i.qty, size: i.size, color: i.color, variantId: i.variantId })),
        customer:      body.customer,
        orderId:       order.orderId,
        shippingCharge,
      });
      if (draft) {
        const shopifyOrderName = await completeDraftOrder(draft.id);
        await Order.updateOne(
          { _id: order._id },
          { $set: { shopifySyncStatus: "synced", shopifyOrderName: shopifyOrderName ?? draft.name } },
        );
      } else {
        await Order.updateOne(
          { _id: order._id },
          { $set: { shopifySyncStatus: "failed", shopifySyncError: "draft_order_creation_returned_null" } },
        );
      }
    } catch (err) {
      console.error("[razorpay/verify] shopify order failed:", err);
      await Order.updateOne(
        { _id: order._id },
        { $set: { shopifySyncStatus: "failed", shopifySyncError: err instanceof Error ? err.message : String(err) } },
      );
    }

    return NextResponse.json({ orderId: order.orderId });
  } catch (err) {
    console.error("[razorpay/verify]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
