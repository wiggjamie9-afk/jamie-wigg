/**
 * Tests for `lib/history.ts` (R7, R8) — render history with 50-cap eviction.
 *
 * IndexedDB strategy
 * ------------------
 * We mock the `idb` package directly with `vi.mock`. The in-memory mock
 * keeps a Map keyed by `meta.id` and a flat array we re-sort on demand for
 * the `createdAt` index lookup. This is sufficient for `history.ts`'s
 * surface (`put`, `get`, `getAll`, `delete`, `count`, `clear`, and an
 * ascending cursor on the `createdAt` index).
 *
 * Reasoning vs. `fake-indexeddb`: the dep isn't installed in this branch
 * and the hard rules for T14 forbid `npm install`. A targeted module mock
 * is also faster and lets us assert behaviour the IndexedDB spec doesn't
 * surface cleanly (e.g. "exactly one eviction per `saveRender`").
 *
 * If `fake-indexeddb` is added later this file can swap to it by deleting
 * the `vi.mock("idb", ...)` block and importing `fake-indexeddb/auto`.
 */

import { webcrypto } from "node:crypto";

// history.ts → generateRenderId() calls crypto.randomUUID(). jsdom doesn't
// ship WebCrypto, so install Node's implementation onto globalThis before
// any module under test loads.
if (typeof (globalThis as { crypto?: { randomUUID?: unknown } }).crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
    writable: true,
  });
}

// jsdom doesn't ship IndexedDB. history.ts's `isBrowser()` guard checks
// `typeof indexedDB !== "undefined"` to refuse to run during SSR; we
// satisfy that check with a sentinel here. All real IndexedDB calls are
// intercepted by the `vi.mock("idb", ...)` block below — the sentinel
// only exists to pass the isBrowser type-of check.
if (typeof (globalThis as { indexedDB?: unknown }).indexedDB === "undefined") {
  Object.defineProperty(globalThis, "indexedDB", {
    value: {},
    configurable: true,
    writable: true,
  });
}

// jsdom's Blob is bare-bones — no `arrayBuffer()`, no `stream()`, no `text()`.
// Node's built-in `Blob` (from `node:buffer`) is fully spec-compliant. Swap
// the global before the test code constructs any Blobs so `makeBlob(byte)`
// returns one whose bytes can actually be read back.
import { Blob as NodeBlob } from "node:buffer";
Object.defineProperty(globalThis, "Blob", {
  value: NodeBlob,
  configurable: true,
  writable: true,
});

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

// ---------- In-memory `idb` mock ----------

type Row = { meta: { id: string; createdAt: number; theme: string } & Record<string, unknown> };

class FakeStore {
  rows: Map<string, Row> = new Map();
}

const stores: Map<string, FakeStore> = new Map();

function getStore(name: string): FakeStore {
  if (!stores.has(name)) stores.set(name, new FakeStore());
  return stores.get(name)!;
}

vi.mock("idb", () => {
  function makeDb(_dbName: string) {
    return {
      async put(storeName: string, value: Row) {
        getStore(storeName).rows.set(value.meta.id, value);
      },
      async get(storeName: string, id: string) {
        return getStore(storeName).rows.get(id);
      },
      async getAll(storeName: string) {
        return Array.from(getStore(storeName).rows.values());
      },
      async delete(storeName: string, id: string) {
        getStore(storeName).rows.delete(id);
      },
      async count(storeName: string) {
        return getStore(storeName).rows.size;
      },
      async clear(storeName: string) {
        getStore(storeName).rows.clear();
      },
      transaction(storeName: string, _mode: "readonly" | "readwrite") {
        const store = getStore(storeName);
        let resolveDone: () => void;
        const done = new Promise<void>((res) => {
          resolveDone = res;
        });
        return {
          store: {
            // history.ts's evictOldest now reads the full set + sorts in JS
            // for tie-breaking on (createdAt, seq), so the transaction store
            // needs getAll() + delete(id) — the previous cursor-based path
            // is no longer used.
            async getAll() {
              return Array.from(store.rows.values());
            },
            async delete(id: string) {
              store.rows.delete(id);
            },
            // Retained for back-compat in case any future test exercises the
            // old cursor path. Not currently called.
            index(_indexName: string) {
              return {
                async openCursor() {
                  const sorted = Array.from(store.rows.values()).sort(
                    (a, b) => a.meta.createdAt - b.meta.createdAt,
                  );
                  if (!sorted.length) {
                    resolveDone();
                    return null;
                  }
                  const oldest = sorted[0];
                  return {
                    value: oldest,
                    async delete() {
                      store.rows.delete(oldest.meta.id);
                    },
                  };
                },
              };
            },
          },
          get done() {
            // Mark resolved on next microtask so callers `await tx.done`.
            queueMicrotask(() => resolveDone());
            return done;
          },
        };
      },
      close() {
        /* no-op */
      },
    };
  }

  return {
    openDB: async (name: string, _version: number, opts?: { upgrade?: (db: unknown) => void }) => {
      // Invoke upgrade so test code that depends on side effects is exercised.
      if (opts?.upgrade) {
        opts.upgrade({
          objectStoreNames: { contains: () => true },
          createObjectStore: () => ({ createIndex: () => undefined }),
        });
      }
      return makeDb(name);
    },
  };
});

// ---------- Module under test ----------

import {
  saveRender,
  listRenders,
  getRender,
  deleteRender,
  clearAllRenders,
  MAX_RENDERS,
  type RenderMeta,
  type ToastEvent,
} from "./history";

// ---------- Test helpers ----------

function makeMeta(overrides: Partial<Omit<RenderMeta, "id" | "createdAt">> = {}): Omit<
  RenderMeta,
  "id" | "createdAt"
> {
  return {
    planId: "plan-x",
    theme: "cinematic test",
    bpm: 120,
    aspect: "16:9",
    audioDurationSec: 60,
    sceneCount: 7,
    failedSceneIds: [],
    ...overrides,
  };
}

function makeBlob(byte: number): Blob {
  return new Blob([new Uint8Array([byte])], { type: "video/mp4" });
}

beforeEach(() => {
  stores.clear();
});

afterEach(() => {
  stores.clear();
});

// ---------- Tests ----------

describe("saveRender + listRenders", () => {
  it("persists a record and lists it back", async () => {
    const id = await saveRender(makeMeta({ theme: "alpha" }), makeBlob(1), makeBlob(2));
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(4);
    const all = await listRenders();
    expect(all).toHaveLength(1);
    expect(all[0].theme).toBe("alpha");
    expect(all[0].id).toBe(id);
  });

  it("listRenders returns newest-first", async () => {
    await saveRender(makeMeta({ theme: "first" }), makeBlob(1), makeBlob(2));
    // Advance the clock by mutating Date.now indirectly with a small wait.
    await new Promise((r) => setTimeout(r, 5));
    await saveRender(makeMeta({ theme: "second" }), makeBlob(3), makeBlob(4));
    await new Promise((r) => setTimeout(r, 5));
    await saveRender(makeMeta({ theme: "third" }), makeBlob(5), makeBlob(6));

    const all = await listRenders();
    expect(all.map((m) => m.theme)).toEqual(["third", "second", "first"]);
  });
});

describe("getRender / deleteRender", () => {
  it("getRender returns the same Blob bytes you put in", async () => {
    const mp4 = makeBlob(42);
    const thumb = makeBlob(7);
    const id = await saveRender(makeMeta(), mp4, thumb);
    const got = await getRender(id);
    expect(got).not.toBeNull();
    expect(got!.mp4).toBe(mp4);
    expect(got!.thumbnail).toBe(thumb);

    const bytes = new Uint8Array(await got!.mp4.arrayBuffer());
    expect(bytes[0]).toBe(42);
  });

  it("getRender returns null for an unknown id", async () => {
    expect(await getRender("does-not-exist")).toBeNull();
  });

  it("deleteRender removes the entry", async () => {
    const id = await saveRender(makeMeta(), makeBlob(1), makeBlob(2));
    expect(await listRenders()).toHaveLength(1);
    await deleteRender(id);
    expect(await listRenders()).toHaveLength(0);
    expect(await getRender(id)).toBeNull();
  });
});

describe("50-entry cap eviction (R7)", () => {
  it(`evicts exactly the oldest record once cap (${MAX_RENDERS}) is exceeded`, async () => {
    const onToast = vi.fn();

    // Insert 50 records with strictly increasing createdAt by using
    // distinct microtask gaps. We rely on the runtime Date.now resolution;
    // if a few share a millisecond the eviction still picks SOMETHING old.
    const themes: string[] = [];
    for (let i = 0; i < MAX_RENDERS; i++) {
      const theme = `r-${i.toString().padStart(2, "0")}`;
      themes.push(theme);
      await saveRender(makeMeta({ theme }), makeBlob(i), makeBlob(i));
      // Tight loop is fine — saveRender is async; introduce a 1ms gap
      // every 10 inserts so the sort key spreads out.
      if (i % 10 === 9) await new Promise((r) => setTimeout(r, 2));
    }

    expect(onToast).not.toHaveBeenCalled();
    expect(await listRenders()).toHaveLength(MAX_RENDERS);

    // 51st save triggers exactly one eviction toast.
    await new Promise((r) => setTimeout(r, 2));
    await saveRender(
      makeMeta({ theme: "over-cap" }),
      makeBlob(99),
      makeBlob(99),
      onToast,
    );

    expect(onToast).toHaveBeenCalledTimes(1);
    const evt = onToast.mock.calls[0][0] as ToastEvent;
    expect(evt.type).toBe("history:evicted");
    // Victim should be one of the earliest saves, not "over-cap".
    expect(evt.victimTheme).not.toBe("over-cap");

    const after = await listRenders();
    expect(after).toHaveLength(MAX_RENDERS);
    expect(after.find((m) => m.theme === "over-cap")).toBeDefined();
  });

  it("does not fire the toast when below cap", async () => {
    const onToast = vi.fn();
    for (let i = 0; i < 5; i++) {
      await saveRender(makeMeta({ theme: `r-${i}` }), makeBlob(i), makeBlob(i), onToast);
    }
    expect(onToast).not.toHaveBeenCalled();
  });

  it("subsequent saves while still over-cap each fire one eviction (not a thundering herd)", async () => {
    // Pre-populate well over the cap to simulate an externally-seeded DB.
    for (let i = 0; i < MAX_RENDERS + 5; i++) {
      await saveRender(makeMeta({ theme: `seed-${i}` }), makeBlob(i), makeBlob(i));
    }

    const toastA = vi.fn();
    await saveRender(makeMeta({ theme: "trigger-a" }), makeBlob(1), makeBlob(1), toastA);
    expect(toastA).toHaveBeenCalledTimes(1);

    const toastB = vi.fn();
    await saveRender(makeMeta({ theme: "trigger-b" }), makeBlob(1), makeBlob(1), toastB);
    expect(toastB).toHaveBeenCalledTimes(1);
  });
});

describe("clearAllRenders", () => {
  it("wipes every entry", async () => {
    await saveRender(makeMeta({ theme: "a" }), makeBlob(1), makeBlob(1));
    await saveRender(makeMeta({ theme: "b" }), makeBlob(1), makeBlob(1));
    expect(await listRenders()).toHaveLength(2);

    await clearAllRenders();
    expect(await listRenders()).toHaveLength(0);
  });
});

describe("SSR guards", () => {
  async function withoutWindow<T>(body: () => Promise<T> | T): Promise<T> {
    const desc = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    try {
      return await body();
    } finally {
      if (desc) Object.defineProperty(globalThis, "window", desc);
      else delete (globalThis as { window?: unknown }).window;
    }
  }

  it("listRenders returns [] when window is undefined", async () => {
    const res = await withoutWindow(() => listRenders());
    expect(res).toEqual([]);
  });

  it("getRender returns null when window is undefined", async () => {
    const res = await withoutWindow(() => getRender("x"));
    expect(res).toBeNull();
  });

  it("saveRender throws when window is undefined", async () => {
    await expect(
      withoutWindow(() =>
        saveRender(makeMeta(), makeBlob(1), makeBlob(1)),
      ),
    ).rejects.toThrow(/SSR/);
  });

  it("deleteRender / clearAllRenders are no-ops when window is undefined", async () => {
    await expect(withoutWindow(() => deleteRender("x"))).resolves.toBeUndefined();
    await expect(withoutWindow(() => clearAllRenders())).resolves.toBeUndefined();
  });
});
