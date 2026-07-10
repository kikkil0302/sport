# Backend Trakmetrik — modèle relationnel & script PostgreSQL

Ce document décrit le modèle de données du backend, indépendamment de l'ORM.
La source de vérité en développement reste `prisma/schema.prisma` (SQLite) ;
ce fichier fournit l'équivalent **PostgreSQL** pour un déploiement en production
ou une reprise du backend dans une autre stack.

## Vue d'ensemble

8 tables, toutes rattachées (directement ou transitivement) à `users` :

| Table | Rôle | Suppression du user |
|---|---|---|
| `users` | Compte (minimisation RGPD : e-mail + hash + pseudo optionnel) | — |
| `sessions` | Sessions de connexion (jeton stocké **hashé SHA-256**) | CASCADE |
| `exercises` | Catalogue d'exercices (`user_id NULL` = exercice intégré) | CASCADE (exercices perso uniquement) |
| `workouts` | Séances d'entraînement datées | CASCADE |
| `workout_sets` | Séries réalisées (réps × charge) | CASCADE via `workouts` |
| `body_weight_entries` | Journal de pesées | CASCADE |
| `programs` | Modèles de séances réutilisables | CASCADE |
| `program_sets` | Séries « modèle » d'un programme | CASCADE via `programs` |

**Invariant RGPD** : `DELETE FROM users WHERE id = ?` doit effacer *toutes* les
données personnelles — chaque nouvelle table liée à `users` doit être en
`ON DELETE CASCADE` et ajoutée à l'export `/api/export`.

## Diagramme entité-relation

```mermaid
erDiagram
    users ||--o{ sessions : "a"
    users ||--o{ workouts : "enregistre"
    users ||--o{ body_weight_entries : "pèse"
    users ||--o{ programs : "compose"
    users |o--o{ exercises : "crée (NULL = intégré)"
    workouts ||--o{ workout_sets : "contient"
    programs ||--o{ program_sets : "contient"
    exercises ||--o{ workout_sets : "référencé par"
    exercises ||--o{ program_sets : "référencé par"

    users {
        text id PK
        text email UK
        text password_hash
        text display_name "NULL"
        timestamptz created_at
    }
    sessions {
        text id PK
        text token_hash UK "SHA-256 du jeton cookie"
        text user_id FK
        timestamptz created_at
        timestamptz expires_at
    }
    exercises {
        text id PK
        text name
        text muscle_group
        text user_id FK "NULL = catalogue intégré"
    }
    workouts {
        text id PK
        text user_id FK
        timestamptz performed_at
        text notes "NULL"
    }
    workout_sets {
        text id PK
        text workout_id FK
        text exercise_id FK
        int set_order
        int reps
        double weight_kg "NULL = poids du corps"
    }
    body_weight_entries {
        text id PK
        text user_id FK
        timestamptz measured_at
        double weight_kg
    }
    programs {
        text id PK
        text user_id FK
        text name
        text description "NULL"
        timestamptz created_at
    }
    program_sets {
        text id PK
        text program_id FK
        text exercise_id FK
        int set_order
        int reps
        double weight_kg "NULL"
    }
```

## Choix de conception

- **Clés primaires `TEXT`** : les identifiants sont des cuid générés côté
  application (comportement Prisma actuel). Alternative pur-SQL : `UUID`
  avec `DEFAULT gen_random_uuid()` — adapter alors le code applicatif.
- **`set_order` et non `order`** : `order` est un mot réservé SQL. Côté
  Prisma, mapper avec `order Int @map("set_order")`.
- **`weight_kg NULL`** = série au poids du corps (comptée 0 dans le volume).
- **Exercices intégrés vs perso** : `user_id NULL` = catalogue commun.
  L'unicité `(name, user_id)` ne couvre pas les `NULL` en SQL standard →
  un **index unique partiel** garantit l'unicité des noms du catalogue intégré.
- **`ON DELETE RESTRICT`** sur `exercise_id` : on ne supprime pas un exercice
  encore référencé par des séries (le catalogue intégré n'est jamais supprimé).
- **`timestamptz`** partout : les dates « calendrier » (séance, pesée) sont
  stockées à minuit **heure locale de saisie** ; l'application fait le
  regroupement par jour/semaine en local (`lib/dates.ts`).
- **Contraintes `CHECK`** : miroir SQL des validations zod (`lib/*/schema.ts`),
  en défense en profondeur — la validation applicative reste la première ligne.

## Script SQL PostgreSQL

```sql
-- Trakmetrik — schéma PostgreSQL (équivalent de prisma/schema.prisma)
-- Testé pour PostgreSQL 14+.

BEGIN;

-- ---------------------------------------------------------------- users
CREATE TABLE users (
    id            TEXT PRIMARY KEY,
    email         TEXT        NOT NULL UNIQUE
                  CHECK (char_length(email) <= 254),
    password_hash TEXT        NOT NULL,          -- "sel:clé" scrypt, jamais le mot de passe
    display_name  TEXT                CHECK (char_length(display_name) <= 50),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------- sessions
CREATE TABLE sessions (
    id         TEXT PRIMARY KEY,
    token_hash TEXT        NOT NULL UNIQUE,      -- SHA-256 du jeton ; le jeton brut ne vit que dans le cookie
    user_id    TEXT        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX sessions_user_id_idx ON sessions (user_id);

-- ------------------------------------------------------------ exercises
CREATE TABLE exercises (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
    muscle_group TEXT NOT NULL,
    user_id      TEXT REFERENCES users (id) ON DELETE CASCADE  -- NULL = exercice intégré
);

-- Unicité du nom par utilisateur…
CREATE UNIQUE INDEX exercises_name_user_id_key
    ON exercises (name, user_id) WHERE user_id IS NOT NULL;
-- …et unicité des noms du catalogue intégré (les NULL échappent à l'unicité standard).
CREATE UNIQUE INDEX exercises_builtin_name_key
    ON exercises (name) WHERE user_id IS NULL;

-- ------------------------------------------------------------- workouts
CREATE TABLE workouts (
    id           TEXT PRIMARY KEY,
    user_id      TEXT        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes        TEXT                 CHECK (char_length(notes) <= 500)
);

CREATE INDEX workouts_user_id_performed_at_idx ON workouts (user_id, performed_at);

-- --------------------------------------------------------- workout_sets
CREATE TABLE workout_sets (
    id          TEXT PRIMARY KEY,
    workout_id  TEXT             NOT NULL REFERENCES workouts (id)  ON DELETE CASCADE,
    exercise_id TEXT             NOT NULL REFERENCES exercises (id) ON DELETE RESTRICT,
    set_order   INTEGER          NOT NULL CHECK (set_order >= 1),
    reps        INTEGER          NOT NULL CHECK (reps BETWEEN 1 AND 200),
    weight_kg   DOUBLE PRECISION          CHECK (weight_kg BETWEEN 0 AND 600)  -- NULL = poids du corps
);

CREATE INDEX workout_sets_workout_id_idx  ON workout_sets (workout_id);
CREATE INDEX workout_sets_exercise_id_idx ON workout_sets (exercise_id);

-- -------------------------------------------------- body_weight_entries
CREATE TABLE body_weight_entries (
    id          TEXT             PRIMARY KEY,
    user_id     TEXT             NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    measured_at TIMESTAMPTZ      NOT NULL,
    weight_kg   DOUBLE PRECISION NOT NULL CHECK (weight_kg BETWEEN 20 AND 400)
);

CREATE INDEX body_weight_entries_user_id_measured_at_idx
    ON body_weight_entries (user_id, measured_at);

-- ------------------------------------------------------------- programs
CREATE TABLE programs (
    id          TEXT        PRIMARY KEY,
    user_id     TEXT        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name        TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
    description TEXT                 CHECK (char_length(description) <= 500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX programs_user_id_idx ON programs (user_id);

-- --------------------------------------------------------- program_sets
CREATE TABLE program_sets (
    id          TEXT PRIMARY KEY,
    program_id  TEXT             NOT NULL REFERENCES programs (id)  ON DELETE CASCADE,
    exercise_id TEXT             NOT NULL REFERENCES exercises (id) ON DELETE RESTRICT,
    set_order   INTEGER          NOT NULL CHECK (set_order >= 1),
    reps        INTEGER          NOT NULL CHECK (reps BETWEEN 1 AND 200),
    weight_kg   DOUBLE PRECISION          CHECK (weight_kg BETWEEN 0 AND 600)
);

CREATE INDEX program_sets_program_id_idx ON program_sets (program_id);

COMMIT;
```

## Seed — catalogue d'exercices intégrés

```sql
INSERT INTO exercises (id, name, muscle_group, user_id) VALUES
    ('ex_squat',              'Squat',                             'Jambes',     NULL),
    ('ex_presse_cuisses',     'Presse à cuisses',                  'Jambes',     NULL),
    ('ex_fentes',             'Fentes',                            'Jambes',     NULL),
    ('ex_leg_curl',           'Leg curl',                          'Jambes',     NULL),
    ('ex_mollets_debout',     'Mollets debout',                    'Jambes',     NULL),
    ('ex_souleve_de_terre',   'Soulevé de terre',                  'Dos',        NULL),
    ('ex_rowing_barre',       'Rowing barre',                      'Dos',        NULL),
    ('ex_tractions',          'Tractions',                         'Dos',        NULL),
    ('ex_tirage_vertical',    'Tirage vertical',                   'Dos',        NULL),
    ('ex_developpe_couche',   'Développé couché',                  'Pectoraux',  NULL),
    ('ex_developpe_incline',  'Développé incliné haltères',        'Pectoraux',  NULL),
    ('ex_pompes',             'Pompes',                            'Pectoraux',  NULL),
    ('ex_ecarte_couche',      'Écarté couché',                     'Pectoraux',  NULL),
    ('ex_developpe_militaire','Développé militaire',               'Épaules',    NULL),
    ('ex_elevations_lat',     'Élévations latérales',              'Épaules',    NULL),
    ('ex_oiseau',             'Oiseau (élévations buste penché)',  'Épaules',    NULL),
    ('ex_curl_biceps',        'Curl biceps',                       'Biceps',     NULL),
    ('ex_curl_marteau',       'Curl marteau',                      'Biceps',     NULL),
    ('ex_dips',               'Dips',                              'Triceps',    NULL),
    ('ex_extensions_triceps', 'Extensions triceps poulie',         'Triceps',    NULL),
    ('ex_crunch',             'Crunch',                            'Abdominaux', NULL),
    ('ex_releves_de_jambes',  'Relevés de jambes',                 'Abdominaux', NULL)
ON CONFLICT DO NOTHING;
```

## Requêtes types (référence)

```sql
-- Volume total soulevé par un utilisateur (Σ réps × charge, PDC = 0)
SELECT COALESCE(SUM(ws.reps * COALESCE(ws.weight_kg, 0)), 0) AS volume_kg
FROM workout_sets ws
JOIN workouts w ON w.id = ws.workout_id
WHERE w.user_id = $1;

-- Volume par semaine (lundi = début de semaine), 8 dernières semaines
SELECT date_trunc('week', w.performed_at) AS semaine,
       SUM(ws.reps * COALESCE(ws.weight_kg, 0)) AS volume_kg
FROM workouts w
JOIN workout_sets ws ON ws.workout_id = w.id
WHERE w.user_id = $1
  AND w.performed_at >= date_trunc('week', now()) - INTERVAL '7 weeks'
GROUP BY 1 ORDER BY 1;

-- Meilleur 1RM estimé (Epley) par jour et par exercice
SELECT w.performed_at::date AS jour, e.name,
       MAX(CASE WHEN ws.reps <= 1 THEN ws.weight_kg
                ELSE ROUND((ws.weight_kg * (1 + ws.reps / 30.0))::numeric, 1)
           END) AS e1rm_kg
FROM workout_sets ws
JOIN workouts  w ON w.id = ws.workout_id
JOIN exercises e ON e.id = ws.exercise_id
WHERE w.user_id = $1 AND ws.weight_kg IS NOT NULL
GROUP BY 1, 2 ORDER BY 1;

-- Purge des sessions expirées (à planifier, ex. pg_cron quotidien)
DELETE FROM sessions WHERE expires_at < now();

-- Droit à l'effacement RGPD : une seule requête, tout part en cascade
DELETE FROM users WHERE id = $1;
```

## Brancher l'application Next.js sur PostgreSQL

L'application utilise Prisma 7 : le passage à Postgres ne demande pas de
réécrire les requêtes, seulement la datasource et l'adaptateur.

1. `npm install @prisma/adapter-pg`
2. `prisma/schema.prisma` : `datasource db { provider = "postgresql" }`,
   et mapper les noms si vous adoptez le snake_case de ce document
   (`@@map("users")`, `order Int @map("set_order")`, etc.).
3. `lib/db.ts` : remplacer `PrismaBetterSqlite3` par `PrismaPg`
   (même forme : `new PrismaPg({ connectionString: process.env.DATABASE_URL })`).
4. `.env` : `DATABASE_URL="postgresql://user:pass@host:5432/fitpilot"`
   (en production : variable d'environnement du hébergeur, jamais commitée).
5. `npx prisma migrate dev` régénérera des migrations Postgres — le script SQL
   ci-dessus sert alors de référence/contrôle, pas de migration à exécuter à la main.
