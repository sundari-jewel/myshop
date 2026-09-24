import type { IOrderItem } from "@/models/Order";
import { getShopifyProduct } from "@/lib/shopify-collections";

export type CartInput = {
  productId: string;
  slug:      string;
  qty:       number;
  size?:     string;
  color?:    string;
  variantId?: string;
};

export type ResolvedItems = {
  items:    IOrderItem[];
  subtotal: number;
};

// Server-side truth for prices and variant IDs. Never trust client-provided price.
// - Fetches every distinct slug from Shopify
// - Prefers the client-provided variantId if it matches a real variant of that product
// - Falls back to size-based variant lookup, then to the single default variant
// - Returns { error } if any slug can't be resolved so the caller can 400 cleanly
export async function resolveOrderItems(
  cartItems: CartInput[],
): Promise<{ ok: true; data: ResolvedItems } | { ok: false; error: string }> {
  const items: IOrderItem[] = [];

  for (const item of cartItems) {
    if (!item.slug || !item.qty || item.qty < 1) {
      return { ok: false, error: "invalid_item" };
    }

    const product = await getShopifyProduct(item.slug);
    if (!product) return { ok: false, error: `product_unavailable:${item.slug}` };

    const variantMatch = item.variantId
      ? product.variants?.find((v) => v.variantId === item.variantId)
      : product.variants?.find((v) => (v.size ?? undefined) === (item.size ?? undefined));
    const variantId = variantMatch?.variantId
      ?? (product.variants?.length === 1 ? product.variants[0].variantId : undefined);
    const unitPrice = variantMatch?.price ?? product.price;

    items.push({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      image:     product.images?.[0] ?? product.image,
      material:  product.material,
      price:     unitPrice,
      qty:       item.qty,
      size:      item.size,
      color:     item.color ?? variantMatch?.color,
      variantId,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return { ok: true, data: { items, subtotal } };
}
