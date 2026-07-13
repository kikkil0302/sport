"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addWorkoutSet,
  ApiError,
  createExercise,
  createWorkout,
  listExercises,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { localDayKey } from "@/lib/dates";

/** Réps par défaut de la série créée (l'utilisateur ajuste ensuite). */
const DEFAULT_REPS = 10;

/**
 * Depuis la carte des muscles : crée une nouvelle séance (datée aujourd'hui)
 * contenant cet exercice, puis l'ouvre. L'exercice est résolu dans le catalogue
 * de l'utilisateur, ou créé s'il n'existe pas encore (rangé dans `backendGroup`,
 * l'un des 7 groupes du backend).
 */
export async function addExerciseToNewWorkoutAction(
  exerciseName: string,
  backendGroup: string,
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

  // 2) Crée la séance + une série par défaut.
  const workout = await createWorkout({ performedAt: localDayKey(new Date()) });
  await addWorkoutSet(workout.id, {
    exerciseId,
    reps: DEFAULT_REPS,
    weightKg: null,
  });

  revalidatePath("/seances");
  redirect(`/seances/${workout.id}`);
}
