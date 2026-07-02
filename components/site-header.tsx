import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/calculateurs", label: "Calculateurs" },
  { href: "/seances", label: "Séances" },
  { href: "/programmes", label: "Programmes" },
  { href: "/stats", label: "Stats" },
] as const;

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Fit<span className="text-emerald-600 dark:text-emerald-400">Pilot</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {user ? (
            <Link
              href="/compte"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {user.displayName ?? "Mon compte"}
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-emerald-700"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
