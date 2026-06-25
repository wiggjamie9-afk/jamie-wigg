/**
 * Shared license helpers — the single source of truth for whether this device
 * holds a valid STARLIGHTMIX lifetime license. Mirrors the cache contract used
 * by `components/settings/license-panel.tsx` (R10):
 *
 *   localStorage["rhythmix_license_v1"] = { key, tier, validatedAt }
 *
 * cached for 24h, validated against the license Worker. The home-page gate
 * (`app/page.tsx`) and the settings panel both read/write through here so they
 * can never disagree about license state.
 */

export const LICENSE_CACHE_KEY = "rhythmix_license_v1";
export const LICENSE_TTL_MS = 24 * 60 * 60 * 1000; // 24h (R10)

const DEFAULT_LICENSE_URL =
  "https://license.studio.starlightmix.com/api/license";

export type CachedLicense = { key: string; tier: string; validatedAt: number };

type ValidateResult =
  | { valid: true; tier: string }
  | { valid: false; reason?: string };

/** Worker endpoint — overridable at build time via NEXT_PUBLIC_LICENSE_URL. */
export function licenseUrl(): string {
  return (
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_LICENSE_URL) ||
    DEFAULT_LICENSE_URL
  );
}

export function readCachedLicense(): CachedLicense | null {
  try {
    const raw = localStorage.getItem(LICENSE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedLicense>;
    if (
      typeof parsed?.key !== "string" ||
      typeof parsed?.tier !== "string" ||
      typeof parsed?.validatedAt !== "number"
    ) {
      return null;
    }
    return parsed as CachedLicense;
  } catch {
    return null;
  }
}

export function isCachedLicenseFresh(entry: CachedLicense | null): boolean {
  if (!entry) return false;
  return entry.validatedAt + LICENSE_TTL_MS > Date.now();
}

/** True if this device holds a license validated within the TTL. */
export function hasValidLicense(): boolean {
  return isCachedLicenseFresh(readCachedLicense());
}

/**
 * POST a key to the license Worker. On success, cache it (so the gate opens)
 * and return the tier; otherwise return the reason. Never throws.
 */
export async function validateLicense(
  key: string,
  signal?: AbortSignal,
): Promise<ValidateResult> {
  const trimmed = key.trim();
  if (!trimmed) return { valid: false, reason: "Enter your license key." };

  let res: Response;
  try {
    res = await fetch(licenseUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: trimmed }),
      signal,
    });
  } catch {
    return {
      valid: false,
      reason: "Couldn't reach the license server. Try again in a moment.",
    };
  }

  let body: ValidateResult;
  try {
    body = (await res.json()) as ValidateResult;
  } catch {
    return { valid: false, reason: "Unexpected response from the license server." };
  }

  if (body.valid === true) {
    const entry: CachedLicense = {
      key: trimmed,
      tier: body.tier ?? "lifetime",
      validatedAt: Date.now(),
    };
    try {
      localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify(entry));
    } catch {
      /* quota / private mode — not fatal, gate re-validates next time */
    }
    return { valid: true, tier: entry.tier };
  }

  return { valid: false, reason: body.reason };
}
