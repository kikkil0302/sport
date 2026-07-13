"use client";

import { useRef } from "react";

/**
 * Éditeur en ligne du temps de repos d'une série de programme. Enregistre à la
 * sortie du champ (blur) ou sur Entrée, uniquement si la valeur a changé.
 */
export function RestCell({
  action,
  restSeconds,
  defaultRest = null,
}: {
  action: (formData: FormData) => void | Promise<void>;
  restSeconds: number | null;
  /** Repos par défaut du programme : sert de valeur affichée quand la case est vide. */
  defaultRest?: number | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const initial = restSeconds == null ? "" : String(restSeconds);
  const placeholder = defaultRest == null ? "—" : String(defaultRest);

  function submitIfChanged(value: string) {
    if (value !== initial) formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={action} className="flex items-center gap-1">
      <input
        type="number"
        name="restSeconds"
        min={0}
        max={3600}
        defaultValue={initial}
        placeholder={placeholder}
        aria-label="Temps de repos en secondes"
        onBlur={(e) => submitIfChanged(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submitIfChanged(e.currentTarget.value);
          }
        }}
        className="h-8 w-16 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <span className="text-xs text-zinc-400">s</span>
      {restSeconds == null && defaultRest != null && (
        <span className="text-[0.65rem] text-zinc-400">défaut</span>
      )}
    </form>
  );
}
