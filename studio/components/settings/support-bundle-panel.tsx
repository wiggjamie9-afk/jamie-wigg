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
      className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="support-bundle-heading"
          className="text-lg font-semibold text-neutral-900"
        >
          Export support bundle
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          A JSON snapshot you can attach to your Gumroad receipt reply when
          something&rsquo;s broken.
        </p>
      </header>

      <button
        type="button"
        onClick={() => void handleExport()}
        disabled={busy}
        className="min-h-[44px] rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-neutral-700"
      >
        {busy ? "Building bundle…" : "Export support bundle"}
      </button>

      <p className="mt-3 text-xs text-neutral-500">
        Bundle excludes your Replicate token, audio, and rendered videos.
        It contains: browser info, capability flags, plan metadata, render
        history metadata, and the recent error log.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          {info}
        </p>
      ) : null}
    </section>
  );
}
