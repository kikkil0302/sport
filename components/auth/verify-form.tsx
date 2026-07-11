"use client";

import Link from "next/link";
import { useActionState } from "react";
import { verifyEmailAction, type AuthFormState } from "@/app/actions/auth";

const INITIAL_STATE: AuthFormState = {};

/**
 * Confirmation en un clic (POST) : un simple GET du lien ne vérifie rien,
 * ce qui protège des robots qui pré-visitent les liens des e-mails.
 */
export function VerifyForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    verifyEmailAction.bind(null, token),
    INITIAL_STATE,
  );

  return (
    <div className="space-y-4">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Vérification…" : "Confirmer mon adresse e-mail"}
        </button>
      </form>
      {state.error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p>{state.error}</p>
          <p className="mt-2">
            <Link href="/connexion" className="font-medium underline">
              Retour à la connexion
            </Link>{" "}
            — vous pourrez y redemander un e-mail de vérification.
          </p>
        </div>
      )}
    </div>
  );
}
