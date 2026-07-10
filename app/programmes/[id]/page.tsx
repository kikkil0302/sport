import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addProgramSetAction,
  deleteProgramAction,
  deleteProgramSetAction,
  startWorkoutFromProgramAction,
} from "@/app/actions/programs";
import { AddSetForm } from "@/components/workouts/add-set-form";
import { SetsTable } from "@/components/workouts/sets-table";
import { ApiError, getProgram, listExercises } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Programme",
  robots: { index: false, follow: false },
};

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const [program, exercises] = await Promise.all([
    getProgram(id).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    listExercises(),
  ]);
  if (!program) notFound();

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
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
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

      <div className="mt-8">
        <AddSetForm
          action={addProgramSetAction.bind(null, program.id)}
          exercises={exercises}
        />
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
        className="mt-8"
      >
        <button
          type="submit"
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Supprimer le programme
        </button>
      </form>
    </div>
  );
}
