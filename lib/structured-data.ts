/**
 * Données structurées Schema.org (JSON-LD). Elles aident le SEO classique
 * (rich results Google) et surtout le GEO : les moteurs génératifs s'appuient
 * sur ces graphes pour identifier, comprendre et citer Trakmetrik.
 */
import {
  FAQ,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
  };
}

/** Décrit le produit lui-même : application web gratuite de santé/fitness. */
export function webApplicationSchema() {
  return {
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    inLanguage: "fr-FR",
    description: SITE_DESCRIPTION,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: [
      "Calcul des besoins caloriques (Mifflin-St Jeor, Katch-McArdle)",
      "Répartition des macronutriments (protéines, glucides, lipides)",
      "Calcul de l'IMC selon la classification OMS",
      "Journal de séances de musculation",
      "Programmes d'entraînement réutilisables",
      "Statistiques de progression (volume, charges, 1RM estimé)",
    ],
    publisher: { "@id": ORG_ID },
  };
}

export function faqSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** Graphe global injecté sur la page d'accueil. */
export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      webApplicationSchema(),
      faqSchema(),
    ],
  };
}
