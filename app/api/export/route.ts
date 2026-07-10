import { ApiError, backendFetch } from "@/lib/api";

/**
 * GDPR data portability (article 20): proxies the backend's full JSON export,
 * which excludes password hashes and session tokens by contract.
 */
export async function GET(): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await backendFetch("/api/export");
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
  if (!upstream.ok) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="trakmetrik-donnees.json"',
    },
  });
}
