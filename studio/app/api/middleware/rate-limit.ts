/**
 * Rate limiting middleware
 * Stub Redis implementation (replace with actual Redis in production)
 */

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}

const QUOTA_LIMITS = {
  free: 3,
  pro: 20,
  studio: -1, // unlimited
}

// Stub in-memory rate limit store
const rateLimitStore = new Map<string, { remaining: number; resetAt: number }>()

/**
 * Check rate limit quota for user
 */
export async function checkRateLimit(
  userId: string,
  tier: string
): Promise<RateLimitResult & { resetAt: number }> {
  const now = Date.now()
  const quotaLimit = QUOTA_LIMITS[tier as keyof typeof QUOTA_LIMITS] || QUOTA_LIMITS.free

  // Studio tier (unlimited) always passes
  if (quotaLimit === -1) {
    return {
      allowed: true,
      remaining: -1,
      resetAt: now + 86400000, // 24 hours
    }
  }

  // Get or create rate limit entry
  let entry = rateLimitStore.get(userId)

  // If entry doesn't exist or reset time has passed, create new entry
  if (!entry || entry.resetAt < now) {
    const nextReset = getMidnightUTC()
    entry = {
      remaining: quotaLimit,
      resetAt: nextReset,
    }
    rateLimitStore.set(userId, entry)
  }

  // Check if quota exceeded
  const allowed = entry.remaining > 0
  const retryAfter = allowed ? undefined : Math.ceil((entry.resetAt - now) / 1000)

  // Decrement if allowed
  if (allowed) {
    entry.remaining--
  }

  return {
    allowed,
    remaining: entry.remaining,
    resetAt: entry.resetAt,
    retryAfter,
  }
}

/**
 * Get Unix timestamp for next midnight UTC
 */
function getMidnightUTC(): number {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)
  return tomorrow.getTime()
}

/**
 * Reset all quotas (call nightly)
 */
export async function resetAllQuotas(): Promise<number> {
  const now = Date.now()
  let resetCount = 0

  for (const [userId, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      // Reset quota to tier limit
      const tier = getUserTier(userId) // This would query from DB
      const quotaLimit = QUOTA_LIMITS[tier as keyof typeof QUOTA_LIMITS] || 3

      if (quotaLimit !== -1) {
        entry.remaining = quotaLimit
        entry.resetAt = getMidnightUTC()
        resetCount++
      }
    }
  }

  return resetCount
}

/**
 * Stub: Get user tier (replace with DB query in production)
 */
function getUserTier(userId: string): string {
  // In production, query Supabase or auth provider
  return 'free'
}
