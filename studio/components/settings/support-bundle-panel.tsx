"use client";

/**
 * Support-bundle panel for /settings (R15).
 *
 * One-button affair: builds the JSON via `buildSupportBundle()` and triggers a
 * download via `downloadSupportBundle()`. The heavy lifting (exclusions,
 * payload shape, error-log buffering) lives in `lib/support-bundle.ts`; this
 * component just owns the click handler and the user-facing "what's in the
 * bundle?" copy.
 */

import { useCallback, useState } from "react";
import {
  buildSupportBundle,
  downloadSupportBundle,
} from "../../lib/support-bundle";

export function SupportBundlePanel() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const bundle = await buildSupportBundle();
      downloadSupportBundle(bundle);
      setInfo("Bundle downloaded. Attach it to your support reply.");
    } catch {
      setError("Couldn't assemble the support bundle. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <section
      aria-labelledby="support-bundle-heading"
      className="rounded-[var(--radius-rhythmix-lg)] border border-rhythmix-border-strong bg-rhythmix-surface p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="support-bundle-heading"
          className="font-rhythmix-display text-lg font-bold text-rhythmix-text"
        >
          Export support bundle
        </h2>
        <p className="mt-1 text-sm text-rhythmix-text-soft">
          A JSON snapshot you can attach to your Gumroad receipt reply when
          something&rsquo;s broken.
        </p>
      </header>

      <button
        type="button"
        onClick={() => void handleExport()}
        disabled={busy}
        className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta px-4 py-2 text-sm font-semibold text-rhythmix-text hover:bg-rhythmix-pink disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
      >
        {busy ? "Building bundle…" : "Export support bundle"}
      </button>

      <p className="mt-3 text-xs text-rhythmix-text-muted">
        Bundle excludes your Replicate token, audio, and rendered videos.
        It contains: browser info, capability flags, plan metadata, render
        history metadata, and the recent error log.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-rhythmix-magenta/40 bg-[var(--color-rhythmix-danger-soft)] px-3 py-2 text-sm text-rhythmix-magenta"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-rhythmix-border-strong bg-rhythmix-surface-2 px-3 py-2 text-sm text-rhythmix-text-soft">
          {info}
        </p>
      ) : null}
    </section>
  );
}
