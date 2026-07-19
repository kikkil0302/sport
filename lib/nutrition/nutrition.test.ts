import { describe, expect, it } from "vitest";
import { bmiCategory, computeBmi } from "./bmi";
import {
  basalMetabolicRate,
  katchMcArdle,
  mifflinStJeor,
  totalDailyEnergyExpenditure,
} from "./energy";
import { macroTargets, targetCalories } from "./macros";
import { computeNutritionPlan } from "./plan";
import { planRequestSchema } from "./schema";
import type { BodyProfile } from "./types";

const maleProfile: BodyProfile = {
  sex: "male",
  age: 30,
  heightCm: 180,
  weightKg: 80,
};

describe("computeBmi", () => {
  it("computes BMI rounded to one decimal", () => {
    expect(computeBmi(80, 180)).toBe(24.7);
    expect(computeBmi(60, 165)).toBe(22);
  });
});

describe("bmiCategory", () => {
  it("maps WHO thresholds", () => {
    expect(bmiCategory(18.4)).toBe("underweight");
    expect(bmiCategory(18.5)).toBe("normal");
    expect(bmiCategory(24.9)).toBe("normal");
    expect(bmiCategory(25)).toBe("overweight");
    expect(bmiCategory(30)).toBe("obese1");
    expect(bmiCategory(35)).toBe("obese2");
    expect(bmiCategory(40)).toBe("obese3");
  });
});

describe("basal metabolic rate", () => {
  it("computes Mifflin-St Jeor for men", () => {
    expect(mifflinStJeor(maleProfile)).toBe(1780);
  });

  it("computes Mifflin-St Jeor for women", () => {
    expect(mifflinStJeor({ ...maleProfile, sex: "female" })).toBe(1614);
  });

  it("computes Katch-McArdle from lean mass", () => {
    expect(katchMcArdle(80, 15)).toBe(1839);
  });

  it("prefers Katch-McArdle when body fat is known", () => {
    expect(basalMetabolicRate({ ...maleProfile, bodyFatPercent: 15 })).toBe(1839);
    expect(basalMetabolicRate(maleProfile)).toBe(1780);
  });
});

describe("totalDailyEnergyExpenditure", () => {
  it("applies the activity factor", () => {
    expect(totalDailyEnergyExpenditure(1780, "sedentary")).toBe(2136);
    expect(totalDailyEnergyExpenditure(1780, "moderate")).toBe(2759);
    expect(totalDailyEnergyExpenditure(1780, "veryActive")).toBe(3382);
  });
});

describe("targetCalories", () => {
  it("adjusts TDEE per goal", () => {
    expect(targetCalories(2759, "lose")).toBe(2207);
    expect(targetCalories(2759, "maintain")).toBe(2759);
    expect(targetCalories(2759, "gain")).toBe(3035);
  });
});

describe("macroTargets", () => {
  it("allocates protein by body weight, fat by calorie share, carbs as remainder", () => {
    expect(macroTargets(2207, 80, 180, "lose")).toEqual({
      proteinG: 160,
      fatG: 61,
      carbsG: 255,
    });
  });

  it("caps protein for heavy people via the adjusted reference weight", () => {
    // 120 kg / 175 cm en sèche : 2 g/kg sur le poids total donnerait 240 g ;
    // le poids ajusté (IMC 25 + 25 % de l'excédent) ramène à ~175 g.
    const { proteinG } = macroTargets(2400, 120, 175, "lose");
    expect(proteinG).toBe(175);
  });

  it("leaves protein unchanged below the reference BMI", () => {
    expect(macroTargets(2759, 70, 175, "maintain").proteinG).toBe(112);
  });

  it("never returns negative carbs", () => {
    const { carbsG } = macroTargets(800, 100, 180, "lose");
    expect(carbsG).toBe(0);
  });
});

describe("computeNutritionPlan", () => {
  it("assembles a coherent plan", () => {
    const plan = computeNutritionPlan(maleProfile, "moderate", "lose");
    expect(plan).toEqual({
      bmi: 24.7,
      bmiCategory: "normal",
      bmr: 1780,
      tdee: 2759,
      targetCalories: 2207,
      macros: { proteinG: 160, fatG: 61, carbsG: 255 },
      goal: "lose",
      activityLevel: "moderate",
    });
  });
});

describe("planRequestSchema", () => {
  it("accepts a valid request", () => {
    const parsed = planRequestSchema.safeParse({
      sex: "female",
      age: 28,
      heightCm: 165,
      weightKg: 60,
      activityLevel: "light",
      goal: "maintain",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects out-of-range values", () => {
    const parsed = planRequestSchema.safeParse({
      sex: "male",
      age: 12,
      heightCm: 180,
      weightKg: 80,
      activityLevel: "moderate",
      goal: "lose",
    });
    expect(parsed.success).toBe(false);
  });
});
