# RHYTHMIX Platform — Architecture & API Design Specification

## System Design Philosophy

The RHYTHMIX Platform is designed as a **stateless, distributed API** that orchestrates external AI services (Replicate, ElevenLabs, Suno). No state lives in the server itself — all state in PostgreSQL, Redis, or S3. Infinite horizontal scaling via Vercel Edge Functions. Graceful degradation when external services fail.

---

## Architecture Overview

```
┌──────────────────┐
│  Wave 1 / Wave 2 │  (Studio, Agent Builder, HerdCheck, Buddy Builder, Recovery iOS)
│   Products       │
└────────┬─────────┘
         │ HTTPS
         ▼
┌──────────────────────────────────────────────────────┐
│  RHYTHMIX Platform (Vercel Edge Functions)           │
├──────────────────────────────────────────────────────┤
│  • /api/generate/video                               │
│  • /api/models/*                                     │
│  • /api/quotas/*                                     │
│  • /api/webhooks/*                                   │
│  • /api/features                                     │
└──────────────┬──────────────────────────────────────┘
               │
     ┌─────────┼─────────┬──────────────────┐
     ▼         ▼         ▼                  ▼
┌────────┐ ┌────────┐ ┌────────┐    ┌──────────────┐
│Replicate│ │Suno/   │ │Eleven  │    │  Supabase    │
│(video)  │ │Music   │ │Labs    │    │ (users,jobs) │
└────────┘ │Gen     │ │(voice) │    └──────────────┘
           └────────┘ └────────┘
               ▲           ▲
     ┌─────────┴───────────┘
     │
┌────────────────────────┐
│  Redis (cache + queue) │
│  • Job queue           │
│  • Rate limit counters │
│  • Cache results       │
└────────────────────────┘
     ▲
┌────┴──────────────────┐
│  S3 (output storage)   │
│  • Generated videos    │
│  • Rendered images     │
└────────────────────────┘
     ▲
┌────┴──────────────────┐
│  CloudFront (CDN)      │
│  • Edge caching        │
│  • Global delivery     │
└────────────────────────┘
```

---

## API Design Patterns

### 1. REST with Job Polling (for long-running operations)

**Pattern:** POST → returns job_id immediately → poll GET for status

```json
POST /api/generate/video
{
  "input": {...},
  "model": "flux",
  "tier": "pro"
}

Response (202 Accepted):
{
  "job_id": "job_123abc",
  "status": "queued",
  "queue_position": 5,
  "estimated_completion_seconds": 120
}

--- 2 seconds later ---

GET /api/generate/job_123abc

Response (200 OK):
{
  "job_id": "job_123abc",
  "status": "processing",
  "progress": 45
}

--- 120 seconds later ---

Response (200 OK):
{
  "job_id": "job_123abc",
  "status": "complete",
  "output_url": "https://s3.amazonaws.com/...",
  "processing_time_sec": 118,
  "cached": false
}
```

**Why:** Long-running AI tasks can't complete in <30s. Polling allows client to show progress. Webhook for async workflows.

---

### 2. Graceful Degradation on Fallback Models

**Pattern:** Try primary model → if unavailable, automatically fallback

```json
POST /api/generate/video
{
  "input": "A sunset on Mars",
  "model_preference": "flux",  // primary
  "tier": "pro"
}

Response (if FLUX unavailable):
{
  "job_id": "job_456def",
  "status": "queued",
  "model_used": "stable-diffusion-3",  // fallback
  "warning": "Primary model (flux) unavailable. Using stable-diffusion-3."
}
```

**Why:** 100% availability for model API (no "service down" errors).

---

### 3. Quota Enforcement at Submission Time

**Pattern:** Check quota BEFORE queueing job

```json
POST /api/generate/video
{
  "input": {...},
  "model": "flux"
}

Response (if quota exceeded, 429 Too Many Requests):
{
  "error": "quota_exceeded",
  "message": "Daily limit reached (20/20)",
  "reset_at": "2024-06-25T00:00:00Z",
  "upgrade_url": "https://studio.starlightmix.com/upgrade"
}
```

**Why:** Fail fast. Return actionable error with upgrade link.

---

### 4. Cache Key Hashing

**Pattern:** Deterministic cache key from input

```
cache_key = SHA256(
  JSON.stringify({
    input_data: {...},
    model: "flux",
    dimensions: "1920x1080"
  })
)
```

**Why:** Identical requests always get same cache key, no ordering sensitivity.

---

### 5. Webhook Delivery with Exponential Backoff

**Pattern:** Async delivery with retries

```json
Webhook Payload:
{
  "event": "job.complete",
  "job_id": "job_123abc",
  "output_url": "https://...",
  "timestamp": "2024-06-24T12:34:56Z",
  "signature": "sha256=abc123..."  // HMAC-SHA256(payload, webhook_secret)
}

Retry Schedule:
Attempt 1: Immediate
Attempt 2: After 1s
Attempt 3: After 2s
Attempt 4: After 4s
Attempt 5: After 8s
(Max 5 attempts over ~15s window)
```

**Why:** Webhooks can fail (network blips, receiver down). Exponential backoff prevents hammering receiver.

---

## Data Flow: Video Generation Job

```
1. Client submits job (POST /api/generate/video)
   ├─ Validate input schema
   ├─ Check quota (Redis lookup)
   ├─ Check cache (Redis / SHA256 key)
   │  └─ If cache hit, return cached result
   └─ Enqueue job (Redis queue + PostgreSQL)

2. Worker pulls job from queue
   ├─ Select model (model router logic)
   ├─ Submit to Replicate / ElevenLabs / Suno
   └─ Poll external API for completion

3. Job completes
   ├─ Download output
   ├─ Upload to S3
   ├─ Store result URL + metadata in PostgreSQL
   ├─ Cache in Redis (30-day TTL)
   ├─ Deliver webhook to subscribers
   └─ Mark quota as "used"

4. Client polls status (GET /api/generate/:job_id)
   ├─ Fetch from PostgreSQL
   └─ Return result + URL

5. Client downloads video
   ├─ Hit CloudFront CDN
   ├─ Edge cache for 1 hour
   └─ Origin fetch from S3
```

---

## Deployment Architecture

### Vercel Edge Functions

**Deployment:**
- Functions: `api/generate.ts`, `api/models.ts`, `api/quotas.ts`, etc.
- Region: Global (auto-routed by Vercel)
- Runtime: Node.js 20 (built-in Node runtime)
- Concurrency: Auto-scaling (up to 1000 concurrent)
- Cold start: <100ms (Node.js is fast)

**Environment Variables:**
```
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
REPLICATE_API_TOKEN=...
SUNO_API_TOKEN=...
ELEVENLABS_API_KEY=...
UPSTASH_REDIS_URL=...
AWS_S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
WEBHOOK_SECRET=...
```

---

### Redis (Upstash or Heroku)

**Purpose:**
- Job queue (Bull or simple FIFO)
- Rate limit counters (atomic increments)
- Cache results (TTL: 30 days for videos, 1 hour for metadata)

**Schema:**
```
Keys:
  queue:video -> [job_id_1, job_id_2, ...]  (list, FIFO)
  quota:user_123:day -> 5  (counter, max 20 for Pro)
  cache:sha256_abc123 -> {url, model, timestamp}  (hash)
  model_status -> {flux: online, suno: offline}  (status map)
```

---

### PostgreSQL (Supabase)

**Tables:**
- `video_generation_jobs` (job state, input, output)
- `model_quotas` (per-user, per-model quotas)
- `premium_features` (feature flags)
- `webhook_subscriptions` (webhooks config)
- `webhook_deliveries` (audit log of deliveries)
- `usage_logs` (analytics)

**Indexing:**
```sql
CREATE INDEX idx_jobs_user_status ON video_generation_jobs(user_id, status);
CREATE INDEX idx_jobs_created ON video_generation_jobs(created_at DESC);
CREATE INDEX idx_quotas_user_day ON model_quotas(user_id, reset_at);
```

---

### S3 (AWS or Backblaze B2)

**Storage:**
- Bucket: `rhythmix-platform-outputs`
- Lifecycle policy: Delete after 30 days (auto-cleanup)
- Encryption: AES-256 (default)
- Versioning: Disabled (no need to version generated content)
- CORS: Allow CloudFront to read

**Structure:**
```
s3://rhythmix-platform-outputs/
  2024-06/
    24/
      job_123abc/
        output.mp4
        output.jpg (thumbnail)
        metadata.json
```

---

### CloudFront (CDN)

**Origin:** S3 bucket
**Cache Behavior:**
- TTL for videos: 1 day (immutable after completion)
- TTL for metadata: 5 minutes
- Compress: gzip
- Logging: disabled (cost + privacy)

**Distribution:**
- Domain: `cdn.rhythmix.com` (CNAME to CloudFront)
- All regions supported
- HTTP/2 enabled

---

## Error Handling

### Model Unavailability

```json
If FLUX unavailable:
{
  "status": "processing",
  "model_primary": "flux",
  "model_used": "stable-diffusion-3",
  "warning": "Primary model unavailable, using fallback"
}
```

### Quota Exceeded

```json
{
  "error": "quota_exceeded",
  "message": "Daily limit 20/20 reached",
  "reset_at": "2024-06-25T00:00:00Z",
  "remaining_seconds": 43200
}
```

### Job Failure

```json
{
  "status": "failed",
  "error_code": "invalid_input",
  "error_message": "Prompt too long (max 1000 chars)",
  "retry_eligible": false
}
```

### External Service Timeout

```json
{
  "status": "processing",
  "warning": "External service slow (>30s). Job will complete shortly.",
  "estimated_wait": 60
}
```

---

## Monitoring & Observability

### Key Metrics (Datadog / Axiom)

```
Throughput:
  - requests_per_second (by endpoint)
  - jobs_submitted_per_day (by tier)
  - model_usage (by model name)

Latency:
  - api_latency_p50, p95, p99
  - model_latency_p99 (per model)
  - cache_hit_latency
  - webhook_delivery_latency

Errors:
  - error_rate (by endpoint)
  - model_failure_rate (per model)
  - quota_exceeded_count
  - webhook_delivery_failures

Cost:
  - api_request_cost (infer from model + dimensions)
  - s3_egress_gb_per_day
  - redis_memory_usage
```

### Alerts

```
Critical:
  - Uptime <99.5% (15 min)
  - Model unavailability >1 min
  - Job failure rate >5%
  - Webhook delivery failure rate >1%

Warning:
  - API latency p99 >500ms
  - Cache hit rate <80%
  - Redis memory >80%
  - S3 egress >1 TB/day
```

---

## Security Considerations

### API Key Rotation

- Rotate API keys (Replicate, ElevenLabs, AWS) monthly
- Store in Vercel secrets (encrypted)
- No keys in code or logs

### HMAC Signing for Webhooks

```
signature = HMAC-SHA256(
  JSON.stringify(payload),
  webhook_secret
)

header: X-RHYTHMIX-Signature = signature
```

Consumer validates: `signature == HMAC-SHA256(body, secret)`

### Rate Limiting

- Per-user: 100 requests/min (per IP)
- Per-endpoint: 1000 requests/min (global)
- Fallback: circuit breaker on external APIs

### Audit Logging

```
Log:
  - Who: user_id
  - What: endpoint, input (sanitized)
  - When: timestamp
  - Result: success/failure, response status

Never log:
  - API keys, tokens
  - User emails (except via secure audit log)
  - Full input prompts (too large)
```

---

## Success Criteria

- [ ] Job submission <200ms latency (p99)
- [ ] Status polling <100ms latency (p99)
- [ ] Cache hit rate ≥95% (identical requests)
- [ ] Model fallback works automatically (0 "service down" errors)
- [ ] Webhook delivery succeeds 99.9% (after retries)
- [ ] Quota enforcement correct (no over-usage)
- [ ] Uptime ≥99.95% (over 1 week)
- [ ] All endpoints secured with JWT
- [ ] Zero data loss on API/database failures
- [ ] Monitoring alerts catch issues <5 min
