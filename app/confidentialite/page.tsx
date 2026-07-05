import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Trakmetrik protège vos données : minimisation, calculs côté client, conformité RGPD, export et suppression de compte.",
  alternates: { canonical: "/confidentialite" },
};

const SECTIONS = [
  {
    title: "Données collectées",
    body: "Avec un compte : votre adresse e-mail, un nom d'affichage optionnel, une empreinte cryptographique (hash) de votre mot de passe — jamais le mot de passe lui-même — et des jetons de session. Sans compte : les calculateurs (calories, macros, IMC) fonctionnent entièrement dans votre navigateur ; aucune donnée n'est transmise ni stockée sur nos serveurs.",
  },
  {
    title: "Finalités et base légale",
    body: "Vos données servent uniquement à vous authentifier et à enregistrer votre suivi sportif (séances, programmes, performances). La base légale est l'exécution du service que vous demandez (article 6.1.b du RGPD). Aucune donnée n'est vendue, partagée ou utilisée à des fins publicitaires.",
  },
  {
    title: "Cookies",
    body: "Un unique cookie de session (httpOnly, sécurisé) maintient votre connexion pendant 30 jours. Aucun cookie de mesure d'audience ou de traçage n'est déposé.",
  },
  {
    title: "Durée de conservation",
    body: "Vos données sont conservées tant que votre compte est actif. Les sessions expirent automatiquement après 30 jours. La suppression de votre compte efface immédiatement et définitivement l'ensemble de vos données.",
  },
  {
    title: "Vos droits",
    body: "Vous disposez des droits d'accès, de rectification, d'effacement et de portabilité de vos données. La suppression du compte est disponible directement depuis la page « Mon compte », sans nous contacter. L'export de vos données au format JSON sera disponible depuis la même page.",
  },
  {
    title: "Sécurité",
    body: "Les mots de passe sont hachés avec l'algorithme scrypt (sel unique par utilisateur). Les jetons de session sont stockés hachés en base : même en cas de fuite de la base de données, vos sessions et mots de passe restent inexploitables.",
  },
] as const;

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Trakmetrik applique le principe de minimisation des données du RGPD :
        nous ne collectons que ce qui est strictement nécessaire au
        fonctionnement du service.
      </p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map(({ title, body }) => (
          <section key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {body}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
        Dernière mise à jour : 2 juillet 2026.
      </p>
    </div>
  );
}
