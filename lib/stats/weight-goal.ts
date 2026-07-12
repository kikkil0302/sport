// Progression vers un objectif de poids : fonction pure, testée, sans I/O.
// `start` = première pesée enregistrée, `current` = pesée la plus récente.

export type WeightGoalDirection = "lose" | "gain" | "maintain";

export interface WeightGoalProgress {
  direction: WeightGoalDirection;
  /** Avancement de `start` vers `target`, borné entre 0 et 1. */
  fraction: number;
  /** Kilos restants pour atteindre la cible (0 si atteinte). */
  remainingKg: number;
  reached: boolean;
}

const EPSILON = 0.05;
const round1 = (value: number): number => Math.round(value * 10) / 10;

export function weightGoalProgress(
  startKg: number,
  currentKg: number,
  targetKg: number,
): WeightGoalProgress {
  let direction: WeightGoalDirection;
  if (targetKg < startKg - EPSILON) direction = "lose";
  else if (targetKg > startKg + EPSILON) direction = "gain";
  else direction = "maintain";

  const reached =
    direction === "lose"
      ? currentKg <= targetKg + EPSILON
      : direction === "gain"
        ? currentKg >= targetKg - EPSILON
        : Math.abs(currentKg - targetKg) <= EPSILON;

  const remainingKg = reached ? 0 : round1(Math.abs(currentKg - targetKg));

  let fraction: number;
  if (reached) fraction = 1;
  else if (direction === "maintain") fraction = 0;
  else fraction = (startKg - currentKg) / (startKg - targetKg);
  fraction = Math.max(0, Math.min(1, fraction));

  return { direction, fraction, remainingKg, reached };
}
