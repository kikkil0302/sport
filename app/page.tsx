import Link from "next/link";

const FEATURES = [
  {
    title: "Calories & macros",
    description:
      "Métabolisme de base (Mifflin-St Jeor ou Katch-McArdle), dépense journalière et répartition protéines / glucides / lipides adaptée à votre objectif.",
  },
  {
    title: "IMC & conseils pro",
    description:
      "Indice de masse corporelle selon la classification OMS, accompagné de recommandations concrètes et personnalisées.",
  },
  {
    title: "Séances, programmes & stats",
    description:
      "Journal de séances, programmes réutilisables et statistiques de progression (volume, poids, 1RM estimé) avec compte personnel sécurisé.",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Reprenez le sport,{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            on s&apos;occupe des calculs
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Diététique, macros, IMC, séances : FitPilot centralise tout le
          travail invisible de la remise en forme pour que vous puissiez vous
          concentrer sur l&apos;entraînement.
        </p>
        <Link
          href="/calculateurs"
          className="mt-8 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Calculer mes besoins
        </Link>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {FEATURES.map(({ title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
