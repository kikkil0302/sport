import type { DietRestriction, MealId } from "./diet";

// Mémorisation du profil des calculateurs en localStorage UNIQUEMENT :
// conforme à la règle RGPD du site (rien n'est envoyé ni stocké côté serveur).
// Exposé comme « external store » pour useSyncExternalStore (SSR-safe).

export interface StoredProfile {
  sex: string;
  age: string;
  heightCm: string;
  weightKg: string;
  bodyFatPercent?: string;
  activityLevel: string;
  goal: string;
  restrictions: DietRestriction[];
  /** Repas cochés pour le menu de la semaine (absent = tous). */
  meals?: MealId[];
}

const KEY = "trakmetrik.profile.v1";

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeStoredProfile(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// getSnapshot doit renvoyer une référence stable tant que le contenu ne change pas.
let cachedRaw: string | null = null;
let cachedProfile: StoredProfile | null = null;

export function getStoredProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed: unknown = raw === null ? null : JSON.parse(raw);
      cachedProfile =
        typeof parsed === "object" && parsed !== null
          ? (parsed as StoredProfile)
          : null;
    } catch {
      cachedProfile = null;
    }
  }
  return cachedProfile;
}

/** Snapshot côté serveur : jamais de profil (le stockage est 100 % navigateur). */
export function getServerStoredProfile(): null {
  return null;
}

export function saveStoredProfile(profile: StoredProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    return; // Stockage plein ou bloqué : la saisie reste ponctuelle.
  }
  emit();
}

export function clearStoredProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  emit();
}
