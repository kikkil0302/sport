import type { Metadata } from "next";
import Link from "next/link";
import { startWorkoutFromProgramAction } from "@/app/actions/programs";
import { NewWorkoutForm } from "@/components/workouts/new-workout-form";
import { listPrograms, listWorkouts } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { daysSince, todayWeekdayIndex, WEEKDAY_LABELS } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Mes séances",
  robots: { index: false, follow: false },
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" });

export default async function SeancesPage() {
  await requireUser();

  const [workouts, programs] = await Promise.all([listWorkouts(), listPrograms()]);

  const today = todayWeekdayIndex();
  const plannedToday = programs.filter(
    (program) => program.weekday === today && program.setCount > 0,
  );

  // Rappel d'inactivité : nombre de jours depuis la séance la plus récente.
  const daysSinceLast =
    workouts.length > 0
      ? Math.min(...workouts.map((workout) => daysSince(workout.performedAt)))
      : null;
  const inactivityNudge =
    daysSinceLast !== null && daysSinceLast >= 3
      ? daysSinceLast >= 7
        ? `🔥 ${daysSinceLast} jours sans séance. Une petite séance aujourd'hui pour relancer la machine ?`
        : `💪 ${daysSinceLast} jours depuis ta dernière séance — prêt à t'y remettre ?`
      : null;

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

      {inactivityNudge && (
        <p className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          {inactivityNudge}
        </p>
      )}

      {plannedToday.length > 0 && (
        <section className="mt-8 rounded-xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950">
          <h2 className="font-semibold text-emerald-900 dark:text-emerald-100">
            Au programme aujourd&apos;hui ({WEEKDAY_LABELS[today].toLowerCase()})
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {plannedToday.map((program) => (
              <form
                key={program.id}
                action={startWorkoutFromProgramAction.bind(null, program.id)}
              >
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Démarrer « {program.name} »
                </button>
              </form>
            ))}
          </div>
        </section>
      )}

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
              className="block rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-600"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-semibold capitalize">
                  {DATE_FORMAT.format(new Date(workout.performedAt))}
                </span>
                <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                  {workout.setCount} série{workout.setCount > 1 ? "s" : ""}
                  {" · "}
                  {workout.volumeKg} kg de volume
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
