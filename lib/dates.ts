const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses an <input type="date"> value ("YYYY-MM-DD") as LOCAL midnight.
 * `new Date("YYYY-MM-DD")` would parse as UTC midnight, which shifts the
 * calendar day for users west of UTC once displayed in local time.
 * Returns an Invalid Date for malformed input (rejected by z.date()).
 */
export function parseDateInput(value: string): Date {
  if (!DATE_INPUT_PATTERN.test(value)) return new Date(NaN);
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Local calendar day of a date, as a "YYYY-MM-DD" key. */
export function localDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Today's local date as an <input type="date"> default value. */
export function todayInputValue(): string {
  return localDayKey(new Date());
}

/** Current calendar year (helper keeps `new Date()` out of component render). */
export function currentYear(now: Date = new Date()): number {
  return now.getFullYear();
}
