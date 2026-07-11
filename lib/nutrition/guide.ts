// Guides sèche (cut) et prise de masse (bulk) : contenu éditorial français,
// structuré pour être rendu tel quel par les pages.

export interface GuideSection {
  title: string;
  intro?: string;
  bullets: string[];
}

export const CUT_GUIDE: GuideSection[] = [
  {
    title: "Fixer le déficit",
    intro:
      "Une sèche réussie est un déficit calorique modéré tenu dans la durée, pas une famine de deux semaines.",
    bullets: [
      "Visez un déficit de 15 à 25 % sous votre dépense (TDEE), soit environ 300 à 500 kcal — c'est le réglage « Perte de poids » du calculateur.",
      "Rythme cible : perdre 0,5 à 1 % de votre poids par semaine. Plus vite = plus de perte musculaire.",
      "Ne descendez jamais durablement sous votre métabolisme de base (BMR).",
      "Plus la sèche est longue (8 semaines et plus), plus une semaine de pause à maintenance (diet break) aide à tenir.",
    ],
  },
  {
    title: "Protéines et entraînement",
    intro:
      "En déficit, l'enjeu n'est pas de perdre du poids mais de perdre du gras en gardant le muscle.",
    bullets: [
      "Protéines hautes : 1,8 à 2,2 g par kg de poids corporel, réparties sur 3 à 5 repas.",
      "Gardez vos charges à l'entraînement : la force est le signal qui dit au corps de conserver le muscle.",
      "Le cardio est un complément (2 à 3 marches rapides ou séances légères), pas la base : le déficit se construit d'abord dans l'assiette.",
      "Privilégiez les aliments rassasiants et peu caloriques : légumes, protéines maigres, féculents entiers.",
    ],
  },
  {
    title: "Suivi et ajustements",
    bullets: [
      "Pesez-vous 3 à 4 fois par semaine à jeun et comparez les moyennes hebdomadaires, jamais deux pesées isolées.",
      "Si la moyenne stagne 2 semaines, retirez environ 100 à 150 kcal (idéalement sur les glucides ou lipides, pas les protéines).",
      "Prenez aussi des mesures (tour de taille) et des photos : la balance ne dit pas tout.",
      "Enregistrez vos pesées dans les statistiques Trakmetrik pour visualiser la tendance.",
    ],
  },
];

export const BULK_GUIDE: GuideSection[] = [
  {
    title: "Fixer le surplus",
    intro:
      "Une prise de masse utile est un léger surplus qui nourrit le muscle sans stocker inutilement du gras.",
    bullets: [
      "Visez un surplus de 5 à 15 % au-dessus du TDEE, soit environ 150 à 300 kcal — le réglage « Prise de masse » du calculateur.",
      "Rythme cible : prendre 0,25 à 0,5 % de votre poids par semaine (débutants : fourchette haute, confirmés : fourchette basse).",
      "Au-delà, le surplus se stocke surtout en gras : « manger énorme » ne fait pas grossir le muscle plus vite.",
      "Si vous partez d'un taux de gras élevé, commencez plutôt par une sèche courte.",
    ],
  },
  {
    title: "Entraînement et progression",
    intro:
      "Le surplus ne construit rien sans stimulus : c'est la progression à l'entraînement qui dirige les calories vers le muscle.",
    bullets: [
      "Cherchez la surcharge progressive : un peu plus de charge ou de répétitions d'une semaine à l'autre, sur les mêmes exercices.",
      "Protéines : 1,6 à 2 g par kg de poids corporel ; le reste des calories vient surtout des glucides pour alimenter les séances.",
      "3 à 5 séances de force par semaine suffisent ; la récupération (sommeil 7 à 9 h) fait partie de l'entraînement.",
      "Suivez votre volume et vos records dans le journal de séances pour objectiver la progression.",
    ],
  },
  {
    title: "Suivi et ajustements",
    bullets: [
      "Même méthode qu'en sèche : moyennes de pesées hebdomadaires, à jeun.",
      "Si vous prenez trop vite (> 0,5 %/semaine), retirez 100 à 150 kcal ; si rien ne bouge en 2 semaines, ajoutez-en autant.",
      "Un tour de taille qui grimpe nettement plus vite que le poids = surplus trop grand.",
      "Après 3 à 6 mois de prise de masse, une phase de maintien ou une sèche courte permet de repartir proprement.",
    ],
  },
];
