/**
 * Tests for the re-engineered `lib/llm-router.ts` routing brain.
 *
 * Covers mode resolution, cost estimation, the unconfigured-tier guards, and
 * the fetch-based OpenAI-compatible client (via a mocked `fetch`). No `openai`
 * package, no network — the client is exercised against a stubbed fetch.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  completeWithLLM,
  estimateCost,
  getActiveLLMMode,
  getLLMClient,
} from "../../lib/llm-router";

const FREE_CONFIG = {
  freeLLMUrl: "https://free.example/v1",
  freeLLMKey: "free-key",
};
const PAID_CONFIG = {
  claudeApiKey: "paid-key",
  claudeBaseUrl: "https://paid.example/v1",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("estimateCost", () => {
  it("is zero for the free tier", () => {
    expect(estimateCost(1000, 1000, "free")).toBe(0);
  });

  it("bills input and output for the paid tier", () => {
    // 1000 in * 0.015/1k + 1000 out * 0.06/1k
    expect(estimateCost(1000, 1000, "paid")).toBeCloseTo(0.075, 6);
  });
});

describe("getActiveLLMMode", () => {
  it("passes concrete modes through", () => {
    expect(getActiveLLMMode("free")).toBe("free");
    expect(getActiveLLMMode("paid")).toBe("paid");
  });
});

describe("getLLMClient guards", () => {
  it("throws when the free tier is not configured", () => {
    expect(() => getLLMClient("free", { freeLLMKey: undefined })).toThrow(
      /FreeLLMAPI/,
    );
  });

  it("throws when the paid tier has no key", () => {
    expect(() => getLLMClient("paid", { claudeApiKey: undefined })).toThrow(
      /Claude API key/,
    );
  });

  it("auto resolves to free when fully configured", () => {
    const client = getLLMClient("auto", FREE_CONFIG);
    expect(client.mode).toBe("free");
    expect(client.baseURL).toBe("https://free.example/v1");
  });

  it("auto resolves to paid when the free tier is absent", () => {
    const client = getLLMClient("auto", {
      ...PAID_CONFIG,
      freeLLMKey: undefined,
    });
    expect(client.mode).toBe("paid");
  });

  it("normalizes a trailing slash on the base URL", () => {
    const client = getLLMClient("free", {
      ...FREE_CONFIG,
      freeLLMUrl: "https://free.example/v1/",
    });
    expect(client.baseURL).toBe("https://free.example/v1");
  });
});

describe("fetch-based chat client", () => {
  it("POSTs to /chat/completions and parses the choice", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { role: "assistant", content: "hi there" } }],
        }),
        { status: 200, headers: { "x-routed-via": "mistral-free" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = getLLMClient("free", FREE_CONFIG);
    const resp = await client.chat.completions.create({
      model: "auto",
      messages: [{ role: "user", content: "hey" }],
    });

    expect(resp.choices[0]?.message.content).toBe("hi there");
    expect(resp.headers.get("x-routed-via")).toBe("mistral-free");

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://free.example/v1/chat/completions");
    expect((init as RequestInit).method).toBe("POST");
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer free-key");
    expect(headers["x-llm-mode"]).toBe("free");
  });

  it("throws with status detail on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );
    const client = getLLMClient("paid", PAID_CONFIG);
    await expect(
      client.chat.completions.create({
        model: "claude-opus-4-8",
        messages: [{ role: "user", content: "x" }],
      }),
    ).rejects.toThrow(/paid, 500/);
  });
});

describe("completeWithLLM", () => {
  it("prepends a system message and defaults the model per tier", async () => {
    let sentBody: { model?: string; messages?: unknown[] } = {};
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init: RequestInit) => {
        sentBody = JSON.parse(init.body as string);
        return new Response(
          JSON.stringify({
            choices: [{ message: { role: "assistant", content: "ok" } }],
          }),
          { status: 200 },
        );
      }),
    );

    const out = await completeWithLLM("summarize this", {
      mode: "paid",
      system: "You are terse.",
      // paid + no explicit model → defaults to claude-opus-4-8
      config: PAID_CONFIG,
    });

    expect(out.text).toBe("ok");
    expect(out.mode).toBe("paid");
    expect(sentBody.messages).toEqual([
      { role: "system", content: "You are terse." },
      { role: "user", content: "summarize this" },
    ]);
    expect(sentBody.model).toBe("claude-opus-4-8");
  });
});
