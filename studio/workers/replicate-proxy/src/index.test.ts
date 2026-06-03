import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import worker from "./index";

const env = {};

function makeRequest(
  path: string,
  method = "GET",
  origin = "https://studio.starlightmix.com",
  ip = "10.0.0.1",
  extraHeaders: Record<string, string> = {},
): Request {
  return new Request(`https://proxy.example.com${path}`, {
    method,
    headers: {
      Origin: origin,
      "CF-Connecting-IP": ip,
      Authorization: "Token r8_test",
      ...extraHeaders,
    },
  });
}

function mockFetch(status = 200, body = '{"id":"pred1"}', headers: Record<string, string> = {}) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      new Response(body, {
        status,
        headers: { "Content-Type": "application/json", ...headers },
      }),
    ),
  );
}

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---- CORS --------------------------------------------------------------------

describe("CORS — isOriginAllowed", () => {
  it("sets ACAO for exact origin https://studio.starlightmix.com", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.1.0.1");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://studio.starlightmix.com");
  });

  it("sets ACAO for exact origin http://localhost:3000", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "http://localhost:3000", "10.1.0.2");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
  });

  it("sets ACAO for Cloudflare Pages preview domain suffix", async () => {
    const req = makeRequest(
      "/api/replicate-proxy/v1/predictions",
      "GET",
      "https://pr-5.studio.rhythmixapp-pages.dev",
      "10.1.0.3",
    );
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://pr-5.studio.rhythmixapp-pages.dev",
    );
  });

  it("does NOT set ACAO for disallowed origin", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://evil.com", "10.1.0.4");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("does NOT set ACAO when Origin header is absent", async () => {
    const req = new Request("https://proxy.example.com/api/replicate-proxy/v1/predictions", {
      method: "GET",
      headers: { "CF-Connecting-IP": "10.1.0.5", Authorization: "Token r8_test" },
    });
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("always sets Vary: Origin", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://evil.com", "10.1.0.6");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Vary")).toBe("Origin");
  });
});

// ---- OPTIONS preflight -------------------------------------------------------

describe("OPTIONS preflight", () => {
  it("returns 204 with CORS headers", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "OPTIONS", "https://studio.starlightmix.com", "10.2.0.1");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(res.headers.get("Access-Control-Allow-Headers")).toContain("Authorization");
  });

  it("OPTIONS does not call upstream fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "OPTIONS", "https://studio.starlightmix.com", "10.2.0.2");
    await worker.fetch(req, env);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

// ---- Path gate ---------------------------------------------------------------

describe("path gate", () => {
  it("returns 404 for root path", async () => {
    const req = makeRequest("/", "GET", "https://studio.starlightmix.com", "10.3.0.1");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(404);
  });

  it("returns 404 for a path that does not start with the proxy prefix", async () => {
    const req = makeRequest("/api/other/v1/predictions", "GET", "https://studio.starlightmix.com", "10.3.0.2");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(404);
  });

  it("accepts a path starting with /api/replicate-proxy/v1/", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.3.0.3");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
  });
});

// ---- Method gate -------------------------------------------------------------

describe("method gate", () => {
  it("returns 405 for PUT", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "PUT", "https://studio.starlightmix.com", "10.4.0.1");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(405);
    const body = await res.json();
    expect(body).toMatchObject({ error: "method_not_allowed" });
  });

  it("returns 405 for DELETE", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "DELETE", "https://studio.starlightmix.com", "10.4.0.2");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(405);
  });

  it("allows GET", async () => {
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.4.0.3");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
  });

  it("allows POST", async () => {
    const req = new Request("https://proxy.example.com/api/replicate-proxy/v1/predictions", {
      method: "POST",
      headers: {
        Origin: "https://studio.starlightmix.com",
        "CF-Connecting-IP": "10.4.0.4",
        Authorization: "Token r8_test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version: "abc123", input: {} }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
  });
});

// ---- Rate limiting -----------------------------------------------------------

describe("rate limiting", () => {
  it("allows the 60th request from a unique IP", async () => {
    const ip = "10.5.1.1";
    let lastRes!: Response;
    for (let i = 0; i < 60; i++) {
      lastRes = await worker.fetch(
        makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", ip),
        env,
      );
    }
    expect(lastRes.status).toBe(200);
  });

  it("blocks the 61st request from the same IP with 429", async () => {
    const ip = "10.5.1.2";
    for (let i = 0; i < 60; i++) {
      await worker.fetch(
        makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", ip),
        env,
      );
    }
    const res = await worker.fetch(
      makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", ip),
      env,
    );
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body).toMatchObject({ error: "rate_limited" });
  });

  it("different IPs have independent rate-limit buckets", async () => {
    const ipA = "10.5.1.3";
    const ipB = "10.5.1.4";
    for (let i = 0; i < 60; i++) {
      await worker.fetch(
        makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", ipA),
        env,
      );
    }
    // IP A is now exhausted; IP B should still pass.
    const resB = await worker.fetch(
      makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", ipB),
      env,
    );
    expect(resB.status).toBe(200);
  });
});

// ---- Request header filtering -----------------------------------------------

describe("request header filtering to upstream", () => {
  it("forwards Authorization to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.6.0.1");
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("authorization")).toBe("Token r8_test");
  });

  it("forwards Content-Type to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("https://proxy.example.com/api/replicate-proxy/v1/predictions", {
      method: "POST",
      headers: {
        Origin: "https://studio.starlightmix.com",
        "CF-Connecting-IP": "10.6.0.2",
        Authorization: "Token r8_test",
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("content-type")).toBe("application/json");
  });

  it("forwards Prefer header to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.6.0.3", {
      Prefer: "wait",
    });
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("prefer")).toBe("wait");
  });

  it("does NOT forward Origin to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.6.0.4");
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("origin")).toBeNull();
  });

  it("does NOT forward Cookie to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.6.0.5", {
      Cookie: "session=abc123",
    });
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("cookie")).toBeNull();
  });

  it("does NOT forward Referer to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.6.0.6", {
      Referer: "https://studio.starlightmix.com/generate",
    });
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("referer")).toBeNull();
  });
});

// ---- Response header filtering -----------------------------------------------

describe("response header filtering from upstream", () => {
  it("passes Content-Type through to client", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })),
    );
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.7.0.1");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("content-type")).toBe("application/json");
  });

  it("passes x-ratelimit-remaining through to client", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json", "x-ratelimit-remaining": "42" },
          }),
      ),
    );
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.7.0.2");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("x-ratelimit-remaining")).toBe("42");
  });

  it("blocks set-cookie from upstream", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json", "set-cookie": "session=hack; Path=/" },
          }),
      ),
    );
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.7.0.3");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("blocks upstream access-control-allow-origin (worker sets its own)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("{}", {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "access-control-allow-origin": "https://upstream.example.com",
            },
          }),
      ),
    );
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.7.0.4");
    const res = await worker.fetch(req, env);
    // Worker sets its own ACAO based on the incoming Origin, not upstream's value.
    expect(res.headers.get("access-control-allow-origin")).toBe("https://studio.starlightmix.com");
  });
});

// ---- Proxy: GET and POST passthrough -----------------------------------------

describe("proxy passthrough", () => {
  it("GET: streams upstream 200 body to client", async () => {
    mockFetch(200, '{"id":"pred1","status":"starting"}');
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.8.0.1");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: "pred1" });
  });

  it("POST: forwards body to upstream", async () => {
    const fetchMock = vi.fn(async () => new Response('{"id":"pred2"}', { status: 201, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const payload = JSON.stringify({ version: "abc", input: { prompt: "test" } });
    const req = new Request("https://proxy.example.com/api/replicate-proxy/v1/predictions", {
      method: "POST",
      headers: {
        Origin: "https://studio.starlightmix.com",
        "CF-Connecting-IP": "10.8.0.2",
        Authorization: "Token r8_test",
        "Content-Type": "application/json",
      },
      body: payload,
    });
    await worker.fetch(req, env);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.body).toBeDefined();
  });

  it("passes upstream 404 status through to client", async () => {
    mockFetch(404, '{"detail":"Not found"}');
    const req = makeRequest("/api/replicate-proxy/v1/predictions/missing", "GET", "https://studio.starlightmix.com", "10.8.0.3");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(404);
  });

  it("passes upstream 422 status through to client", async () => {
    mockFetch(422, '{"detail":"Unprocessable"}');
    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.8.0.4");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(422);
  });
});

// ---- Upstream timeout / unreachable -----------------------------------------

describe("upstream failure", () => {
  it("returns 502 with error:replicate_unreachable on AbortError", async () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");
    vi.stubGlobal("fetch", vi.fn(async () => { throw abortError; }));

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.9.0.1");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toMatchObject({ error: "replicate_unreachable" });
  });

  it("returns 502 on generic network error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.9.0.2");
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toMatchObject({ error: "replicate_unreachable" });
  });

  it("502 response includes CORS headers for allowed origin", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.9.0.3");
    const res = await worker.fetch(req, env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://studio.starlightmix.com");
  });
});

// ---- Upstream URL construction -----------------------------------------------

describe("upstream URL construction", () => {
  it("maps /api/replicate-proxy/v1/predictions → https://api.replicate.com/v1/predictions", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.10.0.1");
    await worker.fetch(req, env);

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.replicate.com/v1/predictions");
  });

  it("maps /api/replicate-proxy/v1/models/owner/name → https://api.replicate.com/v1/models/owner/name", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/models/owner/name", "GET", "https://studio.starlightmix.com", "10.10.0.2");
    await worker.fetch(req, env);

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.replicate.com/v1/models/owner/name");
  });

  it("preserves query string in upstream URL", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions?cursor=abc", "GET", "https://studio.starlightmix.com", "10.10.0.3");
    await worker.fetch(req, env);

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.replicate.com/v1/predictions?cursor=abc");
  });

  it("sets redirect:manual on upstream fetch init", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const req = makeRequest("/api/replicate-proxy/v1/predictions", "GET", "https://studio.starlightmix.com", "10.10.0.4");
    await worker.fetch(req, env);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.redirect).toBe("manual");
  });
});
