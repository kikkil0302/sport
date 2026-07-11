"use client";

import { useActionState } from "react";
import {
  createExerciseAction,
  type ExerciseFormState,
} from "@/app/actions/exercises";

const INITIAL_STATE: ExerciseFormState = {};

const MUSCLE_GROUPS = [
  "Jambes",
  "Dos",
  "Pectoraux",
  "Épaules",
  "Biceps",
  "Triceps",
  "Abdominaux",
  "Cardio",
  "Autre",
] as const;

/** Création d'un exercice personnel, replié derrière un <details>. */
export function NewExerciseForm({ revalidate }: { revalidate: string }) {
  const [state, formAction, pending] = useActionState(
    createExerciseAction.bind(null, revalidate),
    INITIAL_STATE,
  );

  return (
    <details className="group rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
        <span className="mr-1 inline-block transition-transform group-open:rotate-90">
          ▸
        </span>
        Exercice manquant ? Créez le vôtre
      </summary>
      <form
        action={formAction}
        className="flex flex-wrap items-end gap-3 border-t border-dashed border-zinc-300 p-4 dark:border-zinc-700"
      >
        <label className="block min-w-44 flex-1">
          <span className="mb-1 block text-sm font-medium">Nom</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Hip thrust, rameur…"
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="block w-40">
          <span className="mb-1 block text-sm font-medium">Groupe musculaire</span>
          <select
            name="muscleGroup"
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg border border-zinc-300 px-4 text-sm font-semibold transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {pending ? "Création…" : "Créer l'exercice"}
        </button>
        {state.created && (
          <p className="w-full text-sm text-emerald-600 dark:text-emerald-400">
            ✓ « {state.created} » ajouté à votre catalogue — sélectionnez-le
            ci-dessus.
          </p>
        )}
        {state.error && <p className="w-full text-sm text-red-500">{state.error}</p>}
      </form>
    </details>
  );
}
