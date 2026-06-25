import { z } from 'zod'

/**
 * Zod schemas for quotas API
 */

export const userQuotaSchema = z.object({
  model: z.string(),
  quota_per_day: z.number().int(),
  used_today: z.number().int(),
  remaining: z.number().int(),
  reset_at: z.string().datetime(),
})

export const quotasResponseSchema = z.object({
  user_id: z.string(),
  tier: z.enum(['free', 'pro', 'studio']),
  quotas: z.array(userQuotaSchema),
  total_quota_per_day: z.number().int(),
  total_used_today: z.number().int(),
  total_remaining: z.number().int(),
})

export const adminQuotaUpdateSchema = z.object({
  user_id: z.string(),
  model: z.string().optional(),
  quota_per_day: z.number().int().min(0).optional(),
  reset_at: z.string().datetime().optional(),
})

export const adminQuotaUpdateResponseSchema = z.object({
  user_id: z.string(),
  updated_quotas: z.array(userQuotaSchema),
  updated_at: z.string().datetime(),
})

export type UserQuota = z.infer<typeof userQuotaSchema>
export type QuotasResponse = z.infer<typeof quotasResponseSchema>
export type AdminQuotaUpdate = z.infer<typeof adminQuotaUpdateSchema>
export type AdminQuotaUpdateResponse = z.infer<typeof adminQuotaUpdateResponseSchema>
