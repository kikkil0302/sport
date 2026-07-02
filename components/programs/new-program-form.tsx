"use client";

import { useActionState } from "react";
import {
  createProgramAction,
  type ProgramFormState,
} from "@/app/actions/programs";

const INITIAL_STATE: ProgramFormState = {};

export function NewProgramForm() {
  const [state, formAction, pending] = useActionState(
    createProgramAction,
    INITIAL_STATE,
  );

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="block min-w-40">
        <span className="mb-1 block text-sm font-medium">Nom</span>
        <input
          type="text"
          name="name"
          required
          placeholder="Push, Full body, Jambes…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <label className="block min-w-40 flex-1">
        <span className="mb-1 block text-sm font-medium">
          Description — optionnel
        </span>
        <input
          type="text"
          name="description"
          placeholder="Objectif, fréquence…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Création…" : "Nouveau programme"}
      </button>
      {state.error && <p className="w-full text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
