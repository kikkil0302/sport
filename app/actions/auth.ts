"use server";

import { redirect } from "next/navigation";
import { ApiError, backendFetch, deleteAccount, readErrorMessage } from "@/lib/api";
import {
  applySessionCookie,
  credentialsSchema,
  destroySession,
  getSessionUser,
  registerSchema,
} from "@/lib/auth";
import { formValue } from "@/lib/forms";

export interface AuthFormState {
  error?: string;
}

/** POSTs credentials to the backend and relays its session cookie; null = success. */
async function authenticate(
  path: string,
  payload: Record<string, unknown>,
): Promise<string | null> {
  let response: Response;
  try {
    response = await backendFetch(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof ApiError) return error.message;
    throw error;
  }
  if (!response.ok) return readErrorMessage(response);

  await applySessionCookie(response);
  return null;
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

  const error = await authenticate("/api/auth/register", {
    ...parsed.data,
    consent: true,
  });
  if (error) return { error };
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

  const error = await authenticate("/api/auth/login", parsed.data);
  if (error) return { error };
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

  try {
    await deleteAccount();
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  await destroySession();
  redirect("/");
}
