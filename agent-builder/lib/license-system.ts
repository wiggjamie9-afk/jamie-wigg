/**
 * Universal License Validation System
 * Used by all 7 apps (RHYTHMIX, HerdCheck, STARLIGHTMIX Studio, HUM, DREAMS, RESONANCE, Reset)
 *
 * Usage:
 * const license = await validateLicense(licenseKey);
 * if (!license.valid) redirect to purchase page
 * if (license.expires_at < now) show renewal prompt
 */

import { createClient } from '@supabase/supabase-js';

export interface LicenseInfo {
  valid: boolean;
  license_key: string;
  product_id: string;
  product_name: string;
  user_id: string;
  user_email: string;
  status: 'active' | 'cancelled' | 'expired';
  purchased_at: string;
  expires_at: string | null;
  is_subscription: boolean;
  price_paid: number;
}

export interface ValidationResult {
  valid: boolean;
  license?: LicenseInfo;
  error?: string;
}

/**
 * Server-side validation - use in API routes or server components
 */
export async function validateLicenseServer(
  licenseKey: string,
  supabaseUrl?: string,
  supabaseKey?: string
): Promise<ValidationResult> {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return {
      valid: false,
      error: 'Supabase not configured',
    };
  }

  try {
    const supabase = createClient(url, key);

    // Fetch license and related user/product info
    const { data, error } = await supabase
      .from('purchases')
      .select(
        `
        license_key,
        status,
        purchased_at,
        expires_at,
        user_id,
        product_id,
        stripe_subscription_id,
        app_users (
          email
        ),
        products (
          name
        ),
        pricing_tiers (
          price_usd,
          interval
        )
      `
      )
      .eq('license_key', licenseKey)
      .single();

    if (error || !data) {
      return {
        valid: false,
        error: 'License not found',
      };
    }

    const isExpired =
      data.expires_at && new Date(data.expires_at) < new Date();
    const isActive = data.status === 'active' && !isExpired;

    if (!isActive) {
      return {
        valid: false,
        license: {
          valid: false,
          license_key: data.license_key,
          product_id: data.product_id,
          product_name: (data.products as any)?.name || 'Unknown',
          user_id: data.user_id,
          user_email: (data.app_users as any)?.email || '',
          status: data.status as any,
          purchased_at: data.purchased_at,
          expires_at: data.expires_at,
          is_subscription: (data.pricing_tiers as any)?.interval !== 'one-time',
          price_paid: (data.pricing_tiers as any)?.price_usd || 0,
        },
        error: isExpired ? 'License expired' : 'License inactive',
      };
    }

    // Log validation
    await supabase.from('license_validations').insert({
      id: `${licenseKey}-${Date.now()}`,
      license_key: licenseKey,
    });

    return {
      valid: true,
      license: {
        valid: true,
        license_key: data.license_key,
        product_id: data.product_id,
        product_name: (data.products as any)?.name || 'Unknown',
        user_id: data.user_id,
        user_email: (data.app_users as any)?.email || '',
        status: data.status as any,
        purchased_at: data.purchased_at,
        expires_at: data.expires_at,
        is_subscription: (data.pricing_tiers as any)?.interval !== 'one-time',
        price_paid: (data.pricing_tiers as any)?.price_usd || 0,
      },
    };
  } catch (err) {
    console.error('License validation error:', err);
    return {
      valid: false,
      error: 'Validation error',
    };
  }
}

/**
 * Client-side validation - fetch from API endpoint
 * Use this in browser/client components
 */
export async function validateLicenseClient(
  licenseKey: string,
  apiEndpoint = '/api/license/validate'
): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `${apiEndpoint}?key=${encodeURIComponent(licenseKey)}`
    );

    if (!response.ok) {
      return {
        valid: false,
        error: `HTTP ${response.status}`,
      };
    }

    return await response.json();
  } catch (err) {
    console.error('License validation error:', err);
    return {
      valid: false,
      error: 'Validation failed',
    };
  }
}

/**
 * Get license from URL parameter or localStorage
 */
export function getLicenseFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return params.get('license');
}

export function getLicenseFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('app_license');
}

export function storeLicense(licenseKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app_license', licenseKey);
  }
}

export function clearLicense(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('app_license');
  }
}

/**
 * React Hook for client apps
 * Usage in any React app:
 *
 * export default function MyApp() {
 *   const { license, isValidating, error } = useLicense();
 *
 *   if (isValidating) return <LoadingScreen />;
 *   if (!license?.valid) return <PurchaseScreen />;
 *
 *   return <AppContent license={license} />;
 * }
 */
export function useLicense() {
  const [license, setLicense] = React.useState<LicenseInfo | null>(null);
  const [isValidating, setIsValidating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    validateAndStore();
  }, []);

  async function validateAndStore() {
    setIsValidating(true);
    setError(null);

    // Try URL param first
    let licenseKey = getLicenseFromUrl();

    // Fall back to localStorage
    if (!licenseKey) {
      licenseKey = getLicenseFromStorage();
    }

    if (!licenseKey) {
      setLicense(null);
      setIsValidating(false);
      return;
    }

    const result = await validateLicenseClient(licenseKey);

    if (result.valid && result.license) {
      storeLicense(licenseKey);
      setLicense(result.license);
    } else {
      clearLicense();
      setLicense(null);
      setError(result.error || 'Invalid license');
    }

    setIsValidating(false);
  }

  return {
    license,
    isValidating,
    error,
  };
}

// React import - needed for the hook
import React from 'react';
