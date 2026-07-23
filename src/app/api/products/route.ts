import { NextRequest, NextResponse } from "next/server";
import { getShopifyProductsByIds, fetchAllShopifyProducts } from "@/lib/shopify-collections";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids");

  if (ids) {
    const idList = ids.split(",").map((id) => id.trim()).filter(Boolean);
    const products = await getShopifyProductsByIds(idList);
    return NextResponse.json(products);
  }

  const products = await fetchAllShopifyProducts();
  return NextResponse.json(products);
}
