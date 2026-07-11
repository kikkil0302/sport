"use client";

import { useActionState } from "react";
import {
  deleteSetAction,
  updateSetAction,
  type WorkoutFormState,
} from "@/app/actions/workouts";
import { MuscleBadge } from "@/components/muscle-icon";

export interface WorkoutSetRow {
  id: string;
  exerciseId: string;
  exerciseName: string;
  reps: number;
  weightKg: number | null;
}

export interface ExerciseInfo {
  muscleGroup: string;
  /** Résumé « la dernière fois » (déjà formaté), absent si jamais travaillé. */
  lastPerformance?: string;
}

const INITIAL_STATE: WorkoutFormState = {};

/**
 * Mode « séance en cours » : les séries sont groupées par exercice et chaque
 * ligne s'édite en place (réps réalisées + charge), avec détection de record.
 */
export function WorkoutSets({
  workoutId,
  sets,
  exerciseInfo,
  emptyMessage,
}: {
  workoutId: string;
  sets: WorkoutSetRow[];
  exerciseInfo: Record<string, ExerciseInfo>;
  emptyMessage: string;
}) {
  // Groupes par exercice, dans l'ordre de première apparition.
  const groups: { exerciseId: string; exerciseName: string; sets: WorkoutSetRow[] }[] =
    [];
  for (const set of sets) {
    const group = groups.find((g) => g.exerciseId === set.exerciseId);
    if (group) {
      group.sets.push(set);
    } else {
      groups.push({
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName,
        sets: [set],
      });
    }
  }

  if (groups.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const info = exerciseInfo[group.exerciseId];
        return (
          <section
            key={group.exerciseId}
            className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <MuscleBadge group={info?.muscleGroup ?? ""} />
              <div className="min-w-0">
                <h3 className="font-semibold">{group.exerciseName}</h3>
                {info?.lastPerformance && (
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    La dernière fois : {info.lastPerformance}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {group.sets.map((set, index) => (
                <SetRow
                  key={set.id}
                  workoutId={workoutId}
                  set={set}
                  index={index + 1}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SetRow({
  workoutId,
  set,
  index,
}: {
  workoutId: string;
  set: WorkoutSetRow;
  index: number;
}) {
  const [state, formAction, pending] = useActionState(
    updateSetAction.bind(null, workoutId, set.id),
    INITIAL_STATE,
  );

  const filled = set.weightKg !== null;

  return (
    <form
      action={formAction}
      className={`flex flex-wrap items-center gap-2 rounded-lg border p-2 sm:gap-3 ${
        filled
          ? "border-zinc-200 dark:border-zinc-800"
          : "border-dashed border-zinc-300 dark:border-zinc-700"
      }`}
    >
      <span className="w-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
        {index}
      </span>

      <label className="flex items-center gap-1.5">
        <input
          type="number"
          name="reps"
          defaultValue={set.reps}
          min={1}
          max={200}
          required
          aria-label={`Répétitions série ${index}`}
          className="h-11 w-16 rounded-lg border border-zinc-300 bg-white px-2 text-center text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">réps</span>
      </label>

      <label className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          name="weightKg"
          defaultValue={set.weightKg ?? ""}
          placeholder="PDC"
          aria-label={`Charge série ${index}`}
          className="h-11 w-20 rounded-lg border border-zinc-300 bg-white px-2 text-center text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">kg</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "…" : "Valider"}
      </button>

      <button
        type="submit"
        formAction={deleteSetAction.bind(null, workoutId, set.id)}
        aria-label={`Supprimer la série ${index}`}
        className="ml-auto h-11 rounded-lg px-3 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
      >
        Supprimer
      </button>

      {state.record && (
        <p className="w-full text-sm font-semibold text-amber-600 dark:text-amber-400">
          🏆 Nouveau record sur cet exercice !
        </p>
      )}
      {state.saved && !state.record && (
        <p className="w-full text-xs text-emerald-600 dark:text-emerald-400">
          ✓ Série enregistrée
        </p>
      )}
      {state.error && <p className="w-full text-xs text-red-500">{state.error}</p>}
    </form>
  );
}
