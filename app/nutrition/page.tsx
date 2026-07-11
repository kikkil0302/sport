import type { Metadata } from "next";
import Link from "next/link";
import { DietPlanner } from "@/components/nutrition/diet-planner";
import { BULK_GUIDE, CUT_GUIDE, type GuideSection } from "@/lib/nutrition";

const title = "Plan alimentaire personnalisé & guide sèche / prise de masse";
const description =
  "Générez gratuitement une journée type adaptée à vos besoins caloriques et à vos restrictions alimentaires (végétarien, vegan, sans gluten, sans lactose), avec un guide complet pour réussir votre sèche (cut) ou votre prise de masse (bulk). Calcul 100 % dans votre navigateur.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nutrition" },
  openGraph: {
    title: `${title} — Trakmetrik`,
    description,
    url: "/nutrition",
    type: "website",
  },
};

export default function NutritionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Plan alimentaire personnalisé
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Renseignez votre profil et vos restrictions : Trakmetrik calcule vos
        besoins (mêmes formules que les{" "}
        <Link
          href="/calculateurs"
          className="text-emerald-600 underline dark:text-emerald-400"
        >
          calculateurs
        </Link>
        ) puis compose une journée type — quantités en grammes, repas par
        repas.
      </p>

      <div className="mt-10">
        <DietPlanner />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">
          Guide : réussir sa sèche ou sa prise de masse
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Les principes qui font l&apos;essentiel du résultat, dans un sens
          comme dans l&apos;autre : le réglage des calories, les protéines,
          l&apos;entraînement et le suivi.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuideCard
            title="Sécher (cut)"
            subtitle="Perdre du gras en gardant le muscle"
            sections={CUT_GUIDE}
          />
          <GuideCard
            title="Prendre de la masse (bulk)"
            subtitle="Construire du muscle en limitant le gras"
            sections={BULK_GUIDE}
          />
        </div>

        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          Contenu informatif destiné à des adultes en bonne santé — ne
          remplace pas un avis médical ou l&apos;accompagnement d&apos;un
          diététicien, en particulier en cas de pathologie ou de trouble du
          comportement alimentaire.
        </p>
      </section>
    </div>
  );
}

function GuideCard({
  title,
  subtitle,
  sections,
}: {
  title: string;
  subtitle: string;
  sections: GuideSection[];
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        {subtitle}
      </p>
      <div className="mt-5 space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h4 className="font-semibold">{section.title}</h4>
            {section.intro && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {section.intro}
              </p>
            )}
            <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500"
                    aria-hidden
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
