import type { Goal, MacroTargets } from "./types";

export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;

/** Calorie adjustment applied to TDEE per goal: -20% cut, maintenance, +10% lean bulk. */
const CALORIE_FACTOR: Record<Goal, number> = {
  lose: 0.8,
  maintain: 1,
  gain: 1.1,
};

/** Evidence-based protein intake (g per kg of body weight) per goal. */
const PROTEIN_G_PER_KG: Record<Goal, number> = {
  lose: 2.0,
  maintain: 1.6,
  gain: 1.8,
};

/** Share of daily calories allocated to fat before carbs fill the remainder. */
const FAT_CALORIE_SHARE = 0.25;

/** BMI above which excess weight is mostly fat mass, not protein-hungry tissue. */
const PROTEIN_REFERENCE_BMI = 25;

/** Fraction of the excess weight (above reference BMI) counted as lean tissue. */
const EXCESS_WEIGHT_LEAN_SHARE = 0.25;

/**
 * Protein needs scale with lean mass, not total weight. Above a BMI of 25 the
 * surplus is mostly fat, so only a quarter of it is counted — otherwise a
 * 120 kg person would be told to eat 240 g of protein a day.
 */
export function proteinReferenceWeightKg(
  weightKg: number,
  heightCm: number,
): number {
  const heightM = heightCm / 100;
  const weightAtReferenceBmi = PROTEIN_REFERENCE_BMI * heightM * heightM;
  if (weightKg <= weightAtReferenceBmi) return weightKg;
  return (
    weightAtReferenceBmi +
    EXCESS_WEIGHT_LEAN_SHARE * (weightKg - weightAtReferenceBmi)
  );
}

export function targetCalories(tdee: number, goal: Goal): number {
  return Math.round(tdee * CALORIE_FACTOR[goal]);
}

export function macroTargets(
  calories: number,
  weightKg: number,
  heightCm: number,
  goal: Goal,
): MacroTargets {
  const referenceWeightKg = proteinReferenceWeightKg(weightKg, heightCm);
  const proteinG = Math.round(referenceWeightKg * PROTEIN_G_PER_KG[goal]);
  const fatG = Math.round((calories * FAT_CALORIE_SHARE) / KCAL_PER_GRAM.fat);
  const remainingKcal =
    calories - proteinG * KCAL_PER_GRAM.protein - fatG * KCAL_PER_GRAM.fat;
  const carbsG = Math.max(0, Math.round(remainingKcal / KCAL_PER_GRAM.carbs));
  return { proteinG, fatG, carbsG };
}
