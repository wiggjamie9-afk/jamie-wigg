/**
 * Buddy Receipts — Verifiable, tamper-evident logging for every AI call.
 *
 * This is REAL cryptography (Web Crypto API), not a simulation:
 *   - Each AI call produces a receipt: prompt, model, token counts, cost, time.
 *   - The receipt is SHA-256 hashed and ECDSA-signed with a per-creator key.
 *   - Receipts are chained (each carries the previous receipt's hash), so
 *     deleting, editing, or reordering any entry breaks the chain and is
 *     detectable by anyone — including people who don't trust us.
 *
 * HONEST LIMITATIONS (read these — the whole point is not lying):
 *   1. This proves the LOG is tamper-evident and that whoever holds the
 *      private key produced it. It makes it impossible to quietly rewrite
 *      history after the fact.
 *   2. It does NOT, by itself, prove the response text genuinely came from
 *      Anthropic. Proving that would require Anthropic to sign their own
 *      responses. The receipt attests to "this is exactly what the app sent
 *      and received, and it hasn't been altered since."
 *   3. Token counts / cost come straight from the API's reported `usage`
 *      field, so the cost figure is derived from real numbers and is
 *      tamper-evident — but it's only as honest as the API response itself.
 *   4. Storing the private key in localStorage is convenient, not
 *      high-security. For real production, keep the key in a hardware-backed
 *      store or sign server-side in an enclave.
 *
 * Works in the browser and in Node 20+ (uses globalThis.crypto).
 */

const crypto = globalThis.crypto;
const subtle = crypto.subtle;

// ---------- canonical JSON (deterministic key order) ----------
// Two semantically-equal objects must serialize to the exact same string,
// or hashes won't match. So we sort keys recursively.
function canonicalize(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
}

function bufToHex(buf) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoaUniversal(bin);
}

function b64ToBuf(b64) {
  const bin = atobUniversal(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// btoa/atob exist in browsers; Node 20 has them globally too, but guard anyway.
function btoaUniversal(s) {
  return typeof btoa === 'function' ? btoa(s) : Buffer.from(s, 'binary').toString('base64');
}
function atobUniversal(s) {
  return typeof atob === 'function' ? atob(s) : Buffer.from(s, 'base64').toString('binary');
}

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const digest = await subtle.digest('SHA-256', data);
  return bufToHex(digest);
}

// ---------- key management (ECDSA P-256) ----------
async function generateKeyPair() {
  const pair = await subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
  const publicJwk = await subtle.exportKey('jwk', pair.publicKey);
  const privateJwk = await subtle.exportKey('jwk', pair.privateKey);
  return { publicJwk, privateJwk };
}

async function importPrivateKey(jwk) {
  return subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

async function importPublicKey(jwk) {
  return subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
}

async function sign(privateKey, str) {
  const sig = await subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(str)
  );
  return bufToB64(sig);
}

async function verifySignature(publicKey, str, sigB64) {
  return subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    b64ToBuf(sigB64),
    new TextEncoder().encode(str)
  );
}

// ---------- the receipt ledger ----------
const GENESIS_HASH = '0'.repeat(64);

class ReceiptLedger {
  constructor({ publicJwk, privateJwk, receipts = [] }) {
    this.publicJwk = publicJwk;
    this.privateJwk = privateJwk;
    this.receipts = receipts;
  }

  /**
   * Create or load a ledger from localStorage (browser).
   */
  static async load(storageKey = 'buddy_receipt_ledger') {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return new ReceiptLedger(parsed);
    }
    const { publicJwk, privateJwk } = await generateKeyPair();
    const ledger = new ReceiptLedger({ publicJwk, privateJwk, receipts: [] });
    ledger._storageKey = storageKey;
    ledger.persist();
    return ledger;
  }

  persist(storageKey) {
    const key = storageKey || this._storageKey || 'buddy_receipt_ledger';
    this._storageKey = key;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify({
        publicJwk: this.publicJwk,
        privateJwk: this.privateJwk,
        receipts: this.receipts,
      }));
    }
  }

  lastHash() {
    return this.receipts.length ? this.receipts[this.receipts.length - 1].hash : GENESIS_HASH;
  }

  /**
   * Record one AI call. `content` is everything we attest to.
   * Returns the signed, chained receipt.
   */
  async record(content) {
    const body = {
      seq: this.receipts.length,
      timestamp: new Date().toISOString(),
      prevHash: this.lastHash(),
      ...content,
    };
    const canonical = canonicalize(body);
    const hash = await sha256Hex(canonical);

    const privateKey = await importPrivateKey(this.privateJwk);
    const signature = await sign(privateKey, hash);

    const receipt = { body, hash, signature };
    this.receipts.push(receipt);
    this.persist();
    return receipt;
  }

  /**
   * Verify the whole ledger. Returns a per-receipt report.
   * Anyone can run this with only the exported public key — no trust required.
   */
  async verify() {
    const publicKey = await importPublicKey(this.publicJwk);
    const results = [];
    let expectedPrev = GENESIS_HASH;

    for (let i = 0; i < this.receipts.length; i++) {
      const r = this.receipts[i];
      const recomputed = await sha256Hex(canonicalize(r.body));
      const hashOk = recomputed === r.hash;
      const sigOk = await verifySignature(publicKey, r.hash, r.signature);
      const chainOk = r.body.prevHash === expectedPrev;
      const seqOk = r.body.seq === i;

      results.push({
        seq: i,
        purpose: r.body.purpose,
        hashOk,        // contents haven't been edited
        sigOk,         // signed by the ledger's key
        chainOk,       // links correctly to the previous receipt
        seqOk,         // not reordered
        pass: hashOk && sigOk && chainOk && seqOk,
      });
      expectedPrev = r.hash;
    }
    return {
      total: results.length,
      allPass: results.every(r => r.pass),
      results,
    };
  }

  /**
   * Export for independent verification. Includes the PUBLIC key only —
   * never the private key — so anyone can verify without being able to forge.
   */
  exportForAudit() {
    return {
      publicJwk: this.publicJwk,
      receipts: this.receipts,
      exportedAt: new Date().toISOString(),
      verifierNote: 'Recompute SHA-256 of canonicalize(body), check it equals hash, ' +
                    'verify ECDSA P-256 signature over hash with publicJwk, and check ' +
                    'each body.prevHash equals the previous receipt hash.',
    };
  }
}

/**
 * Cost helper — Claude 3.5 Sonnet pricing (USD per token).
 * Exposed so the number on screen is auditable, not magic.
 */
const PRICING = {
  'claude-3-5-sonnet-20241022': { inputPerToken: 3 / 1e6, outputPerToken: 15 / 1e6 },
};

function computeCost(model, inputTokens, outputTokens) {
  const p = PRICING[model];
  if (!p) return null;
  return {
    inputCost: inputTokens * p.inputPerToken,
    outputCost: outputTokens * p.outputPerToken,
    totalCost: inputTokens * p.inputPerToken + outputTokens * p.outputPerToken,
    pricingUsed: p,
  };
}

/**
 * Wrap a real Claude call so every call is automatically receipted.
 * Returns { response, receipt }.
 */
async function receiptedClaudeCall(ledger, { apiKey, model, system, userPrompt, purpose }) {
  const started = Date.now();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  const data = await res.json();
  const durationMs = Date.now() - started;

  const text = data.content?.[0]?.text ?? '';
  const inputTokens = data.usage?.input_tokens ?? 0;
  const outputTokens = data.usage?.output_tokens ?? 0;
  const cost = computeCost(model, inputTokens, outputTokens);

  // We attest to HASHES of the prompt/response (so the receipt itself stays
  // small and doesn't leak content), plus the full metadata.
  const receipt = await ledger.record({
    purpose,
    model,
    promptHash: await sha256Hex(canonicalize({ system, userPrompt })),
    responseHash: await sha256Hex(text),
    inputTokens,
    outputTokens,
    cost,
    durationMs,
    stopReason: data.stop_reason ?? null,
    cacheReadTokens: data.usage?.cache_read_input_tokens ?? 0,
  });

  return { response: text, receipt };
}

// ---------- exports (browser + node) ----------
const api = {
  ReceiptLedger,
  generateKeyPair,
  sha256Hex,
  canonicalize,
  computeCost,
  receiptedClaudeCall,
  PRICING,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.BuddyReceipts = api;
}
