import { describe, it, expect, vi, beforeEach } from "vitest";
import { clearAllLocalData } from "./clear-all";

vi.mock("./secrets", () => ({ clearToken: vi.fn() }));
vi.mock("./history", () => ({ clearAllRenders: vi.fn(async () => {}) }));

import { clearToken } from "./secrets";
import { clearAllRenders } from "./history";

// ---------- IDB fake ----------

const deletedDbs: string[] = [];
const fakeIDB = {
  deleteDatabase: vi.fn((name: string) => {
    deletedDbs.push(name);
    const req: {
      onsuccess: (() => void) | null;
      onerror: (() => void) | null;
      onblocked: (() => void) | null;
    } = { onsuccess: null, onerror: null, onblocked: null };
    setTimeout(() => req.onsuccess?.(), 0);
    return req;
  }),
};
vi.stubGlobal("indexedDB", fakeIDB);

// ---------- helpers ----------

function populateStorage(entries: Record<string, string>): void {
  for (const [k, v] of Object.entries(entries)) {
    localStorage.setItem(k, v);
  }
}

function storageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) keys.push(k);
  }
  return keys;
}

// ---------- setup ----------

beforeEach(() => {
  localStorage.clear();
  deletedDbs.length = 0;
  vi.mocked(clearToken).mockReset();
  vi.mocked(clearAllRenders).mockReset();
  vi.mocked(clearAllRenders).mockResolvedValue(undefined);
  fakeIDB.deleteDatabase.mockClear();
});

// ---------- isOwnedKey (tested indirectly via clearAllLocalData) ----------

describe("isOwnedKey — owned prefixes survive clearOwnedLocalStorage only for foreign keys", () => {
  it("removes keys with the plan- prefix", async () => {
    populateStorage({ "plan-abc": "1" });
    await clearAllLocalData();
    expect(localStorage.getItem("plan-abc")).toBeNull();
  });

  it("removes the plan-index key (owned exact match via prefix)", async () => {
    populateStorage({ "plan-index": "[]" });
    await clearAllLocalData();
    expect(localStorage.getItem("plan-index")).toBeNull();
  });

  it("removes keys with the rhythmix_ prefix (e.g. rhythmix_token_v1)", async () => {
    populateStorage({ rhythmix_token_v1: "encrypted-payload" });
    await clearAllLocalData();
    expect(localStorage.getItem("rhythmix_token_v1")).toBeNull();
  });

  it("removes keys with the license_ prefix", async () => {
    populateStorage({ license_cache: "cached-license" });
    await clearAllLocalData();
    expect(localStorage.getItem("license_cache")).toBeNull();
  });

  it("leaves keys that do not match any owned prefix — foreign-key", async () => {
    populateStorage({ "foreign-key": "keep-me" });
    await clearAllLocalData();
    expect(localStorage.getItem("foreign-key")).toBe("keep-me");
  });

  it("leaves keys that do not match any owned prefix — other_app_data", async () => {
    populateStorage({ other_app_data: "keep-me-too" });
    await clearAllLocalData();
    expect(localStorage.getItem("other_app_data")).toBe("keep-me-too");
  });
});

// ---------- clearAllLocalData — call ordering and delegation ----------

describe("clearAllLocalData — call ordering and delegation", () => {
  it("calls clearToken()", async () => {
    await clearAllLocalData();
    expect(clearToken).toHaveBeenCalledOnce();
  });

  it("calls clearAllRenders()", async () => {
    await clearAllLocalData();
    expect(clearAllRenders).toHaveBeenCalledOnce();
  });

  it("calls clearToken before clearAllRenders", async () => {
    const order: string[] = [];
    vi.mocked(clearToken).mockImplementation(() => { order.push("token"); });
    vi.mocked(clearAllRenders).mockImplementation(async () => { order.push("renders"); });
    await clearAllLocalData();
    expect(order).toEqual(["token", "renders"]);
  });
});

// ---------- clearAllLocalData — localStorage behaviour ----------

describe("clearAllLocalData — localStorage pruning", () => {
  it("removes all owned keys while leaving foreign keys intact", async () => {
    populateStorage({
      "plan-abc": "1",
      "plan-index": "[]",
      rhythmix_token_v1: "x",
      license_cache: "y",
      "foreign-key": "stay",
      other_app_data: "stay-too",
    });

    await clearAllLocalData();

    const remaining = storageKeys();
    expect(remaining).toContain("foreign-key");
    expect(remaining).toContain("other_app_data");
    expect(remaining).not.toContain("plan-abc");
    expect(remaining).not.toContain("plan-index");
    expect(remaining).not.toContain("rhythmix_token_v1");
    expect(remaining).not.toContain("license_cache");
  });

  it("does not throw when localStorage is empty", async () => {
    await expect(clearAllLocalData()).resolves.toBeUndefined();
  });

  it("removes multiple plan- keys in a single pass", async () => {
    populateStorage({
      "plan-alpha": "a",
      "plan-beta": "b",
      "plan-gamma": "c",
    });
    await clearAllLocalData();
    expect(storageKeys().filter((k) => k.startsWith("plan-"))).toHaveLength(0);
  });
});

// ---------- clearAllLocalData — resilience ----------

describe("clearAllLocalData — resilience to upstream errors", () => {
  it("resolves even when clearToken() throws", async () => {
    vi.mocked(clearToken).mockImplementation(() => {
      throw new Error("clearToken exploded");
    });
    await expect(clearAllLocalData()).resolves.toBeUndefined();
  });

  it("resolves even when clearAllRenders() rejects", async () => {
    vi.mocked(clearAllRenders).mockRejectedValue(new Error("IDB unavailable"));
    await expect(clearAllLocalData()).resolves.toBeUndefined();
  });

  it("still clears localStorage when clearAllRenders() rejects", async () => {
    vi.mocked(clearAllRenders).mockRejectedValue(new Error("boom"));
    populateStorage({ "plan-x": "1", unrelated: "2" });
    await clearAllLocalData();
    expect(localStorage.getItem("plan-x")).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("2");
  });

  it("still deletes IndexedDB databases when clearAllRenders() rejects", async () => {
    vi.mocked(clearAllRenders).mockRejectedValue(new Error("boom"));
    await clearAllLocalData();
    expect(deletedDbs).toContain("rhythmix-studio");
    expect(deletedDbs).toContain("rhythmix-studio-history");
  });
});

// ---------- clearAllLocalData — IndexedDB ----------

describe("clearAllLocalData — IndexedDB deletion", () => {
  it("calls indexedDB.deleteDatabase for rhythmix-studio", async () => {
    await clearAllLocalData();
    expect(deletedDbs).toContain("rhythmix-studio");
  });

  it("calls indexedDB.deleteDatabase for rhythmix-studio-history", async () => {
    await clearAllLocalData();
    expect(deletedDbs).toContain("rhythmix-studio-history");
  });

  it("deletes both databases in a single clearAllLocalData() call", async () => {
    await clearAllLocalData();
    expect(
      deletedDbs.filter((n) =>
        n === "rhythmix-studio" || n === "rhythmix-studio-history",
      ),
    ).toHaveLength(2);
  });

  it("returns a Promise that resolves (await does not throw)", async () => {
    const result = await clearAllLocalData();
    expect(result).toBeUndefined();
  });
});
