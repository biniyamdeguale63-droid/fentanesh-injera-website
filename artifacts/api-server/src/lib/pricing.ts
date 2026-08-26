import type { Pricing } from "@workspace/api-zod";

type PricingType = "white" | "red";

const CATALOG: Record<PricingType, { label: string; baseUnitPrice: number }> = {
  white: { label: "White teff", baseUnitPrice: 25 },
  red: { label: "Red teff", baseUnitPrice: 22 },
};

export function calculatePricing(qty: number, type: PricingType): Pricing {
  const item = CATALOG[type];
  const discountPercent = qty >= 500 ? 10 : qty >= 200 ? 5 : 0;
  const unitPrice = Number(
    (item.baseUnitPrice * (1 - discountPercent / 100)).toFixed(2),
  );
  const savings = Number(
    ((item.baseUnitPrice - unitPrice) * qty).toFixed(2),
  );

  return {
    type,
    label: item.label,
    qty,
    baseUnitPrice: item.baseUnitPrice,
    unitPrice,
    discountPercent,
    savings,
    total: Number((unitPrice * qty).toFixed(2)),
    currency: "ETB",
  };
}