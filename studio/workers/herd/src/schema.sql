-- HerdCheck co-op D1 schema.
--
-- Apply once after `wrangler d1 create starlightmix-herd`:
--   wrangler d1 execute starlightmix-herd --remote --file=src/schema.sql
-- (drop --remote to seed the local dev DB used by `wrangler dev`).
--
-- Design notes (see specs/herdcheck/design.md):
--   - Staff are read-only over observations; only flags carry server-side state
--     (the ack). The phone (livestock/) stays source of truth.
--   - Sync is idempotent: animals + observations upsert on their client id, so a
--     phone can resend freely after an offline gap without duplicating rows.
--   - Opt-in: a row exists here only because a member consented to share it.

PRAGMA foreign_keys = ON;

-- Orgs (co-ops). A member_code issues a member token; a staff_code (a separate
-- value) issues a staff token. `validated` gates clinical marketing claims (R10):
-- it's flipped on by a partner sign-off, recorded with who/when.
CREATE TABLE IF NOT EXISTS orgs (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  member_code   TEXT NOT NULL UNIQUE,
  staff_code    TEXT NOT NULL UNIQUE,
  validated     INTEGER NOT NULL DEFAULT 0,   -- 0/1
  validated_by  TEXT,
  validated_at  TEXT                          -- ISO8601
);

-- Members. The opaque bearer token lives on this row; `role` is the gate between
-- sync (member|staff) and aggregate reads (staff only).
CREATE TABLE IF NOT EXISTS members (
  id         TEXT PRIMARY KEY,
  org_id     TEXT NOT NULL REFERENCES orgs(id),
  name       TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('member','staff')),
  token      TEXT NOT NULL UNIQUE,
  last_sync  TEXT                             -- ISO8601, NULL until first sync
);
CREATE INDEX IF NOT EXISTS idx_members_org   ON members(org_id);
CREATE INDEX IF NOT EXISTS idx_members_token ON members(token);

-- Animals. `id` is the phone-assigned id (idempotent upsert target).
CREATE TABLE IF NOT EXISTS animals (
  id         TEXT PRIMARY KEY,
  org_id     TEXT NOT NULL REFERENCES orgs(id),
  member_id  TEXT NOT NULL REFERENCES members(id),
  tag        TEXT NOT NULL,
  species    TEXT NOT NULL CHECK (species IN ('cow','buffalo','sheep','goat'))
);
CREATE INDEX IF NOT EXISTS idx_animals_org ON animals(org_id);

-- Observations. Mirrors the livestock/db.js shape + org_id/member_id. `id` is
-- the phone-assigned observation id (idempotent upsert target). reasons/actions
-- are stored as JSON arrays of strings (English advice, as on the phone).
CREATE TABLE IF NOT EXISTS observations (
  id            TEXT PRIMARY KEY,
  animal_id     TEXT NOT NULL REFERENCES animals(id),
  org_id        TEXT NOT NULL REFERENCES orgs(id),
  member_id     TEXT NOT NULL REFERENCES members(id),
  kind          TEXT NOT NULL CHECK (kind IN ('lameness','mastitis','calving')),
  ts            TEXT NOT NULL,                 -- ISO8601
  tier          TEXT NOT NULL CHECK (tier IN ('red','amber','green','gray')),
  reasons_json  TEXT NOT NULL DEFAULT '[]',
  actions_json  TEXT NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_obs_org      ON observations(org_id, ts);
CREATE INDEX IF NOT EXISTS idx_obs_animal   ON observations(animal_id, kind, ts);
CREATE INDEX IF NOT EXISTS idx_obs_member   ON observations(member_id);

-- Flags. One row per red/amber observation, carrying ack state. The PK is the
-- observation id, so re-syncing the same observation never resets an ack.
CREATE TABLE IF NOT EXISTS flags (
  observation_id  TEXT PRIMARY KEY REFERENCES observations(id),
  acked           INTEGER NOT NULL DEFAULT 0,  -- 0/1
  acked_by        TEXT,                        -- member id (staff) who acked
  acked_at        TEXT                         -- ISO8601
);

-- ---------------------------------------------------------------------------
-- Seed data (DEMO ONLY) — uncomment to try the API end-to-end.
-- One org with a member code and a staff code, so a reviewer can:
--   curl -XPOST .../api/herd/join -d '{"orgCode":"GREENVALLEY-MEMBER","memberName":"Asha"}'
--   curl -XPOST .../api/herd/join -d '{"orgCode":"GREENVALLEY-STAFF","memberName":"Vet Pat"}'
-- ---------------------------------------------------------------------------
-- INSERT OR IGNORE INTO orgs (id, name, member_code, staff_code, validated, validated_by, validated_at)
-- VALUES ('org_demo', 'Green Valley Co-op', 'GREENVALLEY-MEMBER', 'GREENVALLEY-STAFF', 0, NULL, NULL);
--
-- INSERT OR IGNORE INTO members (id, org_id, name, role, token, last_sync)
-- VALUES ('mem_demo_staff', 'org_demo', 'Vet Pat', 'staff', 'hct_demo_staff_token_replace_me', NULL);
--
-- INSERT OR IGNORE INTO members (id, org_id, name, role, token, last_sync)
-- VALUES ('mem_demo_member', 'org_demo', 'Asha', 'member', 'hct_demo_member_token_replace_me', NULL);
