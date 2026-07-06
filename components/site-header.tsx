import Link from "next/link";
import { HeaderNav } from "@/components/header-nav";
import { getSessionUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-8 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12h4l2-6 4 12 2-6h6" />
            </svg>
          </span>
          Trakmetrik
        </Link>
        <HeaderNav user={user ? { displayName: user.displayName } : null} />
      </div>
    </header>
  );
}
