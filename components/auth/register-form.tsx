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

  if (state.success) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950">
        <p className="text-4xl" aria-hidden>
          ✉️
        </p>
        <h2 className="mt-3 font-semibold text-emerald-900 dark:text-emerald-100">
          Vérifiez votre boîte mail
        </h2>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">
          {state.success}
        </p>
        <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">
          Rien reçu ? Regardez vos courriers indésirables, ou redemandez un
          lien depuis la page de connexion.
        </p>
      </div>
    );
  }

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
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
