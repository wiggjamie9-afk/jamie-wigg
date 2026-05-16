"use client";

/**
 * Banner shown when another Studio tab is detected on the same origin.
 * Both tabs see this banner; the two actions give the user a clear choice:
 *
 *   "Use this tab"      — dismiss the banner here. The user is telling us
 *                          this is the tab they want to keep working in.
 *   "Close other tab"   — broadcast a request to siblings to close. Today
 *                          we can't force a close from a peer tab (browsers
 *                          block `window.close()` on tabs we didn't open),
 *                          so the consumer wires this to a no-op or a
 *                          "please close the other tab manually" toast.
 *
 * Satisfies R14.
 */

export interface TabBannerProps {
  onUseThis: () => void;
  onCloseOther: () => void;
}

export function TabBanner({ onUseThis, onCloseOther }: TabBannerProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      data-testid="tab-banner"
      className="sticky top-0 z-50 w-full bg-[var(--color-rhythmix-warn-soft)] border-b border-rhythmix-warn/40 text-rhythmix-warn"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm font-medium text-rhythmix-text-soft break-words">
          Studio is open in another tab. Renders cost real money — make sure
          you only run them from one.
        </p>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={onUseThis}
            className="inline-flex min-h-[44px] items-center justify-center px-4 py-2 rounded-[var(--radius-rhythmix-md)] bg-rhythmix-warn text-rhythmix-bg text-xs font-semibold uppercase tracking-wider font-rhythmix-mono hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-opacity duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
            data-testid="tab-banner-use-this"
          >
            Use this tab
          </button>
          <button
            type="button"
            onClick={onCloseOther}
            className="inline-flex min-h-[44px] items-center justify-center px-4 py-2 rounded-[var(--radius-rhythmix-md)] border border-rhythmix-warn/50 bg-transparent text-rhythmix-warn text-xs font-semibold uppercase tracking-wider font-rhythmix-mono hover:bg-[var(--color-rhythmix-warn-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
            data-testid="tab-banner-close-other"
          >
            Close other tab
          </button>
        </div>
      </div>
    </div>
  );
}

export default TabBanner;
