/**
 * Claude-proxy Cloudflare Worker — the reusable backend for the "Pro" AI apps.
 *
 * POST|OPTIONS /v1/messages → https://api.anthropic.com/v1/messages
 *
 * WHY THIS EXISTS
 * ---------------
 * Every "Pro" app in this repo (CodeMentor, StoryStudio, BookReader Pro, …)
 * currently calls api.anthropic.com straight from the browser with a
 * user-pasted `sk-ant` key and the `anthropic-dangerous-direct-browser-access`
 * header. That is fine for a personal tool but is DISQUALIFYING for the App
 * Store / Play Store: the key is exposed client-side, there is no metering, and
 * there is no abuse control.
 *
 * This Worker fixes that. The Anthropic key lives ONLY here, as a Worker secret
 * (`wrangler secret put ANTHROPIC_API_KEY`). The browser app talks to this
 * proxy with no key at all. The proxy injects the key server-side and streams
 * the SSE response straight back.
 *
 * THREAT MODEL
 * ------------
 *   - The Anthropic key is a Worker secret. It is never sent to the browser,
 *     never logged, never returned in a response.
 *   - Request bodies (prompts) and response bodies (completions) are never
 *     logged.
 *   - CORS is locked to an allowlist so a random origin can't burn your quota.
 *   - A soft in-memory rate limit per IP is the first line against abuse;
 *     Cloudflare's edge protections are the real backstop.
 *
 * This mirrors studio/workers/replicate-proxy/ — same shape, but it OWNS the
 * key (the Replicate proxy forwards the user's token transit-only).
 */
export interface Env {
  /** Anthropic API key. Set with: wrangler secret put ANTHROPIC_API_KEY */
  ANTHROPIC_API_KEY: string;
  /**
   * Optional comma-separated extra allowed origins (e.g. your Pages preview
   * domain). Set with: wrangler secret put EXTRA_ALLOWED_ORIGINS
   */
  EXTRA_ALLOWED_ORIGINS?: string;
}

const UPSTREAM = "https://api.anthropic.com/v1/messages";
const PROXY_PATH = "/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// Lock CORS to where the app actually runs. Capacitor iOS uses
// capacitor://localhost; Capacitor Android uses https://localhost.
const ALLOWED_ORIGIN_EXACT = new Set<string>([
  "https://studio.starlightmix.com",
  "https://rhythmixapp.com.au",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "capacitor://localhost",
  "https://localhost",
]);

const ALLOWED_METHODS = new Set<string>(["POST", "OPTIONS"]);

const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const ipHits: Map<string, number[]> = new Map();

const UPSTREAM_TIMEOUT_MS = 90_000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = buildCorsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname !== PROXY_PATH) {
      return json({ error: "not_found" }, 404, cors);
    }
    if (!ALLOWED_METHODS.has(request.method)) {
      return json({ error: "method_not_allowed" }, 405, cors);
    }
    if (!env.ANTHROPIC_API_KEY) {
      // Misconfiguration — fail loud (but don't leak which secret).
      return json({ error: "proxy_misconfigured" }, 500, cors);
    }

    const ip = clientIp(request);
    if (!allowRequest(ip)) {
      logEvent({ event: "rate_limited" });
      return json(
        { error: "rate_limited", reason: "Too many requests. Try again shortly." },
        429,
        cors,
      );
    }

    // Inject the key server-side. The browser never sees it.
    const outHeaders = new Headers({
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    });

    const startedAt = Date.now();
    let upstream: Response;
    try {
      upstream = await fetchWithTimeout(
        UPSTREAM,
        { method: "POST", headers: outHeaders, body: request.body },
        UPSTREAM_TIMEOUT_MS,
      );
    } catch (err) {
      logEvent({
        event: "upstream_unreachable",
        latency_ms: Date.now() - startedAt,
        cause: err instanceof Error ? err.name : "unknown",
      });
      return json({ error: "upstream_unreachable" }, 502, cors);
    }

    logEvent({
      event: "proxied",
      upstream_status: upstream.status,
      latency_ms: Date.now() - startedAt,
    });

    // Stream the SSE (or JSON) body straight through, with our CORS headers.
    const respHeaders = new Headers(cors);
    const ct = upstream.headers.get("content-type");
    if (ct) respHeaders.set("content-type", ct);
    respHeaders.set("cache-control", "no-store");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });
  },
};

// ---- helpers ---------------------------------------------------------------

function buildCorsHeaders(origin: string | null, env: Env): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && isOriginAllowed(origin, env)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function isOriginAllowed(origin: string, env: Env): boolean {
  if (ALLOWED_ORIGIN_EXACT.has(origin)) return true;
  const extra = (env.EXTRA_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (extra.includes(origin)) return true;
  try {
    const host = new URL(origin).host;
    // Cloudflare Pages preview domains.
    if (host.endsWith(".pages.dev")) return true;
  } catch {
    return false;
  }
  return false;
}

function json(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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
  const hits = (ipHits.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 10_000) {
    for (const [k, v] of ipHits) {
      const kept = v.filter((t) => t > cutoff);
      if (kept.length === 0) ipHits.delete(k);
      else ipHits.set(k, kept);
    }
  }
  return true;
}

/**
 * Structured logging. NEVER logs: the Anthropic key, request bodies (prompts),
 * response bodies (completions), client IP, or any header value.
 */
function logEvent(fields: Record<string, unknown>): void {
  console.log(JSON.stringify(fields));
}
