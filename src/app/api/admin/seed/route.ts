import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { ProductTryonConfig } from "@/models/ProductTryonConfig";
import { TryOnSession } from "@/models/TryOnSession";
import { TryOnJob } from "@/models/TryOnJob";
import { TryOnAnalytics } from "@/models/TryOnAnalytics";
import { products as catalogProducts } from "@/data/catalog";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function hoursAgo(n: number) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d;
}

// ─── Static seed data ─────────────────────────────────────────────────────────

const CUSTOMERS = [
  { name: "Priya Sharma",     email: "priya.sharma@gmail.com",     phone: "9876543210", address: { line1: "12 MG Road",          city: "Bengaluru",  state: "Karnataka",    pincode: "560001" } },
  { name: "Ananya Iyer",      email: "ananya.iyer@outlook.com",    phone: "9823456780", address: { line1: "45 Anna Salai",       city: "Chennai",    state: "Tamil Nadu",   pincode: "600002" } },
  { name: "Riya Patel",       email: "riya.patel@gmail.com",       phone: "9712345678", address: { line1: "8 Patel Nagar",       city: "Ahmedabad",  state: "Gujarat",      pincode: "380009" } },
  { name: "Kavya Reddy",      email: "kavya.reddy@yahoo.com",      phone: "9654321098", address: { line1: "22 Banjara Hills",    city: "Hyderabad",  state: "Telangana",    pincode: "500034" } },
  { name: "Meera Nair",       email: "meera.nair@gmail.com",       phone: "9543210987", address: { line1: "3 Marine Drive",      city: "Kochi",      state: "Kerala",       pincode: "682031" } },
  { name: "Sunita Gupta",     email: "sunita.gupta@hotmail.com",   phone: "9432109876", address: { line1: "17 Lajpat Nagar",     city: "New Delhi",  state: "Delhi",        pincode: "110024" } },
  { name: "Deepika Joshi",    email: "deepika.joshi@gmail.com",    phone: "9321098765", address: { line1: "55 Koregaon Park",    city: "Pune",       state: "Maharashtra",  pincode: "411001" } },
  { name: "Lakshmi Venkat",   email: "lakshmi.venkat@gmail.com",   phone: "9210987654", address: { line1: "9 T Nagar",           city: "Chennai",    state: "Tamil Nadu",   pincode: "600017" } },
  { name: "Pooja Mehta",      email: "pooja.mehta@rediffmail.com", phone: "9109876543", address: { line1: "33 Satellite Road",   city: "Ahmedabad",  state: "Gujarat",      pincode: "380015" } },
  { name: "Nandini Krishnan", email: "nandini.k@gmail.com",        phone: "9098765432", address: { line1: "7 Indiranagar",       city: "Bengaluru",  state: "Karnataka",    pincode: "560038" } },
  { name: "Rohini Desai",     email: "rohini.desai@gmail.com",     phone: "9887654321", address: { line1: "21 Juhu Tara Road",   city: "Mumbai",     state: "Maharashtra",  pincode: "400049" } },
  { name: "Amrita Singh",     email: "amrita.singh@gmail.com",     phone: "9776543210", address: { line1: "14 Civil Lines",      city: "Jaipur",     state: "Rajasthan",    pincode: "302006" } },
];

const ORDER_STATUSES: Array<"pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"> =
  ["pending", "confirmed", "processing", "shipped", "delivered", "delivered", "delivered", "cancelled", "shipped", "pending"];

const PAYMENT_METHODS: Array<"cod" | "prepaid"> = ["prepaid", "cod", "prepaid", "prepaid", "prepaid", "cod", "prepaid", "cod", "prepaid", "cod"];
const PAYMENT_STATUSES: Array<"pending" | "paid" | "failed" | "refunded"> =
  ["paid", "pending", "paid", "paid", "paid", "pending", "paid", "pending", "failed", "refunded"];

// ─── Seed functions ────────────────────────────────────────────────────────────

async function seedProducts() {
  const results: { slug: string; action: string }[] = [];
  const insertedIds: Record<string, string> = {}; // slug → _id

  for (const p of catalogProducts) {
    const existing = await Product.findOne({ slug: p.slug }).select("_id").lean() as { _id: unknown } | null;
    if (existing) {
      insertedIds[p.id] = String(existing._id);
      results.push({ slug: p.slug, action: "skipped" });
      continue;
    }
    const doc = await Product.create({
      name:          p.name,
      slug:          p.slug,
      collection:    p.collection,
      description:   p.description ?? "",
      price:         p.price,
      originalPrice: p.originalPrice,
      currency:      p.currency,
      images:        p.images?.length ? p.images : [p.image],
      material:      p.material,
      stone:         p.stone ?? "",
      weight:        p.weight,
      purity:        p.purity,
      badge:         p.badge,
      sizes:         p.sizes,
      featured:      true,
      published:     true,
      totalSold:     Math.floor(Math.random() * 40) + 2,
    });
    insertedIds[p.id] = String(doc._id);
    results.push({ slug: p.slug, action: "inserted" });
  }

  return { results, insertedIds };
}

async function seedOrders(insertedIds: Record<string, string>) {
  const slugToDbId = insertedIds; // static-id → mongo _id
  const catalogArr = catalogProducts;

  // Build 12 dummy orders
  const orders = CUSTOMERS.map((customer, i) => {
    // Pick 1–2 products for each order
    const pick = catalogArr.filter((_, j) => j % (i + 1) === 0 || j === i % catalogArr.length).slice(0, 2);
    const items = pick.map((p) => ({
      productId: slugToDbId[p.id] ?? p.id,
      slug:      p.slug,
      name:      p.name,
      image:     p.image,
      material:  p.material,
      price:     p.price,
      qty:       1,
      size:      p.sizes?.[0],
    }));
    const subtotal       = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shippingCharge = subtotal > 100000 ? 0 : 299;
    const total          = subtotal + shippingCharge;
    const daysBack       = i * 3 + 1;

    return {
      orderId:        uid("SJ-"),
      items,
      customer,
      subtotal,
      shippingCharge,
      total,
      status:         ORDER_STATUSES[i % ORDER_STATUSES.length],
      paymentMethod:  PAYMENT_METHODS[i % PAYMENT_METHODS.length],
      paymentStatus:  PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
      createdAt:      daysAgo(daysBack),
      updatedAt:      daysAgo(daysBack),
    };
  });

  const inserted: string[] = [];
  for (const o of orders) {
    await Order.create(o);
    inserted.push(o.orderId);
  }
  return inserted;
}

async function seedTryonConfigs() {
  const jewelleryTypes = [
    "necklace_choker",
    "necklace_choker",
    "earring_drop",
    "earring_stud",
    "earring_drop",
    "necklace_long",
  ] as const;

  const descriptors = [
    "antique 22K gold temple necklace with ruby drops and deity motifs",
    "18K gold pearl choker with graduated freshwater pearls",
    "18K gold diamond hoop earrings with lab-grown F/VS stones",
    "",
    "22K gold polki drop earrings with uncut diamond setting",
    "22K gold plain everyday bangle with hand-engraved border",
  ];

  const results: string[] = [];
  for (let i = 0; i < catalogProducts.length; i++) {
    const p = catalogProducts[i];
    await ProductTryonConfig.findOneAndUpdate(
      { skuId: p.id },
      {
        $set: {
          tryonEnabled:     i < 3, // first 3 enabled
          assetStatus:      i < 3 ? "ready" : "pending",
          jewelleryType:    jewelleryTypes[i],
          promptDescriptor: descriptors[i],
          totalTryons:      i < 3 ? Math.floor(Math.random() * 120) + 10 : 0,
        },
        $setOnInsert: { skuId: p.id },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    results.push(p.id);
  }
  return results;
}

async function seedTryonSessions() {
  const ips     = ["103.21.54.12", "49.36.221.8", "182.65.44.200", "117.96.142.33", "106.51.88.17"];
  const skus    = catalogProducts.slice(0, 3).map((p) => p.id);
  const sessions: { sessionId: string; skuId: string }[] = [];

  for (let i = 0; i < 8; i++) {
    const sid = uid("SES-");
    const expired = i < 2; // 2 already expired
    await TryOnSession.create({
      sessionId:  sid,
      ipAddress:  ips[i % ips.length],
      skuId:      skus[i % skus.length],
      photoKey:   `sundari/sessions/${sid}/photo.jpg`,
      expiresAt:  expired ? daysAgo(1) : new Date(Date.now() + 23 * 60 * 60 * 1000),
      regenCount: Math.floor(Math.random() * 3),
    });
    sessions.push({ sessionId: sid, skuId: skus[i % skus.length] });
  }
  return sessions;
}

async function seedTryonJobs(sessions: { sessionId: string; skuId: string }[]) {
  const jobStatuses: Array<"processing" | "complete" | "failed"> =
    ["complete", "complete", "complete", "failed", "processing", "complete", "complete", "failed"];

  const inserted: string[] = [];
  for (let i = 0; i < sessions.length; i++) {
    const { sessionId, skuId } = sessions[i];
    const status = jobStatuses[i % jobStatuses.length];
    const jid    = uid("JOB-");
    const elapsed = status === "complete" ? Math.floor(Math.random() * 8000) + 4000 : undefined;

    await TryOnJob.create({
      jobId:         jid,
      sessionId,
      skuId,
      status,
      replicateId:   `replicate-${uid()}`,
      errorCode:     status === "failed" ? "TIMEOUT" : undefined,
      resultKey:     status === "complete" ? `sundari/results/${jid}/result.jpg` : undefined,
      resultExpiresAt: status === "complete" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
      elapsedMs:     elapsed,
      completedAt:   status === "complete" ? hoursAgo(i + 1) : undefined,
      createdAt:     hoursAgo(i + 2),
    });
    inserted.push(jid);
  }
  return inserted;
}

async function seedTryonAnalytics(sessions: { sessionId: string; skuId: string }[]) {
  const events: Array<"tryon_started" | "result_viewed" | "add_to_cart" | "photo_saved" | "share_tapped" | "try_another"> =
    ["tryon_started", "result_viewed", "add_to_cart", "photo_saved", "share_tapped", "try_another", "tryon_started", "result_viewed"];

  let count = 0;
  for (const { sessionId, skuId } of sessions) {
    for (let e = 0; e < 3; e++) {
      await TryOnAnalytics.create({
        sessionId,
        skuId,
        event:    events[(count + e) % events.length],
        metadata: e === 2 ? { device: "mobile", os: "iOS" } : undefined,
        createdAt: hoursAgo(count + e + 1),
      });
    }
    count++;
  }
  return count * 3;
}

// ─── Route handlers ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const reset = searchParams.get("reset") === "true";

    if (reset) {
      await Promise.all([
        Order.deleteMany({}),
        ProductTryonConfig.deleteMany({}),
        TryOnSession.deleteMany({}),
        TryOnJob.deleteMany({}),
        TryOnAnalytics.deleteMany({}),
      ]);
    }

    const { results: productResults, insertedIds } = await seedProducts();

    const [orderIds, tryonSkus, sessions] = await Promise.all([
      seedOrders(insertedIds),
      seedTryonConfigs(),
      seedTryonSessions(),
    ]);

    const [jobIds, analyticsCount] = await Promise.all([
      seedTryonJobs(sessions),
      seedTryonAnalytics(sessions),
    ]);

    return NextResponse.json({
      ok: true,
      summary: {
        products:        productResults,
        orders:          orderIds.length,
        tryonConfigs:    tryonSkus.length,
        tryonSessions:   sessions.length,
        tryonJobs:       jobIds.length,
        analyticsEvents: analyticsCount,
      },
    });
  } catch (err) {
    console.error("[admin/seed POST]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Promise.all([
      Product.deleteMany({}),
      Order.deleteMany({}),
      ProductTryonConfig.deleteMany({}),
      TryOnSession.deleteMany({}),
      TryOnJob.deleteMany({}),
      TryOnAnalytics.deleteMany({}),
    ]);
    return NextResponse.json({ ok: true, message: "All seed data cleared." });
  } catch (err) {
    console.error("[admin/seed DELETE]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
