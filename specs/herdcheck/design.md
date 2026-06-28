# HerdCheck Co-op Dashboard — Design

How the co-op layer is built on top of the existing offline-first PWA without
regressing the solo, no-account experience. References requirement IDs from
`requirements.md`.

## Guiding constraints

- The farmer app (`livestock/`) is the **source of truth** and must keep working
  with zero network (R9). The org layer is strictly additive and opt-in (R1, R7).
- No heavyweight backend in the repo today. Choose the **smallest** backend that
  satisfies aggregation, matching the repo's existing Cloudflare Workers + KV/D1
  pattern (`studio/workers/`) rather than introducing a new stack.

## Architecture

```
 member phone (livestock/ PWA, IndexedDB)
        │  opt-in, consented (R1,R7)
        ▼
 sync queue in IndexedDB  ──store-and-forward──►  Cloudflare Worker  ──►  D1 (SQL)
 (livestock/sync.js)        retry on reconnect      /api/herd/*           org + observations
                                                          │
                                              org dashboard (sites/herdcheck-coop/)
                                                 reads aggregate + exports CSV
```

### Client (member phone)

- **`livestock/org.js`** — join/leave an org via code (R1), store `orgId` +
  member identity + consent flag in the existing `settings` store (`db.js`).
- **`livestock/sync.js`** — a queue layered over `db.saveObservation`: when the
  member is in an org and has consented, enqueue each new animal/observation and
  flush to the Worker with retry/backoff; survives long offline gaps (R2, R9).
  Never on the critical path of a check.
- A small consent + "what's shared" screen in `index.html` (R7), and org
  branding/languages wired through `i18n.js` (R8).

### Backend (Worker + D1)

- **`studio/workers/herd/`** — a Worker mirroring the conventions of
  `studio/workers/license/` (CORS allow-list, never-block, structured logging,
  secrets via `wrangler secret`). Endpoints:
  - `POST /api/herd/join` → validate org code, issue a member token (R1, R6).
  - `POST /api/herd/sync` → accept a batch of observations for the authed member
    (R2). Idempotent on observation `id`.
  - `GET  /api/herd/summary` → aggregate counts by tier/kind/member, last-N-days
    flags (R3, R4) — org-staff token only (R6).
  - `POST /api/herd/flag/:id/ack` → acknowledge/resolve a red flag (R4).
  - `GET  /api/herd/export.csv` → per-member / org CSV (R5).
- **D1 schema:** `orgs`, `members`, `observations` (mirrors the `db.js` shape +
  `orgId`, `memberId`), `flags` (ack state). Roles on the `members` row (R6).

### Dashboard (org staff)

- **`sites/herdcheck-coop/`** — a static dashboard built via the site-build
  pipeline, reusing the HerdCheck ag palette. Calls the Worker with a staff
  token; shows tier breakdown, the red-flag work queue, filters, and CSV export
  (R3, R4, R5). Shows deployment validation status (R10).

## Key decisions

- **Opt-in sync, not always-on.** Default stays local-only; sync exists only for
  org members who consent (R1, R7). This keeps the "your data stays on your
  phone" promise true for solo users and is the honest version of the privacy
  story we already market.
- **Idempotent batch sync keyed on observation `id`.** The phone can resend
  freely after offline gaps without duplicating rows (R2, R9).
- **Staff never mutate member observations.** The dashboard is read + acknowledge
  only; the phone remains source of truth (R6).
- **Reuse, don't reinvent.** Worker conventions come from `studio/workers/license/`;
  i18n from `livestock/i18n.js`; dashboard from the site-build pipeline. No new
  frameworks.
- **Validation is a gate, not a feature.** R10 is a process step surfaced in the
  UI, blocking clinical marketing claims until a partner signs off.

## Out of scope (v1)

- Real-time push to staff (polling/refresh is fine for v1).
- Editing/curating observations from the dashboard.
- Payments/billing for the deployment (handled out-of-band, like the pitch).
