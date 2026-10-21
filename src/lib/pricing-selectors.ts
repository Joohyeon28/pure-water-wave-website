import type { ProductRow } from "@/hooks/useProducts";
import { toProductUnit } from "@/lib/validators/product";
import type { ProductUnit } from "@/lib/validators/product";

export type RefillKey = "purified" | "alkaline" | "fruit_juice";
export type BottleCategory = "bottle" | "juice";
export type BottleKey = "purified" | "alkaline";

export const FREE_DELIVERY_THRESHOLD_CENTS = 50_000;

export function freeDeliveryThresholdCents(): number {
  return FREE_DELIVERY_THRESHOLD_CENTS;
}

export function getRefillProduct(products: ProductRow[], key: RefillKey): ProductRow | undefined {
  const expectedSku = `${key}_refill`;

  return products.find(
    (product) => product.category === "refill" && product.sku.toLowerCase() === expectedSku,
  );
}

export function getBottleSku(key: BottleKey, unit: ProductUnit): string {
  return `${key}_${unit.toLowerCase()}`;
}

export function getBottlePrice(
  products: ProductRow[],
  category: BottleCategory,
  unit: ProductUnit,
  key?: BottleKey,
): ProductRow | undefined {
  return products.find((product) => {
    if (product.category !== category) return false;
    if (toProductUnit(product.unit) !== unit) return false;
    if (!key) return true;

    return product.sku.toLowerCase() === getBottleSku(key, unit);
  });
}

export function getCoolerProduct(products: ProductRow[]): ProductRow | undefined {
  return products.find((product) => product.category === "cooler");
}

export function litreRefillCostCents(product: ProductRow, litres: number): number {
  return Math.round(product.price_cents * litres);
}
