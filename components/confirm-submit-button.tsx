"use client";

import type { ReactNode } from "react";

/**
 * Bouton de soumission d'un `<form>` (server action) qui demande une
 * confirmation native avant d'envoyer. Pour les suppressions irréversibles
 * d'entités (séance, programme, pesée) : un clic accidentel ne détruit rien.
 */
export function ConfirmSubmitButton({
  children,
  className,
  confirmMessage,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  confirmMessage: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
