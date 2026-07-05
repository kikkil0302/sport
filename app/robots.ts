import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/** Routes authentifiées ou techniques : sans intérêt pour l'indexation. */
const DISALLOWED = ["/api/", "/compte", "/seances", "/programmes", "/stats"];

/**
 * Crawlers des moteurs génératifs (GEO). On les autorise explicitement pour
 * maximiser les chances d'être cité par ChatGPT, Claude, Perplexity, Gemini…
 */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOWED },
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOWED },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
