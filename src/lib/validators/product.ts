import { z } from "zod";
import { parseCentsFromRands } from "@/lib/format";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

export const productCategories = ["refill", "bottle", "juice", "cooler"] as const;
export const productUnits = ["litre", "500ml", "1L", "1.5L", "2L", "5L", "10L", "330ml", "contract"] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductUnit = (typeof productUnits)[number];

export const categoryLabels: Record<ProductCategory, string> = {
  refill: "Refill",
  bottle: "Bottle",
  juice: "Juice",
  cooler: "Cooler",
};

export const unitLabels: Record<ProductUnit, string> = {
  litre: "Litre",
  "500ml": "500ml",
  "1L": "1L",
  "1.5L": "1.5Lt",
  "2L": "2L",
  "5L": "5Lt",
  "10L": "10L",
  "330ml": "330ml",
  contract: "Contract",
};

export function toProductCategory(value: string): ProductCategory {
  return productCategories.find((category) => category === value) ?? "refill";
}

export function toProductUnit(value: string): ProductUnit {
  return productUnits.find((unit) => unit === value) ?? "litre";
}

export const productFormSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  name: z.string().trim().min(1, "Name is required"),
  category: z.enum(productCategories),
  unit: z.enum(productUnits),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a rand amount like 12.50"),
  sort_order: z.string().trim().regex(/^\d*$/, "Sort order must be a whole number"),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

function priceToCents(price: string): number {
  const cents = parseCentsFromRands(price);

  if (cents === null) {
    throw new Error("Price must be a valid rand amount.");
  }

  return cents;
}

function sortOrderToNumber(sortOrder: string): number {
  return sortOrder === "" ? 0 : Number(sortOrder);
}

export function toDbInsert(values: ProductFormValues): TablesInsert<"products"> {
  return {
    sku: values.sku.trim().toUpperCase(),
    name: values.name.trim(),
    category: values.category,
    unit: values.unit,
    price_cents: priceToCents(values.price),
    sort_order: sortOrderToNumber(values.sort_order),
    active: values.active,
  };
}

export function toDbUpdate(values: ProductFormValues): TablesUpdate<"products"> {
  return {
    name: values.name.trim(),
    category: values.category,
    unit: values.unit,
    price_cents: priceToCents(values.price),
    sort_order: sortOrderToNumber(values.sort_order),
    active: values.active,
  };
}
