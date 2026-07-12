"use client";

import { useActionState } from "react";
import { updateGoalAction, type GoalFormState } from "@/app/actions/goals";
import type { Goal } from "@/lib/api";

export const PHASE_LABELS: Record<NonNullable<Goal["phase"]>, string> = {
  cut: "Sèche",
  maintain: "Maintien",
  bulk: "Prise de masse",
};

const INITIAL_STATE: GoalFormState = {};

const FIELD_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900";

export function GoalForm({ goal }: { goal: Goal }) {
  const [state, formAction, pending] = useActionState(
    updateGoalAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="block w-32">
        <span className="mb-1 block text-sm font-medium">Poids cible (kg)</span>
        <input
          type="text"
          inputMode="decimal"
          name="targetWeightKg"
          defaultValue={goal.targetWeightKg ?? ""}
          placeholder="75"
          className={FIELD_CLASS}
        />
      </label>
      <label className="block w-44">
        <span className="mb-1 block text-sm font-medium">Phase actuelle</span>
        <select name="phase" defaultValue={goal.phase ?? ""} className={FIELD_CLASS}>
          <option value="">— Aucune</option>
          <option value="cut">Sèche</option>
          <option value="maintain">Maintien</option>
          <option value="bulk">Prise de masse</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "…" : "Enregistrer"}
      </button>
      {state.saved && (
        <p className="w-full text-sm text-emerald-600 dark:text-emerald-400">
          ✓ Objectif enregistré
        </p>
      )}
      {state.error && <p className="w-full text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
