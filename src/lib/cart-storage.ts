import { MAX_LINE_QUANTITY } from "@/lib/cart-types";
import type { CartLine } from "@/lib/cart-types";

export const STORAGE_KEY = "ew.cart.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseLine(value: unknown): CartLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const { productId, sku, name, unit, unitPriceCents, quantity } = value;

  if (!isNonEmptyString(productId)) return null;
  if (!isNonEmptyString(sku)) return null;
  if (!isNonEmptyString(name)) return null;
  if (!isNonEmptyString(unit)) return null;
  if (!isFiniteNumber(unitPriceCents) || unitPriceCents < 0) return null;
  if (!isFiniteNumber(quantity) || quantity <= 0) return null;

  return {
    productId,
    sku,
    name,
    unit,
    unitPriceCents,
    quantity: Math.min(quantity, MAX_LINE_QUANTITY),
  };
}

export function loadCart(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const lines: CartLine[] = [];

    for (const entry of parsed) {
      const line = parseLine(entry);

      if (line) {
        lines.push(line);
      }
    }

    return lines;
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    return;
  }
}
