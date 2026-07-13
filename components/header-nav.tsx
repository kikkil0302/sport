"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/calculateurs", label: "Calculateurs" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/muscles", label: "Muscles 3D" },
  { href: "/seances", label: "Séances" },
  { href: "/programmes", label: "Programmes" },
  { href: "/stats", label: "Stats" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navClass(active: boolean, block = false): string {
  const base = block
    ? "rounded-md px-3 py-2 text-sm transition-colors"
    : "text-sm transition-colors";
  return active
    ? `${base} font-medium text-zinc-900 dark:text-white`
    : `${base} text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`;
}

const PRIMARY =
  "rounded-md bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";
const GHOST =
  "rounded-md border border-zinc-300 px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

export function HeaderNav({
  user,
}: {
  user: { displayName: string | null } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navigation bureau */}
      <nav className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={navClass(isActive(pathname, href))}>
            {label}
          </Link>
        ))}
      </nav>

      {/* Actions compte — bureau */}
      <div className="ml-auto hidden items-center gap-3 md:flex">
        <AuthActions user={user} />
      </div>

      {/* Bouton menu mobile */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Ouvrir le menu"
        className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 md:hidden dark:border-zinc-700 dark:text-zinc-200"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Panneau mobile */}
      {open && (
        <div className="absolute inset-x-0 top-14 border-b border-zinc-200 bg-white p-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={navClass(isActive(pathname, href), true)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <AuthActions user={user} onNavigate={() => setOpen(false)} block />
          </div>
        </div>
      )}
    </>
  );
}

function AuthActions({
  user,
  onNavigate,
  block = false,
}: {
  user: { displayName: string | null } | null;
  onNavigate?: () => void;
  block?: boolean;
}) {
  const center = block ? "text-center" : "";
  if (user) {
    return (
      <Link href="/compte" onClick={onNavigate} className={`${GHOST} ${center}`}>
        {user.displayName ?? "Mon compte"}
      </Link>
    );
  }
  return (
    <>
      <Link
        href="/connexion"
        onClick={onNavigate}
        className={`text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white ${block ? "px-3 py-2" : ""} ${center}`}
      >
        Connexion
      </Link>
      <Link href="/inscription" onClick={onNavigate} className={`${PRIMARY} ${center}`}>
        S&apos;inscrire
      </Link>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
