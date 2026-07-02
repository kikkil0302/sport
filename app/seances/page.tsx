import type { Metadata } from "next";
import Link from "next/link";
import { NewWorkoutForm } from "@/components/workouts/new-workout-form";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { totalVolumeKg } from "@/lib/workouts/volume";

export const metadata: Metadata = {
  title: "Mes séances — FitPilot",
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" });

export default async function SeancesPage() {
  const user = await requireUser();

  const workouts = await db.workout.findMany({
    where: { userId: user.id },
    orderBy: { performedAt: "desc" },
    include: { sets: { select: { reps: true, weightKg: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Mes séances</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Créez une séance puis ajoutez-y vos séries, exercice par exercice — ou
        démarrez-la depuis un de vos{" "}
        <Link
          href="/programmes"
          className="text-emerald-600 underline dark:text-emerald-400"
        >
          programmes
        </Link>
        .
      </p>

      <div className="mt-8">
        <NewWorkoutForm />
      </div>

      <div className="mt-8 space-y-3">
        {workouts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Aucune séance pour le moment — créez la première ci-dessus.
          </p>
        ) : (
          workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/seances/${workout.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-600"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-semibold capitalize">
                  {DATE_FORMAT.format(workout.performedAt)}
                </span>
                <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                  {workout.sets.length} série{workout.sets.length > 1 ? "s" : ""}
                  {" · "}
                  {totalVolumeKg(workout.sets)} kg de volume
                </span>
              </div>
              {workout.notes && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {workout.notes}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
