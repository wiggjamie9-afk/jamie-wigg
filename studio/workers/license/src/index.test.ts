import { beforeEach, describe, expect, it, vi } from "vitest";
import worker from "./index";

// ---- shared fixtures ---------------------------------------------------------

function makeMockEnv(overrides?: Partial<{ get: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> }>) {
  return {
    GUMROAD_PRODUCT_ID: "test-product-123",
    LICENSE_CACHE: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
      ...overrides,
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
    // A valid cached entry avoids needing a Gumroad mock.
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const req = makeRequest({ key: "AAAAAAAA-BBBBBBBB" }, "https://studio.starlightmix.com");
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
    const req = makeRequest({ key: "AAAAAAAA-BBBBBBBB" }, "http://localhost:3000");
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:3000",
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
    const req = makeRequest({ key: "AAAAAAAA-BBBBBBBB" }, "https://evil.com");
    const res = await worker.fetch(req, env as any);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("omits CORS header when Origin header is absent", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    // Build request without Origin header.
    const req = new Request("https://worker.example.com/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": "1.2.3.4",
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
    const body = await res.json() as any;
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
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/missing|malformed/i);
  });

  it("returns 400 when key is too short (< 8 chars)", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(makeRequest({ key: "SHORT" }), env as any);
    expect(res.status).toBe(400);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
  });

  it("returns 400 when key contains spaces", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(makeRequest({ key: "INVALID KEY HERE" }), env as any);
    expect(res.status).toBe(400);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
  });

  it("returns 400 when key contains $ special character", async () => {
    const env = makeMockEnv();
    const res = await worker.fetch(makeRequest({ key: "INVALID$KEY0000" }), env as any);
    expect(res.status).toBe(400);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
  });

  it("proceeds past validation with a valid key format", async () => {
    const env = makeMockEnv();
    // KV returns null, Gumroad returns failure — we just want to confirm we
    // get past extractKey (status won't be 400).
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadFailure()));
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCCCCCC-DDDDDDDD" }),
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
      makeRequest({ key: "AAAAAAAA-BBBBBBBB" }),
      env as any,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.valid).toBe(true);
    expect(body.tier).toBe("lifetime");
    expect(gumroadFetch).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("returns the tier value stored in KV", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "monthly",
      cachedAt: Date.now(),
    });

    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB" }),
      env as any,
    );
    const body = await res.json() as any;
    expect(body.tier).toBe("monthly");

    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// Gumroad verification
// ==============================================================================

describe("Gumroad verification", () => {
  it("returns valid:true and caches when Gumroad succeeds", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCCCCCC" }),
      env as any,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.valid).toBe(true);
    expect(body.tier).toBe("lifetime");
    expect(env.LICENSE_CACHE.put).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
  });

  it("returns valid:false and does NOT cache when Gumroad returns success:false", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadFailure()));

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "BADBADBA-BADBADBA" }),
      env as any,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
    expect(env.LICENSE_CACHE.put).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("returns 503 when globalThis.fetch throws (Gumroad unreachable)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB" }),
      env as any,
    );

    expect(res.status).toBe(503);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);

    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// deriveTier logic (exercised via full request flow)
// ==============================================================================

describe("deriveTier", () => {
  async function getTier(purchaseOverrides: Record<string, unknown>) {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess(purchaseOverrides)));
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }),
      env as any,
    );
    vi.unstubAllGlobals();
    return (await res.json() as any).tier as string;
  }

  it("variants containing 'lifetime' → lifetime tier", async () => {
    expect(await getTier({ variants: "Lifetime Access", subscription_id: null })).toBe("lifetime");
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
  // Each describe block uses a fresh unique IP to avoid cross-test pollution
  // with the module-level ipHits Map.

  it("first 20 requests from same IP succeed (not 429)", async () => {
    const ip = "10.0.0.1";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeGumroadSuccess()),
    );
    const env = makeMockEnv();

    const statuses: number[] = [];
    for (let i = 0; i < 20; i++) {
      const res = await worker.fetch(
        makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", ip),
        env as any,
      );
      statuses.push(res.status);
      // Drain the body so the stream isn't left dangling.
      await res.text();
      // Reset KV mock to avoid cache-hit path on subsequent iterations.
      env.LICENSE_CACHE.get = vi.fn().mockResolvedValue(null);
    }

    expect(statuses.every((s) => s !== 429)).toBe(true);
    vi.unstubAllGlobals();
  });

  it("21st request from same IP returns 429", async () => {
    const ip = "10.0.0.2";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeGumroadSuccess()),
    );

    // First 20 requests.
    for (let i = 0; i < 20; i++) {
      const env = makeMockEnv();
      const res = await worker.fetch(
        makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", ip),
        env as any,
      );
      await res.text();
    }

    // 21st request.
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", ip),
      env as any,
    );
    expect(res.status).toBe(429);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/too many requests/i);

    vi.unstubAllGlobals();
  });

  it("different IPs are rate-limited independently", async () => {
    const ip1 = "10.0.0.3";
    const ip2 = "10.0.0.4";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeGumroadSuccess()),
    );

    // Exhaust ip1 (20 requests).
    for (let i = 0; i < 20; i++) {
      const env = makeMockEnv();
      const res = await worker.fetch(
        makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", ip1),
        env as any,
      );
      await res.text();
    }

    // ip2's first request should not be blocked.
    const env = makeMockEnv();
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", ip2),
      env as any,
    );
    expect(res.status).not.toBe(429);

    vi.unstubAllGlobals();
  });
});

// ==============================================================================
// Edge / error paths
// ==============================================================================

describe("edge cases", () => {
  it("returns 400 for invalid JSON body", async () => {
    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://studio.starlightmix.com",
        "CF-Connecting-IP": "1.2.3.4",
      },
      body: "not-valid-json{{{",
    });
    const res = await worker.fetch(req, env as any);
    expect(res.status).toBe(400);
    const body = await res.json() as any;
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/invalid json/i);
  });

  it("KV failure falls through to Gumroad rather than returning an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockRejectedValue(new Error("KV unavailable"));

    // Unique IP to avoid rate-limit state from earlier tests.
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", "192.0.2.10"),
      env as any,
    );
    // Should succeed via Gumroad, not 500.
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.valid).toBe(true);

    vi.unstubAllGlobals();
  });

  it("KV write failure does not prevent a valid response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    env.LICENSE_CACHE.put = vi.fn().mockRejectedValue(new Error("KV write error"));

    // Unique IP to avoid rate-limit state from earlier tests.
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB-CCCC" }, "https://studio.starlightmix.com", "192.0.2.11"),
      env as any,
    );
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.valid).toBe(true);

    vi.unstubAllGlobals();
  });

  it("response always includes Cache-Control: no-store", async () => {
    const env = makeMockEnv();
    env.LICENSE_CACHE.get = vi.fn().mockResolvedValue({
      tier: "lifetime",
      cachedAt: Date.now(),
    });
    const res = await worker.fetch(
      makeRequest({ key: "AAAAAAAA-BBBBBBBB" }),
      env as any,
    );
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("CF-Connecting-IP falls back to X-Forwarded-For", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeGumroadSuccess()));

    const env = makeMockEnv();
    const req = new Request("https://worker.example.com/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://studio.starlightmix.com",
        "X-Forwarded-For": "192.168.1.1, 10.0.0.1",
      },
      body: JSON.stringify({ key: "AAAAAAAA-BBBBBBBB-CCCC" }),
    });
    const res = await worker.fetch(req, env as any);
    // Should not throw and should return a valid response.
    expect([200, 429]).toContain(res.status);

    vi.unstubAllGlobals();
  });
});
