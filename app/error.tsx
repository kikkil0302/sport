"use client"; // Les error boundaries doivent être des Client Components.

import Link from "next/link";
import { useEffect } from "react";

/**
 * Filet de sécurité rendu à la place d'une page dont le rendu a échoué
 * (backend injoignable, réponse inattendue…). En production, Next masque le
 * message d'origine des Server Components ; on affiche donc un message FR
 * générique rassurant et on propose de réessayer (unstable_retry re-fetch).
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Trace côté client ; `digest` permet de retrouver le log serveur.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl" aria-hidden>
        ⚠️
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Une erreur est survenue
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Le service est peut-être momentanément indisponible. Réessayez dans un
        instant — si le problème persiste, revenez un peu plus tard.
      </p>
      {error.digest && (
        <p className="mono-label mt-4 text-zinc-400 dark:text-zinc-600">
          Référence : {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
