import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Trakmetrik pour suivre vos séances.",
  alternates: { canonical: "/connexion" },
};

export default async function ConnexionPage() {
  if (await getSessionUser()) redirect("/compte");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight">Bon retour parmi nous</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Retrouvez vos programmes, séances et statistiques.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Créer un compte gratuit
        </Link>
      </p>
    </div>
  );
}
