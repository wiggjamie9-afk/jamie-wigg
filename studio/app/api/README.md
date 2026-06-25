# RHYTHMIX Platform API — Vercel Edge Function Scaffolds

This directory contains scaffolded Vercel Edge Function API endpoints for the RHYTHMIX Platform backend (Wave 2, Phase 2-7).

## Architecture

All endpoints are **stateless**, **rate-limited**, and **horizontally scalable** on Vercel Edge Functions.

```
POST   /api/generate/video         → Job submission (202 Accepted)
GET    /api/generate/:job_id       → Status polling
DELETE /api/generate/:job_id       → Job cancellation
GET    /api/models/available       → Available models by tier
GET    /api/models/info/:model     → Detailed model info
GET    /api/quotas                 → User quotas + remaining
POST   /api/admin/quotas/:user_id  → Admin quota update
GET    /api/features               → Enabled features
POST   /api/webhooks/register      → Create webhook subscription
GET    /api/webhooks               → List subscriptions
PATCH  /api/webhooks/:id           → Update subscription
DELETE /api/webhooks/:id           → Delete subscription
POST   /api/webhooks/:id/test      → Test webhook delivery
```

## Features

### ✅ Implemented

- **Zod schema validation** for all request/response payloads
- **JWT authentication middleware** (stub: accepts Bearer tokens)
- **Rate limiting stub** (Redis placeholder with in-memory fallback)
- **Error handling** with structured error codes
- **Request logging** (Datadog/Axiom-compatible JSON)
- **HMAC signature validation** for webhooks
- **Quota enforcement** by tier (Free: 3/day, Pro: 20/day, Studio: unlimited)
- **Feature gating** by tier
- **Model router logic** with fallback chains
- **Cache key generation** (SHA256 deterministic)

### 🔧 Stub Implementations (Production TODO)

| Component | Status | Production | Notes |
|---|---|---|---|
| Job storage | In-memory Map | Supabase `video_generation_jobs` | See T1.1 |
| Rate limit store | In-memory Map | Redis (Upstash) | See T4.1-4.2 |
| Cache | In-memory (find) | Redis + S3 | See T5.1-5.2 |
| Queue | Stub (`LPUSH` comment) | Redis Bull or pg_boss | See T2.1 |
| Webhooks delivery | Stub (logged) | Async job queue | See T6.2 |
| Metrics export | Stub console | Datadog/Axiom HTTP | See T8.1 |
| JWT verification | Base64 decode | jose + JWKS | See auth middleware |

## Quick Start

### 1. Install Dependencies

```bash
cd studio
pnpm install
```

All endpoints require:
- `zod` (validation)
- `uuid` (ID generation)
- `jose` (JWT in production)

### 2. Local Development

```bash
pnpm dev
# Endpoints available at http://localhost:3000/api/*
```

### 3. Test Endpoints (curl examples)

#### Submit video job
```bash
curl -X POST http://localhost:3000/api/generate/video \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidGllciI6InBybyJ9.sig" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flux",
    "input": {
      "prompt": "A sunset over mountains",
      "dimensions": "1920x1080"
    }
  }'
```

#### Poll job status
```bash
curl -X GET http://localhost:3000/api/generate/job-id-here \
  -H "Authorization: Bearer ..."
```

#### List available models
```bash
curl -X GET http://localhost:3000/api/models/available \
  -H "Authorization: Bearer ..."
```

#### Get user quotas
```bash
curl -X GET http://localhost:3000/api/quotas \
  -H "Authorization: Bearer ..."
```

#### Register webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/register \
  -H "Authorization: Bearer ..." \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "https://example.com/webhook",
    "event_types": ["job.complete", "job.failed"]
  }'
```

#### Check enabled features
```bash
curl -X GET http://localhost:3000/api/features \
  -H "Authorization: Bearer ..."
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

- [ ] Replace in-memory stores with Supabase (see T1.1)
- [ ] Setup Redis (Upstash) for rate limit + cache (see T1.2)
- [ ] Setup S3 + CloudFront (see T1.3)
- [ ] Configure `.env` with Supabase, Redis, S3 keys

### Phase 2: Job API (Week 2)

- [ ] Implement actual job queue (Redis Bull or pg_boss)
- [ ] Add cache hit logic (SHA256 key → Redis get)
- [ ] Integrate with Replicate API (model selection, cost estimation)
- [ ] Add webhook event dispatch (on job status change)

### Phase 3: Model Router (Week 2)

- [ ] Fetch live model status from Replicate (nightly health check)
- [ ] Implement smart fallback logic (T3.4)
- [ ] Add analytics: model usage, fallback frequency

### Phase 4: Rate Limiting (Week 1)

- [ ] Replace in-memory rate limit with Redis
- [ ] Add daily reset job (nightly cron)
- [ ] Add quota tracking in Supabase

### Phase 5: Caching (Week 2)

- [ ] Implement cache storage (Redis hot, S3 cold)
- [ ] Add cache invalidation (manual + model updates)
- [ ] Add cache hit rate dashboard

### Phase 6: Webhooks (Week 2)

- [ ] Implement webhook delivery queue (async job)
- [ ] Add retry logic (exponential backoff)
- [ ] Add webhook delivery audit log

### Phase 7: Monitoring (Week 2)

- [ ] Export metrics to Datadog/Axiom
- [ ] Add Grafana dashboard
- [ ] Setup alerts (uptime, error rate, latency)

### Phase 8: QA (Week 1)

- [ ] Load test with k6 (1000 concurrent)
- [ ] Write integration tests (Postman + Jest)
- [ ] Document API (OpenAPI 3.0)

## File Structure

```
studio/app/api/
├── generate/
│   ├── schema.ts           # Zod schemas: job submission, status, cancellation
│   ├── route.ts            # POST/GET/DELETE handlers
│   └── [job_id]/route.ts   # Dynamic route handler
├── models/
│   ├── schema.ts           # Model metadata, availability, info
│   ├── route.ts            # GET /available, GET /info/:model
│   └── [model]/route.ts    # Dynamic model route
├── quotas/
│   ├── schema.ts           # User quotas, admin updates
│   ├── route.ts            # GET /quotas, POST /admin/quotas/:user_id
│   └── [user_id]/route.ts  # Dynamic user route
├── features/
│   ├── schema.ts           # Feature flags by tier
│   └── route.ts            # GET /features
├── webhooks/
│   ├── schema.ts           # Webhook subscription, event, delivery
│   ├── route.ts            # POST/GET/PATCH/DELETE handlers
│   └── [id]/route.ts       # Dynamic webhook route
├── middleware/
│   ├── auth.ts             # JWT authentication
│   ├── rate-limit.ts       # Rate limiter (stub Redis)
│   └── logging.ts          # Structured logging (Datadog/Axiom)
├── __tests__/
│   ├── generate.test.ts
│   ├── models.test.ts
│   ├── quotas.test.ts
│   ├── webhooks.test.ts
│   └── features.test.ts
└── README.md               # This file
```

## Environment Variables

Add to `.env.local` (development) or Vercel project settings (production):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxxx

# Redis (Upstash)
REDIS_URL=redis://default:xxxx@xxx.upstash.io:xxxxx

# S3 / CloudFront
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
S3_BUCKET=rhythmix-platform-outputs
CLOUDFRONT_DOMAIN=cdn.rhythmix.com

# JWT
JWT_SECRET=your-secret-key

# Monitoring
DATADOG_API_KEY=xxxx
# OR
AXIOM_API_KEY=xxxx

# External APIs
REPLICATE_API_TOKEN=xxxx
ELEVENLABS_API_KEY=xxxx
SUNO_API_KEY=xxxx
```

## Tier System

| Tier | Generation Quota | Models Available | Features |
|---|---|---|---|
| **Free** | 3/day | Stable Diffusion 3, Kokoro | Basic generation |
| **Pro** | 20/day | FLUX, SD3, HunyuanVideo, Suno, ElevenLabs | 4K export, webhooks, analytics |
| **Studio** | Unlimited | All + Runway Gen-3 | Team collab, custom models, priority queue |

## Authentication

All endpoints require JWT Bearer token in `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Payload should include:
```json
{
  "user_id": "user-uuid",
  "tier": "free|pro|studio",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Production TODO:** Replace stub JWT decode with jose + JWKS validation.

## Error Handling

All endpoints return structured errors:

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE",
  "details": {}
}
```

| Code | Status | Meaning |
|---|---|---|
| `MISSING_AUTH` | 401 | Missing or invalid authorization |
| `FORBIDDEN` | 403 | Insufficient privilege or quota |
| `NOT_FOUND` | 404 | Resource not found |
| `QUOTA_EXCEEDED` | 429 | Rate limit exceeded (includes `reset_at`) |
| `INVALID_JSON` | 400 | Malformed JSON |
| `VALIDATION_ERROR` | 400 | Zod validation failure (includes details) |
| `INVALID_STATE` | 409 | Cannot perform action in current state |
| `INTERNAL_ERROR` | 500 | Server error |

## Logging

All requests and errors are logged as structured JSON (Datadog/Axiom compatible):

```json
{
  "request_id": "xxxx",
  "timestamp": "2024-01-09T10:30:00Z",
  "environment": "production",
  "service": "rhythmix-api",
  "event_type": "request",
  "method": "POST",
  "path": "/api/generate/video",
  "status_code": 202,
  "duration_ms": 45,
  "message": "Job queued",
  "job_id": "xxxx"
}
```

Log levels: `debug`, `info`, `warn`, `error`. Set via `LOG_LEVEL` env var.

## Webhook Signature Validation (Client-side)

Example validation in Node.js:

```javascript
const crypto = require('crypto')

function validateWebhookSignature(payload, signature, secret) {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  return computed === signature
}

// In webhook handler:
const signature = req.headers['x-webhook-signature']
const isValid = validateWebhookSignature(req.body, signature, webhook.secret_key)
if (!isValid) return res.status(401).json({ error: 'Invalid signature' })
```

Python:

```python
import hmac
import hashlib
import json

def validate_webhook_signature(payload, signature, secret):
    computed = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return computed == signature
```

## Rate Limiting Details

**Free tier:** 3 generations/day
**Pro tier:** 20 generations/day
**Studio tier:** Unlimited

Quotas reset daily at **midnight UTC**.

Response headers on quota check:
```
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 2024-01-10T00:00:00Z
```

On 429:
```json
{
  "error": "Quota exceeded",
  "code": "QUOTA_EXCEEDED",
  "reset_at": "2024-01-10T00:00:00Z"
}
```

## Model Fallback Chains

| Primary | Fallback 1 | Fallback 2 |
|---|---|---|
| FLUX | Stable Diffusion 3 | Sano |
| HunyuanVideo | Runway Gen-3 | — |
| Suno v5 | — | — |
| ElevenLabs | Kokoro | — |

## Cache

**Key:** `cache:{sha256(input_json + model_id)}`
**TTL:** 30 days (Redis) + 1 hour metadata (CloudFront)
**Hit rate target:** ≥95%

Cache stores:
```json
{
  "output_url": "https://cdn.rhythmix.com/...",
  "model": "flux",
  "processing_time_ms": 45000,
  "cost": 0.05,
  "cached_at": "2024-01-09T10:30:00Z"
}
```

## Testing

Run test suite:

```bash
pnpm test
```

Load test (1000 concurrent, 10 min steady state):

```bash
# Using k6 (install globally)
k6 run scripts/load-test.js --vus 1000 --duration 10m
```

## Deployment

### To Vercel (production)

```bash
# Push to main branch
git push origin main

# Vercel auto-deploys via GitHub Actions
# Check: https://vercel.com/rhythmixapp/starlightmix-studio
```

### Environment secrets

In Vercel project settings:
1. Settings → Environment Variables
2. Add all vars from `.env.local`
3. Apply to: Production, Preview, Development

### Health check

```bash
# After deploy
curl https://studio.starlightmix.com/api/health
```

## Support & Documentation

- **API Spec:** OpenAPI 3.0 at `/api/docs` (TODO)
- **Issues:** GitHub Issues on `wiggjamie9-afk/jamie-wigg`
- **Spec:** `specs/rhythmix-platform/`
- **Tasks:** `specs/rhythmix-platform/tasks.md` (T2-T8)

## References

- **ADR-0001:** HyperFrames over Remotion (video pipeline)
- **CONTEXT.md:** Domain language (Promo, Cut, Narration, Hook)
- **Wave 2 Timeline:** Week 7-8 (Platform MVP)
