import { cookies } from "next/headers";

export const SESSION_COOKIE = "fitpilot_session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

/** Backend error: `status` is the HTTP code, `message` the French text from `{"error": …}`. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Raw fetch to the Java backend, forwarding the browser's session cookie.
 * Throws ApiError(503) when the backend is unreachable; HTTP errors are
 * left to the caller (use apiFetch for the throw-on-error variant).
 */
export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const headers = new Headers(init.headers);
  if (token) headers.set("Cookie", `${SESSION_COOKIE}=${token}`);
  if (init.body) headers.set("Content-Type", "application/json");

  try {
    return await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      503,
      "Le serveur est momentanément indisponible. Réessayez dans un instant.",
    );
  }
}

/** French error message of a non-2xx backend response (`{"error": …}` contract). */
export async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error;
    }
  } catch {
    // Non-JSON body — fall through to the generic message.
  }
  return "Une erreur inattendue est survenue.";
}

/** JSON call to the backend; throws ApiError with the backend's message on non-2xx. */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await backendFetch(path, init);
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
