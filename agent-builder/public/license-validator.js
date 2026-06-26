/**
 * Standalone License Validator
 * Use in any HTML app: <script src="/license-validator.js"></script>
 */

class LicenseValidator {
  constructor(options = {}) {
    this.apiEndpoint = options.apiEndpoint || '/api/license/validate';
    this.storageKey = options.storageKey || 'app_license';
    this.productId = options.productId;
    this.onValidated = options.onValidated || (() => {});
    this.onInvalid = options.onInvalid || (() => {});
    this.license = null;
    this.isValidating = false;
  }

  async validate() {
    this.isValidating = true;

    // Try URL parameter first
    let licenseKey = this.getLicenseFromUrl();

    // Fall back to localStorage
    if (!licenseKey) {
      licenseKey = this.getLicenseFromStorage();
    }

    if (!licenseKey) {
      this.isValidating = false;
      this.onInvalid?.({ error: 'No license found' });
      return false;
    }

    try {
      // In a static export app, we can't call /api directly
      // Instead, call Supabase Functions or validate client-side
      const response = await fetch(`${window.location.origin}/api/validate-license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey })
      });

      if (!response.ok) {
        this.clearStorage();
        this.isValidating = false;
        this.onInvalid?.({ error: `HTTP ${response.status}` });
        return false;
      }

      const result = await response.json();

      if (result.valid && result.license) {
        this.license = result.license;
        this.storeLicense(licenseKey);
        this.isValidating = false;
        this.onValidated?.(result.license);
        return true;
      } else {
        this.clearStorage();
        this.isValidating = false;
        this.onInvalid?.(result);
        return false;
      }
    } catch (err) {
      console.error('License validation error:', err);
      this.isValidating = false;
      this.onInvalid?.({ error: 'Validation failed' });
      return false;
    }
  }

  getLicenseFromUrl() {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('license');
  }

  getLicenseFromStorage() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.storageKey);
  }

  storeLicense(licenseKey) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, licenseKey);
    }
  }

  clearStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.LicenseValidator = LicenseValidator;
}
