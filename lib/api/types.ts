// Response shapes of the Spring Boot backend (IdeaProjects/sport).
// Dates cross the wire as ISO strings (Instant) or "YYYY-MM-DD" (LocalDate).

export interface ApiUser {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: string;
  custom: boolean;
}

export interface SetResponse {
  id: string;
  exerciseId: string;
  exerciseName: string;
  order: number;
  reps: number;
  weightKg: number | null;
}

export interface WorkoutSummary {
  id: string;
  performedAt: string;
  notes: string | null;
  setCount: number;
  volumeKg: number;
}

export interface WorkoutDetail {
  id: string;
  performedAt: string;
  notes: string | null;
  volumeKg: number;
  sets: SetResponse[];
}

export interface ProgramSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  setCount: number;
}

export interface ProgramDetail {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  sets: SetResponse[];
}

export interface BodyWeightEntry {
  id: string;
  measuredAt: string;
  weightKg: number;
}

export interface WeeklyVolumePoint {
  weekStart: string;
  volumeKg: number;
}

export interface ProgressionSeries {
  exerciseName: string;
  /** Best estimated 1RM per training day; null when the exercise was not trained. */
  points: (number | null)[];
}

export interface StatsResponse {
  totalWorkouts: number;
  workoutsLast30Days: number;
  totalVolumeKg: number;
  currentWeightKg: number | null;
  weightDeltaKg: number | null;
  weeklyVolume: WeeklyVolumePoint[];
  progression: { days: string[]; series: ProgressionSeries[] };
}
