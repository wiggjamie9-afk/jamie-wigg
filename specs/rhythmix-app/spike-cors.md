# Spike: Replicate API CORS Behavior

**Task**: T0 — verify whether Replicate's HTTP API serves permissive CORS headers that allow a browser to call it directly with the user's token in `Authorization`, or whether `studio.rhythmixapp.com.au` needs a thin Cloudflare Worker proxy in front of `api.replicate.com`.

**Date**: 2026-05-16
**Satisfies**: R6 (CORS handling in `replicate.mjs`)

---

## Verdict

**Build Replicate proxy Worker: YES.**

Replicate's official JavaScript client explicitly states the API cannot be called directly from a browser. Community reports confirm the API returns no `Access-Control-Allow-Origin` header on the predictions endpoint, so the browser's preflight check fails. A pass-through Cloudflare Worker is therefore mandatory, not optional — `studio/workers/replicate-proxy/` must ship in Phase 2, and the design.md note treating it as "conditional" should be updated.

---

## Evidence

### 1. Official Replicate JavaScript client README

The maintainers' own `replicate/replicate-javascript` repo states (verbatim, fetched via WebFetch on 2026-05-16):

> "This library can't interact with Replicate's API directly from a browser."

The README's recommendation is to build a server-side Next.js route instead. There is no mention of any CORS workaround, no preview-token mechanism, no `Origin` allowlist setup, nothing. The official guidance is: keep it server-side.

### 2. GitHub issue replicate/replicate-javascript#164 (open, unresolved)

A user reports, on `https://api.replicate.com/v1/predictions`:

> "Access to fetch at 'https://api.replicate.com/v1/predictions' from origin 'https://ghostwriter-ai.com' has been blocked by CORS policy"

The preflight `OPTIONS` request fails because `Access-Control-Allow-Origin` is absent from the response. The issue has been open since 2023-11-29 with no maintainer fix, consistent with the README guidance that browser use is not supported.

### 3. Direct `curl` reproduction (blocked by sandbox)

The first-priority diagnostic — a raw `curl` against the live endpoint — could not be executed from this sandbox. The sandbox returns:

```
HTTP/2 403
x-deny-reason: host_not_allowed
content-length: 21
content-type: text/plain

Host not in allowlist
```

This is the **sandbox egress filter** rejecting the connection, not Replicate. To capture Replicate's real response headers, the curl steps below need to run from a machine with unrestricted egress (a developer laptop, a Cloudflare Worker `fetch`, a CI runner, etc.).

---

## Reproduction

### A. Direct API probe (run from any machine with internet egress to `api.replicate.com`)

```bash
# Preflight — this is the request a browser would fire before the real POST
curl -X OPTIONS \
  -H "Origin: https://studio.rhythmixapp.com.au" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  https://api.replicate.com/v1/predictions -i

# Plain GET with Origin header — useful sanity check
curl -I -H "Origin: https://studio.rhythmixapp.com.au" \
  https://api.replicate.com/v1/predictions
```

**Expected result**, per the GitHub issue and the official client README: response will either omit `Access-Control-Allow-Origin` entirely or echo something restrictive that does not include `https://studio.rhythmixapp.com.au`. Either way the browser fetch fails.

### B. Browser repro

Paste into the JS console of any page at a different origin:

```js
fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer r8_TEST_TOKEN_DOES_NOT_NEED_TO_BE_VALID',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ version: 'x', input: {} }),
}).then(r => console.log(r.status)).catch(e => console.error('CORS:', e));
```

**Expected**: Chrome / Safari / Firefox log a CORS error in the console before the request even reaches Replicate. The fetch promise rejects; no HTTP response is observable from JS. (This is the symptom every reporter in issue #164 describes.)

---

## Caveats

- **Sandbox limitation**: the curl evidence in this note comes from documentation + community reports, not a live sandbox-side hit. Before T11 (proxy Worker implementation), one human run of the curl above on a real machine would close the loop. If — surprise — Replicate **has** quietly added permissive CORS since the issue was filed in 2023, the proxy still costs little (a ~30-line Worker) and removes the entire class of "user is on a corporate network with a weird preflight" failures, so the decision doesn't flip.
- **Endpoint variation**: Replicate may serve different CORS headers on different paths (`/v1/predictions` vs `/v1/predictions/{id}` vs `/v1/models/.../predictions`). The proxy should pass-through the full `/v1/*` path space rather than just the create endpoint, which is what `design.md` already specifies.
- **Token exposure shape doesn't change**: a proxy Worker is a CORS fix, not a token-security fix. The user's Replicate token still lives in the browser (encrypted via WebCrypto per R3) and is sent on every request — the Worker just forwards `Authorization` unchanged. Document explicitly in the Worker that it never logs request bodies or `Authorization` headers, never persists anything in KV, and is stateless.
- **Future-proofing**: if Replicate ever ships a CORS-aware browser endpoint (some providers eventually do, gated by a separate "publishable" token type), the proxy becomes deletable. Track via `replicate/replicate-javascript` issue #164.

---

## Action items for the rest of the spec

1. Update `design.md` line for the Replicate proxy Worker: change "Status: Conditional component — built only if direct browser calls turn out to fail CORS (verify in T0)" to "Status: Required (confirmed by T0 spike-cors.md)".
2. T11 (or the equivalent later task) implements `studio/workers/replicate-proxy/` as a stateless pass-through.
3. `rhythmix-studio/src/core/replicate.mjs` (the refactored shared module) should default to the proxy URL in the browser build and to `https://api.replicate.com` in the Node build. Adapter selection mirrors the ffmpeg adapter pattern already in `design.md`.

## Sources

- [replicate/replicate-javascript README](https://github.com/replicate/replicate-javascript) — explicit "This library can't interact with Replicate's API directly from a browser."
- [replicate/replicate-javascript issue #164](https://github.com/replicate/replicate-javascript/issues/164) — open since 2023-11-29, confirms missing `Access-Control-Allow-Origin` on `POST /v1/predictions`.
