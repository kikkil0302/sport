<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FitPilot

Site de fitness/diététique en français : calculateurs nutrition (BMR/TDEE/macros/IMC),
journal de séances, programmes réutilisables, stats de progression, auth maison, RGPD.
Convention : code et identifiants en anglais, textes UI en français.

## Commandes

- `npm run dev` — serveur de dev (Turbopack), http://localhost:3000
- `npm test` — vitest (tests unitaires + un test d'intégration DB contre `prisma/dev.db`)
- `npm run build` / `npm run lint` — build Next 16 / ESLint
- `npx prisma migrate dev --name <nom>` — migration ; **`migrate dev` ne régénère PAS
  le client : lancer `npx prisma generate` après tout changement de schéma**
- `npx prisma db seed` — seed des 22 exercices intégrés (idempotent)

## Architecture

- **Next.js 16 App Router + TypeScript + Tailwind 4** ; validation zod 4 partout.
- **Prisma 7 + SQLite** : architecture à driver adapter
  (`@prisma/adapter-better-sqlite3`). Client généré dans `lib/generated/prisma`
  (gitignoré + eslint-ignoré). `DATABASE_URL="file:./prisma/dev.db"` dans `.env`,
  chargé par `prisma.config.ts` (dotenv) pour la CLI et par Next au runtime.
  Singleton dans `lib/db.ts`.
- **Domaine pur dans `lib/`** (`nutrition/`, `workouts/`, `stats/`) : fonctions
  sans I/O, testées ; les composants et actions ne contiennent pas de logique métier.
- **Auth maison** (`lib/auth/`) : scrypt (node:crypto) pour les mots de passe,
  sessions 30 j en cookie httpOnly `fitpilot_session`, seul le SHA-256 du token
  est stocké en base. `getSessionUser()` est mis en cache React par requête.
- **Mutations = server actions** (`app/actions/*.ts`) : chaque action revérifie la
  session ET la propriété de la ressource (`userId`). Les formulaires clients
  utilisent `useActionState` ; les boutons de suppression sont des `<form>` avec
  action liée (`.bind`).
- **Graphiques** : SVG maison dans `components/charts/` (tokens CSS `.viz-root`
  dans `globals.css`, palette validée daltonisme, modes clair/sombre séparés).
  Avant toute modification de graphique, lire le skill `dataviz`.

## RGPD (à préserver dans toute évolution)

- Minimisation : User = email + hash + nom d'affichage optionnel, rien d'autre.
- Les calculateurs `/calculateurs` tournent 100 % côté client (aucune donnée envoyée).
- Consentement obligatoire à l'inscription ; politique : `/confidentialite`.
- Export portabilité : `GET /api/export` (jamais de passwordHash/tokenHash dedans).
- Droit à l'effacement : suppression de compte sur `/compte`, cascade Prisma complète
  (toute nouvelle table liée à User DOIT avoir `onDelete: Cascade` et être ajoutée
  à l'export).

## Pièges connus

- eslint `react-hooks/purity` interdit `Date.now()`/`new Date()` dans le rendu des
  composants serveur → mettre la logique temporelle dans un helper `lib/` avec
  paramètre `now` injectable.
- `upsert` Prisma ne cible pas un unique composé contenant NULL
  (ex. `@@unique([name, userId])` avec userId null) → `findFirst` + create/update.
- Les champs de charge acceptent la virgule décimale française (remplacée par un
  point avant `Number()`).
