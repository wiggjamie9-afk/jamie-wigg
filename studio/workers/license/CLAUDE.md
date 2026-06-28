# Studio License Validation

This folder is the **STARLIGHTMIX Studio license-validation Worker** — a single
Cloudflare Worker that answers one question: *is this license key a real,
paid-up purchase, and what tier is it?* The browser app calls it before
unlocking the paid experience.

It satisfies requirement **R10**. It deliberately does **not** touch the user's
Replicate token — that's a separate concern (T8). The Worker sees a license key
and nothing else sensitive.

## What it does

`POST /api/license { key }` →

- `{ valid: true, tier }` where `tier` is `"lifetime"` or `"monthly"`, or
- `{ valid: false, reason }` with a human-readable reason.

The flow on each request:

1. **CORS gate** — only the Studio origins (prod + Pages previews + localhost)
   get an `Access-Control-Allow-Origin`. Preflight `OPTIONS` returns 204.
2. **Soft rate limit** — 20 req/min/IP, sliding window, in-memory per isolate.
3. **Validate body** — extract and sanity-check the key (`extractKey`).
4. **KV cache fast-path** — a prior valid result (24 h TTL) returns immediately.
5. **Gumroad verify** — on a cache miss, verify against the Gumroad license API.
6. **Derive tier** + **cache the valid result**, then respond.

---

## Data model

```
Request:  POST /api/license   { key: string }

Response: { valid: true,  tier: "lifetime" | "monthly" }
        | { valid: false, reason: string }

KV entry (key `cached:<license_key>`, 24 h TTL):
        { tier: "lifetime" | "monthly", cachedAt: number }

Env bindings:
  GUMROAD_PRODUCT_ID : string       // SECRET — wrangler secret put
  LICENSE_CACHE      : KVNamespace  // 24 h cache of valid lookups
```

`deriveTier(gumroadResponse)` maps a Gumroad purchase to our two-tier shape:
the `$149` lifetime SKU is detected via the `variants` / `variants_and_quantity`
/ `product_name` strings containing `"lifetime"`, **or** the absence of an active
`subscription_id` (a one-off purchase is treated as lifetime). Anything with a
live `subscription_id` is `"monthly"`.

---

## How it works (the load-bearing decisions)

- **Cache only successes, never failures.** A Gumroad blip or a transient
  `success: false` must not lock a paying customer out, so failures are never
  written to KV. Only `valid: true` results are cached.
- **Never block on cache failure.** Every KV read/write is wrapped in
  `try/catch` that falls through to Gumroad (read) or logs and continues
  (write). KV being down degrades latency, not correctness.
- **Distinguish "invalid" from "unreachable."** An unknown key → `200
  { valid: false }` (a definite answer). A transport failure reaching Gumroad →
  `503` with a retry message (no answer yet). These must stay different so the
  client retries the right cases.
- **`increment_uses_count=false`** on every Gumroad call — we re-verify on each
  cache miss and must not burn the key's use counter or Gumroad will rate-limit
  us.
- **Rate limit is best-effort, by design.** It's an in-memory `Map` scoped to
  the isolate, not KV (per-request KV writes would blow up ops/cost). An
  attacker hopping isolates falls through to Cloudflare's edge protections. The
  `Map` is lightly GC'd when it exceeds 10k entries.

### Privacy invariant (do not break)

`logEvent` emits a **single `{ event }` field and nothing else**. The license
key, the client IP, the Gumroad response body, and any PII must **never** be
logged. If you add logging, log an event name and counts only — keep it
re-identification-proof. This is a stated guarantee of the feature, not a style
preference.

---

## Conventions to preserve

- **Two tiers only:** `"lifetime" | "monthly"`. `isCachedValid` and `deriveTier`
  both hard-code this set; a third tier means updating both plus the client.
- **CORS allow-list is explicit.** New origins go in `ALLOWED_ORIGIN_EXACT` or
  the `ALLOWED_ORIGIN_SUFFIX` rule — never reflect an arbitrary `Origin`.
- **Secrets are secrets.** `GUMROAD_PRODUCT_ID` is set via
  `wrangler secret put`, never in `wrangler.toml` `[vars]` and never committed.
- **No new dependencies.** This is a zero-dep Worker on the Workers runtime
  fetch API; keep it that way for cold-start and audit simplicity.

---

## Deploy / operate

```bash
# one-time
wrangler kv namespace create LICENSE_CACHE   # paste id into wrangler.toml
wrangler secret put GUMROAD_PRODUCT_ID        # the numeric/UUID product_id

wrangler deploy                               # publish
wrangler tail                                 # watch structured logEvent output
```

Route: `license.studio.starlightmix.com/api/license*` (custom domain; the
`starlightmix.com` zone must be on Cloudflare, proxied).

## Key files

| File | Role |
|------|------|
| `src/index.ts` | The entire Worker — CORS, rate limit, KV cache, Gumroad verify, tier derivation, privacy-safe logging. |
| `wrangler.toml` | Worker name, custom-domain route, `LICENSE_CACHE` KV binding, observability. Documents the one-time setup. |
| `package.json` | Deps (none runtime) + scripts. |
| `tsconfig.json` | Workers-runtime TS config. |
| `README.md` | Human-facing setup/runbook for the Worker. |
