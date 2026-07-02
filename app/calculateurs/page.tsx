import type { Metadata } from "next";
import { NutritionCalculator } from "@/components/nutrition-calculator";

export const metadata: Metadata = {
  title: "Calculateurs — FitPilot",
  description:
    "Calculez vos besoins caloriques, vos macros et votre IMC selon votre profil et votre objectif.",
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
        selon la classification OMS.
      </p>
      <div className="mt-10">
        <NutritionCalculator />
      </div>
    </div>
  );
}
