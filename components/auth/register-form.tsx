"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthFormState } from "@/app/actions/auth";
import { TextField } from "@/components/ui/text-field";

const INITIAL_STATE: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    INITIAL_STATE,
  );

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
        label="Nom d'affichage — optionnel"
        name="displayName"
        autoComplete="nickname"
        placeholder="Comment vous appeler ?"
      />
      <TextField
        label="Mot de passe (8 caractères minimum)"
        name="password"
        type="password"
        required
        autoComplete="new-password"
      />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>
          J&apos;accepte la{" "}
          <Link
            href="/confidentialite"
            className="text-emerald-600 underline dark:text-emerald-400"
          >
            politique de confidentialité
          </Link>{" "}
          (RGPD)
        </span>
      </label>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
