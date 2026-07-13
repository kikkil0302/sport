"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addProgramSet,
  ApiError,
  createExercise,
  createProgram,
  listExercises,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";

/** Réps cible par défaut de la série ajoutée au programme (ajustable ensuite). */
const DEFAULT_REPS = 10;

/**
 * Depuis la carte des muscles : ajoute cet exercice à un programme, puis
 * l'ouvre. `programId` vide = crée un nouveau programme nommé `newProgramName` ;
 * sinon on ajoute au programme existant. L'exercice est résolu dans le
 * catalogue de l'utilisateur, ou créé s'il n'existe pas encore (rangé dans
 * `backendGroup`, l'un des 7 groupes du backend).
 */
export async function addExerciseToProgramAction(
  exerciseName: string,
  backendGroup: string,
  programId: string,
  newProgramName: string,
): Promise<void> {
  await requireUser();

  // 1) Résout (ou crée) l'exercice dans le catalogue.
  let exerciseId: string;
  try {
    const existing = (await listExercises()).find((e) => e.name === exerciseName);
    exerciseId = existing
      ? existing.id
      : (await createExercise({ name: exerciseName, muscleGroup: backendGroup })).id;
  } catch (error) {
    // 409 = créé entre-temps (double-clic) → on relit le catalogue.
    if (error instanceof ApiError) {
      const again = (await listExercises()).find((e) => e.name === exerciseName);
      if (!again) throw error;
      exerciseId = again.id;
    } else {
      throw error;
    }
  }

  // 2) Programme cible : existant, ou nouveau (nommé d'après le muscle).
  const targetId = programId
    ? programId
    : (await createProgram({ name: newProgramName || "Nouveau programme" })).id;

  await addProgramSet(targetId, {
    exerciseId,
    reps: DEFAULT_REPS,
    weightKg: null,
  });

  revalidatePath("/programmes");
  revalidatePath(`/programmes/${targetId}`);
  redirect(`/programmes/${targetId}`);
}
