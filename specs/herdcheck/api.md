# HerdCheck Co-op API contract

Shared contract for the `herd` Worker (`studio/workers/herd/`), the client sync
(`livestock/sync.js`), and the dashboard (`sites/herdcheck-coop/`). Mirrors the
conventions of `studio/workers/license/` (CORS allow-list, never-block, structured
`{event}` logging, no PII in logs).

Base path: `/api/herd`. All JSON is `application/json; charset=utf-8`, `Cache-Control: no-store`.

## Auth

Opaque bearer tokens issued at join, stored on the `members` row.
`Authorization: Bearer <token>`. Two roles: `member` (sync only) and `staff`
(read aggregate). Missing/invalid token → `401 { error }`.

## Endpoints

### POST /api/herd/join
Body: `{ "orgCode": string, "memberName": string }`
- `orgCode` resolves to an org. A staff code (separate value) issues a `staff`
  token; a member code issues a `member` token.
- → `200 { "token": string, "role": "member"|"staff", "orgId": string, "orgName": string }`
- Unknown code → `200 { "ok": false, "reason": "Unknown org code" }` (do not leak which codes exist via status).

### POST /api/herd/sync   (role: member)
Body: `{ "animals": Animal[], "observations": Observation[] }`
- Idempotent on `observation.id` and `animal.id` (upsert; re-sending is safe).
- → `200 { "accepted": number }`
- Never 5xx on partial/duplicate input; skip malformed rows and count the rest.

```
Animal       = { id: string, tag: string, species: "cow"|"buffalo"|"sheep"|"goat" }
Observation  = { id: string, animalId: string, kind: "lameness"|"mastitis"|"calving",
                 ts: ISO8601, tier: "red"|"amber"|"green"|"gray",
                 reasons: string[], actions: string[] }
```

### GET /api/herd/summary?days=7   (role: staff)
→ `200`:
```
{
  "org":     { "id": string, "name": string,
               "validated": boolean, "validatedBy": string|null, "validatedAt": string|null },
  "totals":  { "animals": number, "red": number, "amber": number, "green": number, "gray": number },
  "byKind":  { "lameness": {red,amber,green}, "mastitis": {red,amber,green}, "calving": {red,amber,green} },
  "members": [ { "memberId": string, "name": string, "animals": number,
                 "red": number, "amber": number, "green": number, "lastSync": ISO8601|null } ],
  "flags":   [ { "id": string, "memberName": string, "animalTag": string,
                 "kind": string, "tier": "red"|"amber", "ts": ISO8601,
                 "reasons": string[], "acked": boolean } ]
}
```
`totals`/`members` tiers use the most-recent-of-each-kind rule (same as
`scoring.animalTier`). `flags` are red/amber observations within `days` (default 7).

### POST /api/herd/flag/:id/ack   (role: staff)
→ `200 { "ok": true }`. Marks a flag acknowledged (records who/when server-side).

### GET /api/herd/export.csv?memberId=   (role: staff)
→ `200 text/csv` with header row:
`member,animal_tag,species,kind,tier,timestamp,reasons`
Optional `memberId` filters to one member; absent = whole org.

## Errors
`{ "error": string }` with status 400 (bad body), 401 (auth), 429 (rate limit),
503 (backend/D1 unreachable — client retries). Successes for "no data" are 200
with empty arrays, never errors.
