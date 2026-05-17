"use client";

/**
 * Fallback screen for when `ffmpeg.wasm` fails to load — typically because
 * the browser blocked the WASM fetch, COOP/COEP headers are off, or the
 * user is on a build that lacks the SharedArrayBuffer support `ffmpeg.wasm`
 * needs. We can't recover gracefully; the only realistic fix from the
 * user's side is "different browser or reload".
 *
 * Used by the render pipeline once it tries to instantiate ffmpeg.wasm; not
 * wired into the root layout.
 *
 * Satisfies R13.
 */

export interface FfmpegLoadFailedProps {
  /** Optional underlying error message to surface for support / debugging. */
  error?: string;
}

export function FfmpegLoadFailed({ error }: FfmpegLoadFailedProps) {
  return (
    <section
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center bg-starlightmix-bg"
      role="alert"
      aria-live="polite"
      data-testid="ffmpeg-load-failed"
    >
      <div className="max-w-md min-w-0">
        <p className="font-starlightmix-mono text-xs uppercase tracking-[0.3em] text-starlightmix-text-muted">
          Video engine failed to start
        </p>
        <h2 className="mt-3 font-starlightmix-display text-2xl sm:text-3xl font-black tracking-tight text-starlightmix-text">
          ffmpeg.wasm failed to load
        </h2>
        <p className="mt-4 text-base text-starlightmix-text-soft">
          Try a different browser or reload the page. Studio uses
          ffmpeg.wasm to assemble your video entirely in the browser, so the
          page can&apos;t continue without it.
        </p>

        {error ? (
          <details className="mt-6 text-left text-xs text-starlightmix-text-muted">
            <summary className="cursor-pointer select-none font-starlightmix-mono uppercase tracking-wider text-starlightmix-cyan">
              Technical details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words rounded-[var(--radius-rhythmix-sm)] border border-starlightmix-border-strong bg-starlightmix-deep p-3 font-starlightmix-mono text-starlightmix-text-soft">
              {error}
            </pre>
          </details>
        ) : null}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta text-starlightmix-text text-sm font-semibold hover:bg-starlightmix-pink transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            data-testid="ffmpeg-load-failed-reload"
          >
            Reload page
          </button>
        </div>
      </div>
    </section>
  );
}

export default FfmpegLoadFailed;
