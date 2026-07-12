"use client";

import { useActionState } from "react";
import { shareProgramAction, type ShareState } from "@/app/actions/programs";

const INITIAL_STATE: ShareState = {};

/** Génère un lien de partage public pour le programme et l'affiche à copier. */
export function ShareButton({ programId }: { programId: string }) {
  const [state, action, pending] = useActionState(
    shareProgramAction.bind(null, programId),
    INITIAL_STATE,
  );

  const link =
    state.token && typeof window !== "undefined"
      ? `${window.location.origin}/programmes/partage/${state.token}`
      : null;

  return (
    <div>
      <form action={action}>
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg border border-zinc-300 px-4 text-sm font-semibold transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {pending ? "Génération…" : "Partager ce programme"}
        </button>
      </form>

      {state.error && <p className="mt-2 text-sm text-red-500">{state.error}</p>}

      {link && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            readOnly
            value={link}
            onFocus={(event) => event.currentTarget.select()}
            aria-label="Lien de partage"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(link)}
            className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Copier
          </button>
          <p className="w-full text-xs text-zinc-500 dark:text-zinc-400">
            Toute personne disposant de ce lien pourra voir et importer ce
            programme (sans vos données personnelles).
          </p>
        </div>
      )}
    </div>
  );
}
