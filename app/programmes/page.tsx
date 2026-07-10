import type { Metadata } from "next";
import Link from "next/link";
import { NewProgramForm } from "@/components/programs/new-program-form";
import { listPrograms } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Mes programmes",
  robots: { index: false, follow: false },
};

export default async function ProgrammesPage() {
  await requireUser();

  const programs = await listPrograms();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Mes programmes</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Un programme est un modèle de séance réutilisable : composez-le une
        fois, puis démarrez vos séances en un clic avec les séries pré-remplies.
      </p>

      <div className="mt-8">
        <NewProgramForm />
      </div>

      <div className="mt-8 space-y-3">
        {programs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Aucun programme pour le moment — créez le premier ci-dessus.
          </p>
        ) : (
          programs.map((program) => (
            <Link
              key={program.id}
              href={`/programmes/${program.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-600"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-semibold">{program.name}</span>
                <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                  {program.setCount} série{program.setCount > 1 ? "s" : ""}
                </span>
              </div>
              {program.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {program.description}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
