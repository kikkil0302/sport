import { describe, expect, it } from "vitest";
import { formValue, parseDecimalInput } from "./forms";

describe("parseDecimalInput", () => {
  it("accepts a French decimal comma", () => {
    expect(parseDecimalInput("62,5")).toBe(62.5);
  });

  it("accepts a plain point decimal", () => {
    expect(parseDecimalInput("62.5")).toBe(62.5);
  });

  it("trims surrounding whitespace", () => {
    expect(parseDecimalInput("  70  ")).toBe(70);
  });

  it("returns undefined for empty or whitespace-only input", () => {
    expect(parseDecimalInput("")).toBeUndefined();
    expect(parseDecimalInput("   ")).toBeUndefined();
  });

  it("returns NaN for non-numeric input (rejected downstream by zod)", () => {
    expect(parseDecimalInput("abc")).toBeNaN();
  });

  it("only replaces the first comma (guards against thousands separators)", () => {
    // "1,000,5" is not a valid French number; result must not silently become 10005.
    expect(Number.isNaN(parseDecimalInput("1,000,5") as number)).toBe(true);
  });
});

describe("formValue", () => {
  it("returns the string value of a field", () => {
    const fd = new FormData();
    fd.set("email", "a@b.co");
    expect(formValue(fd, "email")).toBe("a@b.co");
  });

  it("returns an empty string for a missing field", () => {
    expect(formValue(new FormData(), "missing")).toBe("");
  });
});
