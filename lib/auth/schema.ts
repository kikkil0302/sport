import { z } from "zod";

export const credentialsSchema = z.object({
  // Normalize BEFORE validating so pasted emails with stray whitespace pass.
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email("Adresse e-mail invalide").max(254, "Adresse e-mail trop longue"),
  ),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(200, "Mot de passe trop long"),
});

export const registerSchema = credentialsSchema.extend({
  displayName: z
    .string()
    .trim()
    .max(50, "Nom d'affichage trop long (50 caractères max)")
    .optional(),
});
