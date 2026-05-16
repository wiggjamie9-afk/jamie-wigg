/**
 * Tests for `lib/render-runner.ts` (R6, R7) — render orchestration.
 *
 * We mock both:
 *   - the `@ffmpeg/ffmpeg` import (via `__setFfmpegLoaderForTest`) — the
 *     placeholder path for failed scenes calls it directly.
 *   - the wasm adapter module that exports `trim`/`concat`/`mux`/`extractFrame`.
 *   - `globalThis.fetch` — all Replicate proxy calls + Blob downloads.
 *
 * Hard rule honored: the user's token must never appear in any emitted event
 * payload. We scan every event with a regex over `r8_...` to enforce that.
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

// ---------- Mock the ffmpeg wasm adapter ----------

vi.mock("../../rhythmix-studio/src/ffmpeg/wasm.mjs", () => {
  return {
    trim: vi.fn(async (blob: Blob, _start: number, _end: number) => {
      return new Blob([await blob.arrayBuffer()], { type: "video/mp4" });
    }),
    concat: vi.fn(async (blobs: Blob[]) => {
      const buffers = await Promise.all(blobs.map((b) => b.arrayBuffer()));
      return new Blob(buffers, { type: "video/mp4" });
    }),
    mux: vi.fn(async (video: Blob, _audio: Blob) => {
      return new Blob([await video.arrayBuffer()], { type: "video/mp4" });
    }),
    extractFrame: vi.fn(async (_video: Blob, _t: number) => {
      return new Blob([new Uint8Array([0])], { type: "image/jpeg" });
    }),
  };
});

// ---------- Models registry mock ----------
//
// We pull through the real models.mjs but ensure it has the entries the test
// plan references. We don't mock it — it's a pure data module.

import { runRender, __setFfmpegLoaderForTest } from "./render-runner";
import type { Plan } from "./plan-storage";
import type { RenderEvent } from "./render-events";

const TOKEN = "r8_TEST_TOKEN_should_never_leak_into_events";
const PROXY = "https://test-proxy.example/api/replicate-proxy/v1";

// ---------- Test helpers ----------

function makePlan(): Plan {
  return {
    id: "plan-test",
    audioDuration: 9,
    theme: "test theme",
    bpm: 120,
    aspect: "16:9",
    scenes: [
      {
        id: "s1",
        role: "intro",
        model: "kling-v2",
        startSec: 0,
        endSec: 3,
        prompt: "intro shot",
      },
      {
        id: "s2",
        role: "verse",
        model: "hunyuan-video",
        startSec: 3,
        endSec: 6,
        prompt: "verse shot",
      },
      {
        id: "s3",
        role: "chorus",
        model: "kling-v2",
        startSec: 6,
        endSec: 9,
        prompt: "chorus shot",
      },
    ],
    createdAt: 0,
    updatedAt: 0,
  };
}

type FetchHandler = (url: string, init?: RequestInit) => Promise<Response>;

function installFetchMock(handler: FetchHandler) {
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : (input as URL).toString();
    return handler(url, init);
  }) as typeof globalThis.fetch;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function blobResponse(bytes: number = 4): Response {
  return new Response(new Uint8Array(bytes).fill(7), {
    status: 200,
    headers: { "content-type": "video/mp4" },
  });
}

function makeSucceededPrediction(id: string) {
  return {
    id,
    status: "succeeded" as const,
    output: `https://replicate.delivery/p/${id}.mp4`,
    error: null,
  };
}

// ---------- Common before/after ----------

let originalFetch: typeof globalThis.fetch | undefined;

beforeEach(() => {
  originalFetch = globalThis.fetch;
  // Stub the placeholder ffmpeg loader so we never try to load @ffmpeg/ffmpeg.
  __setFfmpegLoaderForTest(async () => ({
    FFmpeg: class {
      async load() {}
      async exec() {
        return 0;
      }
      async readFile() {
        return new Uint8Array([1, 2, 3, 4]);
      }
      async deleteFile() {}
    },
  }));
});

afterEach(() => {
  if (originalFetch) globalThis.fetch = originalFetch;
  vi.clearAllMocks();
});

// ---------- Tests ----------

describe("runRender — happy path", () => {
  it("emits expected events in order and returns no failedSceneIds", async () => {
    let predictionCounter = 0;
    installFetchMock(async (url) => {
      if (url.includes("/predictions") && !url.match(/predictions\/[A-Za-z0-9_-]+$/)) {
        // POST create prediction — return succeeded inline.
        predictionCounter++;
        return jsonResponse(makeSucceededPrediction(`pred-${predictionCounter}`));
      }
      if (url.startsWith("https://replicate.delivery/")) {
        return blobResponse(16);
      }
      throw new Error(`Unexpected fetch url: ${url}`);
    });

    const events: RenderEvent[] = [];
    const result = await runRender({
      plan: makePlan(),
      audioBlob: new Blob([new Uint8Array(8)], { type: "audio/mp3" }),
      token: TOKEN,
      onEvent: (e) => events.push(e),
      proxyBaseUrl: PROXY,
    });

    expect(result.failedSceneIds).toEqual([]);
    expect(result.mp4).toBeInstanceOf(Blob);
    expect(result.thumbnail).toBeInstanceOf(Blob);

    // All three scenes were queued before any generating event fired.
    const queuedIndexes = events
      .map((e, i) => (e.type === "scene:queued" ? i : -1))
      .filter((i) => i >= 0);
    expect(queuedIndexes).toHaveLength(3);
    const firstGenerating = events.findIndex((e) => e.type === "scene:generating");
    expect(firstGenerating).toBeGreaterThan(queuedIndexes[queuedIndexes.length - 1]);

    // Each scene saw generating → downloaded → composed.
    for (const sceneId of ["s1", "s2", "s3"]) {
      expect(events.find((e) => e.type === "scene:generating" && e.sceneId === sceneId)).toBeDefined();
      expect(events.find((e) => e.type === "scene:downloaded" && e.sceneId === sceneId)).toBeDefined();
      expect(events.find((e) => e.type === "scene:composed" && e.sceneId === sceneId)).toBeDefined();
    }

    // Compose phase fired start → progress* → done.
    expect(events.find((e) => e.type === "compose:start")).toBeDefined();
    expect(events.find((e) => e.type === "compose:done")).toBeDefined();
    const finalProgress = [...events]
      .reverse()
      .find((e) => e.type === "compose:progress");
    expect(finalProgress && (finalProgress as { percent: number }).percent).toBe(100);
  });

  it("each generating event for a scene increments the attempt counter starting at 1", async () => {
    installFetchMock(async (url) => {
      if (url.includes("/predictions") && !url.match(/predictions\/[A-Za-z0-9_-]+$/)) {
        return jsonResponse(makeSucceededPrediction("p"));
      }
      return blobResponse(8);
    });

    const events: RenderEvent[] = [];
    await runRender({
      plan: makePlan(),
      audioBlob: new Blob([new Uint8Array(8)]),
      token: TOKEN,
      onEvent: (e) => events.push(e),
      proxyBaseUrl: PROXY,
    });

    // On the happy path each scene generates exactly once at attempt 1.
    for (const sceneId of ["s1", "s2", "s3"]) {
      const generatings = events.filter(
        (e) => e.type === "scene:generating" && e.sceneId === sceneId,
      ) as Array<{ type: "scene:generating"; sceneId: string; attempt: number }>;
      expect(generatings).toHaveLength(1);
      expect(generatings[0].attempt).toBe(1);
    }
  });
});

describe("runRender — partial failure (R6)", () => {
  it("3-retry exhaustion for the middle scene yields 3 failed events and a non-fatal completion", async () => {
    // Track per-scene call counts so we can selectively fail s2 only.
    const createCalls: Record<string, number> = {};

    installFetchMock(async (url, init) => {
      if (url.match(/predictions\/[A-Za-z0-9_-]+$/)) {
        // poll — shouldn't be hit since we return succeeded inline.
        return jsonResponse(makeSucceededPrediction("p"));
      }
      if (url.includes("/predictions")) {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const promptHint: string =
          (body.input?.prompt ?? "") + " " + (body.version ?? "");
        // s2's prompt is "verse shot". Fail those POSTs.
        if (promptHint.includes("verse")) {
          createCalls.s2 = (createCalls.s2 ?? 0) + 1;
          return new Response("transient upstream failure", { status: 502 });
        }
        return jsonResponse(makeSucceededPrediction("p-ok"));
      }
      if (url.startsWith("https://replicate.delivery/")) {
        return blobResponse(8);
      }
      throw new Error(`Unexpected fetch url: ${url}`);
    });

    const events: RenderEvent[] = [];
    const result = await runRender({
      plan: makePlan(),
      audioBlob: new Blob([new Uint8Array(8)]),
      token: TOKEN,
      onEvent: (e) => events.push(e),
      proxyBaseUrl: PROXY,
    });

    expect(result.failedSceneIds).toEqual(["s2"]);

    const failedForS2 = events.filter(
      (e) => e.type === "scene:failed" && e.sceneId === "s2",
    ) as Array<{ type: "scene:failed"; attempt: number; error: string }>;
    expect(failedForS2).toHaveLength(3);
    expect(failedForS2.map((e) => e.attempt)).toEqual([1, 2, 3]);

    // Render still completes — compose:done fired.
    expect(events.find((e) => e.type === "compose:done")).toBeDefined();

    // s1 and s3 produced successful downloads.
    expect(
      events.find((e) => e.type === "scene:downloaded" && e.sceneId === "s1"),
    ).toBeDefined();
    expect(
      events.find((e) => e.type === "scene:downloaded" && e.sceneId === "s3"),
    ).toBeDefined();

    // s2 has no `scene:downloaded` event — it went straight to placeholder
    // composition.
    expect(
      events.find((e) => e.type === "scene:downloaded" && e.sceneId === "s2"),
    ).toBeUndefined();
    // But it does have `scene:composed` because the placeholder still gets composed.
    expect(
      events.find((e) => e.type === "scene:composed" && e.sceneId === "s2"),
    ).toBeDefined();
  }, 30_000);
});

describe("runRender — abort", () => {
  it("AbortSignal mid-generation throws AbortError and stops emitting events", async () => {
    const controller = new AbortController();

    installFetchMock(async (url, init) => {
      if (url.includes("/predictions") && !url.match(/predictions\/[A-Za-z0-9_-]+$/)) {
        // Abort while the very first POST is in flight.
        controller.abort();
        // Reject like a real aborted fetch would.
        if (init?.signal?.aborted) {
          throw new DOMException("aborted", "AbortError");
        }
        return jsonResponse(makeSucceededPrediction("p"));
      }
      return blobResponse(4);
    });

    const events: RenderEvent[] = [];
    await expect(
      runRender({
        plan: makePlan(),
        audioBlob: new Blob([new Uint8Array(8)]),
        token: TOKEN,
        onEvent: (e) => events.push(e),
        signal: controller.signal,
        proxyBaseUrl: PROXY,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });

    // No compose:done event should be present.
    expect(events.find((e) => e.type === "compose:done")).toBeUndefined();
  });
});

describe("runRender — token never leaks into events", () => {
  it("no emitted event JSON contains the literal token or `r8_` prefix", async () => {
    // Force an error response that includes a partial payload — sanitizeError
    // must scrub the token if any error path concatenates it.
    let firstCall = true;
    installFetchMock(async (url) => {
      if (url.includes("/predictions") && !url.match(/predictions\/[A-Za-z0-9_-]+$/)) {
        if (firstCall) {
          firstCall = false;
          // Body intentionally contains the token to prove sanitisation works
          // even if Replicate echoes the Authorization header into an error.
          return new Response(`error: bad auth header was Bearer ${TOKEN}`, {
            status: 401,
          });
        }
        return jsonResponse(makeSucceededPrediction("p"));
      }
      return blobResponse(4);
    });

    const events: RenderEvent[] = [];
    await runRender({
      plan: makePlan(),
      audioBlob: new Blob([new Uint8Array(8)]),
      token: TOKEN,
      onEvent: (e) => events.push(e),
      proxyBaseUrl: PROXY,
    });

    const serialised = JSON.stringify(events);
    expect(serialised).not.toContain(TOKEN);
    expect(serialised).not.toMatch(/r8_[A-Za-z0-9_-]{5,}/);
  });
});
