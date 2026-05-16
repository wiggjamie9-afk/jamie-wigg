"use client";

/**
 * Visual status pill for a single scene in the render-progress view (T11,
 * satisfies R6).
 *
 * The pill is the smallest moving part of the render UI — it summarises one
 * scene's lifecycle state into a single colour-coded badge plus an optional
 * attempt counter (only meaningful during the "generating" phase) and a
 * "Re-run" affordance for the "failed" phase. We keep all five render-runner
 * scene statuses here so the component is closed under the
 * `RenderEvent` discriminated union — no parent ever has to translate.
 */

export type SceneStatus =
  | "queued"
  | "generating"
  | "downloaded"
  | "composed"
  | "failed";

export interface SceneStatusPillProps {
  status: SceneStatus;
  /** 1-based attempt counter during the "generating" phase (1, 2, or 3). */
  attempt?: number;
  /** Wall-clock seconds the scene has been in its current phase. */
  elapsedSec?: number;
  /**
   * Pass an `onRerun` callback iff this pill should expose a "Re-run" button
   * for a failed scene (R6 partial-failure handling). When the parent has no
   * way to re-run (e.g. a render in flight), omit the callback and the
   * button is suppressed.
   */
  onRerun?: () => void;
  /** Used by T14 tests + accessibility live regions. */
  "data-testid"?: string;
}

const STATUS_LABEL: Record<SceneStatus, string> = {
  queued: "Queued",
  generating: "Generating",
  downloaded: "Downloaded",
  composed: "Composed",
  failed: "Failed",
};

/**
 * Tailwind classes per status. We hand-roll the palette rather than reach
 * for `rhythmix-teaser-60s/DESIGN.md` tokens because the render UI is
 * functional / utilitarian; brand colour belongs on hero surfaces. Greys for
 * dormant phases, blue for active work, green for success, red for failure
 * — standard signal vocabulary, accessible against white and dark surfaces.
 */
const STATUS_CLASSES: Record<SceneStatus, string> = {
  queued: "bg-neutral-100 text-neutral-600 border-neutral-200",
  generating: "bg-blue-50 text-blue-700 border-blue-200",
  downloaded: "bg-indigo-50 text-indigo-700 border-indigo-200",
  composed: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export function SceneStatusPill({
  status,
  attempt,
  elapsedSec,
  onRerun,
  "data-testid": testId,
}: SceneStatusPillProps) {
  const label = STATUS_LABEL[status];
  const classes = STATUS_CLASSES[status];

  // Attempt counter is meaningful only during generation. We fix the
  // denominator at 3 because the runner's MAX_ATTEMPTS is hard-coded there;
  // surfacing it inline tells the user "we're still inside the retry
  // budget" so they don't panic on the first transient failure.
  const showAttempt =
    status === "generating" && typeof attempt === "number" && attempt >= 1;

  const showElapsed =
    typeof elapsedSec === "number" &&
    Number.isFinite(elapsedSec) &&
    elapsedSec >= 1 &&
    (status === "generating" || status === "downloaded");

  return (
    <span
      className="inline-flex items-center gap-2"
      data-testid={testId ?? `scene-status-${status}`}
    >
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}
      >
        <span aria-live="polite">{label}</span>
        {showAttempt && (
          <span className="ml-1.5 text-[10px] opacity-80">
            {attempt}/3
          </span>
        )}
        {showElapsed && (
          <span className="ml-1.5 text-[10px] opacity-80 tabular-nums">
            {Math.floor(elapsedSec as number)}s
          </span>
        )}
      </span>

      {status === "failed" && onRerun && (
        <button
          type="button"
          onClick={onRerun}
          // 44 px tall to satisfy R9's touch-target rule even at small font.
          className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-700 hover:bg-red-50 active:bg-red-100"
          style={{ minHeight: "44px" }}
          data-testid="scene-rerun"
        >
          Re-run
        </button>
      )}
    </span>
  );
}

export default SceneStatusPill;
