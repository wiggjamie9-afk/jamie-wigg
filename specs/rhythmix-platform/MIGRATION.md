# RHYTHMIX Platform — Supabase Schema Migration Guide

**Date:** 2026-06-25  
**Schema Version:** 1.0.0  
**Target:** Supabase PostgreSQL 15+

---

## Overview

This migration creates the complete backend data model for the RHYTHMIX Platform, including:
- 6 core tables (VideoGenerationJob, ModelQuota, PremiumFeature, WebhookSubscription, WebhookDelivery, UsageLogs)
- 3 ENUM types for status, model names, subscription tiers, and webhook events
- Monthly partitioning on UsageLogs (created_at)
- Row-Level Security (RLS) policies enforcing user data isolation
- 4 helper views for common queries
- Comprehensive indexes for query performance

---

## Pre-Migration Checklist

- [ ] Backup current Supabase database (via Supabase dashboard → Backups tab)
- [ ] Test migration on a staging project first
- [ ] Ensure all connected services are paused (API, webhooks, etc.)
- [ ] Notify team: "Database maintenance 15 minutes"

---

## Running the Migration

### Option 1: Supabase SQL Editor (UI)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `schema.sql`
5. Paste into the editor
6. Click **Run** (or Cmd+Enter)
7. Wait for completion (60-90 seconds)
8. Verify output shows success (no errors)

### Option 2: Supabase CLI

```bash
# 1. Install/update Supabase CLI
npm install -g supabase

# 2. Login (if not already)
supabase login

# 3. Link to your project
supabase link --project-ref <your-project-ref>

# 4. Run migration
supabase db push < specs/rhythmix-platform/schema.sql
```

### Option 3: psql (direct PostgreSQL)

```bash
# 1. Get connection string from Supabase dashboard
#    Settings → Database → Connection string (URI)

# 2. Run migration
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  < specs/rhythmix-platform/schema.sql

# 3. Verify (should output: CREATE TABLE, CREATE INDEX, CREATE POLICY, etc.)
```

---

## Post-Migration Verification

### Check tables exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected output:**
```
 model_quotas
 premium_features
 usage_logs
 video_generation_jobs
 webhook_deliveries
 webhook_subscriptions
```

### Check ENUMs exist

```sql
SELECT typname FROM pg_type WHERE typname IN (
  'video_status', 'model_name', 'subscription_tier', 'webhook_event_type'
);
```

**Expected output:**
```
 model_name
 subscription_tier
 video_status
 webhook_event_type
```

### Check indexes

```sql
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;
```

**Expected:** 20+ indexes (listed below)

### Check RLS enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** All tables should show `rowsecurity = t`

### Check partitions on usage_logs

```sql
SELECT schemaname, tablename FROM pg_tables
WHERE tablename LIKE 'usage_logs_%'
ORDER BY tablename;
```

**Expected output:**
```
 public | usage_logs_2025_01
 public | usage_logs_2025_02
 ...
 public | usage_logs_2026_07
 public | usage_logs_future
```

---

## Index Reference

**VideoGenerationJob indexes:**
- `idx_video_jobs_user_id` — fast lookup by user
- `idx_video_jobs_status` — filter by status (queued, processing, etc.)
- `idx_video_jobs_created_at` — recent jobs
- `idx_video_jobs_model` — usage by model
- `idx_video_jobs_user_status` — composite: user + status

**ModelQuota indexes:**
- `idx_model_quotas_user_id`
- `idx_model_quotas_reset_at` — find quotas due to reset
- `idx_model_quotas_model`

**PremiumFeature indexes:**
- `idx_premium_features_user_id`
- `idx_premium_features_feature_flag`
- `idx_premium_features_tier`
- `idx_premium_features_enabled`

**WebhookSubscription indexes:**
- `idx_webhook_subscriptions_user_id`
- `idx_webhook_subscriptions_active`
- `idx_webhook_subscriptions_webhook_url`

**WebhookDelivery indexes:**
- `idx_webhook_deliveries_subscription_id`
- `idx_webhook_deliveries_job_id`
- `idx_webhook_deliveries_created_at`
- `idx_webhook_deliveries_http_status`

**UsageLogs indexes:**
- `idx_usage_logs_user_id`
- `idx_usage_logs_model`
- `idx_usage_logs_created_at`
- `idx_usage_logs_user_model`

---

## RLS Policy Reference

### VideoGenerationJob

| Who | Action | Effect |
|---|---|---|
| User | SELECT | Own jobs only |
| User | INSERT | Own jobs only |
| User | UPDATE | Own queued jobs only (cancel) |
| Admin | SELECT/UPDATE/DELETE | All jobs |

### ModelQuota

| Who | Action | Effect |
|---|---|---|
| User | SELECT | Own quota only |
| User | UPDATE | Blocked (system-managed) |
| Service | INSERT/UPDATE | Manage quotas |
| Admin | SELECT/UPDATE | All quotas |

### PremiumFeature

| Who | Action | Effect |
|---|---|---|
| User | SELECT | Own features only |
| Admin | SELECT/INSERT/UPDATE/DELETE | All features |

### WebhookSubscription

| Who | Action | Effect |
|---|---|---|
| User | SELECT | Own webhooks only |
| User | INSERT/UPDATE/DELETE | Own webhooks only |
| Service | SELECT | All webhooks (for delivery) |
| Admin | SELECT/UPDATE/DELETE | All webhooks |

### WebhookDelivery

| Who | Action | Effect |
|---|---|---|
| User | SELECT | Own subscription deliveries only |
| Service | INSERT | Create delivery records |
| Admin | SELECT/DELETE | All deliveries |

### UsageLogs

| Who | Action | Effect |
|---|---|---|
| User | SELECT | Own logs only |
| Service | INSERT | Create log entries |
| Admin | SELECT/DELETE | All logs |

---

## Quota Reset Automation

The schema stores `reset_at` in ModelQuota, but the actual reset (incrementing `used_today` back to 0) requires a backend job:

```sql
-- Example: Run daily at 00:00 UTC
UPDATE public.model_quotas
SET used_today = 0, reset_at = NOW() + INTERVAL '1 day'
WHERE reset_at <= NOW();
```

Implement this as:
1. **Vercel Cron Function** — `api/cron/reset-quotas.ts`
2. **Supabase Edge Function** — `functions/reset-quotas/`
3. **External job scheduler** (e.g., Temporal, node-cron)

---

## Webhook Delivery System

The schema supports webhook delivery, but the actual HTTP requests + retries are backend logic:

```
1. User registers webhook → stored in webhook_subscriptions
2. Job completes → emit event (job.complete, job.failed, etc.)
3. Backend queries active subscriptions for user
4. For each subscription:
   - POST to webhook_url with HMAC-SHA256 signature
   - Store attempt in webhook_deliveries
   - On failure: retry with exponential backoff (1s, 2s, 4s, 8s)
   - Max 5 attempts per event
```

Implement as:
- **Supabase Edge Function** with pg_boss queue
- **Vercel Function + Redis** (Bull job queue)
- **Dedicated Node service** (consume Supabase trigger → HTTP)

---

## UsageLogs Partitioning

The table is partitioned monthly by `created_at`:

```
2025-01 partition → data from 2025-01-01 to 2025-01-31
2025-02 partition → data from 2025-02-01 to 2025-02-28
...
2026-07 partition → data from 2026-07-01 to 2026-07-31
2026-08+ partition → future dates (default catchall)
```

**Benefits:**
- Faster queries on time ranges (query planner skips irrelevant partitions)
- Easy archival (SELECT * FROM usage_logs_2025_01, then drop the partition)
- Reduced index bloat (each partition has its own indexes)

**Adding future partitions** (e.g., 2026-08):
```sql
CREATE TABLE public.usage_logs_2026_08 PARTITION OF public.usage_logs
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
```

---

## Rollback Plan

If migration fails, rollback using Supabase backup:

1. **Dashboard** → Backups tab → click backup before migration
2. **Restore** (warning: all changes since backup are lost)

Or manually drop tables:

```sql
-- CAUTION: Deletes all data
DROP TABLE IF EXISTS public.webhook_deliveries CASCADE;
DROP TABLE IF EXISTS public.webhook_subscriptions CASCADE;
DROP TABLE IF EXISTS public.premium_features CASCADE;
DROP TABLE IF EXISTS public.model_quotas CASCADE;
DROP TABLE IF EXISTS public.usage_logs CASCADE;
DROP TABLE IF EXISTS public.video_generation_jobs CASCADE;

DROP TYPE IF EXISTS webhook_event_type;
DROP TYPE IF EXISTS subscription_tier;
DROP TYPE IF EXISTS model_name;
DROP TYPE IF EXISTS video_status;
```

---

## Monitoring Post-Migration

### Check table sizes

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check RLS policy count

```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected:** 5-7 policies per table

### Test RLS (simulate authenticated user)

```sql
-- Switch to authenticated role
SET ROLE authenticated;
SET app.jwt.claims.sub = 'test-user-id';

-- Try SELECT (should return only own data)
SELECT id, user_id FROM public.video_generation_jobs LIMIT 1;

-- Reset
RESET ROLE;
RESET app.jwt.claims.sub;
```

---

## Performance Tuning (Optional)

### Enable table statistics

```sql
-- Analyze all tables (helps query planner)
ANALYZE public.video_generation_jobs;
ANALYZE public.model_quotas;
ANALYZE public.premium_features;
ANALYZE public.webhook_subscriptions;
ANALYZE public.webhook_deliveries;
ANALYZE public.usage_logs;
```

### Enable auto-ANALYZE

```sql
ALTER TABLE public.video_generation_jobs SET (autovacuum_analyze_scale_factor = 0.01);
ALTER TABLE public.usage_logs SET (autovacuum_analyze_scale_factor = 0.01);
```

### Check slow queries

```sql
-- Supabase dashboard → Logs → PostgreSQL → query_duration
-- Monitor any query >1000ms for index tuning
```

---

## Next Steps

1. **Seed test data** (for development/testing)
   ```sql
   -- Insert test user quota
   INSERT INTO public.model_quotas (user_id, model, quota_per_day, reset_at)
   VALUES ('test-user-uuid', 'flux_pro', 20, NOW() + INTERVAL '1 day');
   ```

2. **Configure webhooks** (register test URL)
   ```bash
   # POST /api/webhooks/register
   curl -X POST http://localhost:3000/api/webhooks/register \
     -H "Authorization: Bearer $JWT_TOKEN" \
     -d '{
       "webhook_url": "https://example.com/webhook",
       "event_types": ["job.complete", "job.failed"]
     }'
   ```

3. **Deploy backend API** (consumes schema)
   - Implement endpoints: POST /api/generate/video, GET /api/quotas, etc.
   - Set up job queue (pg_boss, Bull, Temporal)
   - Configure webhook delivery system

4. **Monitor in production**
   - Set up Datadog/Sentry for errors
   - Alert on quota resets, webhook failures
   - Track API latency (target: <200ms p99)

---

## Support

**Questions?**
- Review `CONTEXT.md` for domain language
- Check `docs/adr/` for architecture decisions
- Reach out: jamie.jack.28@hotmail.com
