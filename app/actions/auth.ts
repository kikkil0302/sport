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
  /** Message de succès (inscription : « vérifiez votre boîte mail »). */
  success?: string;
  /** Vrai quand la connexion échoue faute d'e-mail vérifié (403). */
  needsVerification?: boolean;
  /** E-mail saisi, pour proposer le renvoi du lien de vérification. */
  email?: string;
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

  // Politique stricte : pas de session à l'inscription — le backend envoie
  // un e-mail de vérification et la connexion reste bloquée jusqu'au clic.
  let response: Response;
  try {
    response = await backendFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...parsed.data, consent: true }),
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  if (!response.ok) return { error: await readErrorMessage(response) };

  return {
    success:
      "Compte créé ! Un e-mail de vérification vient de vous être envoyé : cliquez sur le lien pour activer votre compte (valable 24 h).",
  };
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

  let response: Response;
  try {
    response = await backendFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  if (!response.ok) {
    return {
      error: await readErrorMessage(response),
      needsVerification: response.status === 403,
      email: parsed.data.email,
    };
  }

  await applySessionCookie(response);
  redirect("/compte");
}

/** Vérifie l'adresse via le jeton du lien reçu, puis connecte l'utilisateur. */
export async function verifyEmailAction(token: string): Promise<AuthFormState> {
  let response: Response;
  try {
    response = await backendFetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  if (!response.ok) return { error: await readErrorMessage(response) };

  await applySessionCookie(response);
  redirect("/compte");
}

/** Renvoie l'e-mail de vérification (réponse identique que le compte existe ou non). */
export async function resendVerificationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formValue(formData, "email").trim().toLowerCase();
  if (!email) return { error: "Adresse e-mail requise" };

  try {
    const response = await backendFetch("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!response.ok && response.status !== 204) {
      return { error: await readErrorMessage(response) };
    }
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
  return {
    success:
      "Si un compte non vérifié existe avec cette adresse, un nouvel e-mail vient d'être envoyé.",
  };
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
