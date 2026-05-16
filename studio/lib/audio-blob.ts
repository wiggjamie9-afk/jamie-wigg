/**
 * Pure-TS module for handling the audio Blob lifecycle on the client.
 *
 * Audio Blobs live entirely client-side (R1). For the hand-off between
 * `/new` (upload) and `/plan/[id]` (plan editor) we stash the Blob in
 * IndexedDB under a per-plan key.
 *
 * Why IndexedDB and not sessionStorage:
 *   - sessionStorage only stores strings, which would force a Blob → base64
 *     round-trip that inflates the payload ~33%. A 50 MB file becomes ~67 MB,
 *     and most browsers cap sessionStorage at ~5-10 MB anyway.
 *   - IndexedDB stores Blobs natively, has no practical cap relative to our
 *     50 MB max, and survives page reloads (handy if the user refreshes
 *     `/plan/[id]`).
 *   - We deliberately scope this module to *audio* storage only. Render
 *     history, secrets, and license are other tasks' territory.
 */

const DB_NAME = "rhythmix-studio";
const DB_VERSION = 1;
const STORE_NAME = "audio-stash";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB (R1)

// MIME-type allowlist plus a fallback by file extension, because some browsers
// (notably iOS Safari) hand us empty `file.type` strings for `.m4a` / `.flac`.
const ACCEPTED_MIME = new Set<string>([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/flac",
  "audio/x-flac",
]);

const ACCEPTED_EXT = new Set<string>(["mp3", "wav", "m4a", "flac"]);

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validateAudioFile(file: File): ValidationResult {
  if (file.size === 0) {
    return { ok: false, reason: "File is empty." };
  }
  if (file.size > MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      reason: `File is ${mb} MB. Max is 50 MB.`,
    };
  }

  const mime = (file.type || "").toLowerCase();
  if (mime && ACCEPTED_MIME.has(mime)) {
    return { ok: true };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ACCEPTED_EXT.has(ext)) {
    return { ok: true };
  }

  return {
    ok: false,
    reason: `Unsupported file type. Use mp3, wav, m4a, or flac.`,
  };
}

export function audioBlobToObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Short URL-safe random ID. Uses crypto.getRandomValues for entropy and
 * base36-encodes the bytes for compactness. ~11 chars, ~52 bits of entropy —
 * plenty for a per-session plan ID.
 */
export function generateId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let n = 0n;
  for (const b of bytes) {
    n = (n << 8n) | BigInt(b);
  }
  return n.toString(36);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function stashAudioForPlan(
  planId: string,
  blob: Blob,
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, planId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  db.close();
}

export async function getAudioForPlan(planId: string): Promise<Blob | null> {
  const db = await openDb();
  const result = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(planId);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return result;
}
