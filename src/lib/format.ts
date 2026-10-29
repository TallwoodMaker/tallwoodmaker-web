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

/** Compact stat number, e.g. 32000 → "32K" (en) / "32 Tsd." (de). */
export function formatCompact(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
