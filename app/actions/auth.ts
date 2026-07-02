"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  credentialsSchema,
  destroySession,
  getSessionUser,
  hashPassword,
  registerSchema,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { formValue } from "@/lib/forms";

export interface AuthFormState {
  error?: string;
}

export async function registerAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (formData.get("consent") !== "on") {
    return {
      error:
        "Vous devez accepter la politique de confidentialité pour créer un compte.",
    };
  }

  const parsed = registerSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    displayName: formValue(formData, "displayName") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, displayName } = parsed.data;
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cette adresse e-mail." };
  }

  const user = await db.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      displayName: displayName ?? null,
    },
  });
  await createSession(user.id);
  redirect("/compte");
}

export async function loginAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  const validPassword =
    user !== null && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!user || !validPassword) {
    return { error: "E-mail ou mot de passe incorrect." };
  }

  await createSession(user.id);
  redirect("/compte");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

/** GDPR right to erasure: permanently deletes the account and all related data. */
export async function deleteAccountAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");

  if (formData.get("confirm") !== "on") {
    return { error: "Cochez la case de confirmation pour supprimer le compte." };
  }

  await destroySession();
  await db.user.delete({ where: { id: user.id } });
  redirect("/");
}
