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
 * Tailwind classes per status — RHYTHMIX brand palette (T13 / R12). Pulls
 * from the signal-tone CSS custom properties in globals.css so every pill
 * inherits the same dark-surface treatment as the rest of the studio.
 * Queued = muted surface, generating = cyan info, downloaded = purple,
 * composed = green ok, failed = magenta danger.
 */
const STATUS_CLASSES: Record<SceneStatus, string> = {
  queued: "bg-rhythmix-surface-2 text-rhythmix-text-soft border-rhythmix-border-strong",
  generating: "bg-[var(--color-rhythmix-info-soft)] text-rhythmix-cyan border-rhythmix-cyan/40",
  downloaded: "bg-[color:var(--color-rhythmix-purple)]/15 text-rhythmix-purple border-rhythmix-purple/40",
  composed: "bg-[var(--color-rhythmix-ok-soft)] text-rhythmix-green border-rhythmix-green/40",
  failed: "bg-[var(--color-rhythmix-danger-soft)] text-rhythmix-magenta border-rhythmix-magenta/40",
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
      className="inline-flex flex-wrap items-center gap-2"
      data-testid={testId ?? `scene-status-${status}`}
    >
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-rhythmix-mono text-xs font-semibold uppercase tracking-wider ${classes}`}
      >
        <span aria-live="polite">{label}</span>
        {showAttempt && (
          <span className="ml-1.5 text-[10px] opacity-80 tabular-nums">
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
          className="inline-flex items-center justify-center rounded-[var(--radius-rhythmix-sm)] border border-rhythmix-magenta/50 bg-transparent px-3 text-xs font-semibold text-rhythmix-magenta hover:bg-[var(--color-rhythmix-danger-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
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
