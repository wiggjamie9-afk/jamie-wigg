/**
 * HerdCheck co-op aggregation Cloudflare Worker.
 *
 * Backend for the HerdCheck offline-first PWA's *opt-in* org layer. The phone
 * (`livestock/`) stays the source of truth and works with zero network; this
 * Worker only receives observations members consent to share, and serves an
 * aggregate read to org staff.
 *
 * Base path `/api/herd`. Endpoints:
 *   POST /api/herd/join                 → issue a member|staff token for an org code
 *   POST /api/herd/sync       (member)  → idempotent upsert of animals + observations
 *   GET  /api/herd/summary    (staff)   → tier/kind/member aggregate + recent flags
 *   POST /api/herd/flag/:id/ack (staff) → acknowledge a red/amber flag
 *   GET  /api/herd/export.csv (staff)   → CSV of observations (whole org or one member)
 *
 * Mirrors the conventions of `studio/workers/license/`:
 *   - CORS allow-list (never reflect an arbitrary Origin).
 *   - Never block on D1: a transport/DB failure is a 503 the client retries;
 *     an invalid request is a 4xx. These stay distinct.
 *   - Structured `logEvent({ event })` only — NEVER log tokens, member names,
 *     animal tags, org codes, or any other PII.
 *   - Zero runtime dependencies; Workers-runtime fetch API only.
 *
 * Tiers follow `livestock/scoring.js` exactly: red > amber > green > gray, and
 * an animal's tier is the worst of the most-recent observation of each kind.
 */

export interface Env {
  /** D1 database — schema in `src/schema.sql`. */
  HERD_DB: D1Database;
}

// ---- constants ---------------------------------------------------------------

const ALLOWED_ORIGIN_EXACT = new Set<string>([
  // Studio prod (shared zone)
  "https://studio.starlightmix.com",
  // Co-op dashboard custom domain (when it lands on a real host)
  "https://herd.studio.starlightmix.com",
  // Local dev
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

/**
 * Cloudflare Pages preview/prod for the dashboard. Any `*.pages.dev` subdomain
 * (e.g. `pr-12.herdcheck-coop.pages.dev`) is allowed.
 */
const ALLOWED_ORIGIN_SUFFIX = ".pages.dev";

// Rate limit: 60 requests per minute per IP (sliding window, in-memory per
// isolate). Sync batches can be chatty after a long offline gap, so this is
// looser than the license worker; it's still a best-effort soft limit.
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

const TIERS = ["red", "amber", "green", "gray"] as const;
type Tier = (typeof TIERS)[number];
const TIER_ORDER: Record<Tier, number> = { red: 3, amber: 2, green: 1, gray: 0 };

const KINDS = ["lameness", "mastitis", "calving"] as const;
type Kind = (typeof KINDS)[number];

const SPECIES = ["cow", "buffalo", "sheep", "goat"] as const;
type Species = (typeof SPECIES)[number];

const DEFAULT_FLAG_DAYS = 7;

/**
 * In-memory rate-limit bucket, isolate-scoped (same trade-off as the license
 * worker: per-request KV/D1 writes would blow up cost; isolate-hoppers fall
 * through to Cloudflare's edge protections).
 */
const ipHits: Map<string, number[]> = new Map();

// ---- entry -------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = buildCorsHeaders(origin);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (!url.pathname.startsWith("/api/herd")) {
      return errorJson("Not found", 404, cors);
    }

    // Soft rate-limit by client IP.
    const ip = clientIp(request);
    if (!allowRequest(ip)) {
      logEvent("rate_limited");
      return errorJson("Too many requests. Try again in a minute.", 429, cors);
    }

    try {
      return await route(request, env, url, cors);
    } catch (err) {
      // Distinguish D1-unreachable (retry) from a genuine bad request.
      if (err instanceof HttpError) {
        logEvent(err.event);
        return errorJson(err.message, err.status, cors);
      }
      // Anything else is treated as a backend/D1 fault → 503 (client retries).
      logEvent("backend_error");
      return errorJson(
        "Couldn't reach the co-op backend. Please try again in a moment.",
        503,
        cors,
      );
    }
  },
};

// ---- routing -----------------------------------------------------------------

async function route(
  request: Request,
  env: Env,
  url: URL,
  cors: Record<string, string>,
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // POST /api/herd/join  (no auth)
  if (path === "/api/herd/join" && method === "POST") {
    return handleJoin(request, env, cors);
  }

  // POST /api/herd/sync  (member)
  if (path === "/api/herd/sync" && method === "POST") {
    const member = await authMember(request, env);
    return handleSync(request, env, member, cors);
  }

  // GET /api/herd/summary  (staff)
  if (path === "/api/herd/summary" && method === "GET") {
    const member = await authStaff(request, env);
    return handleSummary(env, member, url, cors);
  }

  // POST /api/herd/flag/:id/ack  (staff)
  const ackMatch = path.match(/^\/api\/herd\/flag\/([^/]+)\/ack$/);
  if (ackMatch && method === "POST") {
    const member = await authStaff(request, env);
    return handleFlagAck(env, member, decodeURIComponent(ackMatch[1] ?? ""), cors);
  }

  // GET /api/herd/export.csv  (staff)
  if (path === "/api/herd/export.csv" && method === "GET") {
    const member = await authStaff(request, env);
    return handleExport(env, member, url, cors);
  }

  // Known prefix, unknown route/method.
  return errorJson("Not found", 404, cors);
}

// ---- handlers ----------------------------------------------------------------

interface OrgRow {
  id: string;
  name: string;
  member_code: string;
  staff_code: string;
  validated: number;
  validated_by: string | null;
  validated_at: string | null;
}

interface MemberRow {
  id: string;
  org_id: string;
  name: string;
  role: "member" | "staff";
  token: string;
  last_sync: string | null;
}

/**
 * POST /api/herd/join { orgCode, memberName }
 * Resolves an org code to a role and issues an opaque bearer token. An unknown
 * code returns 200 { ok:false } so status codes don't leak which codes exist.
 */
async function handleJoin(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Promise<Response> {
  const body = await parseJson(request);
  const orgCode = readString(body, "orgCode");
  const memberName = readString(body, "memberName");

  if (!orgCode || !memberName) {
    throw new HttpError(400, "Missing orgCode or memberName", "join_bad_body");
  }
  if (memberName.length > 120 || orgCode.length > 120) {
    throw new HttpError(400, "orgCode or memberName too long", "join_bad_body");
  }

  // A code matches either the member_code or the staff_code of some org.
  const org = await first<OrgRow>(
    env,
    "SELECT id, name, member_code, staff_code, validated, validated_by, validated_at " +
      "FROM orgs WHERE member_code = ?1 OR staff_code = ?1",
    [orgCode],
    "join_query_failed",
  );

  if (!org) {
    logEvent("join_unknown_code");
    return json({ ok: false, reason: "Unknown org code" }, 200, cors);
  }

  const role: "member" | "staff" = orgCode === org.staff_code ? "staff" : "member";
  const token = newToken();
  const memberId = newId("mem");

  await run(
    env,
    "INSERT INTO members (id, org_id, name, role, token, last_sync) " +
      "VALUES (?1, ?2, ?3, ?4, ?5, NULL)",
    [memberId, org.id, memberName, role, token],
    "join_insert_failed",
  );

  logEvent(role === "staff" ? "join_staff" : "join_member");
  return json(
    { token, role, orgId: org.id, orgName: org.name },
    200,
    cors,
  );
}

interface SyncAnimal {
  id: string;
  tag: string;
  species: Species;
}

interface SyncObservation {
  id: string;
  animalId: string;
  kind: Kind;
  ts: string;
  tier: Tier;
  reasons: string[];
  actions: string[];
}

/**
 * POST /api/herd/sync { animals, observations }  (member)
 * Idempotent upsert keyed on the client-supplied row id. Malformed rows are
 * skipped, never fatal — the phone may resend freely after offline gaps.
 */
async function handleSync(
  request: Request,
  env: Env,
  member: MemberRow,
  cors: Record<string, string>,
): Promise<Response> {
  const body = await parseJson(request);
  const rawAnimals = Array.isArray((body as Record<string, unknown>)?.animals)
    ? ((body as Record<string, unknown>).animals as unknown[])
    : [];
  const rawObs = Array.isArray((body as Record<string, unknown>)?.observations)
    ? ((body as Record<string, unknown>).observations as unknown[])
    : [];

  const animals = rawAnimals
    .map(parseAnimal)
    .filter((a): a is SyncAnimal => a !== null);
  const observations = rawObs
    .map(parseObservation)
    .filter((o): o is SyncObservation => o !== null);

  const statements: D1PreparedStatement[] = [];

  // Upsert animals. ON CONFLICT(id) keeps the row scoped to its owning member;
  // we never reassign an animal across members on a re-sync.
  for (const a of animals) {
    statements.push(
      env.HERD_DB.prepare(
        "INSERT INTO animals (id, org_id, member_id, tag, species) " +
          "VALUES (?1, ?2, ?3, ?4, ?5) " +
          "ON CONFLICT(id) DO UPDATE SET tag = excluded.tag, species = excluded.species",
      ).bind(a.id, member.org_id, member.id, a.tag, a.species),
    );
  }

  // Upsert observations. Idempotent on observation id (re-sending is safe).
  for (const o of observations) {
    statements.push(
      env.HERD_DB.prepare(
        "INSERT INTO observations " +
          "(id, animal_id, org_id, member_id, kind, ts, tier, reasons_json, actions_json) " +
          "VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9) " +
          "ON CONFLICT(id) DO UPDATE SET " +
          "kind = excluded.kind, ts = excluded.ts, tier = excluded.tier, " +
          "reasons_json = excluded.reasons_json, actions_json = excluded.actions_json",
      ).bind(
        o.id,
        o.animalId,
        member.org_id,
        member.id,
        o.kind,
        o.ts,
        o.tier,
        JSON.stringify(o.reasons),
        JSON.stringify(o.actions),
      ),
    );

    // A red/amber observation seeds a flag row (unacked). ON CONFLICT keeps an
    // existing ack state intact when the same observation re-syncs.
    if (o.tier === "red" || o.tier === "amber") {
      statements.push(
        env.HERD_DB.prepare(
          "INSERT INTO flags (observation_id, acked, acked_by, acked_at) " +
            "VALUES (?1, 0, NULL, NULL) ON CONFLICT(observation_id) DO NOTHING",
        ).bind(o.id),
      );
    }
  }

  // Touch the member's last_sync.
  statements.push(
    env.HERD_DB.prepare("UPDATE members SET last_sync = ?2 WHERE id = ?1").bind(
      member.id,
      nowIso(),
    ),
  );

  await batch(env, statements, "sync_batch_failed");

  logEvent("sync_ok");
  return json({ accepted: animals.length + observations.length }, 200, cors);
}

interface SummaryObsRow {
  id: string;
  member_id: string;
  member_name: string;
  animal_id: string;
  animal_tag: string;
  kind: Kind;
  ts: string;
  tier: Tier;
  reasons_json: string;
  acked: number | null;
}

/**
 * GET /api/herd/summary?days=N  (staff)
 * Aggregates the org: per-animal tier (most-recent-of-each-kind), per-member
 * rollups, by-kind counts, and the recent red/amber flag queue.
 */
async function handleSummary(
  env: Env,
  member: MemberRow,
  url: URL,
  cors: Record<string, string>,
): Promise<Response> {
  const days = clampDays(url.searchParams.get("days"));
  const org = await first<OrgRow>(
    env,
    "SELECT id, name, member_code, staff_code, validated, validated_by, validated_at " +
      "FROM orgs WHERE id = ?1",
    [member.org_id],
    "summary_org_failed",
  );
  if (!org) throw new HttpError(404, "Org not found", "summary_org_missing");

  // Pull every observation for the org joined to its member + animal. For a
  // co-op this is bounded (smallholders, not feedlots); aggregation is in JS so
  // the most-recent-of-each-kind rule exactly mirrors scoring.animalTier.
  const rows = await all<SummaryObsRow>(
    env,
    "SELECT o.id, o.member_id, m.name AS member_name, o.animal_id, a.tag AS animal_tag, " +
      "o.kind, o.ts, o.tier, o.reasons_json, f.acked AS acked " +
      "FROM observations o " +
      "JOIN members m ON m.id = o.member_id " +
      "JOIN animals a ON a.id = o.animal_id " +
      "LEFT JOIN flags f ON f.observation_id = o.id " +
      "WHERE o.org_id = ?1 " +
      "ORDER BY o.ts DESC",
    [org.id],
    "summary_query_failed",
  );

  // members list (so members with zero observations still appear)
  const memberRows = await all<{ id: string; name: string; last_sync: string | null }>(
    env,
    "SELECT id, name, last_sync FROM members WHERE org_id = ?1 AND role = 'member'",
    [org.id],
    "summary_members_failed",
  );

  const summary = aggregate(rows, memberRows, days);

  logEvent("summary_ok");
  return json(
    {
      org: {
        id: org.id,
        name: org.name,
        validated: org.validated === 1,
        validatedBy: org.validated_by,
        validatedAt: org.validated_at,
      },
      ...summary,
    },
    200,
    cors,
  );
}

/**
 * POST /api/herd/flag/:id/ack  (staff)
 * Marks a flag acknowledged, recording who and when server-side. Idempotent.
 */
async function handleFlagAck(
  env: Env,
  member: MemberRow,
  observationId: string,
  cors: Record<string, string>,
): Promise<Response> {
  if (!observationId) {
    throw new HttpError(400, "Missing flag id", "ack_bad_id");
  }

  // Only ack flags that belong to this staffer's org (no cross-org writes).
  const owns = await first<{ org_id: string }>(
    env,
    "SELECT org_id FROM observations WHERE id = ?1",
    [observationId],
    "ack_lookup_failed",
  );
  if (!owns || owns.org_id !== member.org_id) {
    throw new HttpError(404, "Flag not found", "ack_not_found");
  }

  await run(
    env,
    "UPDATE flags SET acked = 1, acked_by = ?2, acked_at = ?3 WHERE observation_id = ?1",
    [observationId, member.id, nowIso()],
    "ack_update_failed",
  );

  logEvent("flag_acked");
  return json({ ok: true }, 200, cors);
}

interface ExportRow {
  member_name: string;
  animal_tag: string;
  species: Species;
  kind: Kind;
  tier: Tier;
  ts: string;
  reasons_json: string;
}

/**
 * GET /api/herd/export.csv?memberId=  (staff)
 * CSV of observations for the whole org, or one member when `memberId` is given.
 */
async function handleExport(
  env: Env,
  member: MemberRow,
  url: URL,
  cors: Record<string, string>,
): Promise<Response> {
  const memberId = url.searchParams.get("memberId");

  let sql =
    "SELECT m.name AS member_name, a.tag AS animal_tag, a.species AS species, " +
    "o.kind, o.tier, o.ts, o.reasons_json " +
    "FROM observations o " +
    "JOIN members m ON m.id = o.member_id " +
    "JOIN animals a ON a.id = o.animal_id " +
    "WHERE o.org_id = ?1";
  const params: unknown[] = [member.org_id];
  if (memberId) {
    sql += " AND o.member_id = ?2";
    params.push(memberId);
  }
  sql += " ORDER BY o.ts DESC";

  const rows = await all<ExportRow>(env, sql, params, "export_query_failed");

  const header = "member,animal_tag,species,kind,tier,timestamp,reasons";
  const lines = rows.map((r) =>
    [
      csvCell(r.member_name),
      csvCell(r.animal_tag),
      csvCell(r.species),
      csvCell(r.kind),
      csvCell(r.tier),
      csvCell(r.ts),
      csvCell(parseReasons(r.reasons_json).join("; ")),
    ].join(","),
  );
  const csv = [header, ...lines].join("\r\n") + "\r\n";

  logEvent("export_ok");
  return new Response(csv, {
    status: 200,
    headers: {
      ...cors,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="herdcheck-export.csv"',
      "Cache-Control": "no-store",
    },
  });
}

// ---- aggregation -------------------------------------------------------------

interface MemberAgg {
  memberId: string;
  name: string;
  animals: Set<string>;
  red: number;
  amber: number;
  green: number;
  lastSync: string | null;
}

/**
 * Roll up observation rows into the summary shape. Tiers for totals/members use
 * the most-recent-of-each-kind-per-animal rule (mirrors scoring.animalTier);
 * by-kind counts use the most-recent observation of that kind per animal; flags
 * are the recent red/amber observations within `days`.
 */
function aggregate(
  rows: SummaryObsRow[],
  memberRows: { id: string; name: string; last_sync: string | null }[],
  days: number,
): {
  totals: { animals: number; red: number; amber: number; green: number; gray: number };
  byKind: Record<Kind, { red: number; amber: number; green: number }>;
  members: {
    memberId: string;
    name: string;
    animals: number;
    red: number;
    amber: number;
    green: number;
    lastSync: string | null;
  }[];
  flags: {
    id: string;
    memberName: string;
    animalTag: string;
    kind: string;
    tier: "red" | "amber";
    ts: string;
    reasons: string[];
    acked: boolean;
  }[];
} {
  // rows arrive ts DESC. The first time we see (animal, kind) is the most-recent
  // observation of that kind for that animal.
  const seenAnimalKind = new Set<string>();
  // animalId → { kind → tier } of the most-recent of each kind
  const animalKindTier = new Map<string, Map<Kind, Tier>>();
  // animalId → owning memberId (and member name)
  const animalMember = new Map<string, { memberId: string; name: string }>();

  const byKind: Record<Kind, { red: number; amber: number; green: number }> = {
    lameness: { red: 0, amber: 0, green: 0 },
    mastitis: { red: 0, amber: 0, green: 0 },
    calving: { red: 0, amber: 0, green: 0 },
  };

  for (const r of rows) {
    const akKey = r.animal_id + " " + r.kind;
    if (seenAnimalKind.has(akKey)) continue; // older obs of this kind — skip
    seenAnimalKind.add(akKey);

    if (!animalKindTier.has(r.animal_id)) animalKindTier.set(r.animal_id, new Map());
    animalKindTier.get(r.animal_id)!.set(r.kind, r.tier);
    animalMember.set(r.animal_id, { memberId: r.member_id, name: r.member_name });

    // by-kind counts (gray excluded — scoring only emits red/amber/green here)
    if (r.tier === "red" || r.tier === "amber" || r.tier === "green") {
      byKind[r.kind][r.tier] += 1;
    }
  }

  // Per-animal worst tier → totals + per-member rollup.
  const totals = { animals: 0, red: 0, amber: 0, green: 0, gray: 0 };
  const memberAgg = new Map<string, MemberAgg>();
  for (const m of memberRows) {
    memberAgg.set(m.id, {
      memberId: m.id,
      name: m.name,
      animals: new Set(),
      red: 0,
      amber: 0,
      green: 0,
      lastSync: m.last_sync,
    });
  }

  for (const [animalId, kindTiers] of animalKindTier) {
    const worst = worstTier([...kindTiers.values()]);
    totals.animals += 1;
    totals[worst] += 1;

    const owner = animalMember.get(animalId);
    if (owner) {
      let agg = memberAgg.get(owner.memberId);
      if (!agg) {
        // Observation from a member row we didn't list (e.g. a staff self-test).
        agg = {
          memberId: owner.memberId,
          name: owner.name,
          animals: new Set(),
          red: 0,
          amber: 0,
          green: 0,
          lastSync: null,
        };
        memberAgg.set(owner.memberId, agg);
      }
      agg.animals.add(animalId);
      if (worst === "red") agg.red += 1;
      else if (worst === "amber") agg.amber += 1;
      else if (worst === "green") agg.green += 1;
    }
  }

  const members = [...memberAgg.values()].map((a) => ({
    memberId: a.memberId,
    name: a.name,
    animals: a.animals.size,
    red: a.red,
    amber: a.amber,
    green: a.green,
    lastSync: a.lastSync,
  }));

  // Flags: red/amber observations within `days`, newest first.
  const cutoff = Date.now() - days * 86_400_000;
  const flags = rows
    .filter((r) => r.tier === "red" || r.tier === "amber")
    .filter((r) => {
      const t = Date.parse(r.ts);
      return Number.isNaN(t) ? false : t >= cutoff;
    })
    .map((r) => ({
      id: r.id, // observation id — this is what /flag/:id/ack takes
      memberName: r.member_name,
      animalTag: r.animal_tag,
      kind: r.kind,
      tier: r.tier as "red" | "amber",
      ts: r.ts,
      reasons: parseReasons(r.reasons_json),
      acked: r.acked === 1,
    }));

  return { totals, byKind, members, flags };
}

function worstTier(tiers: Tier[]): Tier {
  return tiers.reduce<Tier>(
    (best, t) => (TIER_ORDER[t] > TIER_ORDER[best] ? t : best),
    "green",
  );
}

// ---- auth --------------------------------------------------------------------

async function authMember(request: Request, env: Env): Promise<MemberRow> {
  const m = await lookupToken(request, env);
  // Both members and staff may sync; the role gate that matters is staff-only
  // reads. We still log which path authed.
  return m;
}

async function authStaff(request: Request, env: Env): Promise<MemberRow> {
  const m = await lookupToken(request, env);
  if (m.role !== "staff") {
    throw new HttpError(401, "Staff token required", "auth_not_staff");
  }
  return m;
}

async function lookupToken(request: Request, env: Env): Promise<MemberRow> {
  const token = bearer(request);
  if (!token) throw new HttpError(401, "Missing bearer token", "auth_missing");

  const m = await first<MemberRow>(
    env,
    "SELECT id, org_id, name, role, token, last_sync FROM members WHERE token = ?1",
    [token],
    "auth_query_failed",
  );
  if (!m) throw new HttpError(401, "Invalid token", "auth_invalid");
  return m;
}

function bearer(request: Request): string | null {
  const h = request.headers.get("Authorization");
  if (!h) return null;
  const match = h.match(/^Bearer\s+(.+)$/i);
  const tok = match?.[1]?.trim();
  if (!tok || tok.length < 8 || tok.length > 200) return null;
  return tok;
}

// ---- D1 helpers (never block: DB faults throw → 503) -------------------------

async function first<T>(
  env: Env,
  sql: string,
  params: unknown[],
  event: string,
): Promise<T | null> {
  try {
    return await env.HERD_DB.prepare(sql).bind(...params).first<T>();
  } catch {
    throw new HttpError(503, "Backend unavailable", event, true);
  }
}

async function all<T>(
  env: Env,
  sql: string,
  params: unknown[],
  event: string,
): Promise<T[]> {
  try {
    const res = await env.HERD_DB.prepare(sql).bind(...params).all<T>();
    return res.results ?? [];
  } catch {
    throw new HttpError(503, "Backend unavailable", event, true);
  }
}

async function run(
  env: Env,
  sql: string,
  params: unknown[],
  event: string,
): Promise<void> {
  try {
    await env.HERD_DB.prepare(sql).bind(...params).run();
  } catch {
    throw new HttpError(503, "Backend unavailable", event, true);
  }
}

async function batch(
  env: Env,
  statements: D1PreparedStatement[],
  event: string,
): Promise<void> {
  if (statements.length === 0) return;
  try {
    await env.HERD_DB.batch(statements);
  } catch {
    throw new HttpError(503, "Backend unavailable", event, true);
  }
}

// ---- parsing / validation ----------------------------------------------------

async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body", "bad_json");
  }
}

function readString(body: unknown, key: string): string | null {
  if (!body || typeof body !== "object") return null;
  const v = (body as Record<string, unknown>)[key];
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

function parseAnimal(raw: unknown): SyncAnimal | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = strField(r.id, 200);
  const tag = strField(r.tag, 200);
  const species = r.species;
  if (!id || !tag) return null;
  if (typeof species !== "string" || !(SPECIES as readonly string[]).includes(species)) {
    return null;
  }
  return { id, tag, species: species as Species };
}

function parseObservation(raw: unknown): SyncObservation | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = strField(r.id, 200);
  const animalId = strField(r.animalId, 200);
  const kind = r.kind;
  const ts = strField(r.ts, 64);
  const tier = r.tier;
  if (!id || !animalId || !ts) return null;
  if (typeof kind !== "string" || !(KINDS as readonly string[]).includes(kind)) return null;
  if (typeof tier !== "string" || !(TIERS as readonly string[]).includes(tier)) return null;
  if (Number.isNaN(Date.parse(ts))) return null;
  return {
    id,
    animalId,
    kind: kind as Kind,
    ts,
    tier: tier as Tier,
    reasons: strArray(r.reasons),
    actions: strArray(r.actions),
  };
}

function strField(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t.length || t.length > max) return null;
  return t;
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string").slice(0, 50);
}

function parseReasons(jsonStr: string): string[] {
  try {
    const v = JSON.parse(jsonStr);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function clampDays(raw: string | null): number {
  if (!raw) return DEFAULT_FLAG_DAYS;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return DEFAULT_FLAG_DAYS;
  return Math.min(n, 365);
}

// ---- CSV ---------------------------------------------------------------------

function csvCell(value: string): string {
  // RFC 4180: quote if the cell contains comma, quote, CR, or LF; double inner quotes.
  if (/[",\r\n]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

// ---- ids / time --------------------------------------------------------------

function newId(prefix: string): string {
  return prefix + "_" + crypto.randomUUID();
}

function newToken(): string {
  // Opaque, high-entropy bearer token (URL-safe).
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return "hct_" + s;
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---- responses ---------------------------------------------------------------

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function isOriginAllowed(origin: string): boolean {
  if (ALLOWED_ORIGIN_EXACT.has(origin)) return true;
  try {
    const host = new URL(origin).host;
    if (host.endsWith(ALLOWED_ORIGIN_SUFFIX)) return true;
  } catch {
    return false;
  }
  return false;
}

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function errorJson(
  message: string,
  status: number,
  cors: Record<string, string>,
): Response {
  return json({ error: message }, status, cors);
}

/**
 * Typed error so handlers can throw a precise (status, event) pair. `retryable`
 * is informational — a 503 is the signal the client retries; a 4xx is a
 * definite answer it should not.
 */
class HttpError extends Error {
  status: number;
  event: string;
  retryable: boolean;
  constructor(status: number, message: string, event: string, retryable = false) {
    super(message);
    this.status = status;
    this.event = event;
    this.retryable = retryable;
  }
}

// ---- rate limit --------------------------------------------------------------

function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = ipHits.get(ip) ?? [];
  const fresh = hits.filter((t) => t > cutoff);
  if (fresh.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, fresh);
    return false;
  }
  fresh.push(now);
  ipHits.set(ip, fresh);

  if (ipHits.size > 10_000) {
    for (const [k, v] of ipHits) {
      const kept = v.filter((t) => t > cutoff);
      if (kept.length === 0) ipHits.delete(k);
      else ipHits.set(k, kept);
    }
  }
  return true;
}

// ---- logging -----------------------------------------------------------------

/**
 * Structured logging — event name only. NEVER log tokens, member names, animal
 * tags, org codes, IPs, or any request body. This is a stated guarantee of the
 * feature (opt-in + no-PII-in-logs), not a style preference.
 */
function logEvent(event: string): void {
  console.log(JSON.stringify({ event }));
}
