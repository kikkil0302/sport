"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ACTIVITY_LABELS,
  ACTIVITY_LEVELS,
  buildShoppingList,
  buildWeeklyPlan,
  CATEGORY_LABELS,
  clearStoredProfile,
  computeNutritionPlan,
  DIET_RESTRICTIONS,
  formatQuantity,
  getServerStoredProfile,
  getStoredProfile,
  GOAL_LABELS,
  GOALS,
  planRequestSchema,
  RESTRICTION_LABELS,
  saveStoredProfile,
  subscribeStoredProfile,
  type DayPlan,
  type DietRestriction,
  type FoodCategory,
  type NutritionPlan,
  type ShoppingItem,
  type WeeklyPlan,
} from "@/lib/nutrition";
import { formValue } from "@/lib/forms";

type Field = "sex" | "age" | "heightCm" | "weightKg" | "activityLevel" | "goal";
type FieldErrors = Partial<Record<Field, string>>;

const NUMBER_REQUIRED = "Veuillez saisir un nombre valide";

function parseNumber(raw: string): number | undefined {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

export function DietPlanner() {
  // Profil mémorisé dans CE navigateur uniquement (jamais envoyé au serveur).
  const stored = useSyncExternalStore(
    subscribeStoredProfile,
    getStoredProfile,
    getServerStoredProfile,
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [variant, setVariant] = useState(0);
  const [day, setDay] = useState(0);
  const [result, setResult] = useState<{
    plan: NutritionPlan;
    restrictions: DietRestriction[];
  } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const age = parseNumber(formValue(formData, "age"));
    const heightCm = parseNumber(formValue(formData, "heightCm"));
    const weightKg = parseNumber(formValue(formData, "weightKg"));
    const restrictions = DIET_RESTRICTIONS.filter(
      (restriction) => formData.get(`restriction-${restriction}`) === "on",
    );

    const missing: FieldErrors = {};
    if (age === undefined) missing.age = NUMBER_REQUIRED;
    if (heightCm === undefined) missing.heightCm = NUMBER_REQUIRED;
    if (weightKg === undefined) missing.weightKg = NUMBER_REQUIRED;
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      setResult(null);
      return;
    }

    const parsed = planRequestSchema.safeParse({
      sex: formValue(formData, "sex"),
      age,
      heightCm,
      weightKg,
      activityLevel: formValue(formData, "activityLevel"),
      goal: formValue(formData, "goal"),
    });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field | undefined;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setResult(null);
      return;
    }

    const { activityLevel, goal, ...profile } = parsed.data;
    const plan = computeNutritionPlan(profile, activityLevel, goal);
    setErrors({});
    setVariant(0);
    setDay(0);
    setResult({ plan, restrictions });

    saveStoredProfile({
      sex: formValue(formData, "sex"),
      age: formValue(formData, "age"),
      heightCm: formValue(formData, "heightCm"),
      weightKg: formValue(formData, "weightKg"),
      bodyFatPercent: stored?.bodyFatPercent,
      activityLevel: formValue(formData, "activityLevel"),
      goal: formValue(formData, "goal"),
      restrictions,
    });
  }

  const week = result
    ? buildWeeklyPlan(
        result.plan.targetCalories,
        result.plan.macros,
        result.restrictions,
        variant,
      )
    : null;
  const shopping = week ? buildShoppingList(week) : null;

  return (
    <div className="space-y-8">
      <form
        key={stored === null ? "empty" : "stored"}
        onSubmit={handleSubmit}
        className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Sexe"
            name="sex"
            defaultValue={stored?.sex ?? "male"}
            options={[
              ["male", "Homme"],
              ["female", "Femme"],
            ]}
          />
          <NumberField
            label="Âge (années)"
            name="age"
            defaultValue={stored?.age ?? ""}
            error={errors.age}
            placeholder="30"
          />
          <NumberField
            label="Taille (cm)"
            name="heightCm"
            defaultValue={stored?.heightCm ?? ""}
            error={errors.heightCm}
            placeholder="175"
          />
          <NumberField
            label="Poids (kg)"
            name="weightKg"
            defaultValue={stored?.weightKg ?? ""}
            error={errors.weightKg}
            placeholder="75"
          />
          <SelectField
            label="Niveau d'activité"
            name="activityLevel"
            defaultValue={stored?.activityLevel ?? "moderate"}
            options={ACTIVITY_LEVELS.map((level) => [
              level,
              ACTIVITY_LABELS[level],
            ])}
          />
          <SelectField
            label="Objectif"
            name="goal"
            defaultValue={stored?.goal ?? "maintain"}
            options={GOALS.map((goal) => [goal, GOAL_LABELS[goal]])}
          />
        </div>

        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium">
            Restrictions alimentaires
          </legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {DIET_RESTRICTIONS.map((restriction) => (
              <label
                key={restriction}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  name={`restriction-${restriction}`}
                  defaultChecked={stored?.restrictions?.includes(restriction) ?? false}
                  className="h-4 w-4 accent-emerald-600"
                />
                {RESTRICTION_LABELS[restriction]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="h-11 rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Générer ma semaine
          </button>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Profil mémorisé dans votre navigateur uniquement — rien n&apos;est
            envoyé ni stocké sur un serveur.
            {stored !== null && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={clearStoredProfile}
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Effacer mes infos
                </button>
              </>
            )}
          </p>
        </div>
      </form>

      {result && week && shopping && (
        <DietResults
          plan={result.plan}
          week={week}
          shopping={shopping}
          day={day}
          onSelectDay={setDay}
          onOtherProposal={() => setVariant((current) => current + 1)}
        />
      )}
    </div>
  );
}

function DietResults({
  plan,
  week,
  shopping,
  day,
  onSelectDay,
  onOtherProposal,
}: {
  plan: NutritionPlan;
  week: WeeklyPlan;
  shopping: ShoppingItem[];
  day: number;
  onSelectDay: (day: number) => void;
  onOtherProposal: () => void;
}) {
  const delta = plan.targetCalories - plan.tdee;
  const deltaLabel =
    plan.goal === "lose"
      ? `Déficit d'environ ${Math.abs(delta)} kcal/jour sous votre dépense`
      : plan.goal === "gain"
        ? `Surplus d'environ ${delta} kcal/jour au-dessus de votre dépense`
        : "Apport à votre niveau de dépense (maintien)";

  const current = week[day];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Calories / jour"
          value={`${plan.targetCalories} kcal`}
          highlight
        />
        <StatCard label="Protéines / jour" value={`${plan.macros.proteinG} g`} />
        <StatCard label="Glucides / jour" value={`${plan.macros.carbsG} g`} />
        <StatCard label="Lipides / jour" value={`${plan.macros.fatG} g`} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{deltaLabel}.</p>
        <button
          type="button"
          onClick={onOtherProposal}
          className="h-11 rounded-lg border border-zinc-300 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          🔄 Autre semaine
        </button>
      </div>

      {/* Onglets des jours */}
      <div className="flex flex-wrap gap-1.5">
        {week.map((d) => {
          const on = d.weekday === day;
          return (
            <button
              key={d.weekday}
              type="button"
              onClick={() => onSelectDay(d.weekday)}
              aria-pressed={on}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                on
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <span className="sm:hidden">{d.label.slice(0, 3)}</span>
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Repas du jour sélectionné */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">{current.label}</h3>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {current.plan.totals.kcal} kcal · P {current.plan.totals.proteinG} g ·
            G {current.plan.totals.carbsG} g · L {current.plan.totals.fatG} g
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {current.plan.meals.map((meal) => (
            <MealCard key={meal.name} meal={meal} />
          ))}
        </div>
      </div>

      <ShoppingList items={shopping} />

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Semaine d&apos;exemple générée à partir d&apos;aliments courants —
        échangez librement un aliment contre un équivalent de la même famille et
        ajustez les quantités à ±10 %. Estimations indicatives, ne remplace pas
        un avis médical ou diététique.
      </p>
    </div>
  );
}

function MealCard({ meal }: { meal: DayPlan["plan"]["meals"][number] }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-semibold">
          <span className="mr-1.5" aria-hidden>
            {meal.emoji}
          </span>
          {meal.name}
        </h4>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {meal.totals.kcal} kcal
        </span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {meal.items.map((item) => (
          <li
            key={item.food.name}
            className="flex items-baseline justify-between gap-3"
          >
            <span>
              <span className="mr-1.5" aria-hidden>
                {item.food.emoji}
              </span>
              {item.food.name}{" "}
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.grams} g
              </span>
            </span>
            <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
              P {item.proteinG} · G {item.carbsG} · L {item.fatG}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ShoppingList({ items }: { items: ShoppingItem[] }) {
  const categories = Object.keys(CATEGORY_LABELS) as FoodCategory[];
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="flex items-baseline gap-2 font-semibold">
        <span aria-hidden>🛒</span> Liste de courses
        <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
          semaine complète
        </span>
      </h3>
      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {categories.map((category) => {
          const catItems = items.filter((item) => item.food.category === category);
          if (catItems.length === 0) return null;
          return (
            <div key={category}>
              <p className="mb-2 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                {CATEGORY_LABELS[category]}
              </p>
              <ul className="space-y-1.5 text-sm">
                {catItems.map((item) => (
                  <li
                    key={item.food.name}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span>
                      <span className="mr-1.5" aria-hidden>
                        {item.food.emoji}
                      </span>
                      {item.food.name}
                    </span>
                    <span className="shrink-0 font-medium text-zinc-600 dark:text-zinc-300">
                      {formatQuantity(item.grams)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function NumberField({
  label,
  name,
  defaultValue,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: readonly (readonly [string, string])[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
