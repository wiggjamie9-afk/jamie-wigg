/**
 * Shared license/tier model for the studio (R10).
 *
 * Re-engineered so the tier model has an explicit **free tier**:
 *
 *   - `"free"`     — the default. No license key, no Gumroad round-trip.
 *                    Everyone gets it just by loading the studio. Runs as a
 *                    1-year trial: the first visit stamps a start date in
 *                    `localStorage`, and `trialRemainingMs()` counts down
 *                    from there. Nothing is gated on expiry yet — the clock
 *                    and `isTrialExpired()` exist so future gating has a
 *                    single source of truth.
 *   - `"monthly"`  — paid, validated against Gumroad by the license Worker.
 *   - `"lifetime"` — paid, validated against Gumroad by the license Worker.
 *
 * Only the paid tiers ever touch the network — "free" is simply the absence
 * of a fresh, valid cached license. That keeps the Worker unchanged (it
 * still answers `{ valid: true, tier }` for paid keys only) and means the
 * free tier works fully offline.
 *
 * The `localStorage` cache shape and key (`rhythmix_license_v1`) are
 * unchanged from the original license-panel implementation, so existing
 * customers' cached licenses keep working across this refactor.
 *
 * Security: never log the license key. Callers render it only via
 * `maskLicenseKey`.
 */

export type PaidTier = "monthly" | "lifetime";
export type Tier = "free" | PaidTier;

export const LICENSE_CACHE_KEY = "rhythmix_license_v1";
export const LICENSE_TTL_MS = 24 * 60 * 60 * 1000; // 24h (R10)

export type CachedLicense = {
  key: string;
  /** Only paid tiers are ever cached — "free" needs no key and no cache. */
  tier: PaidTier;
  /** Epoch ms when the Worker last said `valid: true`. */
  validatedAt: number;
};

export function isPaidTier(x: unknown): x is PaidTier {
  return x === "lifetime" || x === "monthly";
}

export function readCachedLicense(): CachedLicense | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LICENSE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedLicense>;
    if (
      typeof parsed.key !== "string" ||
      !isPaidTier(parsed.tier) ||
      typeof parsed.validatedAt !== "number"
    ) {
      return null;
    }
    return parsed as CachedLicense;
  } catch {
    return null;
  }
}

export function writeCachedLicense(entry: CachedLicense): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* quota / private mode — not fatal, next check just re-validates */
  }
}

export function clearCachedLicense(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LICENSE_CACHE_KEY);
  } catch {
    /* ignore */
  }
}

export function licenseTtlRemainingMs(entry: CachedLicense): number {
  return entry.validatedAt + LICENSE_TTL_MS - Date.now();
}

/**
 * The device's current tier. A fresh, valid cached license wins; anything
 * else — no key, malformed cache, or an expired cache awaiting
 * re-validation — resolves to "free". This is the single call sites should
 * use to gate paid-only features.
 */
export function resolveTier(): Tier {
  const cached = readCachedLicense();
  if (cached && licenseTtlRemainingMs(cached) > 0) return cached.tier;
  return "free";
}

// ---- free-tier trial (1 year) -------------------------------------------------

export const FREE_TRIAL_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 year
export const TRIAL_STARTED_KEY = "rhythmix_trial_started_v1";

/**
 * Epoch ms when the free-tier trial started on this device. Stamps "now" on
 * first call (i.e. the trial starts the first time anything asks). A
 * malformed or future-dated stored value is treated as absent and
 * re-stamped, so a corrupted entry can't produce a negative-length trial.
 * Returns null only where `localStorage` doesn't exist (SSR).
 */
export function ensureTrialStarted(): number | null {
  if (typeof window === "undefined") return null;
  const now = Date.now();
  try {
    const raw = localStorage.getItem(TRIAL_STARTED_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed > 0 && parsed <= now) {
        return parsed;
      }
    }
    localStorage.setItem(TRIAL_STARTED_KEY, String(now));
    return now;
  } catch {
    // Private mode / quota — treat every visit as day one of the trial.
    return now;
  }
}

/** Ms of free-tier trial left on this device (0 once expired). */
export function trialRemainingMs(): number {
  const started = ensureTrialStarted();
  if (started === null) return FREE_TRIAL_DURATION_MS;
  return Math.max(0, started + FREE_TRIAL_DURATION_MS - Date.now());
}

/** True once the device's 1-year free trial has run out (paid tiers never expire this way). */
export function isTrialExpired(): boolean {
  if (resolveTier() !== "free") return false;
  return trialRemainingMs() <= 0;
}

export function maskLicenseKey(key: string): string {
  // Show first 4 + last 4, dots in the middle. Avoid leaking the full string
  // in any rendered surface — defence in depth, the key is already on disk.
  if (key.length <= 8) return "•".repeat(key.length);
  return key.slice(0, 4) + "…" + key.slice(-4);
}
