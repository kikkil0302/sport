import type { Metadata } from "next";
import Link from "next/link";
import { deleteBodyWeightAction } from "@/app/actions/body-weight";
import { ColumnChart } from "@/components/charts/column-chart";
import { LineChart, type LineSeries } from "@/components/charts/line-chart";
import { BodyWeightForm } from "@/components/stats/body-weight-form";
import { StatTile } from "@/components/stats/stat-tile";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { exerciseProgression } from "@/lib/stats/progression";
import { countWithinDays, weeklyVolume } from "@/lib/stats/weekly";
import { totalVolumeKg } from "@/lib/workouts/volume";

export const metadata: Metadata = {
  title: "Statistiques — FitPilot",
};

const DAY_MONTH = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
});
const FULL_DATE = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const NUMBER_FR = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

const SERIES_COLOR_VARS = ["--viz-series-1", "--viz-series-2", "--viz-series-3"];

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold">{title}</h2>
      {subtitle && (
        <p className="mt-0.5 mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function StatsPage() {
  const user = await requireUser();

  const [workouts, weights] = await Promise.all([
    db.workout.findMany({
      where: { userId: user.id },
      orderBy: { performedAt: "asc" },
      include: { sets: { include: { exercise: { select: { name: true } } } } },
    }),
    db.bodyWeightEntry.findMany({
      where: { userId: user.id },
      orderBy: { measuredAt: "asc" },
    }),
  ]);

  const allSets = workouts.flatMap((workout) =>
    workout.sets.map((set) => ({
      performedAt: workout.performedAt,
      exerciseName: set.exercise.name,
      reps: set.reps,
      weightKg: set.weightKg,
    })),
  );

  // KPI tiles
  const totalVolume = totalVolumeKg(allSets);
  const recentWorkouts = countWithinDays(
    workouts.map((workout) => workout.performedAt),
    30,
  );
  const latestWeight = weights.at(-1);
  const previousWeight = weights.at(-2);
  const weightDelta =
    latestWeight && previousWeight
      ? latestWeight.weightKg - previousWeight.weightKg
      : null;

  // Charts
  const volumePoints = weeklyVolume(allSets, 8);
  const volumeData = volumePoints.map((point) => ({
    label: DAY_MONTH.format(point.weekStart),
    value: point.volumeKg,
  }));

  const recentWeights = weights.slice(-30);
  const weightSeries: LineSeries[] = [
    {
      name: "Poids corporel",
      colorVar: "--viz-series-1",
      points: recentWeights.map((entry) => entry.weightKg),
    },
  ];

  const progression = exerciseProgression(allSets, 3);
  const progressionSeries: LineSeries[] = progression.series.map(
    (series, index) => ({
      name: series.exerciseName,
      colorVar: SERIES_COLOR_VARS[index],
      points: series.points,
    }),
  );

  const hasAnyData = workouts.length > 0 || weights.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Votre progression : volume d&apos;entraînement, poids corporel et force
        estimée (1RM Epley) sur vos exercices principaux.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Séances au total" value={String(workouts.length)} />
        <StatTile label="Séances (30 derniers jours)" value={String(recentWorkouts)} />
        <StatTile
          label="Volume total soulevé"
          value={`${NUMBER_FR.format(totalVolume)} kg`}
        />
        <StatTile
          label="Poids actuel"
          value={
            latestWeight ? `${NUMBER_FR.format(latestWeight.weightKg)} kg` : "—"
          }
          delta={
            weightDelta !== null
              ? `${weightDelta >= 0 ? "+" : ""}${NUMBER_FR.format(weightDelta)} kg vs mesure précédente`
              : undefined
          }
        />
      </div>

      {!hasAnyData && (
        <p className="mt-8 rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Pas encore de données. Enregistrez vos{" "}
          <Link href="/seances" className="text-emerald-600 underline dark:text-emerald-400">
            séances
          </Link>{" "}
          et votre poids ci-dessous pour voir vos statistiques prendre vie.
        </p>
      )}

      <div className="mt-8 space-y-6">
        <ChartCard
          title="Volume hebdomadaire"
          subtitle="Somme des répétitions × charges, 8 dernières semaines (semaines débutant le lundi)"
        >
          <ColumnChart
            data={volumeData}
            unit="kg"
            ariaLabel="Volume d'entraînement par semaine sur les 8 dernières semaines"
          />
        </ChartCard>

        <ChartCard
          title="Poids corporel"
          subtitle="30 dernières mesures"
        >
          {recentWeights.length >= 2 ? (
            <LineChart
              labels={recentWeights.map((entry) => DAY_MONTH.format(entry.measuredAt))}
              series={weightSeries}
              unit="kg"
              ariaLabel="Évolution du poids corporel"
              areaWash
            />
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enregistrez au moins deux pesées pour afficher la courbe.
            </p>
          )}
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <BodyWeightForm />
            {recentWeights.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm">
                {[...recentWeights].reverse().slice(0, 5).map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-4 text-zinc-600 dark:text-zinc-400"
                  >
                    <span>
                      {FULL_DATE.format(entry.measuredAt)} —{" "}
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {NUMBER_FR.format(entry.weightKg)} kg
                      </span>
                    </span>
                    <form action={deleteBodyWeightAction.bind(null, entry.id)}>
                      <button
                        type="submit"
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Progression de la force"
          subtitle="Meilleur 1RM estimé (formule d'Epley) par jour d'entraînement, sur vos 3 exercices les plus travaillés"
        >
          {progression.days.length >= 2 ? (
            <LineChart
              labels={progression.days.map((day) => DAY_MONTH.format(day))}
              series={progressionSeries}
              unit="kg"
              ariaLabel="Progression du 1RM estimé par exercice"
            />
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enregistrez des séries avec charge sur au moins deux jours
              d&apos;entraînement pour suivre votre progression.
            </p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
