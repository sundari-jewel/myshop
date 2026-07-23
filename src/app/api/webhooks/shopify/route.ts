import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

const CLIENT_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

function verifyShopifyHmac(body: string, hmacHeader: string | null): boolean {
  if (!hmacHeader || !CLIENT_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(body, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmacHeader));
}

type ShopifyFulfillment = {
  tracking_number: string | null;
  tracking_url: string | null;
  tracking_numbers: string[];
  tracking_urls: string[];
  status: string;
};

type ShopifyOrderPayload = {
  name: string;          // e.g. "#1001"
  note: string | null;
  fulfillment_status: string | null;
  fulfillments: ShopifyFulfillment[];
};

// Handles orders/fulfilled and orders/updated webhooks from Shopify.
// Delhivery marks the Shopify order as fulfilled → Shopify fires this webhook
// → we update our MongoDB order with tracking info and status.
export async function POST(req: NextRequest) {
  const topic = req.headers.get("x-shopify-topic");
  const body  = await req.text();
  const hmac  = req.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyHmac(body, hmac)) {
    console.warn("[shopify-webhook] invalid HMAC — rejected");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (topic !== "orders/fulfilled" && topic !== "orders/updated") {
    return NextResponse.json({ ok: true });
  }

  let payload: ShopifyOrderPayload;
  try {
    payload = JSON.parse(body) as ShopifyOrderPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Our internal order ID is embedded in the Shopify order note
  const noteMatch = payload.note?.match(/Internal Order ID:\s*(SJ-\d+)/);
  const internalOrderId = noteMatch?.[1];

  if (!internalOrderId) {
    // Not one of our website orders — ignore
    return NextResponse.json({ ok: true });
  }

  const fulfillment = payload.fulfillments?.at(-1);
  const trackingNumber = fulfillment?.tracking_number
    ?? fulfillment?.tracking_numbers?.[0]
    ?? undefined;
  const trackingUrl = fulfillment?.tracking_url
    ?? fulfillment?.tracking_urls?.[0]
    ?? undefined;

  const isFulfilled = payload.fulfillment_status === "fulfilled"
    || fulfillment?.status === "success";

  await connectDB();

  await Order.updateOne(
    { orderId: internalOrderId },
    {
      $set: {
        ...(isFulfilled && { status: "shipped" }),
        ...(trackingNumber && { trackingNumber }),
        ...(trackingUrl   && { trackingUrl }),
      },
    },
  );

  console.log(`[shopify-webhook] updated order ${internalOrderId} — fulfilled=${isFulfilled} tracking=${trackingNumber ?? "none"}`);
  return NextResponse.json({ ok: true });
}
