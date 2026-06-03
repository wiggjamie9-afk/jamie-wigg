import { beforeEach, describe, expect, it, vi } from "vitest";
import worker from "./index";

// ---- shared fixtures ---------------------------------------------------------

function makeMockEnv() {
  return {
    GUMROAD_PRODUCT_ID: "test-product-123",
    LICENSE_CACHE: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
    },
  };
}

function makeRequest(
  body: unknown,
  origin = "https://studio.starlightmix.com",
  ip = "1.2.3.4",
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "CF-Connecting-IP": ip,
  };
  if (origin) headers["Origin"] = origin;
  return new Request("https://worker.example.com/api/license", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function makeGumroadSuccess(purchaseOverrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    json: vi.fn().mockResolvedValue({
      success: true,
      purchase: {
        product_name: "STARLIGHTMIX Studio",
        variants: "lifetime",
        subscription_id: null,
        ...purchaseOverrides,
      },
    }),
  };
}

function makeGumroadFailure() {
  return {
    ok: false,
    json: vi.fn().mockResolvedValue({ success: false, message: "invalid key" }),
  };
}

// ---- setup -------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

// ==============================================================================
// CORS / isOriginAllowed (exercised through response headers)
// ==============================================================================

describe("isOriginAllowed / CORS headers", () => {
  it("allows exact match: studio.starlightmix.com", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const req = makeRequest(
      { key: "AAAAAAAA-BBBBBBBB" },
      "https://studio.starlightmix.com",
    );
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://studio.starlightmix.com",
    );
  });

  it("allows exact match: localhost:3000", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const req = makeRequest(
      { key: "AAAAAAAA-BBBBBBBB" },
      "http://localhost:3000",
    );
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:3000",
    );
  });

  it("allows exact match: 127.0.0.1:3000", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const req = makeRequest(
      { key: "AAAAAAAA-BBBBBBBB" },
      "http://127.0.0.1:3000",
    );
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://127.0.0.1:3000",
    );
  });

  it("allows suffix match: preview deploy on rhythmixapp-pages.dev", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const origin = "https://pr-42.studio.rhythmixapp-pages.dev";
    const req = makeRequest({ key: "AAAAAAAA-BBBBBBBB" }, origin);
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(origin);
  });

  it("blocks unknown origin: evil.com", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const req = makeRequest(
      { key: "AAAAAAAA-BBBBBBBB" },
      "https://evil.com",
    );
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("omits CORS header when Origin header is absent", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const req = new Request("https://worker.example.com/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": "5.5.5.5",
      },
      body: JSON.stringify({ key: "AAAAAAAA-BBBBBBBB" }),
    });
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});

// ==============================================================================
// OPTIONS preflight
// ==============================================================================

describe("OPTIONS preflight", () => {
  it("returns 204 with no body", async () => {
    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/api/license", {
      method: "OPTIONS",
      headers: { Origin: "https://studio.starlightmix.com" },
    });
    const res = await worker.fetch(req, env as any);
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
  });

  it("includes CORS Allow-Methods header on preflight", async () => {
    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/api/license", {
      method: "OPTIONS",
      headers: { Origin: "https://studio.starlightmix.com" },
    });
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });
});

// ==============================================================================
// Routing
// ==============================================================================

describe("routing", () => {
  it("returns 404 for unknown path", async () => {
    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/unknown", {
      method: "GET",
      headers: { Origin: "https://studio.starlightmix.com" },
    });
    const res = await worker.fetch(req, env as any);
    expect(res.status).toBe(404);
  });

  it("returns 405 for GET to /api/license", async () => {
    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/api/license", {
      method: "GET",
      headers: { Origin: "https://studio.starlightmix.com" },
    });
    const res = await worker.fetch(req, env as any);
    expect(res.status).toBe(405);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
  });
});

// ==============================================================================
// extractKey validation
// ==============================================================================

describe("extractKey validation", () => {
  it("returns 400 when key field is missing", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(makeRequest({}), env as any);
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/missing|malformed/i);
  });

  it("returns 400 when key is too short (< 8 chars)", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "SHORT" }),
      env as any,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
  });

  it("returns 400 when key is too long (> 128 chars)", async () => {
    const env = makeMockEnv();
    const longKey = "A".repeat(129);
    const res = await worker.fetch(
      makeRequest({ key: longKey }),
      env as any,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
  });

  it("returns 400 when key contains spaces", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "INVALID KEY HERE" }),
      env as any,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
  });

  it("returns 400 when key contains $ special character", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "INVALID$KEY0000" }),
      env as any,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
  });

  it("returns 400 for invalid JSON body", async () => {
    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://studio.starlightmix.com",
        "CF-Connecting-IP": "6.6.6.6",
      },
      body: "not-valid-json{{{",
    });
    const res = await worker.fetch(req, env as any);
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/invalid json/i);
  });

  it("proceeds past validation with a valid key format", async () => {
    const env = makeMockEnv();
    // KV returns null; Gumroad returns failure — confirm we clear extractKey
    // (status must not be 400).
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadFailure()));
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCCCCCC-DDDDDDDD" },
        "https://studio.starlightmix.com",
        "7.7.7.7",
      ),
      env as any,
    );
    expect(res.status).not.toBe(400);
    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// KV cache hit fast-path
// ==============================================================================

describe("KV cache hit fast-path", () => {
  it("returns valid:true from cache without calling Gumroad", async () => {
    const gumroadFetch = vi.fn();
    vi.stubGlobal("fetch", gumroadFetch);

    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });

    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB" },
        "https://studio.starlightmix.com",
        "8.8.8.8",
      ),
      env as any,
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(true);
    expect(body.tier).toBe("lifetime");
    expect(gumroadFetch).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("returns the tier stored in KV (monthly)", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "monthly",
      cachedAt: Date.now(),
    });

    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB" },
        "https://studio.starlightmix.com",
        "8.8.8.9",
      ),
      env as any,
    );
    const body = (await res.json()) as any;
    expect(body.tier).toBe("monthly");

    vi.unstubAllGlobals();
  });

  it("falls through to Gumroad when KV.get throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi
      .fn()
      .mockRejectedValue(new Error("KV unavailable"));

    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCC" },
        "https://studio.starlightmix.com",
        "9.9.9.9",
      ),
      env as any,
    );
    // KV failure must not block — Gumroad should answer instead.
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(true);

    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// Gumroad verification
// ==============================================================================

describe("Gumroad verification", () => {
  it("returns valid:true and caches result when Gumroad succeeds", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCCCCCC" },
        "https://studio.starlightmix.com",
        "11.0.0.1",
      ),
      env as any,
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(true);
    expect(body.tier).toBe("lifetime");
    expect(env.LICENSE_CACHE.put).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
  });

  it("caches with the correct key prefix 'cached:<license_key>'", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    const licenseKey = "AAAAAAAA-BBBBBBBB-CCCCCCCC";
    await worker.fetch(
      makeRequest(
        { key: licenseKey },
        "https://studio.starlightmix.com",
        "11.0.0.2",
      ),
      env as any,
    );

    expect(env.LICENSE_CACHE.put).toHaveBeenCalledWith(
      `cached:${licenseKey}`,
      expect.any(String),
      expect.objectContaining({ expirationTtl: expect.any(Number) }),
    );

    vi.unstubAllGlobals();
  });

  it("returns valid:false and does NOT cache when Gumroad returns success:false", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadFailure()));

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest(
        { key: "BADBADBA-BADBADBA" },
        "https://studio.starlightmix.com",
        "11.0.0.3",
      ),
      env as any,
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
    expect(env.LICENSE_CACHE.put).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("returns 503 when globalThis.fetch throws (Gumroad unreachable)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error")),
    );

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB" },
        "https://studio.starlightmix.com",
        "11.0.0.4",
      ),
      env as any,
    );

    expect(res.status).toBe(503);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);

    vi.unstubAllGlobals();
  });

  it("KV write failure does not prevent a valid response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    env.LICENSE_CACHE.put = vi
      .fn()
      .mockRejectedValue(new Error("KV write error"));

    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCC" },
        "https://studio.starlightmix.com",
        "11.0.0.5",
      ),
      env as any,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(true);

    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// deriveTier logic (exercised via full request flow)
// ==============================================================================

describe("deriveTier", () => {
  // Each call gets a unique IP to avoid accidentally hitting rate limit state.
  let ipCounter = 50;

  async function getTier(purchaseOverrides: Record<string, unknown>) {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeGumroadSuccess(purchaseOverrides)),
    );
    const env = makeMockEnv();
    const ip = `12.0.0.${ipCounter++}`;
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCC" },
        "https://studio.starlightmix.com",
        ip,
      ),
      env as any,
    );
    vi.unstubAllGlobals();
    return ((await res.json()) as any).tier as string;
  }

  it("variants containing 'lifetime' → lifetime tier", async () => {
    expect(
      await getTier({ variants: "Lifetime Access", subscription_id: null }),
    ).toBe("lifetime");
  });

  it("variants_and_quantity containing 'lifetime' → lifetime tier", async () => {
    expect(
      await getTier({
        variants: "",
        variants_and_quantity: "Lifetime x1",
        subscription_id: "sub_irrelevant",
      }),
    ).toBe("lifetime");
  });

  it("product_name containing 'lifetime' → lifetime tier", async () => {
    expect(
      await getTier({
        product_name: "STARLIGHTMIX Lifetime",
        variants: "",
        subscription_id: "sub_123",
      }),
    ).toBe("lifetime");
  });

  it("no subscription_id → lifetime tier (one-off purchase)", async () => {
    expect(
      await getTier({
        product_name: "STARLIGHTMIX Studio",
        variants: "",
        subscription_id: null,
      }),
    ).toBe("lifetime");
  });

  it("active subscription_id without 'lifetime' in haystack → monthly tier", async () => {
    expect(
      await getTier({
        product_name: "STARLIGHTMIX Studio",
        variants: "monthly",
        subscription_id: "sub_abc123",
      }),
    ).toBe("monthly");
  });
});

// ==============================================================================
// Rate limiting
// ==============================================================================

describe("rate limiting", () => {
  // Each test uses a unique IP range to avoid cross-test pollution with the
  // module-level ipHits Map (which cannot be reset without re-importing).

  it("first 20 requests from same IP succeed (none are 429)", async () => {
    const ip = "20.0.1.1";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const statuses: number[] = [];
    for (let i = 0; i < 20; i++) {
      const env = makeMockEnv();
      const res = await worker.fetch(
        makeRequest(
          { key: "AAAAAAAA-BBBBBBBB-CCCC" },
          "https://studio.starlightmix.com",
          ip,
        ),
        env as any,
      );
      statuses.push(res.status);
      await res.text();
    }

    expect(statuses.every((s) => s !== 429)).toBe(true);
    vi.unstubAllGlobals();
  });

  it("21st request from same IP returns 429", async () => {
    const ip = "20.0.2.1";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    for (let i = 0; i < 20; i++) {
      const env = makeMockEnv();
      const res = await worker.fetch(
        makeRequest(
          { key: "AAAAAAAA-BBBBBBBB-CCCC" },
          "https://studio.starlightmix.com",
          ip,
        ),
        env as any,
      );
      await res.text();
    }

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCC" },
        "https://studio.starlightmix.com",
        ip,
      ),
      env as any,
    );
    expect(res.status).toBe(429);
    const body = (await res.json()) as any;
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/too many requests/i);

    vi.unstubAllGlobals();
  });

  it("different IPs are rate-limited independently", async () => {
    const ip1 = "20.0.3.1";
    const ip2 = "20.0.3.2";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    // Exhaust ip1.
    for (let i = 0; i < 20; i++) {
      const env = makeMockEnv();
      const res = await worker.fetch(
        makeRequest(
          { key: "AAAAAAAA-BBBBBBBB-CCCC" },
          "https://studio.starlightmix.com",
          ip1,
        ),
        env as any,
      );
      await res.text();
    }

    // ip2's first request must not be blocked.
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB-CCCC" },
        "https://studio.starlightmix.com",
        ip2,
      ),
      env as any,
    );
    expect(res.status).not.toBe(429);

    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// Response shape invariants
// ==============================================================================

describe("response shape invariants", () => {
  it("all responses include Cache-Control: no-store", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const res = await worker.fetch(
      makeRequest(
        { key: "AAAAAAAA-BBBBBBBB" },
        "https://studio.starlightmix.com",
        "30.0.0.1",
      ),
      env as any,
    );
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("all responses include Content-Type: application/json", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(makeRequest({}), env as any);
    expect(res.headers.get("Content-Type")).toContain("application/json");
  });

  it("X-Forwarded-For is used as IP fallback when CF-Connecting-IP is absent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    // A unique XFF IP to prevent rate-limit bleed.
    const req = new Request("https://worker.example.com/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://studio.starlightmix.com",
        "X-Forwarded-For": "203.0.113.5, 10.0.0.1",
      },
      body: JSON.stringify({ key: "AAAAAAAA-BBBBBBBB-CCCC" }),
    });
    const res = await worker.fetch(req, env as any);
    // Must not throw and must return a meaningful response (not 500).
    expect([200, 429]).toContain(res.status);

    vi.unstubAllGlobals();
  });
});
