-- RHYTHMIX Platform — Supabase Schema
-- Tables: VideoGenerationJob, ModelQuota, PremiumFeature, WebhookSubscription, WebhookDelivery, UsageLogs
-- Partitioning: UsageLogs (monthly by created_at)
-- RLS: users see own data; admin sees all
-- Indexes: user_id, status, created_at for fast lookups
--
-- Migration: Run once on target Supabase project
-- Author: Claude Code (Agent)
-- Date: 2026-06-25

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE video_status AS ENUM ('queued', 'processing', 'complete', 'failed');
CREATE TYPE model_name AS ENUM (
  'flux_pro',        -- FLUX 1.1 Pro (image)
  'sana',            -- Sana (image)
  'stable_diffusion_3',  -- Stable Diffusion 3 (image)
  'hunyuan_video',   -- HunyuanVideo (video)
  'runway_gen3',     -- Runway Gen-3 (video)
  'sora',            -- Sora (video)
  'suno_v5',         -- Suno v5 (music)
  'musicgen',        -- MusicGen (music)
  'elevenlabs',      -- ElevenLabs (audio)
  'kokoro_tts'       -- Kokoro TTS (audio)
);
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'studio');
CREATE TYPE webhook_event_type AS ENUM (
  'job.complete',
  'job.failed',
  'job.progress',
  'quota.limit_exceeded'
);

-- ============================================================================
-- VideoGenerationJob table
-- ============================================================================

CREATE TABLE public.video_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- FK to auth.users
  input_type TEXT NOT NULL CHECK (input_type IN ('hyperframes', 'api')),
  input_data JSONB NOT NULL,  -- {prompt, dimensions, model_params, ...}
  model model_name NOT NULL,
  tier subscription_tier NOT NULL DEFAULT 'free',
  status video_status NOT NULL DEFAULT 'queued',
  output_url TEXT,  -- S3 path, NULL until complete
  error_message TEXT,  -- if status = failed
  processing_time_sec INTEGER,  -- set on completion
  cost_estimate FLOAT NOT NULL DEFAULT 0.0,  -- in credits
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ttl_days INTEGER NOT NULL DEFAULT 30  -- for S3 lifecycle policy
);

-- Indexes for frequent queries
CREATE INDEX idx_video_jobs_user_id ON public.video_generation_jobs(user_id);
CREATE INDEX idx_video_jobs_status ON public.video_generation_jobs(status);
CREATE INDEX idx_video_jobs_created_at ON public.video_generation_jobs(created_at DESC);
CREATE INDEX idx_video_jobs_model ON public.video_generation_jobs(model);
CREATE INDEX idx_video_jobs_user_status ON public.video_generation_jobs(user_id, status);

-- ============================================================================
-- ModelQuota table
-- ============================================================================

CREATE TABLE public.model_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,  -- one quota per user
  model model_name NOT NULL,
  quota_per_day INTEGER NOT NULL DEFAULT 0,
  used_today INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT quota_check CHECK (used_today >= 0 AND used_today <= quota_per_day)
);

-- Indexes
CREATE INDEX idx_model_quotas_user_id ON public.model_quotas(user_id);
CREATE INDEX idx_model_quotas_reset_at ON public.model_quotas(reset_at);
CREATE INDEX idx_model_quotas_model ON public.model_quotas(model);

-- ============================================================================
-- PremiumFeature table
-- ============================================================================

CREATE TABLE public.premium_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feature_flag TEXT NOT NULL,  -- 'video_export_4k', 'unlimited_storage', etc.
  tier subscription_tier NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  enabled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, feature_flag)  -- one feature flag per user
);

-- Indexes
CREATE INDEX idx_premium_features_user_id ON public.premium_features(user_id);
CREATE INDEX idx_premium_features_feature_flag ON public.premium_features(feature_flag);
CREATE INDEX idx_premium_features_tier ON public.premium_features(tier);
CREATE INDEX idx_premium_features_enabled ON public.premium_features(enabled);

-- ============================================================================
-- WebhookSubscription table
-- ============================================================================

CREATE TABLE public.webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  webhook_url TEXT NOT NULL,
  event_types webhook_event_type[] NOT NULL,  -- array of events
  active BOOLEAN NOT NULL DEFAULT TRUE,
  secret_key TEXT NOT NULL,  -- for HMAC-SHA256 signing
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_webhook_subscriptions_user_id ON public.webhook_subscriptions(user_id);
CREATE INDEX idx_webhook_subscriptions_active ON public.webhook_subscriptions(active);
CREATE INDEX idx_webhook_subscriptions_webhook_url ON public.webhook_subscriptions(webhook_url);

-- ============================================================================
-- WebhookDelivery table (audit log for webhook attempts)
-- ============================================================================

CREATE TABLE public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.webhook_subscriptions(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.video_generation_jobs(id) ON DELETE CASCADE,
  event_type webhook_event_type NOT NULL,
  payload JSONB NOT NULL,  -- {job_id, status, output_url, ...}
  http_status INTEGER,  -- HTTP response code (200, 500, timeout, etc.)
  attempt_num INTEGER NOT NULL CHECK (attempt_num >= 1 AND attempt_num <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_webhook_deliveries_subscription_id ON public.webhook_deliveries(subscription_id);
CREATE INDEX idx_webhook_deliveries_job_id ON public.webhook_deliveries(job_id);
CREATE INDEX idx_webhook_deliveries_created_at ON public.webhook_deliveries(created_at DESC);
CREATE INDEX idx_webhook_deliveries_http_status ON public.webhook_deliveries(http_status);

-- ============================================================================
-- UsageLogs table (partitioned monthly by created_at)
-- ============================================================================

-- Parent table (partitioned)
CREATE TABLE public.usage_logs (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  model model_name NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  cost_credits FLOAT NOT NULL DEFAULT 0.0,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'partial')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Indexes on parent (inherited by partitions)
CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_model ON public.usage_logs(model);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at DESC);
CREATE INDEX idx_usage_logs_user_model ON public.usage_logs(user_id, model);

-- Monthly partitions (2025 and forward)
-- Partition 2025-01
CREATE TABLE public.usage_logs_2025_01 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Partition 2025-02
CREATE TABLE public.usage_logs_2025_02 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Partition 2025-03
CREATE TABLE public.usage_logs_2025_03 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Partition 2025-04
CREATE TABLE public.usage_logs_2025_04 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

-- Partition 2025-05
CREATE TABLE public.usage_logs_2025_05 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

-- Partition 2025-06
CREATE TABLE public.usage_logs_2025_06 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');

-- Partition 2025-07
CREATE TABLE public.usage_logs_2025_07 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

-- Partition 2025-08
CREATE TABLE public.usage_logs_2025_08 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

-- Partition 2025-09
CREATE TABLE public.usage_logs_2025_09 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');

-- Partition 2025-10
CREATE TABLE public.usage_logs_2025_10 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- Partition 2025-11
CREATE TABLE public.usage_logs_2025_11 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- Partition 2025-12
CREATE TABLE public.usage_logs_2025_12 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Partition 2026-01
CREATE TABLE public.usage_logs_2026_01 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Partition 2026-02
CREATE TABLE public.usage_logs_2026_02 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Partition 2026-03
CREATE TABLE public.usage_logs_2026_03 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Partition 2026-04
CREATE TABLE public.usage_logs_2026_04 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

-- Partition 2026-05
CREATE TABLE public.usage_logs_2026_05 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

-- Partition 2026-06
CREATE TABLE public.usage_logs_2026_06 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

-- Partition 2026-07
CREATE TABLE public.usage_logs_2026_07 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- Catchall for future dates (default partition)
CREATE TABLE public.usage_logs_future PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-08-01') TO (MAXVALUE);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.video_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VideoGenerationJob RLS
-- ============================================================================

-- Users can SELECT their own jobs
CREATE POLICY "Users can view own jobs" ON public.video_generation_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can INSERT their own jobs
CREATE POLICY "Users can create own jobs" ON public.video_generation_jobs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE their own queued jobs (cancel)
CREATE POLICY "Users can cancel own queued jobs" ON public.video_generation_jobs
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'queued')
  WITH CHECK (auth.uid() = user_id);

-- Admin can SELECT all jobs
CREATE POLICY "Admin can view all jobs" ON public.video_generation_jobs
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Admin can UPDATE any job
CREATE POLICY "Admin can update any job" ON public.video_generation_jobs
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Admin can DELETE any job
CREATE POLICY "Admin can delete any job" ON public.video_generation_jobs
  FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');

-- ============================================================================
-- ModelQuota RLS
-- ============================================================================

-- Users can SELECT their own quota
CREATE POLICY "Users can view own quota" ON public.model_quotas
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can UPDATE their own quota (via internal trigger only, policy restricts)
CREATE POLICY "Users cannot directly update quota" ON public.model_quotas
  FOR UPDATE
  USING (FALSE);

-- Admin can SELECT all quotas
CREATE POLICY "Admin can view all quotas" ON public.model_quotas
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Admin can UPDATE all quotas
CREATE POLICY "Admin can update any quota" ON public.model_quotas
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Service role can INSERT/UPDATE quotas (for trigger/job system)
CREATE POLICY "Service can manage quotas" ON public.model_quotas
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- ============================================================================
-- PremiumFeature RLS
-- ============================================================================

-- Users can SELECT their own features
CREATE POLICY "Users can view own features" ON public.premium_features
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can SELECT all features
CREATE POLICY "Admin can view all features" ON public.premium_features
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Admin can INSERT features
CREATE POLICY "Admin can add features" ON public.premium_features
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Admin can UPDATE features
CREATE POLICY "Admin can update features" ON public.premium_features
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Admin can DELETE features
CREATE POLICY "Admin can delete features" ON public.premium_features
  FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');

-- ============================================================================
-- WebhookSubscription RLS
-- ============================================================================

-- Users can SELECT their own webhooks
CREATE POLICY "Users can view own webhooks" ON public.webhook_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can INSERT their own webhooks
CREATE POLICY "Users can create webhooks" ON public.webhook_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE their own webhooks
CREATE POLICY "Users can update own webhooks" ON public.webhook_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can DELETE their own webhooks
CREATE POLICY "Users can delete own webhooks" ON public.webhook_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin can SELECT all webhooks
CREATE POLICY "Admin can view all webhooks" ON public.webhook_subscriptions
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Admin can UPDATE any webhook
CREATE POLICY "Admin can update any webhook" ON public.webhook_subscriptions
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Admin can DELETE any webhook
CREATE POLICY "Admin can delete any webhook" ON public.webhook_subscriptions
  FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');

-- Service role can SELECT all webhooks (for delivery system)
CREATE POLICY "Service can query webhooks" ON public.webhook_subscriptions
  FOR SELECT
  USING (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- ============================================================================
-- WebhookDelivery RLS
-- ============================================================================

-- Users can SELECT deliveries for their own subscriptions
CREATE POLICY "Users can view own webhook deliveries" ON public.webhook_deliveries
  FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM public.webhook_subscriptions
      WHERE user_id = auth.uid()
    )
  );

-- Admin can SELECT all deliveries
CREATE POLICY "Admin can view all webhook deliveries" ON public.webhook_deliveries
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Service role can INSERT deliveries (for webhook delivery system)
CREATE POLICY "Service can create webhook deliveries" ON public.webhook_deliveries
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- Admin can DELETE old deliveries (cleanup)
CREATE POLICY "Admin can delete old deliveries" ON public.webhook_deliveries
  FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');

-- ============================================================================
-- UsageLogs RLS
-- ============================================================================

-- Users can SELECT their own logs
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can INSERT logs (for analytics system)
CREATE POLICY "Service can create usage logs" ON public.usage_logs
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- Admin can SELECT all logs
CREATE POLICY "Admin can view all usage logs" ON public.usage_logs
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Admin can DELETE old logs (cleanup/archival)
CREATE POLICY "Admin can delete old logs" ON public.usage_logs
  FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');

-- ============================================================================
-- HELPER VIEWS (for easier querying)
-- ============================================================================

-- Current user's quota with remaining usage
CREATE OR REPLACE VIEW public.user_quota_status AS
SELECT
  mq.id,
  mq.user_id,
  mq.model,
  mq.quota_per_day,
  mq.used_today,
  mq.quota_per_day - mq.used_today AS remaining_quota,
  mq.reset_at,
  (mq.reset_at > NOW()) AS resets_soon
FROM public.model_quotas mq;

-- User's recent jobs with status
CREATE OR REPLACE VIEW public.user_recent_jobs AS
SELECT
  vgj.id,
  vgj.user_id,
  vgj.model,
  vgj.status,
  vgj.output_url,
  vgj.cost_estimate,
  vgj.processing_time_sec,
  vgj.created_at,
  vgj.completed_at,
  (vgj.completed_at - vgj.created_at) AS actual_duration
FROM public.video_generation_jobs vgj
ORDER BY vgj.created_at DESC;

-- Webhook delivery summary (for monitoring)
CREATE OR REPLACE VIEW public.webhook_delivery_summary AS
SELECT
  ws.id AS subscription_id,
  ws.user_id,
  ws.webhook_url,
  COUNT(*) AS total_deliveries,
  COUNT(CASE WHEN wd.http_status = 200 THEN 1 END) AS successful_deliveries,
  COUNT(CASE WHEN wd.http_status != 200 THEN 1 END) AS failed_deliveries,
  MAX(wd.created_at) AS last_delivery_at,
  ROUND(
    COUNT(CASE WHEN wd.http_status = 200 THEN 1 END)::NUMERIC /
    NULLIF(COUNT(*), 0) * 100, 2
  ) AS success_rate_pct
FROM public.webhook_subscriptions ws
LEFT JOIN public.webhook_deliveries wd ON ws.id = wd.subscription_id
GROUP BY ws.id, ws.user_id, ws.webhook_url;

-- Usage stats by model (admin view)
CREATE OR REPLACE VIEW public.model_usage_stats AS
SELECT
  model,
  COUNT(*) AS total_jobs,
  COUNT(CASE WHEN status = 'complete' THEN 1 END) AS completed_jobs,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) AS failed_jobs,
  ROUND(
    COUNT(CASE WHEN status = 'complete' THEN 1 END)::NUMERIC /
    NULLIF(COUNT(*), 0) * 100, 2
  ) AS success_rate_pct,
  ROUND(AVG(processing_time_sec)::NUMERIC, 2) AS avg_processing_sec,
  ROUND(SUM(cost_estimate)::NUMERIC, 2) AS total_cost_credits
FROM public.video_generation_jobs
GROUP BY model;

-- ============================================================================
-- GRANTS (for Supabase auth schema integration)
-- ============================================================================

-- Grant default privileges so new users can access these tables
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_generation_jobs TO authenticated;
GRANT SELECT ON public.video_generation_jobs TO anon;

GRANT SELECT ON public.model_quotas TO authenticated;
GRANT SELECT ON public.model_quotas TO anon;

GRANT SELECT ON public.premium_features TO authenticated;
GRANT SELECT ON public.premium_features TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhook_subscriptions TO authenticated;
GRANT SELECT ON public.webhook_subscriptions TO anon;

GRANT SELECT ON public.webhook_deliveries TO authenticated;
GRANT SELECT ON public.webhook_deliveries TO anon;

GRANT SELECT, INSERT ON public.usage_logs TO authenticated;
GRANT SELECT ON public.usage_logs TO anon;

-- Views
GRANT SELECT ON public.user_quota_status TO authenticated;
GRANT SELECT ON public.user_recent_jobs TO authenticated;
GRANT SELECT ON public.webhook_delivery_summary TO authenticated;
GRANT SELECT ON public.model_usage_stats TO authenticated;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. UsageLogs partitioning strategy:
--    - Monthly partitions by created_at (RANGE partitioning)
--    - Improves query performance for time-range queries
--    - Enables easy archival (move old partitions to S3/Glacier)
--    - Partitions: 2025-01 through 2026-08 (future catchall)

-- 2. Quota reset logic:
--    - reset_at is calculated as "today at 00:00:00 UTC + 1 day"
--    - Backend job runs at midnight UTC to reset quotas
--    - used_today counts resets automatically via job update

-- 3. Webhook delivery retry strategy:
--    - attempt_num 1-5 (max 5 retries per event)
--    - Exponential backoff: 1s, 2s, 4s, 8s (handled in backend)
--    - Each attempt logged in webhook_deliveries for audit

-- 4. VideoGenerationJob TTL:
--    - ttl_days = 30 (S3 Lifecycle Policy deletes after 30d)
--    - Database record kept for 90d (audit), then archived

-- 5. RLS Strategy:
--    - Users see only own data (auth.uid() = user_id)
--    - Admin role (auth.jwt()->>'role' = 'admin') sees all
--    - Service role (auth.jwt()->>'role' = 'service_role') can manage system data
--    - Anon users get SELECT access to allow public model endpoints

-- 6. Future enhancements:
--    - Add audit_log table for compliance
--    - Add cache_entries table (Redis + DB hybrid)
--    - Add performance_metrics table (with per-minute aggregation)
--    - Implement database triggers for quota auto-reset
