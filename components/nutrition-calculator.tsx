"use client";

import { useState } from "react";
import {
  ACTIVITY_LABELS,
  ACTIVITY_LEVELS,
  BMI_CATEGORY_LABELS,
  GOAL_LABELS,
  GOALS,
  KCAL_PER_GRAM,
  SEX_LABELS,
  buildAdvice,
  computeNutritionPlan,
  planRequestSchema,
  type NutritionPlan,
} from "@/lib/nutrition";

interface FormState {
  sex: string;
  age: string;
  heightCm: string;
  weightKg: string;
  bodyFatPercent: string;
  activityLevel: string;
  goal: string;
}

const INITIAL_FORM: FormState = {
  sex: "male",
  age: "",
  heightCm: "",
  weightKg: "",
  bodyFatPercent: "",
  activityLevel: "moderate",
  goal: "maintain",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const NUMBER_REQUIRED = "Veuillez saisir un nombre valide";

function parseNumber(raw: string): number | undefined {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

export function NutritionCalculator() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<{
    plan: NutritionPlan;
    advice: string[];
  } | null>(null);

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const age = parseNumber(form.age);
    const heightCm = parseNumber(form.heightCm);
    const weightKg = parseNumber(form.weightKg);
    const bodyFatPercent = parseNumber(form.bodyFatPercent);

    const missing: FieldErrors = {};
    if (age === undefined) missing.age = NUMBER_REQUIRED;
    if (heightCm === undefined) missing.heightCm = NUMBER_REQUIRED;
    if (weightKg === undefined) missing.weightKg = NUMBER_REQUIRED;
    if (form.bodyFatPercent.trim() !== "" && bodyFatPercent === undefined) {
      missing.bodyFatPercent = NUMBER_REQUIRED;
    }
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      setResult(null);
      return;
    }

    const parsed = planRequestSchema.safeParse({
      sex: form.sex,
      age,
      heightCm,
      weightKg,
      bodyFatPercent,
      activityLevel: form.activityLevel,
      goal: form.goal,
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormState | undefined;
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
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="Sexe"
          value={form.sex}
          onChange={setField("sex")}
          options={Object.entries(SEX_LABELS)}
        />
        <NumberField
          label="Âge (années)"
          value={form.age}
          onChange={setField("age")}
          error={errors.age}
          placeholder="30"
        />
        <NumberField
          label="Taille (cm)"
          value={form.heightCm}
          onChange={setField("heightCm")}
          error={errors.heightCm}
          placeholder="175"
        />
        <NumberField
          label="Poids (kg)"
          value={form.weightKg}
          onChange={setField("weightKg")}
          error={errors.weightKg}
          placeholder="75"
        />
        <NumberField
          label="Masse grasse (%) — optionnel"
          value={form.bodyFatPercent}
          onChange={setField("bodyFatPercent")}
          error={errors.bodyFatPercent}
          placeholder="Si connue (mesure, balance impédancemètre)"
        />
        <SelectField
          label="Niveau d'activité"
          value={form.activityLevel}
          onChange={setField("activityLevel")}
          options={ACTIVITY_LEVELS.map((level) => [
            level,
            ACTIVITY_LABELS[level],
          ])}
        />
        <SelectField
          label="Objectif"
          value={form.goal}
          onChange={setField("goal")}
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
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900 dark:focus:border-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900 dark:focus:border-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
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
