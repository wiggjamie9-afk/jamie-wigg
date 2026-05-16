"use client";

/**
 * License-key panel for /settings (R10).
 *
 * The license Worker (T7) returns `{ valid: true, tier }` or
 * `{ valid: false, reason }`. We POST the key to its public endpoint, then:
 *   - On valid: cache `{ key, tier, validatedAt }` in `localStorage` under
 *     `rhythmix_license_v1` for 24 h. The same shape used elsewhere in the
 *     app (e.g. the route gate component to be wired by T7/T8) reads this
 *     to decide whether to re-validate.
 *   - On invalid: surface the reason and don't touch the cache.
 *
 * "Re-check now" forces a network hit even if cached data is still fresh —
 * useful when a user upgrades their tier on Gumroad and wants to see the
 * update without waiting for the 24 h window.
 *
 * Security:
 *   - We NEVER `console.log` the key.
 *   - On clear we wipe the cache entry only (no server call); cache loss is
 *     fine, the next gate check will re-validate on demand.
 */

import { useCallback, useEffect, useState } from "react";

const LICENSE_CACHE_KEY = "rhythmix_license_v1";
const LICENSE_TTL_MS = 24 * 60 * 60 * 1000; // 24h (R10)

const DEFAULT_LICENSE_URL =
  "https://license.studio.rhythmixapp.com.au/api/license";

type Tier = "lifetime" | "monthly";

type CachedLicense = {
  key: string;
  tier: Tier;
  /** Epoch ms when the Worker last said `valid: true`. */
  validatedAt: number;
};

type ValidateOk = { valid: true; tier: Tier };
type ValidateBad = { valid: false; reason?: string };
type ValidateResp = ValidateOk | ValidateBad;

function isTier(x: unknown): x is Tier {
  return x === "lifetime" || x === "monthly";
}

function readCached(): CachedLicense | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LICENSE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedLicense>;
    if (
      typeof parsed.key !== "string" ||
      !isTier(parsed.tier) ||
      typeof parsed.validatedAt !== "number"
    ) {
      return null;
    }
    return parsed as CachedLicense;
  } catch {
    return null;
  }
}

function writeCached(entry: CachedLicense): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* quota / private mode — not fatal, gate will just re-validate next time */
  }
}

function clearCached(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LICENSE_CACHE_KEY);
  } catch {
    /* ignore */
  }
}

function ttlRemainingMs(entry: CachedLicense): number {
  return entry.validatedAt + LICENSE_TTL_MS - Date.now();
}

function maskKey(key: string): string {
  // Show first 4 + last 4, dots in the middle. Avoid leaking the full string
  // in any rendered surface — defence in depth, the key is already on disk.
  if (key.length <= 8) return "•".repeat(key.length);
  return key.slice(0, 4) + "…" + key.slice(-4);
}

export function LicensePanel() {
  const [cached, setCached] = useState<CachedLicense | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    setCached(readCached());
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
        if (body.valid === true) {
          const entry: CachedLicense = {
            key,
            tier: body.tier,
            validatedAt: Date.now(),
          };
          writeCached(entry);
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
      "Clear your stored license? You'll need to re-enter the key to use the studio.",
    );
    if (!ok) return;
    clearCached();
    setCached(null);
    setInfo("License cleared.");
    setError(null);
  }, []);

  return (
    <section
      aria-labelledby="license-heading"
      className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="license-heading"
          className="text-lg font-semibold text-neutral-900"
        >
          License key
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Unlocks the studio routes. Validated against Gumroad and cached for
          24 hours.
        </p>
      </header>

      {cached ? (
        <CachedSummary entry={cached} />
      ) : (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          No valid license cached on this device.
        </p>
      )}

      <form className="mt-4 space-y-3" onSubmit={handleValidate}>
        <label htmlFor="license-key-input" className="block">
          <span className="block text-sm font-medium text-neutral-800">
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
            className="mt-1 block w-full min-h-[44px] rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono tracking-wider text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={busy}
            className="min-h-[44px] rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          >
            {busy ? "Validating…" : "Validate"}
          </button>
          {cached ? (
            <>
              <button
                type="button"
                onClick={handleRecheck}
                disabled={busy}
                className="min-h-[44px] rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
              >
                Re-check now
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={busy}
                className="min-h-[44px] rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
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
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          {info}
        </p>
      ) : null}
    </section>
  );
}

function CachedSummary({ entry }: { entry: CachedLicense }) {
  const remainingMs = ttlRemainingMs(entry);
  const expired = remainingMs <= 0;
  const remainingHours = Math.max(0, Math.round(remainingMs / (60 * 60 * 1000)));
  const tierColour =
    entry.tier === "lifetime"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-blue-200 bg-blue-50 text-blue-900";
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tierColour}`}
        >
          {entry.tier}
        </span>
        <span className="text-sm text-neutral-700">
          {maskKey(entry.key)}
        </span>
      </div>
      <p className="text-xs text-neutral-500">
        Validated {timeAgo(entry.validatedAt)}.{" "}
        {expired ? (
          <span className="text-amber-700">Cache expired — re-check now.</span>
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
