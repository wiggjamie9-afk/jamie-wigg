/**
 * Local render history (R7, R8) — pure-TS IndexedDB module.
 *
 * Why a separate database from `audio-blob.ts`:
 *   - Audio Blobs (`rhythmix-studio` / `audio-stash`) are short-lived: stashed
 *     at upload, read once in the plan editor, then effectively orphaned.
 *   - Render history (`rhythmix-studio-history` / `renders`) is durable: the
 *     user expects past renders to persist across sessions.
 *   - Co-tenanting them in one database tangles quota lifecycles: a `clearAll`
 *     for one would have to be surgical about leaving the other alone. The
 *     separation here lets `clearAllRenders()` (R16's helper) wipe an entire
 *     DB without touching the audio stash.
 *
 * Why `idb`: the wrapper hides IndexedDB's request/event model behind a
 * promise-first API. The package isn't installed in this branch — the import
 * stays unresolved at runtime until a follow-up commit adds it to
 * `studio/package.json`, but the types are referenced statically so this
 * module type-checks today.
 *
 * Eviction policy (R7):
 *   The 50-cap is enforced *one entry at a time, per `saveRender` call*.
 *   After a successful put we peek `count()`; if over cap, we open a cursor
 *   on the `createdAt` index ascending, delete the oldest record, and fire
 *   exactly one `history:evicted` toast. This is deliberately conservative:
 *   if a user somehow ends up with 80 records (DB seeded externally, multi-
 *   tab race, etc.), repeated saves trim them down rather than one save
 *   nuking thirty entries unexpectedly.
 *
 * SSR safety:
 *   Every public function short-circuits if `typeof window === 'undefined'`,
 *   because Next.js's static export still runs the module body during build.
 */

import { openDB, type IDBPDatabase } from "idb";

// ---------- Public types ----------

export type Aspect = "16:9" | "9:16" | "1:1";

export type RenderMeta = {
  /** Unique render id — distinct from `planId`; same plan rendered twice yields two ids. */
  id: string;
  planId: string;
  theme: string;
  bpm: number | null;
  aspect: Aspect;
  audioDurationSec: number;
  sceneCount: number;
  failedSceneIds: string[];
  /** Epoch ms. */
  createdAt: number;
  /**
   * Module-scoped monotonic counter, written alongside `createdAt`. Two saves
   * in the same `Date.now()` ms would otherwise tie on the `createdAt` index
   * and let the eviction cursor pick an arbitrary "oldest"; `seq` resolves the
   * tie deterministically (lower seq = older). Optional for rows written
   * before this field landed; missing values are treated as 0 when sorting.
   */
  seq?: number;
};

export type ToastEvent = {
  type: "history:evicted";
  victimId: string;
  victimTheme: string;
};

export type ToastHandler = (event: ToastEvent) => void;

// ---------- Constants ----------

const DB_NAME = "rhythmix-studio-history";
const DB_VERSION = 1;
const STORE_NAME = "renders";
const CREATED_AT_INDEX = "createdAt";

/** R7 cap. Renders beyond this trigger one-at-a-time eviction on `saveRender`. */
export const MAX_RENDERS = 50;

/**
 * Module-scoped monotonic counter for `seq`. Incremented on every successful
 * `saveRender`; lives only for the lifetime of the JS module (so a page reload
 * resets it). That's fine: rows from a previous session already have stable
 * `(createdAt, seq)` pairs persisted in IndexedDB and never collide with this
 * session's seq values because they're paired with their own historical
 * `createdAt`. Within a single session, monotonicity is preserved.
 */
let nextSeq = 0;

/**
 * Row layout in IndexedDB. Stored Blobs are native — never base64; that would
 * inflate the payload ~33% and defeat the point of using IndexedDB.
 */
type RenderRow = {
  meta: RenderMeta;
  mp4: Blob;
  thumbnail: Blob;
};

// ---------- Browser-only guard ----------

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

// ---------- DB lifecycle ----------

/**
 * Open the history DB. Each call returns a fresh connection; callers are
 * expected to `.close()` (or rely on the helper functions below which do so
 * deterministically). We don't cache a singleton because the `idb` types are
 * generic and a cached connection would need a parameterised module-level
 * variable that's awkward to invalidate on `clearAllRenders()`.
 */
async function openHistoryDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "meta.id" });
        store.createIndex(CREATED_AT_INDEX, "meta.createdAt", { unique: false });
      }
    },
  });
}

// ---------- ID generation ----------

/**
 * Distinct from `audio-blob.generateId()` so a stray collision between the
 * audio stash key-space and the render id-space can never confuse logs.
 * Prefers `crypto.randomUUID()` (≥120 bits of entropy, no parsing needed) and
 * falls back to a hex-encoded random buffer for older browsers that pre-date
 * the API (notably some 2021-vintage iOS Safari builds).
 */
function generateRenderId(): string {
  const c = (
    typeof globalThis !== "undefined"
      ? (globalThis as { crypto?: Crypto }).crypto
      : undefined
  );
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  // Fallback: 16 random bytes → hex. Same entropy ballpark as a UUID without
  // the dashes, which is fine for keys we don't ever parse.
  const bytes = new Uint8Array(16);
  (c ?? crypto).getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------- Public API ----------

/**
 * Persist a render. Returns the assigned render id. After insertion, enforces
 * the 50-cap by evicting *one* oldest entry if `count() > 50`; on eviction the
 * optional `onToast` callback fires exactly once per `saveRender` invocation.
 *
 * Callback over event-bus: the toast handler is supplied per call so the UI
 * layer that owns the render flow (T11's render-progress component) can wire
 * its own toast portal without history.ts taking a hard dependency on any
 * React state. Same pattern as the render-runner's `onEvent`.
 */
export async function saveRender(
  meta: Omit<RenderMeta, "id" | "createdAt">,
  mp4: Blob,
  thumbnail: Blob,
  onToast?: ToastHandler,
): Promise<string> {
  if (!isBrowser()) {
    throw new Error("saveRender: IndexedDB not available (SSR).");
  }

  const id = generateRenderId();
  const fullMeta: RenderMeta = {
    ...meta,
    id,
    createdAt: Date.now(),
    seq: nextSeq++,
  };
  const row: RenderRow = { meta: fullMeta, mp4, thumbnail };

  const db = await openHistoryDb();
  try {
    // 1. Put the new record.
    await db.put(STORE_NAME, row);

    // 2. Enforce the cap. One eviction per call (R7) — see module header.
    const count = await db.count(STORE_NAME);
    if (count > MAX_RENDERS) {
      const evicted = await evictOldest(db);
      if (evicted && onToast) {
        onToast({
          type: "history:evicted",
          victimId: evicted.id,
          victimTheme: evicted.theme,
        });
      }
    }

    return id;
  } finally {
    db.close();
  }
}

/**
 * Find the oldest record by `(createdAt ASC, seq ASC)` and delete it. The
 * tie-breaker is what makes this resilient to `Date.now()`'s ms resolution —
 * a tight loop of saves inside the same millisecond no longer leaves the
 * "oldest" up to IndexedDB's internal ordering. Returns `null` if the store
 * is unexpectedly empty (race with another tab clearing data).
 *
 * We read the full set into memory and sort in JS rather than building a
 * compound `[createdAt, seq]` index, because (a) the store is bounded at ~50
 * rows so the cost is negligible, and (b) a compound index would require a
 * schema migration for existing rows that don't have `seq`.
 */
async function evictOldest(
  db: IDBPDatabase,
): Promise<{ id: string; theme: string } | null> {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const rows = (await tx.store.getAll()) as RenderRow[];
  if (!rows.length) {
    await tx.done;
    return null;
  }
  // Sort ascending: smallest createdAt first, then smallest seq within ties.
  rows.sort((a, b) => {
    const da = a.meta.createdAt - b.meta.createdAt;
    if (da !== 0) return da;
    return (a.meta.seq ?? 0) - (b.meta.seq ?? 0);
  });
  const victim = rows[0];
  await tx.store.delete(victim.meta.id);
  await tx.done;
  return { id: victim.meta.id, theme: victim.meta.theme };
}

/**
 * List all stored renders, newest first. Returns metadata only — explicitly
 * does NOT load `mp4` / `thumbnail` Blobs, because materialising 50 full
 * Blobs into memory just to render a grid is wasteful and would slow first
 * paint on the library page.
 */
export async function listRenders(): Promise<RenderMeta[]> {
  if (!isBrowser()) return [];

  const db = await openHistoryDb();
  try {
    const rows = (await db.getAll(STORE_NAME)) as RenderRow[];
    const metas = rows.map((r) => r.meta);
    // Newest first. Sorted in-memory since we read the full set anyway.
    metas.sort((a, b) => b.createdAt - a.createdAt);
    return metas;
  } finally {
    db.close();
  }
}

/**
 * Full record by id, including the MP4 + thumbnail Blobs. Used by the
 * library card when the user clicks "Download" — we lazy-load the Blobs at
 * that moment rather than holding 50 of them in memory.
 */
export async function getRender(id: string): Promise<{
  meta: RenderMeta;
  mp4: Blob;
  thumbnail: Blob;
} | null> {
  if (!isBrowser()) return null;

  const db = await openHistoryDb();
  try {
    const row = (await db.get(STORE_NAME, id)) as RenderRow | undefined;
    if (!row) return null;
    return { meta: row.meta, mp4: row.mp4, thumbnail: row.thumbnail };
  } finally {
    db.close();
  }
}

/**
 * Hard-delete a record (R8 — no soft-delete UI). The confirmation dialog is
 * the UI's responsibility; this function trusts the caller has already
 * confirmed with the user.
 */
export async function deleteRender(id: string): Promise<void> {
  if (!isBrowser()) return;

  const db = await openHistoryDb();
  try {
    await db.delete(STORE_NAME, id);
  } finally {
    db.close();
  }
}

/**
 * Used by R16's "Clear all local data" settings button (T6 territory). Wipes
 * every entry in the history store. The audio-stash DB is a separate concern;
 * see audio-blob.ts.
 */
export async function clearAllRenders(): Promise<void> {
  if (!isBrowser()) return;

  const db = await openHistoryDb();
  try {
    await db.clear(STORE_NAME);
  } finally {
    db.close();
  }
}
