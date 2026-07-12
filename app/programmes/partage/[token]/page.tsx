import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { importSharedProgramAction } from "@/app/actions/programs";
import { MuscleBadge } from "@/components/muscle-icon";
import { ApiError, getSharedProgram } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Programme partagé",
  robots: { index: false, follow: false },
};

export default async function SharedProgramPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const program = await getSharedProgram(token).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  });
  if (!program) notFound();

  const user = await getSessionUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mono-label text-zinc-500 dark:text-zinc-400">
        Programme partagé
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{program.name}</h1>
      {program.description && (
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {program.description}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Exercice</th>
              <th className="px-4 py-2">Réps</th>
              <th className="px-4 py-2">Charge</th>
            </tr>
          </thead>
          <tbody>
            {program.sets.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  Ce programme ne contient encore aucune série.
                </td>
              </tr>
            ) : (
              program.sets.map((set, index) => (
                <tr
                  key={index}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-2 font-medium">
                      <MuscleBadge group={set.muscleGroup} size="sm" />
                      {set.exerciseName}
                    </span>
                  </td>
                  <td className="px-4 py-2">{set.reps}</td>
                  <td className="px-4 py-2">
                    {set.weightKg !== null
                      ? `${set.weightKg} kg`
                      : "Poids du corps"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        {user ? (
          <form action={importSharedProgramAction.bind(null, token)}>
            <button
              type="submit"
              className="h-11 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Importer dans mon compte
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Connectez-vous (ou créez un compte gratuit) pour importer ce
              programme et l&apos;utiliser dans vos séances.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/connexion"
                className="h-11 rounded-lg bg-emerald-600 px-5 text-sm font-semibold leading-[44px] text-white transition-colors hover:bg-emerald-700"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="h-11 rounded-lg border border-zinc-300 px-5 text-sm font-semibold leading-[44px] transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
