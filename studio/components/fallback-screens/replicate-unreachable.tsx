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
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center bg-rhythmix-bg"
      role="alert"
      aria-live="polite"
      data-testid="replicate-unreachable"
    >
      <div className="max-w-md min-w-0">
        <p className="font-rhythmix-mono text-xs uppercase tracking-[0.3em] text-rhythmix-text-muted">
          Network problem
        </p>
        <h2 className="mt-3 font-rhythmix-display text-2xl sm:text-3xl font-black tracking-tight text-rhythmix-text">
          Can&apos;t reach Replicate
        </h2>
        <p className="mt-4 text-base text-rhythmix-text-soft">
          Check{" "}
          <a
            href="https://status.replicate.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-rhythmix-cyan underline underline-offset-2 hover:text-rhythmix-pink"
          >
            status.replicate.com
          </a>{" "}
          or your internet connection, then retry.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta text-rhythmix-text text-sm font-semibold hover:bg-rhythmix-pink transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
            data-testid="replicate-unreachable-retry"
          >
            Retry
          </button>
          <a
            href="https://status.replicate.com"
            target="_blank"
            rel="noreferrer noopener"
            role="button"
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-[var(--radius-rhythmix-md)] border border-rhythmix-border-strong bg-transparent text-sm font-medium text-rhythmix-text-soft hover:bg-rhythmix-surface-2 hover:text-rhythmix-text transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          >
            Replicate status
          </a>
        </div>
      </div>
    </section>
  );
}

export default ReplicateUnreachable;
