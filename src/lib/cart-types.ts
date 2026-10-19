export interface CartLine {
  productId: string;
  sku: string;
  name: string;
  unit: string;
  unitPriceCents: number;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
}

export const MAX_LINE_QUANTITY = 999;

function isUsableQuantity(quantity: number): boolean {
  return Number.isFinite(quantity) && quantity > 0;
}

export function subtotalCents(lines: CartLine[]): number {
  return Math.round(
    lines.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0),
  );
}

export function itemCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function addLine(
  lines: CartLine[],
  incoming: Omit<CartLine, "quantity">,
  quantity: number,
): CartLine[] {
  if (!isUsableQuantity(quantity)) {
    return lines;
  }

  const existing = lines.find((line) => line.productId === incoming.productId);

  if (!existing) {
    return [
      ...lines,
      { ...incoming, quantity: Math.min(quantity, MAX_LINE_QUANTITY) },
    ];
  }

  return lines.map((line) =>
    line.productId === incoming.productId
      ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_LINE_QUANTITY) }
      : line,
  );
}

export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  const next = lines.filter((line) => line.productId !== productId);

  return next.length === lines.length ? lines : next;
}

export function updateQuantity(
  lines: CartLine[],
  productId: string,
  quantity: number,
): CartLine[] {
  if (!isUsableQuantity(quantity)) {
    return removeLine(lines, productId);
  }

  const capped = Math.min(quantity, MAX_LINE_QUANTITY);
  let matched = false;

  const next = lines.map((line) => {
    if (line.productId !== productId) {
      return line;
    }

    matched = true;
    return { ...line, quantity: capped };
  });

  return matched ? next : lines;
}

export function clearLines(): CartLine[] {
  return [];
}
