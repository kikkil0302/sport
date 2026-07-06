import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { FAQ } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

const FEATURES = [
  {
    index: "01",
    title: "Calories & macros",
    description:
      "Métabolisme de base (Mifflin-St Jeor ou Katch-McArdle), dépense journalière et répartition protéines / glucides / lipides selon votre objectif.",
    metric: "BMR · TDEE · MACROS",
  },
  {
    index: "02",
    title: "IMC & lecture OMS",
    description:
      "Indice de masse corporelle selon la classification de l'OMS, avec une interprétation et des recommandations concrètes.",
    metric: "IMC · CATÉGORIE OMS",
  },
  {
    index: "03",
    title: "Séances, programmes & stats",
    description:
      "Journal de séances, programmes réutilisables et courbes de progression — volume, charges, 1RM estimé — dans un compte sécurisé.",
    metric: "VOLUME · 1RM · TENDANCE",
  },
] as const;

const STEPS = [
  {
    index: "01",
    title: "Calculez vos besoins",
    description:
      "Renseignez votre profil : calories, macros et IMC s'affichent instantanément, calculés dans votre navigateur.",
  },
  {
    index: "02",
    title: "Enregistrez vos séances",
    description:
      "Créez des programmes réutilisables et notez chaque série, exercice par exercice, en quelques secondes.",
  },
  {
    index: "03",
    title: "Lisez votre progression",
    description:
      "Suivez l'évolution de votre volume, de vos charges et de votre 1RM estimé, semaine après semaine.",
  },
] as const;

const REFS = [
  { value: "Mifflin-St Jeor", label: "& Katch-McArdle" },
  { value: "OMS", label: "Classification IMC" },
  { value: "22", label: "Exercices intégrés" },
  { value: "100 %", label: "Calculs côté client" },
] as const;

export default function Home() {
  return (
    <div>
      <JsonLd data={homeGraph()} />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="grid-lines grid-fade pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <div className="mono-label flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 bg-emerald-500" />
              Nutrition · Entraînement · Suivi
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              Reprenez le sport.
              <br />
              Laissez les chiffres
              <br />à Trakmetrik.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Calories, macros, IMC, séances et progression — mesurés, calculés
              et suivis dans un seul tableau de bord. Précis, gratuit,
              respectueux de vos données.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/calculateurs" className={PRIMARY_BTN}>
                Calculer mes besoins
                <ArrowIcon />
              </Link>
              <Link href="/inscription" className={GHOST_BTN}>
                Créer un compte
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-2 border-t border-zinc-200 sm:grid-cols-4 dark:border-zinc-800">
              {REFS.map(({ value, label }) => (
                <div
                  key={value}
                  className="border-b border-zinc-200 py-4 pr-4 sm:border-b-0 dark:border-zinc-800"
                >
                  <dt className="text-sm font-medium tracking-tight">{value}</dt>
                  <dd className="mono-label mt-1 text-zinc-500 dark:text-zinc-500">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Dashboard />
        </div>
      </section>

      {/* ---------- FONCTIONNALITÉS (fiche technique) ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="Ce que ça mesure"
          title="Un seul outil, toutes vos métriques"
        />
        <div className="mt-14 grid border-t border-zinc-200 sm:grid-cols-3 dark:border-zinc-800">
          {FEATURES.map(({ index, title, description, metric }) => (
            <article
              key={index}
              className="border-b border-zinc-200 px-0 py-8 sm:border-b-0 sm:border-l sm:px-8 sm:py-2 sm:first:border-l-0 sm:first:pl-0 dark:border-zinc-800"
            >
              <div className="mono-label text-zinc-400 dark:text-zinc-600">
                {index}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
              <div className="mono-label mt-5 text-emerald-600 dark:text-emerald-500">
                {metric}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- COMMENT ÇA MARCHE ---------- */}
      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Comment ça marche"
            title="Trois étapes, aucune friction"
          />
          <div className="mt-14 grid gap-px overflow-hidden border border-zinc-200 bg-zinc-200 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
            {STEPS.map(({ index, title, description }) => (
              <div
                key={index}
                className="bg-white p-7 dark:bg-zinc-950"
              >
                <div className="metric-num text-2xl font-semibold text-zinc-300 dark:text-zinc-700">
                  {index}
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONFIDENTIALITÉ ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHead
              eyebrow="Confidentialité"
              title="Vos données ne quittent pas votre appareil"
            />
            <p className="mt-6 max-w-md text-zinc-600 dark:text-zinc-400">
              Conçu pour le RGPD dès l&apos;origine : les calculateurs tournent
              entièrement dans votre navigateur, nous ne stockons que le strict
              nécessaire, et vous gardez la main.
            </p>
            <Link
              href="/confidentialite"
              className="mono-label mt-6 inline-flex items-center gap-2 text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400"
            >
              Politique de confidentialité
              <ArrowIcon />
            </Link>
          </div>
          <ul className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {[
              ["Calcul local", "Les calculateurs ne transmettent rien à nos serveurs."],
              ["Minimisation", "E-mail et mot de passe chiffré — rien d'autre n'est requis."],
              ["Portabilité & effacement", "Export de vos données et suppression du compte en un clic."],
            ].map(([term, detail]) => (
              <li key={term} className="flex gap-6 py-5">
                <span className="mono-label w-40 shrink-0 pt-0.5 text-emerald-600 dark:text-emerald-500">
                  {term}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <SectionHead eyebrow="FAQ" title="Questions fréquentes" />
          <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800">
            {FAQ.map(({ question, answer }, i) => (
              <details
                key={question}
                className="group border-b border-zinc-200 py-5 dark:border-zinc-800"
              >
                <summary className="flex cursor-pointer list-none items-baseline gap-4 font-medium tracking-tight">
                  <span className="mono-label pt-1 text-zinc-400 dark:text-zinc-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {question}
                  <span className="ml-auto shrink-0 pt-1 text-zinc-400 transition-transform group-open:rotate-45 dark:text-zinc-500">
                    <PlusIcon />
                  </span>
                </summary>
                <p className="mt-3 pl-10 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
        <div className="grid-lines grid-fade pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Commencez à mesurer
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-600 dark:text-zinc-400">
            Calculez vos besoins en moins d&apos;une minute, sans inscription.
            Créez un compte quand vous voulez suivre vos séances.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/calculateurs" className={PRIMARY_BTN}>
              Calculer mes besoins
              <ArrowIcon />
            </Link>
            <Link href="/inscription" className={GHOST_BTN}>
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Boutons — encre/blanc inversé (primaire) et fantôme à filet (secondaire). */
const PRIMARY_BTN =
  "inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";
const GHOST_BTN =
  "inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900";

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="mono-label text-zinc-500 dark:text-zinc-500">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/* ---------- Mini-dashboard analytique (mock on-brand, sans image) ---------- */
function Dashboard() {
  const volumes = [62, 48, 74, 55, 88, 70, 96];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const macros = [
    { label: "P", pct: 30, className: "bg-emerald-500" },
    { label: "G", pct: 45, className: "bg-zinc-400 dark:bg-zinc-500" },
    { label: "L", pct: 25, className: "bg-zinc-300 dark:bg-zinc-700" },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Barre d'entête */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="mono-label flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Tableau de bord
        </div>
        <span className="mono-label text-zinc-400 dark:text-zinc-600">
          7 jours
        </span>
      </div>

      {/* Tuiles métriques */}
      <div className="grid grid-cols-3 divide-x divide-zinc-200 border-b border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        <MetricTile label="Calories" value="2 180" unit="kcal" delta="+4,2 %" up />
        <MetricTile label="Volume" value="4 320" unit="kg" delta="+11 %" up />
        <MetricTile label="Poids" value="74,2" unit="kg" delta="−0,7 %" />
      </div>

      {/* Graphe volume hebdo */}
      <div className="px-4 py-4">
        <div className="mono-label mb-3 text-zinc-500 dark:text-zinc-500">
          Volume hebdomadaire
        </div>
        <div className="flex h-24 items-end gap-2">
          {volumes.map((v, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i === volumes.length - 1
                  ? "bg-emerald-500"
                  : "bg-zinc-200 dark:bg-zinc-800"
              }`}
              style={{ height: `${v}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {days.map((d, i) => (
            <span
              key={i}
              className="mono-label flex-1 text-center text-[0.5rem] text-zinc-400 dark:text-zinc-600"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Répartition macros */}
      <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <div className="mb-2 flex items-center justify-between">
          <span className="mono-label text-zinc-500 dark:text-zinc-500">
            Macros
          </span>
          <span className="metric-num text-xs text-zinc-500 dark:text-zinc-400">
            30 / 45 / 25
          </span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full">
          {macros.map(({ label, pct, className }) => (
            <div key={label} className={className} style={{ width: `${pct}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  unit,
  delta,
  up = false,
}: {
  label: string;
  value: string;
  unit: string;
  delta: string;
  up?: boolean;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mono-label text-zinc-500 dark:text-zinc-500">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="metric-num text-xl font-semibold">{value}</span>
        <span className="mono-label text-zinc-400 dark:text-zinc-600">{unit}</span>
      </div>
      <div
        className={`mono-label mt-1 ${
          up
            ? "text-emerald-600 dark:text-emerald-500"
            : "text-zinc-400 dark:text-zinc-500"
        }`}
      >
        {up ? "▲" : "▼"} {delta}
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
