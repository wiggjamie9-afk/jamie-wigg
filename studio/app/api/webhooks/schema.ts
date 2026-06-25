import { z } from 'zod'

/**
 * Zod schemas for webhooks API
 */

export const webhookSubscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string(),
  webhook_url: z.string().url(),
  event_types: z.array(z.enum(['job.queued', 'job.processing', 'job.complete', 'job.failed', 'job.cancelled'])),
  secret_key: z.string(),
  active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const createWebhookSubscriptionSchema = z.object({
  webhook_url: z.string().url(),
  event_types: z.array(z.enum(['job.queued', 'job.processing', 'job.complete', 'job.failed', 'job.cancelled'])),
})

export const updateWebhookSubscriptionSchema = z.object({
  webhook_url: z.string().url().optional(),
  event_types: z.array(z.enum(['job.queued', 'job.processing', 'job.complete', 'job.failed', 'job.cancelled'])).optional(),
  active: z.boolean().optional(),
})

export const webhookDeliverySchema = z.object({
  id: z.string().uuid(),
  subscription_id: z.string().uuid(),
  job_id: z.string().uuid().optional(),
  event_type: z.string(),
  payload: z.record(z.unknown()),
  http_status: z.number().int().optional(),
  attempt_num: z.number().int(),
  next_retry_at: z.string().datetime().optional(),
  delivered_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
})

export const listWebhooksResponseSchema = z.object({
  subscriptions: z.array(webhookSubscriptionSchema),
  total_count: z.number().int(),
})

export const webhookEventSchema = z.object({
  event_type: z.string(),
  timestamp: z.string().datetime(),
  job_id: z.string().uuid(),
  user_id: z.string(),
  data: z.record(z.unknown()),
})

export type WebhookSubscription = z.infer<typeof webhookSubscriptionSchema>
export type CreateWebhookSubscription = z.infer<typeof createWebhookSubscriptionSchema>
export type UpdateWebhookSubscription = z.infer<typeof updateWebhookSubscriptionSchema>
export type WebhookDelivery = z.infer<typeof webhookDeliverySchema>
export type ListWebhooksResponse = z.infer<typeof listWebhooksResponseSchema>
export type WebhookEvent = z.infer<typeof webhookEventSchema>
