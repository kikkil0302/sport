/** String value of a FormData field ("" for missing or non-string entries). */
export function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Parses a decimal field accepting the French comma ("62,5").
 * Empty input → undefined (for optional fields); non-numeric input → NaN
 * (rejected downstream by the zod schema).
 */
export function parseDecimalInput(raw: string): number | undefined {
  const normalized = raw.replace(",", ".").trim();
  return normalized === "" ? undefined : Number(normalized);
}
