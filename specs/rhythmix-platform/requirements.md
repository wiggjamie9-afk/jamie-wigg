# RHYTHMIX Platform — Backend API Requirements

**Project ID:** rhythmix-platform  
**Phase:** Wave 2, Week 7-8 (backend MVP launch)  
**Status:** Specification phase

---

## Vision

The RHYTHMIX Platform is the engine powering all three Wave 1 products (Studio, Agent Builder, HerdCheck) and Wave 2 products (Buddy Builder, Recovery iOS). It orchestrates video generation, manages AI models, enforces rate limits, caches results, and gates premium features. A stateless, scalable backend designed for 100k+ concurrent users.

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Video generation throughput | 100 jobs/min | Week 8 |
| Job completion time (p99) | <5 min | Week 8 |
| API latency (p50) | <200ms | Week 8 |
| Cache hit rate | 95%+ | Week 9 |
| Uptime | 99.95% | Ongoing |
| Model availability | 100% (fallback model) | Week 8 |

---

## Functional Requirements

### R1: Video Generation Job API

**Description:** Stateless API for submitting video generation jobs, polling status, and retrieving results.

**Acceptance Criteria:**
- [ ] POST `/api/generate/video` accepts: user_id, input JSON (HyperFrames or API format), model preference, tier
- [ ] Returns: job_id, queue_position, estimated_completion_time
- [ ] GET `/api/generate/:job_id` polls status: queued → processing → complete/failed
- [ ] Webhook callback on completion (optional, for async workflow)
- [ ] DELETE `/api/generate/:job_id` cancels queued job
- [ ] Job data includes: input, output_url, processing_time, cost_estimate
- [ ] Jobs expire after 30 days (S3 lifecycle policy)

**Dependencies:** Replicate API, S3 storage, job queue (Supabase pg_boss or Redis Bull)

**Out of scope:** Real-time WebSocket (fallback to polling for MVP)

---

### R2: Model Router & Selection

**Description:** Intelligent model selection based on user tier, capability, and availability.

**Acceptance Criteria:**
- [ ] GET `/api/models/available` returns list of models filtered by user tier
- [ ] Models support: image (FLUX 1.1 Pro, Sana, Stable Diffusion 3), video (HunyuanVideo, Runway Gen-3, Sora), music (Suno v5, MusicGen), audio (ElevenLabs, Kokoro TTS)
- [ ] Smart routing: if primary model unavailable, fallback to alternative
- [ ] Model-specific parameters validated (e.g., prompt length, dimensions)
- [ ] Cost calculation per model (return to client for budgeting)
- [ ] Deprecate old models gracefully (warn users, redirect to new)

**Dependencies:** Replicate, HunyuanVideo, Runway, Suno, ElevenLabs APIs

**Out of scope:** Fine-tuned models (custom LoRAs) — Phase 2e

---

### R3: Rate Limiting & Quotas

**Description:** Per-user, per-model quotas prevent abuse and enforce tier limits.

**Acceptance Criteria:**
- [ ] Quota types: daily (Studio video gen), monthly (Team-wide in Agent Builder), real-time (per-minute for HerdCheck SMS)
- [ ] Free tier: 3 generations/day, standard model only
- [ ] Pro tier: 20 generations/day, all models
- [ ] Studio tier: unlimited generations, priority queue
- [ ] Check quota before allowing job submission
- [ ] Return remaining quota in response headers
- [ ] Reset quotas at midnight UTC
- [ ] Quota tracking in Redis (fast lookup)

**Dependencies:** Redis for rate limit counters

**Out of scope:** Usage-based billing (consumption tracking) — Phase 3

---

### R4: Caching & Content Delivery

**Description:** Cache generated videos to avoid re-rendering identical inputs.

**Acceptance Criteria:**
- [ ] Cache key: SHA256(input_json + model_id)
- [ ] TTL: 30 days for generated videos, 1 hour for metadata
- [ ] Storage: Redis (hot cache) + S3 (cold storage)
- [ ] Hit rate dashboard: % of requests served from cache
- [ ] Invalidation: on model update or user manual request
- [ ] CDN: CloudFront caches S3 origins (1-hour TTL for videos, 5-min for metadata)

**Dependencies:** Redis, S3, CloudFront

**Out of scope:** Custom CDN edge caching rules — Phase 3

---

### R5: Webhook Management

**Description:** Deliver job completion events to external systems (Buddy Builder, HerdCheck, etc.).

**Acceptance Criteria:**
- [ ] POST `/api/webhooks/register` — store webhook URL + event subscriptions
- [ ] Events: `job.complete`, `job.failed`, `job.progress`, `quota.limit_exceeded`
- [ ] Deliver webhook with: job_id, status, output_url, metadata
- [ ] Retry on failure: exponential backoff (1s, 2s, 4s, 8s), max 5 attempts
- [ ] Signature: HMAC-SHA256 in `X-RHYTHMIX-Signature` header
- [ ] Delivery log: store all webhook attempts (success/failure)

**Dependencies:** Vercel Functions, Supabase for webhook storage

**Out of scope:** Webhook filtering (all-or-nothing for MVP)

---

### R6: Premium Feature Gating

**Description:** Enable/disable features based on subscription tier and plan.

**Acceptance Criteria:**
- [ ] Feature flags: `video_export_4k`, `unlimited_storage`, `api_webhooks`, `team_collaboration`
- [ ] GET `/api/features` returns enabled features for authenticated user
- [ ] Enforce at API level: return 403 if feature not enabled
- [ ] Feature rollout: gradual %rollout to users (A/B testing)
- [ ] Bypass flag: admin can enable feature for specific user (testing)

**Dependencies:** Supabase `premium_features` table, user subscription tier (from Wave 1)

**Out of scope:** Feature flags via analytics (Vercel Analytics, LaunchDarkly) — Phase 3

---

### R7: Usage Analytics & Telemetry

**Description:** Track API usage, model popularity, error rates for monitoring and optimization.

**Acceptance Criteria:**
- [ ] Log all job submissions: timestamp, user_id, model, tier, duration
- [ ] Aggregate metrics: requests/sec, avg latency, error rate
- [ ] Model usage dashboard: which models used most, success rate per model
- [ ] User segmentation: DAU, video generations per user, conversion rates
- [ ] Export: usage data in CSV/JSON (admin only)

**Dependencies:** Datadog, Axiom, or simple PostgreSQL logging

**Out of scope:** Real-time dashboards (defer to admin panel) — Phase 3

---

### R8: Authentication & Authorization

**Description:** Secure all endpoints with JWT authentication; validate tier on protected operations.

**Acceptance Criteria:**
- [ ] All endpoints protected by JWT (Bearer token)
- [ ] JWT issued by Wave 1 auth (Supabase)
- [ ] Validate token expiration + signature
- [ ] Scopes: `video:generate`, `webhook:manage`, `admin` (for internal endpoints)
- [ ] Return 401 if token invalid/expired
- [ ] Return 403 if user lacks required scope/tier

**Dependencies:** Wave 1 JWT spec, Supabase auth

---

## Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| Job submission latency | <200ms (p99) |
| Status polling latency | <100ms (p99) |
| Model availability check | <50ms |
| Cache hit latency | <10ms |
| Webhook delivery | <5s (after job completion) |

### Reliability

| Metric | Target |
|--------|--------|
| Uptime | 99.95% (monthly) |
| Job failure rate | <1% (external API failures excluded) |
| Webhook delivery rate | 99.9% (after retries) |
| Cache data loss | 0 (Redis replicas + S3 backup) |

### Scalability

| Metric | Target |
|--------|--------|
| Concurrent job submissions | 1000 req/sec |
| Maximum queue depth | 10k jobs |
| Cache size | 500 GB (1000s of rendered videos) |
| Data retention | 90 days (with archive to Glacier) |

### Security

- [ ] All data encrypted at rest (S3 encryption, Redis TLS)
- [ ] HTTPS-only, TLS 1.3
- [ ] Rate limiting on public endpoints (prevent abuse)
- [ ] API keys rotated monthly
- [ ] Access logs audited (who accessed what, when)
- [ ] PII scrubbing (user emails, API keys never logged)

---

## Data Model

### Core Entities

**VideoGenerationJob**
- id (UUID)
- user_id (FK → users)
- input_type ('hyperframes' | 'api')
- input_data (JSONB: prompt, dimensions, model-specific params)
- model (enum: flux, hunyuan, suno, etc.)
- tier ('pro' | 'studio')
- status ('queued' | 'processing' | 'complete' | 'failed')
- output_url (S3 path, NULL if pending)
- error_message (text, if failed)
- processing_time_sec (int, set on completion)
- cost_estimate (float, in credits)
- created_at, completed_at
- ttl_days (30, for S3 lifecycle)

**ModelQuota**
- id (UUID)
- user_id (FK)
- model (enum)
- quota_per_day (int)
- used_today (int)
- reset_at (timestamp, next day at midnight UTC)
- created_at

**PremiumFeature**
- id (UUID)
- user_id (FK)
- feature_flag (string: 'video_export_4k', etc.)
- tier (enum: 'pro' | 'studio')
- enabled (boolean)
- enabled_at (timestamp)

**WebhookSubscription**
- id (UUID)
- user_id (FK)
- webhook_url (text)
- event_types (array: 'job.complete', 'job.failed', etc.)
- active (boolean)
- secret_key (for HMAC signing)
- created_at

**WebhookDelivery** (audit log)
- id (UUID)
- subscription_id (FK)
- job_id (FK → VideoGenerationJob)
- event_type (string)
- payload (JSONB)
- http_status (int, response from webhook)
- attempt_num (int, 1-5)
- created_at

---

## API Surface

### Job Management

```
POST /api/generate/video              -- Submit video generation job
GET /api/generate/:job_id             -- Poll job status
DELETE /api/generate/:job_id          -- Cancel job
GET /api/generate/history             -- List user's recent jobs
```

### Models

```
GET /api/models/available             -- List available models for tier
GET /api/models/info/:model           -- Get model details (params, cost, etc.)
GET /api/models/status                -- Model availability status (all models)
POST /api/models/:model/preview       -- Quick preview (lower quality, 50% cost)
```

### Quotas

```
GET /api/quotas                       -- Get current quotas & usage
GET /api/quotas/reset-schedule        -- When quota resets
POST /api/quotas/increase             -- (admin) Manually increase quota
```

### Webhooks

```
POST /api/webhooks/register           -- Create webhook subscription
GET /api/webhooks                     -- List user's webhooks
PATCH /api/webhooks/:id               -- Update webhook
DELETE /api/webhooks/:id              -- Delete webhook
POST /api/webhooks/:id/test           -- Send test payload
```

### Premium Features

```
GET /api/features                     -- List enabled features for user
GET /api/features/all                 -- (admin) All features & rollout %
PATCH /api/features/:flag             -- (admin) Update feature rollout
```

### Admin

```
GET /api/admin/usage                  -- Usage metrics (aggregated)
GET /api/admin/models/status          -- Model health (latency, errors)
GET /api/admin/quotas/:user_id        -- View user's quotas
POST /api/admin/quotas/:user_id       -- Modify user's quotas
GET /api/admin/webhooks/delivery-log  -- Webhook delivery status
```

---

## Success Criteria (Wave 2 End)

- [ ] Job submission returns job_id in <200ms (p99)
- [ ] Status polling returns status in <100ms (p99)
- [ ] Video generation completes in <5 min (p99)
- [ ] Cache hit rate ≥95% (for repeated generations)
- [ ] Webhook delivery succeeds 99.9% (after retries)
- [ ] Quota limits enforced correctly (Free users: 3/day, Pro: 20/day)
- [ ] Model router selects correct model by tier
- [ ] Uptime ≥99.95% (over one week)
- [ ] Zero data loss on job cancellation or failure
- [ ] All endpoints secured with JWT authentication
