/**
 * RHYTHMIX license-validation Cloudflare Worker.
 *
 * POST /api/license { key } → { valid: true, tier } | { valid: false, reason }
 *
 * - Verifies against the Gumroad license API.
 * - Caches valid results in KV with 24 h TTL (R10 + open-question resolution).
 * - Never logs the license key, the Gumroad response body, or any PII.
 * - CORS-locked to the studio.rhythmixapp.com.au origins (+ dev).
 * - In-memory sliding-window IP rate limit (best-effort per isolate).
 *
 * Satisfies R10. Does NOT see the user's Replicate token — that's T8.
 */

export interface Env {
  /** Secret — set via `wrangler secret put GUMROAD_PRODUCT_ID`. */
  GUMROAD_PRODUCT_ID: string;
  /** KV namespace — 24 h cache of valid results, keyed `cached:<license_key>`. */
  LICENSE_CACHE: KVNamespace;
}

// ---- constants ---------------------------------------------------------------

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 h
const CACHE_PREFIX = "cached:";

const ALLOWED_ORIGIN_EXACT = new Set<string>([
  "https://studio.rhythmixapp.com.au",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

/** Preview deploys on Cloudflare Pages — e.g. `pr-12.studio.rhythmixapp-pages.dev`. */
const ALLOWED_ORIGIN_SUFFIX = ".studio.rhythmixapp-pages.dev";

// Rate limit: 20 requests per minute per IP (sliding window, in-memory).
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * In-memory rate-limit bucket. Lives only as long as the isolate, which is
 * fine for a low-cost soft limit — a determined attacker who hops isolates
 * gets bumped to Cloudflare's edge protections anyway. We intentionally don't
 * store this in KV (every request would write, blowing up KV ops).
 */
const ipHits: Map<string, number[]> = new Map();

// ---- entry -------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const corsHeaders = buildCorsHeaders(origin);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname !== "/api/license") {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json(
        { valid: false, reason: "Method not allowed" },
        405,
        corsHeaders,
      );
    }

    // Soft rate-limit by client IP.
    const ip = clientIp(request);
    if (!allowRequest(ip)) {
      logEvent("rate_limited");
      return json(
        { valid: false, reason: "Too many requests. Try again in a minute." },
        429,
        corsHeaders,
      );
    }

    // Parse body.
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json(
        { valid: false, reason: "Invalid JSON body" },
        400,
        corsHeaders,
      );
    }

    const key = extractKey(body);
    if (!key) {
      return json(
        { valid: false, reason: "Missing or malformed license key" },
        400,
        corsHeaders,
      );
    }

    // KV cache hit fast-path.
    try {
      const cached = await env.LICENSE_CACHE.get(CACHE_PREFIX + key, "json");
      if (cached && isCachedValid(cached)) {
        logEvent("cache_hit");
        return json(
          { valid: true, tier: cached.tier },
          200,
          corsHeaders,
        );
      }
    } catch {
      // KV unavailable — fall through to Gumroad. Never block on cache failure.
      logEvent("kv_unavailable");
    }

    // Verify with Gumroad.
    let gumroad: GumroadVerifyResponse | null = null;
    try {
      gumroad = await verifyWithGumroad(key, env.GUMROAD_PRODUCT_ID);
    } catch {
      logEvent("gumroad_unreachable");
      return json(
        {
          valid: false,
          reason:
            "Couldn't reach Gumroad to verify your key. Please try again in a moment.",
        },
        503,
        corsHeaders,
      );
    }

    if (!gumroad || !gumroad.success) {
      logEvent("gumroad_invalid");
      // Do NOT cache failures — a Gumroad blip shouldn't lock a real customer out.
      return json(
        { valid: false, reason: "Invalid or unknown license key" },
        200,
        corsHeaders,
      );
    }

    const tier = deriveTier(gumroad);
    const entry = { tier, cachedAt: Date.now() };

    // Cache valid result (best-effort).
    try {
      await env.LICENSE_CACHE.put(
        CACHE_PREFIX + key,
        JSON.stringify(entry),
        { expirationTtl: CACHE_TTL_SECONDS },
      );
    } catch {
      logEvent("kv_write_failed");
    }

    return json({ valid: true, tier }, 200, corsHeaders);
  },
};

// ---- helpers -----------------------------------------------------------------

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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

function extractKey(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const k = (body as Record<string, unknown>).key;
  if (typeof k !== "string") return null;
  const trimmed = k.trim();
  // Gumroad license keys are dash-separated alphanumeric, typically 35 chars
  // (e.g. `XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX`). Reject obvious garbage.
  if (trimmed.length < 8 || trimmed.length > 128) return null;
  if (!/^[A-Za-z0-9-]+$/.test(trimmed)) return null;
  return trimmed;
}

function isCachedValid(
  cached: unknown,
): cached is { tier: "lifetime" | "monthly"; cachedAt: number } {
  if (!cached || typeof cached !== "object") return false;
  const c = cached as Record<string, unknown>;
  return (
    (c.tier === "lifetime" || c.tier === "monthly") &&
    typeof c.cachedAt === "number"
  );
}

// ---- Gumroad -----------------------------------------------------------------

interface GumroadVerifyResponse {
  success: boolean;
  uses?: number;
  purchase?: {
    product_name?: string;
    variants?: string;
    variants_and_quantity?: string;
    price?: number;
    refunded?: boolean;
    chargebacked?: boolean;
    subscription_id?: string | null;
    subscription_cancelled_at?: string | null;
    subscription_failed_at?: string | null;
    subscription_ended_at?: string | null;
    [k: string]: unknown;
  };
  message?: string;
}

async function verifyWithGumroad(
  key: string,
  productId: string,
): Promise<GumroadVerifyResponse> {
  const body = new URLSearchParams();
  body.set("product_id", productId);
  body.set("license_key", key);
  // We re-verify on every cache miss; don't bump uses or Gumroad will rate-limit.
  body.set("increment_uses_count", "false");

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  // Gumroad returns 404 for unknown keys with `{ success: false }`. Treat any
  // non-2xx with a parseable body as a "not valid" outcome; otherwise it's a
  // transport error and we throw so the caller can return 503.
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("gumroad_parse_failed");
  }

  if (!data || typeof data !== "object") {
    throw new Error("gumroad_shape_invalid");
  }
  return data as GumroadVerifyResponse;
}

/**
 * Map a Gumroad purchase → our tier shape.
 *
 * The $149 lifetime SKU surfaces in one of three places:
 *   1. `purchase.variants` / `variants_and_quantity` containing "lifetime"
 *   2. `product_name` containing "lifetime"
 *   3. A non-recurring purchase (`subscription_id` is null/absent) with the
 *      lifetime price point
 *
 * Anything with an active `subscription_id` is "monthly". A purchase whose
 * subscription has been cancelled / refunded / failed is still treated as
 * valid here — Gumroad would have returned `success: false` otherwise.
 */
function deriveTier(
  res: GumroadVerifyResponse,
): "lifetime" | "monthly" {
  const p = res.purchase ?? {};
  const haystack = [
    typeof p.variants === "string" ? p.variants : "",
    typeof p.variants_and_quantity === "string" ? p.variants_and_quantity : "",
    typeof p.product_name === "string" ? p.product_name : "",
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes("lifetime")) return "lifetime";

  // No active subscription_id → one-off purchase → treat as lifetime.
  if (!p.subscription_id) return "lifetime";

  return "monthly";
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
  // Drop expired hits.
  const fresh = hits.filter((t) => t > cutoff);
  if (fresh.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, fresh);
    return false;
  }
  fresh.push(now);
  ipHits.set(ip, fresh);

  // Light GC so the Map doesn't grow unbounded across isolates.
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
 * Structured logging — event type and counts only. Never log the license key,
 * the IP, the Gumroad response body, or anything else that could re-identify
 * a customer.
 */
function logEvent(event: string): void {
  // `console.log` lands in `wrangler tail` and Cloudflare's logs. Keep it
  // single-field so log queries stay cheap.
  console.log(JSON.stringify({ event }));
}
