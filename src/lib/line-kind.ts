export type LineKind = "refill" | "bottled" | "contract";

export const LINE_KIND_LABELS: Record<LineKind, string> = {
  refill: "Refill",
  bottled: "Bottled",
  contract: "Contract",
};

export function lineKindFromUnit(unit: string): LineKind {
  const normalized = unit.toLowerCase();

  if (normalized === "litre") return "refill";
  if (normalized === "contract") return "contract";

  return "bottled";
}

export function lineKindFromSku(sku: string): LineKind {
  const normalized = sku.toLowerCase();

  if (normalized.endsWith("_refill")) return "refill";
  if (normalized.startsWith("cooler")) return "contract";

  return "bottled";
}
