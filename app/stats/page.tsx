import type { Metadata } from "next";
import Link from "next/link";
import { deleteBodyWeightAction } from "@/app/actions/body-weight";
import { ColumnChart } from "@/components/charts/column-chart";
import { LineChart, type LineSeries } from "@/components/charts/line-chart";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { BodyWeightForm } from "@/components/stats/body-weight-form";
import { StatTile } from "@/components/stats/stat-tile";
import { MuscleBadge } from "@/components/muscle-icon";
import { getStats, listBodyWeights, listRecords } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { parseDateInput } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Statistiques",
  robots: { index: false, follow: false },
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
  await requireUser();

  const [stats, weights, records] = await Promise.all([
    getStats(),
    listBodyWeights(),
    listRecords(),
  ]);

  // Charts
  const volumeData = stats.weeklyVolume.map((point) => ({
    label: DAY_MONTH.format(parseDateInput(point.weekStart)),
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

  const progressionSeries: LineSeries[] = stats.progression.series.map(
    (series, index) => ({
      name: series.exerciseName,
      colorVar: SERIES_COLOR_VARS[index],
      points: series.points,
    }),
  );

  const hasAnyData = stats.totalWorkouts > 0 || weights.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Votre progression : volume d&apos;entraînement, poids corporel et force
        estimée (1RM Epley) sur vos exercices principaux.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Séances au total" value={String(stats.totalWorkouts)} />
        <StatTile
          label="Séances (30 derniers jours)"
          value={String(stats.workoutsLast30Days)}
        />
        <StatTile
          label="Volume total soulevé"
          value={`${NUMBER_FR.format(stats.totalVolumeKg)} kg`}
        />
        <StatTile
          label="Poids actuel"
          value={
            stats.currentWeightKg !== null
              ? `${NUMBER_FR.format(stats.currentWeightKg)} kg`
              : "—"
          }
          delta={
            stats.weightDeltaKg !== null
              ? `${stats.weightDeltaKg >= 0 ? "+" : ""}${NUMBER_FR.format(stats.weightDeltaKg)} kg vs mesure précédente`
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
              labels={recentWeights.map((entry) =>
                DAY_MONTH.format(new Date(entry.measuredAt)),
              )}
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
                      {FULL_DATE.format(new Date(entry.measuredAt))} —{" "}
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {NUMBER_FR.format(entry.weightKg)} kg
                      </span>
                    </span>
                    <form action={deleteBodyWeightAction.bind(null, entry.id)}>
                      <ConfirmSubmitButton
                        className="text-xs text-red-500 hover:underline"
                        confirmMessage={`Supprimer la pesée du ${FULL_DATE.format(new Date(entry.measuredAt))} ?`}
                        aria-label={`Supprimer la pesée du ${FULL_DATE.format(new Date(entry.measuredAt))}`}
                      >
                        Supprimer
                      </ConfirmSubmitButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ChartCard>

        {records.length > 0 && (
          <ChartCard
            title="Records personnels 🏆"
            subtitle="Meilleure charge et meilleur 1RM estimé (Epley) par exercice — séries avec charge uniquement"
          >
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {records.map((record) => (
                <li
                  key={record.exerciseId}
                  className="flex items-center gap-3 py-3"
                >
                  <MuscleBadge group={record.muscleGroup} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{record.exerciseName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {FULL_DATE.format(new Date(record.achievedAt))}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-sm">
                    <p className="font-semibold">
                      {NUMBER_FR.format(record.maxWeightKg)} kg ×{" "}
                      {record.maxWeightReps}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      1RM estimé : {NUMBER_FR.format(record.bestOneRepMaxKg)} kg
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
        )}

        <ChartCard
          title="Progression de la force"
          subtitle="Meilleur 1RM estimé (formule d'Epley) par jour d'entraînement, sur vos 3 exercices les plus travaillés"
        >
          {stats.progression.days.length >= 2 ? (
            <LineChart
              labels={stats.progression.days.map((day) =>
                DAY_MONTH.format(parseDateInput(day)),
              )}
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
