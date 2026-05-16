"use client";

/**
 * Horizontal percent bar for the compose phase (T11, satisfies R6).
 *
 * The render-runner emits `compose:start` once, then a stream of
 * `compose:progress { percent }` events up to 100, then `compose:done`. We
 * render this bar only while a percent value is present — the parent
 * `<RenderProgress />` controls visibility by passing `percent | null`.
 *
 * Why a single dependent component (not just a `<progress>` element):
 *   - `<progress>` styling varies wildly across browsers and we want
 *     consistent visuals on iPhone Safari (R9 / R12).
 *   - We pair the bar with a short label ("Composing… 47%") so the user
 *     understands what phase they're in without re-reading the page.
 */

export interface ComposeBarProps {
  /** 0-100 inclusive; values outside the range are clamped. */
  percent: number;
}

export function ComposeBar({ percent }: ComposeBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label="Composing video"
      data-testid="compose-bar"
    >
      <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
        <span className="font-medium">Composing…</span>
        <span className="tabular-nums">{clamped}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full bg-neutral-900 transition-[width] duration-200 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default ComposeBar;
