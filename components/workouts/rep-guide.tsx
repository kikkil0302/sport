import { REP_GOALS, REP_GUIDE_TIP } from "@/lib/workouts/rep-guide";

/**
 * Fiche pliable « Combien de répétitions ? » : repères par objectif
 * (force / prise de muscle / endurance). Contenu statique, rendu serveur.
 */
export function RepGuide() {
  return (
    <details className="group rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
        <span className="mr-1 inline-block transition-transform group-open:rotate-90">
          ▸
        </span>
        Combien de répétitions ? Le guide selon votre objectif
      </summary>

      <div className="border-t border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <div className="grid gap-3 sm:grid-cols-3">
          {REP_GOALS.map((goal) => (
            <div
              key={goal.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden className="text-lg">
                  {goal.emoji}
                </span>
                <h4 className="font-semibold">{goal.label}</h4>
              </div>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500 dark:text-zinc-400">Répétitions</dt>
                  <dd className="font-medium">{goal.reps}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500 dark:text-zinc-400">Intensité</dt>
                  <dd className="text-right font-medium">{goal.intensity}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500 dark:text-zinc-400">Repos</dt>
                  <dd className="font-medium">{goal.rest}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {goal.focus}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          💡 {REP_GUIDE_TIP}
        </p>
      </div>
    </details>
  );
}
