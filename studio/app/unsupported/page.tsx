"use client";

/**
 * `/unsupported` — the landing page for users on a browser missing a
 * blocking capability (R13). Read the `?missing=<capability>` query param
 * and render the matching screen. If the query param is absent or invalid,
 * fall back to a generic "Unsupported browser" message — that handles the
 * case where someone navigates here directly without coming through the
 * `CapabilityGate`.
 *
 * This page is a client component because Next's static export (which
 * studio/next.config.ts uses) can't run server logic at request time, and
 * the query-param read is trivially client-only anyway.
 */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { CapabilityReport } from "@/lib/capability-detect";
import { UnsupportedCapability } from "@/components/fallback-screens/unsupported-capability";

const VALID_CAPABILITIES: ReadonlyArray<keyof CapabilityReport> = [
  "webCrypto",
  "indexedDb",
  "webAssembly",
  "broadcastChannel",
];

function isCapabilityKey(value: string): value is keyof CapabilityReport {
  return (VALID_CAPABILITIES as ReadonlyArray<string>).includes(value);
}

function UnsupportedPageInner() {
  const params = useSearchParams();
  const raw = params?.get("missing") ?? null;

  if (raw && isCapabilityKey(raw)) {
    return <UnsupportedCapability missing={raw} />;
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-rhythmix-bg"
      role="alert"
      aria-live="polite"
      data-testid="unsupported-generic"
    >
      <div className="max-w-md">
        <p className="font-rhythmix-mono text-xs uppercase tracking-[0.3em] text-rhythmix-text-muted">
          Browser not supported
        </p>
        <h1 className="mt-3 font-rhythmix-display text-3xl sm:text-4xl font-black tracking-tight rhx-text-gradient">
          Studio can&apos;t run on this browser
        </h1>
        <p className="mt-4 text-base text-rhythmix-text-soft">
          Studio needs a modern browser with WebCrypto, IndexedDB, and
          WebAssembly. Try the latest Safari, Chrome, or Firefox — or run
          the CLI in your browser via GitHub Codespaces.
        </p>
        <a
          href="https://github.com/wiggjamie9-afk/jamie-wigg/blob/main/rhythmix-studio/README.md#no-computer-run-it-in-your-browser-via-github-codespaces"
          target="_blank"
          rel="noreferrer noopener"
          role="button"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-lg bg-rhythmix-magenta text-rhythmix-text text-sm font-semibold hover:bg-rhythmix-pink transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
        >
          Use the CLI instead (Codespaces)
        </a>
      </div>
    </main>
  );
}

export default function UnsupportedPage() {
  // Suspense boundary is required by Next.js whenever `useSearchParams`
  // is called inside a statically-exported page — without it the build
  // fails with "should be wrapped in a suspense boundary".
  return (
    <Suspense fallback={null}>
      <UnsupportedPageInner />
    </Suspense>
  );
}
