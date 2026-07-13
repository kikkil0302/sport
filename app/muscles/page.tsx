import type { Metadata } from "next";
import { MuscleExplorer } from "@/components/muscles/muscle-explorer";
import { getSessionUser } from "@/lib/auth";

const title = "Modèle 3D des muscles — trouver les exercices par groupe";
const description =
  "Explorez un mannequin 3D interactif : sélectionnez un muscle (pectoraux, dos, épaules, biceps, triceps, abdominaux, jambes) et découvrez la liste des exercices qui le travaillent. Gratuit, dans votre navigateur.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/muscles" },
  openGraph: {
    title: `${title} — Trakmetrik`,
    description,
    url: "/muscles",
    type: "website",
  },
};

export default async function MusclesPage() {
  const user = await getSessionUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Muscles en 3D</h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Fais tourner le mannequin, clique sur un groupe musculaire, et la liste
        des exercices qui le ciblent apparaît à côté. Un moyen simple de bâtir
        ta séance en partant du muscle que tu veux travailler.
      </p>

      <div className="mt-10">
        <MuscleExplorer isLoggedIn={user != null} />
      </div>

      <p className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-zinc-800">
        Modèle anatomique 3D dérivé de{" "}
        <a
          href="https://www.z-anatomy.com/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Z-Anatomy
        </a>{" "}
        (© Gauthier Kervyn, CC BY-SA 4.0).
      </p>
    </div>
  );
}
