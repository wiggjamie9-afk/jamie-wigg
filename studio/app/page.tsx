"use client";

/**
 * Home / front door (replaces the old "scaffold. More to come." placeholder).
 *
 * Two states, decided by license:
 *   - No valid license  → paywall gate: value prop + Buy (Gumroad) + key entry.
 *   - Valid license     → dashboard: New video / Library / Settings.
 *
 * License state is read through `lib/license.ts` (the same cache the Settings
 * panel writes), so the two can never disagree. Rendering waits for mount to
 * avoid a server/client hydration mismatch on the localStorage read.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasValidLicense, validateLicense } from "../lib/license";

const GUMROAD_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GUMROAD_URL) ||
  "https://gumroad.com/l/REPLACE_ME";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [licensed, setLicensed] = useState(false);

  useEffect(() => {
    setLicensed(hasValidLicense());
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen w-full bg-starlightmix-bg px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <header className="text-center">
          <h1 className="font-starlightmix-display text-5xl font-black tracking-tight slm-text-gradient sm:text-6xl">
            STARLIGHTMIX
          </h1>
          <p className="mt-3 font-starlightmix-mono text-[0.7rem] uppercase tracking-[0.3em] text-starlightmix-text-muted">
            AI music video studio
          </p>
        </header>

        {/* Render a neutral shell until mounted so SSR and first client paint match. */}
        {!mounted ? (
          <div className="mt-12 h-40 animate-pulse rounded-2xl bg-starlightmix-surface/40" />
        ) : licensed ? (
          <Dashboard />
        ) : (
          <Gate />
        )}
      </div>
    </main>
  );
}

function Dashboard() {
  return (
    <section className="mt-12">
      <div className="grid gap-4">
        <DashCard
          href="/new"
          title="New video"
          desc="Upload a track, pick a look, render an AI music video."
          primary
        />
        <DashCard
          href="/library"
          title="Library"
          desc="Your finished renders, saved on this device."
        />
        <DashCard
          href="/settings"
          title="Settings"
          desc="Your Replicate token and license — both stay local."
        />
      </div>
    </section>
  );
}

function DashCard({
  href,
  title,
  desc,
  primary,
}: {
  href: string;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-2xl border p-5 transition-colors",
        primary
          ? "border-starlightmix-magenta/50 bg-starlightmix-surface hover:border-starlightmix-magenta"
          : "border-starlightmix-border-strong bg-starlightmix-surface/60 hover:border-starlightmix-cyan",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-starlightmix-display text-xl font-black text-starlightmix-text">
          {title}
        </h2>
        <span aria-hidden className="text-starlightmix-text-muted">
          →
        </span>
      </div>
      <p className="mt-1 text-sm text-starlightmix-text-soft">{desc}</p>
    </Link>
  );
}

function Gate() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock() {
    setBusy(true);
    setError(null);
    const result = await validateLicense(key);
    setBusy(false);
    if (result.valid) {
      router.push("/new");
    } else {
      setError(result.reason ?? "That key isn’t valid. Check your receipt.");
    }
  }

  return (
    <section className="mt-10">
      <p className="text-center text-base text-starlightmix-text-soft sm:text-lg">
        Turn any track into an AI music video — in your browser. Bring your own
        Replicate token, pay once, create forever.
      </p>

      <div className="mt-8 rounded-2xl border border-starlightmix-border-strong bg-starlightmix-surface p-6">
        <div className="flex items-baseline justify-between">
          <span className="font-starlightmix-display text-3xl font-black text-starlightmix-text">
            $49
          </span>
          <span className="text-sm text-starlightmix-text-muted">
            one-time · lifetime
          </span>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-starlightmix-text-soft">
          <li>Unlimited videos — you only pay Replicate, at cost</li>
          <li>Every theme and all future updates</li>
          <li>Private: your audio and renders never leave your device</li>
        </ul>

        <a
          href={GUMROAD_URL}
          target="_blank"
          rel="noopener"
          className="mt-5 block rounded-full bg-starlightmix-magenta px-6 py-3 text-center font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Buy lifetime access
        </a>

        <div className="my-5 h-px bg-starlightmix-border-strong" />

        <label
          htmlFor="license-key"
          className="block text-sm text-starlightmix-text-muted"
        >
          Already purchased? Enter your license key
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="license-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !busy) void unlock();
            }}
            placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
            autoComplete="off"
            spellCheck={false}
            className="min-h-[44px] flex-1 rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-deep px-3 py-2 font-starlightmix-mono text-sm tracking-wider text-starlightmix-text placeholder:text-starlightmix-text-muted focus:border-starlightmix-cyan focus:outline-none focus:ring-2 focus:ring-starlightmix-cyan/40"
          />
          <button
            type="button"
            onClick={() => void unlock()}
            disabled={busy}
            className="min-h-[44px] rounded-full bg-starlightmix-cyan px-6 font-bold text-starlightmix-bg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-starlightmix-magenta" role="status">
            {error}
          </p>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-starlightmix-text-muted">
        Manage your token &amp; license anytime in{" "}
        <Link href="/settings" className="text-starlightmix-cyan underline">
          Settings
        </Link>
        .
      </p>
    </section>
  );
}
