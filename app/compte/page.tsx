import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { DeleteAccountForm } from "@/components/auth/delete-account-form";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Mon compte — FitPilot",
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

export default async function ComptePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Mon compte</h1>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">Informations</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">E-mail</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">Nom d&apos;affichage</dt>
            <dd>{user.displayName ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">Membre depuis</dt>
            <dd>{DATE_FORMAT.format(user.createdAt)}</dd>
          </div>
        </dl>
        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Se déconnecter
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">Suivi & programmes</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enregistrez vos entraînements dans votre{" "}
          <Link
            href="/seances"
            className="text-emerald-600 underline dark:text-emerald-400"
          >
            journal de séances
          </Link>
          {" "}et suivez votre progression dans les{" "}
          <Link
            href="/stats"
            className="text-emerald-600 underline dark:text-emerald-400"
          >
            statistiques
          </Link>
          .
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">Mes données (RGPD)</h2>
        <p className="mt-2 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Droit à la portabilité : téléchargez l&apos;intégralité de vos données
          (compte, séances, pesées) au format JSON.
        </p>
        <a
          href="/api/export"
          download
          className="inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Exporter mes données
        </a>
      </section>

      <section className="mt-6 rounded-xl border border-red-200 bg-white p-6 dark:border-red-950 dark:bg-zinc-900">
        <h2 className="font-semibold text-red-600 dark:text-red-400">
          Zone dangereuse
        </h2>
        <p className="mt-2 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Conformément au RGPD (droit à l&apos;effacement), vous pouvez
          supprimer votre compte et l&apos;ensemble de vos données à tout
          moment. Cette action est irréversible.
        </p>
        <DeleteAccountForm />
      </section>
    </div>
  );
}
