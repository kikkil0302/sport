"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  addProgramSet,
  ApiError,
  createProgram,
  deleteProgram,
  deleteProgramSet,
  startProgramWorkout,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";
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
  await requireUser();

  const parsed = programSchema.safeParse({
    name: formValue(formData, "name"),
    description: formValue(formData, "description") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let programId: string;
  try {
    const program = await createProgram(parsed.data);
    programId = program.id;
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath("/programmes");
  redirect(`/programmes/${programId}`);
}

export async function deleteProgramAction(programId: string): Promise<void> {
  await requireUser();
  try {
    await deleteProgram(programId);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }
  revalidatePath("/programmes");
  redirect("/programmes");
}

export async function addProgramSetAction(
  programId: string,
  _previous: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
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
    await addProgramSet(programId, {
      exerciseId: parsed.data.exerciseId,
      reps: parsed.data.reps,
      weightKg: parsed.data.weightKg ?? null,
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath(`/programmes/${programId}`);
  return {};
}

export async function deleteProgramSetAction(
  programId: string,
  setId: string,
): Promise<void> {
  await requireUser();
  try {
    await deleteProgramSet(programId, setId);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }
  revalidatePath(`/programmes/${programId}`);
}

/** Starts a workout from a program: the backend copies its template sets, dated now. */
export async function startWorkoutFromProgramAction(
  programId: string,
): Promise<void> {
  await requireUser();

  let workoutId: string;
  try {
    ({ workoutId } = await startProgramWorkout(programId));
  } catch (error) {
    if (error instanceof ApiError) redirect("/programmes");
    throw error;
  }
  revalidatePath("/seances");
  redirect(`/seances/${workoutId}`);
}
