import type { ActivityLevel, BmiCategory, Goal, Sex } from "./types";

export const SEX_LABELS: Record<Sex, string> = {
  male: "Homme",
  female: "Femme",
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sédentaire (peu ou pas d'exercice)",
  light: "Légèrement actif (1 à 3 séances/semaine)",
  moderate: "Modérément actif (3 à 5 séances/semaine)",
  active: "Actif (6 à 7 séances/semaine)",
  veryActive: "Très actif (travail physique + entraînement)",
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Perte de poids (sèche)",
  maintain: "Maintien",
  gain: "Prise de masse",
};

export const BMI_CATEGORY_LABELS: Record<BmiCategory, string> = {
  underweight: "Insuffisance pondérale",
  normal: "Corpulence normale",
  overweight: "Surpoids",
  obese1: "Obésité (classe I)",
  obese2: "Obésité (classe II)",
  obese3: "Obésité (classe III)",
};
