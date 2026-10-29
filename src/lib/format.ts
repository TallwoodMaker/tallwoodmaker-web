/**
 * Euro price in the visitor's locale: "€33" / "€4.90" in English,
 * "33 €" / "4,90 €" in German, and so on. Whole euros drop the decimals.
 */
export function formatPrice(locale: string, amount: number): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Proof stat rounded *down* with a "+", same in every language:
 * 24317 → "24K+", 2_400_000 → "2M+". Never rounds up, so the number on
 * the site is never higher than the real one.
 */
export function formatProofCount(value: number): string {
  if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}M+`;
  if (value >= 1_000) return `${Math.floor(value / 1_000)}K+`;
  return `${value}+`;
}
