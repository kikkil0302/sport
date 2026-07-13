"use client";

import { useActionState, useState } from "react";
import type { WorkoutFormState } from "@/app/actions/workouts";

const INITIAL_STATE: WorkoutFormState = {};

export interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: string;
}

export function AddSetForm({
  action,
  exercises,
  lastPerformances = {},
  showRest = false,
  restDefault = null,
}: {
  /** Bound server action with (previousState, formData) signature. */
  action: (
    previous: WorkoutFormState,
    formData: FormData,
  ) => Promise<WorkoutFormState>;
  exercises: ExerciseOption[];
  /** Résumé « la dernière fois » par exerciseId (déjà formaté). */
  lastPerformances?: Record<string, string>;
  /** Affiche le champ « Repos (s) » (programmes uniquement). */
  showRest?: boolean;
  /** Repos par défaut du programme, montré en placeholder. */
  restDefault?: number | null;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? "");

  const groups = new Map<string, ExerciseOption[]>();
  for (const exercise of exercises) {
    const group = groups.get(exercise.muscleGroup) ?? [];
    group.push(exercise);
    groups.set(exercise.muscleGroup, group);
  }

  const lastPerformance = lastPerformances[exerciseId];

  return (
    <form
      action={formAction}
      className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="block min-w-48 flex-1">
          <span className="mb-1 block text-sm font-medium">Exercice</span>
          <select
            name="exerciseId"
            required
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {[...groups.entries()].map(([muscleGroup, groupExercises]) => (
              <optgroup key={muscleGroup} label={muscleGroup}>
                {groupExercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="block w-24">
          <span className="mb-1 block text-sm font-medium">Réps</span>
          <input
            type="number"
            name="reps"
            min={1}
            max={200}
            required
            placeholder="10"
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="block w-28">
          <span className="mb-1 block text-sm font-medium">Charge (kg)</span>
          <input
            type="text"
            inputMode="decimal"
            name="weightKg"
            placeholder="Vide = PDC"
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        {showRest && (
          <label className="block w-24">
            <span className="mb-1 block text-sm font-medium">Repos (s)</span>
            <input
              type="number"
              name="restSeconds"
              min={0}
              max={3600}
              placeholder={restDefault != null ? String(restDefault) : "90"}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Ajout…" : "Ajouter la série"}
        </button>
      </div>

      {lastPerformance && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          La dernière fois : {lastPerformance}
        </p>
      )}
      {state.record && (
        <p className="mt-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
          🏆 Nouveau record sur cet exercice !
        </p>
      )}
      {state.error && (
        <p className="mt-2 text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}
