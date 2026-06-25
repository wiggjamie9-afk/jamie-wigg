# RHYTHMIX Platform Schema — Quick Reference

**Last Updated:** 2026-06-25  
**Schema Version:** 1.0.0

---

## File Manifest

| File | Size | Purpose |
|------|------|---------|
| `schema.sql` | 23 KB | **Complete DDL** — run this to create all tables, ENUMs, indexes, RLS policies |
| `MIGRATION.md` | 11 KB | Step-by-step deployment guide (CLI, UI, psql methods) |
| `SCHEMA-DESIGN.md` | 17 KB | Design rationale, index strategy, RLS philosophy, future enhancements |
| `requirements.md` | 11 KB | Functional requirements (R1-R8: jobs, models, quotas, webhooks, etc.) |

---

## Tables at a Glance

| Table | Rows | Purpose | Partitioned? |
|-------|------|---------|---|
| `video_generation_jobs` | 100M+ | Track all job submissions & completion | No |
| `model_quotas` | 1M | Rate limits (free: 3/day, pro: 20/day) | No |
| `premium_features` | 10M | Feature gates (e.g., 4K export) | No |
| `webhook_subscriptions` | 100K | User webhook URLs + events | No |
| `webhook_deliveries` | 10M | Audit log (delivery attempts, retries) | No |
| `usage_logs` | 1B+ | Analytics (all API calls) | **Yes** — monthly |

---

## Quick Copy-Paste Queries

### Get user's recent jobs
```sql
SELECT id, model, status, created_at, output_url
FROM video_generation_jobs
WHERE user_id = 'user-123'
ORDER BY created_at DESC
LIMIT 10;
```

### Check user's quota
```sql
SELECT
  user_id,
  model,
  quota_per_day,
  used_today,
  quota_per_day - used_today AS remaining,
  reset_at
FROM model_quotas
WHERE user_id = 'user-123';
```

### List user's webhooks
```sql
SELECT id, webhook_url, event_types, active, created_at
FROM webhook_subscriptions
WHERE user_id = 'user-123' AND active = TRUE;
```

### Webhook delivery success rate
```sql
SELECT
  ws.webhook_url,
  COUNT(*) as total_deliveries,
  COUNT(CASE WHEN http_status = 200 THEN 1 END) as successful,
  ROUND(100.0 * COUNT(CASE WHEN http_status = 200 THEN 1 END) / COUNT(*), 2) as success_pct
FROM webhook_subscriptions ws
JOIN webhook_deliveries wd ON ws.id = wd.subscription_id
WHERE ws.user_id = 'user-123'
GROUP BY ws.id, ws.webhook_url;
```

### Daily revenue (all users)
```sql
SELECT
  DATE(created_at) as date,
  SUM(cost_credits) as revenue,
  COUNT(*) as num_jobs,
  AVG(duration_sec) as avg_sec
FROM usage_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Top models this month
```sql
SELECT
  model,
  COUNT(*) as jobs,
  SUM(cost_credits) as revenue,
  ROUND(AVG(duration_sec), 1) as avg_sec,
  ROUND(100.0 * COUNT(CASE WHEN status = 'complete' THEN 1 END) / COUNT(*), 2) as success_pct
FROM usage_logs
WHERE created_at >= DATE_TRUNC('month', NOW())
GROUP BY model
ORDER BY revenue DESC;
```

### Check if user has feature
```sql
SELECT enabled
FROM premium_features
WHERE user_id = 'user-123' AND feature_flag = 'video_export_4k'
LIMIT 1;
-- Returns: TRUE/FALSE/NULL (not enabled)
```

---

## ENUMs Reference

### video_status
```
'queued'     — Waiting in queue
'processing' — Currently rendering
'complete'   — Success (output_url set)
'failed'     — Error (error_message set)
```

### model_name
```
IMAGE:  flux_pro, sana, stable_diffusion_3
VIDEO:  hunyuan_video, runway_gen3, sora
AUDIO:  elevenlabs, kokoro_tts
MUSIC:  suno_v5, musicgen
```

### subscription_tier
```
'free'   — 3 jobs/day, standard models
'pro'    — 20 jobs/day, all models
'studio' — Unlimited, priority queue
```

### webhook_event_type
```
'job.complete'
'job.failed'
'job.progress'
'quota.limit_exceeded'
```

---

## RLS Policies Summary

### User Access
- ✅ SELECT own jobs, quotas, webhooks, feature flags
- ❌ DELETE own jobs (system-managed)
- ❌ UPDATE quota (system-managed via cron)
- ✅ INSERT own jobs, webhooks
- ✅ UPDATE/DELETE own webhooks

### Admin Access
- ✅ SELECT/UPDATE/DELETE all data
- ✅ Bypass all RLS policies

### Service Role
- ✅ INSERT usage logs
- ✅ UPDATE quotas (reset automation)
- ✅ CREATE webhook deliveries

---

## Indexes (Fast Paths)

### VideoGenerationJob
```
(user_id)
(status)
(created_at DESC)
(model)
(user_id, status)  ← composite
```

### ModelQuota
```
(user_id)
(reset_at)         ← daily cron reset
(model)
```

### PremiumFeature
```
(user_id)
(feature_flag)
(tier)
(enabled)
```

### WebhookSubscription
```
(user_id)
(active)           ← find active webhooks
(webhook_url)
```

### WebhookDelivery
```
(subscription_id)
(job_id)
(created_at DESC)  ← recent deliveries
(http_status)      ← find failures
```

### UsageLogs (partitioned)
```
(user_id)
(model)
(created_at DESC)  ← inherited by all partitions
(user_id, model)   ← composite
```

---

## Deployment Steps

1. **Backup** — Supabase Dashboard → Backups
2. **Run Migration** — Copy schema.sql into SQL Editor → Run
3. **Verify** — Check tables exist, ENUMs created, partitions present
4. **Seed Test Data** — INSERT test user, job, quota
5. **Test RLS** — User sees own data only
6. **Load Test** — 1000 concurrent submissions
7. **Monitor** — Check query plans use indexes

See `MIGRATION.md` for detailed steps.

---

## Common Errors & Fixes

### ❌ "relation 'video_generation_jobs' does not exist"
→ Migration didn't run. Check SQL Editor output for errors. Re-run `schema.sql`.

### ❌ "permission denied for schema public"
→ Supabase auth role needs USAGE on public schema. Retry after login as admin.

### ❌ "type 'video_status' already exists"
→ Run migration again (already created). Safe to re-run entire script.

### ❌ RLS policy "role undefined"
→ Ensure `auth.uid()` and `auth.jwt()` are available (they are in Supabase).

### ❌ Partitions not created
→ Check PostgreSQL version ≥ 11. Supabase uses 14+, so safe.

---

## Performance Targets

| Operation | Target | Achieved? |
|-----------|--------|-----------|
| GET /api/generate/:job_id | <100ms p99 | Via (user_id, status) index |
| GET /api/quotas | <50ms p99 | Via (user_id) index + RLS |
| POST /api/webhooks/:id/test | <5s | Depends on webhook endpoint |
| Usage analytics (daily revenue) | <1s | Partition pruning |
| Webhook delivery replay | <100ms | Via (http_status) index |

---

## Monitoring Queries

### Table sizes
```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Index bloat
```sql
SELECT indexname, idx_blks_read, idx_blks_hit
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_blks_read DESC;
```

### RLS policy count
```sql
SELECT tablename, COUNT(*) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

### Partition info
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE tablename LIKE 'usage_logs_%'
ORDER BY tablename;
```

---

## Future Tasks

- [ ] Add cache table (SHA256 deduplication)
- [ ] Add performance_metrics table (per-minute aggregation)
- [ ] Add audit_log table (GDPR compliance)
- [ ] Implement quota reset cron (daily at 00:00 UTC)
- [ ] Implement webhook delivery system (retry logic)
- [ ] Configure S3 lifecycle (delete outputs after 30 days)
- [ ] Set up Datadog monitoring (alert on >1s queries)

---

## Support

**Questions about schema?**
- Read `SCHEMA-DESIGN.md` for rationale
- Check `MIGRATION.md` for deployment
- Review `requirements.md` for feature context

**Need help deploying?**
- Reach out: jamie.jack.28@hotmail.com
- Or check Supabase docs: https://supabase.com/docs
