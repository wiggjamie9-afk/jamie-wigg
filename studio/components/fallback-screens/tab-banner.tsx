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
      className="sticky top-0 z-50 w-full bg-amber-50 dark:bg-amber-950/80 border-b border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm font-medium">
          Studio is open in another tab. Renders cost real money — make sure
          you only run them from one.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onUseThis}
            className="px-3 py-1.5 rounded-md bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-900 text-xs font-medium hover:opacity-90 transition"
            data-testid="tab-banner-use-this"
          >
            Use this tab
          </button>
          <button
            type="button"
            onClick={onCloseOther}
            className="px-3 py-1.5 rounded-md border border-amber-700 dark:border-amber-300 text-amber-900 dark:text-amber-100 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900 transition"
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
