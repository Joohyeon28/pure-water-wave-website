import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY, loadCart, saveCart } from "@/lib/cart-storage";
import type { CartLine } from "@/lib/cart-types";

function makeLine(overrides: Partial<CartLine> & Pick<CartLine, "productId">): CartLine {
  return {
    sku: "SKU",
    name: "Product",
    unit: "1L",
    unitPriceCents: 100,
    quantity: 1,
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("loadCart", () => {
  it("returns [] when localStorage is empty", () => {
    expect(loadCart()).toEqual([]);
  });

  it("returns [] when the stored JSON is corrupt", () => {
    window.localStorage.setItem(STORAGE_KEY, "{ this is not json");

    expect(loadCart()).toEqual([]);
  });

  it("returns [] when the stored value is not an array", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: [] }));

    expect(loadCart()).toEqual([]);
  });

  it("drops individual malformed lines but keeps valid ones", () => {
    const valid = makeLine({ productId: "keep", quantity: 2 });

    const payload: unknown[] = [
      valid,
      null,
      "not a line",
      42,
      { productId: "missing-quantity", sku: "S", name: "N", unit: "1L", unitPriceCents: 100 },
      { productId: "blank-sku", sku: "", name: "N", unit: "1L", unitPriceCents: 100, quantity: 1 },
      { ...valid, productId: "negative-qty", quantity: -1 },
      { ...valid, productId: "non-finite-price", unitPriceCents: Number.NaN },
      { ...valid, productId: "string-price", unitPriceCents: "100" },
    ];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    expect(loadCart()).toEqual([valid]);
  });

  it("caps an oversized stored quantity", () => {
    const payload: unknown[] = [makeLine({ productId: "huge", quantity: 100000 })];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    expect(loadCart()[0].quantity).toBe(999);
  });
});

describe("saveCart", () => {
  it("round-trips through loadCart", () => {
    const lines = [
      makeLine({ productId: "a", quantity: 3 }),
      makeLine({ productId: "b", unitPriceCents: 1800, quantity: 1 }),
    ];

    saveCart(lines);

    expect(loadCart()).toEqual(lines);
  });

  it("writes under the versioned storage key", () => {
    const lines = [makeLine({ productId: "a" })];
    saveCart(lines);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(lines));
  });

  it("no-ops when window is undefined", () => {
    vi.stubGlobal("window", undefined);

    try {
      expect(() => saveCart([makeLine({ productId: "a" })])).not.toThrow();
      expect(loadCart()).toEqual([]);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
