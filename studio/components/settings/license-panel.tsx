"use client";

/**
 * License-key panel for /settings (R10).
 *
 * The tier model (see `lib/license.ts`) now includes a free tier: no key
 * means "free", not "locked out". This panel therefore renders one of two
 * states:
 *   - Free tier (default): a neutral FREE badge + an invitation to paste a
 *     key, never a warning.
 *   - Paid tier: the cached tier badge, masked key, and cache freshness.
 *
 * The license Worker (T7) returns `{ valid: true, tier }` or
 * `{ valid: false, reason }` for paid keys. On valid we cache
 * `{ key, tier, validatedAt }` in `localStorage` (shared helpers in
 * `lib/license.ts`) for 24 h; on invalid we surface the reason and don't
 * touch the cache.
 *
 * "Re-check now" forces a network hit even if cached data is still fresh —
 * useful when a user upgrades their tier on Gumroad and wants to see the
 * update without waiting for the 24 h window.
 *
 * Security:
 *   - We NEVER `console.log` the key.
 *   - On clear we wipe the cache entry only (no server call); the device
 *     simply drops back to the free tier.
 */

import { useCallback, useEffect, useState } from "react";
import {
  type CachedLicense,
  type PaidTier,
  clearCachedLicense,
  isPaidTier,
  licenseTtlRemainingMs,
  maskLicenseKey,
  readCachedLicense,
  trialRemainingMs,
  writeCachedLicense,
} from "@/lib/license";

const DEFAULT_LICENSE_URL =
  "https://license.studio.starlightmix.com/api/license";

type ValidateOk = { valid: true; tier: PaidTier };
type ValidateBad = { valid: false; reason?: string };
type ValidateResp = ValidateOk | ValidateBad;

export function LicensePanel() {
  const [cached, setCached] = useState<CachedLicense | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    setCached(readCachedLicense());
  }, []);

  // Resolve the Worker URL once. Falls back to the production default.
  // We deliberately read from a public env at runtime so devs can point at a
  // local Wrangler worker without touching this file.
  const licenseUrl =
    (typeof process !== "undefined" &&
      process.env?.NEXT_PUBLIC_LICENSE_URL) ||
    DEFAULT_LICENSE_URL;

  const validate = useCallback(
    async (key: string): Promise<void> => {
      setError(null);
      setInfo(null);
      setBusy(true);
      try {
        const res = await fetch(licenseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        let body: ValidateResp;
        try {
          body = (await res.json()) as ValidateResp;
        } catch {
          setError("License server returned an unreadable response.");
          return;
        }
        if (body.valid === true && isPaidTier(body.tier)) {
          const entry: CachedLicense = {
            key,
            tier: body.tier,
            validatedAt: Date.now(),
          };
          writeCachedLicense(entry);
          setCached(entry);
          setKeyInput("");
          setInfo("License valid. Cached for 24 hours.");
        } else {
          // Invalid: don't trample any existing cache. Surface the reason.
          const reason =
            (body && "reason" in body && body.reason) ||
            "Invalid or unknown license key.";
          setError(reason);
        }
      } catch {
        setError(
          "Couldn't reach the license server. Check your internet connection and try again.",
        );
      } finally {
        setBusy(false);
      }
    },
    [licenseUrl],
  );

  const handleValidate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = keyInput.trim();
      if (!trimmed) {
        setError("Paste your license key first.");
        return;
      }
      void validate(trimmed);
    },
    [keyInput, validate],
  );

  const handleRecheck = useCallback(() => {
    if (!cached) return;
    void validate(cached.key);
  }, [cached, validate]);

  const handleClear = useCallback(() => {
    const ok = window.confirm(
      "Clear your stored license? This device will drop back to the free tier.",
    );
    if (!ok) return;
    clearCachedLicense();
    setCached(null);
    setInfo("License cleared. You're back on the free tier.");
    setError(null);
  }, []);

  return (
    <section
      aria-labelledby="license-heading"
      className="rounded-[var(--radius-rhythmix-lg)] border border-starlightmix-border-strong bg-starlightmix-surface p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="license-heading"
          className="font-starlightmix-display text-lg font-bold text-starlightmix-text"
        >
          License key
        </h2>
        <p className="mt-1 text-sm text-starlightmix-text-soft">
          The studio works on the free tier without a key. Paste a Gumroad
          license key to unlock a paid tier — validated once, then cached for
          24 hours.
        </p>
      </header>

      {cached ? <CachedSummary entry={cached} /> : <FreeTierSummary />}

      <form className="mt-4 space-y-3" onSubmit={handleValidate}>
        <label htmlFor="license-key-input" className="block min-w-0">
          <span className="block font-starlightmix-mono text-xs uppercase tracking-[0.2em] text-starlightmix-text-soft">
            License key
          </span>
          <input
            id="license-key-input"
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
            autoComplete="off"
            spellCheck={false}
            className="mt-1 block w-full min-h-[44px] rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-deep px-3 py-2 font-starlightmix-mono text-sm tracking-wider text-starlightmix-text placeholder:text-starlightmix-text-muted focus:border-starlightmix-cyan focus:outline-none focus:ring-2 focus:ring-starlightmix-cyan/40 transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          />
        </label>
        <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={busy}
            className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta px-4 py-2 text-sm font-semibold text-starlightmix-text hover:bg-starlightmix-pink disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          >
            {busy ? "Validating…" : "Validate"}
          </button>
          {cached ? (
            <>
              <button
                type="button"
                onClick={handleRecheck}
                disabled={busy}
                className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-transparent px-4 py-2 text-sm font-medium text-starlightmix-text-soft hover:bg-starlightmix-surface-2 hover:text-starlightmix-text disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
              >
                Re-check now
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={busy}
                className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] border border-starlightmix-magenta/50 bg-transparent px-4 py-2 text-sm font-medium text-starlightmix-magenta hover:bg-[var(--color-rhythmix-danger-soft)] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
              >
                Clear license
              </button>
            </>
          ) : null}
        </div>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-starlightmix-magenta/40 bg-[var(--color-rhythmix-danger-soft)] px-3 py-2 text-sm text-starlightmix-magenta"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-surface-2 px-3 py-2 text-sm text-starlightmix-text-soft">
          {info}
        </p>
      ) : null}
    </section>
  );
}

function FreeTierSummary() {
  // Trial clock reads/stamps localStorage, so resolve it client-side only.
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  useEffect(() => {
    setRemainingDays(Math.ceil(trialRemainingMs() / (24 * 60 * 60 * 1000)));
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center rounded-full border border-starlightmix-border-strong bg-starlightmix-surface-2 px-3 py-1 font-starlightmix-mono text-xs font-semibold uppercase tracking-wider text-starlightmix-text-soft">
        free
      </span>
      <span className="text-sm text-starlightmix-text-soft">
        {remainingDays === null
          ? "1-year free trial — no license key needed."
          : remainingDays > 0
            ? `1-year free trial — ~${remainingDays} day(s) left. No license key needed.`
            : "Free trial ended — paste a license key to keep going."}
      </span>
    </div>
  );
}

function CachedSummary({ entry }: { entry: CachedLicense }) {
  const remainingMs = licenseTtlRemainingMs(entry);
  const expired = remainingMs <= 0;
  const remainingHours = Math.max(0, Math.round(remainingMs / (60 * 60 * 1000)));
  const tierColour =
    entry.tier === "lifetime"
      ? "border-starlightmix-gold/40 bg-[color:var(--color-rhythmix-gold)]/10 text-starlightmix-gold"
      : "border-starlightmix-cyan/40 bg-[var(--color-rhythmix-info-soft)] text-starlightmix-cyan";
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 font-starlightmix-mono text-xs font-semibold uppercase tracking-wider ${tierColour}`}
        >
          {entry.tier}
        </span>
        <span className="font-starlightmix-mono text-sm text-starlightmix-text-soft break-all">
          {maskLicenseKey(entry.key)}
        </span>
      </div>
      <p className="text-xs text-starlightmix-text-muted">
        Validated {timeAgo(entry.validatedAt)}.{" "}
        {expired ? (
          <span className="text-starlightmix-warn">Cache expired — re-check now.</span>
        ) : (
          <>Cache fresh for ~{remainingHours} more hour(s).</>
        )}
      </p>
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour(s) ago`;
  const days = Math.round(hrs / 24);
  return `${days} day(s) ago`;
}
