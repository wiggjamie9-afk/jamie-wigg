# HerdCheck Co-op Aggregation Worker

This folder is the **HerdCheck co-op aggregation Worker** — the backend for the
*opt-in* org layer that sits on top of the offline-first HerdCheck PWA
(`livestock/`). The phone stays the source of truth and works with zero network;
this Worker only ever holds observations a member **consented** to share, and
serves an aggregate read to org staff.

It is the `studio/workers/herd/` half of the contract in
`specs/herdcheck/api.md` (the other halves are `livestock/sync.js` and the
`sites/herdcheck-coop/` dashboard). It deliberately mirrors the conventions of
the known-good license Worker (`studio/workers/license/`).

## What it does

Base path `/api/herd`. All JSON is `application/json; charset=utf-8`,
`Cache-Control: no-store`.

- `POST /api/herd/join { orgCode, memberName }` →
  `{ token, role, orgId, orgName }`, or `{ ok: false, reason }` for an unknown
  code (200, so status codes don't leak which codes exist).
- `POST /api/herd/sync { animals, observations }` *(member)* →
  `{ accepted }`. Idempotent upsert; malformed rows are skipped, not fatal.
- `GET /api/herd/summary?days=N` *(staff)* → org info + `totals` + `byKind` +
  `members` + recent `flags`.
- `POST /api/herd/flag/:id/ack` *(staff)* → `{ ok: true }`. `:id` is the
  observation id.
- `GET /api/herd/export.csv?memberId=` *(staff)* → `text/csv`.

The flow on each request:

1. **CORS gate** — only the dashboard/Studio origins (prod + `*.pages.dev` +
   localhost) get an `Access-Control-Allow-Origin`. Preflight `OPTIONS` → 204.
2. **Soft rate limit** — 60 req/min/IP, sliding window, in-memory per isolate.
3. **Route + auth** — `/join` is open; everything else requires a bearer token.
   `/summary`, `/flag/:id/ack`, `/export.csv` additionally require `role=staff`.
4. **Handle** — read/write D1 (`HERD_DB`), aggregate in JS for `/summary`.

---

## Data model

```
Auth:     Authorization: Bearer <token>   (opaque, stored on members.token)
Roles:    member (sync only) | staff (aggregate reads + ack)

POST /api/herd/join   { orgCode, memberName }
  → { token, role: "member"|"staff", orgId, orgName }
  | { ok: false, reason: "Unknown org code" }            // unknown code, 200

POST /api/herd/sync   { animals: Animal[], observations: Observation[] }   (member)
  → { accepted: number }
  Animal      = { id, tag, species: "cow"|"buffalo"|"sheep"|"goat" }
  Observation = { id, animalId, kind: "lameness"|"mastitis"|"calving",
                  ts: ISO8601, tier: "red"|"amber"|"green"|"gray",
                  reasons: string[], actions: string[] }

GET  /api/herd/summary?days=7    (staff)   → org + totals + byKind + members + flags
POST /api/herd/flag/:id/ack      (staff)   → { ok: true }
GET  /api/herd/export.csv        (staff)   → CSV: member,animal_tag,species,kind,tier,timestamp,reasons

Errors: { error } with 400 (bad body) | 401 (auth) | 429 (rate limit) | 503 (D1 unreachable).
```

### D1 schema (`src/schema.sql`)

```
orgs         (id, name, member_code, staff_code, validated, validated_by, validated_at)
members      (id, org_id, name, role, token, last_sync)
animals      (id, org_id, member_id, tag, species)
observations (id, animal_id, org_id, member_id, kind, ts, tier, reasons_json, actions_json)
flags        (observation_id PK, acked, acked_by, acked_at)

Env binding:  HERD_DB : D1Database
```

`reasons`/`actions` are stored as JSON arrays of strings (the English advice the
phone produced). Tiers/kinds/species are `CHECK`-constrained to the four-tier and
three-kind vocabularies from `livestock/scoring.js`.

---

## How it works (the load-bearing decisions)

- **Tier rule mirrors `livestock/scoring.js` exactly.** `red > amber > green >
  gray`, and an animal's tier is the **worst of the most-recent observation of
  each kind**. `/summary` reconstructs this in JS (`aggregate`) over rows pulled
  `ts DESC`, so the dashboard and the phone never disagree.
- **Idempotent sync, keyed on the client id.** Animals and observations
  `INSERT ... ON CONFLICT(id) DO UPDATE`, so a phone can resend the same batch
  after an offline gap without duplicating rows. A red/amber observation seeds a
  `flags` row with `ON CONFLICT(observation_id) DO NOTHING`, so a re-sync never
  resets an existing ack.
- **Never block on D1; distinguish invalid from unreachable.** Every D1 call is
  wrapped: a bad request → `4xx` (a definite answer the client should not retry);
  a D1 transport/exec fault → `503` with a retry message (no answer yet). These
  must stay different so the client retries the right cases — same discipline as
  the license Worker's invalid-vs-Gumroad-unreachable split.
- **Staff are read-only over observations.** Staff can read aggregates and `ack`
  flags; they can never mutate or delete member observations. The phone stays
  source of truth (R6).
- **Unknown org code → 200 `{ ok:false }`.** Status codes never reveal which
  codes exist; only a matching code issues a token.
- **Rate limit is best-effort, by design.** In-memory `Map` scoped to the
  isolate (per-request D1 writes would blow up ops/cost); isolate-hoppers fall
  through to Cloudflare's edge protections. Lightly GC'd past 10k entries.

### Privacy / opt-in invariant (do not break)

- **Opt-in only.** A row exists in D1 *only* because a member consented to share
  it (R1, R7). Nothing here weakens the "your data stays on your phone" promise
  for solo, non-org users.
- **`logEvent` emits a single `{ event }` field and nothing else.** The token,
  member names, animal tags, org codes, the client IP, and any request body must
  **never** be logged. If you add logging, log an event name (and counts) only —
  keep it re-identification-proof. This is a stated guarantee of the feature, not
  a style preference.

---

## Conventions to preserve

- **Four tiers, three kinds, four species — all load-bearing.** `red|amber|
  green|gray`, `lameness|mastitis|calving`, `cow|buffalo|sheep|goat`. These are
  enforced in `src/schema.sql` (`CHECK`) and in the sync validators; a new value
  means updating both plus `livestock/scoring.js`.
- **CORS allow-list is explicit.** New origins go in `ALLOWED_ORIGIN_EXACT` or
  the `.pages.dev` suffix rule — never reflect an arbitrary `Origin`.
- **No secrets, no shared keys.** Auth is opaque per-member bearer tokens stored
  on the `members` row, issued at `/join`. There is nothing to `wrangler secret
  put`.
- **No new dependencies.** Zero-dep Worker on the Workers runtime fetch API +
  D1; keep it that way for cold-start and audit simplicity.

---

## Deploy / operate

```bash
# one-time
wrangler d1 create starlightmix-herd                                  # paste id into wrangler.toml
wrangler d1 execute starlightmix-herd --remote --file=src/schema.sql  # apply schema

wrangler deploy                                                       # publish
wrangler tail                                                         # watch structured logEvent output
```

Route: `herd.studio.starlightmix.com/api/herd*` (custom domain; the
`starlightmix.com` zone must be on Cloudflare, proxied). To seed a demo org,
uncomment the `INSERT`s at the bottom of `src/schema.sql` and re-run the
`d1 execute` above.

## Key files

| File | Role |
|------|------|
| `src/index.ts` | The entire Worker — CORS, rate limit, routing, bearer-token auth + role gate, idempotent sync, summary aggregation, flag ack, CSV export, privacy-safe logging. |
| `src/schema.sql` | D1 schema (orgs, members, animals, observations, flags) + commented demo seed. |
| `wrangler.toml` | Worker name, custom-domain route, `HERD_DB` D1 binding, observability. Documents the one-time D1 setup. |
| `package.json` | Deps (none runtime) + scripts. |
| `tsconfig.json` | Workers-runtime TS config. |
| `CLAUDE.md` | This feature doc. |
