import { localDayKey, parseDateInput } from "../dates";
import { epley1Rm } from "./one-rep-max";

interface ExerciseSet {
  performedAt: Date;
  exerciseName: string;
  reps: number;
  weightKg: number | null;
}

export interface ProgressionResult {
  /** Day labels shared by every series (oldest first). */
  days: Date[];
  series: {
    exerciseName: string;
    /** Best estimated 1RM per day; null when the exercise wasn't trained that day. */
    points: (number | null)[];
  }[];
}

/**
 * Best estimated 1RM per training day for the `topCount` most-trained
 * weighted exercises (bodyweight sets carry no 1RM and are ignored).
 */
export function exerciseProgression(
  sets: ExerciseSet[],
  topCount: number,
): ProgressionResult {
  const weighted = sets.filter((set) => set.weightKg !== null);

  const setCounts = new Map<string, number>();
  for (const set of weighted) {
    setCounts.set(set.exerciseName, (setCounts.get(set.exerciseName) ?? 0) + 1);
  }
  const topExercises = [...setCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topCount)
    .map(([name]) => name);

  const topExerciseSet = new Set(topExercises);
  const topSets = weighted.filter((set) => topExerciseSet.has(set.exerciseName));
  const dayKeys = [
    ...new Set(topSets.map((set) => localDayKey(set.performedAt))),
  ].sort();

  // best[exercise][dayKey] = max e1RM
  const best = new Map<string, Map<string, number>>();
  for (const set of topSets) {
    const key = localDayKey(set.performedAt);
    const e1Rm = epley1Rm(set.weightKg as number, set.reps);
    const byDay = best.get(set.exerciseName) ?? new Map<string, number>();
    byDay.set(key, Math.max(byDay.get(key) ?? 0, e1Rm));
    best.set(set.exerciseName, byDay);
  }

  return {
    days: dayKeys.map(parseDateInput),
    series: topExercises.map((exerciseName) => ({
      exerciseName,
      points: dayKeys.map((key) => best.get(exerciseName)?.get(key) ?? null),
    })),
  };
}
