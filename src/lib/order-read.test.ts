import { describe, expect, it } from "vitest";
import { parseOrderRead } from "@/lib/order-read";
import type { OrderRead } from "@/lib/order-read";

const valid = {
  reference: "EW-2026-00001",
  status: "pending_payment",
  customer_name: "Jane Doe",
  customer_email: "jane@example.com",
  customer_phone: "+27 82 000 0000",
  fulfilment: "pickup",
  delivery_address: null,
  notes: null,
  subtotal_cents: 5700,
  delivery_cents: 0,
  total_cents: 5700,
  created_at: "2026-09-14T09:00:00.000Z",
  items: [
    {
      sku: "purified_1l",
      name: "Purified 1L",
      quantity: 2,
      unit_price_cents: 700,
      line_total_cents: 1400,
    },
    {
      sku: "purified_refill",
      name: "Purified Water",
      quantity: 25,
      unit_price_cents: 100,
      line_total_cents: 2500,
    },
  ],
};

function withoutField(field: string): unknown {
  const clone: Record<string, unknown> = { ...valid };
  delete clone[field];
  return clone;
}

function withField(field: string, value: unknown): unknown {
  return { ...valid, [field]: value };
}

describe("parseOrderRead", () => {
  it("accepts a valid payload and returns it unchanged", () => {
    const parsed = parseOrderRead(valid);

    expect(parsed).toEqual(valid);
    expect(parsed).toEqual<OrderRead>(valid);
    expect(parsed.items).toHaveLength(2);
  });

  it("accepts a JSON round-tripped payload", () => {
    const roundTripped: unknown = JSON.parse(JSON.stringify(valid));

    expect(parseOrderRead(roundTripped)).toEqual(valid);
  });

  it("accepts a delivery order with an address and notes", () => {
    const delivered = withField("delivery_address", "22 Nutmeg Street");
    const parsed = parseOrderRead(withField("notes", "Leave at the gate"));

    expect(parsed.notes).toBe("Leave at the gate");
    expect(parseOrderRead(delivered).delivery_address).toBe("22 Nutmeg Street");
  });

  it("accepts an empty items array", () => {
    const parsed = parseOrderRead(withField("items", []));

    expect(parsed.items).toEqual([]);
  });

  it("rejects a non-object payload", () => {
    expect(() => parseOrderRead(null)).toThrow(/non-object/);
    expect(() => parseOrderRead("order")).toThrow(/non-object/);
    expect(() => parseOrderRead(42)).toThrow(/non-object/);
    expect(() => parseOrderRead([])).toThrow(/non-object/);
  });

  it.each([
    "reference",
    "status",
    "customer_name",
    "customer_email",
    "customer_phone",
    "fulfilment",
    "subtotal_cents",
    "delivery_cents",
    "total_cents",
    "created_at",
    "items",
  ])("rejects a payload missing %s", (field) => {
    expect(() => parseOrderRead(withoutField(field))).toThrow(new RegExp(field));
  });

  it("rejects an empty reference", () => {
    expect(() => parseOrderRead(withField("reference", ""))).toThrow(/reference/);
    expect(() => parseOrderRead(withField("reference", 123))).toThrow(/reference/);
  });

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a negative %s",
    (field) => {
      expect(() => parseOrderRead(withField(field, -1))).toThrow(new RegExp(field));
    },
  );

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a non-integer %s",
    (field) => {
      expect(() => parseOrderRead(withField(field, 12.5))).toThrow(new RegExp(field));
    },
  );

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a non-finite %s",
    (field) => {
      expect(() => parseOrderRead(withField(field, Number.NaN))).toThrow(new RegExp(field));
      expect(() => parseOrderRead(withField(field, Number.POSITIVE_INFINITY))).toThrow(
        new RegExp(field),
      );
    },
  );

  it("rejects items that are not an array", () => {
    expect(() => parseOrderRead(withField("items", null))).toThrow(/items/);
    expect(() => parseOrderRead(withField("items", "none"))).toThrow(/items/);
    expect(() => parseOrderRead(withField("items", {}))).toThrow(/items/);
  });

  it.each(["sku", "name", "quantity", "unit_price_cents", "line_total_cents"])(
    "rejects an item missing %s",
    (field) => {
      const item: Record<string, unknown> = { ...valid.items[0] };
      delete item[field];
      expect(() => parseOrderRead(withField("items", [item]))).toThrow(/item/);
    },
  );

  it("rejects an item with a negative or fractional cent value", () => {
    expect(() =>
      parseOrderRead(withField("items", [{ ...valid.items[0], unit_price_cents: -1 }])),
    ).toThrow(/item/);
    expect(() =>
      parseOrderRead(withField("items", [{ ...valid.items[0], line_total_cents: 1.5 }])),
    ).toThrow(/item/);
  });

  it("rejects an item with a non-positive quantity", () => {
    expect(() =>
      parseOrderRead(withField("items", [{ ...valid.items[0], quantity: 0 }])),
    ).toThrow(/item/);
    expect(() =>
      parseOrderRead(withField("items", [{ ...valid.items[0], quantity: -3 }])),
    ).toThrow(/item/);
  });
});
