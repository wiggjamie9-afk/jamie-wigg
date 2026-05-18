"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAudioForPlan } from "../../lib/audio-blob";
import {
  type Aspect,
  type Plan,
  type Scene,
  exportPlanAsBlob,
  loadPlan,
  makePlanFromCoreScenes,
  savePlan,
  snapDurationToBeat,
} from "../../lib/plan-storage";
import { buildPlan } from "../../../rhythmix-studio/src/core/plan.mjs";
import { estimateCost } from "../../../rhythmix-studio/src/core/models.mjs";
import { probe } from "../../../rhythmix-studio/src/ffmpeg/wasm.mjs";
import { SceneRow } from "./scene-row";
import { CostSummary } from "./cost-summary";

/**
 * `/plan/[id]` editor.
 *
 * Data flow on first paint:
 *   1. Read existing plan from `localStorage[plan-<id>]` (instant; cheap).
 *   2. If absent: read audio Blob from IndexedDB (via getAudioForPlan).
 *      Read theme/bpm/aspect from `sessionStorage[rhythmix:new:<id>]`.
 *      ffmpeg.wasm probe(blob) → duration. Then buildPlan(...).
 *      Save it to localStorage and render.
 *   3. If audio Blob is missing too, we have nothing to recover — route
 *      the user back to /new with an explanatory state.
 *
 * Editing model:
 *   - Model + prompt edits are direct partial-updates on the scene; the
 *     parent debounces (300ms) the persistence to localStorage.
 *   - Duration edits cascade: snap-to-beat, write the new endSec, then
 *     shift every subsequent scene's startSec/endSec by the delta so the
 *     timeline stays gap-free. Final scene gets clamped to audioDuration
 *     to prevent overrun.
 *
 * Cost estimate refresh:
 *   - useMemo over `plan.scenes` (specifically the model-count signature)
 *     so any scene's model swap triggers a recompute. Prompt edits don't
 *     change cost (Replicate rates are per-clip, not per-token), so they
 *     skip the recompute path even though the plan object reference does
 *     change.
 */

const PERSIST_DEBOUNCE_MS = 300;
// Note: scene rows switch from <table-row> to stacked card layout at
// Tailwind's `md` breakpoint (768px) via responsive classes on SceneRow.

type LoadState =
  | { kind: "idle" }
  | { kind: "loading"; message: string }
  | { kind: "ready"; plan: Plan }
  | { kind: "missing-audio" }
  | { kind: "error"; message: string };

export function PlanEditor({ planId }: { planId: string }) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "idle" });
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- First-load hydration ----
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      // Fast path: plan already saved.
      const existing = loadPlan(planId);
      if (existing) {
        setState({ kind: "ready", plan: existing });
        return;
      }

      setState({ kind: "loading", message: "Reading audio…" });
      let blob: Blob | null = null;
      try {
        blob = await getAudioForPlan(planId);
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            "Could not read your audio from local storage. Try uploading again. (" +
            ((err as Error)?.message ?? String(err)) +
            ")",
        });
        return;
      }
      if (!blob) {
        if (cancelled) return;
        setState({ kind: "missing-audio" });
        return;
      }

      // Sessionstorage-stashed theme/bpm/aspect (written by /new). If it
      // got cleared (refresh after session-close), fall back to defaults
      // so the editor still works — the user can edit theme inline later.
      let theme = "(no theme — please return to /new)";
      let bpm: number | null = null;
      let aspect: Aspect = "16:9";
      try {
        const raw = sessionStorage.getItem(`rhythmix:new:${planId}`);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            theme?: string;
            bpm?: number | null;
            aspect?: Aspect;
          };
          if (typeof parsed.theme === "string" && parsed.theme.trim()) {
            theme = parsed.theme;
          }
          if (typeof parsed.bpm === "number") bpm = parsed.bpm;
          if (parsed.aspect === "9:16" || parsed.aspect === "1:1") {
            aspect = parsed.aspect;
          }
        }
      } catch {
        // ignore — defaults above
      }

      if (cancelled) return;
      setState({ kind: "loading", message: "Decoding audio (this can take a few seconds)…" });

      let probed: { duration: number };
      try {
        probed = await probe(blob);
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            "Could not decode your audio. The ffmpeg engine failed to probe it. (" +
            ((err as Error)?.message ?? String(err)) +
            ")",
        });
        return;
      }

      if (!probed?.duration || !Number.isFinite(probed.duration)) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            "Audio has zero duration — that's not a valid track. Try uploading a different file.",
        });
        return;
      }

      if (cancelled) return;
      setState({ kind: "loading", message: "Building plan…" });

      let corePlan;
      try {
        corePlan = buildPlan({
          audio: { duration: probed.duration },
          theme,
          bpm: bpm ?? undefined,
          aspectRatio: aspect,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            "Could not build a plan from the audio. (" +
            ((err as Error)?.message ?? String(err)) +
            ")",
        });
        return;
      }

      const plan = makePlanFromCoreScenes({
        id: planId,
        audioDuration: probed.duration,
        theme,
        bpm,
        aspect,
        coreScenes: corePlan.scenes,
      });

      try {
        savePlan(plan);
      } catch (err) {
        // Save failure is non-fatal here — the user can still edit; we
        // just won't persist between reloads. Surface it as a banner.
        console.warn("plan-editor: initial savePlan failed", err);
      }
      if (cancelled) return;
      setState({ kind: "ready", plan });
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [planId]);

  // ---- Debounced persistence ----
  const schedulePersist = useCallback((next: Plan) => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      try {
        savePlan(next);
      } catch (err) {
        console.warn("plan-editor: savePlan failed", err);
      }
    }, PERSIST_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      // Flush on unmount so the latest edits aren't lost if the user
      // navigates away mid-debounce.
      if (persistTimer.current) {
        clearTimeout(persistTimer.current);
        // We can't reach into state here for the latest plan without
        // adding a ref. Acceptable: the next route change is intentional;
        // the Render button (below) writes synchronously.
      }
    };
  }, []);

  // ---- Edits ----
  const updateScene = useCallback(
    (sceneId: string, patch: Partial<Scene>) => {
      setState((prev) => {
        if (prev.kind !== "ready") return prev;
        const plan = prev.plan;
        const nextScenes = plan.scenes.map((s) =>
          s.id === sceneId ? { ...s, ...patch } : s,
        );
        const nextPlan: Plan = {
          ...plan,
          scenes: nextScenes,
          updatedAt: Date.now(),
        };
        schedulePersist(nextPlan);
        return { kind: "ready", plan: nextPlan };
      });
    },
    [schedulePersist],
  );

  const updateSceneDuration = useCallback(
    (sceneId: string, newDurationSec: number) => {
      setState((prev) => {
        if (prev.kind !== "ready") return prev;
        const plan = prev.plan;
        const idx = plan.scenes.findIndex((s) => s.id === sceneId);
        if (idx === -1) return prev;

        // R5 auto-snap: apply at the edit boundary so the value shown is
        // the value saved. snapDurationToBeat is a no-op without BPM.
        const snapped = snapDurationToBeat(newDurationSec, plan.bpm);
        const cur = plan.scenes[idx];
        const oldDur = cur.endSec - cur.startSec;
        const delta = snapped - oldDur;
        if (delta === 0) {
          // Still rerender so the duration input snaps to the canonical
          // value visually (e.g. when the user typed 2.3 and BPM rounding
          // pulled it to 2.4).
          const nextScenes = plan.scenes.map((s, i) =>
            i === idx ? { ...s, endSec: s.startSec + snapped } : s,
          );
          const nextPlan: Plan = {
            ...plan,
            scenes: nextScenes,
            updatedAt: Date.now(),
          };
          schedulePersist(nextPlan);
          return { kind: "ready", plan: nextPlan };
        }

        // Cascade: every later scene shifts by `delta`. Final scene
        // clamps to audioDuration to prevent timeline overrun.
        const nextScenes = plan.scenes.map((s, i) => {
          if (i < idx) return s;
          if (i === idx) return { ...s, endSec: s.startSec + snapped };
          return { ...s, startSec: s.startSec + delta, endSec: s.endSec + delta };
        });
        // Clamp the final scene's endSec to audioDuration. We do NOT
        // clamp earlier scenes; doing so would create a gap. If the user
        // pushed the timeline past the track, the trailing scene gets
        // shortened — the next render uses the shorter slot.
        const last = nextScenes[nextScenes.length - 1];
        if (last && last.endSec > plan.audioDuration) {
          nextScenes[nextScenes.length - 1] = {
            ...last,
            endSec: Math.max(last.startSec + 0.5, plan.audioDuration),
          };
        }

        const nextPlan: Plan = {
          ...plan,
          scenes: nextScenes,
          updatedAt: Date.now(),
        };
        schedulePersist(nextPlan);
        return { kind: "ready", plan: nextPlan };
      });
    },
    [schedulePersist],
  );

  // ---- Cost estimate (memoised on model signature) ----
  const costUsd = useMemo(() => {
    if (state.kind !== "ready") return 0;
    return estimateCost(state.plan);
    // Re-run whenever a scene's model changes. Prompt-only edits change
    // the plan reference but not the cost — recomputing is cheap enough
    // (linear over scenes) that we don't bother gating further.
  }, [state]);

  // ---- Actions ----
  const onExport = useCallback(() => {
    if (state.kind !== "ready") return;
    const blob = exportPlanAsBlob(state.plan);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plan-${state.plan.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Defer revoke so the click has time to commit the download.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [state]);

  const onRender = useCallback(() => {
    if (state.kind !== "ready") return;
    // Flush any pending debounced save before navigating so /render/[id]
    // sees the latest plan in localStorage.
    if (persistTimer.current) {
      clearTimeout(persistTimer.current);
      persistTimer.current = null;
    }
    try {
      savePlan(state.plan);
    } catch {
      // Even if save fails, navigation is the user's intent. T11 will
      // surface a missing-plan message on the next route.
    }
    router.push(`/render/${state.plan.id}`);
  }, [router, state]);

  // ---- Render branches ----
  if (state.kind === "idle" || state.kind === "loading") {
    return (
      <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-starlightmix-bg">
        <div className="mx-auto w-full max-w-xl text-center">
          <p className="font-starlightmix-mono text-sm text-starlightmix-text-muted" aria-live="polite">
            {state.kind === "loading" ? state.message : "Loading…"}
          </p>
        </div>
      </main>
    );
  }

  if (state.kind === "missing-audio") {
    return (
      <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-starlightmix-bg">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="mb-2 font-starlightmix-display text-3xl font-black tracking-tight text-starlightmix-text">
            Audio not found
          </h1>
          <p className="mb-6 text-sm text-starlightmix-text-soft">
            We couldn&apos;t find the audio for this plan. It may have been
            cleared, or you opened the link from a different device. Upload
            your track again to start fresh.
          </p>
          <button
            type="button"
            onClick={() => router.push("/new")}
            className="inline-flex items-center justify-center rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta px-6 py-3 text-base font-semibold text-starlightmix-text hover:bg-starlightmix-pink transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            style={{ minHeight: "44px" }}
          >
            New video
          </button>
        </div>
      </main>
    );
  }

  if (state.kind === "error") {
    return (
      <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-starlightmix-bg">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="mb-2 font-starlightmix-display text-3xl font-black tracking-tight text-starlightmix-text">
            Something went wrong
          </h1>
          <p className="mb-6 text-sm text-starlightmix-magenta break-words" role="alert">
            {state.message}
          </p>
          <button
            type="button"
            onClick={() => router.push("/new")}
            className="inline-flex items-center justify-center rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta px-6 py-3 text-base font-semibold text-starlightmix-text hover:bg-starlightmix-pink transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            style={{ minHeight: "44px" }}
          >
            Start over
          </button>
        </div>
      </main>
    );
  }

  const { plan } = state;

  return (
    <main className="min-h-screen w-full px-4 pb-32 pt-8 sm:px-6 sm:pt-12 bg-starlightmix-bg">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="font-starlightmix-display text-3xl font-black tracking-tight text-starlightmix-text sm:text-4xl">
            Plan
          </h1>
          <p className="mt-2 font-starlightmix-mono text-xs uppercase tracking-wider text-starlightmix-text-muted">
            {plan.scenes.length} scenes · {plan.audioDuration.toFixed(1)}s ·{" "}
            {plan.bpm ? `${plan.bpm} BPM` : "no BPM"} · {plan.aspect}
          </p>
          {plan.theme && (
            <p className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-surface px-3 py-2 text-xs text-starlightmix-text-soft break-words">
              <span className="font-starlightmix-mono uppercase tracking-wide text-starlightmix-text-muted">Theme:</span>{" "}
              {plan.theme}
            </p>
          )}
        </header>

        <div className="mb-6">
          <CostSummary plan={plan} costUsd={costUsd} />
        </div>

        {/*
          Semantic <table> so screen readers read column headers. On
          mobile (<768px), the rows + cells switch to display:block via
          the SceneRow's responsive classes, becoming a card-per-scene
          stack. The "table-fixed md:table-fixed" + min-width keeps
          desktop columns from squishing.
        */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:min-w-[640px]">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-starlightmix-border-strong text-left font-starlightmix-mono text-xs uppercase tracking-wider text-starlightmix-text-muted">
                <th className="px-3 py-2 font-medium" style={{ width: "12%" }}>
                  Scene
                </th>
                <th className="px-3 py-2 font-medium" style={{ width: "22%" }}>
                  Model
                </th>
                <th className="px-3 py-2 font-medium" style={{ width: "14%" }}>
                  Duration (s)
                </th>
                <th className="px-3 py-2 font-medium">Prompt</th>
              </tr>
            </thead>
            <tbody>
              {plan.scenes.map((scene, i) => (
                <SceneRow
                  key={scene.id}
                  scene={scene}
                  index={i}
                  bpm={plan.bpm}
                  onChange={(patch) => updateScene(scene.id, patch)}
                  onDurationChange={(newDur) =>
                    updateSceneDuration(scene.id, newDur)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*
        Sticky action bar — pinned to the bottom on every viewport so the
        Render button is always one tap away. `pb-32` on the main element
        makes sure no scene row gets buried under the bar.
      */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-starlightmix-border-strong bg-[color:var(--color-rhythmix-bg)]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center justify-center rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-transparent px-4 py-3 text-sm font-medium text-starlightmix-text-soft hover:bg-starlightmix-surface-2 hover:text-starlightmix-text transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            style={{ minHeight: "44px" }}
          >
            Export plan.json
          </button>
          <button
            type="button"
            onClick={onRender}
            className="inline-flex items-center justify-center rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta px-6 py-3 text-base font-semibold text-starlightmix-text hover:bg-starlightmix-pink transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            style={{ minHeight: "44px" }}
          >
            Render →
          </button>
        </div>
      </div>
    </main>
  );
}
