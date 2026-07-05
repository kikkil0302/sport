import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Pages publiques indexables, avec leur priorité relative. */
const ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/calculateurs", changeFrequency: "monthly", priority: 0.9 },
  { path: "/inscription", changeFrequency: "yearly", priority: 0.6 },
  { path: "/connexion", changeFrequency: "yearly", priority: 0.4 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
