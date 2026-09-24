import { connectDB } from "@/lib/mongodb";
import { Counter } from "@/models/Counter";
import { Order } from "@/models/Order";

// One-time seed from the largest existing orderId so a fresh counter doesn't
// re-issue IDs that legacy orders already used. Idempotent; safe under concurrency.
async function seedCounterIfNeeded(): Promise<void> {
  const existing = await Counter.findById("orderId").lean();
  if (existing) return;

  const lastOrder = await Order.findOne({}, { orderId: 1 })
    .sort({ createdAt: -1 })
    .lean() as { orderId: string } | null;
  const initialSeq = lastOrder ? parseInt(lastOrder.orderId.split("-")[1] ?? "0", 10) : 0;

  try {
    await Counter.create({ _id: "orderId", seq: initialSeq });
  } catch (err) {
    // 11000 = duplicate key — another concurrent request already seeded it. Safe to ignore.
    if ((err as { code?: number }).code !== 11000) throw err;
  }
}

// Race-safe order ID generator. Uses an atomic $inc on a MongoDB counter document.
export async function nextOrderId(): Promise<string> {
  await connectDB();
  await seedCounterIfNeeded();

  const counter = await Counter.findOneAndUpdate(
    { _id: "orderId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return `SJ-${String(counter.seq).padStart(6, "0")}`;
}
