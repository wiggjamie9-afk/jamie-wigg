/**
 * STARLIGHTMIX Replicate-proxy Cloudflare Worker.
 *
 * GET|POST|OPTIONS /api/replicate-proxy/v1/* → https://api.replicate.com/v1/*
 *
 * Why this exists: Replicate's API doesn't serve permissive CORS, so the
 * browser cannot call it directly. This Worker is a stateless pass-through
 * that the studio web app talks to instead. See:
 *   specs/rhythmix-app/spike-cors.md
 *
 * Threat model:
 *   - The user's Replicate API token rides in `Authorization` on every
 *     request. It is forwarded **transit-only**: never persisted, never
 *     logged, never cached.
 *   - Request bodies (prompts, model inputs) and response bodies (prediction
 *     URLs) are also never logged.
 *   - No KV bindings. No D1. No durable storage. The only state in this
 *     Worker is an in-memory rate-limit Map scoped to the isolate.
 *
 * Satisfies R6 (proxy in front of Replicate) and supports R3 (token transit
 * constraint — token never crosses a boundary that retains it).
 */
export interface Env {
  // Intentionally empty: no secrets, no bindings. The token is the user's,
  // not the Worker's.
}

// ---- constants ---------------------------------------------------------------

const UPSTREAM_BASE = "https://api.replicate.com/v1/";
const PROXY_PREFIX = "/api/replicate-proxy/v1/";

const ALLOWED_ORIGIN_EXACT = new Set<string>([
  "https://studio.starlightmix.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

/** Cloudflare Pages preview domains — e.g. `pr-12.studio.rhythmixapp-pages.dev`. */
const ALLOWED_ORIGIN_SUFFIX = ".studio.rhythmixapp-pages.dev";

const ALLOWED_METHODS = new Set<string>(["GET", "POST", "OPTIONS"]);

/**
 * Headers we deliberately allow through to Replicate. Anything not in this
 * list (Origin, Referer, Cookie, etc.) is dropped — the proxy is a clean
 * server-side caller from Replicate's perspective.
 */
const FORWARD_REQUEST_HEADERS = new Set<string>([
  "authorization",
  "content-type",
  "prefer", // Replicate uses `Prefer: wait` for sync prediction mode
]);

/**
 * Headers we allow through on the response. Hop-by-hop headers and
 * Replicate-specific CORS headers are stripped — we set our own CORS based
 * on the request's Origin.
 */
const FORWARD_RESPONSE_HEADERS = new Set<string>([
  "content-type",
  "content-length",
  "cache-control",
  "etag",
  "last-modified",
  "retry-after",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
]);

// Rate limit: Replicate-bound traffic spikes during generate-and-poll loops,
// so we allow more headroom than the license endpoint.
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * In-memory rate-limit bucket. Same pattern as the license Worker: lives
 * only as long as the isolate, soft cap by design. Cloudflare's edge
 * protections are the real backstop against abuse.
 */
const ipHits: Map<string, number[]> = new Map();

// Upstream timeout — Replicate's sync predictions can take ~60s; we cap
// total wait at 75s to leave headroom before Cloudflare's own 100s limit.
const UPSTREAM_TIMEOUT_MS = 75_000;

// ---- entry -------------------------------------------------------------------

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const corsHeaders = buildCorsHeaders(origin);

    // CORS preflight.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Path gate — anything outside the proxy prefix is 404.
    if (!url.pathname.startsWith(PROXY_PREFIX)) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    if (!ALLOWED_METHODS.has(request.method)) {
      return json(
        { error: "method_not_allowed" },
        405,
        corsHeaders,
      );
    }

    // Soft rate-limit by client IP.
    const ip = clientIp(request);
    if (!allowRequest(ip)) {
      logEvent({
        event: "rate_limited",
        method: request.method,
        path_tail: pathTail(url.pathname),
      });
      return json(
        { error: "rate_limited", reason: "Too many requests. Try again in a minute." },
        429,
        corsHeaders,
      );
    }

    // Build upstream URL: strip the proxy prefix, append the rest + query.
    const rest = url.pathname.slice(PROXY_PREFIX.length);
    const upstreamUrl = UPSTREAM_BASE + rest + url.search;

    // Build outbound headers — only the allowlist passes through.
    const outboundHeaders = new Headers();
    for (const [name, value] of request.headers) {
      if (FORWARD_REQUEST_HEADERS.has(name.toLowerCase())) {
        outboundHeaders.set(name, value);
      }
    }

    // Forward body for POST. GET / OPTIONS have no body.
    const upstreamInit: RequestInit = {
      method: request.method,
      headers: outboundHeaders,
      // `redirect: "manual"` so we don't silently chase a 3xx to a
      // different host — Replicate output URLs can be on r8.im / etc.
      // and the browser should follow those itself, not the Worker.
      redirect: "manual",
    };
    if (request.method === "POST") {
      upstreamInit.body = request.body;
    }

    const startedAt = Date.now();
    let upstream: Response;
    try {
      upstream = await fetchWithTimeout(upstreamUrl, upstreamInit, UPSTREAM_TIMEOUT_MS);
    } catch (err) {
      const latency = Date.now() - startedAt;
      logEvent({
        event: "replicate_unreachable",
        method: request.method,
        path_tail: pathTail(url.pathname),
        latency_ms: latency,
        // Stringify only the error name — never the message (could embed
        // a token or body fragment from upstream).
        cause: err instanceof Error ? err.name : "unknown",
      });
      return json(
        { error: "replicate_unreachable" },
        502,
        corsHeaders,
      );
    }

    const latency = Date.now() - startedAt;
    logEvent({
      event: "proxied",
      method: request.method,
      path_tail: pathTail(url.pathname),
      upstream_status: upstream.status,
      latency_ms: latency,
    });

    // Build response headers: CORS + allowlisted upstream headers.
    const respHeaders = new Headers(corsHeaders);
    for (const [name, value] of upstream.headers) {
      if (FORWARD_RESPONSE_HEADERS.has(name.toLowerCase())) {
        respHeaders.set(name, value);
      }
    }

    // Stream the body straight through — Replicate prediction responses can
    // be modestly large (output URL arrays, logs) but we don't need to buffer.
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });
  },
};

// ---- helpers -----------------------------------------------------------------

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Prefer",
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

/**
 * Last path segment, lower-cased — used for log grouping only
 * (`predictions`, `models`, etc.). We deliberately don't log full paths,
 * because Replicate uses paths like `/v1/predictions/<prediction-id>` and
 * we don't want any user-identifying ids in the log stream.
 */
function pathTail(pathname: string): string {
  const rest = pathname.startsWith(PROXY_PREFIX)
    ? pathname.slice(PROXY_PREFIX.length)
    : pathname;
  const segs = rest.split("/").filter(Boolean);
  const first = segs[0] ?? "root";
  // Only the first segment — that's the "kind" of resource. We never log
  // the per-prediction id (segs[1]) because it's a user-correlatable
  // identifier we have no business retaining.
  return first.toLowerCase();
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
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
 * Structured logging.
 *
 * Logged fields:
 *   - event           short tag (proxied, rate_limited, replicate_unreachable)
 *   - method          GET | POST | OPTIONS
 *   - path_tail       first path segment only (`predictions`, `models`, ...) —
 *                     never the full path with id
 *   - upstream_status numeric HTTP status returned by Replicate
 *   - latency_ms      wall-clock time spent in `fetch(replicate)`
 *   - cause           error class name on `replicate_unreachable` (no msg)
 *
 * NEVER logged:
 *   - Authorization header (the user's Replicate token)
 *   - Any other request header
 *   - Request body (prompts, model inputs)
 *   - Response body (prediction URLs, logs from upstream)
 *   - Client IP address — only used in-memory for rate-limit bucketing
 *   - Prediction ids or any other path segment past the first
 */
function logEvent(fields: Record<string, unknown>): void {
  console.log(JSON.stringify(fields));
}
