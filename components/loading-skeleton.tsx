/**
 * Squelette de chargement générique, affiché instantanément par les fichiers
 * `loading.tsx` pendant que la page (rendue serveur) attend le backend.
 * Donne un retour visuel immédiat plutôt qu'un écran figé.
 */
export function LoadingSkeleton({ title }: { title: string }) {
  return (
    <div
      className="mx-auto max-w-5xl px-4 py-12"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-9 w-56 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
          />
        ))}
      </div>
      <span className="sr-only">{title} en cours de chargement…</span>
    </div>
  );
}
