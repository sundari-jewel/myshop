import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const [orderAgg, pendingCount, totalProducts] = await Promise.all([
      // Total orders + total revenue in one pass
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),
      // Real pending count
      Order.countDocuments({ status: "pending" }),
      // Total products
      Product.countDocuments({}),
    ]);

    const agg = orderAgg[0] as { totalOrders: number; totalRevenue: number } | undefined;

    return NextResponse.json({
      totalOrders:   agg?.totalOrders   ?? 0,
      totalRevenue:  agg?.totalRevenue  ?? 0,
      pendingOrders: pendingCount,
      totalProducts,
    });
  } catch (err) {
    console.error("[admin/stats GET]", err);
    return NextResponse.json(
      { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, totalProducts: 0 },
      { status: 500 }
    );
  }
}
