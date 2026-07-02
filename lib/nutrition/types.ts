export type Sex = "male" | "female";

export const ACTIVITY_LEVELS = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "veryActive",
] as const;
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export const GOALS = ["lose", "maintain", "gain"] as const;
export type Goal = (typeof GOALS)[number];

export interface BodyProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  /** Optional; when provided, BMR uses Katch-McArdle instead of Mifflin-St Jeor. */
  bodyFatPercent?: number;
}

export interface MacroTargets {
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese1"
  | "obese2"
  | "obese3";

export interface NutritionPlan {
  bmi: number;
  bmiCategory: BmiCategory;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroTargets;
  goal: Goal;
  activityLevel: ActivityLevel;
}
