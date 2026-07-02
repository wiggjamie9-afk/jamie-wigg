#!/usr/bin/env node
// Mint a Dad's Code lifetime-unlock license key (R15). Seller-side only.
//
// The Ed25519 PRIVATE key lives in your environment, never in this repo:
//   export DADSCODE_LICENSE_SK="<pkcs8 base64 from key generation>"
//
// Usage:
//   node scripts/dads-code-mint-license.mjs "Recipient Name"
//   node scripts/dads-code-mint-license.mjs "Grandpa Joe"   # for a gift
//
// Prints a key string. Paste it into Dad's Code → Settings → Lifetime unlock.
// The matching PUBLIC key is baked into apps/dads-code/license.js.

import crypto from "node:crypto";

const skB64 = process.env.DADSCODE_LICENSE_SK;
if (!skB64) {
  console.error("Set DADSCODE_LICENSE_SK to your pkcs8 base64 private key first.");
  process.exit(1);
}

const name = process.argv[2] || null;
const b64url = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const sk = crypto.createPrivateKey({ key: Buffer.from(skB64, "base64"), format: "der", type: "pkcs8" });
const payload = {
  v: 1,
  tier: "lifetime",
  sub: crypto.randomUUID(),
  iat: new Date().toISOString().slice(0, 10),
  ...(name ? { name } : {}),
};
const payloadBytes = Buffer.from(JSON.stringify(payload), "utf8");
const sig = crypto.sign(null, payloadBytes, sk);   // raw 64-byte Ed25519

console.log("DC1-" + b64url(payloadBytes) + "." + b64url(sig));
