"use client";

import { useActionState } from "react";
import {
  resendVerificationAction,
  type AuthFormState,
} from "@/app/actions/auth";

const INITIAL_STATE: AuthFormState = {};

/** Renvoi de l'e-mail de vérification pour une adresse donnée. */
export function ResendVerification({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(
    resendVerificationAction,
    INITIAL_STATE,
  );

  if (state.success) {
    return (
      <p className="text-sm text-emerald-600 dark:text-emerald-400">
        ✓ {state.success}
      </p>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm font-medium text-emerald-600 underline hover:text-emerald-700 disabled:opacity-60 dark:text-emerald-400"
      >
        {pending ? "Envoi…" : "Renvoyer l'e-mail de vérification"}
      </button>
      {state.error && (
        <p className="mt-1 text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}
