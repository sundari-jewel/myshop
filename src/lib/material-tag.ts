// Derives an honest material label from a product's real Shopify description.
// Sundari sells imitation/fashion jewellery only (brass base, no gold or silver),
// so this must never default to "Gold" — that was the bug this file replaces.
//
// Priority, based on how the live catalog actually writes descriptions:
//   1. Explicit "Moissanite" callout      -> "Moissanite"
//   2. "Heritage" / "Jadau" styling        -> "Pure Brass Heritage Jewellery"
//   3. Everything else (plain brass pieces) -> "Pure Brass"
export function deriveMaterialTag(description?: string | null): string {
  const text = (description ?? "").toLowerCase();

  if (text.includes("moissanite")) return "Moissanite";
  if (text.includes("heritage") || text.includes("jadau")) return "Pure Brass Heritage Jewellery";

  return "Pure Brass";
}
