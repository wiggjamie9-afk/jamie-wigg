/**
 * Replicate-token secrets store (R3).
 *
 * Encryption:
 *   - Algorithm: AES-GCM 256-bit, IV is a fresh 12-byte random per encrypt.
 *   - KDF: PBKDF2-HMAC-SHA-256, 200,000 iterations, fresh 16-byte salt per save.
 *   - Persistence: `{ ciphertext, iv, salt }` each base64 in
 *     `localStorage.rhythmix_token_v1`. The passphrase is NEVER persisted.
 *
 * Session cache:
 *   - The derived key (and the decrypted token) live in module-scoped variables
 *     ONLY. We never write them to storage of any kind.
 *   - `unlockSession(passphrase)` populates the in-memory cache.
 *   - `lockSession()` wipes it. A `beforeunload` listener (registered once) also
 *     wipes it on tab close so a quick "back" doesn't replay the unlocked state.
 *   - `getToken(passphrase)` decrypts on demand WITHOUT caching; that's
 *     deliberately distinct from `unlockSession` so callers that need a one-shot
 *     decrypt (e.g. validating a freshly-pasted token) don't accidentally
 *     unlock the tab session.
 *
 * SSR-safe:
 *   - Every public function guards `typeof window === "undefined"`. The
 *     `beforeunload` listener is registered lazily on first call.
 *
 * What we deliberately don't do:
 *   - We don't log the token, the passphrase, the derived key, or any
 *     plaintext. `console.error` callsites stick to opaque labels.
 *   - We don't support passphrase rotation in-place. If the user wants to
 *     change their passphrase they re-enter both passphrase + token and call
 *     `setToken` again — that re-runs the KDF with a fresh salt.
 */

const STORAGE_KEY = "rhythmix_token_v1";
const PBKDF2_ITERATIONS = 200_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BITS = 256;

type StoredPayload = {
  /** base64 — AES-GCM ciphertext (includes the auth tag). */
  ciphertext: string;
  /** base64 — 12-byte IV used for this ciphertext. */
  iv: string;
  /** base64 — 16-byte salt used for PBKDF2. */
  salt: string;
};

// ---------- Module-scoped in-memory state ----------
//
// Both are `null` until `unlockSession` succeeds. `lockSession` and the
// `beforeunload` listener both reset them. We hold the plaintext token too so
// the render flow can grab it synchronously via `getSessionToken()` without
// re-running PBKDF2 every time it needs to make a Replicate request.

let sessionDerivedKey: CryptoKey | null = null;
let sessionToken: string | null = null;
let unloadListenerInstalled = false;

// ---------- SSR / browser guards ----------

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof crypto !== "undefined";
}

function ensureUnloadListener(): void {
  if (unloadListenerInstalled) return;
  if (typeof window === "undefined") return;
  unloadListenerInstalled = true;
  // Use a regular listener (not `{ once: true }`) so a soft-navigation
  // away-and-back inside an SPA still re-arms it via this same module load.
  window.addEventListener("beforeunload", () => {
    lockSession();
  });
}

// ---------- base64 helpers (no Buffer; we're browser-only) ----------

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

// ---------- WebCrypto core ----------

async function deriveKey(
  passphrase: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: KEY_BITS },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptToken(
  token: string,
  key: CryptoKey,
  iv: Uint8Array<ArrayBuffer>,
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(token),
  );
  return new Uint8Array(cipher);
}

async function decryptToken(
  payload: StoredPayload,
  key: CryptoKey,
): Promise<string> {
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.ciphertext);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(plain);
}

function readStoredPayload(): StoredPayload | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPayload;
    if (
      !parsed ||
      typeof parsed.ciphertext !== "string" ||
      typeof parsed.iv !== "string" ||
      typeof parsed.salt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// ---------- Public API ----------

/**
 * Encrypt `token` under `passphrase` and write the payload to localStorage.
 * Generates a fresh salt + IV every call; replaces any previous payload.
 * Does NOT touch the session cache — callers that want the token live in
 * memory for the tab should follow up with `unlockSession`.
 */
export async function setToken(
  token: string,
  passphrase: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error("setToken: not available outside the browser.");
  }
  if (!token) throw new Error("setToken: token is empty.");
  if (!passphrase) throw new Error("setToken: passphrase is empty.");

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await encryptToken(token, key, iv);

  const payload: StoredPayload = {
    ciphertext: bytesToBase64(ciphertext),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * One-shot decrypt — does not populate the session cache. Returns null if
 * there's nothing stored OR if decryption fails (wrong passphrase, tampered
 * payload). Callers can't distinguish the two cases on purpose: a UI that
 * surfaces "wrong passphrase" vs "no token" calls `hasStoredToken()` first.
 */
export async function getToken(passphrase: string): Promise<string | null> {
  if (!isBrowser()) return null;
  const payload = readStoredPayload();
  if (!payload) return null;
  try {
    const salt = base64ToBytes(payload.salt);
    const key = await deriveKey(passphrase, salt);
    return await decryptToken(payload, key);
  } catch {
    return null;
  }
}

/** Synchronous — only checks for presence, never decrypts. */
export function hasStoredToken(): boolean {
  return readStoredPayload() !== null;
}

/** Remove the encrypted payload AND wipe any cached session state. */
export function clearToken(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode / quota — nothing to do */
  }
  lockSession();
}

/**
 * Decrypt with `passphrase` and cache both the derived key and the plaintext
 * token in module memory for the rest of the tab session. Returns `true` on
 * success, `false` if there's no stored token or the passphrase is wrong.
 *
 * Idempotent: a successful re-unlock with a new passphrase replaces the cache.
 */
export async function unlockSession(passphrase: string): Promise<boolean> {
  if (!isBrowser()) return false;
  const payload = readStoredPayload();
  if (!payload) return false;
  try {
    const salt = base64ToBytes(payload.salt);
    const key = await deriveKey(passphrase, salt);
    const token = await decryptToken(payload, key);
    sessionDerivedKey = key;
    sessionToken = token;
    ensureUnloadListener();
    return true;
  } catch {
    return false;
  }
}

/**
 * The plaintext token if the tab session is unlocked; null otherwise.
 * Synchronous because the render-runner needs to attach it to every
 * Replicate request without an `await` on the hot path.
 */
export function getSessionToken(): string | null {
  return sessionToken;
}

/** Wipe the in-memory derived key + token. Idempotent. */
export function lockSession(): void {
  sessionDerivedKey = null;
  sessionToken = null;
}
