// Guide « combien de répétitions ? » : repères basés sur les recommandations
// classiques de la préparation physique (NSCA/ACSM). Contenu éditorial pur,
// affiché tel quel — aucun calcul, aucun I/O.

export interface RepGoal {
  id: "force" | "muscle" | "endurance";
  label: string;
  emoji: string;
  /** Fourchette de répétitions par série. */
  reps: string;
  /** Intensité indicative en % du 1RM (charge maximale sur 1 rép). */
  intensity: string;
  /** Repos recommandé entre les séries (aligné sur le minuteur). */
  rest: string;
  /** À quoi sert cette zone, en une phrase. */
  focus: string;
}

export const REP_GOALS: RepGoal[] = [
  {
    id: "force",
    label: "Force",
    emoji: "🏋️",
    reps: "1 à 5 réps",
    intensity: "85 à 100 % du 1RM",
    rest: "3 à 5 min",
    focus:
      "Charges lourdes, peu de répétitions : développe la force maximale et le système nerveux. Repos longs pour récupérer entre chaque série.",
  },
  {
    id: "muscle",
    label: "Prise de muscle",
    emoji: "💪",
    reps: "6 à 12 réps",
    intensity: "65 à 80 % du 1RM",
    rest: "60 à 90 s",
    focus:
      "La zone reine de l'hypertrophie : assez de charge et assez de volume pour faire grossir le muscle. Le meilleur compromis pour la plupart des objectifs esthétiques.",
  },
  {
    id: "endurance",
    label: "Endurance",
    emoji: "🔁",
    reps: "15 réps et plus",
    intensity: "moins de 65 % du 1RM",
    rest: "30 à 45 s",
    focus:
      "Charges légères, séries longues : améliore l'endurance musculaire et la résistance à la fatigue. Repos courts pour garder le rythme.",
  },
];

/** Conseil transverse affiché sous le tableau. */
export const REP_GUIDE_TIP =
  "Ces zones se combinent : on peut faire du lourd sur les gros exercices (force) puis " +
  "de la prise de muscle sur les exercices d'isolation. Dans tous les cas, la progression " +
  "d'une semaine à l'autre (un peu plus de charge ou de répétitions) reste le vrai moteur.";
