"use client";

import { useActionState } from "react";
import { deleteAccountAction, type AuthFormState } from "@/app/actions/auth";

const INITIAL_STATE: AuthFormState = {};

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(
    deleteAccountAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-3">
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="confirm" required className="mt-0.5" />
        <span>
          Je comprends que mon compte et toutes mes données seront supprimés
          définitivement.
        </span>
      </label>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        {pending ? "Suppression…" : "Supprimer mon compte"}
      </button>
    </form>
  );
}
