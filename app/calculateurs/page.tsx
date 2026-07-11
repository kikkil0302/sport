import type { Metadata } from "next";
import Link from "next/link";
import { NutritionCalculator } from "@/components/nutrition-calculator";

const title = "Calculateurs de calories, macros et IMC";
const description =
  "Calculez gratuitement vos besoins caloriques (BMR, TDEE), la répartition de vos macros et votre IMC selon votre profil et votre objectif. Formules Mifflin-St Jeor, Katch-McArdle et classification OMS. Calcul 100 % dans votre navigateur.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculateurs" },
  openGraph: {
    title: `${title} — Trakmetrik`,
    description,
    url: "/calculateurs",
    type: "website",
  },
};

export default function CalculateursPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Calculateurs nutrition
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Besoins caloriques (Mifflin-St Jeor, ou Katch-McArdle si vous
        connaissez votre masse grasse), répartition des macronutriments et IMC
        selon la classification OMS. Pour transformer ces chiffres en repas
        concrets, direction le{" "}
        <Link
          href="/nutrition"
          className="text-emerald-600 underline dark:text-emerald-400"
        >
          plan alimentaire personnalisé
        </Link>
        .
      </p>
      <div className="mt-10">
        <NutritionCalculator />
      </div>
    </div>
  );
}
