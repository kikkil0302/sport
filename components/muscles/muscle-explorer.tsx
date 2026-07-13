"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  BACKEND_GROUP,
  GROUP_BY_ID,
  groupsByRegion,
  REGIONS,
} from "@/lib/muscles/groups";
import { addExerciseToNewWorkoutAction } from "@/app/actions/muscles";
import type { Look } from "./body-scene";

const LOOKS: { id: Look; label: string }[] = [
  { id: "realistic", label: "Réaliste" },
  { id: "atlas", label: "Planche d'anatomie" },
  { id: "clair", label: "Épuré clair" },
];

// La scène three.js touche `window` : on la charge côté client uniquement.
const BodyScene = dynamic(
  () => import("./body-scene").then((m) => m.BodyScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
        Chargement du modèle 3D…
      </div>
    ),
  },
);

export function MuscleExplorer({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [look, setLook] = useState<Look>("realistic");

  // Le clic 3D renvoie "" quand on tape dans le vide → désélection.
  // Un clic sur le muscle déjà choisi le désélectionne aussi (bascule).
  function select(group: string) {
    setSelected((cur) => (group === "" || group === cur ? null : group));
  }

  const active = selected ? GROUP_BY_ID[selected] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      {/* Colonne 3D */}
      <div>
        {/* Sélecteur de style de rendu */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LOOKS.map((l) => {
            const on = look === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLook(l.id)}
                aria-pressed={on}
                className={`mono-label rounded-md px-3 py-1.5 text-xs transition-colors ${
                  on
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="relative h-[26rem] overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-zinc-100 sm:h-[32rem] dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <BodyScene selected={selected} look={look} onSelect={select} />
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-xs text-zinc-400">
            Fais tourner le modèle en glissant · clique un muscle
          </p>
        </div>

        {/* Puces cliquables par région — sélection alternative (mobile / a11y) */}
        <div className="mt-4 space-y-3">
          {REGIONS.map((region) => (
            <div key={region}>
              <p className="mono-label mb-1.5 text-[0.7rem] text-zinc-400">{region}</p>
              <div className="flex flex-wrap gap-1.5">
                {groupsByRegion(region).map((g) => {
                  const isOn = selected === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => select(isOn ? "" : g.id)}
                      aria-pressed={isOn}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition-colors ${
                        isOn
                          ? "border-transparent text-white dark:text-zinc-950"
                          : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      }`}
                      style={isOn ? { backgroundColor: g.color } : undefined}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: isOn ? "currentColor" : g.color }}
                      />
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau latéral : exercices du muscle sélectionné */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {active ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-3">
              <span
                className="h-10 w-10 shrink-0 rounded-xl"
                style={{ backgroundColor: active.color }}
                aria-hidden="true"
              />
              <div>
                <h2 className="text-xl font-bold tracking-tight">{active.label}</h2>
                <p className="mono-label text-xs" style={{ color: active.color }}>
                  {active.region} · {active.exercises.length} exercices
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {active.blurb}
            </p>

            <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-900">
              {active.exercises.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 py-2.5 text-sm text-zinc-800 dark:text-zinc-200"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: active.color }}
                  />
                  <span className="flex-1">{name}</span>
                  <AddToWorkoutButton
                    name={name}
                    backendGroup={BACKEND_GROUP[active.id]}
                    isLoggedIn={isLoggedIn}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Sélectionne un muscle
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Clique sur le modèle 3D ou sur une pastille de couleur pour voir
              les exercices qui le travaillent.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

const BTN =
  "shrink-0 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800";

/** Bouton « + Séance » : crée une nouvelle séance avec cet exercice et l'ouvre. */
function AddToWorkoutButton({
  name,
  backendGroup,
  isLoggedIn,
}: {
  name: string;
  backendGroup: string;
  isLoggedIn: boolean;
}) {
  if (!isLoggedIn) {
    return (
      <Link
        href="/connexion"
        title="Connecte-toi pour l'ajouter à une séance"
        className={BTN}
      >
        + Séance
      </Link>
    );
  }
  return (
    <form action={addExerciseToNewWorkoutAction.bind(null, name, backendGroup)}>
      <SubmitAdd />
    </form>
  );
}

function SubmitAdd() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={BTN}>
      {pending ? "Ajout…" : "+ Séance"}
    </button>
  );
}
