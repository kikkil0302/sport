"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addWorkoutSet,
  ApiError,
  createWorkout,
  deleteWorkout,
  deleteWorkoutSet,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { localDayKey } from "@/lib/dates";
import { formValue, parseDecimalInput } from "@/lib/forms";
import { workoutSchema, workoutSetSchema } from "@/lib/workouts/schema";

export interface WorkoutFormState {
  error?: string;
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

  try {
    await addWorkoutSet(workoutId, {
      exerciseId: parsed.data.exerciseId,
      reps: parsed.data.reps,
      weightKg: parsed.data.weightKg ?? null,
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath(`/seances/${workoutId}`);
  return {};
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
