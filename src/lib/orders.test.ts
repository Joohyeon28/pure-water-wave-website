import { describe, expect, it } from "vitest";
import { parseCreatedOrder } from "@/lib/orders";
import type { CreatedOrder } from "@/lib/orders";

const valid = {
  id: "11111111-1111-1111-1111-111111111111",
  reference: "EW-2026-0001",
  subtotal_cents: 5700,
  delivery_cents: 1000,
  total_cents: 6700,
};

function withoutField(field: string): unknown {
  const clone: Record<string, unknown> = { ...valid };
  delete clone[field];
  return clone;
}

function withField(field: string, value: unknown): unknown {
  return { ...valid, [field]: value };
}

describe("parseCreatedOrder", () => {
  it("accepts a valid object and returns it unchanged", () => {
    const parsed = parseCreatedOrder(valid);

    expect(parsed).toEqual(valid);
    expect(parsed).toEqual<CreatedOrder>(valid);
  });

  it("accepts a JSON round-tripped payload", () => {
    const roundTripped: unknown = JSON.parse(JSON.stringify(valid));

    expect(parseCreatedOrder(roundTripped)).toEqual(valid);
  });

  it("accepts zero cent values", () => {
    const free = withField("delivery_cents", 0);

    expect(parseCreatedOrder(free)).toEqual({ ...valid, delivery_cents: 0 });
  });

  it("rejects a non-object payload", () => {
    expect(() => parseCreatedOrder(null)).toThrow(/non-object/);
    expect(() => parseCreatedOrder("orders")).toThrow(/non-object/);
    expect(() => parseCreatedOrder(42)).toThrow(/non-object/);
    expect(() => parseCreatedOrder([])).toThrow(/non-object/);
  });

  it("rejects a payload missing id", () => {
    expect(() => parseCreatedOrder(withoutField("id"))).toThrow(/id/);
  });

  it("rejects a payload missing reference", () => {
    expect(() => parseCreatedOrder(withoutField("reference"))).toThrow(/reference/);
  });

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a payload missing %s",
    (field) => {
      expect(() => parseCreatedOrder(withoutField(field))).toThrow(new RegExp(field));
    },
  );

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a non-integer %s",
    (field) => {
      expect(() => parseCreatedOrder(withField(field, 12.5))).toThrow(new RegExp(field));
    },
  );

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a negative %s",
    (field) => {
      expect(() => parseCreatedOrder(withField(field, -1))).toThrow(new RegExp(field));
    },
  );

  it.each(["subtotal_cents", "delivery_cents", "total_cents"])(
    "rejects a non-finite %s",
    (field) => {
      expect(() => parseCreatedOrder(withField(field, Number.NaN))).toThrow(new RegExp(field));
      expect(() => parseCreatedOrder(withField(field, Number.POSITIVE_INFINITY))).toThrow(
        new RegExp(field),
      );
    },
  );

  it("rejects a reference that is not a string", () => {
    expect(() => parseCreatedOrder(withField("reference", 123))).toThrow(/reference/);
    expect(() => parseCreatedOrder(withField("reference", null))).toThrow(/reference/);
  });

  it("rejects an empty reference", () => {
    expect(() => parseCreatedOrder(withField("reference", ""))).toThrow(/reference/);
  });

  it("rejects an id that is not a string", () => {
    expect(() => parseCreatedOrder(withField("id", 123))).toThrow(/id/);
    expect(() => parseCreatedOrder(withField("id", ""))).toThrow(/id/);
  });
});
