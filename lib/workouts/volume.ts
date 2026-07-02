interface SetLike {
  reps: number;
  weightKg: number | null;
}

/** Total training volume in kg (Σ reps × weight); bodyweight sets count as 0. */
export function totalVolumeKg(sets: SetLike[]): number {
  return Math.round(
    sets.reduce((sum, set) => sum + set.reps * (set.weightKg ?? 0), 0),
  );
}
