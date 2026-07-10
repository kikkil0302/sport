<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Trakmetrik

Site de fitness/diététique en français : calculateurs nutrition (BMR/TDEE/macros/IMC),
journal de séances, programmes réutilisables, stats de progression, auth par sessions, RGPD.
Convention : code et identifiants en anglais, textes UI en français.

**Ce dépôt est le frontend uniquement.** Toutes les données vivent dans le backend
Spring Boot (`C:\Users\xrang\IdeaProjects\sport`, PostgreSQL 17 sous Docker,
API REST sur `http://localhost:8080`). Le contrat d'API est documenté dans le
`README.md` du backend ; le modèle relationnel dans `BACKEND.md` ici.

## Commandes

- `npm run dev` — serveur de dev (Turbopack), http://localhost:3000.
  **Prérequis : le backend doit tourner** (`./mvnw spring-boot:run` dans
  `IdeaProjects/sport` ; il démarre lui-même Postgres via Docker compose).
- `npm test` — vitest (tests unitaires du domaine nutrition + schémas zod)
- `npm run build` / `npm run lint` — build Next 16 / ESLint

## Architecture

- **Next.js 16 App Router + TypeScript + Tailwind 4** ; validation zod 4 des
  formulaires avant appel API (messages français immédiats ; le backend revalide tout).
- **Couche API dans `lib/api/`** : `client.ts` (fetch vers `BACKEND_URL`, défaut
  `http://localhost:8080`, relaie le cookie de session, erreurs `ApiError` au
  contrat `{"error": "message français"}`), `types.ts` (DTO du backend),
  `index.ts` (une fonction par endpoint). Tout accès aux données passe par là —
  aucune base de données côté frontend.
- **Domaine pur dans `lib/nutrition/`** : les calculateurs tournent côté client,
  sans I/O, testés. Les calculs séances/stats (volume, 1RM Epley, agrégats hebdo)
  sont faits par le backend (`GET /api/stats`).
- **Auth par sessions backend** (`lib/auth/session.ts`) : le backend émet le cookie
  httpOnly `fitpilot_session` (30 j, jeton hashé SHA-256 en base) ; le frontend le
  relaie via `applySessionCookie()` et résout l'utilisateur avec `GET /api/auth/me`
  (`getSessionUser()` en cache React par requête).
- **Mutations = server actions** (`app/actions/*.ts`) : elles appellent l'API, qui
  revérifie session ET propriété de la ressource. Les formulaires clients utilisent
  `useActionState` ; les boutons de suppression sont des `<form>` avec action liée
  (`.bind`). Les erreurs backend (françaises) sont renvoyées telles quelles au formulaire.
- **Graphiques** : SVG maison dans `components/charts/` (tokens CSS `.viz-root`
  dans `globals.css`, palette validée daltonisme, modes clair/sombre séparés).
  Avant toute modification de graphique, lire le skill `dataviz`.

## RGPD (à préserver dans toute évolution)

- Minimisation : User = email + hash + nom d'affichage optionnel, rien d'autre.
- Les calculateurs `/calculateurs` tournent 100 % côté client (aucune donnée envoyée).
- Consentement obligatoire à l'inscription ; politique : `/confidentialite`.
- Export portabilité : `GET /api/export` (proxy du backend ; jamais de
  passwordHash/tokenHash dedans).
- Droit à l'effacement : suppression de compte sur `/compte` → `DELETE /api/account`
  (cascade SQL complète côté backend ; toute nouvelle table liée à `users` DOIT être
  en `ON DELETE CASCADE` et ajoutée à l'export — règle tenue dans le repo backend).

## Pièges connus

- eslint `react-hooks/purity` interdit `Date.now()`/`new Date()` dans le rendu des
  composants serveur → mettre la logique temporelle dans un helper `lib/` avec
  paramètre `now` injectable.
- Les dates « calendrier » (séance, pesée) transitent en `"YYYY-MM-DD"` (LocalDate) ;
  les instants en ISO. Parser les LocalDate avec `parseDateInput()` (minuit local),
  jamais `new Date("YYYY-MM-DD")` (minuit UTC → décalage de jour à l'affichage).
- Les champs de charge acceptent la virgule décimale française (remplacée par un
  point avant `Number()`).
- `lib/generated/` et `prisma/dev.db` sont des vestiges de l'ancienne persistance
  Prisma/SQLite locale (supprimée au profit du backend) : ignorés par git, eslint
  et tsconfig — ne pas les référencer.
