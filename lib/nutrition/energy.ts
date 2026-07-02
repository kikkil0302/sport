import type { ActivityLevel, BodyProfile } from "./types";

/** Mifflin-St Jeor basal metabolic rate (kcal/day). */
export function mifflinStJeor(profile: BodyProfile): number {
  const { sex, age, heightCm, weightKg } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

/** Katch-McArdle BMR (kcal/day), based on lean body mass. */
export function katchMcArdle(weightKg: number, bodyFatPercent: number): number {
  const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
  return Math.round(370 + 21.6 * leanMassKg);
}

/** Picks Katch-McArdle when body fat is known, Mifflin-St Jeor otherwise. */
export function basalMetabolicRate(profile: BodyProfile): number {
  return profile.bodyFatPercent !== undefined
    ? katchMcArdle(profile.weightKg, profile.bodyFatPercent)
    : mifflinStJeor(profile);
}

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/** Total daily energy expenditure (kcal/day). */
export function totalDailyEnergyExpenditure(
  bmr: number,
  activityLevel: ActivityLevel,
): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activityLevel]);
}
