# RHYTHMIX Platform — Implementation Tasks

**Total effort:** 70-90 hours (2 weeks, 1 FTE backend + 0.5 DevOps)

---

## Phase 1: Foundation & Infrastructure (3 days)

### T1.1: Supabase schema for jobs & quotas

**Subtasks:**
- [ ] Create `video_generation_jobs` table (user_id, input, model, status, output_url, error, timestamps)
- [ ] Create `model_quotas` table (user_id, model, quota_per_day, used_today, reset_at)
- [ ] Create `premium_features` table (user_id, feature_flag, tier, enabled)
- [ ] Create `webhook_subscriptions` table (user_id, webhook_url, event_types, secret_key, active)
- [ ] Create `webhook_deliveries` table (subscription_id, job_id, event_type, payload, http_status, attempt_num)
- [ ] Add indexes on user_id, status, created_at
- [ ] Enable RLS policies (auth-based)

**Acceptance:**
- [ ] All tables exist with proper constraints
- [ ] Indexes created
- [ ] RLS policies allow read/write by job owner + webhook receiver

---

### T1.2: Redis setup (Upstash or Heroku)

**Subtasks:**
- [ ] Create Redis instance (Upstash free tier or Heroku Redis)
- [ ] Setup connection pooling (Redis SDK v4)
- [ ] Create schemas for: job queue, rate limit counters, cache, model status
- [ ] Test read/write operations

**Acceptance:**
- [ ] Redis instance created
- [ ] Connection pooling works
- [ ] Can read/write from test script

---

### T1.3: S3 bucket & CloudFront setup

**Subtasks:**
- [ ] Create S3 bucket (rhythmix-platform-outputs)
- [ ] Setup encryption (AES-256)
- [ ] Create lifecycle policy (delete after 30 days)
- [ ] Setup CORS for CloudFront
- [ ] Create CloudFront distribution (origin = S3 bucket)
- [ ] Setup CNAME: `cdn.rhythmix.com`

**Acceptance:**
- [ ] S3 bucket accessible
- [ ] CloudFront distribution created
- [ ] Can upload file to S3 and access via CloudFront URL
- [ ] Lifecycle policy will auto-delete old files

---

## Phase 2: Core Job API (4 days)

### T2.1: Job submission endpoint (POST /api/generate/video)

**Subtasks:**
- [ ] Validate JWT auth (from Wave 1)
- [ ] Validate input schema (HyperFrames or API format)
- [ ] Check rate limit quota (Redis lookup)
- [ ] Check cache (SHA256 key in Redis)
- [ ] Create job record in PostgreSQL
- [ ] Enqueue job in Redis queue
- [ ] Return job_id + status (202 Accepted)

**Implementation:**
- Input schema validation: Zod or Joi
- Quota check: `GET redis key:quota:user_123:day`
- Cache check: `GET redis cache:sha256_abc123`
- Job record: insert with status='queued'
- Queue enqueue: `LPUSH redis queue:video job_id`

**Acceptance:**
- [ ] Submission <200ms latency
- [ ] Quota check works (returns 429 if exceeded)
- [ ] Cache hit returns result immediately
- [ ] Job created in DB with correct status

---

### T2.2: Job status polling endpoint (GET /api/generate/:job_id)

**Subtasks:**
- [ ] Fetch job from PostgreSQL
- [ ] Return status + output_url (if complete)
- [ ] Return progress % (if processing)
- [ ] Return error message (if failed)
- [ ] Return queue position (if queued)
- [ ] Validate auth (only job owner or admin can view)

**Implementation:**
- Query: `SELECT * FROM video_generation_jobs WHERE id = $1 AND user_id = $2`
- Return 403 if user_id doesn't match
- Include all metadata (model, cost, processing_time, cached flag)

**Acceptance:**
- [ ] Status latency <100ms
- [ ] Job owner can view job
- [ ] Non-owner gets 403
- [ ] All fields returned correctly

---

### T2.3: Job cancellation endpoint (DELETE /api/generate/:job_id)

**Subtasks:**
- [ ] Fetch job by ID
- [ ] Check auth (owner only)
- [ ] Cancel if status='queued' (remove from queue)
- [ ] Cannot cancel if already processing/complete
- [ ] Mark as 'cancelled' in DB

**Implementation:**
- Only allow cancel if status is 'queued'
- Remove from Redis queue: `LREM redis queue:video 1 job_id`
- Update DB: `UPDATE video_generation_jobs SET status='cancelled' WHERE id=$1`
- Webhook: send 'job.cancelled' event

**Acceptance:**
- [ ] Queued jobs can be cancelled
- [ ] Processing/complete jobs cannot be cancelled
- [ ] Cancel webhook sent to subscribers

---

### T2.4: Job history endpoint (GET /api/generate/history)

**Subtasks:**
- [ ] Fetch user's recent jobs (paginated, limit 50)
- [ ] Sort by created_at DESC
- [ ] Include status, output_url, model, cost
- [ ] Optional filters: model, status, date range

**Implementation:**
- Query: `SELECT * FROM video_generation_jobs WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`
- Pagination: cursor-based (use job_id as cursor)
- Filters: add WHERE clauses for model, status

**Acceptance:**
- [ ] Returns recent jobs
- [ ] Pagination works
- [ ] Filters work
- [ ] <100ms latency

---

## Phase 3: Model Router & Selection (3 days)

### T3.1: Model metadata & availability

**Subtasks:**
- [ ] Define model catalog (FLUX, HunyuanVideo, Suno, ElevenLabs, Kokoro)
- [ ] Model properties: name, type (image/video/audio), cost_per_request, supported_dimensions, max_duration
- [ ] Model status tracker: online/offline, latency history
- [ ] Fallback chains: if FLUX offline, use SD3; if SD3 offline, use Sana
- [ ] Update status nightly (health check to Replicate API)

**Implementation:**
```js
const models = {
  flux: {
    type: 'image',
    cost: 0.5,
    tiers: ['pro', 'studio'],
    fallback: 'stable-diffusion-3',
    status: 'online',
    latency_p99: 45
  },
  ...
}
```

**Acceptance:**
- [ ] Model catalog defined
- [ ] Fallback chains work
- [ ] Status updates correctly

---

### T3.2: Model availability endpoint (GET /api/models/available)

**Subtasks:**
- [ ] Return models filtered by user tier
- [ ] Include cost, supported formats, latency info
- [ ] For each model, include fallback chain
- [ ] Return current status (online/offline/degraded)

**Implementation:**
- Fetch user tier from JWT claims
- Filter models: only return tiers >= user_tier
- Include status from Redis key: `model_status`

**Acceptance:**
- [ ] Free tier sees free/default models only
- [ ] Pro tier sees all Pro models
- [ ] Status info included

---

### T3.3: Model info endpoint (GET /api/models/info/:model)

**Subtasks:**
- [ ] Return full details for specific model
- [ ] Supported parameters (prompt length, dimensions, duration)
- [ ] Cost breakdown
- [ ] Success rate (from analytics)
- [ ] Average latency

**Acceptance:**
- [ ] Details accurate and up-to-date
- [ ] Parameters documented

---

### T3.4: Model router logic (select best model)

**Subtasks:**
- [ ] Input: user tier, requested model, input params
- [ ] Check if requested model available
- [ ] If not, select best fallback
- [ ] If all in chain unavailable, select tier-appropriate alternative
- [ ] Log selection for analytics

**Implementation:**
```js
function selectModel(userTier, requestedModel, inputParams) {
  if (isAvailable(requestedModel)) return requestedModel
  const chain = fallbackChain[requestedModel]
  for (const fallback of chain) {
    if (isAvailable(fallback) && supportsTier(fallback, userTier)) {
      return fallback
    }
  }
  return defaultForTier(userTier)
}
```

**Acceptance:**
- [ ] Selects requested model if available
- [ ] Falls back correctly
- [ ] Never fails to select model (always fallback available)

---

## Phase 4: Rate Limiting & Quotas (2 days)

### T4.1: Quota storage & reset logic

**Subtasks:**
- [ ] Store quotas in PostgreSQL (model_quotas table)
- [ ] Daily reset: nightly job updates reset_at (UTC midnight)
- [ ] Redis cache: copy quotas to Redis for fast lookup
- [ ] Quota types: daily (most models), monthly (team features)

**Implementation:**
- Schema: `user_id | model | quota_per_day | used_today | reset_at`
- Nightly reset: `UPDATE model_quotas SET used_today=0, reset_at=NOW() + 1 day`
- Redis cache: `quota:user_123:flux -> 20` (available remaining)

**Acceptance:**
- [ ] Quotas stored correctly
- [ ] Daily reset works
- [ ] Redis cache consistent with DB

---

### T4.2: Quota check (in job submission)

**Subtasks:**
- [ ] Check quota BEFORE creating job
- [ ] Decrement available quota (atomic operation in Redis)
- [ ] Return 429 if exceeded
- [ ] Include reset time in error response

**Implementation:**
- Redis atomic: `DECR quota:user_123:flux`
- If returns -1 (now over limit), increment back and return 429
- Or use `GETSET` for atomic check-and-decrement

**Acceptance:**
- [ ] Quota checked on every job submission
- [ ] Cannot exceed quota
- [ ] Error includes reset time
- [ ] Quota counter accurate

---

### T4.3: Quota dashboard endpoint (GET /api/quotas)

**Subtasks:**
- [ ] Return user's quotas for all models
- [ ] Show used_today, quota_per_day, remaining
- [ ] Show reset time (ISO timestamp)
- [ ] Show tier (free/pro/studio)

**Acceptance:**
- [ ] Returns all quotas correctly
- [ ] Remaining calculated correctly (quota_per_day - used_today)

---

## Phase 5: Caching (2 days)

### T5.1: Cache key generation

**Subtasks:**
- [ ] Create deterministic cache key from input
- [ ] Hash: SHA256(JSON.stringify(input))
- [ ] Include model + dimensions in hash
- [ ] Test with identical/different inputs

**Implementation:**
```js
function getCacheKey(input, model, dimensions) {
  const payload = JSON.stringify({input, model, dimensions})
  return 'cache:' + sha256(payload)
}
```

**Acceptance:**
- [ ] Identical inputs produce same key
- [ ] Different inputs produce different keys
- [ ] Deterministic (always same hash for same input)

---

### T5.2: Cache storage & retrieval

**Subtasks:**
- [ ] On job complete: store result in Redis (TTL 30 days)
- [ ] On cache hit: return immediately from Redis
- [ ] Store: output_url, model, processing_time, cost
- [ ] Expire: nightly cleanup of old cache entries

**Implementation:**
- Store in Redis: `SET cache_key result_json EX 2592000` (30 days)
- Retrieve: `GET cache_key` (returns JSON or nil)
- Cleanup: `EVAL` script to delete expired keys (or rely on TTL)

**Acceptance:**
- [ ] Cache stores results correctly
- [ ] Cache retrieval returns result
- [ ] TTL respected (30 days)
- [ ] Cache hit latency <10ms

---

### T5.3: Cache hit rate monitoring

**Subtasks:**
- [ ] Track cache hits vs misses (metrics)
- [ ] Log to analytics: `cache_hit = true/false`
- [ ] Dashboard: show hit rate % (daily, weekly, monthly)
- [ ] Alert if hit rate drops below 80%

**Acceptance:**
- [ ] Hit rate tracked
- [ ] Metrics visible in dashboard
- [ ] Alert fires if performance degrades

---

## Phase 6: Webhooks (3 days)

### T6.1: Webhook subscription management

**Subtasks:**
- [ ] POST `/api/webhooks/register` — Create subscription
- [ ] GET `/api/webhooks` — List subscriptions
- [ ] PATCH `/api/webhooks/:id` — Update (URL, event types)
- [ ] DELETE `/api/webhooks/:id` — Delete
- [ ] POST `/api/webhooks/:id/test` — Send test payload

**Implementation:**
- Store: webhook_url, event_types (array), secret_key (generate random)
- Test endpoint: create test event, deliver to webhook, return result

**Acceptance:**
- [ ] Webhooks can be created, listed, updated, deleted
- [ ] Test sends payload to webhook

---

### T6.2: Webhook delivery engine

**Subtasks:**
- [ ] On job complete: fetch webhook subscriptions for user
- [ ] For each subscribed webhook: create delivery record
- [ ] Deliver payload (JSON) with HMAC signature
- [ ] Retry on failure: exponential backoff (1s, 2s, 4s, 8s)
- [ ] Max 5 attempts over ~15s

**Implementation:**
- Async job: trigger on job status update to 'complete'
- For each subscription: `POST webhook_url` with payload + signature header
- Retry logic: enqueue in Redis queue with retry count
- Log: webhook_deliveries table (audit trail)

**Acceptance:**
- [ ] Webhook sent on job completion
- [ ] HMAC signature valid
- [ ] Retries work
- [ ] Delivery log recorded

---

### T6.3: Webhook signature validation (client-side doc)

**Subtasks:**
- [ ] Document how clients validate webhook signature
- [ ] Provide example code (Node, Python, Ruby, etc.)
- [ ] Include test case with known payload + signature

**Implementation:**
```js
// Client-side validation
const crypto = require('crypto')
function validateSignature(payload, signature, secret) {
  const computed = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  return computed === signature
}
```

**Acceptance:**
- [ ] Example code correct and tested
- [ ] Documentation clear

---

## Phase 7: Premium Features & Gating (2 days)

### T7.1: Feature flags table & logic

**Subtasks:**
- [ ] Define feature flags: video_export_4k, unlimited_storage, api_webhooks, team_collaboration
- [ ] Store in premium_features table (user_id, feature_flag, tier, enabled)
- [ ] Load on auth (include in JWT claims or fetch on demand)
- [ ] Check on each API call (return 403 if feature not enabled)

**Implementation:**
- Schema: user_id, feature_flag, tier, enabled, enabled_at
- Default: enabled=false for all users
- Pro tier: enable video_export_4k, api_webhooks
- Studio tier: enable all

**Acceptance:**
- [ ] Features correct per tier
- [ ] Gating enforced (API returns 403 if not enabled)

---

### T7.2: Feature availability endpoint (GET /api/features)

**Subtasks:**
- [ ] Return all enabled features for authenticated user
- [ ] Include feature descriptions

**Implementation:**
- Query: `SELECT feature_flag FROM premium_features WHERE user_id=$1 AND enabled=true`
- Return: array of feature strings

**Acceptance:**
- [ ] Returns enabled features correctly

---

## Phase 8: Monitoring & Analytics (3 days)

### T8.1: Logging & metrics collection

**Subtasks:**
- [ ] Log all job submissions: timestamp, user_id, model, input_size, tier
- [ ] Log job completion: timestamp, model, processing_time, cost, cached
- [ ] Log errors: timestamp, user_id, endpoint, error_code, error_message
- [ ] Log API calls: timestamp, endpoint, user_id, latency, response_status
- [ ] Export to Datadog or Axiom (structured JSON)

**Implementation:**
- Use structured logging: JSON format
- Include: timestamp, user_id, request_id (for tracing), level, message, context
- Don't log: API keys, secrets, full prompts (too large)

**Acceptance:**
- [ ] Logs exported to analytics platform
- [ ] Queries possible (filter by user, model, status)

---

### T8.2: Metrics dashboard (basic)

**Subtasks:**
- [ ] Create Grafana/Datadog dashboard with key metrics
- [ ] Charts: requests/sec, avg latency, error rate, model usage, cache hit rate
- [ ] Top models (by usage)
- [ ] Top errors (by count)
- [ ] Revenue estimate (based on job count + model cost)

**Acceptance:**
- [ ] Dashboard accessible
- [ ] Charts update in real-time
- [ ] Can drill down (filter by model, tier, date)

---

### T8.3: Alerts setup

**Subtasks:**
- [ ] Critical: Uptime <99%, Model unavailability >1 min, Error rate >5%
- [ ] Warning: Latency p99 >500ms, Cache hit <80%, Redis memory >80%
- [ ] Slack integration (send alerts to #rhythmix-platform)
- [ ] PagerDuty escalation (critical only)

**Acceptance:**
- [ ] Alerts configured
- [ ] Test alert fires and notifies
- [ ] Can acknowledge/snooze alerts

---

## Phase 9: QA & Load Testing (2 days)

### T9.1: API testing (Postman / Jest)

**Subtasks:**
- [ ] Test job submission (success, quota exceeded, invalid input)
- [ ] Test status polling (queued, processing, complete, failed)
- [ ] Test cache hit (identical requests)
- [ ] Test webhook delivery (success, retry, failure)
- [ ] Test quota reset (midnight UTC)
- [ ] Test error cases (401, 403, 429, 500)

**Acceptance:**
- [ ] Test suite passes
- [ ] All happy paths verified
- [ ] Error cases handled correctly

---

### T9.2: Load test

**Subtasks:**
- [ ] Simulate 1000 concurrent job submissions
- [ ] Measure: latency p50/p95/p99, error rate, throughput
- [ ] Verify: quota enforcement, cache hit rate
- [ ] Identify bottlenecks (DB, Redis, external APIs)
- [ ] Document results

**Implementation:**
- Tool: k6 or Apache JMeter
- Test plan: ramp up from 1 to 1000 concurrent over 5 min
- Duration: 10 min steady state

**Acceptance:**
- [ ] Can handle 1000 concurrent submissions
- [ ] Latency p99 <500ms
- [ ] No data loss
- [ ] Error rate <1%

---

## Phase 10: Documentation & Deployment (1 day)

### T10.1: API documentation (OpenAPI)

**Subtasks:**
- [ ] Write OpenAPI 3.0 spec
- [ ] Include all endpoints, request/response schemas, error codes
- [ ] Generate interactive docs (Swagger UI or Redoc)
- [ ] Publish at `/docs` endpoint

**Acceptance:**
- [ ] Spec complete and accurate
- [ ] Swagger UI renders correctly
- [ ] All endpoints documented

---

### T10.2: Deployment guide

**Subtasks:**
- [ ] Document environment setup (local, staging, production)
- [ ] Include: Vercel deploy, Supabase migrations, Redis setup, S3 config, API key setup
- [ ] Deployment steps: `pnpm deploy`
- [ ] Rollback procedure

**Acceptance:**
- [ ] Runbook complete
- [ ] Can deploy from scratch using guide

---

## Success Criteria (Wave 2 End)

- [ ] Job submission <200ms latency (p99)
- [ ] Status polling <100ms latency (p99)
- [ ] Video generation completes <5 min (p99)
- [ ] Cache hit rate ≥95% (for identical inputs)
- [ ] Webhook delivery succeeds 99.9% (after retries)
- [ ] Quota enforcement correct (Free: 3/day, Pro: 20/day)
- [ ] Uptime ≥99.95% (over 1 week)
- [ ] Can handle 1000 concurrent requests
- [ ] All endpoints secured with JWT
- [ ] Monitoring dashboard shows all key metrics
- [ ] Documentation complete + deployment tested
