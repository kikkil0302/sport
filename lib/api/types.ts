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
  /** Temps de repos (s) ; renseigné pour les séries de programme, sinon null. */
  restSeconds: number | null;
  /** Vrai quand la série vient de battre le meilleur 1RM estimé de l'exercice. */
  record: boolean;
}

/** Dernière séance où l'exercice apparaît, avec ses séries. */
export interface LastPerformance {
  exerciseId: string;
  performedAt: string;
  sets: { reps: number; weightKg: number | null }[];
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  maxWeightKg: number;
  maxWeightReps: number;
  bestOneRepMaxKg: number;
  achievedAt: string;
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
  /** 0 = lundi … 6 = dimanche, null = non planifié. */
  weekday: number | null;
}

export interface ProgramDetail {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  weekday: number | null;
  /** Repos par défaut (s) du programme, appliqué aux séries sans valeur propre. */
  defaultRestSeconds: number | null;
  sets: SetResponse[];
}

export interface BodyWeightEntry {
  id: string;
  measuredAt: string;
  weightKg: number;
}

export interface SharedProgramSet {
  exerciseName: string;
  muscleGroup: string;
  reps: number;
  weightKg: number | null;
}

export interface SharedProgram {
  name: string;
  description: string | null;
  sets: SharedProgramSet[];
}

export type GoalPhase = "cut" | "maintain" | "bulk";

export interface Goal {
  targetWeightKg: number | null;
  phase: GoalPhase | null;
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
