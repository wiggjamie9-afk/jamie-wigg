"use client";

/**
 * `/render/[id]` main client component (T11).
 *
 * Responsibilities:
 *   1. Hydrate plan + audio Blob + Replicate token on mount. Any missing
 *      input → bounce back to /new with an inline error notice.
 *   2. Drive `runRender(...)` from T10's render-runner; subscribe to its
 *      event stream by passing an `onEvent` callback that pokes a React
 *      state map (`Map<sceneId, SceneRowState>`) plus a compose-percent
 *      number. Each event mutates a draft Map and triggers a re-render
 *      via setState(newMap).
 *   3. Tick a 1Hz interval to advance `elapsedSec` on whichever scene is
 *      currently "generating" (the runner only emits transitions; the
 *      timer is local UI sugar so the elapsed counter actually counts up).
 *   4. On render success: auto-download the MP4, then dynamically import
 *      T12's `history.ts` (it doesn't exist yet at the time of writing —
 *      the dynamic import gracefully fails and the save is a no-op).
 *   5. On render error: if `replicate_unreachable`-shaped, show the
 *      ReplicateUnreachable fallback (T15). Else show a generic error card.
 *   6. Honor cancel: an in-component `AbortController` is passed to
 *      `runRender` via `signal`. Cancel = `controller.abort()`; the runner
 *      throws `AbortError`, caught here and translated to a `cancelled`
 *      terminal state (no error toast).
 *   7. Surface a per-scene "Re-run" affordance for scenes in the
 *      `failed` terminal state. Re-run = call T10's `rerunScenes({
 *      sceneIds: [failedId] })`. Note: T10 documents `existingSceneBlobs`
 *      as the survivor-blob map; the runner *itself* tracks those blobs
 *      internally during a single `runRender` call and doesn't expose
 *      them across calls — so a cross-call re-run can't skip the
 *      regeneration of *other* scenes. We accept that gap and re-run the
 *      whole plan starting from scratch when the user clicks Re-run on a
 *      single failed scene; the rerunScenes API lets us at least scope
 *      *which* scenes to generate, but the rest still has to be
 *      synthesized again because we have no blob cache across renders.
 *      Documented as a known limitation; T13/T14 may add the cache later.
 *
 * Mobile-first (R9): full-width buttons ≥44px, single column down to 375px.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAudioForPlan } from "../../lib/audio-blob";
import { loadPlan, type Plan } from "../../lib/plan-storage";
import {
  runRender,
  rerunScenes,
  type RenderResult,
} from "../../lib/render-runner";
import type { RenderEvent } from "../../lib/render-events";
import { ReplicateUnreachable } from "../fallback-screens/replicate-unreachable";
import { ScenesTable, type SceneRowState } from "./scenes-table";
import { ComposeBar } from "./compose-bar";

// ---------- Local types ----------

type PhaseState =
  | { kind: "loading"; message: string }
  | { kind: "running" }
  | { kind: "cancelled" }
  | { kind: "done"; result: RenderResult }
  | { kind: "error"; kind2: "generic" | "replicate-unreachable"; message: string };

/**
 * History save signature, mirrored from T12's `history.ts` module.
 * Defined here so the dynamic import has a typed target; if the module
 * doesn't exist yet (or fails to load), we swallow the error and skip
 * the save. The shape mirrors `Omit<RenderMeta, "id" | "createdAt">` from
 * T12's exports — keeping it inline avoids a hard import dependency.
 */
type SaveRenderFn = (
  meta: {
    planId: string;
    theme: string;
    bpm: number | null;
    aspect: "16:9" | "9:16" | "1:1";
    audioDurationSec: number;
    sceneCount: number;
    failedSceneIds: string[];
  },
  mp4: Blob,
  thumbnail: Blob,
) => Promise<string>;

// ---------- Token source ----------

/**
 * Read the Replicate API token. T6 owns the eventual encrypted-at-rest
 * implementation in `studio/lib/secrets.ts`; until then, we read a plain
 * string from `localStorage.rhythmix_token` so dev workflows can run.
 *
 * Designed as a single function so T6's eventual swap is a one-liner —
 * replace the body with `return getToken(passphrase)`.
 */
function readTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("rhythmix_token");
    return raw && raw.trim() ? raw.trim() : null;
  } catch {
    return null;
  }
}

// ---------- Main component ----------

export function RenderProgress({ planId }: { planId: string }) {
  const router = useRouter();

  const [phase, setPhase] = useState<PhaseState>({
    kind: "loading",
    message: "Loading plan…",
  });
  const [rows, setRows] = useState<Map<string, SceneRowState>>(new Map());
  const [composePercent, setComposePercent] = useState<number | null>(null);

  // We need a stable reference to the abort controller across the run so the
  // Cancel button can fire it. The controller is created lazily when the
  // useEffect kicks off the render.
  const abortRef = useRef<AbortController | null>(null);
  // Hold the plan + audio + token in refs so a re-run handler can fire a
  // fresh runRender without re-fetching from storage.
  const planRef = useRef<Plan | null>(null);
  const audioRef = useRef<Blob | null>(null);
  const tokenRef = useRef<string | null>(null);
  // Pin the start time of the currently-generating scene so the 1Hz tick
  // can derive elapsed wall-clock from it (instead of mutating each row).
  const generatingStartRef = useRef<Map<string, number>>(new Map());

  // ---- Event handler ----
  const handleEvent = useCallback((event: RenderEvent) => {
    switch (event.type) {
      case "scene:queued":
        setRows((prev: Map<string, SceneRowState>) => {
          const next = new Map(prev);
          next.set(event.sceneId, { status: "queued" });
          return next;
        });
        break;
      case "scene:generating":
        generatingStartRef.current.set(event.sceneId, Date.now());
        setRows((prev: Map<string, SceneRowState>) => {
          const next = new Map(prev);
          const cur: SceneRowState =
            next.get(event.sceneId) ?? { status: "queued" };
          next.set(event.sceneId, {
            ...cur,
            status: "generating",
            attempt: event.attempt,
            elapsedSec: 0,
            error: undefined,
          });
          return next;
        });
        break;
      case "scene:downloaded":
        generatingStartRef.current.delete(event.sceneId);
        setRows((prev: Map<string, SceneRowState>) => {
          const next = new Map(prev);
          const cur: SceneRowState =
            next.get(event.sceneId) ?? { status: "queued" };
          next.set(event.sceneId, {
            ...cur,
            status: "downloaded",
            elapsedSec: undefined,
          });
          return next;
        });
        break;
      case "scene:composed":
        setRows((prev: Map<string, SceneRowState>) => {
          const next = new Map(prev);
          const cur: SceneRowState | undefined = next.get(event.sceneId);
          // Composed only overrides non-failed scenes — a failed scene
          // gets a placeholder composed in, but the UI should still show
          // "failed" so the user knows to re-run.
          if (cur?.status === "failed") return next;
          const base: SceneRowState = cur ?? { status: "queued" };
          next.set(event.sceneId, {
            ...base,
            status: "composed",
            elapsedSec: undefined,
          });
          return next;
        });
        break;
      case "scene:failed":
        // Only paint the row as "failed" once the runner has exhausted
        // its retries. The runner emits one `scene:failed` per attempt,
        // so we track that this is the final (=== MAX_ATTEMPTS=3) by
        // checking the attempt counter. Between attempts the user sees
        // the next `scene:generating` event with `attempt: N+1`.
        generatingStartRef.current.delete(event.sceneId);
        setRows((prev: Map<string, SceneRowState>) => {
          const next = new Map(prev);
          const cur: SceneRowState =
            next.get(event.sceneId) ?? { status: "generating" };
          // A non-final failed event means we're between retries; show
          // it as generating-with-error so the user sees the attempt
          // bumping up. The next `scene:generating` will overwrite.
          if (event.attempt < 3) {
            next.set(event.sceneId, {
              ...cur,
              status: "generating",
              attempt: event.attempt,
              error: event.error,
              elapsedSec: undefined,
            });
          } else {
            next.set(event.sceneId, {
              ...cur,
              status: "failed",
              attempt: event.attempt,
              error: event.error,
              elapsedSec: undefined,
            });
          }
          return next;
        });
        break;
      case "compose:start":
        setComposePercent(0);
        break;
      case "compose:progress":
        setComposePercent(event.percent);
        break;
      case "compose:done":
        setComposePercent(100);
        break;
    }
  }, []);

  // ---- 1 Hz tick for elapsed counters during "generating" ----
  useEffect(() => {
    if (phase.kind !== "running") return;
    const t = setInterval(() => {
      setRows((prev: Map<string, SceneRowState>) => {
        const startMap = generatingStartRef.current;
        if (startMap.size === 0) return prev;
        const next = new Map(prev);
        const now = Date.now();
        let changed = false;
        for (const [sceneId, startedAt] of startMap.entries()) {
          const cur = next.get(sceneId);
          if (!cur || cur.status !== "generating") continue;
          const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
          if (cur.elapsedSec !== elapsed) {
            next.set(sceneId, { ...cur, elapsedSec: elapsed });
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase.kind]);

  // ---- Hydrate + kick off the render ----
  useEffect(() => {
    let cancelled = false;

    async function go() {
      const plan = loadPlan(planId);
      if (!plan) {
        if (cancelled) return;
        bounceBack(router, "Plan not found. Start over with a new track.");
        return;
      }
      planRef.current = plan;

      const token = readTokenFromStorage();
      if (!token) {
        if (cancelled) return;
        bounceBack(
          router,
          "No Replicate token found. Add one in Settings, then return.",
        );
        return;
      }
      tokenRef.current = token;

      let audio: Blob | null = null;
      try {
        audio = await getAudioForPlan(planId);
      } catch {
        // Treated identically to "missing" — bounce back.
      }
      if (!audio) {
        if (cancelled) return;
        bounceBack(
          router,
          "We couldn't find the audio for this plan. Upload again to start over.",
        );
        return;
      }
      audioRef.current = audio;

      // Pre-seed the row map so every scene shows "queued" on first paint.
      if (cancelled) return;
      setRows(() => {
        const seed = new Map<string, SceneRowState>();
        for (const s of plan.scenes) seed.set(s.id, { status: "queued" });
        return seed;
      });

      kickOff();
    }

    function kickOff() {
      const controller = new AbortController();
      abortRef.current = controller;
      setPhase({ kind: "running" });
      setComposePercent(null);

      const plan = planRef.current!;
      const audio = audioRef.current!;
      const token = tokenRef.current!;

      runRender({
        plan,
        audioBlob: audio,
        token,
        onEvent: handleEvent,
        signal: controller.signal,
      })
        .then(async (result) => {
          if (cancelled) return;
          setPhase({ kind: "done", result });
          await onRenderComplete(plan, result);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          if (isAbortError(err)) {
            setPhase({ kind: "cancelled" });
            return;
          }
          const message =
            err instanceof Error ? err.message : "Unknown render error.";
          const replicateUnreachable = looksLikeReplicateUnreachable(message);
          setPhase({
            kind: "error",
            kind2: replicateUnreachable ? "replicate-unreachable" : "generic",
            message,
          });
        });
    }

    go();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, handleEvent, router]);

  // ---- Cancel ----
  const onCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // ---- Re-run a single failed scene ----
  const onRerunScene = useCallback(
    (sceneId: string) => {
      const plan = planRef.current;
      const audio = audioRef.current;
      const token = tokenRef.current;
      if (!plan || !audio || !token) return;
      if (phase.kind === "running") return;

      // Reset the row for the scene we're re-running. Other rows stay as
      // whatever terminal state they were in (composed for survivors,
      // failed for any others — those users can re-run separately).
      setRows((prev: Map<string, SceneRowState>) => {
        const next = new Map(prev);
        next.set(sceneId, { status: "queued" });
        return next;
      });
      setComposePercent(null);

      const controller = new AbortController();
      abortRef.current = controller;
      setPhase({ kind: "running" });

      // rerunScenes regenerates the listed scenes from scratch. The
      // runner has no cross-call blob cache exposed to us (the
      // `existingSceneBlobs` param is documented as internal — see the
      // T10 source comments), so the non-listed scenes also get
      // re-synthesized as placeholders if they fail again. That's the
      // gap noted in the docblock; T13/T14 may add a blob cache.
      rerunScenes({
        plan,
        audioBlob: audio,
        token,
        sceneIds: [sceneId],
        onEvent: handleEvent,
        signal: controller.signal,
      })
        .then(async (result) => {
          setPhase({ kind: "done", result });
          await onRenderComplete(plan, result);
        })
        .catch((err: unknown) => {
          if (isAbortError(err)) {
            setPhase({ kind: "cancelled" });
            return;
          }
          const message =
            err instanceof Error ? err.message : "Unknown render error.";
          const replicateUnreachable = looksLikeReplicateUnreachable(message);
          setPhase({
            kind: "error",
            kind2: replicateUnreachable ? "replicate-unreachable" : "generic",
            message,
          });
        });
    },
    [handleEvent, phase.kind],
  );

  // ---- On completion: auto-download + history save ----
  async function onRenderComplete(plan: Plan, result: RenderResult) {
    // 1. Auto-download
    try {
      const url = URL.createObjectURL(result.mp4);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rhythmix-${plan.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.warn("render-progress: auto-download failed", err);
    }

    // 2. Save to IndexedDB via T12's history module — dynamic import so
    // this component still works before T12 lands.
    try {
      const mod = (await import("../../lib/history")) as unknown as {
        saveRender?: SaveRenderFn;
      };
      if (typeof mod.saveRender === "function") {
        await mod.saveRender(
          {
            planId: plan.id,
            theme: plan.theme,
            bpm: plan.bpm,
            aspect: plan.aspect,
            audioDurationSec: plan.audioDuration,
            sceneCount: plan.scenes.length,
            failedSceneIds: result.failedSceneIds,
          },
          result.mp4,
          result.thumbnail,
        );
      } else {
        console.info(
          "render-progress: history.saveRender not exported yet — skipping save (T12 will land it).",
        );
      }
    } catch (err) {
      // Module missing or save threw — either way we already downloaded.
      console.info(
        "render-progress: history save skipped (module missing or failed)",
        err,
      );
    }
  }

  // ---- Render branches ----

  if (phase.kind === "loading") {
    return (
      <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-rhythmix-bg">
        <div className="mx-auto w-full max-w-xl text-center">
          <p className="font-rhythmix-mono text-sm text-rhythmix-text-muted" aria-live="polite">
            {phase.message}
          </p>
        </div>
      </main>
    );
  }

  if (phase.kind === "error" && phase.kind2 === "replicate-unreachable") {
    return (
      <ReplicateUnreachable
        onRetry={() => {
          // Re-mounting the whole hydrate effect is the cleanest way to
          // retry. We do that by force-refresh: clear rows, set loading,
          // and run kickOff via the existing refs.
          setRows(new Map());
          setComposePercent(null);
          setPhase({ kind: "loading", message: "Retrying…" });
          // Defer one tick so the loading state paints first.
          queueMicrotask(() => {
            if (!planRef.current || !audioRef.current || !tokenRef.current) {
              // Shouldn't happen — refs were populated on first load.
              router.push("/new");
              return;
            }
            const controller = new AbortController();
            abortRef.current = controller;
            setPhase({ kind: "running" });
            runRender({
              plan: planRef.current,
              audioBlob: audioRef.current,
              token: tokenRef.current,
              onEvent: handleEvent,
              signal: controller.signal,
            })
              .then(async (result) => {
                setPhase({ kind: "done", result });
                await onRenderComplete(planRef.current!, result);
              })
              .catch((err: unknown) => {
                if (isAbortError(err)) {
                  setPhase({ kind: "cancelled" });
                  return;
                }
                const m =
                  err instanceof Error ? err.message : "Unknown render error.";
                setPhase({
                  kind: "error",
                  kind2: looksLikeReplicateUnreachable(m)
                    ? "replicate-unreachable"
                    : "generic",
                  message: m,
                });
              });
          });
        }}
      />
    );
  }

  if (phase.kind === "error") {
    return (
      <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-rhythmix-bg">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="mb-2 font-rhythmix-display text-3xl font-black tracking-tight text-rhythmix-text">
            Render failed
          </h1>
          <p className="mb-6 text-sm text-rhythmix-magenta break-words" role="alert">
            {phase.message}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(`/plan/${planId}`)}
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta px-6 py-3 text-base font-semibold text-rhythmix-text hover:bg-rhythmix-pink transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)] sm:w-auto"
              style={{ minHeight: "44px" }}
            >
              Back to plan
            </button>
          </div>
        </div>
      </main>
    );
  }

  const plan = planRef.current;
  if (!plan) {
    // Defensive — shouldn't happen because the loading branch above
    // guards on plan presence, but the type system doesn't know that.
    return null;
  }

  const isRunning = phase.kind === "running";
  const isDone = phase.kind === "done";
  const isCancelled = phase.kind === "cancelled";

  // Per-scene re-run is only enabled when the render is *not* currently
  // running. We disable it during in-flight renders to prevent the user
  // from clobbering a running pipeline with another.
  const rerunHandler = isRunning ? undefined : onRerunScene;

  return (
    <main className="min-h-screen w-full px-4 pb-32 pt-8 sm:px-6 sm:pt-12 bg-rhythmix-bg">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="font-rhythmix-display text-3xl font-black tracking-tight text-rhythmix-text sm:text-4xl">
            Rendering
          </h1>
          <p className="mt-2 font-rhythmix-mono text-xs uppercase tracking-wider text-rhythmix-text-muted">
            {plan.scenes.length} scenes · {plan.audioDuration.toFixed(1)}s ·{" "}
            {plan.bpm ? `${plan.bpm} BPM` : "no BPM"} · {plan.aspect}
          </p>
          {isCancelled && (
            <p
              className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-rhythmix-warn/40 bg-[var(--color-rhythmix-warn-soft)] px-3 py-2 text-xs text-rhythmix-warn"
              role="status"
            >
              Render cancelled. Head back to the plan to try again.
            </p>
          )}
          {isDone && (
            <p
              className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-rhythmix-green/40 bg-[var(--color-rhythmix-ok-soft)] px-3 py-2 text-xs text-rhythmix-green"
              role="status"
            >
              Render done. Your MP4 downloaded automatically.
              {phase.kind === "done" &&
                phase.result.failedSceneIds.length > 0 && (
                  <>
                    {" "}
                    {phase.result.failedSceneIds.length} scene
                    {phase.result.failedSceneIds.length === 1 ? "" : "s"} used a
                    placeholder — use the per-scene Re-run buttons below.
                  </>
                )}
            </p>
          )}
        </header>

        {composePercent !== null && (
          <div className="mb-6">
            <ComposeBar percent={composePercent} />
          </div>
        )}

        <ScenesTable
          scenes={plan.scenes}
          rows={rows}
          onRerun={rerunHandler}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rhythmix-border-strong bg-[color:var(--color-rhythmix-bg)]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3">
          {isRunning ? (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-rhythmix-md)] border border-rhythmix-magenta/50 bg-transparent px-6 py-3 text-base font-semibold text-rhythmix-magenta hover:bg-[var(--color-rhythmix-danger-soft)] transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)] sm:w-auto"
              style={{ minHeight: "44px" }}
              data-testid="cancel-render"
            >
              Cancel render
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/library")}
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta px-6 py-3 text-base font-semibold text-rhythmix-text hover:bg-rhythmix-pink transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)] sm:w-auto"
              style={{ minHeight: "44px" }}
            >
              Back to library
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default RenderProgress;

// ---------- Helpers ----------

function bounceBack(
  router: ReturnType<typeof useRouter>,
  reason: string,
): void {
  // Persist a short-lived error so `/new` can show it as a toast/banner.
  // sessionStorage so it auto-clears on tab close.
  try {
    sessionStorage.setItem("rhythmix:new:error", reason);
  } catch {
    /* private mode — bouncing without the message is acceptable */
  }
  router.replace("/new");
}

function isAbortError(err: unknown): boolean {
  return Boolean(
    err &&
      typeof err === "object" &&
      (err as { name?: string }).name === "AbortError",
  );
}

/**
 * Heuristic match for "Replicate is unreachable" — the runner sanitizes
 * error messages to UI-safe strings before they hit us, so we can rely on
 * substrings here without fear of leaking the user's token.
 */
function looksLikeReplicateUnreachable(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("failed to fetch") ||
    m.includes("networkerror") ||
    m.includes("network error") ||
    m.includes("ecconnrefused") ||
    m.includes("etimedout") ||
    m.includes("err_network") ||
    m.includes("replicate start failed: 5") ||
    m.includes("replicate poll failed: 5")
  );
}
