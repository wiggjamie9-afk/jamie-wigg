"use client";

/**
 * Fallback screen for when `api.replicate.com` is not reachable from the
 * browser — either the user is offline, on a captive-portal network, or
 * Replicate itself is down. Surfaces the Replicate status page so the user
 * can disambiguate which one it is, and a retry button so they don't have
 * to refresh the whole app once the network is back.
 *
 * Used by the render-runner; not wired into the root layout (the spec
 * explicitly says `probeReplicateReachable` is opt-in).
 *
 * Satisfies R13.
 */

export interface ReplicateUnreachableProps {
  onRetry: () => void;
}

export function ReplicateUnreachable({ onRetry }: ReplicateUnreachableProps) {
  return (
    <section
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center"
      role="alert"
      aria-live="polite"
      data-testid="replicate-unreachable"
    >
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Network problem
        </p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
          Can&apos;t reach Replicate
        </h2>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-300">
          Check{" "}
          <a
            href="https://status.replicate.com"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2 hover:text-black dark:hover:text-white"
          >
            status.replicate.com
          </a>{" "}
          or your internet connection, then retry.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
            data-testid="replicate-unreachable-retry"
          >
            Retry
          </button>
          <a
            href="https://status.replicate.com"
            target="_blank"
            rel="noreferrer noopener"
            className="px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
          >
            Replicate status
          </a>
        </div>
      </div>
    </section>
  );
}

export default ReplicateUnreachable;
