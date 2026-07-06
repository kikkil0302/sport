"use client";

import { useActionState } from "react";
import { loginAction, type AuthFormState } from "@/app/actions/auth";
import { TextField } from "@/components/ui/text-field";

const INITIAL_STATE: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <TextField
        label="Adresse e-mail"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="vous@exemple.fr"
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
