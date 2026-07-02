import { z } from "zod";
import { parseDateInput } from "../dates";

/** Accepts a Date or an <input type="date"> string, parsed as local midnight. */
export const dateInputSchema = z.preprocess(
  (value) => (typeof value === "string" ? parseDateInput(value) : value),
  z.date("Date invalide"),
);

export const workoutSchema = z.object({
  performedAt: dateInputSchema,
  notes: z.string().trim().max(500, "Notes trop longues (500 caractères max)").optional(),
});

export const workoutSetSchema = z.object({
  exerciseId: z.string().min(1, "Choisissez un exercice"),
  reps: z
    .number()
    .int("Le nombre de répétitions doit être entier")
    .min(1, "Au moins 1 répétition")
    .max(200, "200 répétitions maximum"),
  weightKg: z
    .number()
    .min(0, "La charge ne peut pas être négative")
    .max(600, "Charge maximum : 600 kg")
    .optional(),
});
