import { describe, expect, it } from "vitest";
import { epley1Rm } from "./one-rep-max";
import { exerciseProgression } from "./progression";
import { weekStart, weeklyVolume } from "./weekly";

describe("epley1Rm", () => {
  it("returns the weight itself for a single rep", () => {
    expect(epley1Rm(100, 1)).toBe(100);
  });

  it("estimates 1RM with the Epley formula", () => {
    expect(epley1Rm(100, 10)).toBe(133.3);
    expect(epley1Rm(60, 5)).toBe(70);
  });
});

describe("weekStart", () => {
  it("returns the Monday of the week", () => {
    // 2026-07-02 is a Thursday; its week starts Monday 2026-06-29.
    const monday = weekStart(new Date(2026, 6, 2, 15, 30));
    expect(monday.getFullYear()).toBe(2026);
    expect(monday.getMonth()).toBe(5);
    expect(monday.getDate()).toBe(29);
    expect(monday.getDay()).toBe(1);
  });

  it("is idempotent on a Monday", () => {
    const monday = new Date(2026, 5, 29);
    expect(weekStart(monday).getDate()).toBe(29);
  });
});

describe("weeklyVolume", () => {
  const now = new Date(2026, 6, 2); // Thursday

  it("zero-fills weeks and buckets sets into the right week", () => {
    const points = weeklyVolume(
      [
        { performedAt: new Date(2026, 6, 1), reps: 10, weightKg: 60 }, // current week
        { performedAt: new Date(2026, 5, 24), reps: 5, weightKg: 100 }, // previous week
        { performedAt: new Date(2026, 6, 1), reps: 15, weightKg: null }, // bodyweight → 0
      ],
      4,
      now,
    );
    expect(points).toHaveLength(4);
    expect(points.map((p) => p.volumeKg)).toEqual([0, 0, 500, 600]);
  });

  it("ignores sets older than the window", () => {
    const points = weeklyVolume(
      [{ performedAt: new Date(2026, 0, 1), reps: 10, weightKg: 100 }],
      4,
      now,
    );
    expect(points.every((p) => p.volumeKg === 0)).toBe(true);
  });
});

describe("exerciseProgression", () => {
  it("keeps the most-trained exercises and the best set per day", () => {
    const day1 = new Date("2026-06-01T10:00:00Z");
    const day2 = new Date("2026-06-08T10:00:00Z");
    const result = exerciseProgression(
      [
        { performedAt: day1, exerciseName: "Squat", reps: 5, weightKg: 100 },
        { performedAt: day1, exerciseName: "Squat", reps: 3, weightKg: 110 },
        { performedAt: day2, exerciseName: "Squat", reps: 5, weightKg: 105 },
        { performedAt: day1, exerciseName: "Curl", reps: 10, weightKg: 20 },
        { performedAt: day1, exerciseName: "Pompes", reps: 20, weightKg: null },
      ],
      1,
    );
    expect(result.series).toHaveLength(1);
    expect(result.series[0].exerciseName).toBe("Squat");
    // day1 best: max(epley(100,5)=116.7, epley(110,3)=121) = 121
    expect(result.series[0].points).toEqual([121, 122.5]);
    expect(result.days).toHaveLength(2);
  });

  it("marks days where an exercise was not trained as null", () => {
    const result = exerciseProgression(
      [
        {
          performedAt: new Date("2026-06-01T10:00:00Z"),
          exerciseName: "Squat",
          reps: 5,
          weightKg: 100,
        },
        {
          performedAt: new Date("2026-06-08T10:00:00Z"),
          exerciseName: "Curl",
          reps: 10,
          weightKg: 20,
        },
      ],
      2,
    );
    const squat = result.series.find((s) => s.exerciseName === "Squat");
    expect(squat?.points).toEqual([116.7, null]);
  });
});
