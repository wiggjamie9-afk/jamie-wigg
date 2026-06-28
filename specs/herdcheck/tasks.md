# HerdCheck Co-op Dashboard — Tasks

Implementation checklist. Each task declares the requirements it `satisfies:` and
the `files:` it touches (authoritative for parallel-execution safety). `depends:`
lists task IDs that must land first.

---

- **T1 — D1 schema + Worker scaffold**
  `satisfies:` R2, R6
  `files:` studio/workers/herd/wrangler.toml, studio/workers/herd/src/schema.sql, studio/workers/herd/package.json, studio/workers/herd/tsconfig.json
  Scaffold the `herd` Worker (mirror `studio/workers/license/`): CORS allow-list,
  never-block, structured `{event}` logging, secrets via `wrangler secret`. D1
  tables: `orgs`, `members`, `observations`, `flags`.

- **T2 — Join + auth endpoint**
  `satisfies:` R1, R6
  `depends:` T1
  `files:` studio/workers/herd/src/index.ts
  `POST /api/herd/join` validates an org code and issues a member token; role on
  the `members` row (member vs staff).

- **T3 — Sync ingest endpoint**
  `satisfies:` R2, R9
  `depends:` T1, T2
  `files:` studio/workers/herd/src/index.ts
  `POST /api/herd/sync` accepts a batch of observations for the authed member;
  idempotent on observation `id`; never 5xx on partial/duplicate input.

- **T4 — Aggregate + flags + export endpoints**
  `satisfies:` R3, R4, R5, R6
  `depends:` T1, T2
  `files:` studio/workers/herd/src/index.ts
  `GET /api/herd/summary`, `POST /api/herd/flag/:id/ack`, `GET /api/herd/export.csv`
  (staff-token only). CSV covers animal, kind, tier, ts, reasons.

- **T5 — Client org membership**
  `satisfies:` R1, R7
  `files:` livestock/org.js, livestock/index.html
  Join/leave via org code, store `orgId` + identity + consent in the `settings`
  store; consent + "what's shared" screen. No change to the solo (un-joined) path.

- **T6 — Client store-and-forward sync**
  `satisfies:` R2, R9
  `depends:` T5
  `files:` livestock/sync.js, livestock/app.js
  Queue layered over `db.saveObservation`; flush to `/api/herd/sync` with
  retry/backoff; survives long offline gaps; never on the check's critical path.

- **T7 — Consent, privacy & leave/delete**
  `satisfies:` R7
  `depends:` T5
  `files:` livestock/org.js, livestock/index.html, livestock/i18n.js
  Explicit pre-sync consent, view shared data, leave org + request deletion.

- **T8 — Org branding & languages**
  `satisfies:` R8
  `depends:` T5
  `files:` livestock/org.js, livestock/i18n.js
  Per-org name/logo and member-facing language set via the existing i18n
  mechanism.

- **T9 — Org dashboard (static site)**
  `satisfies:` R3, R4, R5, R10
  `depends:` T4
  `files:` sites/herdcheck-coop/index.html, sites/herdcheck-coop/dashboard.js, sites/herdcheck-coop/dashboard.css
  Built via the site-build pipeline in the HerdCheck ag palette: tier breakdown,
  red-flag work queue with acknowledge, filters by kind/member, CSV export,
  deployment validation-status banner.

- **T10 — Validation gate + status**
  `satisfies:` R10
  `depends:` T1, T9
  `files:` studio/workers/herd/src/index.ts, sites/herdcheck-coop/index.html
  Per-deployment `validated` flag (partner name + date); dashboard shows status
  and the app suppresses clinical claims until set.

- **T11 — Docs**
  `satisfies:` R1, R2, R6, R7
  `depends:` T1, T5, T9
  `files:` studio/workers/herd/CLAUDE.md, specs/herdcheck/requirements.md
  Feature-doc for the `herd` Worker (same skeleton as `studio/workers/license/CLAUDE.md`);
  note the opt-in/consent invariant prominently.

---

### Suggested waves (by `depends:` + file overlap)

1. **T1**, **T5** (independent: backend scaffold vs client membership)
2. **T2**, **T7**, **T8** (T2 on backend; T7/T8 on client — T2 vs T3/T4 share
   `index.ts`, so serialise the Worker tasks)
3. **T3**, **T6**
4. **T4**
5. **T9**, **T10**
6. **T11**
