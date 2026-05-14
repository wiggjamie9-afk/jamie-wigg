/**
 * RevenueCat client for iOS in-app purchases.
 * iOS must use IAP for digital goods per App Store guidelines.
 * Android can use either RevenueCat-over-Google-Billing or Stripe (see lib/payments.ts).
 */

import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';

let configured = false;

const ENTITLEMENT_ID = 'lifetime';
const OFFERING_ID = 'default';
const PRODUCT_ID_LIFETIME = 'rhythmix_lifetime_149';

export async function configurePurchases(userId?: string) {
  if (configured) {
    if (userId) await Purchases.logIn(userId);
    return;
  }

  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

  if (!apiKey) {
    console.warn(
      '[purchases] EXPO_PUBLIC_REVENUECAT_IOS_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_KEY missing — IAP disabled.',
    );
    return;
  }

  Purchases.configure({ apiKey, appUserID: userId });
  configured = true;
}

export async function fetchLifetimeOffering(): Promise<PurchasesPackage | null> {
  if (!configured) return null;
  const offerings = await Purchases.getOfferings();
  const offering: PurchasesOffering | null =
    offerings.all[OFFERING_ID] ?? offerings.current ?? null;
  if (!offering) return null;

  return (
    offering.availablePackages.find((p) => p.product.identifier === PRODUCT_ID_LIFETIME) ??
    offering.lifetime ??
    null
  );
}

export async function buyLifetime(): Promise<{ ok: true; info: CustomerInfo } | { ok: false; reason: string }> {
  if (!configured) return { ok: false, reason: 'RevenueCat not configured' };
  const pkg = await fetchLifetimeOffering();
  if (!pkg) return { ok: false, reason: 'No lifetime package configured in RevenueCat.' };
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { ok: true, info: customerInfo };
  } catch (e: any) {
    if (e?.userCancelled) return { ok: false, reason: 'cancelled' };
    return { ok: false, reason: e?.message ?? String(e) };
  }
}

export async function hasLifetime(): Promise<boolean> {
  if (!configured) return false;
  const info = await Purchases.getCustomerInfo();
  return !!info.entitlements.active[ENTITLEMENT_ID];
}

export async function restorePurchases(): Promise<boolean> {
  if (!configured) return false;
  const info = await Purchases.restorePurchases();
  return !!info.entitlements.active[ENTITLEMENT_ID];
}
