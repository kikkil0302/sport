import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { FAQ } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

const FEATURES = [
  {
    icon: <CalculatorIcon />,
    title: "Calories & macros sur mesure",
    description:
      "Métabolisme de base (Mifflin-St Jeor ou Katch-McArdle), dépense journalière et répartition protéines / glucides / lipides adaptée à votre objectif.",
  },
  {
    icon: <HeartIcon />,
    title: "IMC & conseils concrets",
    description:
      "Indice de masse corporelle selon la classification OMS, accompagné de recommandations personnalisées et actionnables.",
  },
  {
    icon: <ChartIcon />,
    title: "Séances, programmes & stats",
    description:
      "Journal de séances, programmes réutilisables et courbes de progression (volume, poids, 1RM estimé) dans un compte personnel sécurisé.",
  },
] as const;

const STEPS = [
  {
    title: "Calculez vos besoins",
    description:
      "Renseignez votre profil : calories cibles, macros et IMC s'affichent instantanément, directement dans votre navigateur.",
  },
  {
    title: "Planifiez vos séances",
    description:
      "Créez des programmes réutilisables et enregistrez chaque série, exercice par exercice, en quelques secondes.",
  },
  {
    title: "Suivez votre progression",
    description:
      "Visualisez l'évolution de votre volume, de vos charges et de votre 1RM estimé pour rester motivé sur la durée.",
  },
] as const;

const TRUST_POINTS = [
  "100 % gratuit",
  "Aucune donnée revendue",
  "Formules reconnues",
] as const;

export default function Home() {
  return (
    <div>
      <JsonLd data={homeGraph()} />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="hero-aura pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Nutrition &amp; entraînement, sans prise de tête
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Reprenez le sport,{" "}
              <span className="text-gradient-brand">on s&apos;occupe des calculs</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Diététique, macros, IMC, séances : Trakmetrik centralise tout le
              travail invisible de la remise en forme pour que vous puissiez
              vous concentrer sur l&apos;entraînement.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculateurs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
              >
                Calculer mes besoins
                <ArrowIcon />
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Créer un compte gratuit
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <AppPreview />
        </div>
      </section>

      {/* ---------- BANDEAU CONFIANCE ---------- */}
      <section className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-center sm:grid-cols-3">
          <TrustStat value="Mifflin-St Jeor" label="& Katch-McArdle pour vos calories" />
          <TrustStat value="Classification OMS" label="pour l'interprétation de l'IMC" />
          <TrustStat value="22 exercices" label="intégrés, prêts à l'emploi" />
        </div>
      </section>

      {/* ---------- FONCTIONNALITÉS ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tout votre suivi au même endroit
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Des calculateurs fiables aux statistiques de progression, Trakmetrik
            couvre l&apos;ensemble de votre parcours.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                {icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- COMMENT ÇA MARCHE ---------- */}
      <section className="border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trois étapes, aucune complication
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ title, description }, index) => (
              <div key={title} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONFIDENTIALITÉ ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-8 rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 lg:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <ShieldIcon />
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              Vos données vous appartiennent
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Conçu pour le RGPD dès le départ : les calculateurs tournent
              entièrement dans votre navigateur, nous ne collectons que le
              strict nécessaire et vous pouvez exporter ou supprimer votre
              compte à tout moment.
            </p>
            <Link
              href="/confidentialite"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Lire notre politique de confidentialité
              <ArrowIcon />
            </Link>
          </div>
          <ul className="space-y-4">
            {[
              "Calculateurs 100 % côté client : rien n'est envoyé sur nos serveurs.",
              "Minimisation des données : email, mot de passe chiffré, c'est tout.",
              "Export de vos données et suppression définitive en un clic.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                  <CheckIcon />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {question}
                  <span className="shrink-0 text-emerald-600 transition-transform group-open:rotate-45 dark:text-emerald-400">
                    <PlusIcon />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center">
          <div className="hero-aura pointer-events-none absolute inset-0 opacity-40" />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prêt à passer à l&apos;action ?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-emerald-50">
            Calculez vos besoins en moins d&apos;une minute, sans inscription.
            Créez un compte quand vous voulez suivre vos séances.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/calculateurs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Calculer mes besoins
              <ArrowIcon />
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Aperçu produit (mockup on-brand, sans image externe) ---------- */
function AppPreview() {
  const macros = [
    { label: "Protéines", pct: 30, color: "bg-emerald-500" },
    { label: "Glucides", pct: 45, color: "bg-sky-500" },
    { label: "Lipides", pct: 25, color: "bg-amber-500" },
  ];
  return (
    <div className="relative">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Votre bilan du jour
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Objectif : sèche
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PreviewTile label="Calories cibles" value="2 180" unit="kcal" highlight />
          <PreviewTile label="Dépense (TDEE)" value="2 560" unit="kcal" />
          <PreviewTile label="Métabolisme (BMR)" value="1 720" unit="kcal" />
          <PreviewTile label="IMC" value="22,4" unit="Normal" />
        </div>
        <div className="mt-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-3 text-sm font-semibold">Répartition des macros</div>
          <div className="space-y-3">
            {macros.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{label}</span>
                  <span>{pct} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewTile({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        highlight
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
      }`}
    >
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-xl font-bold tabular-nums">{value}</span>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{unit}</span>
      </div>
    </div>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-semibold text-emerald-700 dark:text-emerald-400">{value}</div>
      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{label}</div>
    </div>
  );
}

/* ---------- Icônes (SVG inline, sans dépendance) ---------- */
function iconProps(): { className: string } {
  return { className: "h-5 w-5" };
}

function ArrowIcon() {
  return (
    <svg
      {...iconProps()}
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

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg
      {...iconProps()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      {...iconProps()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      {...iconProps()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 4-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      {...iconProps()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-5 w-5"
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
