"use client";

import { useActionState } from "react";
import {
  addBodyWeightAction,
  type BodyWeightFormState,
} from "@/app/actions/body-weight";
import { todayInputValue } from "@/lib/dates";

const INITIAL_STATE: BodyWeightFormState = {};

export function BodyWeightForm() {
  const [state, formAction, pending] = useActionState(
    addBodyWeightAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Date</span>
        <input
          type="date"
          name="measuredAt"
          defaultValue={todayInputValue()}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <label className="block w-28">
        <span className="mb-1 block text-sm font-medium">Poids (kg)</span>
        <input
          type="text"
          inputMode="decimal"
          name="weightKg"
          required
          placeholder="75,4"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Ajout…" : "Enregistrer"}
      </button>
      {state.error && <p className="w-full text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
