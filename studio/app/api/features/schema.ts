import { z } from 'zod'

/**
 * Zod schemas for features API
 */

export const featureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  enabled: z.boolean(),
  tier: z.enum(['free', 'pro', 'studio']),
})

export const featuresResponseSchema = z.object({
  user_id: z.string(),
  tier: z.enum(['free', 'pro', 'studio']),
  enabled_features: z.array(z.string()),
  available_features: z.array(featureSchema),
})

export type Feature = z.infer<typeof featureSchema>
export type FeaturesResponse = z.infer<typeof featuresResponseSchema>
