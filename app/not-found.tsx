import Link from "next/link";

/**
 * Rendu quand une page appelle `notFound()` (séance/programme inexistant ou
 * appartenant à un autre utilisateur) ou pour toute URL inconnue.
 * Next renvoie automatiquement le statut 404 + `noindex`.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="metric-num text-6xl font-semibold text-zinc-300 dark:text-zinc-700">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Page introuvable
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Cette page n&apos;existe pas, ou la ressource demandée n&apos;est plus
        disponible.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/calculateurs"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Calculateurs
        </Link>
      </div>
    </div>
  );
}
