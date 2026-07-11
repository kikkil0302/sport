import { describe, expect, it } from "vitest";
import {
  buildDietPlan,
  DIET_RESTRICTIONS,
  FOODS,
  isAllowed,
  type DietRestriction,
} from "./diet";
import type { MacroTargets } from "./types";

const TARGET_CALORIES = 2400;
const TARGET_MACROS: MacroTargets = { proteinG: 150, fatG: 67, carbsG: 300 };

/** Toutes les combinaisons de restrictions (2^4 = 16). */
function allCombos(): DietRestriction[][] {
  const combos: DietRestriction[][] = [];
  for (let mask = 0; mask < 1 << DIET_RESTRICTIONS.length; mask++) {
    combos.push(DIET_RESTRICTIONS.filter((_, i) => mask & (1 << i)));
  }
  return combos;
}

describe("FOODS", () => {
  it("has unique names", () => {
    const names = FOODS.map((food) => food.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("covers every category even under all restrictions combined", () => {
    const categories = ["protein", "carb", "fat", "vegetable", "fruit"] as const;
    for (const category of categories) {
      const allowed = FOODS.filter(
        (food) =>
          food.category === category && isAllowed(food, [...DIET_RESTRICTIONS]),
      );
      expect(allowed.length, category).toBeGreaterThan(0);
    }
  });
});

describe("buildDietPlan", () => {
  it("builds 4 meals with items", () => {
    const plan = buildDietPlan(TARGET_CALORIES, TARGET_MACROS, []);
    expect(plan.meals).toHaveLength(4);
    for (const meal of plan.meals) {
      expect(meal.items.length).toBeGreaterThan(0);
    }
  });

  const VARIANTS = [0, 1, 2, 3];

  it("respects the restrictions for every combination and variant", () => {
    for (const restrictions of allCombos()) {
      for (const variant of VARIANTS) {
        const plan = buildDietPlan(
          TARGET_CALORIES,
          TARGET_MACROS,
          restrictions,
          variant,
        );
        for (const meal of plan.meals) {
          for (const item of meal.items) {
            expect(
              isAllowed(item.food, restrictions),
              `${restrictions.join("+") || "aucune"} v${variant} → ${item.food.name}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("lands close to the macro targets for every combination and variant", () => {
    for (const restrictions of allCombos()) {
      for (const variant of VARIANTS) {
        const plan = buildDietPlan(
          TARGET_CALORIES,
          TARGET_MACROS,
          restrictions,
          variant,
        );
        const label = `${restrictions.join("+") || "aucune"} v${variant}`;
        // Protéines : priorité absolue, ±15 %.
        expect(
          Math.abs(plan.totals.proteinG - TARGET_MACROS.proteinG),
          `protéines (${label})`,
        ).toBeLessThanOrEqual(TARGET_MACROS.proteinG * 0.15);
        // Calories totales : ±15 % de la cible.
        expect(
          Math.abs(plan.totals.kcal - TARGET_CALORIES),
          `kcal (${label})`,
        ).toBeLessThanOrEqual(TARGET_CALORIES * 0.15);
      }
    }
  });

  it("keeps portion sizes realistic", () => {
    for (const restrictions of allCombos()) {
      for (const variant of VARIANTS) {
        const plan = buildDietPlan(
          TARGET_CALORIES,
          TARGET_MACROS,
          restrictions,
          variant,
        );
        for (const meal of plan.meals) {
          for (const item of meal.items) {
            expect(item.grams, item.food.name).toBeGreaterThanOrEqual(5);
            expect(item.grams, item.food.name).toBeLessThanOrEqual(400);
          }
        }
      }
    }
  });

  it("changes at least one food between variants", () => {
    const foodsOf = (variant: number) =>
      buildDietPlan(TARGET_CALORIES, TARGET_MACROS, [], variant)
        .meals.flatMap((meal) => meal.items.map((item) => item.food.name))
        .join("|");
    expect(foodsOf(1)).not.toBe(foodsOf(0));
  });

  it("exposes the daily targets for display", () => {
    const plan = buildDietPlan(TARGET_CALORIES, TARGET_MACROS, []);
    expect(plan.targets).toEqual({
      kcal: 2400,
      proteinG: 150,
      carbsG: 300,
      fatG: 67,
    });
  });
});
