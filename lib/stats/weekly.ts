interface DatedSet {
  performedAt: Date;
  reps: number;
  weightKg: number | null;
}

export interface WeeklyVolumePoint {
  weekStart: Date;
  volumeKg: number;
}

/** Number of dates falling within the last `days` days. */
export function countWithinDays(
  dates: Date[],
  days: number,
  now: Date = new Date(),
): number {
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return dates.filter((date) => date >= cutoff).length;
}

/** Monday 00:00 (local time) of the week containing the date. */
export function weekStart(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const daysSinceMonday = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - daysSinceMonday);
  return result;
}

/** Training volume per week for the last `weekCount` weeks (zero-filled, oldest first). */
export function weeklyVolume(
  sets: DatedSet[],
  weekCount: number,
  now: Date = new Date(),
): WeeklyVolumePoint[] {
  const currentWeek = weekStart(now);
  const points: WeeklyVolumePoint[] = [];
  for (let i = weekCount - 1; i >= 0; i--) {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - 7 * i);
    points.push({ weekStart: start, volumeKg: 0 });
  }

  const indexByTime = new Map(points.map((p, i) => [p.weekStart.getTime(), i]));
  for (const set of sets) {
    const index = indexByTime.get(weekStart(set.performedAt).getTime());
    if (index !== undefined) {
      points[index].volumeKg += set.reps * (set.weightKg ?? 0);
    }
  }
  for (const point of points) point.volumeKg = Math.round(point.volumeKg);
  return points;
}
