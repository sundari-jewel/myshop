export type ShippingTier = "standard" | "express";

export const FREE_SHIPPING_THRESHOLD = 5000;

export const SHIPPING_TIERS: Record<ShippingTier, {
  id:       ShippingTier;
  label:    string;
  price:    number;
  eta:      string;
  freeOverThreshold: boolean;
}> = {
  standard: {
    id:                "standard",
    label:             "Standard Delivery",
    price:             99,
    eta:               "3–7 days",
    freeOverThreshold: true,
  },
  express: {
    id:                "express",
    label:             "Express Delivery",
    price:             199,
    eta:               "3–5 days",
    freeOverThreshold: false,
  },
};

export function calculateShipping(args: {
  fulfillmentType: "delivery" | "pickup";
  tier:            ShippingTier;
  subtotal:        number;
}): number {
  if (args.fulfillmentType === "pickup") return 0;
  const cfg = SHIPPING_TIERS[args.tier];
  if (cfg.freeOverThreshold && args.subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return cfg.price;
}
