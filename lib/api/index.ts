import { apiFetch } from "./client";
import type {
  BodyWeightEntry,
  ExerciseOption,
  Goal,
  LastPerformance,
  PersonalRecord,
  ProgramDetail,
  ProgramSummary,
  SetResponse,
  SharedProgram,
  StatsResponse,
  WorkoutDetail,
  WorkoutSummary,
} from "./types";

export { ApiError, apiFetch, backendFetch, readErrorMessage, SESSION_COOKIE } from "./client";
export type * from "./types";

// Exercises

export function listExercises(): Promise<ExerciseOption[]> {
  return apiFetch("/api/exercises");
}

export function createExercise(input: {
  name: string;
  muscleGroup: string;
}): Promise<ExerciseOption> {
  return apiFetch("/api/exercises", { method: "POST", body: JSON.stringify(input) });
}

/** « La dernière fois » : dernière séance par exercice (hors séance consultée). */
export function listLastPerformances(
  excludeWorkoutId?: string,
): Promise<LastPerformance[]> {
  const query = excludeWorkoutId
    ? `?excludeWorkout=${encodeURIComponent(excludeWorkoutId)}`
    : "";
  return apiFetch(`/api/exercises/last-performances${query}`);
}

export function listRecords(): Promise<PersonalRecord[]> {
  return apiFetch("/api/records");
}

// Workouts

export function listWorkouts(): Promise<WorkoutSummary[]> {
  return apiFetch("/api/workouts");
}

export function getWorkout(id: string): Promise<WorkoutDetail> {
  return apiFetch(`/api/workouts/${id}`);
}

export function createWorkout(input: {
  performedAt?: string;
  notes?: string;
}): Promise<WorkoutDetail> {
  return apiFetch("/api/workouts", { method: "POST", body: JSON.stringify(input) });
}

export function deleteWorkout(id: string): Promise<void> {
  return apiFetch(`/api/workouts/${id}`, { method: "DELETE" });
}

export interface AddSetInput {
  exerciseId: string;
  reps: number;
  weightKg: number | null;
}

export function addWorkoutSet(
  workoutId: string,
  input: AddSetInput,
): Promise<SetResponse> {
  return apiFetch(`/api/workouts/${workoutId}/sets`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Mise à jour d'une série en séance (réps réalisées + charge). */
export function updateWorkoutSet(
  workoutId: string,
  setId: string,
  input: { reps: number; weightKg: number | null },
): Promise<SetResponse> {
  return apiFetch(`/api/workouts/${workoutId}/sets/${setId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteWorkoutSet(workoutId: string, setId: string): Promise<void> {
  return apiFetch(`/api/workouts/${workoutId}/sets/${setId}`, { method: "DELETE" });
}

/** « Refaire cette séance » : copie les séries en nouvelle séance datée maintenant. */
export function duplicateWorkout(workoutId: string): Promise<WorkoutDetail> {
  return apiFetch(`/api/workouts/${workoutId}/duplicate`, { method: "POST" });
}

// Programs

export function listPrograms(): Promise<ProgramSummary[]> {
  return apiFetch("/api/programs");
}

export function getProgram(id: string): Promise<ProgramDetail> {
  return apiFetch(`/api/programs/${id}`);
}

export function createProgram(input: {
  name: string;
  description?: string;
}): Promise<ProgramDetail> {
  return apiFetch("/api/programs", { method: "POST", body: JSON.stringify(input) });
}

export function deleteProgram(id: string): Promise<void> {
  return apiFetch(`/api/programs/${id}`, { method: "DELETE" });
}

/** Planifie le programme sur un jour (0 = lundi … 6 = dimanche, null = aucun). */
export function updateProgramWeekday(
  id: string,
  weekday: number | null,
): Promise<ProgramDetail> {
  return apiFetch(`/api/programs/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ weekday }),
  });
}

export function addProgramSet(programId: string, input: AddSetInput): Promise<void> {
  return apiFetch(`/api/programs/${programId}/sets`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteProgramSet(programId: string, setId: string): Promise<void> {
  return apiFetch(`/api/programs/${programId}/sets/${setId}`, { method: "DELETE" });
}

/** Copies the program's template sets into a workout dated now. */
export function startProgramWorkout(programId: string): Promise<{ workoutId: string }> {
  return apiFetch(`/api/programs/${programId}/start`, { method: "POST" });
}

/** Generates (or returns) the program's public share token. */
export function shareProgram(programId: string): Promise<{ token: string }> {
  return apiFetch(`/api/programs/${programId}/share`, { method: "POST" });
}

/** Public preview of a shared program (no auth required). */
export function getSharedProgram(token: string): Promise<SharedProgram> {
  return apiFetch(`/api/shared/${encodeURIComponent(token)}`);
}

/** Imports a shared program into the current user's account. */
export function importSharedProgram(token: string): Promise<{ programId: string }> {
  return apiFetch(`/api/shared/${encodeURIComponent(token)}/import`, {
    method: "POST",
  });
}

// Body weight

export function listBodyWeights(): Promise<BodyWeightEntry[]> {
  return apiFetch("/api/body-weights");
}

export function addBodyWeight(input: {
  measuredAt?: string;
  weightKg: number;
}): Promise<BodyWeightEntry> {
  return apiFetch("/api/body-weights", { method: "POST", body: JSON.stringify(input) });
}

export function deleteBodyWeight(id: string): Promise<void> {
  return apiFetch(`/api/body-weights/${id}`, { method: "DELETE" });
}

// Goals

export function getGoal(): Promise<Goal> {
  return apiFetch("/api/goals");
}

export function updateGoal(input: {
  targetWeightKg: number | null;
  phase: Goal["phase"];
}): Promise<Goal> {
  return apiFetch("/api/goals", { method: "PUT", body: JSON.stringify(input) });
}

// Stats & account

export function getStats(): Promise<StatsResponse> {
  return apiFetch("/api/stats");
}

/** GDPR right to erasure: cascades over every user table in the backend. */
export function deleteAccount(): Promise<void> {
  return apiFetch("/api/account", { method: "DELETE" });
}
