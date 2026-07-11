/** Résumé compact d'une liste de séries : « 10×60 kg · 8×55 kg · 12 réps ». */
export function formatSetSummary(
  sets: { reps: number; weightKg: number | null }[],
): string {
  return sets
    .map((set) =>
      set.weightKg !== null ? `${set.reps}×${set.weightKg} kg` : `${set.reps} réps`,
    )
    .join(" · ");
}
