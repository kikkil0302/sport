import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl" aria-hidden>
        📡
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Vous êtes hors ligne
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Impossible de joindre Trakmetrik pour le moment. Vérifiez votre
        connexion puis réessayez — vos données vous attendent.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Réessayer
      </Link>
    </div>
  );
}
