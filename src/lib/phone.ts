export function normaliseSaPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "").replace(/^00/, "");

  if (digits.length === 0) {
    return null;
  }

  const withoutCountry = digits.startsWith("27") ? digits.slice(2) : digits;
  const national = withoutCountry.startsWith("0")
    ? withoutCountry.slice(1)
    : withoutCountry;

  return /^[1-8]\d{8}$/.test(national) ? national : null;
}
