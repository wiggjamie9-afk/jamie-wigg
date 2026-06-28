import Link from "next/link";

// Static export friendly.
export const dynamic = "force-static";

type Entry = {
  href: string;
  title: string;
  blurb: string;
  /** Accent colour token for the eyebrow + hover ring. */
  accent: "magenta" | "cyan" | "purple" | "gold";
  eyebrow: string;
};

const ENTRIES: Entry[] = [
  {
    href: "/new",
    title: "New video",
    blurb: "Upload a track, pick a look, get an AI music video.",
    accent: "magenta",
    eyebrow: "Music",
  },
  {
    href: "/podcasts",
    title: "Podcasts",
    blurb: "Turn a spoken episode into an audiogram — waveform over cover art.",
    accent: "cyan",
    eyebrow: "Audiogram",
  },
  {
    href: "/library",
    title: "Library",
    blurb: "Your past renders, stored locally on this device.",
    accent: "purple",
    eyebrow: "Saved",
  },
  {
    href: "/settings",
    title: "Settings",
    blurb: "Replicate token, license, and local data.",
    accent: "gold",
    eyebrow: "Setup",
  },
];

const ACCENT_EYEBROW: Record<Entry["accent"], string> = {
  magenta: "text-starlightmix-magenta",
  cyan: "text-starlightmix-cyan",
  purple: "text-starlightmix-purple",
  gold: "text-starlightmix-gold",
};

const ACCENT_HOVER: Record<Entry["accent"], string> = {
  magenta: "hover:border-starlightmix-magenta",
  cyan: "hover:border-starlightmix-cyan",
  purple: "hover:border-starlightmix-purple",
  gold: "hover:border-starlightmix-gold",
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full px-6 py-16 bg-starlightmix-bg">
      <div className="mx-auto w-full max-w-2xl">
        <header className="text-center">
          <h1 className="font-starlightmix-display text-5xl sm:text-7xl font-black tracking-tight slm-text-gradient">
            STARLIGHTMIX
          </h1>
          <p className="mt-4 font-starlightmix-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-starlightmix-text-muted">
            Studio · make it in your browser
          </p>
        </header>

        <nav className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className={[
                "group block rounded-[var(--radius-starlightmix-lg)] border border-starlightmix-border-strong bg-starlightmix-surface p-6 transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)] hover:bg-starlightmix-surface-2",
                ACCENT_HOVER[entry.accent],
              ].join(" ")}
            >
              <p
                className={[
                  "font-starlightmix-mono text-[0.65rem] uppercase tracking-[0.25em]",
                  ACCENT_EYEBROW[entry.accent],
                ].join(" ")}
              >
                {entry.eyebrow}
              </p>
              <h2 className="mt-2 font-starlightmix-display text-2xl font-black tracking-tight text-starlightmix-text">
                {entry.title}
              </h2>
              <p className="mt-2 text-sm text-starlightmix-text-soft">
                {entry.blurb}
              </p>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
