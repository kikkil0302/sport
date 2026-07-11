import { describe, expect, it } from "vitest";
import { dateInputSchema, workoutSchema, workoutSetSchema } from "./schema";

describe("dateInputSchema", () => {
  it('parses a "YYYY-MM-DD" string as local midnight (no UTC day shift)', () => {
    const date = dateInputSchema.parse("2026-03-15") as Date;
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2); // March (0-indexed)
    expect(date.getDate()).toBe(15);
  });

  it("passes a Date through unchanged", () => {
    const now = new Date();
    expect(dateInputSchema.parse(now)).toEqual(now);
  });
});

describe("workoutSetSchema", () => {
  it("accepts a valid weighted set", () => {
    expect(
      workoutSetSchema.parse({ exerciseId: "ex1", reps: 10, weightKg: 60 }),
    ).toEqual({ exerciseId: "ex1", reps: 10, weightKg: 60 });
  });

  it("accepts a bodyweight set (weight omitted)", () => {
    const parsed = workoutSetSchema.parse({ exerciseId: "ex1", reps: 12 });
    expect(parsed.weightKg).toBeUndefined();
  });

  it("rejects a missing exercise", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "", reps: 10 }).success,
    ).toBe(false);
  });

  it("rejects non-integer reps", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "ex1", reps: 10.5 }).success,
    ).toBe(false);
  });

  it("rejects zero reps", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "ex1", reps: 0 }).success,
    ).toBe(false);
  });

  it("rejects negative charge", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "ex1", reps: 5, weightKg: -1 })
        .success,
    ).toBe(false);
  });

  it("rejects an absurd charge above the 600 kg cap", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "ex1", reps: 5, weightKg: 601 })
        .success,
    ).toBe(false);
  });
});

describe("workoutSchema", () => {
  it("accepts a date with trimmed notes", () => {
    const parsed = workoutSchema.parse({
      performedAt: "2026-03-15",
      notes: "  Bonne séance  ",
    });
    expect(parsed.notes).toBe("Bonne séance");
  });

  it("rejects notes longer than 500 characters", () => {
    expect(
      workoutSchema.safeParse({
        performedAt: "2026-03-15",
        notes: "x".repeat(501),
      }).success,
    ).toBe(false);
  });
});
