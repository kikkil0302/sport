import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addSetAction,
  deleteSetAction,
  deleteWorkoutAction,
} from "@/app/actions/workouts";
import { AddSetForm } from "@/components/workouts/add-set-form";
import { SetsTable } from "@/components/workouts/sets-table";
import { ApiError, getWorkout, listExercises } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Séance",
  robots: { index: false, follow: false },
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" });

export default async function SeanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const [workout, exercises] = await Promise.all([
    getWorkout(id).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    listExercises(),
  ]);
  if (!workout) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/seances"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Toutes mes séances
      </Link>
      <div className="mt-2 flex items-baseline justify-between gap-4">
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

      <div className="mt-8">
        <AddSetForm
          action={addSetAction.bind(null, workout.id)}
          exercises={exercises}
        />
      </div>

      <div className="mt-8">
        <SetsTable
          sets={workout.sets.map((set) => ({
            id: set.id,
            exerciseName: set.exerciseName,
            reps: set.reps,
            weightKg: set.weightKg,
          }))}
          deleteAction={deleteSetAction.bind(null, workout.id)}
          emptyMessage="Aucune série — ajoutez la première ci-dessus."
        />
      </div>

      <form
        action={deleteWorkoutAction.bind(null, workout.id)}
        className="mt-8"
      >
        <button
          type="submit"
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Supprimer la séance
        </button>
      </form>
    </div>
  );
}
