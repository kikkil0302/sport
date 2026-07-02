import { describe, expect, it } from "vitest";
import { localDayKey, parseDateInput } from "./dates";

describe("parseDateInput", () => {
  it("parses a date input value as local midnight", () => {
    const date = parseDateInput("2026-06-25");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(25);
    expect(date.getHours()).toBe(0);
  });

  it("returns an invalid date for malformed input", () => {
    expect(Number.isNaN(parseDateInput("not-a-date").getTime())).toBe(true);
    expect(Number.isNaN(parseDateInput("2026").getTime())).toBe(true);
    expect(Number.isNaN(parseDateInput("").getTime())).toBe(true);
  });
});

describe("localDayKey", () => {
  it("round-trips with parseDateInput", () => {
    expect(localDayKey(parseDateInput("2026-06-05"))).toBe("2026-06-05");
  });

  it("uses the local calendar day, not UTC", () => {
    // 23:30 local is still the same local day whatever the UTC offset.
    const lateEvening = new Date(2026, 5, 25, 23, 30);
    expect(localDayKey(lateEvening)).toBe("2026-06-25");
  });
});
