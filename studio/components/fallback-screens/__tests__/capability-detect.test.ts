/**
 * Unit tests for capability detection + `firstMissingCapability` (R13).
 *
 * Written in vitest syntax — runs under any vitest/jest-compatible
 * runner. The studio app doesn't yet have a test runner wired up (no
 * deps may be installed for T15), so this file is here to be picked up
 * by the test task once that infrastructure lands.
 *
 * It lives under `components/fallback-screens/__tests__/` because that
 * directory is the only one T15 was authorised to write tests into; a
 * future test-runner task can move it to a top-level `tests/` folder
 * without changing the assertions.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  BLOCKING_CAPABILITIES,
  detectCapabilities,
  firstMissingCapability,
  probeReplicateReachable,
  type CapabilityReport,
} from "../../../lib/capability-detect";

type GlobalSlot =
  | "crypto"
  | "indexedDB"
  | "WebAssembly"
  | "BroadcastChannel"
  | "fetch"
  | "AbortController";

function withGlobal<T extends GlobalSlot>(
  slot: T,
  value: unknown,
  body: () => void
): void {
  // Modern Node (≥20) defines some globals (notably `crypto`) as
  // non-writable getter-only properties, so plain `g[slot] = value` throws
  // "Cannot set property crypto of #<Object> which has only a getter".
  // `Object.defineProperty` with `configurable: true` works around that
  // because the property descriptors ARE configurable, just not writable.
  const g = globalThis as unknown as Record<string, unknown>;
  const originalDescriptor = Object.getOwnPropertyDescriptor(g, slot);
  if (value === undefined) {
    // Tests pass `undefined` to assert "the global is missing". `delete`
    // also fails on non-configurable globals — use defineProperty with an
    // explicit undefined value, then restore in finally.
    Object.defineProperty(g, slot, {
      value: undefined,
      configurable: true,
      writable: true,
    });
  } else {
    Object.defineProperty(g, slot, {
      value,
      configurable: true,
      writable: true,
    });
  }
  try {
    body();
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(g, slot, originalDescriptor);
    } else {
      // Wasn't present originally; safe to delete since we created it.
      try {
        delete g[slot];
      } catch {
        /* property somehow non-configurable — leave it */
      }
    }
  }
}

describe("detectCapabilities", () => {
  it("returns all true when every global is present", () => {
    withGlobal("crypto", { subtle: {} }, () => {
      withGlobal("indexedDB", {}, () => {
        withGlobal("WebAssembly", {}, () => {
          withGlobal("BroadcastChannel", function FakeBC() {}, () => {
            const report = detectCapabilities();
            expect(report).toEqual<CapabilityReport>({
              webCrypto: true,
              indexedDb: true,
              webAssembly: true,
              broadcastChannel: true,
            });
          });
        });
      });
    });
  });

  it("reports webCrypto false when `crypto.subtle` is missing", () => {
    withGlobal("crypto", {}, () => {
      withGlobal("indexedDB", {}, () => {
        withGlobal("WebAssembly", {}, () => {
          withGlobal("BroadcastChannel", function FakeBC() {}, () => {
            const report = detectCapabilities();
            expect(report.webCrypto).toBe(false);
          });
        });
      });
    });
  });

  it("reports indexedDb false when the global is undefined", () => {
    withGlobal("crypto", { subtle: {} }, () => {
      withGlobal("indexedDB", undefined, () => {
        withGlobal("WebAssembly", {}, () => {
          withGlobal("BroadcastChannel", function FakeBC() {}, () => {
            const report = detectCapabilities();
            expect(report.indexedDb).toBe(false);
          });
        });
      });
    });
  });

  it("reports webAssembly false when the global is undefined", () => {
    withGlobal("crypto", { subtle: {} }, () => {
      withGlobal("indexedDB", {}, () => {
        withGlobal("WebAssembly", undefined, () => {
          withGlobal("BroadcastChannel", function FakeBC() {}, () => {
            const report = detectCapabilities();
            expect(report.webAssembly).toBe(false);
          });
        });
      });
    });
  });

  it("reports broadcastChannel false when the global is undefined", () => {
    withGlobal("crypto", { subtle: {} }, () => {
      withGlobal("indexedDB", {}, () => {
        withGlobal("WebAssembly", {}, () => {
          withGlobal("BroadcastChannel", undefined, () => {
            const report = detectCapabilities();
            expect(report.broadcastChannel).toBe(false);
          });
        });
      });
    });
  });
});

describe("firstMissingCapability", () => {
  const allPresent: CapabilityReport = {
    webCrypto: true,
    indexedDb: true,
    webAssembly: true,
    broadcastChannel: true,
  };

  it("returns null when every blocking capability is present", () => {
    expect(firstMissingCapability(allPresent)).toBeNull();
  });

  it("returns the first blocking capability that's missing in priority order", () => {
    expect(
      firstMissingCapability({ ...allPresent, webAssembly: false })
    ).toBe("webAssembly");
    expect(
      firstMissingCapability({
        ...allPresent,
        webCrypto: false,
        webAssembly: false,
      })
    ).toBe("webCrypto");
    expect(
      firstMissingCapability({ ...allPresent, indexedDb: false })
    ).toBe("indexedDb");
  });

  it("ignores broadcastChannel — it's non-blocking", () => {
    expect(
      firstMissingCapability({ ...allPresent, broadcastChannel: false })
    ).toBeNull();
  });

  it("exposes blocking capabilities in a stable order", () => {
    expect([...BLOCKING_CAPABILITIES]).toEqual([
      "webCrypto",
      "indexedDb",
      "webAssembly",
    ]);
  });
});

describe("probeReplicateReachable", () => {
  let originalFetch: typeof globalThis.fetch | undefined;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    if (originalFetch) globalThis.fetch = originalFetch;
    else delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it("returns true when fetch resolves with any response (including 401)", async () => {
    globalThis.fetch = (async () =>
      new Response(null, { status: 401 })) as typeof globalThis.fetch;
    await expect(probeReplicateReachable(500)).resolves.toBe(true);
  });

  it("returns false when fetch rejects (network error)", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("network down");
    }) as typeof globalThis.fetch;
    await expect(probeReplicateReachable(500)).resolves.toBe(false);
  });

  it("returns false when the request aborts before a response arrives", async () => {
    globalThis.fetch = ((_url: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError"))
        );
      })) as typeof globalThis.fetch;
    await expect(probeReplicateReachable(10)).resolves.toBe(false);
  });
});
