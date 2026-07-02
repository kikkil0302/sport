import type { NutritionPlan } from "./types";

/**
 * Professional guidance derived from the computed plan.
 * Returned strings are user-facing French copy.
 */
export function buildAdvice(plan: NutritionPlan): string[] {
  const advice: string[] = [];

  if (plan.targetCalories < plan.bmr) {
    advice.push(
      "Votre cible calorique est sous votre métabolisme de base : ne descendez pas plus bas et privilégiez une perte progressive (0,5 à 1 % du poids par semaine).",
    );
  }

  switch (plan.bmiCategory) {
    case "underweight":
      advice.push(
        "Votre IMC indique une insuffisance pondérale : un léger surplus calorique et un entraînement de force sont recommandés. Consultez un professionnel de santé si la perte de poids n'est pas volontaire.",
      );
      break;
    case "overweight":
    case "obese1":
    case "obese2":
    case "obese3":
      advice.push(
        "Un déficit calorique modéré combiné à de la marche quotidienne et 2 à 3 séances de renforcement par semaine donne les meilleurs résultats durables.",
      );
      break;
    default:
      break;
  }

  switch (plan.goal) {
    case "lose":
      advice.push(
        "En sèche, maintenez un apport protéiné élevé et un entraînement de force pour préserver votre masse musculaire.",
      );
      break;
    case "gain":
      advice.push(
        "En prise de masse, visez +0,25 à 0,5 % de poids par semaine : au-delà, le surplus se stocke surtout en gras.",
      );
      break;
    case "maintain":
      advice.push(
        "En maintien, pesez-vous 2 à 3 fois par semaine à jeun et ajustez de ±100 kcal si la tendance dévie sur 2 semaines.",
      );
      break;
  }

  advice.push(
    `Répartissez vos ${plan.macros.proteinG} g de protéines sur 3 à 5 repas (20 à 40 g par repas) pour optimiser la synthèse musculaire.`,
    "Hydratez-vous : environ 35 ml d'eau par kg de poids corporel par jour, davantage les jours d'entraînement.",
    "Dormez 7 à 9 h par nuit : le sommeil conditionne la récupération, la faim et la performance.",
  );

  return advice;
}
