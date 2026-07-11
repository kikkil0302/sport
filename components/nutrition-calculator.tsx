"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ACTIVITY_LABELS,
  ACTIVITY_LEVELS,
  BMI_CATEGORY_LABELS,
  clearStoredProfile,
  getServerStoredProfile,
  getStoredProfile,
  GOAL_LABELS,
  GOALS,
  KCAL_PER_GRAM,
  SEX_LABELS,
  buildAdvice,
  computeNutritionPlan,
  planRequestSchema,
  saveStoredProfile,
  subscribeStoredProfile,
  type NutritionPlan,
} from "@/lib/nutrition";
import { formValue } from "@/lib/forms";

type Field =
  | "sex"
  | "age"
  | "heightCm"
  | "weightKg"
  | "bodyFatPercent"
  | "activityLevel"
  | "goal";
type FieldErrors = Partial<Record<Field, string>>;

const NUMBER_REQUIRED = "Veuillez saisir un nombre valide";

function parseNumber(raw: string): number | undefined {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

export function NutritionCalculator() {
  // Profil mémorisé dans CE navigateur uniquement (jamais envoyé au serveur).
  const stored = useSyncExternalStore(
    subscribeStoredProfile,
    getStoredProfile,
    getServerStoredProfile,
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<{
    plan: NutritionPlan;
    advice: string[];
  } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const rawBodyFat = formValue(formData, "bodyFatPercent");
    const age = parseNumber(formValue(formData, "age"));
    const heightCm = parseNumber(formValue(formData, "heightCm"));
    const weightKg = parseNumber(formValue(formData, "weightKg"));
    const bodyFatPercent = parseNumber(rawBodyFat);

    const missing: FieldErrors = {};
    if (age === undefined) missing.age = NUMBER_REQUIRED;
    if (heightCm === undefined) missing.heightCm = NUMBER_REQUIRED;
    if (weightKg === undefined) missing.weightKg = NUMBER_REQUIRED;
    if (rawBodyFat.trim() !== "" && bodyFatPercent === undefined) {
      missing.bodyFatPercent = NUMBER_REQUIRED;
    }
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
      bodyFatPercent,
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
    setResult({ plan, advice: buildAdvice(plan) });

    saveStoredProfile({
      sex: formValue(formData, "sex"),
      age: formValue(formData, "age"),
      heightCm: formValue(formData, "heightCm"),
      weightKg: formValue(formData, "weightKg"),
      bodyFatPercent: rawBodyFat,
      activityLevel: formValue(formData, "activityLevel"),
      goal: formValue(formData, "goal"),
      restrictions: stored?.restrictions ?? [],
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        key={stored === null ? "empty" : "stored"}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <SelectField
          label="Sexe"
          name="sex"
          defaultValue={stored?.sex ?? "male"}
          options={Object.entries(SEX_LABELS)}
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
        <NumberField
          label="Masse grasse (%) — optionnel"
          name="bodyFatPercent"
          defaultValue={stored?.bodyFatPercent ?? ""}
          error={errors.bodyFatPercent}
          placeholder="Si connue (mesure, balance impédancemètre)"
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
        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Calculer
        </button>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Vos données restent dans votre navigateur : rien n&apos;est envoyé ni
          stocké sur un serveur.
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
      </form>

      <div>
        {result ? (
          <PlanResults plan={result.plan} advice={result.advice} />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Renseignez vos informations puis cliquez sur « Calculer » pour
            obtenir vos besoins caloriques, vos macros, votre IMC et des
            conseils personnalisés.
          </div>
        )}
      </div>
    </div>
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
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
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
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
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

function PlanResults({
  plan,
  advice,
}: {
  plan: NutritionPlan;
  advice: string[];
}) {
  const macroRows = [
    {
      label: "Protéines",
      grams: plan.macros.proteinG,
      kcal: plan.macros.proteinG * KCAL_PER_GRAM.protein,
      color: "bg-emerald-500",
    },
    {
      label: "Glucides",
      grams: plan.macros.carbsG,
      kcal: plan.macros.carbsG * KCAL_PER_GRAM.carbs,
      color: "bg-sky-500",
    },
    {
      label: "Lipides",
      grams: plan.macros.fatG,
      kcal: plan.macros.fatG * KCAL_PER_GRAM.fat,
      color: "bg-amber-500",
    },
  ];
  const totalMacroKcal = macroRows.reduce((sum, row) => sum + row.kcal, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Calories cibles"
          value={`${plan.targetCalories} kcal`}
          highlight
        />
        <StatCard label="Dépense journalière (TDEE)" value={`${plan.tdee} kcal`} />
        <StatCard label="Métabolisme de base (BMR)" value={`${plan.bmr} kcal`} />
        <StatCard
          label="IMC"
          value={`${plan.bmi}`}
          detail={BMI_CATEGORY_LABELS[plan.bmiCategory]}
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 font-semibold">Répartition des macros</h3>
        <div className="space-y-3">
          {macroRows.map(({ label, grams, kcal, color }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{label}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {grams} g · {kcal} kcal
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${(kcal / totalMacroKcal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 font-semibold">Conseils</h3>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {advice.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  highlight = false,
}: {
  label: string;
  value: string;
  detail?: string;
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
      {detail && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{detail}</div>
      )}
    </div>
  );
}
