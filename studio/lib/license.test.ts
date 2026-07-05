/**
 * Tests for `lib/license.ts` — free-tier + paid-tier resolution and the
 * 1-year free-trial clock. jsdom provides `localStorage`; each test starts
 * from a wiped store and (where relevant) a pinned system clock.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  FREE_TRIAL_DURATION_MS,
  LICENSE_CACHE_KEY,
  LICENSE_TTL_MS,
  TRIAL_STARTED_KEY,
  type CachedLicense,
  clearCachedLicense,
  ensureTrialStarted,
  isPaidTier,
  isTrialExpired,
  licenseTtlRemainingMs,
  maskLicenseKey,
  readCachedLicense,
  resolveTier,
  trialRemainingMs,
  writeCachedLicense,
} from "./license";

const KEY = "ABCD1234-EFGH5678-IJKL9012-MNOP3456";

function freshEntry(tier: CachedLicense["tier"]): CachedLicense {
  return { key: KEY, tier, validatedAt: Date.now() };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("isPaidTier", () => {
  it("accepts the two paid tiers only", () => {
    expect(isPaidTier("lifetime")).toBe(true);
    expect(isPaidTier("monthly")).toBe(true);
    expect(isPaidTier("free")).toBe(false);
    expect(isPaidTier(undefined)).toBe(false);
  });
});

describe("license cache", () => {
  it("round-trips a cached license", () => {
    writeCachedLicense(freshEntry("lifetime"));
    const read = readCachedLicense();
    expect(read).not.toBeNull();
    expect(read?.tier).toBe("lifetime");
    expect(read?.key).toBe(KEY);
  });

  it("returns null for missing or malformed cache entries", () => {
    expect(readCachedLicense()).toBeNull();
    localStorage.setItem(LICENSE_CACHE_KEY, "not json");
    expect(readCachedLicense()).toBeNull();
    localStorage.setItem(
      LICENSE_CACHE_KEY,
      JSON.stringify({ key: KEY, tier: "free", validatedAt: Date.now() }),
    );
    expect(readCachedLicense()).toBeNull();
  });

  it("clears the cache entry", () => {
    writeCachedLicense(freshEntry("monthly"));
    clearCachedLicense();
    expect(readCachedLicense()).toBeNull();
  });
});

describe("resolveTier", () => {
  it("defaults to free with no cached license", () => {
    expect(resolveTier()).toBe("free");
  });

  it("returns the cached paid tier while fresh", () => {
    writeCachedLicense(freshEntry("monthly"));
    expect(resolveTier()).toBe("monthly");
  });

  it("drops back to free once the cache TTL has lapsed", () => {
    const entry = freshEntry("lifetime");
    writeCachedLicense(entry);
    vi.useFakeTimers();
    vi.setSystemTime(entry.validatedAt + LICENSE_TTL_MS + 1);
    expect(licenseTtlRemainingMs(entry)).toBeLessThanOrEqual(0);
    expect(resolveTier()).toBe("free");
  });
});

describe("free-tier trial (1 year)", () => {
  it("stamps the trial start on first call and keeps it stable", () => {
    const first = ensureTrialStarted();
    expect(first).not.toBeNull();
    expect(localStorage.getItem(TRIAL_STARTED_KEY)).toBe(String(first));
    expect(ensureTrialStarted()).toBe(first);
  });

  it("re-stamps a malformed or future-dated stored value", () => {
    localStorage.setItem(TRIAL_STARTED_KEY, "garbage");
    const restamped = ensureTrialStarted();
    expect(restamped).not.toBeNull();
    expect(Number(localStorage.getItem(TRIAL_STARTED_KEY))).toBe(restamped);

    localStorage.setItem(TRIAL_STARTED_KEY, String(Date.now() + 10_000));
    const again = ensureTrialStarted();
    expect(again).not.toBeNull();
    expect(again!).toBeLessThanOrEqual(Date.now());
  });

  it("counts down a full year and expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_000_000);
    const started = ensureTrialStarted()!;
    expect(trialRemainingMs()).toBe(FREE_TRIAL_DURATION_MS);
    expect(isTrialExpired()).toBe(false);

    vi.setSystemTime(started + FREE_TRIAL_DURATION_MS - 1);
    expect(trialRemainingMs()).toBe(1);
    expect(isTrialExpired()).toBe(false);

    vi.setSystemTime(started + FREE_TRIAL_DURATION_MS + 1);
    expect(trialRemainingMs()).toBe(0);
    expect(isTrialExpired()).toBe(true);
  });

  it("never expires a paid tier", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_000_000);
    const started = ensureTrialStarted()!;
    vi.setSystemTime(started + FREE_TRIAL_DURATION_MS + 1);
    // Paid license validated just now → tier is paid → trial expiry is moot.
    writeCachedLicense(freshEntry("lifetime"));
    expect(isTrialExpired()).toBe(false);
  });
});

describe("maskLicenseKey", () => {
  it("shows only the first and last 4 characters", () => {
    const masked = maskLicenseKey(KEY);
    expect(masked).toBe("ABCD…3456");
    expect(masked).not.toContain("EFGH");
  });

  it("fully masks short keys", () => {
    expect(maskLicenseKey("short")).toBe("•••••");
  });
});
