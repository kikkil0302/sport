"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addBodyWeight, ApiError, deleteBodyWeight } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { localDayKey } from "@/lib/dates";
import { formValue, parseDecimalInput } from "@/lib/forms";
import { dateInputSchema } from "@/lib/workouts/schema";

export interface BodyWeightFormState {
  error?: string;
}

const entrySchema = z.object({
  measuredAt: dateInputSchema,
  weightKg: z
    .number("Veuillez saisir un poids valide")
    .min(20, "Poids minimum : 20 kg")
    .max(400, "Poids maximum : 400 kg"),
});

export async function addBodyWeightAction(
  _previous: BodyWeightFormState,
  formData: FormData,
): Promise<BodyWeightFormState> {
  await requireUser();

  const parsed = entrySchema.safeParse({
    measuredAt: formValue(formData, "measuredAt") || new Date(),
    weightKg: parseDecimalInput(formValue(formData, "weightKg")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await addBodyWeight({
      measuredAt: localDayKey(parsed.data.measuredAt),
      weightKg: parsed.data.weightKg,
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath("/stats");
  return {};
}

export async function deleteBodyWeightAction(entryId: string): Promise<void> {
  await requireUser();
  try {
    await deleteBodyWeight(entryId);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }
  revalidatePath("/stats");
}
