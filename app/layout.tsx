import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { currentYear } from "@/lib/dates";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  category: "health",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col justify-between gap-8 sm:flex-row">
              <div className="max-w-sm">
                <span className="text-lg font-bold tracking-tight">
                  Trak<span className="text-emerald-600 dark:text-emerald-400">metrik</span>
                </span>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Nutrition, entraînement et suivi de progression, réunis dans un
                  outil simple et respectueux de vos données.
                </p>
              </div>
              <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                <FooterLink href="/calculateurs" label="Calculateurs" />
                <FooterLink href="/seances" label="Séances" />
                <FooterLink href="/programmes" label="Programmes" />
                <FooterLink href="/stats" label="Statistiques" />
                <FooterLink href="/inscription" label="Créer un compte" />
                <FooterLink href="/confidentialite" label="Confidentialité" />
              </nav>
            </div>
            <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <p>
                Trakmetrik — Les résultats sont des estimations et ne remplacent
                pas un avis médical.
              </p>
              <p className="mt-1">
                © {currentYear()} Trakmetrik. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
    >
      {label}
    </Link>
  );
}
