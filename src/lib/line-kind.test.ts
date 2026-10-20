import { describe, expect, it } from "vitest";
import { LINE_KIND_LABELS, lineKindFromSku, lineKindFromUnit } from "@/lib/line-kind";

describe("lineKindFromUnit", () => {
  it("treats litre as a refill", () => {
    expect(lineKindFromUnit("litre")).toBe("refill");
    expect(lineKindFromUnit("Litre")).toBe("refill");
  });

  it("treats size units as bottled", () => {
    expect(lineKindFromUnit("500ml")).toBe("bottled");
    expect(lineKindFromUnit("1.5L")).toBe("bottled");
    expect(lineKindFromUnit("330ml")).toBe("bottled");
    expect(lineKindFromUnit("5L")).toBe("bottled");
  });

  it("treats contract as a contract", () => {
    expect(lineKindFromUnit("contract")).toBe("contract");
  });
});

describe("lineKindFromSku", () => {
  it("treats _refill skus as refills", () => {
    expect(lineKindFromSku("purified_refill")).toBe("refill");
    expect(lineKindFromSku("alkaline_refill")).toBe("refill");
    expect(lineKindFromSku("fruit_juice_refill")).toBe("refill");
    expect(lineKindFromSku("PURIFIED_REFILL")).toBe("refill");
  });

  it("treats bottle skus as bottled", () => {
    expect(lineKindFromSku("purified_500ml")).toBe("bottled");
    expect(lineKindFromSku("alkaline_1.5l")).toBe("bottled");
    expect(lineKindFromSku("fruit_juice_330ml")).toBe("bottled");
    expect(lineKindFromSku("fruit_juice_5l")).toBe("bottled");
  });

  it("treats cooler skus as contracts", () => {
    expect(lineKindFromSku("cooler_12mo")).toBe("contract");
  });
});

describe("LINE_KIND_LABELS", () => {
  it("has a human label for each kind", () => {
    expect(LINE_KIND_LABELS.refill).toBe("Refill");
    expect(LINE_KIND_LABELS.bottled).toBe("Bottled");
    expect(LINE_KIND_LABELS.contract).toBe("Contract");
  });
});
