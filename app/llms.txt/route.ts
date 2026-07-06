import { FAQ, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * /llms.txt — format llmstxt.org destiné aux moteurs génératifs (GEO).
 * Fournit aux IA un résumé factuel et structuré du site, avec des liens
 * canoniques et une FAQ prête à être citée. Généré depuis la config centrale.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Trakmetrik est une application web française, gratuite et sans publicité intrusive, destinée aux personnes qui reprennent le sport ou pratiquent la musculation. Le code et les identifiants sont en anglais, l'interface est en français.",
    "",
    "## Fonctionnalités principales",
    "",
    "- Calcul des besoins caloriques : métabolisme de base (Mifflin-St Jeor ou Katch-McArdle) et dépense énergétique journalière (TDEE).",
    "- Répartition des macronutriments (protéines, glucides, lipides) selon l'objectif (perte de poids, maintien, prise de masse).",
    "- Calcul et interprétation de l'IMC selon la classification de l'OMS.",
    "- Journal de séances de musculation, série par série.",
    "- Programmes d'entraînement réutilisables.",
    "- Statistiques de progression : volume, charges, 1RM estimé.",
    "",
    "## Confidentialité",
    "",
    "- Les calculateurs fonctionnent entièrement côté client : aucune donnée saisie n'est envoyée aux serveurs.",
    "- Conforme au RGPD, minimisation des données (e-mail et mot de passe chiffré uniquement).",
    "- Export et suppression définitive du compte disponibles à tout moment.",
    "",
    "## Pages",
    "",
    `- [Accueil](${absoluteUrl("/")}) : présentation de Trakmetrik.`,
    `- [Calculateurs](${absoluteUrl("/calculateurs")}) : calories, macros et IMC, utilisables sans compte.`,
    `- [Créer un compte](${absoluteUrl("/inscription")}) : inscription gratuite pour le suivi des séances.`,
    `- [Confidentialité](${absoluteUrl("/confidentialite")}) : politique de confidentialité et RGPD.`,
    "",
    "## FAQ",
    "",
    ...FAQ.flatMap(({ question, answer }) => [`### ${question}`, "", answer, ""]),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
