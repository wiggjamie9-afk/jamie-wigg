// db.js — IndexedDB wrapper for Dad's Code. (R8)
// User content lives ONLY here, never in the service-worker cache.
// Media is stored as native Blobs in a store separate from metadata (R8.2).

const DB_NAME = "dadscode";
const DB_VERSION = 1;
export const SCHEMA_VERSION = 1;

let _db = null;

export function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
export const now = () => new Date().toISOString();

export function open() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      // Ordered, idempotent migrations. Never drop fields. (R8.5)
      if (e.oldVersion < 1) {
        const entries = db.createObjectStore("entries", { keyPath: "id" });
        entries.createIndex("by_kind", "kind");
        entries.createIndex("by_state", "state");
        entries.createIndex("by_updatedAt", "updatedAt");
        entries.createIndex("by_category", "categoryIds", { multiEntry: true });
        entries.createIndex("by_recipient", "recipientIds", { multiEntry: true });

        const code = db.createObjectStore("code", { keyPath: "id" });
        code.createIndex("by_layer", "layer");
        code.createIndex("by_parent", "parentId");

        const checkins = db.createObjectStore("checkins", { keyPath: "id" });
        checkins.createIndex("by_practice", "practiceId");
        checkins.createIndex("by_date", "date");

        db.createObjectStore("recipients", { keyPath: "id" });
        db.createObjectStore("mediaAssets", { keyPath: "id" });
        db.createObjectStore("mediaBlobs", { keyPath: "blobKey" });
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

function tx(store, mode = "readonly") {
  return open().then(db => db.transaction(store, mode).objectStore(store));
}
const done = (req) => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });

export async function put(store, value) { return done((await tx(store, "readwrite")).put(value)); }
export async function get(store, key)   { return done((await tx(store)).get(key)); }
export async function del(store, key)   { return done((await tx(store, "readwrite")).delete(key)); }
export async function all(store)        { return done((await tx(store)).getAll()); }
export async function byIndex(store, index, value) {
  return done((await tx(store)).index(index).getAll(value));
}
export async function clearStore(store) { return done((await tx(store, "readwrite")).clear()); }

// ---- meta singleton ----
export async function getMeta() {
  let m = await get("meta", "vault");
  if (!m) {
    m = { key: "vault", schemaVersion: SCHEMA_VERSION, appVersion: "0.1.0",
          ownerName: "", createdAt: now(), lastBackupAt: null, region: "AU",
          persisted: false, onboarded: false, license: null };
    await put("meta", m);
  }
  return m;
}
export async function setMeta(patch) {
  const m = await getMeta();
  const next = { ...m, ...patch };
  await put("meta", next);
  return next;
}

// Ask the browser to keep our storage. All browser storage is treated as
// ephemeral cache until this succeeds; the real archive is the export. (R9.1)
export async function requestPersist() {
  if (!navigator.storage || !navigator.storage.persist) return false;
  const granted = await navigator.storage.persist();
  await setMeta({ persisted: granted });
  return granted;
}
export async function storageEstimate() {
  if (!navigator.storage || !navigator.storage.estimate) return null;
  return navigator.storage.estimate();
}

// Full local purge (R11.3)
export async function purgeEverything() {
  for (const s of ["entries", "code", "checkins", "recipients", "mediaAssets", "mediaBlobs", "meta"]) {
    await clearStore(s);
  }
}

// One object for export/import (R9.2)
export async function dumpAll() {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: now(),
    meta: await getMeta(),
    entries: await all("entries"),
    code: await all("code"),
    checkins: await all("checkins"),
    recipients: await all("recipients"),
    mediaAssets: await all("mediaAssets"),
    // mediaBlobs handled separately (binary) by export.js
  };
}
