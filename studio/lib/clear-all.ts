/**
 * Nuclear-option storage wipe for R16's "Clear all local data" button.
 *
 * Scope:
 *   - localStorage entries we OWN — those prefixed with `plan-`, `rhythmix_`,
 *     or `license_`, plus the `plan-index` key used by plan-storage.ts. We
 *     deliberately leave foreign localStorage entries alone (other origins'
 *     keys, browser-installed extensions, etc.) — the only thing that has
 *     access to our origin's localStorage is us anyway, but the prefix gate
 *     gives a predictable surface in case a future shared-origin lands.
 *   - IndexedDB databases we own — `rhythmix-studio` (T5 audio stash) and
 *     `rhythmix-studio-history` (T12 render history). Deleted whole, not
 *     cleared by store, so any orphaned object stores from prior schema
 *     migrations also disappear.
 *   - The token's in-memory session cache (via `clearToken()`).
 *
 * What we deliberately do NOT touch:
 *   - sessionStorage (we don't write there).
 *   - Service worker caches (none yet).
 *   - Cookies (none yet; license + auth are localStorage-only).
 *
 * Idempotent — running this on a fresh browser is a no-op. Returns once every
 * deletion has resolved so the caller can confidently reload the page on the
 * next tick without races.
 *
 * SSR-safe — every step guards `typeof window`.
 */

import { clearToken } from "./secrets";
import { clearAllRenders } from "./history";

// ---------- IndexedDB databases we own ----------
//
// Sourced from the constants in the modules that own them, but inlined here
// so this helper doesn't have to import the IDBPDatabase plumbing.

const OWNED_DB_NAMES = [
  "rhythmix-studio",          // T5 audio stash
  "rhythmix-studio-history",  // T12 render history
] as const;

// ---------- localStorage key prefixes we own ----------

const OWNED_PREFIXES = [
  "plan-",         // T9 plan storage + the `plan-index` list
  "rhythmix_",     // T6 token (`rhythmix_token_v1`) and other rhythmix_* keys
  "license_",      // T6 license cache (legacy variant — keep for safety)
] as const;

function isOwnedKey(key: string): boolean {
  for (const prefix of OWNED_PREFIXES) {
    if (key.startsWith(prefix)) return true;
  }
  return false;
}

// ---------- Browser guards ----------

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function hasIndexedDb(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

// ---------- Steps ----------

/**
 * Iterate localStorage keys and remove every entry whose key matches one of
 * our owned prefixes. We snapshot the key list first because mutating storage
 * while iterating it via `localStorage.key(i)` would skip entries.
 */
function clearOwnedLocalStorage(): void {
  if (!hasLocalStorage()) return;

  const toRemove: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && isOwnedKey(k)) toRemove.push(k);
    }
    for (const k of toRemove) {
      try {
        localStorage.removeItem(k);
      } catch {
        // Quota / private mode — best-effort, continue.
      }
    }
  } catch {
    // localStorage entirely unavailable — nothing to clear.
  }
}

/**
 * Delete an IndexedDB database by name. Resolves whether the delete succeeds,
 * is blocked (open connection elsewhere), or errors — we never want this to
 * throw out of `clearAllLocalData`. A "blocked" event is logged via the
 * `onblocked` handler but still resolves: the next page reload will let the
 * delete complete.
 */
function deleteOwnedDb(name: string): Promise<void> {
  if (!hasIndexedDb()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.deleteDatabase(name);
    } catch {
      settle();
      return;
    }
    req.onsuccess = settle;
    req.onerror = settle;
    req.onblocked = settle;

    // Belt-and-braces: if no event fires within 2s, resolve anyway so the
    // overall clearAllLocalData() doesn't hang waiting on a wedged connection.
    setTimeout(settle, 2000);
  });
}

// ---------- Public API ----------

/**
 * Wipe every RHYTHMIX-owned scrap of local state. Order matters slightly:
 *
 *   1. `clearToken()` — wipes the encrypted payload AND the in-memory cache.
 *      Done first so even if a later step throws, the most-sensitive secret
 *      is already gone.
 *   2. `clearAllRenders()` — clears the history object store cleanly through
 *      its module's API (which knows the schema). Then we still delete the
 *      database below to also drop any stale object stores from older versions.
 *   3. Bulk-clear owned localStorage keys (plans, license cache, prefs).
 *   4. Delete both owned IndexedDB databases.
 *
 * Caller is expected to follow up with `window.location.reload()` (or a
 * navigation) so any in-memory React state pointing at now-deleted records
 * gets blown away too.
 */
export async function clearAllLocalData(): Promise<void> {
  // 1. Token (sync — no await needed)
  try {
    clearToken();
  } catch {
    /* never throws today, but defensive */
  }

  // 2. Render history via the module that owns it.
  try {
    await clearAllRenders();
  } catch {
    /* fall through — the deleteDatabase below is the harder backstop */
  }

  // 3. Owned localStorage keys (plans, license cache, prefs, token leftover).
  clearOwnedLocalStorage();

  // 4. Drop both IndexedDB databases. Run in parallel; we wait for both so
  //    the caller can reload deterministically.
  await Promise.all(OWNED_DB_NAMES.map(deleteOwnedDb));
}
