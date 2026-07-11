import type { Metadata } from "next";
import Link from "next/link";
import { VerifyForm } from "@/components/auth/verify-form";

export const metadata: Metadata = {
  title: "Vérification de votre adresse e-mail",
  robots: { index: false, follow: false },
};

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-4xl" aria-hidden>
          ✉️
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Vérification de votre adresse
        </h1>
        {token ? (
          <>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Une dernière étape : confirmez que cette adresse est bien la
              vôtre. Vous serez connecté dans la foulée.
            </p>
            <div className="mt-6">
              <VerifyForm token={token} />
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Ce lien est incomplet — ouvrez le lien reçu par e-mail, ou
            redemandez-en un depuis la{" "}
            <Link
              href="/connexion"
              className="font-medium text-emerald-600 underline dark:text-emerald-400"
            >
              page de connexion
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
