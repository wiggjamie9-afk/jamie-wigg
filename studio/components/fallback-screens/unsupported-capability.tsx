import type { CapabilityReport } from "@/lib/capability-detect";

/**
 * Fallback screen shown at `/unsupported` when the runtime is missing one
 * of the capabilities Studio needs. The `missing` prop indicates which one
 * the user should be told about; per spec, we pick a single capability
 * (the first missing one) rather than dumping the full report.
 *
 * Satisfies R13.
 */

const CODESPACES_FALLBACK_URL =
  "https://github.com/wiggjamie9-afk/jamie-wigg/blob/main/rhythmix-studio/README.md#no-computer-run-it-in-your-browser-via-github-codespaces";

interface Copy {
  title: string;
  body: string;
  blocking: boolean;
}

const COPY: Record<keyof CapabilityReport, Copy> = {
  webCrypto: {
    title: "WebCrypto isn't available in this browser",
    body: "Your browser is missing WebCrypto support, which we need to encrypt your Replicate token. Try the latest Safari, Chrome, or Firefox.",
    blocking: true,
  },
  indexedDb: {
    title: "IndexedDB is disabled in this browser",
    body: "Your browser has IndexedDB disabled — usually private browsing mode in Safari. Disable private browsing or switch browsers.",
    blocking: true,
  },
  webAssembly: {
    title: "WebAssembly isn't supported in this browser",
    body: "Your browser doesn't support WebAssembly. The video composition runs entirely in your browser via WebAssembly. Use a modern browser.",
    blocking: true,
  },
  broadcastChannel: {
    title: "Heads up: second-tab detection is unavailable",
    body: "Your browser doesn't support BroadcastChannel, so we can't warn you if Studio is open in another tab. The app will still run — just keep an eye on which tab you're rendering in.",
    blocking: false,
  },
};

export interface UnsupportedCapabilityProps {
  missing: keyof CapabilityReport;
}

export function UnsupportedCapability({ missing }: UnsupportedCapabilityProps) {
  const copy = COPY[missing];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-starlightmix-bg"
      role="alert"
      aria-live="polite"
      data-testid="unsupported-capability"
      data-capability={missing}
    >
      <div className="max-w-md min-w-0">
        <p className="font-starlightmix-mono text-xs uppercase tracking-[0.3em] text-starlightmix-text-muted">
          {copy.blocking ? "Browser not supported" : "Limited support"}
        </p>
        <h1 className="mt-3 font-starlightmix-display text-3xl sm:text-4xl font-black tracking-tight slm-text-gradient">
          {copy.title}
        </h1>
        <p className="mt-4 text-base text-starlightmix-text-soft">
          {copy.body}
        </p>

        {copy.blocking ? (
          <div className="mt-8 space-y-3">
            <a
              href={CODESPACES_FALLBACK_URL}
              target="_blank"
              rel="noreferrer noopener"
              role="button"
              className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta text-starlightmix-text text-sm font-semibold hover:bg-starlightmix-pink transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
            >
              Use the CLI instead (Codespaces)
            </a>
            <p className="text-xs text-starlightmix-text-muted">
              No computer? Run the CLI in your browser via GitHub Codespaces.
              Free for 60 hours/month on any GitHub account.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default UnsupportedCapability;
