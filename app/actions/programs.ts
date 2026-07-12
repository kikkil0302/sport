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
  importSharedProgram,
  listExercises,
  shareProgram,
  startProgramWorkout,
  updateProgramWeekday,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formValue, parseDecimalInput } from "@/lib/forms";
import { getProgramTemplate } from "@/lib/programs/templates";
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

/** Planifie le programme sur un jour de la semaine ("" = déplanifie). */
export async function planProgramAction(
  programId: string,
  formData: FormData,
): Promise<void> {
  await requireUser();

  const raw = formValue(formData, "weekday");
  const weekday = raw === "" ? null : Number(raw);
  if (weekday !== null && (!Number.isInteger(weekday) || weekday < 0 || weekday > 6)) {
    return;
  }

  try {
    await updateProgramWeekday(programId, weekday);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }
  revalidatePath(`/programmes/${programId}`);
  revalidatePath("/programmes");
  revalidatePath("/seances");
}

/**
 * Creates a real program from a ready-made template: resolves catalog
 * exercises by name, then adds one program row per working set.
 */
export async function createProgramFromTemplateAction(
  _previous: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  await requireUser();

  const template = getProgramTemplate(formValue(formData, "templateId"));
  if (!template) {
    return { error: "Choisissez un programme dans la liste." };
  }

  let programId: string;
  try {
    const exercises = await listExercises();
    const idsByName = new Map(
      exercises.map((exercise) => [exercise.name, exercise.id]),
    );
    const missing = template.exercises.filter(
      ({ exercise }) => !idsByName.has(exercise),
    );
    if (missing.length > 0) {
      return {
        error: `Exercice introuvable dans le catalogue : ${missing[0].exercise}.`,
      };
    }

    const program = await createProgram({
      name: template.name,
      description: template.description,
    });
    programId = program.id;

    try {
      // Sequential on purpose: the backend assigns the set order by insertion.
      for (const { exercise, sets, reps } of template.exercises) {
        const exerciseId = idsByName.get(exercise)!;
        for (let i = 0; i < sets; i++) {
          await addProgramSet(programId, { exerciseId, reps, weightKg: null });
        }
      }
    } catch (error) {
      // Échec en cours de remplissage : on annule la création (best effort)
      // pour ne pas laisser un programme à moitié vide dans la liste.
      await deleteProgram(programId).catch(() => {});
      throw error;
    }
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath("/programmes");
  redirect(`/programmes/${programId}`);
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

export interface ShareState {
  token?: string;
  error?: string;
}

/** Génère le lien de partage public du programme (à afficher au propriétaire). */
export async function shareProgramAction(programId: string): Promise<ShareState> {
  await requireUser();
  try {
    const { token } = await shareProgram(programId);
    return { token };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
}

/** Importe un programme partagé (par jeton) dans le compte de l'utilisateur. */
export async function importSharedProgramAction(token: string): Promise<void> {
  await requireUser();
  let programId: string;
  try {
    ({ programId } = await importSharedProgram(token));
  } catch (error) {
    if (error instanceof ApiError) redirect("/programmes");
    throw error;
  }
  revalidatePath("/programmes");
  redirect(`/programmes/${programId}`);
}
