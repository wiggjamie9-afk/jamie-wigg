/**
 * GET /api/quotas - Get current quotas for user
 * POST /api/admin/quotas/:user_id - Admin quota update
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { authenticateJWT } from '../middleware/auth'
import { logRequest, logError } from '../middleware/logging'
import { quotasResponseSchema, adminQuotaUpdateSchema, adminQuotaUpdateResponseSchema, type UserQuota } from './schema'

interface QuotaEntry {
  model: string
  quota_per_day: number
  used_today: number
  reset_at: string
}

// Stub quota store (replace with Supabase in production)
const quotaStore = new Map<string, QuotaEntry[]>()

// Default quotas by tier
const DEFAULT_QUOTAS = {
  free: {
    'stable-diffusion-3': 3,
    'kokoro': 10,
  },
  pro: {
    'flux': 20,
    'stable-diffusion-3': 50,
    'hunyuan-video': 5,
    'suno-v5': 10,
    'elevenlabs-tts': 100,
    'kokoro': 100,
  },
  studio: {
    'flux': -1, // unlimited
    'stable-diffusion-3': -1,
    'hunyuan-video': -1,
    'runway-gen3': -1,
    'suno-v5': -1,
    'elevenlabs-tts': -1,
    'kokoro': -1,
  },
}

/**
 * GET /api/quotas
 * Get current quotas for authenticated user
 */
export async function GET(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || uuidv4()
  const startTime = Date.now()

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id, tier } = await authenticateJWT(authHeader)

    // Get quotas from store or initialize
    let userQuotas = quotaStore.get(user_id)
    if (!userQuotas) {
      userQuotas = initializeUserQuotas(user_id, tier as any)
      quotaStore.set(user_id, userQuotas)
    }

    // Build response
    const quotas: UserQuota[] = userQuotas.map(q => ({
      model: q.model,
      quota_per_day: q.quota_per_day,
      used_today: q.used_today,
      remaining: q.quota_per_day > 0 ? Math.max(0, q.quota_per_day - q.used_today) : -1,
      reset_at: q.reset_at,
    }))

    const totalQuota = userQuotas.reduce((sum, q) => (q.quota_per_day > 0 ? sum + q.quota_per_day : sum), 0)
    const totalUsed = userQuotas.reduce((sum, q) => sum + q.used_today, 0)
    const totalRemaining = Math.max(0, totalQuota - totalUsed)

    const response = {
      user_id,
      tier,
      quotas,
      total_quota_per_day: totalQuota,
      total_used_today: totalUsed,
      total_remaining: totalRemaining,
    }

    const duration = Date.now() - startTime
    logRequest(requestId, 'GET', '/api/quotas', 200, 'Quotas retrieved', undefined, duration)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    const duration = Date.now() - startTime
    logError(requestId, 'Unexpected error in GET /api/quotas', { error: err, duration })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

/**
 * POST /api/admin/quotas/:user_id
 * Admin-only quota update
 */
export async function POST(req: NextRequest, { params }: { params: { user_id: string } }) {
  const requestId = req.headers.get('x-request-id') || uuidv4()

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id: requester_id, tier: requesterTier } = await authenticateJWT(authHeader)

    // Check admin privilege (stub: only 'studio' tier can admin quotas)
    if (requesterTier !== 'studio') {
      logRequest(requestId, 'POST', `/api/admin/quotas/${params.user_id}`, 403, 'Insufficient privilege')
      return NextResponse.json(
        { error: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }

    // Validate input schema
    let validatedInput: unknown
    try {
      validatedInput = adminQuotaUpdateSchema.parse(body)
    } catch (err) {
      const zodError = err as z.ZodError
      logError(requestId, 'Validation error', { errors: zodError.errors, status: 400 })
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: zodError.errors },
        { status: 400 }
      )
    }

    const updateData = validatedInput as { user_id?: string; model?: string; quota_per_day?: number; reset_at?: string }

    // Get target user quotas
    const targetUserId = params.user_id
    let userQuotas = quotaStore.get(targetUserId)
    if (!userQuotas) {
      return NextResponse.json(
        { error: 'User not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Update quotas
    if (updateData.model) {
      const quotaEntry = userQuotas.find(q => q.model === updateData.model)
      if (!quotaEntry) {
        return NextResponse.json(
          { error: 'Quota entry not found', code: 'NOT_FOUND' },
          { status: 404 }
        )
      }

      if (updateData.quota_per_day !== undefined) {
        quotaEntry.quota_per_day = updateData.quota_per_day
      }

      if (updateData.reset_at !== undefined) {
        quotaEntry.reset_at = updateData.reset_at
      }
    } else {
      // Update all quotas for the user
      if (updateData.quota_per_day !== undefined) {
        userQuotas.forEach(q => {
          q.quota_per_day = updateData.quota_per_day!
        })
      }

      if (updateData.reset_at !== undefined) {
        userQuotas.forEach(q => {
          q.reset_at = updateData.reset_at!
        })
      }
    }

    const updatedQuotas: UserQuota[] = userQuotas.map(q => ({
      model: q.model,
      quota_per_day: q.quota_per_day,
      used_today: q.used_today,
      remaining: q.quota_per_day > 0 ? Math.max(0, q.quota_per_day - q.used_today) : -1,
      reset_at: q.reset_at,
    }))

    const response = {
      user_id: targetUserId,
      updated_quotas: updatedQuotas,
      updated_at: new Date().toISOString(),
    }

    logRequest(requestId, 'POST', `/api/admin/quotas/${targetUserId}`, 200, 'Quotas updated')

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    logError(requestId, `Unexpected error in POST /api/admin/quotas/:user_id`, { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

// Helper functions

function initializeUserQuotas(userId: string, tier: 'free' | 'pro' | 'studio'): QuotaEntry[] {
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1)
  nextMidnight.setUTCHours(0, 0, 0, 0)

  const tierQuotas = DEFAULT_QUOTAS[tier] || DEFAULT_QUOTAS.free

  return Object.entries(tierQuotas).map(([model, quota]) => ({
    model,
    quota_per_day: quota,
    used_today: 0,
    reset_at: nextMidnight.toISOString(),
  }))
}
