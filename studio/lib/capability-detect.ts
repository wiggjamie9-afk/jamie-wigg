/**
 * Capability detection for the RHYTHMIX Studio web app.
 *
 * Pure module — no React, no Next.js. Safe to import from server or client,
 * but the detection functions themselves rely on browser globals and will
 * report `false` everywhere when run on the server. Consumers should call
 * `detectCapabilities()` only after mount (in `useEffect` or equivalent).
 *
 * Satisfies R13 (hard-failure detection) for the web app.
 */

export interface CapabilityReport {
  /** WebCrypto SubtleCrypto — required to encrypt the Replicate token. */
  webCrypto: boolean;
  /** IndexedDB — required for render history storage. */
  indexedDb: boolean;
  /** WebAssembly — required for ffmpeg.wasm. */
  webAssembly: boolean;
  /** BroadcastChannel — required for second-tab coordination (R14). Non-blocking. */
  broadcastChannel: boolean;
}

/**
 * Capabilities that are blocking — if any are missing, the app cannot run.
 * The order here defines the priority for routing: the first missing one wins.
 */
export const BLOCKING_CAPABILITIES: ReadonlyArray<keyof CapabilityReport> = [
  "webCrypto",
  "indexedDb",
  "webAssembly",
];

/**
 * Synchronously probe the current runtime for the capabilities Studio needs.
 *
 * Safe to call on the server — every flag will simply be `false` since the
 * relevant globals don't exist. That's fine, because the consumer
 * (`CapabilityGate`) only acts on the report after mount.
 */
export function detectCapabilities(): CapabilityReport {
  // Each check is wrapped in a try/catch because some browsers (private-mode
  // Safari, for instance) throw on bare access to certain globals.
  let webCrypto = false;
  try {
    webCrypto =
      typeof crypto !== "undefined" &&
      typeof (crypto as Crypto).subtle !== "undefined" &&
      "subtle" in crypto;
  } catch {
    webCrypto = false;
  }

  let indexedDb = false;
  try {
    indexedDb = typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    // Safari private mode throws on `indexedDB` access.
    indexedDb = false;
  }

  let webAssembly = false;
  try {
    webAssembly = typeof WebAssembly !== "undefined";
  } catch {
    webAssembly = false;
  }

  let broadcastChannel = false;
  try {
    broadcastChannel = typeof BroadcastChannel !== "undefined";
  } catch {
    broadcastChannel = false;
  }

  return { webCrypto, indexedDb, webAssembly, broadcastChannel };
}

/**
 * Return the first *blocking* capability that's missing, or `null` if the
 * runtime can run the app. `broadcastChannel` is intentionally excluded —
 * it's a degraded-mode warning, not a hard block.
 */
export function firstMissingCapability(
  report: CapabilityReport
): keyof CapabilityReport | null {
  for (const cap of BLOCKING_CAPABILITIES) {
    if (!report[cap]) {
      return cap;
    }
  }
  return null;
}

/**
 * Probe whether `api.replicate.com` is reachable from the browser.
 *
 * Uses HEAD against `/v1/account`. We treat *any* HTTP response as
 * "reachable" — even 401 (unauthenticated), because that means DNS,
 * TLS, and the Replicate edge are all live. We only return `false` when
 * the request errors out (network down, DNS fail, CORS preflight refused,
 * or the timeout fires).
 *
 * @param timeoutMs default 5000ms.
 */
export async function probeReplicateReachable(
  timeoutMs: number = 5000
): Promise<boolean> {
  if (typeof fetch === "undefined" || typeof AbortController === "undefined") {
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    await fetch("https://api.replicate.com/v1/account", {
      method: "HEAD",
      signal: controller.signal,
      // No credentials — we just want to confirm the host is reachable.
      mode: "cors",
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
