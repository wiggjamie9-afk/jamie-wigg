# `starlightmix-replicate-proxy` Worker

A stateless Cloudflare Worker that proxies browser calls from the STARLIGHTMIX
studio web app to [Replicate's API][replicate-api]. Exists purely to work
around the fact that `api.replicate.com` does **not** serve permissive CORS
headers, so the browser cannot call it directly — see the evidence in
[`specs/rhythmix-app/spike-cors.md`](../../../specs/rhythmix-app/spike-cors.md).

- **Endpoint**: `{GET,POST,OPTIONS} https://replicate-proxy.studio.starlightmix.com/api/replicate-proxy/v1/*`
- **Upstream**: `https://api.replicate.com/v1/*` (path after `/api/replicate-proxy/v1/` is appended verbatim, query string preserved)
- **Satisfies**: R6 (CORS handling) in [`specs/rhythmix-app`](../../../specs/rhythmix-app/), supports R3 (Replicate-token transit constraint).
- **No KV. No D1. No secrets. No persistence of any kind.**

[replicate-api]: https://replicate.com/docs/reference/http

## What it does, end to end

1. Browser sends `POST /api/replicate-proxy/v1/predictions` with
   `Authorization: Bearer r8_…` (the user's own Replicate token — never the
   Worker's) and a JSON body.
2. Worker validates the path prefix, the method, the per-IP rate limit, and
   the request's `Origin` against the CORS allowlist.
3. Worker rebuilds the outbound request with only `Authorization`,
   `Content-Type`, and `Prefer` headers (drops `Origin`, `Referer`, cookies,
   client hints, and everything else).
4. Worker calls `https://api.replicate.com/v1/predictions` with the body
   piped through unchanged, `redirect: "manual"`, 75 s timeout.
5. Worker returns the upstream status + body, attaches CORS headers, and is
   done.

Polling works the same way with `GET /api/replicate-proxy/v1/predictions/<id>`.

## Threat model

The user's Replicate API token rides in the `Authorization` header on every
request. It is forwarded **transit-only**:

- **Never stored.** No KV, no D1, no Durable Objects — the Worker has zero
  bindings. The token leaves the Worker isolate the moment the upstream
  `fetch` completes.
- **Never logged.** The `Authorization` header is not in any log statement.
  Request and response bodies are likewise not logged (a Replicate prompt or
  output URL could be sensitive).
- **Never cached.** Cache-Control on every response is `no-store`. The Worker
  doesn't read or write the Cloudflare cache.

R3's constraint — "the Replicate token never crosses a boundary that retains
it" — depends on the items above staying true. If you add a KV binding, a
log line touching headers, or anything else that could capture the token,
you've broken R3.

What this Worker is **not**: a token-security fix. The token still lives in
the browser (encrypted at rest via WebCrypto per R3). The proxy is a CORS
fix, nothing more.

## CORS

Allowed origins:

- `https://studio.starlightmix.com` (prod)
- `*.studio.rhythmixapp-pages.dev` (Cloudflare Pages previews)
- `http://localhost:3000`, `http://127.0.0.1:3000` (dev)

Methods: `GET, POST, OPTIONS`.
Headers: `Authorization, Content-Type, Prefer`.

`Vary: Origin` is set on every response so caches don't reuse the wrong
allow-origin header.

## Rate limiting

Sliding-window, per-IP, **60 requests/minute**, enforced in-memory inside
the Worker isolate (Map keyed on `CF-Connecting-IP`). The cap is higher
than the license Worker's 20/min because a single user's "generate + poll
until done" loop will easily make 10+ requests on its own.

Soft cap by design: an attacker hopping isolates gets bumped to
Cloudflare's standard edge protections on the zone. We deliberately do
**not** write to KV on every request — that would persist a per-IP record
and add latency, and Cloudflare's edge already does the heavy lifting.

## What's logged (and what isn't)

Single-line structured `console.log` events. Examples:

```json
{"event":"proxied","method":"POST","path_tail":"predictions","upstream_status":201,"latency_ms":612}
{"event":"rate_limited","method":"POST","path_tail":"predictions"}
{"event":"replicate_unreachable","method":"GET","path_tail":"predictions","latency_ms":75001,"cause":"AbortError"}
```

Logged: `event`, `method`, `path_tail` (first path segment only — never the
prediction id), `upstream_status`, `latency_ms`, `cause` (error class name
only, no message).

**Never logged**: the `Authorization` header, any other header, the request
body, the response body, the client IP (used in-memory for rate-limit
bucketing only), or anything past the first path segment.

## Edge cases

- **Replicate redirects (3xx)**: we set `redirect: "manual"` on the upstream
  fetch and pass the status + `Location` header through (note: `location`
  is **not** in the forwarded-response header allowlist by default — if a
  prediction GET ever 302s to a CDN URL, add it explicitly). In practice
  `/v1/predictions` returns 2xx JSON with output URLs inside the body and
  the browser fetches those URLs directly without going through this
  Worker.
- **Large response bodies**: prediction output URLs are short, but the
  `logs` field can grow. We stream `upstream.body` through to the client
  rather than buffering, so payload size is bounded by the upstream
  response, not by Worker memory.
- **Replicate timeouts**: 75 s upstream cap (just under Cloudflare's
  ~100 s Worker CPU/wall clock cap). Times out → `502 { error: "replicate_unreachable" }`,
  which the client's `replicate-unreachable.tsx` fallback (T15) recognises.
- **Non-matching paths**: anything outside `/api/replicate-proxy/v1/*`
  returns `404` with CORS headers still attached.

## Deploy

Prereqs: `npm i -g wrangler` and `wrangler login`. The zone
`starlightmix.com` must already be on Cloudflare (proxied) so that
`replicate-proxy.studio` can resolve to this Worker.

```bash
cd studio/workers/replicate-proxy

# 1. install dev deps
npm install

# 2. deploy
npm run deploy
```

There are **no** secrets to set. There are **no** KV namespaces to create.
The user's Replicate token is supplied by the browser on every request.

## Local dev

```bash
npm run dev       # wrangler dev on http://localhost:8787
npm run typecheck # tsc --noEmit

# smoke test (uses a real Replicate token — yours, not anyone else's)
curl -X GET http://localhost:8787/api/replicate-proxy/v1/account \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN"
```

## Future-proofing

If Replicate ever ships a CORS-aware browser endpoint (some providers
eventually do, gated by a separate "publishable" token type), this Worker
becomes deletable: the client switches its base URL back to
`https://api.replicate.com` and removes the proxy from `replicate.mjs`'s
adapter selection. Track via [replicate/replicate-javascript issue #164][issue-164].

[issue-164]: https://github.com/replicate/replicate-javascript/issues/164

## Related

- T7 (license Worker, `../license/`) — different concern (Gumroad license
  validation), but same CORS / rate-limit / logging conventions. **No**
  Replicate token ever touches the license Worker.
- T15 — `replicate-unreachable.tsx` client fallback screen, triggered by
  this Worker's `502 { error: "replicate_unreachable" }` response.
