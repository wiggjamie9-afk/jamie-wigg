# `starlightmix-license` Worker

A small Cloudflare Worker that validates **STARLIGHTMIX** Gumroad license keys for the
studio web app. Lives in front of [Gumroad's license-verify API][gumroad-docs] so
the browser never has to ship a Gumroad product secret and we can cache valid
results in Worker KV.

- **Endpoint**: `POST https://license.studio.starlightmix.com/api/license`
- **Backed by**: Gumroad `POST /v2/licenses/verify` + Worker KV
  (`LICENSE_CACHE`, 24h TTL on valid results only)
- **Satisfies**: R10 (license gate) in [`specs/rhythmix-app`](../../../specs/rhythmix-app/)
- **No replicate token, no user audio, no PII** — only the license key in,
  `{ valid, tier }` out.

[gumroad-docs]: https://gumroad.com/api#verify-license

## Request / response

```bash
curl -X POST https://license.studio.starlightmix.com/api/license \
  -H 'Content-Type: application/json' \
  --data '{"key":"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"}'
```

| Outcome | HTTP | Body |
| --- | --- | --- |
| Valid (lifetime) | `200` | `{ "valid": true, "tier": "lifetime" }` |
| Valid (monthly subscription) | `200` | `{ "valid": true, "tier": "monthly" }` |
| Unknown key / refunded / revoked | `200` | `{ "valid": false, "reason": "Invalid or unknown license key" }` |
| Malformed body | `400` | `{ "valid": false, "reason": "Missing or malformed license key" }` |
| Rate-limited (per IP) | `429` | `{ "valid": false, "reason": "Too many requests. Try again in a minute." }` |
| Gumroad unreachable | `503` | `{ "valid": false, "reason": "Couldn't reach Gumroad to verify your key. Please try again in a moment." }` |

Successful lookups are cached in KV under `cached:<key>` for 24 hours.
**Failures are never cached** — a transient Gumroad blip must not lock a real
customer out.

## CORS

Allowed origins:

- `https://studio.starlightmix.com` (prod)
- `*.studio.rhythmixapp-pages.dev` (Cloudflare Pages previews)
- `http://localhost:3000`, `http://127.0.0.1:3000` (dev)

Methods: `POST, OPTIONS`. Headers: `Content-Type`.

## Rate limiting

Sliding-window, per-IP, **20 requests/minute**, enforced in-memory inside the
Worker isolate (Map keyed on `CF-Connecting-IP`). This is a soft cap — an
attacker hopping isolates gets bumped to Cloudflare's standard edge protections
on the zone. We deliberately avoid writing to KV on every request to keep KV ops
cheap.

## Privacy / logging

`console.log` lines are restricted to single-field structured events:
`{"event":"cache_hit"}`, `{"event":"gumroad_unreachable"}`, etc. The Worker
**never** logs the license key, the IP, the Gumroad response body, or anything
else that could re-identify a customer.

## One-time setup

Prereqs: `npm i -g wrangler` and `wrangler login`. A Gumroad product whose
`product_id` you have at hand (the numeric / UUID id, **not** the public
`permalink`).

```bash
cd studio/workers/license

# 1. install dev deps
npm install

# 2. create the KV namespace, then paste the returned id into wrangler.toml
wrangler kv namespace create LICENSE_CACHE
#  → copy the `id = "..."` value into [[kv_namespaces]].id

# 3. set the Gumroad product id as a secret (never committed)
wrangler secret put GUMROAD_PRODUCT_ID
#  → paste your numeric/UUID product_id when prompted

# 4. deploy
npm run deploy
```

DNS: ensure the zone `starlightmix.com` is on Cloudflare and that
`license.studio` resolves to this Worker (Cloudflare will provision the cert
automatically once the custom-domain route in `wrangler.toml` is applied).

## Local dev

```bash
npm run dev       # wrangler dev on http://localhost:8787
npm run typecheck # tsc --noEmit

# smoke test
curl -X POST http://localhost:8787/api/license \
  -H 'Content-Type: application/json' \
  --data '{"key":"YOUR-TEST-LICENSE-KEY"}'
```

For local dev you'll want the secret too:

```bash
echo "your-product-id" | wrangler secret put GUMROAD_PRODUCT_ID --env dev
# or use a .dev.vars file (gitignored)
```

## Edge cases

- **Gumroad returns `success: false`** → we surface
  `"Invalid or unknown license key"`. This covers refunded, chargebacked, and
  unknown keys. Front-end should treat this as a user-correctable error
  (prompt to re-paste / re-check the purchase email).
- **Gumroad is down or unreachable** (network error, non-JSON body) → we return
  `503` with a "try again in a moment" reason. The front-end should not clear
  any locally-cached license state on this response — the user is probably
  legit, Gumroad is just having a moment.
- **KV is unavailable** → we silently fall through to a live Gumroad call.
  Logged as `kv_unavailable`. Never blocks the user.
- **Lifetime detection heuristic**: `tier` is `"lifetime"` if the purchase
  variants/product name contain `"lifetime"`, **or** if there's no
  `subscription_id` (Gumroad one-off purchases like the $149 deal). Active
  `subscription_id` → `"monthly"`.

## Related

- T8 (Replicate proxy Worker) — separate Worker, separate concern. **No** Replicate
  token ever touches *this* Worker.
- `members.html` — the existing license-key UX whose field name + feedback copy
  this Worker is matched to.
