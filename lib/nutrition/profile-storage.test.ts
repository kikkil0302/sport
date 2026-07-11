import { afterEach, describe, expect, it, vi } from "vitest";
import type { StoredProfile } from "./profile-storage";

const KEY = "trakmetrik.profile.v1";

const SAMPLE: StoredProfile = {
  sex: "male",
  age: "30",
  heightCm: "180",
  weightKg: "80",
  activityLevel: "moderate",
  goal: "maintain",
  restrictions: ["vegan"],
};

/** In-memory localStorage; `throwing` simulates a full/blocked quota. */
function makeLocalStorage(throwing = false) {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => {
      if (throwing) throw new Error("blocked");
      return store.has(k) ? store.get(k)! : null;
    },
    setItem: (k: string, v: string) => {
      if (throwing) throw new Error("full");
      store.set(k, v);
    },
    removeItem: (k: string) => void store.delete(k),
  };
}

/** Fresh module (module-level cache reset) with a stubbed window/localStorage. */
async function load(options: { raw?: string; throwing?: boolean } = {}) {
  vi.resetModules();
  const ls = makeLocalStorage(options.throwing);
  if (options.raw !== undefined) ls.setItem(KEY, options.raw);
  vi.stubGlobal("window", { localStorage: ls });
  return import("./profile-storage");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("profile-storage", () => {
  it("returns null when nothing is stored", async () => {
    const { getStoredProfile } = await load();
    expect(getStoredProfile()).toBeNull();
  });

  it("round-trips a saved profile", async () => {
    const mod = await load();
    mod.saveStoredProfile(SAMPLE);
    expect(mod.getStoredProfile()).toEqual(SAMPLE);
  });

  it("returns a stable reference while the content is unchanged", async () => {
    const mod = await load({ raw: JSON.stringify(SAMPLE) });
    expect(mod.getStoredProfile()).toBe(mod.getStoredProfile());
  });

  it("returns null for corrupt JSON", async () => {
    const { getStoredProfile } = await load({ raw: "{not valid json" });
    expect(getStoredProfile()).toBeNull();
  });

  it("returns null when the stored value is not an object", async () => {
    const { getStoredProfile } = await load({ raw: '"just a string"' });
    expect(getStoredProfile()).toBeNull();
  });

  it("returns null (no throw) when localStorage access is blocked", async () => {
    const { getStoredProfile } = await load({ throwing: true });
    expect(getStoredProfile()).toBeNull();
  });

  it("swallows quota errors on save", async () => {
    const { saveStoredProfile } = await load({ throwing: true });
    expect(() => saveStoredProfile(SAMPLE)).not.toThrow();
  });

  it("clears a stored profile", async () => {
    const mod = await load();
    mod.saveStoredProfile(SAMPLE);
    mod.clearStoredProfile();
    expect(mod.getStoredProfile()).toBeNull();
  });

  it("notifies subscribers on save and clear", async () => {
    const mod = await load();
    const listener = vi.fn();
    const unsubscribe = mod.subscribeStoredProfile(listener);
    mod.saveStoredProfile(SAMPLE);
    mod.clearStoredProfile();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    mod.saveStoredProfile(SAMPLE);
    expect(listener).toHaveBeenCalledTimes(2); // plus after unsubscribe
  });

  it("never exposes a profile on the server", async () => {
    const { getServerStoredProfile } = await load();
    expect(getServerStoredProfile()).toBeNull();
  });
});
