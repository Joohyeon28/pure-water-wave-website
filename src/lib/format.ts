export function formatCents(cents: number): string {
  const rands = cents / 100;
  const negative = rands < 0;
  const [whole, decimals] = Math.abs(rands).toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${negative ? "-" : ""}R${grouped}.${decimals}`;
}

export function parseCentsFromRands(input: string): number | null {
  const normalised = input.trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) {
    return null;
  }

  const value = Number(normalised);

  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 100);
}
