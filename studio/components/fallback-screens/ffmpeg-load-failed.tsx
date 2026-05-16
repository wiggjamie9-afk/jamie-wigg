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
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center"
      role="alert"
      aria-live="polite"
      data-testid="ffmpeg-load-failed"
    >
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Video engine failed to start
        </p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
          ffmpeg.wasm failed to load
        </h2>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-300">
          Try a different browser or reload the page. Studio uses
          ffmpeg.wasm to assemble your video entirely in the browser, so the
          page can&apos;t continue without it.
        </p>

        {error ? (
          <details className="mt-6 text-left text-xs text-neutral-500">
            <summary className="cursor-pointer select-none">
              Technical details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-neutral-100 dark:bg-neutral-900 p-3 font-mono">
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
            className="px-5 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
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
