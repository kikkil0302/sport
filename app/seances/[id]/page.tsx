import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addSetAction,
  deleteWorkoutAction,
  duplicateWorkoutAction,
} from "@/app/actions/workouts";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { AddSetForm } from "@/components/workouts/add-set-form";
import { NewExerciseForm } from "@/components/workouts/new-exercise-form";
import { RestTimer } from "@/components/workouts/rest-timer";
import {
  WorkoutSets,
  type ExerciseInfo,
} from "@/components/workouts/workout-sets";
import { ApiError, getWorkout, listExercises, listLastPerformances } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formatSetSummary } from "@/lib/workouts/format";

export const metadata: Metadata = {
  title: "Séance",
  robots: { index: false, follow: false },
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" });
const SHORT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

export default async function SeanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const [workout, exercises, lastPerformances] = await Promise.all([
    getWorkout(id).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    listExercises(),
    listLastPerformances(id),
  ]);
  if (!workout) notFound();

  // « La dernière fois : 10×60 kg · 8×55 kg (3 juil.) » par exercice.
  const lastSummaries: Record<string, string> = {};
  for (const performance of lastPerformances) {
    lastSummaries[performance.exerciseId] =
      `${formatSetSummary(performance.sets)} (${SHORT_DATE.format(new Date(performance.performedAt))})`;
  }

  const exerciseInfo: Record<string, ExerciseInfo> = {};
  for (const exercise of exercises) {
    exerciseInfo[exercise.id] = {
      muscleGroup: exercise.muscleGroup,
      lastPerformance: lastSummaries[exercise.id],
    };
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/seances"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Toutes mes séances
      </Link>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {DATE_FORMAT.format(new Date(workout.performedAt))}
        </h1>
        <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
          {workout.volumeKg} kg de volume
        </span>
      </div>
      {workout.notes && (
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{workout.notes}</p>
      )}

      <div className="mt-8 space-y-4">
        <RestTimer />
        <AddSetForm
          action={addSetAction.bind(null, workout.id)}
          exercises={exercises}
          lastPerformances={lastSummaries}
        />
        <NewExerciseForm revalidate={`/seances/${workout.id}`} />
      </div>

      <div className="mt-8">
        <WorkoutSets
          workoutId={workout.id}
          sets={workout.sets.map((set) => ({
            id: set.id,
            exerciseId: set.exerciseId,
            exerciseName: set.exerciseName,
            reps: set.reps,
            weightKg: set.weightKg,
          }))}
          exerciseInfo={exerciseInfo}
          emptyMessage="Aucune série — ajoutez la première ci-dessus."
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <form action={duplicateWorkoutAction.bind(null, workout.id)}>
          <button
            type="submit"
            className="h-11 rounded-lg border border-zinc-300 px-4 text-sm font-semibold transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Refaire cette séance
          </button>
        </form>
        <form action={deleteWorkoutAction.bind(null, workout.id)}>
          <ConfirmSubmitButton
            className="h-11 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            confirmMessage="Supprimer définitivement cette séance et toutes ses séries ?"
          >
            Supprimer la séance
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
