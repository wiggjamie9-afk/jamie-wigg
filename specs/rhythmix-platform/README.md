# RHYTHMIX Platform — Supabase Schema & Backend API Specification

**Date:** 2026-06-25  
**Status:** Ready for implementation (Wave 2, Week 7-8)  
**Version:** 1.0.0 (MVP)

---

## Overview

This directory contains the complete Supabase backend schema + API specification for the RHYTHMIX Platform, which orchestrates video generation, manages AI models, enforces rate limits, and gates premium features across all Wave 1/2 products (Studio, Agent Builder, HerdCheck, Buddy Builder, Recovery iOS).

**Key targets:**
- ✅ **99.95% uptime** (SLA)
- ✅ **100k+ concurrent users** (scalability)
- ✅ **<200ms p99 job submission latency** (performance)
- ✅ **$0 data loss** (reliability)
- ✅ **User data isolation via RLS** (security)

---

## File Guide

### 1. **schema.sql** (23 KB) — The Main Deliverable
**Run this to create all tables, ENUMs, indexes, and RLS policies in your Supabase project.**

**Contents:**
- 6 tables: VideoGenerationJob, ModelQuota, PremiumFeature, WebhookSubscription, WebhookDelivery, UsageLogs
- 3 ENUM types: video_status, model_name, subscription_tier, webhook_event_type
- 20+ indexes on hot paths (user_id, status, created_at, etc.)
- 30+ RLS policies (users see own data; admin sees all)
- Monthly partitioning on UsageLogs (created_at)
- 4 helper views for common queries
- Full grants for authenticated/anon/service roles

**How to run:**
```bash
# Option 1: Supabase SQL Editor (UI)
→ Paste schema.sql into SQL Editor → Click Run

# Option 2: CLI
supabase db push < schema.sql

# Option 3: psql
psql "postgresql://..." < schema.sql
```

See `MIGRATION.md` for step-by-step instructions.

---

### 2. **MIGRATION.md** (11 KB) — Deployment Guide
**Step-by-step walkthrough: backup → run migration → verify → test.**

**Sections:**
- Pre-migration checklist (backup, notify team)
- Three deployment methods (SQL Editor, CLI, psql)
- Post-migration verification queries
- Index reference (20+ indexes explained)
- RLS policy reference (who can do what)
- Quota reset automation setup
- Webhook delivery system architecture
- UsageLogs partitioning strategy
- Rollback plan (if migration fails)
- Performance tuning (analyze, vacuums)
- Next steps (seed data, deploy API, monitor)

**Start here if you're deploying to production.**

---

### 3. **SCHEMA-DESIGN.md** (17 KB) — Design Rationale
**Why each table, column, index, and RLS policy exists.**

**Sections:**
- Table design rationale (VideoGenerationJob, ModelQuota, PremiumFeature, WebhookSubscription, WebhookDelivery, UsageLogs)
- Column types and constraints explained
- Why JSONB for input_data? Why denormalize tier?
- ENUM types deep dive
- RLS strategy (users own data, admin sees all, service role manages system)
- Index strategy (B-tree on user_id, composite (user_id, status), partial indexes)
- Quota reset automation pattern (daily cron)
- Webhook delivery retry strategy (exponential backoff: 1s, 2s, 4s, 8s)
- Cost & compliance (data retention, encryption, GDPR)
- Future enhancements (cache table, performance_metrics, audit_log, billing)

**Read this to understand design decisions before modifying the schema.**

---

### 4. **SCHEMA-QUICK-REF.md** (9 KB) — Cheat Sheet
**Copy-paste queries, quick reference tables, common errors & fixes.**

**Sections:**
- File manifest (all docs in this directory)
- Tables at a glance (6 tables, row counts, purposes)
- Quick copy-paste queries (get user jobs, check quota, list webhooks, etc.)
- ENUMs reference (all valid values)
- RLS policies summary (user access, admin access, service role)
- Indexes fast paths (what each index is for)
- Deployment steps (5-line summary)
- Common errors & fixes
- Performance targets (vs. achieved)
- Monitoring queries (table sizes, index bloat, RLS count)
- Future tasks (cache, metrics, audit log)

**Bookmark this for day-to-day development.**

---

### 5. **API-INTEGRATION-EXAMPLES.md** (12 KB) — Backend Implementation
**Real TypeScript code: how the API will interact with the schema.**

**Sections:**
1. Video job submission (POST /api/generate/video) — check quota → create job → increment counter
2. Job status polling (GET /api/generate/:job_id) — RLS filters to own job
3. Quota check (GET /api/quotas) — list all quotas for user
4. Webhook registration (POST /api/webhooks/register) — store webhook URL + generate secret
5. Webhook delivery — async job processor with retry logic (1s, 2s, 4s, 8s)
6. Premium feature gating (GET /api/features) — list enabled features
7. Usage analytics (GET /api/admin/usage) — aggregate logs by day (admin only)
8. Job completion handler — update status → log usage → deliver webhook
9. Daily quota reset (GET /api/cron/reset-quotas) — Vercel cron at 00:00 UTC

**All code uses Supabase JS client + TypeScript.**

---

### 6. **requirements.md** (11 KB) — Feature Requirements
**Original R1-R8 requirements that drove the schema design.**

**Requirements:**
- R1: Video Generation Job API (submit, poll, cancel)
- R2: Model Router & Selection (FLUX, HunyuanVideo, Suno, etc.)
- R3: Rate Limiting & Quotas (free: 3/day, pro: 20/day, studio: unlimited)
- R4: Caching & Content Delivery (SHA256 dedup, 30-day TTL)
- R5: Webhook Management (register → deliver → retry)
- R6: Premium Feature Gating (feature flags by tier)
- R7: Usage Analytics & Telemetry (track all API calls)
- R8: Authentication & Authorization (JWT, scopes, roles)

**Plus non-functional requirements (perf, reliability, scalability, security).**

---

### 7. **design.md** (12 KB) — Architecture Design
**High-level system design, data model, API surface.**

**Sections:**
- System architecture (stateless backend, Replicate APIs, S3 storage, job queue)
- Data model (entities, relationships, constraints)
- API surface (job management, models, quotas, webhooks, features, admin)
- Constraints (no WebSocket for MVP, no A/B testing yet, no fine-tuned models)

---

### 8. **tasks.md** (17 KB) — Implementation Tasks
**T1-T12: What needs to be built, who owns it, dependencies, acceptance criteria.**

**Tasks:**
- T1: Create Supabase schema (DDL, indexes, RLS)
- T2: Implement job submission API
- T3: Job queue + async processor
- T4: Model router (select by tier + availability)
- T5: Quota enforcement + daily reset
- T6: Webhook registration + delivery system
- T7: Premium feature gating
- T8: Usage logging + analytics
- T9: Admin dashboard endpoints
- T10: Load testing + performance tuning
- T11: Monitoring + alerting
- T12: Documentation + runbooks

---

## Quick Start

### 1. Deploy Schema (5 minutes)
```bash
# Copy schema.sql
# Open Supabase SQL Editor
# Paste and run
# Check: SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
# Expected: 6 tables + 4 views
```

### 2. Verify Deployment (5 minutes)
```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check ENUMs exist
SELECT typname FROM pg_type WHERE typname IN (
  'video_status', 'model_name', 'subscription_tier', 'webhook_event_type'
);

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check partitions on UsageLogs
SELECT tablename FROM pg_tables WHERE tablename LIKE 'usage_logs_%' ORDER BY tablename;
```

### 3. Seed Test Data (5 minutes)
```sql
-- Insert test user quota
INSERT INTO public.model_quotas (user_id, model, quota_per_day, reset_at)
VALUES ('test-user-uuid', 'flux_pro', 20, NOW() + INTERVAL '1 day');

-- Check it
SELECT * FROM public.model_quotas WHERE user_id = 'test-user-uuid';
```

### 4. Test RLS (5 minutes)
```sql
-- Switch to authenticated role
SET ROLE authenticated;
SET app.jwt.claims.sub = 'test-user-uuid';

-- Can see own quota
SELECT id, quota_per_day FROM public.model_quotas;

-- Reset
RESET ROLE;
RESET app.jwt.claims.sub;
```

### 5. Deploy API (TBD)
Follow patterns in `API-INTEGRATION-EXAMPLES.md`:
- Implement POST /api/generate/video (job submission)
- Implement GET /api/generate/:job_id (job polling)
- Implement GET /api/quotas (quota check)
- Set up job queue + processor
- Implement webhook delivery
- Implement quota reset cron

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Studio, Buddy Builder, HerdCheck)                 │
│ ↓ POST /api/generate/video (JWT Bearer token)               │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ API Layer (Vercel Functions / Supabase Edge Functions)      │
│ ├─ Job submission (check quota → create job → enqueue)      │
│ ├─ Job polling (return status)                              │
│ ├─ Webhook registration (store URL + secret)                │
│ ├─ Quota check (list usage)                                 │
│ ├─ Feature gating (check enabled flags)                     │
│ └─ Admin analytics (usage by day/model)                     │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ PostgreSQL (Supabase)                                       │
│ ├─ Tables: Jobs, Quotas, Features, Webhooks, Deliveries    │
│ ├─ UsageLogs (partitioned monthly)                          │
│ ├─ Indexes: (user_id), (status), (created_at), composites  │
│ └─ RLS: users ← own data, admin ← all data                  │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ Background Jobs (Bull queue / pg_boss / Temporal)           │
│ ├─ Process job (call Replicate/HunyuanVideo API)            │
│ ├─ Update job status (queued → processing → complete)       │
│ ├─ Upload to S3                                             │
│ ├─ Log usage                                                │
│ ├─ Deliver webhooks (with retries: 1s, 2s, 4s, 8s)         │
│ └─ Reset quotas (daily cron at 00:00 UTC)                   │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ External Services                                           │
│ ├─ Replicate API (FLUX 1.1 Pro, etc.)                       │
│ ├─ HunyuanVideo API (video generation)                      │
│ ├─ Suno v5 API (music generation)                           │
│ ├─ ElevenLabs API (text-to-speech)                          │
│ └─ S3 (output storage, CDN via CloudFront)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Row-Level Security (RLS)
- Users see only their own data (jobs, quotas, webhooks)
- Admin role (`auth.jwt()->>'role' = 'admin'`) sees everything
- Service role (`auth.jwt()->>'role' = 'service_role'`) manages system tables
- Policies enforced at database level — no data leaks via SQL injection

### Partitioning
- UsageLogs table splits monthly by created_at
- Query on 2026-06 only scans June partition (10x faster)
- Easy archival: SELECT * FROM usage_logs_2025_01 INTO archive; DROP TABLE
- Each partition has its own indexes (reduced bloat)

### Quota Reset
- `reset_at` stored in ModelQuota (next reset time, UTC midnight)
- Daily cron job (Vercel, Edge Function, etc.) runs at 00:00 UTC
- Updates: used_today = 0, reset_at = tomorrow 00:00 UTC
- Idempotent: safe to run multiple times

### Webhook Delivery
- User registers webhook URL + selects events (job.complete, job.failed, etc.)
- On job completion, backend queries active webhooks
- HTTP POST to webhook_url with HMAC-SHA256 signature
- On failure: retry with exponential backoff (1s, 2s, 4s, 8s, max 5 attempts)
- All attempts logged in webhook_deliveries (audit trail)

---

## Testing Checklist

- [ ] Schema runs without errors
- [ ] All 6 tables exist
- [ ] All 4 ENUMs defined
- [ ] All 20+ indexes created
- [ ] All 30+ RLS policies active
- [ ] UsageLogs has 12 monthly partitions
- [ ] Insert test data (1 user, 1 job, 1 quota)
- [ ] User sees own jobs only (RLS enforcement)
- [ ] User cannot see other user's jobs
- [ ] Admin role can see all data
- [ ] Service role can write logs
- [ ] Query plans use indexes (EXPLAIN ANALYZE)
- [ ] Webhook delivery retry logic works
- [ ] Quota reset cron is idempotent
- [ ] Load test: 1000 concurrent submissions
- [ ] Performance: <200ms p99 job submission

---

## Support & Questions

**I'm deploying this for the first time:**
→ Start with `MIGRATION.md` (step-by-step)

**I'm debugging a slow query:**
→ Check `SCHEMA-QUICK-REF.md` (indexes reference)

**I'm implementing the API:**
→ Follow `API-INTEGRATION-EXAMPLES.md` (real TypeScript code)

**I need to understand why the schema is designed this way:**
→ Read `SCHEMA-DESIGN.md` (rationale, trade-offs, future plans)

**I need a quick reference for common SQL:**
→ Use `SCHEMA-QUICK-REF.md` (copy-paste queries)

**Questions or issues?**
→ Reach out: jamie.jack.28@hotmail.com

---

## Changelog

### v1.0.0 (2026-06-25)
- Initial schema release
- 6 core tables, 4 ENUMs, 20+ indexes, 30+ RLS policies
- Monthly partitioning on UsageLogs
- Ready for MVP deployment

### Future versions
- v1.1: Cache table (SHA256 deduplication)
- v1.2: Performance metrics table (per-minute aggregation)
- v1.3: Audit log table (compliance)
- v2.0: Billing table (usage-based invoicing)

---

## License

This schema and documentation are part of the RHYTHMIX Platform (internal project).

Last updated: 2026-06-25
