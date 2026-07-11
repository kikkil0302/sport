"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiError, createExercise } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formValue } from "@/lib/forms";

export interface ExerciseFormState {
  error?: string;
  /** Nom de l'exercice créé — permet au formulaire de confirmer et se réinitialiser. */
  created?: string;
}

const exerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Donnez un nom à l'exercice")
    .max(100, "Nom trop long (100 caractères max)"),
  muscleGroup: z
    .string()
    .trim()
    .min(1, "Choisissez un groupe musculaire")
    .max(50, "Groupe musculaire trop long (50 caractères max)"),
});

/** Crée un exercice personnel ; `path` = page à rafraîchir (séance ou programme). */
export async function createExerciseAction(
  path: string,
  _previous: ExerciseFormState,
  formData: FormData,
): Promise<ExerciseFormState> {
  await requireUser();

  const parsed = exerciseSchema.safeParse({
    name: formValue(formData, "name"),
    muscleGroup: formValue(formData, "muscleGroup"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const exercise = await createExercise(parsed.data);
    revalidatePath(path);
    return { created: exercise.name };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
}
