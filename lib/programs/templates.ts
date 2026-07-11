/**
 * Ready-made program templates built from the backend's built-in exercise
 * catalog. Exercise names MUST match the catalog exactly (seeded by the
 * backend's Flyway V2 migration) — enforced by templates.test.ts.
 */

/** Built-in catalog (name → muscle group), mirrored from the backend seed. */
export const CATALOG_EXERCISES: Record<string, string> = {
  Squat: "Jambes",
  "Presse à cuisses": "Jambes",
  Fentes: "Jambes",
  "Leg curl": "Jambes",
  "Mollets debout": "Jambes",
  "Soulevé de terre": "Dos",
  "Rowing barre": "Dos",
  Tractions: "Dos",
  "Tirage vertical": "Dos",
  "Développé couché": "Pectoraux",
  "Développé incliné haltères": "Pectoraux",
  Pompes: "Pectoraux",
  "Écarté couché": "Pectoraux",
  "Développé militaire": "Épaules",
  "Élévations latérales": "Épaules",
  "Oiseau (élévations buste penché)": "Épaules",
  "Curl biceps": "Biceps",
  "Curl marteau": "Biceps",
  Dips: "Triceps",
  "Extensions triceps poulie": "Triceps",
  Crunch: "Abdominaux",
  "Relevés de jambes": "Abdominaux",
};

export interface TemplateExercise {
  /** Exact built-in catalog name. */
  exercise: string;
  /** Number of working sets. */
  sets: number;
  /** Target reps per set. */
  reps: number;
}

export type TemplateCategory = "split" | "muscle";

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  exercises: TemplateExercise[];
}

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  // Splits
  {
    id: "full-body",
    name: "Full body",
    description:
      "Tout le corps en une séance, 2 à 3 fois par semaine — idéal pour débuter. Charges à ajuster selon votre niveau.",
    category: "split",
    exercises: [
      { exercise: "Squat", sets: 3, reps: 8 },
      { exercise: "Développé couché", sets: 3, reps: 8 },
      { exercise: "Rowing barre", sets: 3, reps: 8 },
      { exercise: "Développé militaire", sets: 2, reps: 10 },
      { exercise: "Crunch", sets: 3, reps: 15 },
    ],
  },
  {
    id: "haut-du-corps",
    name: "Haut du corps",
    description:
      "Séance haut du corps complète (split Haut/Bas) : poussée, tirage et bras.",
    category: "split",
    exercises: [
      { exercise: "Développé couché", sets: 4, reps: 8 },
      { exercise: "Rowing barre", sets: 4, reps: 8 },
      { exercise: "Développé militaire", sets: 3, reps: 10 },
      { exercise: "Tirage vertical", sets: 3, reps: 10 },
      { exercise: "Curl biceps", sets: 3, reps: 12 },
      { exercise: "Extensions triceps poulie", sets: 3, reps: 12 },
    ],
  },
  {
    id: "push",
    name: "Push (poussée)",
    description:
      "Séance PPL de poussée : pectoraux, épaules et triceps.",
    category: "split",
    exercises: [
      { exercise: "Développé couché", sets: 4, reps: 8 },
      { exercise: "Développé incliné haltères", sets: 3, reps: 10 },
      { exercise: "Développé militaire", sets: 3, reps: 10 },
      { exercise: "Élévations latérales", sets: 3, reps: 15 },
      { exercise: "Extensions triceps poulie", sets: 3, reps: 12 },
    ],
  },
  {
    id: "pull",
    name: "Pull (tirage)",
    description:
      "Séance PPL de tirage : dos, arrière d'épaules et biceps.",
    category: "split",
    exercises: [
      { exercise: "Soulevé de terre", sets: 3, reps: 5 },
      { exercise: "Tractions", sets: 4, reps: 8 },
      { exercise: "Rowing barre", sets: 3, reps: 10 },
      { exercise: "Oiseau (élévations buste penché)", sets: 3, reps: 15 },
      { exercise: "Curl biceps", sets: 3, reps: 12 },
    ],
  },
  // Muscle focus
  {
    id: "jambes",
    name: "Jambes",
    description:
      "Séance bas du corps complète : quadriceps, ischio-jambiers et mollets.",
    category: "muscle",
    exercises: [
      { exercise: "Squat", sets: 4, reps: 8 },
      { exercise: "Presse à cuisses", sets: 3, reps: 10 },
      { exercise: "Fentes", sets: 3, reps: 12 },
      { exercise: "Leg curl", sets: 3, reps: 12 },
      { exercise: "Mollets debout", sets: 4, reps: 15 },
    ],
  },
  {
    id: "pectoraux",
    name: "Pectoraux",
    description:
      "Focus pectoraux : développés, écartés et poids du corps.",
    category: "muscle",
    exercises: [
      { exercise: "Développé couché", sets: 4, reps: 8 },
      { exercise: "Développé incliné haltères", sets: 3, reps: 10 },
      { exercise: "Écarté couché", sets: 3, reps: 12 },
      { exercise: "Pompes", sets: 3, reps: 15 },
    ],
  },
  {
    id: "dos",
    name: "Dos",
    description:
      "Focus dos : tirages verticaux et horizontaux, chaîne postérieure.",
    category: "muscle",
    exercises: [
      { exercise: "Soulevé de terre", sets: 3, reps: 5 },
      { exercise: "Tractions", sets: 4, reps: 8 },
      { exercise: "Rowing barre", sets: 4, reps: 10 },
      { exercise: "Tirage vertical", sets: 3, reps: 12 },
    ],
  },
  {
    id: "epaules",
    name: "Épaules",
    description:
      "Focus épaules : les trois faisceaux (antérieur, latéral, postérieur).",
    category: "muscle",
    exercises: [
      { exercise: "Développé militaire", sets: 4, reps: 8 },
      { exercise: "Élévations latérales", sets: 4, reps: 12 },
      { exercise: "Oiseau (élévations buste penché)", sets: 3, reps: 15 },
    ],
  },
  {
    id: "bras",
    name: "Bras",
    description: "Focus bras : biceps et triceps en alternance.",
    category: "muscle",
    exercises: [
      { exercise: "Curl biceps", sets: 4, reps: 10 },
      { exercise: "Dips", sets: 3, reps: 10 },
      { exercise: "Curl marteau", sets: 3, reps: 12 },
      { exercise: "Extensions triceps poulie", sets: 3, reps: 12 },
    ],
  },
  {
    id: "abdominaux",
    name: "Abdominaux",
    description:
      "Focus sangle abdominale, à caser en fin de séance ou en séance courte.",
    category: "muscle",
    exercises: [
      { exercise: "Crunch", sets: 4, reps: 15 },
      { exercise: "Relevés de jambes", sets: 4, reps: 12 },
    ],
  },
];

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  split: "Par type de séance",
  muscle: "Par muscle ciblé",
};

export function getProgramTemplate(id: string): ProgramTemplate | undefined {
  return PROGRAM_TEMPLATES.find((template) => template.id === id);
}

/** Total number of working sets of a template (each set = one program row). */
export function templateSetCount(template: ProgramTemplate): number {
  return template.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
}
