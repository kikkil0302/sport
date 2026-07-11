"use client";

import { useActionState, useState } from "react";
import {
  createProgramFromTemplateAction,
  type ProgramFormState,
} from "@/app/actions/programs";
import { MuscleBadge } from "@/components/muscle-icon";
import {
  getProgramTemplate,
  PROGRAM_TEMPLATES,
  templateSetCount,
} from "@/lib/programs/templates";

const INITIAL_STATE: ProgramFormState = {};

/** Groupe musculaire de l'icône par modèle (splits → haltère générique). */
const TEMPLATE_ICON_GROUP: Record<string, string> = {
  jambes: "Jambes",
  pectoraux: "Pectoraux",
  dos: "Dos",
  epaules: "Épaules",
  bras: "Biceps",
  abdominaux: "Abdominaux",
};

export function TemplatePicker() {
  const [state, formAction, pending] = useActionState(
    createProgramFromTemplateAction,
    INITIAL_STATE,
  );
  const [templateId, setTemplateId] = useState(PROGRAM_TEMPLATES[0].id);
  const selected = getProgramTemplate(templateId);

  return (
    <form action={formAction}>
      <input type="hidden" name="templateId" value={templateId} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PROGRAM_TEMPLATES.map((template) => {
          const active = template.id === templateId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => setTemplateId(template.id)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
                active
                  ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950"
                  : "border-zinc-200 bg-white hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
              }`}
            >
              <MuscleBadge
                group={TEMPLATE_ICON_GROUP[template.id] ?? ""}
                size="lg"
              />
              <span className="text-sm font-semibold">{template.name}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {templateSetCount(template)} séries
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {selected.description}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
            {selected.exercises.map(({ exercise, sets, reps }) => (
              <li key={exercise}>
                <span className="font-medium">{exercise}</span>{" "}
                <span className="text-zinc-500 dark:text-zinc-400">
                  {sets} × {reps}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="submit"
            disabled={pending}
            className="mt-4 h-11 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending ? "Génération…" : `Générer « ${selected.name} »`}
          </button>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Les charges sont à renseigner pendant vos séances, selon votre
            niveau. Le programme reste modifiable.
          </p>
        </div>
      )}

      {state.error && (
        <p className="mt-3 text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}
