// health.js — Health & Well-being, v1 light (R5). Framed around CAPABILITY and PRESENCE
// — "being around and able for them", for decades — never aesthetics, weight, or PRs.
// At most five gentle signals. Additive consistency only. No calories/macros/body-fat (R5.2).

import * as db from "./db.js";
import { todayKey } from "./ui.js";

// Find (or make) today's single health record.
export async function todayHealth() {
  const key = todayKey();
  const all = await db.byIndex("entries", "by_kind", "health");
  let rec = all.find(e => (e.authoredAt || e.createdAt).slice(0, 10) === key);
  if (!rec) {
    rec = {
      id: db.uuid(), kind: "health", type: "daily", title: "Daily signals", body: "",
      lang: "en", categoryIds: [], recipientIds: [], mediaAssetIds: [], milestoneId: null,
      state: "private", mood: null, isDraft: false, isFavorite: false, isSensitive: false,
      health: { rested: null, moved: null, strength: null, energy: null, alcohol: null },
      createdAt: db.now(), updatedAt: db.now(), authoredAt: db.now(), schemaVersion: db.SCHEMA_VERSION,
    };
  }
  return rec;
}

export async function setSignal(patch) {
  const rec = await todayHealth();
  rec.health = { ...rec.health, ...patch };
  rec.updatedAt = db.now();
  await db.put("entries", rec);
  return rec;
}

// dates where a boolean/positive signal was true — for additive consistency (R5.3)
export async function signalDates(key) {
  const all = await db.byIndex("entries", "by_kind", "health");
  return all
    .filter(e => {
      const v = e.health?.[key];
      return v === true || (typeof v === "number" && v > 0);
    })
    .map(e => (e.authoredAt || e.createdAt).slice(0, 10));
}

// Age-based screening nudges (R5.2) — conversations, not diagnoses.
export function screenings(age) {
  const out = [];
  if (age == null) return out;
  if (age < 40) out.push("Testicular self-awareness — know what's normal for you.");
  if (age >= 18) out.push("Blood pressure check — quick, at any pharmacy or GP.");
  if (age >= 35) out.push("Cholesterol / lipids — worth a chat with your GP.");
  if (age >= 40) out.push("Blood glucose / HbA1c — a simple test to have on the radar.");
  if (age >= 45) out.push("Bowel & prostate — start the conversation with your doctor.");
  return out;
}

export const FRAME =
  "This isn't about looking a certain way. It's about being around, and able, for them — for a long time.";
