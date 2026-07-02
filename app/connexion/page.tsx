import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion — FitPilot",
};

export default async function ConnexionPage() {
  if (await getSessionUser()) redirect("/compte");

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Retrouvez vos programmes, séances et statistiques.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="text-emerald-600 underline dark:text-emerald-400"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
