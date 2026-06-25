import { z } from 'zod'

/**
 * Zod schemas for video generation API
 */

export const generateVideoInputSchema = z.object({
  model: z.enum(['flux', 'hunyuan-video', 'runway-gen3', 'sano']).optional().default('flux'),
  input: z.object({
    prompt: z.string().min(1).max(2000),
    dimensions: z.enum(['1920x1080', '1080x1920', '1080x1080']).optional().default('1920x1080'),
    duration: z.number().int().min(1).max(60).optional().default(10),
    style: z.string().optional(),
    seed: z.number().int().optional(),
  }),
  cache_check: z.boolean().optional().default(true),
})

export const generateVideoResponseSchema = z.object({
  job_id: z.string().uuid(),
  status: z.enum(['queued', 'processing', 'complete', 'failed', 'cancelled']),
  queue_position: z.number().int().optional(),
  estimated_completion_time: z.number().int().optional(), // ms
  created_at: z.string().datetime(),
})

export const jobStatusResponseSchema = z.object({
  job_id: z.string().uuid(),
  user_id: z.string(),
  model: z.string(),
  status: z.enum(['queued', 'processing', 'complete', 'failed', 'cancelled']),
  queue_position: z.number().int().optional(),
  progress_percent: z.number().int().min(0).max(100).optional(),
  output_url: z.string().url().optional(),
  error_message: z.string().optional(),
  processing_time_ms: z.number().int().optional(),
  cost_estimate: z.number().optional(),
  cached: z.boolean().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const jobHistoryResponseSchema = z.object({
  jobs: z.array(jobStatusResponseSchema),
  total_count: z.number().int(),
  next_cursor: z.string().optional(),
})

export const cancelJobResponseSchema = z.object({
  job_id: z.string().uuid(),
  status: z.literal('cancelled'),
  cancelled_at: z.string().datetime(),
})

export type GenerateVideoInput = z.infer<typeof generateVideoInputSchema>
export type GenerateVideoResponse = z.infer<typeof generateVideoResponseSchema>
export type JobStatusResponse = z.infer<typeof jobStatusResponseSchema>
export type JobHistoryResponse = z.infer<typeof jobHistoryResponseSchema>
export type CancelJobResponse = z.infer<typeof cancelJobResponseSchema>
