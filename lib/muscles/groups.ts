/**
 * Taxonomie fine du mannequin 3D interactif (/muscles) : 18 groupes musculaires
 * rangés en 4 régions (Jambes, Bras, Torse, Cou). Chaque `id` correspond au
 * résultat de `classify()` (cf. classify.ts) et aux couleurs 3D + UI.
 *
 * Les exercices sont écrits ICI (côté navigateur, aucune donnée envoyée) : cette
 * page est un outil de découverte, indépendant du catalogue backend à 7 groupes
 * utilisé par les séances/programmes.
 */

export type RegionId = "Jambes" | "Bras" | "Torse" | "Cou";

/** Ordre d'affichage des sections de légende. */
export const REGIONS: RegionId[] = ["Jambes", "Bras", "Torse", "Cou"];

export interface MuscleGroup {
  /** Identifiant = valeur renvoyée par classify(). */
  id: string;
  /** Libellé affiché. */
  label: string;
  region: RegionId;
  /** Couleur d'accent (hex), partagée 3D + UI. */
  color: string;
  /** Courte description pédagogique. */
  blurb: string;
  /** Exercices qui ciblent ce groupe (rédigés côté frontend). */
  exercises: string[];
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  // ---------- Jambes ----------
  {
    id: "fessiers",
    label: "Fessiers",
    region: "Jambes",
    color: "#1d4ed8",
    blurb: "Grand et moyen fessier : extension et stabilité de la hanche.",
    exercises: ["Hip thrust", "Squat", "Soulevé de terre roumain", "Fentes", "Abduction à la poulie"],
  },
  {
    id: "quadriceps",
    label: "Quadriceps",
    region: "Jambes",
    color: "#0ea5e9",
    blurb: "Avant de la cuisse : extension du genou.",
    exercises: ["Squat", "Presse à cuisses", "Fentes", "Leg extension", "Hack squat"],
  },
  {
    id: "ischios",
    label: "Ischio-jambiers",
    region: "Jambes",
    color: "#06b6d4",
    blurb: "Arrière de la cuisse : flexion du genou et extension de hanche.",
    exercises: ["Leg curl", "Soulevé de terre roumain", "Good morning", "Soulevé jambes tendues"],
  },
  {
    id: "adducteurs",
    label: "Adducteurs",
    region: "Jambes",
    color: "#0d9488",
    blurb: "Intérieur de la cuisse : rapprochement des jambes.",
    exercises: ["Machine à adducteurs", "Squat sumo", "Fentes latérales", "Écarté poulie basse"],
  },
  {
    id: "mollets",
    label: "Mollets",
    region: "Jambes",
    color: "#22d3ee",
    blurb: "Gastrocnémiens et soléaire : extension de la cheville.",
    exercises: ["Mollets debout", "Mollets assis", "Extension mollets à la presse", "Corde à sauter"],
  },

  // ---------- Bras ----------
  {
    id: "deltoides",
    label: "Deltoïdes",
    region: "Bras",
    color: "#7c3aed",
    blurb: "Épaules : abduction et poussées au-dessus de la tête.",
    exercises: ["Développé militaire", "Élévations latérales", "Oiseau (buste penché)", "Développé Arnold", "Face pull"],
  },
  {
    id: "biceps",
    label: "Biceps",
    region: "Bras",
    color: "#9333ea",
    blurb: "Avant du bras : flexion du coude.",
    exercises: ["Curl biceps", "Curl marteau", "Curl à la barre EZ", "Curl incliné", "Curl concentration"],
  },
  {
    id: "triceps",
    label: "Triceps",
    region: "Bras",
    color: "#c026d3",
    blurb: "Arrière du bras : extension du coude, l'essentiel du volume du bras.",
    exercises: ["Dips", "Extensions à la poulie", "Barre au front", "Extension nuque", "Kickback"],
  },
  {
    id: "avant-bras",
    label: "Avant-bras",
    region: "Bras",
    color: "#a855f7",
    blurb: "Fléchisseurs et extenseurs du poignet : la poigne (grip).",
    exercises: ["Curl de poignets", "Curl inversé", "Farmer's walk", "Suspension à la barre"],
  },

  // ---------- Torse ----------
  {
    id: "pectoraux",
    label: "Pectoraux",
    region: "Torse",
    color: "#e11d48",
    blurb: "Poitrine : poussées horizontales.",
    exercises: ["Développé couché", "Développé incliné haltères", "Pompes", "Écarté couché", "Dips lestés"],
  },
  {
    id: "dorsaux",
    label: "Grand dorsal",
    region: "Torse",
    color: "#dc2626",
    blurb: "Largeur du dos : tous les tirages verticaux.",
    exercises: ["Tractions", "Tirage vertical", "Rowing haltère", "Pull-over"],
  },
  {
    id: "trapezes",
    label: "Trapèzes",
    region: "Torse",
    color: "#f97316",
    blurb: "Haut du dos et nuque : élévation et rétraction des épaules.",
    exercises: ["Haussements d'épaules (shrugs)", "Tirage menton", "Soulevé de terre", "Face pull"],
  },
  {
    id: "abdominaux",
    label: "Abdominaux",
    region: "Torse",
    color: "#f59e0b",
    blurb: "Grand droit : flexion du tronc et gainage.",
    exercises: ["Crunch", "Relevés de jambes", "Gainage (planche)", "Roue abdominale", "Crunch à la poulie"],
  },
  {
    id: "obliques",
    label: "Obliques",
    region: "Torse",
    color: "#eab308",
    blurb: "Côtés de l'abdomen : rotation et inclinaison du tronc.",
    exercises: ["Gainage latéral", "Russian twist", "Crunch oblique", "Woodchopper à la poulie"],
  },
  {
    id: "lombaires",
    label: "Lombaires",
    region: "Torse",
    color: "#b45309",
    blurb: "Bas du dos (érecteurs du rachis) : extension et maintien du dos.",
    exercises: ["Extension lombaire (banc)", "Good morning", "Soulevé de terre", "Superman"],
  },
  {
    id: "dentele",
    label: "Dentelé antérieur",
    region: "Torse",
    color: "#ec4899",
    blurb: "Sur les côtes, sous l'aisselle : sonne l'omoplate vers l'avant.",
    exercises: ["Serratus punch", "Pull-over", "Pompes en protraction", "Développé avec protraction"],
  },
  {
    id: "coiffe",
    label: "Coiffe des rotateurs",
    region: "Torse",
    color: "#fb7185",
    blurb: "Petits muscles de l'épaule : rotation et stabilité (prévention blessures).",
    exercises: ["Rotations externes à la poulie", "Oiseau", "Face pull", "L-fly haltère"],
  },

  // ---------- Cou ----------
  {
    id: "cou",
    label: "Cou",
    region: "Cou",
    color: "#64748b",
    blurb: "Sterno-cléido-mastoïdiens : flexion et rotation de la tête.",
    exercises: ["Flexions du cou (charge légère)", "Extensions du cou", "Gainage isométrique du cou"],
  },
];

/** id du groupe → couleur hex. */
export const GROUP_COLORS: Record<string, string> = Object.fromEntries(
  MUSCLE_GROUPS.map((g) => [g.id, g.color]),
);

/**
 * Correspondance groupe fin (18) → groupe du catalogue backend (7). Sert quand
 * on ajoute un exercice de cette page à une séance : le backend ne connaît que
 * ces 7 libellés. Les valeurs DOIVENT correspondre exactement au seed backend.
 */
export const BACKEND_GROUP: Record<string, string> = {
  fessiers: "Jambes",
  quadriceps: "Jambes",
  ischios: "Jambes",
  adducteurs: "Jambes",
  mollets: "Jambes",
  deltoides: "Épaules",
  biceps: "Biceps",
  triceps: "Triceps",
  "avant-bras": "Biceps",
  pectoraux: "Pectoraux",
  dorsaux: "Dos",
  trapezes: "Dos",
  dentele: "Dos",
  coiffe: "Épaules",
  lombaires: "Dos",
  abdominaux: "Abdominaux",
  obliques: "Abdominaux",
  cou: "Dos",
};

/** id du groupe → groupe complet. */
export const GROUP_BY_ID: Record<string, MuscleGroup> = Object.fromEntries(
  MUSCLE_GROUPS.map((g) => [g.id, g]),
);

/** Groupes d'une région, dans l'ordre. */
export function groupsByRegion(region: RegionId): MuscleGroup[] {
  return MUSCLE_GROUPS.filter((g) => g.region === region);
}
