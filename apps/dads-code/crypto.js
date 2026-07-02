// crypto.js — optional vault passcode + encrypted export (R10).
// WebCrypto only. AES-GCM content key derived by PBKDF2 (SHA-256, 210k) — the
// derived key lives in memory ONLY, never persisted (R10.1). We store just
// salt + IV + ciphertext. No security theatre, no silent unrecoverable loss (R10.5).

import * as db from "./db.js";

const ITERATIONS = 210000;              // R10.1 (≥210k)
const VERIFIER_TOKEN = "dads-code-unlock-ok";
const enc = new TextEncoder();
const dec = new TextDecoder();

let _key = null;        // in-memory CryptoKey after a successful unlock — never stored
let _unlocked = false;

// ---- base64 helpers ----
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

function randomBytes(n) { return crypto.getRandomValues(new Uint8Array(n)); }

async function deriveKey(passphrase, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptWith(key, plaintext) {
  const iv = randomBytes(12);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return { iv: b64(iv), ct: b64(ct) };
}
async function decryptWith(key, { iv, ct }) {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, key, unb64(ct));
  return dec.decode(pt);
}

// ---- passcode lifecycle (stored in meta.security) ----
export async function isEnabled() {
  const m = await db.getMeta();
  return !!(m.security && m.security.enabled);
}
export function isUnlocked() { return _unlocked; }

export async function getHint() {
  const m = await db.getMeta();
  return m.security?.hint || "";
}

// Set (or replace) the passcode. Requires an explicit unrecoverable-loss ack (R10.3).
export async function setPasscode(passphrase, hint, acknowledgedLoss) {
  if (!passphrase) throw new Error("empty passphrase");
  if (!acknowledgedLoss) throw new Error("must acknowledge unrecoverable loss");
  const salt = randomBytes(16);
  const key = await deriveKey(passphrase, salt);
  const verifier = await encryptWith(key, VERIFIER_TOKEN);
  await db.setMeta({ security: {
    enabled: true,
    salt: b64(salt),
    iterations: ITERATIONS,
    verifier,
    hint: (hint || "").slice(0, 200),
  } });
  _key = key; _unlocked = true;
  return true;
}

// Try to unlock. Returns true on success, false on a wrong passphrase.
export async function unlock(passphrase) {
  const m = await db.getMeta();
  const s = m.security;
  if (!s || !s.enabled) { _unlocked = true; return true; }
  try {
    const key = await deriveKey(passphrase, unb64(s.salt));
    const token = await decryptWith(key, s.verifier);
    if (token !== VERIFIER_TOKEN) return false;
    _key = key; _unlocked = true;
    return true;
  } catch { return false; }   // AES-GCM auth failure = wrong passphrase
}

export function lock() { _key = null; _unlocked = false; }

// Remove the passcode entirely (requires the current passphrase).
export async function removePasscode(passphrase) {
  const ok = await unlock(passphrase);
  if (!ok) return false;
  await db.setMeta({ security: null });
  _key = null; _unlocked = true;
  return true;
}

// ---- encrypted export (R10.2) ----
// Encrypts an arbitrary payload string under a fresh passphrase (independent of
// the vault passcode) and wraps it in a standalone HTML file that carries its OWN
// decrypter — so family can open it years from now with no app and no internet.
export async function encryptPayload(passphrase, plaintext) {
  const salt = randomBytes(16);
  const key = await deriveKey(passphrase, salt);
  const { iv, ct } = await encryptWith(key, plaintext);
  return { salt: b64(salt), iv, ct, iterations: ITERATIONS, alg: "AES-GCM", kdf: "PBKDF2-SHA256" };
}

export function decrypterHTML(bundle, hint, ownerName) {
  const b = JSON.stringify(bundle);
  const owner = (ownerName || "").replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  const safeHint = (hint || "").replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  // The decrypter below is intentionally dependency-free, inline, and offline.
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dad's Code — sealed${owner ? " · " + owner : ""}</title>
<style>
  body{font-family:"Iowan Old Style",Georgia,serif;background:#F4EDE2;color:#2A2420;
       max-width:680px;margin:0 auto;padding:32px;line-height:1.55}
  h1{color:#7A3B2E;font-family:"Hoefler Text",Georgia,serif}
  input{font:inherit;padding:10px;width:100%;box-sizing:border-box;border:1px solid #B8893E;border-radius:8px;background:#fff}
  button{font:inherit;margin-top:12px;padding:10px 18px;background:#7A3B2E;color:#fff;border:0;border-radius:8px;cursor:pointer}
  .hint{color:#5A5049;font-size:.9rem;margin:6px 0}
  pre{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid #D8CBB6;border-radius:8px;padding:16px}
  .err{color:#7A3B2E;font-weight:bold}
</style></head><body>
<h1>A sealed letter${owner ? " from " + owner : ""}</h1>
<p>This file is encrypted and holds Dad's Code entries. Enter the passphrase to read it. Nothing here needs an app or the internet — it decrypts in your own browser.</p>
${safeHint ? `<p class="hint">Hint: ${safeHint}</p>` : ""}
<input id="pp" type="password" placeholder="Passphrase" autocomplete="off">
<button id="go">Unlock</button>
<p id="msg" class="err"></p>
<pre id="out" hidden></pre>
<script id="bundle" type="application/json">${b}</script>
<script>
const bundle = JSON.parse(document.getElementById("bundle").textContent);
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function unlock(pp){
  const salt = unb64(bundle.salt);
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pp), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:bundle.iterations,hash:"SHA-256"},
    base, {name:"AES-GCM",length:256}, false, ["decrypt"]);
  const pt = await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(bundle.iv)}, key, unb64(bundle.ct));
  return new TextDecoder().decode(pt);
}
document.getElementById("go").onclick = async () => {
  const msg = document.getElementById("msg"), out = document.getElementById("out");
  msg.textContent = "Working…";
  try {
    const text = await unlock(document.getElementById("pp").value);
    let pretty = text;
    try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch(e){}
    out.textContent = pretty; out.hidden = false; msg.textContent = "";
  } catch(e){ msg.textContent = "That passphrase didn't work. Try again."; }
};
</script>
</body></html>`;
}
