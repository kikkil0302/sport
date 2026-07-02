import { bmiCategory, computeBmi } from "./bmi";
import { basalMetabolicRate, totalDailyEnergyExpenditure } from "./energy";
import { macroTargets, targetCalories } from "./macros";
import type { ActivityLevel, BodyProfile, Goal, NutritionPlan } from "./types";

export function computeNutritionPlan(
  profile: BodyProfile,
  activityLevel: ActivityLevel,
  goal: Goal,
): NutritionPlan {
  const bmi = computeBmi(profile.weightKg, profile.heightCm);
  const bmr = basalMetabolicRate(profile);
  const tdee = totalDailyEnergyExpenditure(bmr, activityLevel);
  const calories = targetCalories(tdee, goal);

  return {
    bmi,
    bmiCategory: bmiCategory(bmi),
    bmr,
    tdee,
    targetCalories: calories,
    macros: macroTargets(calories, profile.weightKg, goal),
    goal,
    activityLevel,
  };
}
