// license.js — local, offline-verifiable entitlement + gift redemption (R15).
// A one-time "lifetime unlock" for polished legacy EXPERIENCES only. The ethical
// line (R15.2) is absolute: a father's own content is NEVER paywalled, locked, or
// held hostage. Free forever = all data entry, journaling, check-ins, full
// unencrypted export, backup/restore. Paid = delight/ceremony, never retrieval.
//
// A key is verified locally against a baked Ed25519 PUBLIC key — no server call,
// works offline forever, degrades gracefully to free (R15.4). Keys are minted
// seller-side with the matching private key (see scripts/dads-code-mint-license.mjs).

import * as db from "./db.js";

// Seller's Ed25519 public key (raw, base64url). Replace with your production key
// at release; the private half must never live in this repo.
const PUBLIC_KEY_B64URL = "nFuLJGCPUAJD1zA0v3k-xQRu5UktiKcwUNZdBRWro4A";

const unb64url = (s) => Uint8Array.from(
  atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=")),
  c => c.charCodeAt(0),
);

// Paid perks are cosmetic/ceremonial only — everything here degrades to a free path.
export const PAID_PERKS = [
  "The in-app Legacy Book — a bound, printable reading view of your vault",
  "Guided prompt packs and themed timelines (coming as free updates to unlock)",
];

export async function getEntitlement() {
  const m = await db.getMeta();
  return m.license || null;
}
export async function isPaid() {
  const lic = await getEntitlement();
  return lic?.tier === "lifetime";
}

let _pubKey = null;
async function pubKey() {
  if (_pubKey) return _pubKey;
  _pubKey = await crypto.subtle.importKey("raw", unb64url(PUBLIC_KEY_B64URL), { name: "Ed25519" }, false, ["verify"]);
  return _pubKey;
}

// A key is: base64url(payloadJSON) + "." + base64url(rawSig). Optional "DC1-" prefix.
export async function verifyKey(rawKey) {
  try {
    const key = String(rawKey).trim().replace(/^DC1-/, "");
    const [pB64, sB64] = key.split(".");
    if (!pB64 || !sB64) return { ok: false, reason: "malformed" };
    const payloadBytes = unb64url(pB64);
    const sig = unb64url(sB64);
    const ok = await crypto.subtle.verify({ name: "Ed25519" }, await pubKey(), sig, payloadBytes);
    if (!ok) return { ok: false, reason: "bad-signature" };
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (payload.tier !== "lifetime") return { ok: false, reason: "unknown-tier" };
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "error" };   // never throw into the UI; just stay free
  }
}

// Redeem a purchased or gifted key. `dedication` is the optional "from [name]"
// message that rides with a gift (R15.5). On failure the app stays fully free.
export async function redeem(rawKey, dedication = "") {
  const res = await verifyKey(rawKey);
  if (!res.ok) return res;
  const lic = {
    tier: "lifetime",
    sub: res.payload.sub || null,
    issuedTo: res.payload.name || null,
    iat: res.payload.iat || null,
    dedication: (dedication || "").slice(0, 280),
    key: String(rawKey).trim(),
    redeemedAt: db.now(),
  };
  await db.setMeta({ license: lic });
  return { ok: true, license: lic };
}

// Remove the unlock (returns to free). Never touches user content (R15.2).
export async function removeLicense() {
  await db.setMeta({ license: null });
  return true;
}
