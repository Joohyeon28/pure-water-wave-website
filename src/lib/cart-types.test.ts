import { describe, expect, it } from "vitest";
import {
  MAX_LINE_QUANTITY,
  addLine,
  clearLines,
  itemCount,
  removeLine,
  subtotalCents,
  updateQuantity,
} from "@/lib/cart-types";
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

function incoming(productId: string) {
  return {
    productId,
    sku: `SKU-${productId}`,
    name: `Product ${productId}`,
    unit: "1L",
    unitPriceCents: 100,
  };
}

describe("addLine", () => {
  it("appends a line for a new productId", () => {
    const start: CartLine[] = [];
    const next = addLine(start, incoming("a"), 2);

    expect(next).toHaveLength(1);
    expect(next[0].productId).toBe("a");
    expect(next[0].quantity).toBe(2);
    expect(start).toHaveLength(0);
  });

  it("increments an existing line for a duplicate productId", () => {
    const start = [makeLine({ productId: "a", quantity: 2 })];
    const next = addLine(start, incoming("a"), 3);

    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(5);
  });

  it("caps the total quantity at MAX_LINE_QUANTITY", () => {
    const start = [makeLine({ productId: "a", quantity: MAX_LINE_QUANTITY - 1 })];
    const next = addLine(start, incoming("a"), 10);

    expect(next[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("caps a new line at MAX_LINE_QUANTITY", () => {
    const next = addLine([], incoming("a"), MAX_LINE_QUANTITY + 500);

    expect(next[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("ignores a non-positive quantity", () => {
    const start = [makeLine({ productId: "a" })];

    expect(addLine(start, incoming("b"), 0)).toBe(start);
    expect(addLine(start, incoming("b"), -3)).toBe(start);
  });
});

describe("removeLine", () => {
  it("removes the matching line", () => {
    const start = [makeLine({ productId: "a" }), makeLine({ productId: "b" })];
    const next = removeLine(start, "a");

    expect(next).toHaveLength(1);
    expect(next[0].productId).toBe("b");
  });

  it("is a no-op for a nonexistent productId", () => {
    const start = [makeLine({ productId: "a" })];

    expect(removeLine(start, "zzz")).toBe(start);
  });
});

describe("updateQuantity", () => {
  it("updates to a valid quantity", () => {
    const start = [makeLine({ productId: "a", quantity: 1 })];
    const next = updateQuantity(start, "a", 4);

    expect(next[0].quantity).toBe(4);
  });

  it("removes the line when quantity is 0", () => {
    const start = [makeLine({ productId: "a", quantity: 4 })];

    expect(updateQuantity(start, "a", 0)).toEqual([]);
  });

  it("removes the line when quantity is negative", () => {
    const start = [makeLine({ productId: "a", quantity: 4 })];

    expect(updateQuantity(start, "a", -2)).toEqual([]);
  });

  it("caps a quantity above MAX_LINE_QUANTITY", () => {
    const start = [makeLine({ productId: "a", quantity: 1 })];
    const next = updateQuantity(start, "a", MAX_LINE_QUANTITY + 1);

    expect(next[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("is a no-op for a nonexistent productId", () => {
    const start = [makeLine({ productId: "a" })];

    expect(updateQuantity(start, "zzz", 5)).toBe(start);
  });
});

describe("subtotalCents", () => {
  it("sums multiple lines with multiple quantities", () => {
    const lines = [
      makeLine({ productId: "a", unitPriceCents: 700, quantity: 3 }),
      makeLine({ productId: "b", unitPriceCents: 1800, quantity: 2 }),
    ];

    expect(subtotalCents(lines)).toBe(700 * 3 + 1800 * 2);
  });

  it("returns 0 for an empty cart", () => {
    expect(subtotalCents([])).toBe(0);
  });
});

describe("itemCount", () => {
  it("sums quantities rather than counting lines", () => {
    const lines = [
      makeLine({ productId: "a", quantity: 3 }),
      makeLine({ productId: "b", quantity: 2 }),
    ];

    expect(itemCount(lines)).toBe(5);
  });

  it("returns 0 for an empty cart", () => {
    expect(itemCount([])).toBe(0);
  });
});

describe("clearLines", () => {
  it("returns an empty array", () => {
    expect(clearLines()).toEqual([]);
  });
});
