"use client";

import { useEffect } from "react";

/** Enregistre le service worker (production uniquement, pour un dev sans cache). */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'appli fonctionne sans service worker — installation simplement indisponible.
    });
  }, []);

  return null;
}
