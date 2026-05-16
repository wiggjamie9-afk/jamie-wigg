/**
 * Tests for `lib/secrets.ts` (R3) — Replicate-token encrypted store.
 *
 * Uses jsdom's `localStorage` + Node's `webcrypto`, installed inline at
 * the top of this file because T14's writable-file glob excludes a
 * separate setup.ts. Each test starts with a fresh localStorage and a
 * wiped session cache so order doesn't matter.
 */

import { webcrypto } from "node:crypto";

// Install WebCrypto on globalThis before importing the module under test,
// since `secrets.ts` reads `crypto` at module-eval time inside `isBrowser`.
// We use `Object.defineProperty` so the assignment is reversible (the
// capability-detect tests delete `crypto` on a per-test basis).
if (
  typeof (globalThis as { crypto?: { subtle?: unknown } }).crypto === "undefined" ||
  typeof (globalThis as { crypto?: { subtle?: unknown } }).crypto?.subtle ===
    "undefined"
) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
    writable: true,
  });
}

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  setToken,
  getToken,
  hasStoredToken,
  clearToken,
  unlockSession,
  getSessionToken,
  lockSession,
} from "./secrets";

const TOKEN = "r8_test_abcDEF1234567890abcdef1234567890abcd";
const PASS = "correct horse battery staple";
const WRONG = "wrong horse";

beforeEach(() => {
  localStorage.clear();
  lockSession();
});

afterEach(() => {
  localStorage.clear();
  lockSession();
});

describe("setToken / getToken round-trip", () => {
  it("decrypts back to the original plaintext with the correct passphrase", async () => {
    await setToken(TOKEN, PASS);
    const out = await getToken(PASS);
    expect(out).toBe(TOKEN);
  });

  it("returns null when the passphrase is wrong (catches AES-GCM tag failure)", async () => {
    await setToken(TOKEN, PASS);
    const out = await getToken(WRONG);
    expect(out).toBeNull();
  });

  it("returns null when nothing is stored — no throw", async () => {
    expect(await getToken(PASS)).toBeNull();
  });

  it("setToken throws when token is empty", async () => {
    await expect(setToken("", PASS)).rejects.toThrow(/token is empty/);
  });

  it("setToken throws when passphrase is empty", async () => {
    await expect(setToken(TOKEN, "")).rejects.toThrow(/passphrase is empty/);
  });
});

describe("hasStoredToken", () => {
  it("is false before anything is stored", () => {
    expect(hasStoredToken()).toBe(false);
  });

  it("is true after setToken", async () => {
    await setToken(TOKEN, PASS);
    expect(hasStoredToken()).toBe(true);
  });

  it("is false again after clearToken", async () => {
    await setToken(TOKEN, PASS);
    clearToken();
    expect(hasStoredToken()).toBe(false);
  });

  it("is false for malformed stored payloads", () => {
    localStorage.setItem("rhythmix_token_v1", "not json");
    expect(hasStoredToken()).toBe(false);

    localStorage.setItem(
      "rhythmix_token_v1",
      JSON.stringify({ ciphertext: 1, iv: "x", salt: "x" }),
    );
    expect(hasStoredToken()).toBe(false);
  });
});

describe("clearToken", () => {
  it("removes the localStorage entry", async () => {
    await setToken(TOKEN, PASS);
    expect(localStorage.getItem("rhythmix_token_v1")).not.toBeNull();
    clearToken();
    expect(localStorage.getItem("rhythmix_token_v1")).toBeNull();
  });

  it("also wipes session cache", async () => {
    await setToken(TOKEN, PASS);
    expect(await unlockSession(PASS)).toBe(true);
    expect(getSessionToken()).toBe(TOKEN);
    clearToken();
    expect(getSessionToken()).toBeNull();
  });
});

describe("unlockSession / getSessionToken / lockSession", () => {
  it("unlockSession returns false when nothing is stored", async () => {
    expect(await unlockSession(PASS)).toBe(false);
    expect(getSessionToken()).toBeNull();
  });

  it("unlockSession returns false on wrong passphrase", async () => {
    await setToken(TOKEN, PASS);
    expect(await unlockSession(WRONG)).toBe(false);
    expect(getSessionToken()).toBeNull();
  });

  it("unlockSession caches the plaintext token for synchronous reads", async () => {
    await setToken(TOKEN, PASS);
    expect(getSessionToken()).toBeNull();
    expect(await unlockSession(PASS)).toBe(true);
    expect(getSessionToken()).toBe(TOKEN);
  });

  it("lockSession clears the cached token", async () => {
    await setToken(TOKEN, PASS);
    await unlockSession(PASS);
    expect(getSessionToken()).toBe(TOKEN);
    lockSession();
    expect(getSessionToken()).toBeNull();
  });

  it("lockSession is idempotent", () => {
    expect(() => {
      lockSession();
      lockSession();
    }).not.toThrow();
  });

  it("a fresh unlock with a new passphrase replaces the cache", async () => {
    await setToken(TOKEN, PASS);
    await unlockSession(PASS);
    expect(getSessionToken()).toBe(TOKEN);

    // Re-encrypt under a different passphrase. unlock with the new one.
    const NEW_PASS = "new pass";
    await setToken(TOKEN, NEW_PASS);
    expect(await unlockSession(NEW_PASS)).toBe(true);
    expect(getSessionToken()).toBe(TOKEN);
  });
});

describe("salt + IV randomness — no deterministic ciphertext", () => {
  it("two setToken calls with the same inputs produce different ciphertext", async () => {
    await setToken(TOKEN, PASS);
    const first = localStorage.getItem("rhythmix_token_v1")!;
    await setToken(TOKEN, PASS);
    const second = localStorage.getItem("rhythmix_token_v1")!;

    expect(first).not.toBe(second);
    const a = JSON.parse(first);
    const b = JSON.parse(second);
    // Both salt and IV should be unique per call.
    expect(a.salt).not.toBe(b.salt);
    expect(a.iv).not.toBe(b.iv);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });

  it("payload has base64 ciphertext / iv / salt of expected lengths", async () => {
    await setToken(TOKEN, PASS);
    const payload = JSON.parse(localStorage.getItem("rhythmix_token_v1")!);
    // 16-byte salt → 24 chars base64; 12-byte IV → 16 chars base64.
    expect(payload.salt).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(payload.iv).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(atob(payload.salt).length).toBe(16);
    expect(atob(payload.iv).length).toBe(12);
  });
});

describe("SSR safety", () => {
  // Helper that simulates SSR by replacing `window`/`crypto` with undefined
  // through Object.defineProperty so we don't depend on jsdom letting us
  // `delete` the global directly (some jsdom builds make it non-configurable).
  function withoutWindow<T>(body: () => T): T {
    const desc = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    try {
      return body();
    } finally {
      if (desc) Object.defineProperty(globalThis, "window", desc);
      else delete (globalThis as { window?: unknown }).window;
    }
  }

  it("hasStoredToken returns false when window is undefined", () => {
    withoutWindow(() => {
      expect(hasStoredToken()).toBe(false);
    });
  });

  it("getToken resolves to null when window is undefined", async () => {
    const res = await withoutWindow(async () => getToken(PASS));
    expect(res).toBeNull();
  });

  it("unlockSession resolves to false when window is undefined", async () => {
    const res = await withoutWindow(async () => unlockSession(PASS));
    expect(res).toBe(false);
  });

  it("clearToken does not throw when window is undefined", () => {
    withoutWindow(() => {
      expect(() => clearToken()).not.toThrow();
    });
  });

  // Touch `vi` so the import isn't a lint warning in case the suite is
  // tightened later.
  it("vi is available", () => {
    expect(vi).toBeDefined();
  });
});
