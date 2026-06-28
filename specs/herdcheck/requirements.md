# HerdCheck Co-op Dashboard — Requirements

The thing a co-op / NGO actually pays for (see `livestock/PITCH.md`): an
**aggregate, multi-farm view** over the per-animal screenings that the existing
HerdCheck PWA (`livestock/`) records locally. The farmer app stays free and
offline; this feature adds the organisation layer on top.

Constraint that shapes everything: HerdCheck today is **local-only** — each
phone keeps its data in IndexedDB (`livestock/db.js`), no server, no account.
Aggregation therefore needs an **explicit, opt-in** way to get observations off
the phone without breaking the offline-first, no-account promise for solo users.

## Requirements

- **R1 — Organisation membership.** A member can join an organisation by entering
  an org code (or scanning a QR). Joining is opt-in and reversible; a member who
  never joins keeps the current 100% local, no-account experience unchanged.

- **R2 — Opt-in sync of observations.** When a member belongs to an org, their
  animals and observations (the existing `db.js` shape: tier, kind, ts, reasons,
  actions) can be pushed to the org backend. Sync is queued and retried, and
  must tolerate long offline periods (store-and-forward).

- **R3 — Aggregate herd dashboard.** An org user sees, across all member herds:
  total animals screened, counts by tier (red/amber/green/gray), and red/amber
  flags from the last N days, filterable by check kind (lameness/mastitis/calving)
  and by member.

- **R4 — Alert roll-up.** New `red` observations surface as an actionable list
  for the org (member, animal tag, kind, when), so extension staff can follow up.
  Resolving/acknowledging a flag is recorded.

- **R5 — Record export.** An org user can export records to CSV — per member and
  for the whole org — covering animal, kind, tier, timestamp, and reasons.

- **R6 — Roles & access.** At least two roles: **member** (sees only their own
  herd) and **org staff** (sees the org aggregate). Staff cannot edit a member's
  raw observations; the member's phone remains the source of truth.

- **R7 — Privacy & consent.** A member explicitly consents before any data leaves
  their phone, can see what is shared, and can leave the org and request deletion.
  No PII beyond what the member provides (animal tags, optional notes). This
  preserves the app's stated "your data stays on your phone" default for everyone
  who does not opt in.

- **R8 — Branding & languages.** An org deployment can set a name/logo and the
  member-facing languages, reusing the existing `i18n.js` mechanism.

- **R9 — Offline integrity.** Going through the org flow must never block or slow
  the core checks. If the backend is unreachable, screening still works and sync
  catches up later (mirrors the license Worker's "never block on the network"
  rule).

- **R10 — Validation gate.** Before any deployment markets a clinical claim, the
  scoring is signed off by a named partner (vet school / extension service). The
  dashboard shows the validation status of the deployment.
