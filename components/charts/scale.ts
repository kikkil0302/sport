/** Smallest "nice" number (1/2/2.5/5 × 10^n) at or above the value. */
export function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  for (const multiple of [1, 2, 2.5, 5, 10]) {
    if (value <= multiple * base) return multiple * base;
  }
  return 10 * base;
}

export const NUMBER_FR = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});
