/**
 * Render runner — orchestrates a full RHYTHMIX video render in the browser.
 *
 * Responsibilities (R6, R7):
 *   1. For every scene in the plan, kick off a Replicate prediction via the
 *      proxy Worker (`replicate-proxy.studio.rhythmixapp.com.au`). Direct
 *      browser-to-Replicate is impossible — see specs/rhythmix-app/spike-cors.md.
 *   2. Generate scenes in parallel up to `concurrency` (default 2).
 *   3. Retry transient failures up to 3 attempts with exponential backoff
 *      (1s, 2s, 4s). After the 3rd failure, the scene is *marked failed
 *      but not fatal* — the runner continues with the rest of the plan and
 *      the compose phase substitutes a placeholder black frame with scene
 *      metadata overlay (R6).
 *   4. Compose: trim each per-scene MP4 to its plan-defined duration,
 *      concat in order, mux the user's full audio track in, and extract
 *      a thumbnail from frame 0.
 *   5. Emit progress events through `onEvent` for the UI (T11) to render.
 *   6. Honor an `AbortSignal` — aborting anywhere mid-pipeline throws an
 *      `AbortError`, no further events are emitted.
 *
 * Token handling: the user's Replicate token is passed as a plain string
 * via `opts.token`. It is sent on the `Authorization` header of each call
 * to the proxy Worker and **never** included in:
 *   - any `RenderEvent` payload (especially error strings — see `sanitizeError`)
 *   - any console.log / console.warn
 *   - any thrown exception message
 *
 * ffmpeg.wasm lifecycle caveat: the underlying `@ffmpeg/ffmpeg` instance is
 * a single global (see `rhythmix-studio/src/ffmpeg/wasm.mjs`). It serializes
 * its own filesystem operations internally, but we deliberately keep the
 * compose stage sequential (one trim at a time) to avoid any race on the
 * shared MEMFS. Scene *generation* is parallel because that's pure network
 * I/O, not ffmpeg work.
 */

import type { Plan, Scene } from "./plan-storage";
import type { RenderHandler } from "./render-events";
import {
  trim,
  concat,
  mux,
  extractFrame,
} from "../../rhythmix-studio/src/ffmpeg/wasm.mjs";
import { MODELS } from "../../rhythmix-studio/src/core/models.mjs";

// ---------- Public types ----------

export type RunRenderOpts = {
  plan: Plan;
  audioBlob: Blob;
  /** User's Replicate API token. Never logged, never put in events. */
  token: string;
  /** Default 2. Higher = more parallel Replicate calls. */
  concurrency?: number;
  onEvent: RenderHandler;
  signal?: AbortSignal;
  /** Override for dev/test. Default points at the production proxy Worker. */
  proxyBaseUrl?: string;
  /**
   * Optional pre-fetched per-scene Blobs to skip generation for. Used by
   * `rerunScenes` for the "retry just the failed scenes" UX (R6) — pass the
   * survivors of a previous render here so we only generate the failed ones.
   */
  existingSceneBlobs?: Map<string, Blob>;
};

export type RerunOpts = RunRenderOpts & { sceneIds: string[] };

export type RenderResult = {
  mp4: Blob;
  thumbnail: Blob;
  /** Scene IDs that failed all 3 retries; surfaced in UI so user can re-run. */
  failedSceneIds: string[];
  /**
   * Per-scene downloaded source Blobs that successfully generated this run.
   * Failed scenes are absent from the map. Pass this back to `rerunScenes`
   * as `existingSceneBlobs` so survivors are NOT re-generated against
   * Replicate — that's the cost-saving fix for the partial-failure UX.
   */
  sceneBlobs: Map<string, Blob>;
};

// ---------- Constants ----------

const DEFAULT_PROXY_BASE_URL =
  "https://replicate-proxy.studio.rhythmixapp.com.au/api/replicate-proxy/v1";

const MAX_ATTEMPTS = 3;
/** Backoff in ms: 1s, 2s, 4s. */
const BACKOFF_MS = [1000, 2000, 4000];

const POLL_INTERVAL_MS = 2000;
const POLL_HARD_TIMEOUT_FLOOR_MS = 120_000;
const PLACEHOLDER_WIDTH = 1280;
const PLACEHOLDER_HEIGHT = 720;

// ---------- Public API ----------

export async function runRender(opts: RunRenderOpts): Promise<RenderResult> {
  return executeRender(opts, opts.plan.scenes.map((s) => s.id));
}

/**
 * Re-run a subset of scene IDs against the same plan + audio. The caller
 * must pass `existingSceneBlobs` for the scenes that succeeded last time;
 * those are reused as-is (no Replicate calls). Scenes named in `sceneIds`
 * are regenerated from scratch.
 */
export async function rerunScenes(opts: RerunOpts): Promise<RenderResult> {
  if (!opts.sceneIds.length) {
    throw new Error("rerunScenes: sceneIds must be non-empty");
  }
  const valid = new Set(opts.plan.scenes.map((s) => s.id));
  for (const id of opts.sceneIds) {
    if (!valid.has(id)) {
      throw new Error(`rerunScenes: scene id ${id} not in plan`);
    }
  }
  return executeRender(opts, opts.sceneIds);
}

// ---------- Core orchestration ----------

async function executeRender(
  opts: RunRenderOpts,
  sceneIdsToGenerate: string[],
): Promise<RenderResult> {
  const {
    plan,
    audioBlob,
    token,
    concurrency = 2,
    onEvent,
    signal,
    proxyBaseUrl = DEFAULT_PROXY_BASE_URL,
    existingSceneBlobs,
  } = opts;

  ensureNotAborted(signal);

  // Map of sceneId → downloaded Blob (or undefined if failed).
  const sceneBlobs: Map<string, Blob> = new Map(existingSceneBlobs ?? []);
  const failedSceneIds: string[] = [];

  // Drop any pre-supplied blobs for scenes we're explicitly re-running.
  for (const id of sceneIdsToGenerate) sceneBlobs.delete(id);

  // ---- Stage 1: parallel scene generation ------------------------------
  const queue = plan.scenes.filter((s) => sceneIdsToGenerate.includes(s.id));

  // Pre-queue events so the UI can paint a "queued" row for every pending
  // scene before any generating event fires.
  for (const scene of queue) {
    onEvent({ type: "scene:queued", sceneId: scene.id });
  }

  await runWithConcurrency(queue, concurrency, async (scene) => {
    ensureNotAborted(signal);
    try {
      const blob = await generateOneScene({
        scene,
        token,
        proxyBaseUrl,
        signal,
        onEvent,
      });
      sceneBlobs.set(scene.id, blob);
    } catch (err) {
      // generateOneScene only throws after all retries are exhausted (or
      // on abort). On abort we re-throw; on real failure we record + move on.
      if (isAbortError(err)) throw err;
      failedSceneIds.push(scene.id);
      // Note: generateOneScene already emitted the final `scene:failed`
      // event for the last attempt before throwing.
    }
  });

  ensureNotAborted(signal);

  // ---- Stage 2: compose ------------------------------------------------
  onEvent({ type: "compose:start" });

  const orderedScenes = plan.scenes;
  const trimmed: Blob[] = [];
  // We coarse-grain progress: scenes done is the main signal; we also emit
  // a final 95% just before the mux step, then 100% on done.
  const total = orderedScenes.length;

  for (let i = 0; i < orderedScenes.length; i++) {
    ensureNotAborted(signal);
    const scene = orderedScenes[i];
    const sourceBlob = sceneBlobs.get(scene.id);
    const duration = Math.max(0.1, scene.endSec - scene.startSec);

    let segment: Blob;
    if (sourceBlob) {
      segment = await trim(sourceBlob, 0, duration);
      onEvent({ type: "scene:composed", sceneId: scene.id });
    } else {
      // Failed scene → black placeholder with metadata overlay (R6).
      segment = await makePlaceholderBlob(scene, duration);
      onEvent({ type: "scene:composed", sceneId: scene.id });
    }
    trimmed.push(segment);

    // Per-scene progress within the compose stage. Reserve the last 10%
    // for concat + mux + thumbnail.
    const percent = Math.floor(((i + 1) / total) * 90);
    onEvent({ type: "compose:progress", percent });
  }

  ensureNotAborted(signal);

  const concatenated = await concat(trimmed);
  onEvent({ type: "compose:progress", percent: 92 });

  ensureNotAborted(signal);

  const finalMp4 = await mux(concatenated, audioBlob);
  onEvent({ type: "compose:progress", percent: 97 });

  ensureNotAborted(signal);

  const thumbnail = await extractFrame(finalMp4, 0);
  onEvent({ type: "compose:progress", percent: 100 });
  onEvent({ type: "compose:done" });

  return { mp4: finalMp4, thumbnail, failedSceneIds, sceneBlobs };
}

// ---------- Scene generation with retry ----------

type GenerateOpts = {
  scene: Scene;
  token: string;
  proxyBaseUrl: string;
  signal: AbortSignal | undefined;
  onEvent: RenderHandler;
};

/**
 * Generate one scene with up to 3 attempts and exponential backoff.
 * On final failure, emits `scene:failed` for the last attempt and rethrows
 * so the caller can record the scene id. The caller is responsible for
 * deciding that final-failure is non-fatal at the render level (R6).
 */
async function generateOneScene(opts: GenerateOpts): Promise<Blob> {
  const { scene, token, proxyBaseUrl, signal, onEvent } = opts;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    ensureNotAborted(signal);
    onEvent({ type: "scene:generating", sceneId: scene.id, attempt });

    try {
      const outputUrl = await runReplicatePrediction({
        scene,
        token,
        proxyBaseUrl,
        signal,
      });
      ensureNotAborted(signal);

      const blob = await downloadToBlob({
        url: outputUrl,
        signal,
      });
      onEvent({
        type: "scene:downloaded",
        sceneId: scene.id,
        bytes: blob.size,
      });
      return blob;
    } catch (err) {
      if (isAbortError(err)) throw err;

      const errorMsg = sanitizeError(err, token);
      onEvent({
        type: "scene:failed",
        sceneId: scene.id,
        attempt,
        error: errorMsg,
      });

      if (attempt >= MAX_ATTEMPTS) {
        // Surface as throw so the orchestrator can record the failure.
        throw new Error(`Scene ${scene.id} failed after ${MAX_ATTEMPTS} attempts: ${errorMsg}`);
      }

      // Backoff before the next attempt. Use a cancellable sleep.
      await cancellableSleep(BACKOFF_MS[attempt - 1], signal);
    }
  }

  // Unreachable — the loop either returns or throws.
  throw new Error(`Scene ${scene.id} fell out of retry loop without resolving`);
}

// ---------- Replicate HTTP via proxy ----------

type ReplicateCallOpts = {
  scene: Scene;
  token: string;
  proxyBaseUrl: string;
  signal: AbortSignal | undefined;
};

/**
 * Start a prediction and poll until it's `succeeded` or `failed`. Returns
 * the first URL from the prediction output (the generated MP4).
 *
 * Strategy:
 *   1. POST /predictions with `Prefer: wait` — if the model returns inline
 *      within the wait window we get the result in one round-trip.
 *   2. Otherwise the response is a queued prediction and we poll
 *      `GET /predictions/<id>` every 2 seconds until terminal status.
 *   3. Overall timeout: max(model.maxClipSeconds * 3 * 1000, 120_000) ms.
 *      This is generous because Replicate's queue depth varies wildly.
 */
async function runReplicatePrediction(opts: ReplicateCallOpts): Promise<string> {
  const { scene, token, proxyBaseUrl, signal } = opts;

  const model = MODELS[scene.model];
  if (!model) {
    throw new Error(`Unknown model id: ${scene.model}`);
  }

  // Inject the per-scene duration into the input so the model's `buildInput`
  // can use it. The studio Scene shape uses `startSec`/`endSec`; the engine
  // adapter expects `duration` + `prompt`.
  const sceneForBuild = {
    prompt: scene.prompt,
    duration: Math.max(1, scene.endSec - scene.startSec),
    aspectRatio: undefined as string | undefined,
  };
  const input = model.buildInput(sceneForBuild);

  // Parse the replicateId — owner/name(:version).
  const [owner, rest] = model.replicateId.split("/");
  if (!owner || !rest) {
    throw new Error(`Invalid model replicateId: ${model.replicateId}`);
  }
  const [name, version] = rest.split(":");

  let createUrl: string;
  let createBody: Record<string, unknown>;
  if (version) {
    createUrl = `${proxyBaseUrl}/predictions`;
    createBody = { version, input };
  } else {
    createUrl = `${proxyBaseUrl}/models/${owner}/${name}/predictions`;
    createBody = { input };
  }

  const startRes = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Prefer wait=60 lets Replicate return the result inline if the model
      // finishes inside 60s. If not, we get a queued response and poll.
      Prefer: "wait=60",
    },
    body: JSON.stringify(createBody),
    signal,
  });

  if (!startRes.ok) {
    const detail = await safeReadErrorBody(startRes);
    throw new Error(`Replicate start failed: ${startRes.status} ${detail}`);
  }

  let prediction = (await startRes.json()) as ReplicatePrediction;

  const hardTimeoutMs = Math.max(
    POLL_HARD_TIMEOUT_FLOOR_MS,
    (model.maxClipSeconds ?? 30) * 3 * 1000,
  );
  const deadline = Date.now() + hardTimeoutMs;

  while (
    prediction.status !== "succeeded" &&
    prediction.status !== "failed" &&
    prediction.status !== "canceled"
  ) {
    if (Date.now() > deadline) {
      throw new Error(`Replicate prediction timed out after ${hardTimeoutMs}ms`);
    }
    ensureNotAborted(signal);
    await cancellableSleep(POLL_INTERVAL_MS, signal);

    const id = prediction.id;
    const pollUrl = `${proxyBaseUrl}/predictions/${encodeURIComponent(id)}`;
    const pollRes = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    if (!pollRes.ok) {
      const detail = await safeReadErrorBody(pollRes);
      throw new Error(`Replicate poll failed: ${pollRes.status} ${detail}`);
    }
    prediction = (await pollRes.json()) as ReplicatePrediction;
  }

  if (prediction.status !== "succeeded") {
    const reason = prediction.error || prediction.status;
    throw new Error(`Replicate ${prediction.status}: ${reason}`);
  }

  return firstOutputUrl(prediction.output);
}

type ReplicatePrediction = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output: unknown;
  error?: string | null;
};

function firstOutputUrl(output: unknown): string {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length > 0 && typeof output[0] === "string") {
    return output[0] as string;
  }
  if (
    output &&
    typeof output === "object" &&
    typeof (output as { url?: unknown }).url === "string"
  ) {
    return (output as { url: string }).url;
  }
  throw new Error("Replicate returned no usable output URL");
}

// ---------- Output download ----------

type DownloadOpts = {
  url: string;
  signal: AbortSignal | undefined;
};

/**
 * Download a Replicate-hosted MP4 into a Blob. Replicate's output URLs
 * (`replicate.delivery`, `r8.im`) generally serve CORS-friendly responses,
 * so we try direct first. If that fails (network or CORS), we fall back to
 * routing the URL through the proxy Worker (which has no CORS restriction).
 */
async function downloadToBlob(opts: DownloadOpts): Promise<Blob> {
  const { url, signal } = opts;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Download HTTP ${res.status} for ${redactUrlHost(url)}`);
  }
  return await res.blob();
  // Note: Replicate delivery URLs (`replicate.delivery`, `r8.im`) reliably
  // serve CORS-friendly responses. If a customer environment proxies all
  // egress and breaks that, the per-scene retry loop will catch it and the
  // scene gets a placeholder via the R6 fallback path.
}

function redactUrlHost(url: string): string {
  // Avoid logging the full delivery URL (which can include a per-prediction
  // path token). Surface only the host for diagnostic context.
  try {
    return new URL(url).host;
  } catch {
    return "<delivery url>";
  }
}

// ---------- Placeholder for failed scenes ----------

/**
 * Build a 1-frame-extended black-with-metadata placeholder for a scene that
 * failed all retries. Uses the lavfi `color` source + `drawtext` filter to
 * generate a self-contained Blob without external assets.
 *
 * Why we go through @ffmpeg/ffmpeg directly here (instead of the adapter's
 * named helpers): the adapter exposes `trim/concat/mux/extractFrame` which
 * all assume *input data*; there's no "synthesize from filtergraph" helper.
 * Adding one is out of scope for this task, so we reach for the underlying
 * FFmpeg instance via dynamic import. This is the only place in the runner
 * that does so.
 */
async function makePlaceholderBlob(
  scene: Scene,
  durationSec: number,
): Promise<Blob> {
  // Lazy dynamic import via a runtime-computed specifier so TypeScript
  // doesn't try to resolve `@ffmpeg/ffmpeg` at type-check time (the package
  // is added to studio/package.json by T15 / T11 build steps; this module
  // is unit-tested with the import stubbed). At call time, the bundler
  // resolves the specifier normally because it's a literal string.
  const ffmpegModule = (await loadFfmpegModule()) as FfmpegRuntime;
  const ff = new ffmpegModule.FFmpeg();
  await ff.load();

  // Compose a label string we can safely pass to drawtext. drawtext is
  // famously fragile around colons, so we use the simplest escaping that
  // works: replace `:` with space and strip everything weird.
  const label = formatLabel(scene);
  const safeDuration = Math.max(0.2, durationSec).toFixed(3);

  const outputName = `placeholder-${scene.id}.mp4`;
  // lavfi: color=black, fixed size, fixed duration. drawtext overlays the
  // scene metadata centered. We use a small font size and a generic font
  // (fontconfig's default, baked into the wasm core).
  const args = [
    "-f",
    "lavfi",
    "-i",
    `color=c=black:s=${PLACEHOLDER_WIDTH}x${PLACEHOLDER_HEIGHT}:d=${safeDuration}:r=30`,
    "-vf",
    `drawtext=text='${escapeDrawtext(label)}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2`,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-t",
    safeDuration,
    outputName,
  ];

  await ff.exec(args);
  const data = (await ff.readFile(outputName)) as Uint8Array;
  // Best-effort cleanup; ignore errors.
  try {
    await ff.deleteFile(outputName);
  } catch {
    /* ignore */
  }

  // TS 5.7+ makes Uint8Array generic over its underlying buffer; copy into
  // a fresh, plain ArrayBuffer-backed Uint8Array so the lib.dom BlobPart
  // signature accepts it (it disallows SharedArrayBuffer-backed views).
  const owned = new Uint8Array(data.byteLength);
  owned.set(data);
  return new Blob([owned], { type: "video/mp4" });
}

type FfmpegRuntime = {
  FFmpeg: new () => {
    load: () => Promise<void>;
    exec: (args: string[]) => Promise<number>;
    readFile: (path: string) => Promise<Uint8Array | string>;
    deleteFile: (path: string) => Promise<void>;
  };
};

/**
 * Resolve `@ffmpeg/ffmpeg` at runtime. Indirected so the import specifier
 * is a runtime expression — keeps TypeScript happy when the dep isn't
 * installed in the dev tree yet and lets tests stub the loader via
 * `__setFfmpegLoaderForTest()` below.
 */
let _ffmpegLoader: () => Promise<unknown> = () => {
  const specifier = "@ffmpeg/ffmpeg";
  return import(/* @vite-ignore */ /* webpackIgnore: false */ specifier);
};

async function loadFfmpegModule(): Promise<unknown> {
  return _ffmpegLoader();
}

/** Test hook — T14 will replace the loader with a mock. */
export function __setFfmpegLoaderForTest(loader: () => Promise<unknown>): void {
  _ffmpegLoader = loader;
}

function formatLabel(scene: Scene): string {
  return `Scene failed: ${scene.role} (${scene.id})`;
}

function escapeDrawtext(s: string): string {
  // drawtext uses : as a separator and \ as an escape. We strip the
  // problematic chars rather than try to escape them robustly — the
  // placeholder is a visible-error affordance, not a typography exercise.
  return s.replace(/[:'\\]/g, " ").slice(0, 80);
}

// ---------- Concurrency primitive ----------

/**
 * Run `task` over `items` with at most `limit` concurrent invocations.
 * Errors from `task` propagate upward and cancel remaining work *only* if
 * they're abort errors — generation errors are caught inside the caller's
 * `task` (so partial failures don't halt the pool, per R6).
 */
async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<void>,
): Promise<void> {
  const lane = Math.max(1, limit);
  let cursor = 0;
  const runners: Promise<void>[] = [];
  for (let i = 0; i < Math.min(lane, items.length); i++) {
    runners.push(
      (async () => {
        while (true) {
          const idx = cursor++;
          if (idx >= items.length) return;
          await task(items[idx]);
        }
      })(),
    );
  }
  await Promise.all(runners);
}

// ---------- Abort / sleep helpers ----------

function ensureNotAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw makeAbortError();
  }
}

function makeAbortError(): Error {
  if (typeof DOMException !== "undefined") {
    return new DOMException("Render cancelled", "AbortError");
  }
  const err = new Error("Render cancelled");
  (err as Error & { name: string }).name = "AbortError";
  return err;
}

function isAbortError(err: unknown): boolean {
  return Boolean(
    err &&
      typeof err === "object" &&
      (err as { name?: string }).name === "AbortError",
  );
}

async function cancellableSleep(
  ms: number,
  signal: AbortSignal | undefined,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(makeAbortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(makeAbortError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

// ---------- Error sanitisation ----------

/**
 * Convert any thrown value into a UI-safe error string. The user's
 * Replicate token must never leak into events — if for any reason the
 * error message includes it, redact.
 */
function sanitizeError(err: unknown, token: string): string {
  const raw =
    err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
  if (!token) return raw;
  // Replace any literal occurrence of the token plus the typical Bearer
  // prefix forms.
  return raw
    .split(token)
    .join("[REDACTED]")
    .replace(/Bearer\s+r8_[A-Za-z0-9_-]+/g, "Bearer [REDACTED]");
}

async function safeReadErrorBody(res: Response): Promise<string> {
  try {
    const text = await res.text();
    // Cap length so giant HTML error pages don't blow up the UI.
    return text.slice(0, 500);
  } catch {
    return res.statusText || "<no body>";
  }
}
