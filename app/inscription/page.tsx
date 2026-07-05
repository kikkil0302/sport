import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Créer un compte gratuit",
  description:
    "Créez gratuitement votre compte Trakmetrik pour enregistrer vos séances, réutiliser vos programmes et suivre votre progression.",
  alternates: { canonical: "/inscription" },
};

export default async function InscriptionPage() {
  if (await getSessionUser()) redirect("/compte");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight">Créer un compte gratuit</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Suivez vos séances, programmes et performances. Seules les données
          strictement nécessaires sont collectées.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Déjà inscrit ?{" "}
        <Link
          href="/connexion"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
