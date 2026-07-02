"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
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
  const user = await requireUser();

  const parsed = entrySchema.safeParse({
    measuredAt: formValue(formData, "measuredAt") || new Date(),
    weightKg: parseDecimalInput(formValue(formData, "weightKg")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.bodyWeightEntry.create({
    data: {
      userId: user.id,
      measuredAt: parsed.data.measuredAt,
      weightKg: parsed.data.weightKg,
    },
  });
  revalidatePath("/stats");
  return {};
}

export async function deleteBodyWeightAction(entryId: string): Promise<void> {
  const user = await requireUser();

  await db.bodyWeightEntry.deleteMany({
    where: { id: entryId, userId: user.id },
  });
  revalidatePath("/stats");
}
