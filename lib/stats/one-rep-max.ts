/** Epley estimated one-rep max (kg), rounded to 0.1; a single rep is the weight itself. */
export function epley1Rm(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}
