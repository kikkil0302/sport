"use client";

import { useActionState } from "react";
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
}: {
  /** Bound server action with (previousState, formData) signature. */
  action: (
    previous: WorkoutFormState,
    formData: FormData,
  ) => Promise<WorkoutFormState>;
  exercises: ExerciseOption[];
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  const groups = new Map<string, ExerciseOption[]>();
  for (const exercise of exercises) {
    const group = groups.get(exercise.muscleGroup) ?? [];
    group.push(exercise);
    groups.set(exercise.muscleGroup, group);
  }

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="block min-w-48 flex-1">
        <span className="mb-1 block text-sm font-medium">Exercice</span>
        <select
          name="exerciseId"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
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
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <label className="block w-28">
        <span className="mb-1 block text-sm font-medium">Charge (kg)</span>
        <input
          type="text"
          inputMode="decimal"
          name="weightKg"
          placeholder="Vide = PDC"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Ajout…" : "Ajouter la série"}
      </button>
      {state.error && (
        <p className="w-full text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}
