import { apiFetch } from "./client";
import type {
  BodyWeightEntry,
  ExerciseOption,
  ProgramDetail,
  ProgramSummary,
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

export function addWorkoutSet(workoutId: string, input: AddSetInput): Promise<void> {
  return apiFetch(`/api/workouts/${workoutId}/sets`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteWorkoutSet(workoutId: string, setId: string): Promise<void> {
  return apiFetch(`/api/workouts/${workoutId}/sets/${setId}`, { method: "DELETE" });
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

// Stats & account

export function getStats(): Promise<StatsResponse> {
  return apiFetch("/api/stats");
}

/** GDPR right to erasure: cascades over every user table in the backend. */
export function deleteAccount(): Promise<void> {
  return apiFetch("/api/account", { method: "DELETE" });
}
