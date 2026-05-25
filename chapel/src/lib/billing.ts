/**
 * billing.ts — pure client-side billing logic, no Supabase calls.
 *
 * Tier enforcement for R8:
 *   free  → up to 30 members
 *   pro   → up to 150 members (stripe_subscription_status === 'active')
 */

export type OrgTier = 'free' | 'pro'

/** Member limits per tier. */
export const TIER_LIMITS: Record<OrgTier, number> = {
  free: 30,
  pro: 150,
}

/**
 * Derives the org tier from the raw Stripe subscription status stored on the
 * `orgs` table.  Only a status of `'active'` is treated as a paid subscription;
 * anything else (null, 'free', 'canceled', 'past_due', …) falls back to free.
 */
export function getOrgTier(stripeSubscriptionStatus: string | null): OrgTier {
  return stripeSubscriptionStatus === 'active' ? 'pro' : 'free'
}

/**
 * Returns the maximum number of members allowed for the given subscription
 * status.
 */
export function getMemberLimit(stripeSubscriptionStatus: string | null): number {
  return TIER_LIMITS[getOrgTier(stripeSubscriptionStatus)]
}

/**
 * Returns `true` when the org has reached (or exceeded) its member limit and
 * should be blocked from adding another member.
 */
export function isAtMemberLimit(
  memberCount: number,
  stripeSubscriptionStatus: string | null,
): boolean {
  return memberCount >= getMemberLimit(stripeSubscriptionStatus)
}
