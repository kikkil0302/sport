"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formValue, parseDecimalInput } from "@/lib/forms";
import { workoutSetSchema } from "@/lib/workouts/schema";

export interface ProgramFormState {
  error?: string;
}

const programSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Donnez un nom au programme")
    .max(100, "Nom trop long (100 caractères max)"),
  description: z
    .string()
    .trim()
    .max(500, "Description trop longue (500 caractères max)")
    .optional(),
});

export async function createProgramAction(
  _previous: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const user = await requireUser();

  const parsed = programSchema.safeParse({
    name: formValue(formData, "name"),
    description: formValue(formData, "description") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const program = await db.program.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    },
  });
  revalidatePath("/programmes");
  redirect(`/programmes/${program.id}`);
}

export async function deleteProgramAction(programId: string): Promise<void> {
  const user = await requireUser();
  await db.program.deleteMany({ where: { id: programId, userId: user.id } });
  revalidatePath("/programmes");
  redirect("/programmes");
}

export async function addProgramSetAction(
  programId: string,
  _previous: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const user = await requireUser();

  const program = await db.program.findUnique({ where: { id: programId } });
  if (!program || program.userId !== user.id) {
    return { error: "Programme introuvable." };
  }

  const parsed = workoutSetSchema.safeParse({
    exerciseId: formValue(formData, "exerciseId"),
    reps: Number(formValue(formData, "reps")),
    weightKg: parseDecimalInput(formValue(formData, "weightKg")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const exercise = await db.exercise.findFirst({
    where: {
      id: parsed.data.exerciseId,
      OR: [{ userId: null }, { userId: user.id }],
    },
  });
  if (!exercise) {
    return { error: "Exercice introuvable." };
  }

  const setCount = await db.programSet.count({ where: { programId } });
  await db.programSet.create({
    data: {
      programId,
      exerciseId: exercise.id,
      order: setCount + 1,
      reps: parsed.data.reps,
      weightKg: parsed.data.weightKg ?? null,
    },
  });
  revalidatePath(`/programmes/${programId}`);
  return {};
}

export async function deleteProgramSetAction(setId: string): Promise<void> {
  const user = await requireUser();
  const set = await db.programSet.findUnique({
    where: { id: setId },
    include: { program: { select: { id: true, userId: true } } },
  });
  if (!set || set.program.userId !== user.id) return;

  await db.programSet.delete({ where: { id: setId } });
  revalidatePath(`/programmes/${set.program.id}`);
}

/** Starts a workout from a program: copies its template sets into a new Workout dated now. */
export async function startWorkoutFromProgramAction(
  programId: string,
): Promise<void> {
  const user = await requireUser();

  const program = await db.program.findUnique({
    where: { id: programId },
    include: { sets: { orderBy: { order: "asc" } } },
  });
  if (!program || program.userId !== user.id) redirect("/programmes");

  const workout = await db.workout.create({
    data: {
      userId: user.id,
      performedAt: new Date(),
      notes: program.name,
      sets: {
        create: program.sets.map((set) => ({
          exerciseId: set.exerciseId,
          order: set.order,
          reps: set.reps,
          weightKg: set.weightKg,
        })),
      },
    },
  });
  revalidatePath("/seances");
  redirect(`/seances/${workout.id}`);
}
