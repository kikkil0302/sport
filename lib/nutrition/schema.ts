import { z } from "zod";
import { ACTIVITY_LEVELS, GOALS } from "./types";

export const bodyProfileSchema = z.object({
  sex: z.enum(["male", "female"]),
  age: z.number().int().min(15, "Âge minimum : 15 ans").max(100, "Âge maximum : 100 ans"),
  heightCm: z
    .number()
    .min(100, "Taille minimum : 100 cm")
    .max(250, "Taille maximum : 250 cm"),
  weightKg: z
    .number()
    .min(30, "Poids minimum : 30 kg")
    .max(300, "Poids maximum : 300 kg"),
  bodyFatPercent: z
    .number()
    .min(3, "Masse grasse minimum : 3 %")
    .max(60, "Masse grasse maximum : 60 %")
    .optional(),
});

export const planRequestSchema = bodyProfileSchema.extend({
  activityLevel: z.enum(ACTIVITY_LEVELS),
  goal: z.enum(GOALS),
});

export type PlanRequest = z.infer<typeof planRequestSchema>;
