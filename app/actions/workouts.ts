"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addWorkoutSet,
  ApiError,
  createWorkout,
  deleteWorkout,
  deleteWorkoutSet,
  duplicateWorkout,
  updateWorkoutSet,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { localDayKey } from "@/lib/dates";
import { formValue, parseDecimalInput } from "@/lib/forms";
import { workoutSchema, workoutSetSchema } from "@/lib/workouts/schema";

export interface WorkoutFormState {
  error?: string;
  /** Vrai quand la dernière série enregistrée bat le meilleur 1RM de l'exercice. */
  record?: boolean;
  /** Marqueur de succès pour l'édition en séance (affiche « enregistré »). */
  saved?: boolean;
}

export async function createWorkoutAction(
  _previous: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  await requireUser();

  const parsed = workoutSchema.safeParse({
    performedAt: formValue(formData, "performedAt") || new Date(),
    notes: formValue(formData, "notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let workoutId: string;
  try {
    const workout = await createWorkout({
      performedAt: localDayKey(parsed.data.performedAt),
      notes: parsed.data.notes,
    });
    workoutId = workout.id;
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath("/seances");
  redirect(`/seances/${workoutId}`);
}

export async function deleteWorkoutAction(workoutId: string): Promise<void> {
  await requireUser();
  try {
    await deleteWorkout(workoutId);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }
  revalidatePath("/seances");
  redirect("/seances");
}

export async function addSetAction(
  workoutId: string,
  _previous: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  await requireUser();

  const parsed = workoutSetSchema.safeParse({
    exerciseId: formValue(formData, "exerciseId"),
    reps: Number(formValue(formData, "reps")),
    weightKg: parseDecimalInput(formValue(formData, "weightKg")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let record = false;
  try {
    const set = await addWorkoutSet(workoutId, {
      exerciseId: parsed.data.exerciseId,
      reps: parsed.data.reps,
      weightKg: parsed.data.weightKg ?? null,
    });
    record = set.record;
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath(`/seances/${workoutId}`);
  return { record };
}

/** Édition d'une série en cours de séance : réps réalisées + charge. */
export async function updateSetAction(
  workoutId: string,
  setId: string,
  _previous: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  await requireUser();

  const parsed = workoutSetSchema.omit({ exerciseId: true }).safeParse({
    reps: Number(formValue(formData, "reps")),
    weightKg: parseDecimalInput(formValue(formData, "weightKg")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let record = false;
  try {
    const set = await updateWorkoutSet(workoutId, setId, {
      reps: parsed.data.reps,
      weightKg: parsed.data.weightKg ?? null,
    });
    record = set.record;
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath(`/seances/${workoutId}`);
  return { saved: true, record };
}

/** « Refaire cette séance » : duplique les séries dans une séance datée maintenant. */
export async function duplicateWorkoutAction(workoutId: string): Promise<void> {
  await requireUser();

  let newWorkoutId: string;
  try {
    const copy = await duplicateWorkout(workoutId);
    newWorkoutId = copy.id;
  } catch (error) {
    if (error instanceof ApiError) redirect("/seances");
    throw error;
  }
  revalidatePath("/seances");
  redirect(`/seances/${newWorkoutId}`);
}

export async function deleteSetAction(
  workoutId: string,
  setId: string,
): Promise<void> {
  await requireUser();
  try {
    await deleteWorkoutSet(workoutId, setId);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }
  revalidatePath(`/seances/${workoutId}`);
}
