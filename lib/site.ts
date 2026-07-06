/**
 * Configuration centrale du site — source unique pour le SEO, le GEO
 * (référencement par les IA génératives), les métadonnées et les données
 * structurées. Le domaine est surchargeable via `NEXT_PUBLIC_SITE_URL`.
 */

const RAW_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trakmetrik.com";

/** URL de production sans slash final (ex. "https://trakmetrik.com"). */
export const SITE_URL = RAW_URL.replace(/\/$/, "");

export const SITE_NAME = "Trakmetrik";

export const SITE_TAGLINE =
  "Nutrition, entraînement et suivi de progression";

export const SITE_DESCRIPTION =
  "Trakmetrik est un outil gratuit de fitness et diététique en français : calculez vos calories, macros et IMC (Mifflin-St Jeor, Katch-McArdle, OMS), planifiez vos séances, réutilisez vos programmes et suivez votre progression. Respectueux de vos données (RGPD).";

export const SITE_LOCALE = "fr_FR";

/** Mots-clés — utiles au SEO classique et au repérage thématique par les IA. */
export const SITE_KEYWORDS = [
  "calcul calories",
  "calcul macros",
  "calculateur IMC",
  "TDEE",
  "métabolisme de base",
  "Mifflin-St Jeor",
  "Katch-McArdle",
  "diététique",
  "musculation",
  "programme d'entraînement",
  "suivi de séances",
  "1RM",
  "fitness gratuit",
] as const;

/**
 * FAQ — contenu factuel et citable, rendu à l'écran ET exposé en JSON-LD
 * (FAQPage). Les moteurs génératifs (ChatGPT, Perplexity, Google AI Overviews)
 * citent volontiers ce format structuré.
 */
export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Trakmetrik est-il gratuit ?",
    answer:
      "Oui, Trakmetrik est 100 % gratuit. Les calculateurs de calories, de macros et d'IMC sont accessibles sans inscription, et la création d'un compte pour suivre ses séances est également gratuite.",
  },
  {
    question: "Quelles formules Trakmetrik utilise-t-il pour calculer les calories ?",
    answer:
      "Trakmetrik estime le métabolisme de base avec l'équation de Mifflin-St Jeor, ou celle de Katch-McArdle si vous connaissez votre pourcentage de masse grasse. La dépense énergétique journalière (TDEE) applique ensuite un facteur d'activité, et l'IMC suit la classification de l'Organisation mondiale de la santé (OMS).",
  },
  {
    question: "Mes données personnelles sont-elles protégées ?",
    answer:
      "Oui. Les calculateurs fonctionnent entièrement dans votre navigateur : aucune donnée saisie n'est envoyée à nos serveurs. Pour les comptes, Trakmetrik applique la minimisation des données (e-mail et mot de passe chiffré uniquement), conformément au RGPD, avec export et suppression définitive du compte à tout moment.",
  },
  {
    question: "Ai-je besoin d'un compte pour utiliser les calculateurs ?",
    answer:
      "Non. Les calculateurs de calories, macros et IMC sont utilisables immédiatement, sans compte. Un compte n'est nécessaire que pour enregistrer vos séances, créer des programmes réutilisables et suivre votre progression dans le temps.",
  },
  {
    question: "Trakmetrik remplace-t-il un avis médical ou un nutritionniste ?",
    answer:
      "Non. Les résultats fournis par Trakmetrik sont des estimations à visée informative et ne remplacent pas l'avis d'un professionnel de santé ou d'un diététicien.",
  },
] as const;

/** Construit une URL absolue à partir d'un chemin (ex. "/calculateurs"). */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
