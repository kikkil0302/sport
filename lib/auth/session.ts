import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ApiError, apiFetch, backendFetch, SESSION_COOKIE } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: Date;
}

function toSessionUser(user: ApiUser): SessionUser {
  return { ...user, createdAt: new Date(user.createdAt) };
}

/**
 * Returns the authenticated user for the current request, or null.
 * The session itself lives in the Java backend; we only hold its cookie.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE)?.value) return null;

  try {
    return toSessionUser(await apiFetch<ApiUser>("/api/auth/me"));
  } catch (error) {
    // 401 = session expirée/invalide ; 503 = backend injoignable → rendu déconnecté.
    if (error instanceof ApiError) return null;
    throw error;
  }
});

/** Session user for pages and server actions that require authentication. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");
  return user;
}

/**
 * Relays the `Set-Cookie` issued by the backend (login/register/logout) onto
 * the Next.js response, so the browser and the backend share one session.
 */
export async function applySessionCookie(response: Response): Promise<void> {
  const raw = response.headers
    .getSetCookie()
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
  if (!raw) return;

  const token = raw.split(";")[0].slice(SESSION_COOKIE.length + 1);
  const cookieStore = await cookies();
  if (!token) {
    cookieStore.delete(SESSION_COOKIE);
    return;
  }

  const maxAge = /max-age=(\d+)/i.exec(raw)?.[1];
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge ? Number(maxAge) : undefined,
  });
}

/** Destroys the backend session (best effort) and always drops the local cookie. */
export async function destroySession(): Promise<void> {
  try {
    await backendFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Backend injoignable : on supprime quand même le cookie local.
  }
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
