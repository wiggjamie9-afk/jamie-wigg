import { z } from 'zod'

/**
 * Zod schemas for model API
 */

export const modelMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['image', 'video', 'audio', 'music']),
  cost_per_request: z.number(),
  supported_dimensions: z.array(z.string()),
  max_duration: z.number().int().optional(),
  max_prompt_length: z.number().int().optional(),
  tiers: z.array(z.enum(['free', 'pro', 'studio'])),
  status: z.enum(['online', 'offline', 'degraded']),
  latency_p99: z.number().int(), // milliseconds
  fallback: z.string().optional(),
  deprecated: z.boolean().optional(),
})

export const modelsAvailableResponseSchema = z.object({
  user_tier: z.enum(['free', 'pro', 'studio']),
  models: z.array(modelMetadataSchema),
  total_count: z.number().int(),
})

export const modelInfoResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['image', 'video', 'audio', 'music']),
  description: z.string().optional(),
  cost_per_request: z.number(),
  supported_dimensions: z.array(z.string()),
  supported_parameters: z.record(z.string()),
  max_duration: z.number().int().optional(),
  max_prompt_length: z.number().int().optional(),
  tiers: z.array(z.enum(['free', 'pro', 'studio'])),
  status: z.enum(['online', 'offline', 'degraded']),
  latency_p99: z.number().int(),
  success_rate: z.number().min(0).max(1), // 0-1
  average_latency: z.number().int(),
  fallback_chain: z.array(z.string()).optional(),
  deprecated: z.boolean().optional(),
  deprecation_date: z.string().datetime().optional(),
})

export type ModelMetadata = z.infer<typeof modelMetadataSchema>
export type ModelsAvailableResponse = z.infer<typeof modelsAvailableResponseSchema>
export type ModelInfoResponse = z.infer<typeof modelInfoResponseSchema>
