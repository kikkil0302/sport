"use client";

import { useActionState } from "react";
import {
  createWorkoutAction,
  type WorkoutFormState,
} from "@/app/actions/workouts";
import { todayInputValue } from "@/lib/dates";

const INITIAL_STATE: WorkoutFormState = {};

export function NewWorkoutForm() {
  const [state, formAction, pending] = useActionState(
    createWorkoutAction,
    INITIAL_STATE,
  );

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Date</span>
        <input
          type="date"
          name="performedAt"
          defaultValue={todayInputValue()}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <label className="block min-w-40 flex-1">
        <span className="mb-1 block text-sm font-medium">Notes — optionnel</span>
        <input
          type="text"
          name="notes"
          placeholder="Push, jambes, forme du jour…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Création…" : "Nouvelle séance"}
      </button>
      {state.error && (
        <p className="w-full text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}
