// legacy.js — the two-store privacy law + the "Pass this on" pivot. (R6)
//
// NON-NEGOTIABLE (R6.1/R6.2): there is NO code path that flips a private entry to
// shared/bequeathed. Passing on COPIES the entry into a new kid-facing record; the
// private original is never mutated. Release conditions are advisory metadata honoured
// at export — the app is honest that they are not server-enforced (R6.4).

import * as db from "./db.js";

// ---- recipients ----
export async function addRecipient({ name, relationship = "", birthDate = null }) {
  const r = { id: db.uuid(), name: name.trim(), relationship, birthDate,
    avatarAssetId: null, createdAt: db.now() };
  await db.put("recipients", r);
  return r;
}
export async function listRecipients() {
  return (await db.all("recipients")).sort((a, b) => a.name.localeCompare(b.name));
}
export async function deleteRecipient(id) { await db.del("recipients", id); }

// ---- the pivot ----
// timing: { kind: 'now' } | { kind: 'date', date } | { kind: 'age', age } | { kind: 'gone' }
export async function passOn(sourceEntryId, { recipientIds, timing, framingNote = "" }) {
  const src = await db.get("entries", sourceEntryId);
  if (!src) throw new Error("entry not found");
  if (!recipientIds || recipientIds.length === 0) throw new Error("pick at least one recipient");

  const state = timing.kind === "now" ? "shared" : "bequeathed";
  const copy = {
    ...src,
    id: db.uuid(),
    kind: "legacy",
    state,                          // R6.3
    recipientIds: [...recipientIds],
    release: timing,                // advisory metadata (R6.4), resolved at read/export
    framingNote: framingNote.trim(),
    passedFrom: src.id,             // provenance; original is untouched
    deliveredAt: null,              // revocable until actually delivered (R6.3)
    isFavorite: true,
    createdAt: db.now(), updatedAt: db.now(),
  };
  await db.put("entries", copy);
  // original stays exactly as it was — no mutation, ever.
  return copy;
}

// Revoke a passed-on copy — allowed until it has actually been delivered (R6.3).
export async function revoke(copyId) {
  const e = await db.get("entries", copyId);
  if (!e) return;
  if (e.deliveredAt) throw new Error("already delivered — cannot revoke");
  await db.del("entries", copyId);
}

export async function listLegacy() {
  return (await db.byIndex("entries", "by_kind", "legacy"))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

// Plain-words description of a timing choice, for the confirm screen (R6.2).
export function describeTiming(timing) {
  switch (timing.kind) {
    case "now": return "they can read it now, while you're here";
    case "date": return `sealed until ${timing.date}`;
    case "age": return `sealed until they turn ${timing.age}`;
    case "gone": return "sealed until you're gone";
    default: return "sealed";
  }
}

export function stateBadge(state) {
  if (state === "shared") return { cls: "badge-shared", label: "Shared now" };
  if (state === "bequeathed") return { cls: "badge-bequeathed", label: "Bequeathed" };
  return { cls: "badge-private", label: "Private" };
}
