import { describe, expect, it } from "vitest";
import { weightGoalProgress } from "./weight-goal";

describe("weightGoalProgress", () => {
  it("tracks a cut (losing weight) partway to target", () => {
    const p = weightGoalProgress(90, 82, 75);
    expect(p.direction).toBe("lose");
    expect(p.reached).toBe(false);
    expect(p.remainingKg).toBe(7);
    expect(p.fraction).toBeCloseTo(8 / 15, 3);
  });

  it("tracks a bulk (gaining weight) partway to target", () => {
    const p = weightGoalProgress(70, 74, 80);
    expect(p.direction).toBe("gain");
    expect(p.remainingKg).toBe(6);
    expect(p.fraction).toBeCloseTo(0.4, 3);
  });

  it("marks a cut as reached once at or below target", () => {
    const p = weightGoalProgress(90, 75, 75);
    expect(p.reached).toBe(true);
    expect(p.fraction).toBe(1);
    expect(p.remainingKg).toBe(0);
  });

  it("marks a bulk as reached once at or above target", () => {
    const p = weightGoalProgress(70, 81, 80);
    expect(p.reached).toBe(true);
    expect(p.fraction).toBe(1);
  });

  it("clamps overshoot to 100% (does not exceed)", () => {
    // Cut target 75 but already at 70 (below): reached, fraction capped at 1.
    const p = weightGoalProgress(90, 70, 75);
    expect(p.fraction).toBe(1);
  });

  it("never goes negative when moving the wrong way", () => {
    // Cut target 75, but weight went up from 90 to 95.
    const p = weightGoalProgress(90, 95, 75);
    expect(p.fraction).toBe(0);
    expect(p.reached).toBe(false);
  });

  it("handles a maintain goal (start already at target)", () => {
    expect(weightGoalProgress(75, 75, 75).reached).toBe(true);
    expect(weightGoalProgress(75, 78, 75).reached).toBe(false);
  });
});
