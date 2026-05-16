/**
 * Support-bundle builder (R15).
 *
 * Produces a JSON snapshot the user can attach to a Gumroad support reply.
 * Hard exclusions per R15: the Replicate token, the audio Blob, and any
 * rendered MP4 Blobs. We ship metadata + capability flags + a short rolling
 * error log only. The bundle MUST stay small enough to paste into an email
 * thread without surprising the user — under ~50 KB in normal use.
 *
 * Why this lives in `lib/` and not on the settings page directly:
 *   - The error-log ring buffer is module-scoped here so the rest of the app
 *     can call `logError(...)` from anywhere (render-runner, upload form,
 *     license validation) and have those entries roll up into the bundle.
 *   - Keeping the bundle build in pure TS makes it trivial to unit-test if a
 *     later T-task wants to.
 */

import { detectCapabilities, type CapabilityReport } from "./capability-detect";
import { listPlans, loadPlan } from "./plan-storage";
import { listRenders, type RenderMeta } from "./history";

// ---------- Error log (in-memory ring buffer) ----------

export type ErrorLevel = "info" | "warn" | "error";

export type ErrorEntry = {
  /** Epoch ms. */
  ts: number;
  level: ErrorLevel;
  msg: string;
};

const ERROR_LOG_CAP = 200;
const errorLog: ErrorEntry[] = [];

/**
 * Append a single line to the in-memory error log. Caller is responsible for
 * NOT including any secret (token, passphrase, license key) in `msg`. We don't
 * scrub here because doing so reliably would require knowing every secret
 * format we'd ever store, and the API is internal anyway.
 */
export function logError(level: ErrorLevel, msg: string): void {
  errorLog.push({ ts: Date.now(), level, msg });
  if (errorLog.length > ERROR_LOG_CAP) {
    // Keep the most-recent N — drop the oldest.
    errorLog.splice(0, errorLog.length - ERROR_LOG_CAP);
  }
}

/** Read-only view, newest last. Frozen so the caller can't mutate the buffer. */
export function getErrorLog(): readonly ErrorEntry[] {
  return errorLog.slice();
}

/** Used by `clear-all.ts` and tests. */
export function clearErrorLog(): void {
  errorLog.length = 0;
}

// ---------- Bundle shape ----------

export type SupportBundle = {
  bundleVersion: 1;
  /** ISO-8601 UTC timestamp at bundle build time. */
  timestamp: string;
  browser: {
    userAgent: string;
    language: string;
    viewport: { w: number; h: number };
    pixelRatio: number;
    capabilities: CapabilityReport;
  };
  /** Optional — only present if the ffmpeg.wasm module exposes a version we can read. */
  ffmpegVersion?: string;
  /** Plan metadata only — no audio, no token. */
  plans: Array<{
    id: string;
    theme: string;
    bpm: number | null;
    aspect: string;
    sceneCount: number;
    updatedAt: number;
  }>;
  /** Render metadata only — no MP4 / thumbnail Blobs. */
  renders: Array<{
    id: string;
    planId: string;
    theme: string;
    sceneCount: number;
    failedSceneIds: string[];
    createdAt: number;
  }>;
  errorLog: ErrorEntry[];
};

// ---------- Builder ----------

function readBrowserInfo(): SupportBundle["browser"] {
  // Window-safe guards: caller is expected to run this on the client, but
  // we degrade gracefully if anything's missing so the bundle is always at
  // least a JSON object (rather than throwing on SSR).
  if (typeof window === "undefined") {
    return {
      userAgent: "",
      language: "",
      viewport: { w: 0, h: 0 },
      pixelRatio: 1,
      capabilities: detectCapabilities(),
    };
  }
  return {
    userAgent: navigator.userAgent ?? "",
    language: navigator.language ?? "",
    viewport: {
      w: window.innerWidth ?? 0,
      h: window.innerHeight ?? 0,
    },
    pixelRatio: window.devicePixelRatio ?? 1,
    capabilities: detectCapabilities(),
  };
}

async function readPlanMetadata(): Promise<SupportBundle["plans"]> {
  if (typeof window === "undefined") return [];
  // `listPlans` already returns lightweight rows, but we additionally load
  // each plan to read `bpm`, `aspect`, and `scenes.length`. Cheap — plans are
  // small JSON blobs in localStorage.
  const out: SupportBundle["plans"] = [];
  try {
    for (const row of listPlans()) {
      const full = loadPlan(row.id);
      if (!full) continue;
      out.push({
        id: full.id,
        theme: full.theme,
        bpm: full.bpm,
        aspect: full.aspect,
        sceneCount: full.scenes.length,
        updatedAt: full.updatedAt,
      });
    }
  } catch {
    // Swallowing here is fine — the bundle is best-effort diagnostic data.
  }
  return out;
}

async function readRenderMetadata(): Promise<SupportBundle["renders"]> {
  if (typeof window === "undefined") return [];
  try {
    const rows = await listRenders();
    return rows.map((r: RenderMeta) => ({
      id: r.id,
      planId: r.planId,
      theme: r.theme,
      sceneCount: r.sceneCount,
      failedSceneIds: r.failedSceneIds,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}

/**
 * Try to read the loaded ffmpeg.wasm version. We deliberately avoid importing
 * `@ffmpeg/ffmpeg` here — it's a heavy bundle, and T6 must NOT trigger its
 * download just to assemble a support bundle. Instead we peek at a global
 * the render-runner can publish once it's loaded ffmpeg.
 */
function readFfmpegVersion(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const v = (window as unknown as { __rhythmix_ffmpeg_version?: string })
    .__rhythmix_ffmpeg_version;
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export async function buildSupportBundle(): Promise<SupportBundle> {
  const [plans, renders] = await Promise.all([
    readPlanMetadata(),
    readRenderMetadata(),
  ]);
  const bundle: SupportBundle = {
    bundleVersion: 1,
    timestamp: new Date().toISOString(),
    browser: readBrowserInfo(),
    plans,
    renders,
    errorLog: getErrorLog().slice(),
  };
  const ffmpeg = readFfmpegVersion();
  if (ffmpeg) bundle.ffmpegVersion = ffmpeg;
  return bundle;
}

// ---------- Download helper ----------

/**
 * Materialise the bundle into a `Blob` and click a synthetic `<a download>`.
 * Single round-trip — caller is expected to await `buildSupportBundle()` and
 * pass the result through.
 */
export function downloadSupportBundle(bundle: SupportBundle): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    const stamp = bundle.timestamp.replace(/[:.]/g, "-");
    a.href = url;
    a.download = `rhythmix-support-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    // Defer revoke to give the browser a tick to start the download.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
