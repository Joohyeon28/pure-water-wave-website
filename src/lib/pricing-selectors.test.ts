import { describe, expect, it } from "vitest";
import {
  FREE_DELIVERY_THRESHOLD_CENTS,
  freeDeliveryThresholdCents,
  getBottlePrice,
  getBottleSku,
  getCoolerProduct,
  getRefillProduct,
  litreRefillCostCents,
} from "@/lib/pricing-selectors";
import type { BottleKey } from "@/lib/pricing-selectors";
import type { ProductUnit } from "@/lib/validators/product";
import type { ProductRow } from "@/hooks/useProducts";

function makeProduct(overrides: Partial<ProductRow>): ProductRow {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    sku: "SKU",
    name: "Product",
    category: "refill",
    unit: "litre",
    price_cents: 0,
    active: true,
    sort_order: 0,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const products: ProductRow[] = [
  makeProduct({
    id: "purified-refill",
    sku: "PURIFIED_REFILL",
    name: "Purified Water",
    category: "refill",
    unit: "litre",
    price_cents: 100,
  }),
  makeProduct({
    id: "alkaline-refill",
    sku: "ALKALINE_REFILL",
    name: "Alkaline Water",
    category: "refill",
    unit: "litre",
    price_cents: 150,
  }),
  makeProduct({
    id: "fruit-juice-refill",
    sku: "FRUIT_JUICE_REFILL",
    name: "Fruit Juice",
    category: "refill",
    unit: "litre",
    price_cents: 250,
  }),
  makeProduct({
    id: "purified-bottle-1l",
    sku: "purified_1l",
    name: "Purified Bottle 1L",
    category: "bottle",
    unit: "1L",
    price_cents: 700,
  }),
  makeProduct({
    id: "alkaline-bottle-1l",
    sku: "alkaline_1l",
    name: "Alkaline Bottle 1L",
    category: "bottle",
    unit: "1L",
    price_cents: 1000,
  }),
  makeProduct({
    id: "fruit-juice-bottle-1l",
    sku: "fruit_juice_1l",
    name: "Fruit Juice Bottle 1L",
    category: "juice",
    unit: "1L",
    price_cents: 1800,
  }),
  makeProduct({
    id: "cooler-12m",
    sku: "COOLER_12M",
    name: "Cooler Contract",
    category: "cooler",
    unit: "contract",
    price_cents: 300000,
  }),
];

describe("getRefillProduct", () => {
  it("returns the purified refill row", () => {
    expect(getRefillProduct(products, "purified")?.id).toBe("purified-refill");
  });

  it("returns the alkaline refill row", () => {
    expect(getRefillProduct(products, "alkaline")?.id).toBe("alkaline-refill");
  });

  it("returns the fruit juice refill row", () => {
    expect(getRefillProduct(products, "fruit_juice")?.id).toBe("fruit-juice-refill");
  });

  it("returns undefined when the row is missing", () => {
    expect(getRefillProduct([], "purified")).toBeUndefined();
    expect(getRefillProduct([products[0]], "alkaline")).toBeUndefined();
  });
});

describe("getBottlePrice", () => {
  it("returns the purified bottle row when a key is supplied", () => {
    expect(getBottlePrice(products, "bottle", "1L", "purified")?.id).toBe("purified-bottle-1l");
  });

  it("returns the alkaline bottle row when a key is supplied", () => {
    expect(getBottlePrice(products, "bottle", "1L", "alkaline")?.id).toBe("alkaline-bottle-1l");
  });

  it("returns the juice row without a key", () => {
    expect(getBottlePrice(products, "juice", "1L")?.id).toBe("fruit-juice-bottle-1l");
  });

  it("returns the first matching row when no key is supplied", () => {
    expect(getBottlePrice(products, "bottle", "1L")?.category).toBe("bottle");
  });

  it("returns undefined for missing combinations", () => {
    expect(getBottlePrice(products, "bottle", "10L", "purified")).toBeUndefined();
    expect(getBottlePrice([], "juice", "1L")).toBeUndefined();
  });

  it("matches on sku prefix even when the name is renamed", () => {
    const renamed = [
      makeProduct({
        id: "alkaline-bottle-1l-renamed",
        sku: "alkaline_1l",
        name: "Renamed Product",
        category: "bottle",
        unit: "1L",
        price_cents: 1000,
      }),
    ];

    expect(getBottlePrice(renamed, "bottle", "1L", "alkaline")?.id).toBe(
      "alkaline-bottle-1l-renamed",
    );
  });

  it("anchors prefix matching on the trailing underscore", () => {
    const lookalike = [
      makeProduct({
        id: "purifiedx-bottle-1l",
        sku: "purifiedx_1l",
        name: "Purified X 1L",
        category: "bottle",
        unit: "1L",
        price_cents: 700,
      }),
    ];

    expect(getBottlePrice(lookalike, "bottle", "1L", "purified")).toBeUndefined();
  });

  it("does not match a longer sku that shares the key prefix", () => {
    const sparkling = [
      makeProduct({
        id: "purified-sparkling-1l",
        sku: "purified_sparkling_1l",
        name: "Sparkling 1L",
        category: "bottle",
        unit: "1L",
        price_cents: 700,
      }),
    ];

    expect(getBottlePrice(sparkling, "bottle", "1L", "purified")).toBeUndefined();
  });

  it("matches the row whose sku is exactly the key and unit", () => {
    const exact = [
      makeProduct({
        id: "purified-bottle-1l-exact",
        sku: "purified_1l",
        name: "Renamed Again",
        category: "bottle",
        unit: "1L",
        price_cents: 750,
      }),
    ];

    expect(getBottlePrice(exact, "bottle", "1L", "purified")?.id).toBe("purified-bottle-1l-exact");
  });

  it("ignores a renamed row whose sku does not match the key", () => {
    const mismatched = [
      makeProduct({
        id: "juice-bottle-1l-mislabelled",
        sku: "fruit_juice_1l",
        name: "Purified Water Bottle",
        category: "bottle",
        unit: "1L",
        price_cents: 700,
      }),
    ];

    expect(getBottlePrice(mismatched, "bottle", "1L", "purified")).toBeUndefined();
  });
});

describe("getBottleSku", () => {
  const bottleKeys: BottleKey[] = ["purified", "alkaline"];
  const units: ProductUnit[] = ["litre", "500ml", "1L", "2L", "5L", "10L", "contract"];
  const combinations: [BottleKey, ProductUnit][] = bottleKeys.flatMap((key) =>
    units.map((unit) => [key, unit] as [BottleKey, ProductUnit]),
  );

  it("builds the documented example sku", () => {
    expect(getBottleSku("purified", "1L")).toBe("purified_1l");
  });

  it("lowercases the unit so the sku is case-insensitive", () => {
    expect(getBottleSku("alkaline", "500ml")).toBe("alkaline_500ml");
    expect(getBottleSku("purified", "10L")).toBe("purified_10l");
  });

  it.each(combinations)("builds %s + %s as a lowercase, underscore-joined sku", (key, unit) => {
    expect(getBottleSku(key, unit)).toBe(`${key}_${unit.toLowerCase()}`);
  });
});

describe("getCoolerProduct", () => {
  it("returns the cooler row", () => {
    expect(getCoolerProduct(products)?.id).toBe("cooler-12m");
  });

  it("returns undefined when there is no cooler row", () => {
    expect(getCoolerProduct([])).toBeUndefined();
    expect(getCoolerProduct([products[0]])).toBeUndefined();
  });
});

describe("litreRefillCostCents", () => {
  const purifiedRefill = products[0];
  const alkalineRefill = products[1];

  it("costs nothing for zero litres", () => {
    expect(litreRefillCostCents(purifiedRefill, 0)).toBe(0);
  });

  it("costs the unit rate for one litre", () => {
    expect(litreRefillCostCents(purifiedRefill, 1)).toBe(100);
  });

  it("multiplies for one hundred litres", () => {
    expect(litreRefillCostCents(purifiedRefill, 100)).toBe(10000);
  });

  it("rounds a non-integer litre count to the nearest cent", () => {
    expect(litreRefillCostCents(alkalineRefill, 2.5)).toBe(375);
    expect(litreRefillCostCents(purifiedRefill, 1.333)).toBe(133);
  });
});

describe("free delivery threshold", () => {
  it("is R500 in cents", () => {
    expect(FREE_DELIVERY_THRESHOLD_CENTS).toBe(50000);
    expect(freeDeliveryThresholdCents()).toBe(50000);
  });
});
