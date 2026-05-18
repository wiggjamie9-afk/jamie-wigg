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
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center bg-starlightmix-bg"
      role="alert"
      aria-live="polite"
      data-testid="replicate-unreachable"
    >
      <div className="max-w-md min-w-0">
        <p className="font-starlightmix-mono text-xs uppercase tracking-[0.3em] text-starlightmix-text-muted">
          Network problem
        </p>
        <h2 className="mt-3 font-starlightmix-display text-2xl sm:text-3xl font-black tracking-tight text-starlightmix-text">
          Can&apos;t reach Replicate
        </h2>
        <p className="mt-4 text-base text-starlightmix-text-soft">
          Check{" "}
          <a
            href="https://status.replicate.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-starlightmix-cyan underline underline-offset-2 hover:text-starlightmix-pink"
          >
            status.replicate.com
          </a>{" "}
          or your internet connection, then retry.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta text-starlightmix-text text-sm font-semibold hover:bg-starlightmix-pink transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            data-testid="replicate-unreachable-retry"
          >
            Retry
          </button>
          <a
            href="https://status.replicate.com"
            target="_blank"
            rel="noreferrer noopener"
            role="button"
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-transparent text-sm font-medium text-starlightmix-text-soft hover:bg-starlightmix-surface-2 hover:text-starlightmix-text transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          >
            Replicate status
          </a>
        </div>
      </div>
    </section>
  );
}

export default ReplicateUnreachable;
