# RHYTHMIX Platform — Schema Design Document

**Date:** 2026-06-25  
**Version:** 1.0.0  
**Status:** Ready for implementation

---

## Executive Summary

This schema powers the RHYTHMIX Platform backend, orchestrating video generation, quota management, webhooks, and premium features across all Wave 1/2 products. It is designed for **100k+ concurrent users**, **99.95% uptime**, and **<200ms p99 API latency**.

Key features:
- **Row-Level Security (RLS)** enforces tenant data isolation (users see only own data)
- **Partitioned UsageLogs** (monthly) for scalable analytics and easy archival
- **Webhook delivery audit trail** with retry retry strategy
- **Smart model routing** via ENUM types
- **Quota management** with daily reset automation

---

## Table Design Rationale

### 1. VideoGenerationJob

**Purpose:** Track all video generation requests from submission to completion.

**Columns:**
| Column | Type | Rationale |
|---|---|---|
| `id` | UUID | Globally unique job identifier (S3 key prefix) |
| `user_id` | UUID | FK to auth.users; enables RLS |
| `input_type` | TEXT | 'hyperframes' \| 'api' (schema flexibility) |
| `input_data` | JSONB | Polymorphic: {prompt, dimensions, params...}; indexed for range queries |
| `model` | model_name ENUM | Enforced: flux_pro, hunyuan_video, suno_v5, etc. |
| `tier` | subscription_tier | Free/Pro/Studio (denormalized for fast tier checks) |
| `status` | video_status ENUM | queued → processing → complete \| failed |
| `output_url` | TEXT | S3 path (e.g., `s3://outputs/user-id/job-id.mp4`) |
| `error_message` | TEXT | Failure reason (e.g., "Model quota exceeded") |
| `processing_time_sec` | INT | Duration (set on completion) |
| `cost_estimate` | FLOAT | Credits charged (for billing/analytics) |
| `created_at` | TIMESTAMP | Job submission time (UTC) |
| `completed_at` | TIMESTAMP | Job completion time (NULL until done) |
| `ttl_days` | INT | 30 (S3 Lifecycle Policy deletes output after 30d) |

**Indexes:**
- `(user_id)` — fast lookup of user's jobs
- `(status)` — filter queued/processing jobs (for admin dashboards)
- `(created_at DESC)` — recent jobs (pagination)
- `(model)` — usage by model (analytics)
- `(user_id, status)` — composite: "user's failed jobs"

**Why JSONB for input_data?**
- Hyperframes jobs have different params than API jobs (flexible schema)
- Indexed GIN support for `WHERE input_data->>'prompt' LIKE '%...'` queries
- Full content delivery to webhook consumers (webhooks need full input context)

**Why denormalize tier?**
- Avoid JOIN to users table on every job query
- Support RLS without accessing auth schema (encapsulation)

---

### 2. ModelQuota

**Purpose:** Enforce per-user, per-model rate limits (e.g., Free: 3 jobs/day, Pro: 20/day).

**Columns:**
| Column | Type | Rationale |
|---|---|---|
| `id` | UUID | Quota record ID |
| `user_id` | UUID | FK to auth.users; UNIQUE (one quota per user) |
| `model` | model_name | Model subject to quota (could expand to per-model quotas) |
| `quota_per_day` | INT | Limit (3 for free, 20 for pro) |
| `used_today` | INT | Counter (incremented on job submission, reset at midnight UTC) |
| `reset_at` | TIMESTAMP | Next reset time (calculated as tomorrow 00:00 UTC) |
| `created_at` | TIMESTAMP | Record creation |

**Constraint:**
```sql
CHECK (used_today >= 0 AND used_today <= quota_per_day)
```

Ensures counter never exceeds limit (database-level guarantee).

**Reset Automation:**
- Stored procedure / Edge Function runs daily at 00:00 UTC
- Increments `used_today = 0`, updates `reset_at`
- Must be idempotent (safe to run multiple times)

**Indexes:**
- `(user_id)` — RLS access
- `(reset_at)` — find quotas due to reset (daily cron)
- `(model)` — future: per-model quota analytics

---

### 3. PremiumFeature

**Purpose:** Gate advanced features based on subscription tier (e.g., `video_export_4k` for Studio tier only).

**Columns:**
| Column | Type | Rationale |
|---|---|---|
| `id` | UUID | Feature record ID |
| `user_id` | UUID | FK to auth.users |
| `feature_flag` | TEXT | Feature name (e.g., 'video_export_4k', 'unlimited_storage') |
| `tier` | subscription_tier | Pro/Studio (tier that enabled this) |
| `enabled` | BOOLEAN | True if user has access |
| `enabled_at` | TIMESTAMP | When feature was activated (for audits) |
| `created_at` | TIMESTAMP | Record creation |

**Unique constraint:**
```sql
UNIQUE (user_id, feature_flag)
```

Prevents duplicate feature flags per user.

**Usage pattern (API):**
```sql
-- Check if user can export 4K
SELECT enabled
FROM public.premium_features
WHERE user_id = $1 AND feature_flag = 'video_export_4k'
LIMIT 1;

-- If NULL → feature not enabled (deny)
-- If TRUE → allow
```

**Future: A/B testing**
- Add `rollout_pct` (0-100) for gradual rollouts
- Add `experiment_id` for tracking

---

### 4. WebhookSubscription

**Purpose:** Store webhook URLs + event subscriptions for async job notifications.

**Columns:**
| Column | Type | Rationale |
|---|---|---|
| `id` | UUID | Subscription ID |
| `user_id` | UUID | FK to auth.users |
| `webhook_url` | TEXT | HTTPS endpoint (e.g., `https://partner.com/rhythmix-webhook`) |
| `event_types` | webhook_event_type[] | Array: ['job.complete', 'job.failed', 'quota.limit_exceeded'] |
| `active` | BOOLEAN | True if webhook is subscribed (false = unsubscribed but data kept) |
| `secret_key` | TEXT | HMAC-SHA256 signing key (stored hashed in production) |
| `created_at` | TIMESTAMP | Registration time |
| `updated_at` | TIMESTAMP | Last modification |

**Event types (ENUM):**
```
'job.complete'         — Job finished successfully
'job.failed'           — Job failed (model error, quota, etc.)
'job.progress'         — (Future) progress updates during rendering
'quota.limit_exceeded' — User hit daily quota
```

**Secret key usage:**
```
Header: X-RHYTHMIX-Signature
Value: HMAC-SHA256(payload + secret_key)

Receiver verifies:
  expected = HMAC-SHA256(body + subscription.secret_key)
  actual = request.header('X-RHYTHMIX-Signature')
  assert_equal(expected, actual)  // timing-safe comparison
```

**Indexes:**
- `(user_id)` — list user's webhooks
- `(active)` — find active subscriptions (for delivery system)
- `(webhook_url)` — debug duplicate URLs

---

### 5. WebhookDelivery

**Purpose:** Audit log for all webhook HTTP requests (delivery attempts, retries, failures).

**Columns:**
| Column | Type | Rationale |
|---|---|---|
| `id` | UUID | Delivery record ID |
| `subscription_id` | UUID | FK to webhook_subscriptions (CASCADE delete) |
| `job_id` | UUID | FK to video_generation_jobs (CASCADE delete) |
| `event_type` | webhook_event_type | Which event triggered delivery |
| `payload` | JSONB | Full HTTP body sent (for replays) |
| `http_status` | INT | Response code (200, 408, 500, NULL for timeout) |
| `attempt_num` | INT | Retry count (1-5) |
| `created_at` | TIMESTAMP | When delivery was attempted |

**Retry strategy:**
```
Attempt 1: T+0   (immediate)
Attempt 2: T+1s  (after 1 sec)
Attempt 3: T+3s  (after 2 more sec)
Attempt 4: T+7s  (after 4 more sec)
Attempt 5: T+15s (after 8 more sec)

Total time: ~15 seconds max per event
```

**Constraint:**
```sql
CHECK (attempt_num >= 1 AND attempt_num <= 5)
```

**Query patterns:**
```sql
-- Admin dashboard: webhook delivery success rate
SELECT
  ws.webhook_url,
  COUNT(*) as total,
  COUNT(CASE WHEN http_status = 200 THEN 1 END) as successful,
  ROUND(100.0 * COUNT(CASE WHEN http_status = 200 THEN 1 END) / COUNT(*), 2) as success_pct
FROM public.webhook_subscriptions ws
JOIN public.webhook_deliveries wd ON ws.id = wd.subscription_id
WHERE ws.user_id = $1
GROUP BY ws.id, ws.webhook_url;

-- Replay failed delivery
SELECT payload FROM webhook_deliveries
WHERE subscription_id = $1 AND http_status != 200
ORDER BY created_at DESC;
```

---

### 6. UsageLogs (Partitioned)

**Purpose:** Audit trail for all video generation requests (analytics, billing, compliance).

**Columns:**
| Column | Type | Rationale |
|---|---|---|
| `id` | UUID | Log record ID |
| `user_id` | UUID | Who generated the video |
| `model` | model_name | Which model was used |
| `timestamp` | TIMESTAMP | When the job started |
| `duration_sec` | INT | How long the job took |
| `cost_credits` | FLOAT | Credits charged |
| `status` | TEXT | 'success', 'failure', 'partial' |
| `created_at` | TIMESTAMP | When log was written (PARTITION KEY) |

**Partitioning:**
```
Monthly range partitioning on created_at:
  2025-01: [2025-01-01, 2025-02-01)
  2025-02: [2025-02-01, 2025-03-01)
  ...
  2026-07: [2026-07-01, 2026-08-01)
  2026-08+ (future): [2026-08-01, MAXVALUE)
```

**Benefits:**
- **Query pruning** — SELECT * FROM usage_logs WHERE created_at > '2026-06-01' only scans June/July/August partitions
- **Archival** — SELECT * FROM usage_logs_2025_01 INTO archive_table; DROP TABLE usage_logs_2025_01
- **Maintenance** — Index bloat isolated per partition; REINDEX one partition without locking others
- **Performance** — 12 months of data split into 12 tables reduces sequential scans

**Indexes:**
- `(user_id)` — per-user usage breakdown
- `(model)` — model popularity analytics
- `(created_at DESC)` — recent logs first
- `(user_id, model)` — "user's usage of Flux vs Suno" queries

**Analytics queries:**
```sql
-- Daily revenue (all users)
SELECT
  DATE(created_at) as date,
  SUM(cost_credits) as total_revenue,
  COUNT(*) as num_jobs,
  AVG(duration_sec) as avg_duration_sec
FROM public.usage_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top models this month
SELECT
  model,
  COUNT(*) as jobs,
  SUM(cost_credits) as revenue,
  AVG(duration_sec) as avg_duration
FROM public.usage_logs
WHERE created_at > DATE_TRUNC('month', NOW())
GROUP BY model
ORDER BY revenue DESC;
```

---

## ENUM Types

### video_status
```
queued      — Waiting in job queue
processing  — Currently rendering
complete    — Finished successfully (output_url is set)
failed      — Failed (error_message is set)
```

### model_name
```
Image models:
  flux_pro, sana, stable_diffusion_3

Video models:
  hunyuan_video, runway_gen3, sora

Audio models:
  elevenlabs, kokoro_tts

Music models:
  suno_v5, musicgen
```

### subscription_tier
```
free     — 3 video jobs/day, standard models only
pro      — 20 video jobs/day, all models
studio   — Unlimited, priority queue, premium support
```

### webhook_event_type
```
job.complete
job.failed
job.progress (future)
quota.limit_exceeded
```

---

## Row-Level Security Strategy

### Philosophy
> **Users own their data. Admins see everything. Service role manages system tables.**

### Implementation

**User Policy (VideoGenerationJob):**
```sql
CREATE POLICY "Users can view own jobs"
  ON video_generation_jobs
  FOR SELECT
  USING (auth.uid() = user_id);
```

Translates to:
- `SELECT * FROM video_generation_jobs` → only returns user's own rows
- `DELETE * FROM video_generation_jobs` → 403 (no DELETE policy for users)
- `INSERT * INTO video_generation_jobs` → requires user_id = auth.uid()

**Admin Policy:**
```sql
CREATE POLICY "Admin can view all jobs"
  ON video_generation_jobs
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');
```

Admins bypass user isolation.

**Service Role Policy (for backend systems):**
```sql
CREATE POLICY "Service can create usage logs"
  ON usage_logs
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');
```

Backend jobs (Vercel Functions, Edge Functions) can write logs on behalf of users.

### Testing RLS

```sql
-- Simulate authenticated user
SET app.jwt.claims.sub = 'user-123';

-- This user sees only their own jobs
SELECT id, user_id FROM video_generation_jobs;
-- Result: only rows where user_id = 'user-123'

-- Reset
RESET app.jwt.claims.sub;
```

---

## Indexes Deep Dive

### Why index (user_id)?

✅ **Good:**
```sql
WHERE user_id = $1           -- B-tree scan: O(log n)
WHERE user_id = $1 AND status = 'processing'  -- Bitmap AND: O(log n) + O(log n)
```

❌ **Bad (without index):**
```sql
WHERE user_id = $1           -- Full table scan: O(n)
```

For 100M jobs, O(n) = 100M comparisons. O(log n) = ~27 comparisons.

### Composite Index: (user_id, status)

```sql
CREATE INDEX idx_video_jobs_user_status ON video_generation_jobs(user_id, status);
```

Enables fast:
- "Get user's queued jobs" → covers both user_id + status in one index
- "Get user's recent jobs" → covers user_id; status must be filtered post-index

Index order matters:
- Filter by user_id first (cardinality ~1M for 100M jobs)
- Then filter by status (cardinality ~4 for enum)
- Worst case: scan 1M entries, then filter to 25k

### Partial Index (future optimization)

```sql
-- Only index active webhooks (80% smaller index)
CREATE INDEX idx_webhooks_active
  ON webhook_subscriptions(user_id)
  WHERE active = TRUE;
```

---

## Quota Reset Automation

**Problem:** UsageLogs tracks consumption, but quotas must reset daily (midnight UTC).

**Solution:** Schedule daily job (run at 00:00 UTC):

```typescript
// api/cron/reset-quotas.ts (Vercel)
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY  // Bypass RLS
  );

  // Reset all overdue quotas
  const { data, error } = await supabase
    .from('model_quotas')
    .update({
      used_today: 0,
      reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000)  // tomorrow
    })
    .lt('reset_at', new Date());

  if (error) {
    console.error('Quota reset failed:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    message: 'Quotas reset successfully',
    count: data.length
  });
}
```

**Deployment (Vercel):**
```json
{
  "crons": [
    {
      "path": "/api/cron/reset-quotas",
      "schedule": "0 0 * * *"  // Daily at 00:00 UTC
    }
  ]
}
```

---

## Cost & Compliance

### Data Retention
- VideoGenerationJob: 90 days (audit), then deleted
- UsageLogs: 30 days hot (indexed), 90 days cold (S3), then deleted
- WebhookDelivery: 30 days (for replay/debugging)

### Encryption at Rest
- Supabase: All data encrypted via AWS KMS
- S3 outputs: Server-side encryption (SSE-S3)

### GDPR
- Add `deleted_at` soft delete to avoid cascades
- User deletion: soft-delete user_id references, keep audit logs

---

## Future Enhancements

### Phase 2 (Q3 2026)

1. **Cache table** — Cache generation results (SHA256(input+model))
   ```sql
   CREATE TABLE public.cache_entries (
     id UUID PRIMARY KEY,
     cache_key TEXT UNIQUE,
     job_id UUID REFERENCES video_generation_jobs,
     hit_count INT,
     last_accessed TIMESTAMP
   );
   ```

2. **Performance metrics** — Per-minute aggregation (for dashboards)
   ```sql
   CREATE TABLE public.performance_metrics (
     id UUID PRIMARY KEY,
     minute TIMESTAMP,
     model model_name,
     avg_processing_time_sec FLOAT,
     success_rate_pct FLOAT,
     p99_latency_ms INT
   );
   ```

3. **Audit log** — Full access log (who accessed what, when)
   ```sql
   CREATE TABLE public.audit_log (
     id UUID PRIMARY KEY,
     actor_id UUID,
     action TEXT,
     resource_id UUID,
     changes JSONB,
     created_at TIMESTAMP
   );
   ```

### Phase 3 (Q4 2026)

4. **Billing table** — Usage-based billing (per-user invoices)
5. **A/B testing** — Feature flag rollout % + experiment tracking
6. **Webhook filtering** — Per-event-type subscriptions (current is all-or-nothing)

---

## Testing Checklist

- [ ] Run migration on staging
- [ ] Verify all 6 tables exist
- [ ] Verify all ENUMs exist
- [ ] Verify partitions on UsageLogs (12 partitions)
- [ ] Verify RLS policies (30+ policies total)
- [ ] Insert test data (1 user, 1 job, 1 quota)
- [ ] Test RLS — user sees own jobs only
- [ ] Test RLS — user cannot see other user's jobs
- [ ] Test admin role — can see all data
- [ ] Load test (1000 concurrent job submissions)
- [ ] Verify indexes on hot tables (query plans use indexes)
- [ ] Check table sizes and index bloat

---

## References

- **ADR-0001:** HyperFrames over Remotion for Promos
- **CONTEXT.md:** Domain language (Promo, Cut, Hook, Narration)
- **requirements.md:** Full R1-R8 feature list
- **MIGRATION.md:** Step-by-step deployment guide
