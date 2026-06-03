import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Plan } from "./plan-storage";
import type { RenderMeta } from "./history";

vi.mock("./capability-detect", () => ({
  detectCapabilities: vi.fn(() => ({
    webCrypto: true,
    indexedDb: true,
    webAssembly: true,
    broadcastChannel: true,
  })),
}));

vi.mock("./plan-storage", () => ({
  listPlans: vi.fn(() => []),
  loadPlan: vi.fn(() => null),
}));

vi.mock("./history", () => ({
  listRenders: vi.fn(async () => []),
  clearAllRenders: vi.fn(async () => {}),
}));

import {
  logError,
  getErrorLog,
  clearErrorLog,
  buildSupportBundle,
  downloadSupportBundle,
  type SupportBundle,
  type ErrorEntry,
} from "./support-bundle";
import { detectCapabilities } from "./capability-detect";
import { listPlans, loadPlan } from "./plan-storage";
import { listRenders } from "./history";

beforeEach(() => {
  clearErrorLog();
  vi.clearAllMocks();
});

// ---------- logError / getErrorLog / clearErrorLog ----------

describe("logError + getErrorLog + clearErrorLog", () => {
  it("pushes a single entry to the buffer", () => {
    logError("info", "hello");
    const log = getErrorLog();
    expect(log).toHaveLength(1);
    expect(log[0].msg).toBe("hello");
    expect(log[0].level).toBe("info");
  });

  it("stores ts as a finite number within the call window", () => {
    const before = Date.now();
    logError("warn", "ts-check");
    const after = Date.now();
    const [entry] = getErrorLog();
    expect(typeof entry.ts).toBe("number");
    expect(entry.ts).toBeGreaterThanOrEqual(before);
    expect(entry.ts).toBeLessThanOrEqual(after);
  });

  it("stores all three levels correctly", () => {
    logError("info", "info-msg");
    logError("warn", "warn-msg");
    logError("error", "error-msg");
    const log = getErrorLog();
    expect(log[0].level).toBe("info");
    expect(log[1].level).toBe("warn");
    expect(log[2].level).toBe("error");
  });

  it("getErrorLog returns a copy — mutating the return does not affect the buffer", () => {
    logError("info", "original");
    const copy = getErrorLog() as ErrorEntry[];
    copy.push({ ts: 0, level: "error", msg: "injected" });
    expect(getErrorLog()).toHaveLength(1);
  });

  it("clearErrorLog empties the buffer", () => {
    logError("error", "will-be-cleared");
    clearErrorLog();
    expect(getErrorLog()).toHaveLength(0);
  });

  it("clearErrorLog on an already-empty buffer is a no-op", () => {
    expect(() => clearErrorLog()).not.toThrow();
    expect(getErrorLog()).toHaveLength(0);
  });

  it("buffer cap is 200 — logging 201 entries keeps exactly 200", () => {
    for (let i = 0; i < 201; i++) {
      logError("info", `msg-${i}`);
    }
    expect(getErrorLog()).toHaveLength(200);
  });

  it("buffer cap keeps the most-recent entries, dropping the oldest", () => {
    logError("info", "first");
    for (let i = 0; i < 200; i++) {
      logError("info", `later-${i}`);
    }
    const log = getErrorLog();
    expect(log).toHaveLength(200);
    const msgs = log.map((e) => e.msg);
    expect(msgs).not.toContain("first");
    expect(msgs[msgs.length - 1]).toBe("later-199");
  });

  it("entries accumulate in insertion order", () => {
    logError("info", "a");
    logError("warn", "b");
    logError("error", "c");
    const msgs = getErrorLog().map((e) => e.msg);
    expect(msgs).toEqual(["a", "b", "c"]);
  });
});

// ---------- buildSupportBundle ----------

describe("buildSupportBundle", () => {
  it("returns bundleVersion: 1", async () => {
    const bundle = await buildSupportBundle();
    expect(bundle.bundleVersion).toBe(1);
  });

  it("timestamp is a valid ISO-8601 string", async () => {
    const bundle = await buildSupportBundle();
    expect(typeof bundle.timestamp).toBe("string");
    const parsed = new Date(bundle.timestamp);
    expect(Number.isNaN(parsed.getTime())).toBe(false);
    expect(bundle.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("browser.userAgent matches navigator.userAgent", async () => {
    const bundle = await buildSupportBundle();
    expect(bundle.browser.userAgent).toBe(navigator.userAgent);
  });

  it("browser.capabilities comes from detectCapabilities mock", async () => {
    const bundle = await buildSupportBundle();
    expect(detectCapabilities).toHaveBeenCalled();
    expect(bundle.browser.capabilities).toEqual({
      webCrypto: true,
      indexedDb: true,
      webAssembly: true,
      broadcastChannel: true,
    });
  });

  it("plans array is empty when listPlans returns []", async () => {
    vi.mocked(listPlans).mockReturnValue([]);
    const bundle = await buildSupportBundle();
    expect(bundle.plans).toEqual([]);
  });

  it("renders array is empty when listRenders returns []", async () => {
    vi.mocked(listRenders).mockResolvedValue([]);
    const bundle = await buildSupportBundle();
    expect(bundle.renders).toEqual([]);
  });

  it("errorLog reflects current buffer state", async () => {
    logError("warn", "test-warn");
    logError("error", "test-error");
    const bundle = await buildSupportBundle();
    expect(bundle.errorLog).toHaveLength(2);
    expect(bundle.errorLog[0].msg).toBe("test-warn");
    expect(bundle.errorLog[1].msg).toBe("test-error");
  });

  it("errorLog in bundle is a snapshot — subsequent logError does not mutate it", async () => {
    logError("info", "before-build");
    const bundle = await buildSupportBundle();
    logError("info", "after-build");
    expect(bundle.errorLog).toHaveLength(1);
  });

  it("ffmpegVersion is absent when __rhythmix_ffmpeg_version is not set", async () => {
    delete (window as { __rhythmix_ffmpeg_version?: string }).__rhythmix_ffmpeg_version;
    const bundle = await buildSupportBundle();
    expect(Object.prototype.hasOwnProperty.call(bundle, "ffmpegVersion")).toBe(false);
  });

  it("ffmpegVersion is present when __rhythmix_ffmpeg_version is set", async () => {
    (window as { __rhythmix_ffmpeg_version?: string }).__rhythmix_ffmpeg_version = "0.12.0";
    const bundle = await buildSupportBundle();
    expect(bundle.ffmpegVersion).toBe("0.12.0");
    delete (window as { __rhythmix_ffmpeg_version?: string }).__rhythmix_ffmpeg_version;
  });

  it("ffmpegVersion is absent when __rhythmix_ffmpeg_version is an empty string", async () => {
    (window as { __rhythmix_ffmpeg_version?: string }).__rhythmix_ffmpeg_version = "";
    const bundle = await buildSupportBundle();
    expect(Object.prototype.hasOwnProperty.call(bundle, "ffmpegVersion")).toBe(false);
    delete (window as { __rhythmix_ffmpeg_version?: string }).__rhythmix_ffmpeg_version;
  });

  it("plans array populated from listPlans/loadPlan — contains only metadata fields", async () => {
    const fullPlan: Plan = {
      id: "p1",
      audioDuration: 120,
      theme: "neon-city",
      bpm: 128,
      aspect: "16:9",
      scenes: [
        {
          id: "s1",
          role: "intro",
          model: "flux-dev",
          startSec: 0,
          endSec: 10,
          prompt: "a glowing city",
        },
        {
          id: "s2",
          role: "chorus",
          model: "flux-dev",
          startSec: 10,
          endSec: 40,
          prompt: "neon lights",
        },
      ],
      createdAt: 900,
      updatedAt: 1000,
    };
    vi.mocked(listPlans).mockReturnValue([
      { id: "p1", updatedAt: 1000, theme: "neon-city" },
    ]);
    vi.mocked(loadPlan).mockReturnValue(fullPlan);

    const bundle = await buildSupportBundle();

    expect(bundle.plans).toHaveLength(1);
    const p = bundle.plans[0];
    expect(p.id).toBe("p1");
    expect(p.theme).toBe("neon-city");
    expect(p.bpm).toBe(128);
    expect(p.aspect).toBe("16:9");
    expect(p.sceneCount).toBe(2);
    expect(p.updatedAt).toBe(1000);
    // Hard exclusions per R15: scenes and audio must not appear
    expect(Object.prototype.hasOwnProperty.call(p, "scenes")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(p, "audio")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(p, "audioDuration")).toBe(false);
  });

  it("plans entry with null bpm is preserved as null", async () => {
    const fullPlan: Plan = {
      id: "p2",
      audioDuration: 60,
      theme: "ambient",
      bpm: null,
      aspect: "1:1",
      scenes: [],
      createdAt: 500,
      updatedAt: 600,
    };
    vi.mocked(listPlans).mockReturnValue([{ id: "p2", updatedAt: 600, theme: "ambient" }]);
    vi.mocked(loadPlan).mockReturnValue(fullPlan);

    const bundle = await buildSupportBundle();
    expect(bundle.plans[0].bpm).toBeNull();
  });

  it("skips plan row when loadPlan returns null", async () => {
    vi.mocked(listPlans).mockReturnValue([{ id: "missing", updatedAt: 0, theme: "x" }]);
    vi.mocked(loadPlan).mockReturnValue(null);
    const bundle = await buildSupportBundle();
    expect(bundle.plans).toHaveLength(0);
  });

  it("renders array populated from listRenders mock", async () => {
    const renderMeta: RenderMeta = {
      id: "r1",
      planId: "p1",
      theme: "neon-city",
      bpm: 128,
      aspect: "16:9",
      audioDurationSec: 120,
      sceneCount: 3,
      failedSceneIds: ["s2"],
      createdAt: 2000,
      seq: 0,
    };
    vi.mocked(listRenders).mockResolvedValue([renderMeta]);

    const bundle = await buildSupportBundle();
    expect(bundle.renders).toHaveLength(1);
    const r = bundle.renders[0];
    expect(r.id).toBe("r1");
    expect(r.planId).toBe("p1");
    expect(r.theme).toBe("neon-city");
    expect(r.sceneCount).toBe(3);
    expect(r.failedSceneIds).toEqual(["s2"]);
    expect(r.createdAt).toBe(2000);
    // Hard exclusions per R15: no Blob fields
    expect(Object.prototype.hasOwnProperty.call(r, "mp4")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(r, "thumbnail")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(r, "bpm")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(r, "audioDurationSec")).toBe(false);
  });

  it("renders falls back to empty array when listRenders rejects", async () => {
    vi.mocked(listRenders).mockRejectedValue(new Error("IDB unavailable"));
    const bundle = await buildSupportBundle();
    expect(bundle.renders).toEqual([]);
  });
});

// ---------- downloadSupportBundle ----------

describe("downloadSupportBundle", () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let removeChildSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;
  let createElementSpy: ReturnType<typeof vi.fn>;

  const makeBundle = (timestamp = "2026-06-03T12:00:00.000Z"): SupportBundle => ({
    bundleVersion: 1,
    timestamp,
    browser: {
      userAgent: "test-agent",
      language: "en",
      viewport: { w: 1280, h: 800 },
      pixelRatio: 1,
      capabilities: {
        webCrypto: true,
        indexedDb: true,
        webAssembly: true,
        broadcastChannel: true,
      },
    },
    plans: [],
    renders: [],
    errorLog: [],
  });

  beforeEach(() => {
    vi.useFakeTimers();

    clickSpy = vi.fn();
    const fakeAnchor = {
      href: "",
      download: "",
      click: clickSpy,
    };

    createElementSpy = vi.fn(() => fakeAnchor);
    appendChildSpy = vi.fn();
    removeChildSpy = vi.fn();
    createObjectURLSpy = vi.fn(() => "blob:mock-url");
    revokeObjectURLSpy = vi.fn();

    vi.spyOn(document, "createElement").mockImplementation(
      createElementSpy as typeof document.createElement,
    );
    vi.spyOn(document.body, "appendChild").mockImplementation(appendChildSpy);
    vi.spyOn(document.body, "removeChild").mockImplementation(removeChildSpy);
    URL.createObjectURL = createObjectURLSpy;
    URL.revokeObjectURL = revokeObjectURLSpy;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("calls URL.createObjectURL with a Blob of type application/json", () => {
    downloadSupportBundle(makeBundle());
    expect(createObjectURLSpy).toHaveBeenCalledOnce();
    const arg: Blob = createObjectURLSpy.mock.calls[0][0];
    expect(arg).toBeInstanceOf(Blob);
    expect(arg.type).toBe("application/json");
  });

  it("anchor .download contains a transformed timestamp — colons and dots replaced with dashes", () => {
    downloadSupportBundle(makeBundle("2026-06-03T12:00:00.000Z"));
    const anchor = createElementSpy.mock.results[0].value;
    expect(anchor.download).toMatch(/^rhythmix-support-2026-06-03T12-00-00-000Z\.json$/);
  });

  it("anchor .href is set to the object URL", () => {
    downloadSupportBundle(makeBundle());
    const anchor = createElementSpy.mock.results[0].value;
    expect(anchor.href).toBe("blob:mock-url");
  });

  it("appends the anchor to document.body then removes it", () => {
    downloadSupportBundle(makeBundle());
    expect(appendChildSpy).toHaveBeenCalledOnce();
    expect(removeChildSpy).toHaveBeenCalledOnce();
  });

  it("calls anchor.click()", () => {
    downloadSupportBundle(makeBundle());
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it("revokeObjectURL is NOT called synchronously — deferred via setTimeout", () => {
    downloadSupportBundle(makeBundle());
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();
  });

  it("revokeObjectURL is called after vi.runAllTimers()", () => {
    downloadSupportBundle(makeBundle());
    vi.runAllTimers();
    expect(revokeObjectURLSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
  });

  it("Blob content is non-empty", () => {
    downloadSupportBundle(makeBundle());
    const blobArg: Blob = createObjectURLSpy.mock.calls[0][0];
    expect(blobArg.size).toBeGreaterThan(0);
  });
});
