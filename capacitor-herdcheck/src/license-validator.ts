/**
 * HerdCheck License Validator
 * Validates Gumroad license keys via the STARLIGHTMIX Studio license API
 * Stores validation result in localStorage for offline use
 */

const LICENSE_API_URL = 'https://license.studio.starlightmix.com/api/license';
const LICENSE_KEY_STORAGE = 'herdcheck_license_key';
const LICENSE_VALID_STORAGE = 'herdcheck_license_valid';
const LICENSE_CHECKED_AT_STORAGE = 'herdcheck_license_checked_at';
const LICENSE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export interface LicenseValidationResult {
  valid: boolean;
  error?: string;
  checkedAt?: number;
}

/**
 * Validate a Gumroad license key against the STARLIGHTMIX Studio API
 */
export async function validateLicenseKey(
  licenseKey: string
): Promise<LicenseValidationResult> {
  try {
    const response = await fetch(LICENSE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ license_key: licenseKey }),
    });

    if (response.ok) {
      const checkedAt = Date.now();
      localStorage.setItem(LICENSE_KEY_STORAGE, licenseKey);
      localStorage.setItem(LICENSE_VALID_STORAGE, 'true');
      localStorage.setItem(LICENSE_CHECKED_AT_STORAGE, checkedAt.toString());

      return { valid: true, checkedAt };
    } else {
      return {
        valid: false,
        error: `License validation failed (${response.status})`,
      };
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : 'Network error';
    console.error('[HerdCheck License] Validation error:', errorMsg);

    // Allow offline use if license was previously valid
    const isOfflineValid = isLicenseOfflineValid();
    if (isOfflineValid) {
      return { valid: true, error: 'Using cached validation (offline)' };
    }

    return {
      valid: false,
      error: `Validation error: ${errorMsg}`,
    };
  }
}

/**
 * Check if a stored license is still valid (cached or recently validated)
 */
export function isLicenseValid(): boolean {
  const isValid = localStorage.getItem(LICENSE_VALID_STORAGE) === 'true';
  if (!isValid) return false;

  // Check if validation is still within the 24-hour window
  const checkedAt = parseInt(
    localStorage.getItem(LICENSE_CHECKED_AT_STORAGE) || '0',
    10
  );
  const now = Date.now();

  if (now - checkedAt > LICENSE_CHECK_INTERVAL) {
    // License check expired, but allow offline use
    return true; // Still valid for offline use
  }

  return true;
}

/**
 * Check if license is valid for offline use (was previously validated)
 */
export function isLicenseOfflineValid(): boolean {
  return localStorage.getItem(LICENSE_VALID_STORAGE) === 'true';
}

/**
 * Get the currently stored license key
 */
export function getStoredLicenseKey(): string | null {
  return localStorage.getItem(LICENSE_KEY_STORAGE);
}

/**
 * Clear stored license and validation state
 */
export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY_STORAGE);
  localStorage.removeItem(LICENSE_VALID_STORAGE);
  localStorage.removeItem(LICENSE_CHECKED_AT_STORAGE);
}

/**
 * Get the last validation timestamp
 */
export function getLastValidationTime(): number | null {
  const checked = localStorage.getItem(LICENSE_CHECKED_AT_STORAGE);
  return checked ? parseInt(checked, 10) : null;
}
