import { KCAL_PER_GRAM } from "./macros";
import type { MacroTargets } from "./types";

// Régime alimentaire d'exemple : génère une journée type qui vise les macros
// calculées, en respectant les restrictions choisies. 100 % côté client.

export const DIET_RESTRICTIONS = [
  "vegetarian",
  "vegan",
  "glutenFree",
  "lactoseFree",
] as const;
export type DietRestriction = (typeof DIET_RESTRICTIONS)[number];

export const RESTRICTION_LABELS: Record<DietRestriction, string> = {
  vegetarian: "Végétarien",
  vegan: "Végétalien (vegan)",
  glutenFree: "Sans gluten",
  lactoseFree: "Sans lactose",
};

export type FoodCategory = "protein" | "carb" | "fat" | "vegetable" | "fruit";

export interface Food {
  name: string;
  emoji: string;
  category: FoodCategory;
  /** Valeurs nutritionnelles pour 100 g (aliment prêt à consommer). */
  per100: { kcal: number; proteinG: number; carbsG: number; fatG: number };
  suitableFor: Record<DietRestriction, boolean>;
}

const ALL = {
  vegetarian: true,
  vegan: true,
  glutenFree: true,
  lactoseFree: true,
} as const;

function food(
  name: string,
  emoji: string,
  category: FoodCategory,
  [kcal, proteinG, carbsG, fatG]: [number, number, number, number],
  suitableFor: Partial<Record<DietRestriction, boolean>> = {},
): Food {
  return {
    name,
    emoji,
    category,
    per100: { kcal, proteinG, carbsG, fatG },
    suitableFor: { ...ALL, ...suitableFor },
  };
}

/** Base d'aliments courants (valeurs indicatives pour 100 g). */
export const FOODS: Food[] = [
  // Sources de protéines
  food("Blanc de poulet", "🍗", "protein", [165, 31, 0, 3.6], { vegetarian: false, vegan: false }),
  food("Steak haché 5 %", "🥩", "protein", [129, 21, 0, 5], { vegetarian: false, vegan: false }),
  food("Saumon", "🐟", "protein", [208, 20, 0, 13], { vegetarian: false, vegan: false }),
  food("Thon au naturel", "🐟", "protein", [116, 26, 0, 1], { vegetarian: false, vegan: false }),
  food("Œufs", "🥚", "protein", [143, 12.5, 1, 10], { vegan: false }),
  food("Skyr nature", "🥛", "protein", [63, 11, 4, 0.2], { vegan: false, lactoseFree: false }),
  food("Yaourt de soja nature", "🥛", "protein", [50, 4, 2.5, 2.5]),
  food("Tofu ferme", "🌱", "protein", [125, 13, 2, 7]),
  food("Seitan", "🌾", "protein", [141, 25, 4, 2], { glutenFree: false }),
  food("Lentilles cuites", "🫘", "protein", [116, 9, 20, 0.4]),
  // Sources de glucides
  food("Flocons d'avoine", "🥣", "carb", [379, 13, 67, 7], { glutenFree: false }),
  food("Pain complet", "🍞", "carb", [247, 9, 41, 3.5], { glutenFree: false }),
  food("Riz blanc cuit", "🍚", "carb", [130, 2.7, 28, 0.3]),
  food("Quinoa cuit", "🌾", "carb", [120, 4.4, 21, 1.9]),
  food("Pâtes cuites", "🍝", "carb", [131, 5, 25, 1], { glutenFree: false }),
  food("Patate douce", "🍠", "carb", [86, 1.6, 20, 0.1]),
  food("Pommes de terre", "🥔", "carb", [87, 2, 20, 0.1]),
  // Sources de lipides
  food("Huile d'olive", "🫒", "fat", [900, 0, 0, 100]),
  food("Avocat", "🥑", "fat", [160, 2, 9, 15]),
  food("Amandes", "🌰", "fat", [579, 21, 22, 50]),
  food("Beurre de cacahuète", "🥜", "fat", [588, 25, 20, 50]),
  // Légumes & fruits
  food("Brocoli", "🥦", "vegetable", [34, 2.8, 7, 0.4]),
  food("Haricots verts", "🫛", "vegetable", [31, 1.8, 7, 0.2]),
  food("Épinards", "🥬", "vegetable", [23, 2.9, 3.6, 0.4]),
  food("Banane", "🍌", "fruit", [89, 1.1, 23, 0.3]),
  food("Pomme", "🍎", "fruit", [52, 0.3, 14, 0.2]),
  food("Fruits rouges", "🫐", "fruit", [45, 1, 10, 0.3]),
];

export function isAllowed(food: Food, restrictions: DietRestriction[]): boolean {
  return restrictions.every((restriction) => food.suitableFor[restriction]);
}

export interface MealItem {
  food: Food;
  grams: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface MacroTotals {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Meal {
  name: string;
  emoji: string;
  items: MealItem[];
  totals: MacroTotals;
}

export interface DietPlan {
  meals: Meal[];
  totals: MacroTotals;
  /** Cibles journalières que le plan cherche à atteindre. */
  targets: MacroTotals;
}

interface Slot {
  category: FoodCategory;
  /** Noms préférés, essayés dans l'ordre avant le premier autorisé de la catégorie. */
  preferred: string[];
  /** Portion fixe en grammes (légumes/fruits) ; sinon calculée sur les macros. */
  fixedGrams?: number;
}

interface MealSpec {
  name: string;
  emoji: string;
  /** Part des macros journalières visée par ce repas. */
  share: number;
  slots: Slot[];
}

const MEAL_SPECS: MealSpec[] = [
  {
    name: "Petit-déjeuner",
    emoji: "☕",
    share: 0.25,
    slots: [
      { category: "protein", preferred: ["Skyr nature", "Œufs", "Yaourt de soja nature", "Tofu ferme"] },
      { category: "fruit", preferred: ["Banane"], fixedGrams: 120 },
      { category: "carb", preferred: ["Flocons d'avoine", "Pain complet", "Riz blanc cuit", "Quinoa cuit"] },
      { category: "fat", preferred: ["Amandes", "Beurre de cacahuète"] },
    ],
  },
  {
    name: "Déjeuner",
    emoji: "🍽️",
    share: 0.35,
    slots: [
      { category: "protein", preferred: ["Blanc de poulet", "Steak haché 5 %", "Seitan", "Tofu ferme", "Lentilles cuites"] },
      { category: "vegetable", preferred: ["Brocoli", "Haricots verts"], fixedGrams: 200 },
      { category: "carb", preferred: ["Riz blanc cuit", "Pâtes cuites", "Quinoa cuit"] },
      { category: "fat", preferred: ["Huile d'olive"] },
    ],
  },
  {
    name: "Collation",
    emoji: "🍎",
    share: 0.1,
    slots: [
      { category: "protein", preferred: ["Skyr nature", "Yaourt de soja nature"] },
      { category: "fruit", preferred: ["Pomme", "Fruits rouges"], fixedGrams: 120 },
      { category: "fat", preferred: ["Amandes"] },
    ],
  },
  {
    name: "Dîner",
    emoji: "🌙",
    share: 0.3,
    slots: [
      { category: "protein", preferred: ["Saumon", "Thon au naturel", "Œufs", "Tofu ferme", "Lentilles cuites"] },
      { category: "vegetable", preferred: ["Épinards", "Haricots verts", "Brocoli"], fixedGrams: 200 },
      { category: "carb", preferred: ["Patate douce", "Pommes de terre", "Riz blanc cuit"] },
      { category: "fat", preferred: ["Huile d'olive", "Avocat"] },
    ],
  },
];

/** Densité protéique minimale d'une source de protéines calculée (g/100 g). */
const MIN_PROTEIN_DENSITY = 8;

/**
 * Choisit l'aliment d'un slot : les préférés d'abord, puis le reste de la
 * catégorie ; `variant` fait tourner la liste (« autre proposition »).
 */
function pickFood(
  slot: Slot,
  restrictions: DietRestriction[],
  variant: number,
): Food | null {
  const allowed = FOODS.filter(
    (candidate) =>
      candidate.category === slot.category &&
      isAllowed(candidate, restrictions) &&
      // Une source de protéines à doser doit être assez dense pour atteindre
      // la cible sans portion absurde (écarte p. ex. le yaourt de soja seul).
      (slot.category !== "protein" ||
        slot.fixedGrams !== undefined ||
        candidate.per100.proteinG >= MIN_PROTEIN_DENSITY),
  );
  if (allowed.length === 0) return null;

  const preferred = slot.preferred
    .map((name) => allowed.find((candidate) => candidate.name === name))
    .filter((candidate): candidate is Food => candidate !== undefined);
  const rest = allowed.filter((candidate) => !preferred.includes(candidate));
  const ordered = [...preferred, ...rest];
  return ordered[variant % ordered.length];
}

function roundGrams(grams: number): number {
  return Math.round(grams / 5) * 5;
}

function itemFor(food: Food, grams: number): MealItem {
  const ratio = grams / 100;
  return {
    food,
    grams,
    kcal: Math.round(food.per100.kcal * ratio),
    proteinG: Math.round(food.per100.proteinG * ratio),
    carbsG: Math.round(food.per100.carbsG * ratio),
    fatG: Math.round(food.per100.fatG * ratio),
  };
}

function sumTotals(items: MealItem[]): MacroTotals {
  return items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      proteinG: acc.proteinG + item.proteinG,
      carbsG: acc.carbsG + item.carbsG,
      fatG: acc.fatG + item.fatG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

/** Portion maximale par aliment calculé (garde des quantités réalistes). */
const MAX_GRAMS: Partial<Record<FoodCategory, number>> = {
  protein: 350,
  carb: 400,
  fat: 80,
};

/**
 * Construit une journée type approchant les cibles macros, dans l'ordre :
 * protéines d'abord, puis les glucides et lipides complètent ce qui manque.
 * `variant` fait tourner les aliments (0 = proposition par défaut).
 */
export function buildDietPlan(
  calories: number,
  macros: MacroTargets,
  restrictions: DietRestriction[],
  variant = 0,
): DietPlan {
  const macroKey = {
    protein: "proteinG",
    carb: "carbsG",
    fat: "fatG",
  } as const;

  const meals: Meal[] = MEAL_SPECS.map((spec) => {
    const target = {
      proteinG: macros.proteinG * spec.share,
      carbsG: macros.carbsG * spec.share,
      fatG: macros.fatG * spec.share,
    };

    // Chaque slot présent, avec ses grammes (fixes ou à résoudre).
    const entries = spec.slots.flatMap((slot) => {
      const chosen = pickFood(slot, restrictions, variant);
      if (!chosen) return [];
      return [{ slot, food: chosen, grams: slot.fixedGrams ?? 0 }];
    });

    const contribution = (
      entry: (typeof entries)[number],
      key: (typeof macroKey)[keyof typeof macroKey],
    ) => (entry.food.per100[key] * entry.grams) / 100;

    // Résolution itérative : chaque source est dimensionnée sur ce qui reste
    // de son macro une fois déduits les apports de TOUS les autres aliments
    // (les flocons apportent des protéines, le poulet des lipides, etc.).
    for (let pass = 0; pass < 3; pass++) {
      for (const entry of entries) {
        const { slot, food } = entry;
        if (slot.fixedGrams !== undefined) continue;
        const key = macroKey[slot.category as "protein" | "carb" | "fat"];
        const fromOthers = entries
          .filter((other) => other !== entry)
          .reduce((sum, other) => sum + contribution(other, key), 0);
        const remaining = Math.max(0, target[key] - fromOthers);
        const grams = (remaining / food.per100[key]) * 100;
        entry.grams = Math.min(grams, MAX_GRAMS[slot.category] ?? 400);
      }
    }

    const items = entries
      .map(({ food, grams }) => itemFor(food, roundGrams(grams)))
      .filter((item) => item.grams >= 5);

    return { name: spec.name, emoji: spec.emoji, items, totals: sumTotals(items) };
  });

  const totals = sumTotals(meals.flatMap((meal) => meal.items));
  return {
    meals,
    totals,
    targets: {
      kcal: calories,
      proteinG: macros.proteinG,
      carbsG: macros.carbsG,
      fatG: macros.fatG,
    },
  };
}

/** kcal théoriques des cibles macros (sert de garde-fou dans les tests). */
export function macroKcal(macros: MacroTargets): number {
  return (
    macros.proteinG * KCAL_PER_GRAM.protein +
    macros.carbsG * KCAL_PER_GRAM.carbs +
    macros.fatG * KCAL_PER_GRAM.fat
  );
}
