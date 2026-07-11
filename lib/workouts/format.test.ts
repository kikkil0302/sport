import { describe, expect, it } from "vitest";
import { formatSetSummary } from "./format";

describe("formatSetSummary", () => {
  it("formats weighted sets as reps×weight kg", () => {
    expect(
      formatSetSummary([
        { reps: 10, weightKg: 60 },
        { reps: 8, weightKg: 55 },
      ]),
    ).toBe("10×60 kg · 8×55 kg");
  });

  it("formats bodyweight sets (null charge) as reps only", () => {
    expect(formatSetSummary([{ reps: 12, weightKg: null }])).toBe("12 réps");
  });

  it("mixes weighted and bodyweight sets", () => {
    expect(
      formatSetSummary([
        { reps: 10, weightKg: 60 },
        { reps: 12, weightKg: null },
      ]),
    ).toBe("10×60 kg · 12 réps");
  });

  it("returns an empty string for no sets", () => {
    expect(formatSetSummary([])).toBe("");
  });
});
