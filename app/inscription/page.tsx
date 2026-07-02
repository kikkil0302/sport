import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Inscription — FitPilot",
};

export default async function InscriptionPage() {
  if (await getSessionUser()) redirect("/compte");

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Créer un compte</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Un compte permet de suivre vos séances, programmes et performances.
        Seules les données strictement nécessaires sont collectées.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Déjà inscrit ?{" "}
        <Link
          href="/connexion"
          className="text-emerald-600 underline dark:text-emerald-400"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
