// code.js — The Code (R1) + the daily check-in loop (R2).
// Three linked layers: value → principle → practice. His words only (R1.2):
// this file ships ZERO seeded content — only structure, questions, and prompts.

import * as db from "./db.js";
import { todayKey } from "./ui.js";

// Optional domains a dad MAY take a stance on. Prompts to fill, never categories
// to complete (R1.4). These are questions, not content.
export const DOMAINS = [
  "Presence vs. provision",
  "Strength without the poison",
  "Money & enough",
  "Work vs. family",
  "Screens & attention (mine first)",
  "Saying the true thing",
  "Meaning & the bigger thing",
  "My father's pattern — repeat or break",
  "Discipline vs. warmth",
  "Mortality",
];

// One sharpening question to push a vague value toward a testable principle (R1.3).
export function sharpeningQuestion(layer) {
  if (layer === "value") return "When does this get hard — and what does it look like when you fail it?";
  if (layer === "principle") return "What's the one repeatable thing that proves this on an ordinary day?";
  return "";
}

export async function addNode({ layer, text, parentId = null, domainTag = null }) {
  const siblings = (await db.byIndex("code", "by_layer", layer)).filter(n => n.parentId === parentId);
  const node = {
    id: db.uuid(), layer, text: text.trim(), parentId, domainTag,
    isActive: true, sortOrder: siblings.length,
    createdAt: db.now(), updatedAt: db.now(), schemaVersion: db.SCHEMA_VERSION,
  };
  await db.put("code", node);
  return node;
}
export async function updateNode(id, patch) {
  const n = await db.get("code", id);
  if (!n) return null;
  const next = { ...n, ...patch, updatedAt: db.now() };
  await db.put("code", next);
  return next;
}
export async function deleteNode(id) {
  // sweep descendants (orphan cleanup in app code, R8.3)
  const all = await db.all("code");
  const toKill = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const n of all) {
      if (n.parentId && toKill.has(n.parentId) && !toKill.has(n.id)) { toKill.add(n.id); grew = true; }
    }
  }
  for (const k of toKill) await db.del("code", k);
}

// Return the full stack, nested for rendering.
export async function getStack() {
  const all = (await db.all("code")).sort((a, b) => a.sortOrder - b.sortOrder);
  const by = (layer, parentId) => all.filter(n => n.layer === layer && n.parentId === parentId);
  return by("value", null).map(v => ({
    ...v,
    principles: by("principle", v.id).map(p => ({
      ...p, practices: by("practice", p.id),
    })),
  }));
}

export async function activePractices() {
  return (await db.byIndex("code", "by_layer", "practice")).filter(p => p.isActive);
}

// ---- check-in loop ----
export async function setCheckin(practiceId, status, note = "") {
  const date = todayKey();
  const existing = (await db.byIndex("checkins", "by_practice", practiceId)).find(c => c.date === date);
  const rec = existing
    ? { ...existing, status, note, updatedAt: db.now() }
    : { id: db.uuid(), practiceId, date, status, note, createdAt: db.now() };
  await db.put("checkins", rec);
  return rec;
}
export async function todaysCheckins() {
  const date = todayKey();
  const map = {};
  for (const c of await db.all("checkins")) if (c.date === date) map[c.practiceId] = c.status;
  return map;
}
export async function checkinDates() {
  return (await db.all("checkins")).map(c => c.date);
}

// Weekly mirror — additive pattern read, never a scoreboard (R2.3).
export async function weeklyMirror() {
  const cutoff = Date.now() - 7 * 86400000;
  const recent = (await db.all("checkins")).filter(c => new Date(c.date).getTime() >= cutoff);
  const practices = await activePractices();
  const out = [];
  for (const p of practices) {
    const mine = recent.filter(c => c.practiceId === p.id);
    const kept = mine.filter(c => c.status === "kept").length;
    const total = mine.filter(c => c.status !== "na").length;
    if (total) out.push({ text: p.text, kept, total });
  }
  return out;
}
