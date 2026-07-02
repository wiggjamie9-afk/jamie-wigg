// clarity.js — Clarity & Mental Health practices (R4). Lightweight, evidence-informed,
// on-device only (R11.2). No numeric/clinical scales anywhere (R4.2). A moment of clarity
// lands PRIVATE first; an optional soft pivot may distil a kid-facing lesson later (R4.4).

import * as db from "./db.js";

// The practice set (R4.1). Each is a short, guided flow; saving is always optional.
export const PRACTICES = [
  {
    id: "decompress", title: "2-minute decompression",
    blurb: "End-of-day. Put the weight down before you walk in the door.",
    prompt: "What am I still carrying from today? Name it, then set it down here.",
  },
  {
    id: "weighing", title: "What's actually weighing on me",
    blurb: "A raw brain-dump. No structure, no editing.",
    prompt: "Everything on your mind, unfiltered. Nobody reads this but you.",
  },
  {
    id: "gratitude", title: "One thing that didn't suck today",
    blurb: "Gratitude without the cringe.",
    prompt: "One small thing that was alright today.",
  },
  {
    id: "onebreath", title: "One-breath reset",
    blurb: "In the moment. One slow breath in, longer out. That's it.",
    prompt: null,
  },
];

// Reframe a Hard Moment is a 4-step flow (R4.1).
export const REFRAME_STEPS = [
  ["what", "What happened?"],
  ["felt", "What did you feel?"],
  ["underneath", "What was underneath that?"],
  ["next", "What might you do next time?"],
];

export async function saveClarity({ practiceId, title, body }) {
  const entry = {
    id: db.uuid(), kind: "clarity", type: practiceId,
    title, body: (body || "").trim(),
    lang: "en", categoryIds: [], recipientIds: [], mediaAssetIds: [], milestoneId: null,
    state: "private", mood: null, isDraft: false, isFavorite: false, isSensitive: true, // treat as sensitive (R11.4/R3.5)
    createdAt: db.now(), updatedAt: db.now(), authoredAt: db.now(), schemaVersion: db.SCHEMA_VERSION,
  };
  await db.put("entries", entry);
  return entry;
}

// On-device heaviness signal (R16.3): several 'heavy' inner-weather taps in a row,
// over the last ~10 days. Returns true → app may surface ONE calm support card.
export async function heavinessSignal() {
  const cutoff = Date.now() - 10 * 86400000;
  const weather = (await db.byIndex("entries", "by_kind", "clarity"))
    .filter(e => e.title === "Inner weather" && new Date(e.createdAt).getTime() >= cutoff)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const heavy = weather.filter(e => e.body === "heavy").length;
  return heavy >= 3;
}

// Soft, retrospective narrative of recent inner weather (R4.3) — never a graph, never a score.
export async function weatherNarrative() {
  const cutoff = Date.now() - 14 * 86400000;
  const weather = (await db.byIndex("entries", "by_kind", "clarity"))
    .filter(e => e.title === "Inner weather" && new Date(e.createdAt).getTime() >= cutoff);
  if (weather.length < 3) return null;
  const heavy = weather.filter(e => ["heavy", "flat"].includes(e.body)).length;
  const good = weather.filter(e => ["good", "steady"].includes(e.body)).length;
  if (heavy > good) return "The last couple of weeks have felt heavier. That's worth being gentle with yourself about.";
  if (good > heavy) return "The last couple of weeks have felt a bit steadier. Good.";
  return "The last couple of weeks have been a mixed bag — which is just being human.";
}
