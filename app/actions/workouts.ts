"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formValue, parseDecimalInput } from "@/lib/forms";
import { workoutSchema, workoutSetSchema } from "@/lib/workouts/schema";

export interface WorkoutFormState {
  error?: string;
}

export async function createWorkoutAction(
  _previous: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  const user = await requireUser();

  const parsed = workoutSchema.safeParse({
    performedAt: formValue(formData, "performedAt") || new Date(),
    notes: formValue(formData, "notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const workout = await db.workout.create({
    data: {
      userId: user.id,
      performedAt: parsed.data.performedAt,
      notes: parsed.data.notes ?? null,
    },
  });
  revalidatePath("/seances");
  redirect(`/seances/${workout.id}`);
}

export async function deleteWorkoutAction(workoutId: string): Promise<void> {
  const user = await requireUser();
  await db.workout.deleteMany({ where: { id: workoutId, userId: user.id } });
  revalidatePath("/seances");
  redirect("/seances");
}

export async function addSetAction(
  workoutId: string,
  _previous: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  const user = await requireUser();

  const workout = await db.workout.findUnique({ where: { id: workoutId } });
  if (!workout || workout.userId !== user.id) {
    return { error: "Séance introuvable." };
  }

  const parsed = workoutSetSchema.safeParse({
    exerciseId: formValue(formData, "exerciseId"),
    reps: Number(formValue(formData, "reps")),
    weightKg: parseDecimalInput(formValue(formData, "weightKg")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // The exercise must be built-in or belong to the user.
  const exercise = await db.exercise.findFirst({
    where: {
      id: parsed.data.exerciseId,
      OR: [{ userId: null }, { userId: user.id }],
    },
  });
  if (!exercise) {
    return { error: "Exercice introuvable." };
  }

  const setCount = await db.workoutSet.count({ where: { workoutId } });
  await db.workoutSet.create({
    data: {
      workoutId,
      exerciseId: exercise.id,
      order: setCount + 1,
      reps: parsed.data.reps,
      weightKg: parsed.data.weightKg ?? null,
    },
  });
  revalidatePath(`/seances/${workoutId}`);
  return {};
}

export async function deleteSetAction(setId: string): Promise<void> {
  const user = await requireUser();
  const set = await db.workoutSet.findUnique({
    where: { id: setId },
    include: { workout: { select: { id: true, userId: true } } },
  });
  if (!set || set.workout.userId !== user.id) return;

  await db.workoutSet.delete({ where: { id: setId } });
  revalidatePath(`/seances/${set.workout.id}`);
}
