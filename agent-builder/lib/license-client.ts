/**
 * Client-side license validation utility
 * Use this in your apps to validate licenses and control access
 */

export interface LicenseInfo {
  valid: boolean;
  app_id: string;
  app_name: string;
  is_premium: boolean;
  user_id: string;
}

/**
 * Validate a license key by calling the backend
 */
export async function validateLicense(licenseKey: string): Promise<LicenseInfo> {
  try {
    const response = await fetch(`/api/licenses/validate?key=${encodeURIComponent(licenseKey)}`);

    if (!response.ok) {
      return {
        valid: false,
        app_id: '',
        app_name: '',
        is_premium: false,
        user_id: '',
      };
    }

    const data = await response.json();
    return {
      valid: true,
      ...data,
    };
  } catch (error) {
    console.error('License validation error:', error);
    return {
      valid: false,
      app_id: '',
      app_name: '',
      is_premium: false,
      user_id: '',
    };
  }
}

/**
 * Get license from URL parameters
 */
export function getLicenseFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return params.get('license');
}

/**
 * Store license in sessionStorage (clears when tab closes)
 */
export function storeLicense(licenseKey: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('app_license', licenseKey);
  }
}

/**
 * Retrieve license from sessionStorage
 */
export function getLicense(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('app_license');
}

/**
 * Clear license from sessionStorage
 */
export function clearLicense(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('app_license');
  }
}

/**
 * Hook to initialize license in your app
 * Usage:
 *
 * export default function MyApp() {
 *   const { license, isPremium, isValidating } = useLicense();
 *
 *   if (isValidating) return <LoadingScreen />;
 *
 *   if (!license || !license.valid) {
 *     return <InvalidLicenseScreen />;
 *   }
 *
 *   return (
 *     <>
 *       {isPremium && <PremiumFeature />}
 *       <MainApp />
 *     </>
 *   );
 * }
 */
export function useLicense() {
  const [license, setLicense] = React.useState<LicenseInfo | null>(null);
  const [isValidating, setIsValidating] = React.useState(true);

  React.useEffect(() => {
    validateAndStoreLicense();
  }, []);

  async function validateAndStoreLicense() {
    setIsValidating(true);

    // Try to get license from URL first
    let licenseKey = getLicenseFromUrl();

    // Fall back to sessionStorage
    if (!licenseKey) {
      licenseKey = getLicense();
    }

    if (!licenseKey) {
      setLicense(null);
      setIsValidating(false);
      return;
    }

    // Validate the license
    const licenseInfo = await validateLicense(licenseKey);

    if (licenseInfo.valid) {
      storeLicense(licenseKey);
      setLicense(licenseInfo);
    } else {
      clearLicense();
      setLicense(null);
    }

    setIsValidating(false);
  }

  return {
    license,
    isPremium: license?.is_premium ?? false,
    isValid: license?.valid ?? false,
    isValidating,
  };
}

/**
 * Simple license guard for React components
 * Usage:
 *
 * export default function MyApp() {
 *   return (
 *     <LicenseGuard>
 *       <MainApp />
 *     </LicenseGuard>
 *   );
 * }
 */
import React from 'react';

export function LicenseGuard({ children }: { children: React.ReactNode }) {
  const { license, isValidating } = useLicense();

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Validating license...</p>
        </div>
      </div>
    );
  }

  if (!license || !license.valid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Invalid License</h1>
          <p className="text-gray-600 mb-6">
            This app requires a valid license. Please purchase it on our store or check your license key.
          </p>
          <a
            href="/shop"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600"
          >
            Buy Now
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Server-side license validation (for Next.js API routes)
 * Usage:
 *
 * export async function GET(request: NextRequest) {
 *   const license = await validateLicenseServer(request);
 *
 *   if (!license.valid) {
 *     return NextResponse.json({ error: 'Invalid license' }, { status: 401 });
 *   }
 *
 *   return NextResponse.json({ data: '...' });
 * }
 */
export async function validateLicenseServer(request: Request): Promise<LicenseInfo> {
  const url = new URL(request.url);
  const licenseKey = url.searchParams.get('license');

  if (!licenseKey) {
    return {
      valid: false,
      app_id: '',
      app_name: '',
      is_premium: false,
      user_id: '',
    };
  }

  // This would call your Supabase RPC or query directly
  // For now, returning the interface for you to implement
  throw new Error('Implement server-side validation in your API');
}
