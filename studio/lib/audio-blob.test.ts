import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  validateAudioFile,
  generateId,
  audioBlobToObjectUrl,
  stashAudioForPlan,
  getAudioForPlan,
} from "./audio-blob";

// ---------------------------------------------------------------------------
// validateAudioFile
// ---------------------------------------------------------------------------

describe("validateAudioFile", () => {
  it("rejects an empty file", () => {
    const file = new File([], "track.mp3", { type: "audio/mpeg" });
    const result = validateAudioFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason.toLowerCase()).toContain("empty");
  });

  it("rejects a file over 50 MB and includes MB size + '50 MB' in reason", () => {
    const file = new File(["x"], "track.mp3", { type: "audio/mpeg" });
    Object.defineProperty(file, "size", { value: 60 * 1024 * 1024 });
    const result = validateAudioFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/\d+\.\d+ MB/);
      expect(result.reason).toContain("50 MB");
    }
  });

  it("accepts a file exactly 50 MB", () => {
    const file = new File(["x"], "track.mp3", { type: "audio/mpeg" });
    Object.defineProperty(file, "size", { value: 50 * 1024 * 1024 });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("accepts audio/mpeg MIME type", () => {
    const file = new File([new Uint8Array(100)], "track.mp3", { type: "audio/mpeg" });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("accepts audio/wav MIME type", () => {
    const file = new File([new Uint8Array(100)], "track.wav", { type: "audio/wav" });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("accepts audio/mp4 MIME type", () => {
    const file = new File([new Uint8Array(100)], "track.mp4", { type: "audio/mp4" });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("accepts audio/flac MIME type", () => {
    const file = new File([new Uint8Array(100)], "track.flac", { type: "audio/flac" });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("accepts empty MIME with .mp3 extension (iOS Safari behaviour)", () => {
    const file = new File([new Uint8Array(100)], "track.mp3", { type: "" });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("accepts empty MIME with .m4a extension (iOS Safari behaviour)", () => {
    const file = new File([new Uint8Array(100)], "track.m4a", { type: "" });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("rejects unknown MIME with unknown extension", () => {
    const file = new File([new Uint8Array(100)], "track.xyz", { type: "video/mp4" });
    expect(validateAudioFile(file).ok).toBe(false);
  });

  it("accepts known extension even when MIME is application/octet-stream", () => {
    const file = new File([new Uint8Array(100)], "track.wav", {
      type: "application/octet-stream",
    });
    expect(validateAudioFile(file).ok).toBe(true);
  });

  it("rejects completely unknown MIME with no extension", () => {
    const file = new File([new Uint8Array(100)], "noextension", {
      type: "application/zip",
    });
    const result = validateAudioFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason.toLowerCase()).toMatch(/mp3|wav|m4a|flac/);
  });
});

// ---------------------------------------------------------------------------
// generateId
// ---------------------------------------------------------------------------

describe("generateId", () => {
  it("returns a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("returns a non-empty string", () => {
    expect(generateId().length).toBeGreaterThan(0);
  });

  it("returns an ID within the expected length range for 8-byte base36", () => {
    // 8 bytes → max 2^64 in base36 → at most 13 chars; very small values could be shorter
    const id = generateId();
    expect(id.length).toBeGreaterThanOrEqual(1);
    expect(id.length).toBeLessThanOrEqual(14);
  });

  it("returns different values on successive calls", () => {
    expect(generateId()).not.toBe(generateId());
  });

  it("returns only base-36 characters (0-9 a-z) across many samples", () => {
    for (let i = 0; i < 30; i++) {
      expect(generateId()).toMatch(/^[0-9a-z]+$/);
    }
  });
});

// ---------------------------------------------------------------------------
// audioBlobToObjectUrl
// ---------------------------------------------------------------------------

describe("audioBlobToObjectUrl", () => {
  let originalCreateObjectURL: typeof URL.createObjectURL | undefined;

  beforeEach(() => {
    // jsdom does not implement URL.createObjectURL — install a stub first so
    // vi.spyOn has something to wrap.
    originalCreateObjectURL = URL.createObjectURL as typeof URL.createObjectURL | undefined;
    URL.createObjectURL = vi.fn(() => "blob:http://localhost/fake-id");
  });

  afterEach(() => {
    if (originalCreateObjectURL !== undefined) {
      URL.createObjectURL = originalCreateObjectURL;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (URL as any).createObjectURL;
    }
  });

  it("calls URL.createObjectURL with the provided blob", () => {
    const blob = new Blob(["audio data"], { type: "audio/mpeg" });
    audioBlobToObjectUrl(blob);
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
  });

  it("returns the value produced by URL.createObjectURL", () => {
    const blob = new Blob(["audio data"], { type: "audio/mpeg" });
    const result = audioBlobToObjectUrl(blob);
    expect(result).toBe("blob:http://localhost/fake-id");
  });
});

// ---------------------------------------------------------------------------
// stashAudioForPlan / getAudioForPlan — IndexedDB round-trip via fake IDB
// ---------------------------------------------------------------------------

type AnyFn = (...args: unknown[]) => unknown;

function buildFakeIndexedDB() {
  const store = new Map<string, unknown>();

  function makeRequest<T>(getValue: () => T) {
    const req = {
      result: undefined as unknown as T,
      onsuccess: null as AnyFn | null,
      onerror: null as AnyFn | null,
      error: null,
    };
    setTimeout(() => {
      req.result = getValue();
      req.onsuccess?.();
    }, 0);
    return req;
  }

  function makeDb() {
    return {
      transaction(_storeName: string, _mode: string) {
        let _oncomplete: AnyFn | null = null;
        return {
          objectStore() {
            return {
              put(value: unknown, key: string) {
                store.set(key, value);
                return makeRequest(() => undefined);
              },
              get(key: string) {
                return makeRequest(() => store.get(key) ?? null);
              },
            };
          },
          onerror: null as AnyFn | null,
          onabort: null as AnyFn | null,
          get oncomplete() {
            return _oncomplete;
          },
          set oncomplete(fn: AnyFn | null) {
            _oncomplete = fn;
            if (fn) setTimeout(fn, 1);
          },
          error: null,
        };
      },
      close: vi.fn(),
    };
  }

  // open() is called once per stash/get operation. Each call returns a fresh
  // open-request whose onsuccess fires asynchronously — this mirrors real IDB
  // and ensures that tests making multiple awaited calls don't deadlock on a
  // request whose onsuccess already fired.
  const fakeIDB = {
    open: vi.fn(() => {
      const db = makeDb();
      const req = {
        result: db,
        onupgradeneeded: null as AnyFn | null,
        onsuccess: null as AnyFn | null,
        onerror: null as AnyFn | null,
        error: null,
      };
      setTimeout(() => req.onsuccess?.(), 0);
      return req;
    }),
    deleteDatabase: vi.fn(),
    databases: vi.fn(),
    cmp: vi.fn(),
  };

  return { fakeIDB, store };
}

describe("stashAudioForPlan / getAudioForPlan", () => {
  let fakeIDB: ReturnType<typeof buildFakeIndexedDB>["fakeIDB"];
  let store: ReturnType<typeof buildFakeIndexedDB>["store"];

  beforeEach(() => {
    const fake = buildFakeIndexedDB();
    fakeIDB = fake.fakeIDB;
    store = fake.store;
    vi.stubGlobal("indexedDB", fakeIDB);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stashAudioForPlan resolves without throwing", async () => {
    const blob = new Blob(["audio"], { type: "audio/mpeg" });
    await expect(stashAudioForPlan("plan-smoke", blob)).resolves.toBeUndefined();
  });

  it("opens indexedDB with the correct database name and version", async () => {
    const blob = new Blob(["x"], { type: "audio/mpeg" });
    await stashAudioForPlan("plan-name-check", blob);
    expect(fakeIDB.open).toHaveBeenCalledWith("rhythmix-studio", 1);
  });

  it("getAudioForPlan returns null for an unknown key", async () => {
    const result = await getAudioForPlan("plan-nonexistent");
    expect(result).toBeNull();
  });

  it("round-trip: stash then retrieve returns the same blob reference", async () => {
    const blob = new Blob(["my audio content"], { type: "audio/wav" });
    await stashAudioForPlan("plan-roundtrip", blob);
    const retrieved = await getAudioForPlan("plan-roundtrip");
    expect(retrieved).toBe(blob);
  });

  it("stashing under two different plan IDs keeps them isolated", async () => {
    const blobA = new Blob(["track A"], { type: "audio/mpeg" });
    const blobB = new Blob(["track B"], { type: "audio/flac" });
    await stashAudioForPlan("plan-A", blobA);
    await stashAudioForPlan("plan-B", blobB);
    expect(store.get("plan-A")).toBe(blobA);
    expect(store.get("plan-B")).toBe(blobB);
  });

  it("overwriting a key replaces the stored blob", async () => {
    const blobV1 = new Blob(["v1"], { type: "audio/mpeg" });
    const blobV2 = new Blob(["v2"], { type: "audio/mpeg" });
    await stashAudioForPlan("plan-overwrite", blobV1);
    await stashAudioForPlan("plan-overwrite", blobV2);
    const retrieved = await getAudioForPlan("plan-overwrite");
    expect(retrieved).toBe(blobV2);
  });
});
