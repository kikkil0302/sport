import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addProgramSetAction,
  deleteProgramAction,
  deleteProgramSetAction,
  planProgramAction,
  startWorkoutFromProgramAction,
} from "@/app/actions/programs";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { AddSetForm } from "@/components/workouts/add-set-form";
import { NewExerciseForm } from "@/components/workouts/new-exercise-form";
import { RepGuide } from "@/components/workouts/rep-guide";
import { SetsTable } from "@/components/workouts/sets-table";
import {
  ApiError,
  getProgram,
  listExercises,
  listLastPerformances,
} from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { WEEKDAY_LABELS } from "@/lib/dates";
import { formatSetSummary } from "@/lib/workouts/format";

export const metadata: Metadata = {
  title: "Programme",
  robots: { index: false, follow: false },
};

const SHORT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const [program, exercises, lastPerformances] = await Promise.all([
    getProgram(id).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    listExercises(),
    listLastPerformances(),
  ]);
  if (!program) notFound();

  const lastSummaries: Record<string, string> = {};
  for (const performance of lastPerformances) {
    lastSummaries[performance.exerciseId] =
      `${formatSetSummary(performance.sets)} (${SHORT_DATE.format(new Date(performance.performedAt))})`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/programmes"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Tous mes programmes
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
        {program.sets.length > 0 && (
          <form action={startWorkoutFromProgramAction.bind(null, program.id)}>
            <button
              type="submit"
              className="h-11 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Démarrer une séance
            </button>
          </form>
        )}
      </div>
      {program.description && (
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {program.description}
        </p>
      )}

      <form
        action={planProgramAction.bind(null, program.id)}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Jour de la semaine
          </span>
          <select
            name="weekday"
            defaultValue={program.weekday ?? ""}
            className="h-11 w-44 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Non planifié</option>
            {WEEKDAY_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="h-11 rounded-lg border border-zinc-300 px-4 text-sm font-semibold transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Planifier
        </button>
        <p className="w-full text-xs text-zinc-500 dark:text-zinc-400 sm:w-auto sm:flex-1">
          Le programme apparaîtra sur la page Séances le jour choisi.
        </p>
      </form>

      <div className="mt-8">
        <RepGuide />
      </div>

      <div className="mt-8 space-y-4">
        <AddSetForm
          action={addProgramSetAction.bind(null, program.id)}
          exercises={exercises}
          lastPerformances={lastSummaries}
        />
        <NewExerciseForm revalidate={`/programmes/${program.id}`} />
      </div>

      <div className="mt-8">
        <SetsTable
          sets={program.sets.map((set) => ({
            id: set.id,
            exerciseName: set.exerciseName,
            reps: set.reps,
            weightKg: set.weightKg,
          }))}
          deleteAction={deleteProgramSetAction.bind(null, program.id)}
          emptyMessage="Aucune série — composez le programme ci-dessus."
        />
      </div>

      <form
        action={deleteProgramAction.bind(null, program.id)}
        className="mt-10"
      >
        <ConfirmSubmitButton
          className="h-11 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          confirmMessage="Supprimer définitivement ce programme et tous ses exercices planifiés ?"
        >
          Supprimer le programme
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
