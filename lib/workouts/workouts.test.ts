import { describe, expect, it } from "vitest";
import { workoutSetSchema, workoutSchema } from "./schema";

describe("workoutSchema", () => {
  it("coerces a date string", () => {
    const parsed = workoutSchema.safeParse({ performedAt: "2026-07-02" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.performedAt.getFullYear()).toBe(2026);
    }
  });

  it("rejects an invalid date", () => {
    expect(workoutSchema.safeParse({ performedAt: "not-a-date" }).success).toBe(
      false,
    );
  });
});

describe("workoutSetSchema", () => {
  it("accepts a valid set", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "abc", reps: 10, weightKg: 60 })
        .success,
    ).toBe(true);
  });

  it("accepts a bodyweight set without weight", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "abc", reps: 15 }).success,
    ).toBe(true);
  });

  it("rejects out-of-range reps", () => {
    expect(
      workoutSetSchema.safeParse({ exerciseId: "abc", reps: 0 }).success,
    ).toBe(false);
  });
});
