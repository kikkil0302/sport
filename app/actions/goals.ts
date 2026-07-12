"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiError, updateGoal } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formValue, parseDecimalInput } from "@/lib/forms";

export interface GoalFormState {
  error?: string;
  saved?: boolean;
}

const goalSchema = z.object({
  targetWeightKg: z
    .number("Veuillez saisir un poids valide")
    .min(20, "Poids cible minimum : 20 kg")
    .max(400, "Poids cible maximum : 400 kg")
    .optional(),
  phase: z.enum(["cut", "maintain", "bulk"]).optional(),
});

export async function updateGoalAction(
  _previous: GoalFormState,
  formData: FormData,
): Promise<GoalFormState> {
  await requireUser();

  const rawPhase = formValue(formData, "phase");
  const parsed = goalSchema.safeParse({
    targetWeightKg: parseDecimalInput(formValue(formData, "targetWeightKg")),
    phase: rawPhase === "" ? undefined : rawPhase,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await updateGoal({
      targetWeightKg: parsed.data.targetWeightKg ?? null,
      phase: parsed.data.phase ?? null,
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  revalidatePath("/stats");
  return { saved: true };
}
