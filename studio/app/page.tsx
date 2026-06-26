import Link from "next/link";

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-starlightmix-bg">
      {/* Navigation */}
      <nav aria-label="Primary" className="absolute top-0 right-0 m-6 flex gap-4">
        <Link
          href="/pricing"
          className="text-sm font-semibold text-starlightmix-text-soft hover:text-starlightmix-text transition"
        >
          Pricing
        </Link>
        <Link
          href="/new"
          className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition"
        >
          Studio
        </Link>
      </nav>

      <h1 className="font-starlightmix-display text-5xl sm:text-7xl font-black tracking-tight slm-text-gradient">
        STARLIGHTMIX
      </h1>
      <p className="mt-6 font-starlightmix-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-starlightmix-text-faint">
        AI Music Video Generation
      </p>
      <p className="mt-4 max-w-lg text-starlightmix-text text-lg">
        Upload a track, pick a visual theme, get an AI-generated music video — all in your browser.
      </p>

      <div className="mt-12 flex gap-4">
        <Link
          href="/new"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
        >
          Create Your Video
        </Link>
        <Link
          href="/pricing"
          className="px-8 py-3 rounded-lg border border-slate-600 text-slate-300 font-semibold hover:border-slate-500 hover:text-white transition"
        >
          View Pricing
        </Link>
      </div>
    </main>
  );
}
