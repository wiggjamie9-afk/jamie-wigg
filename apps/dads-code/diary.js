// diary.js — journaling (R3). Quick Log default, voice-first hook, one-line minimum.
// Privacy is the visible default: entries start 'private' and never leave without
// the explicit passOn() pivot in legacy.js.

import * as db from "./db.js";

// Warm, specific onboarding prompt cards — questions, not content (R7.2).
export const PROMPTS = [
  "What did your own father get right?",
  "What's one thing you never want them to doubt?",
  "Advice you'd give before their first job.",
  "A mistake you'd save them from if you could.",
  "What does a good day as their dad look like?",
  "Something you believe that took you years to learn.",
  "What you hope they remember about you.",
  "A rule you live by — and why it matters.",
];

export async function addDiary({ title = "", body, kind = "diary", mediaAssetIds = [] }) {
  const entry = {
    id: db.uuid(),
    kind, type: "quicklog",
    title: title.trim(),
    body: (body || "").trim(),
    lang: document.documentElement.lang || "en",
    categoryIds: [], recipientIds: [], mediaAssetIds, milestoneId: null,
    state: "private",          // R6.1 — private by default, always
    mood: null,
    isDraft: false, isFavorite: false, isSensitive: false,
    createdAt: db.now(), updatedAt: db.now(), authoredAt: db.now(),
    schemaVersion: db.SCHEMA_VERSION,
  };
  await db.put("entries", entry);
  return entry;
}

export async function updateEntry(id, patch) {
  const e = await db.get("entries", id);
  if (!e) return null;
  const next = { ...e, ...patch, updatedAt: db.now() };
  await db.put("entries", next);
  return next;
}

export async function deleteEntry(id) {
  const e = await db.get("entries", id);
  if (e) for (const mid of e.mediaAssetIds || []) {
    const asset = await db.get("mediaAssets", mid);
    if (asset?.blobKey) await db.del("mediaBlobs", asset.blobKey);
    await db.del("mediaAssets", mid);
  }
  await db.del("entries", id);
}

export async function listDiary() {
  return (await db.byIndex("entries", "by_kind", "diary"))
    .sort((a, b) => (b.authoredAt || b.createdAt).localeCompare(a.authoredAt || a.createdAt));
}

// "On this day" — in-app only, skips sensitive/bequeathed (R3.5).
export async function onThisDay() {
  const md = new Date().toISOString().slice(5, 10); // MM-DD
  const yearNow = new Date().getFullYear();
  return (await listDiary()).filter(e => {
    if (e.isSensitive || e.state === "bequeathed") return false;
    const d = new Date(e.authoredAt || e.createdAt);
    return e.authoredAt?.slice(5, 10) === md && d.getFullYear() < yearNow;
  });
}
