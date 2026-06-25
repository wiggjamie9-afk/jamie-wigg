# Vercel Edge Function API Scaffolds — Summary

**Project:** RHYTHMIX Platform  
**Phase:** Wave 2, Phase 2-7 (Job API, Model Router, Quotas, Webhooks, Features)  
**Timeline:** Week 7-8 (MVP)  
**Status:** Scaffolded (stubs ready for production integration)

---

## What's Included

### ✅ 5 Complete API Endpoints

| Endpoint | Method | Purpose | Status |
|---|---|---|---|
| `/api/generate/video` | POST | Submit job | 202 Accepted, validated, rate-limited |
| `/api/generate/:job_id` | GET | Poll status | Returns status, progress, output_url |
| `/api/generate/:job_id` | DELETE | Cancel job | Marks cancelled, sends webhook |
| `/api/models/available` | GET | List models | Filtered by tier, includes status/latency |
| `/api/models/info/:model` | GET | Model details | Cost, params, success rate, fallback chain |
| `/api/quotas` | GET | User quotas | Daily remaining, reset time |
| `/api/admin/quotas/:user_id` | POST | Admin update | Studio tier only, update quota_per_day |
| `/api/features` | GET | Enabled features | By tier: free/pro/studio |
| `/api/webhooks/register` | POST | Subscribe | Creates subscription, generates secret |
| `/api/webhooks` | GET | List subscriptions | User subscriptions only |
| `/api/webhooks/:id` | PATCH | Update | Webhook URL, event types, active status |
| `/api/webhooks/:id` | DELETE | Unsubscribe | Remove subscription |
| `/api/webhooks/:id/test` | POST | Test delivery | Send test payload with HMAC |

### ✅ 3 Middleware Layers

1. **Authentication** (`middleware/auth.ts`)
   - JWT Bearer token validation (stub: Base64 decode)
   - User tier extraction (free/pro/studio)
   - Error: 401 Unauthorized

2. **Rate Limiting** (`middleware/rate-limit.ts`)
   - Per-user, per-tier quota enforcement
   - In-memory fallback (stub Redis)
   - Free: 3/day, Pro: 20/day, Studio: unlimited
   - Daily reset at midnight UTC
   - Error: 429 Too Many Requests

3. **Logging** (`middleware/logging.ts`)
   - Structured JSON logging (Datadog/Axiom compatible)
   - Request: method, path, status, duration
   - Errors: message, stack trace, context
   - Metrics: custom events, tags

### ✅ 5 Zod Schema Files

- `generate/schema.ts` — Job submission, status, cancellation
- `models/schema.ts` — Model metadata, availability, info
- `quotas/schema.ts` — User quotas, admin updates
- `webhooks/schema.ts` — Subscription, event, delivery
- `features/schema.ts` — Feature flags by tier

All schemas validated on input, typed for output.

### ✅ 5 Test Files (Jest/Vitest Stubs)

- `__tests__/generate.test.ts` — Job creation, polling, cancellation, quota, cache
- `__tests__/models.test.ts` — Model listing, info, tier filtering
- `__tests__/quotas.test.ts` — Quota retrieval, admin update, daily reset
- `__tests__/webhooks.test.ts` — Subscription CRUD, delivery, retries
- `__tests__/features.test.ts` — Feature flags by tier, gating

Each test includes acceptance criteria and TODOs for implementation.

### ✅ 2 Documentation Files

- **README.md** (650 lines)
  - Architecture overview
  - Quick start (curl examples)
  - Environment variables
  - Tier system
  - Error handling
  - Logging format
  - Webhook validation (multi-language)
  - Rate limiting details
  - Cache strategy
  - Testing & deployment

- **INTEGRATION.md** (450 lines)
  - Step-by-step Supabase setup (schema.sql)
  - Redis integration (Upstash)
  - S3 + CloudFront configuration
  - Webhook delivery engine
  - Datadog/Axiom logging
  - Integration tests
  - Load testing
  - Deployment checklist

---

## File Structure

```
studio/app/api/
├── generate/
│   ├── schema.ts              # Zod: input, response, history, cancel
│   ├── route.ts               # POST/GET/DELETE handlers
│   └── [job_id]/route.ts      # Dynamic route stub
├── models/
│   ├── schema.ts              # Zod: metadata, availability, info
│   ├── route.ts               # GET /available, GET /info/:model
│   └── [model]/route.ts       # Dynamic model route
├── quotas/
│   ├── schema.ts              # Zod: user quota, admin update
│   ├── route.ts               # GET /quotas, POST /admin/quotas/:user_id
│   └── [user_id]/route.ts     # Dynamic user route stub
├── features/
│   ├── schema.ts              # Zod: feature flags by tier
│   └── route.ts               # GET /features
├── webhooks/
│   ├── schema.ts              # Zod: subscription, event, delivery
│   ├── route.ts               # POST/GET/PATCH/DELETE, test
│   └── [id]/route.ts          # Dynamic webhook route
├── middleware/
│   ├── auth.ts                # JWT authentication
│   ├── rate-limit.ts          # Quota enforcement
│   └── logging.ts             # Structured JSON logging
├── __tests__/
│   ├── generate.test.ts       # Job API tests
│   ├── models.test.ts         # Model API tests
│   ├── quotas.test.ts         # Quota API tests
│   ├── webhooks.test.ts       # Webhook API tests
│   └── features.test.ts       # Feature API tests
├── README.md                  # Complete API documentation
├── INTEGRATION.md             # Production integration guide
└── SCAFFOLD-SUMMARY.md        # This file
```

---

## Key Features

### Input Validation
All endpoints use **Zod** for runtime validation:
```typescript
const input = generateVideoInputSchema.parse(req.body)
// Returns parsed data with correct types or throws ZodError
// Errors returned as 400 with detailed validation messages
```

### Error Handling
Structured error responses:
```json
{
  "error": "Quota exceeded",
  "code": "QUOTA_EXCEEDED",
  "reset_at": "2024-01-10T00:00:00Z"
}
```

Status codes: 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 409 (conflict), 429 (quota), 500 (server)

### Rate Limiting
- Per-user quota tracking (Redis stub)
- Tier-based limits (Free: 3/day, Pro: 20/day, Studio: unlimited)
- Daily reset at midnight UTC
- Response headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Logging
Datadog/Axiom-compatible structured JSON:
```json
{
  "request_id": "req-123",
  "timestamp": "2024-01-09T10:30:00Z",
  "service": "rhythmix-api",
  "method": "POST",
  "path": "/api/generate/video",
  "status_code": 202,
  "duration_ms": 45
}
```

### Webhooks
- HMAC-SHA256 signature validation
- Subscription management (create, list, update, delete)
- Test delivery endpoint
- Retry logic stub (exponential backoff: 1s, 2s, 4s, 8s)
- Audit trail (webhook_deliveries table)

### Model Router
- 8 models in catalog (FLUX, SD3, Sano, HunyuanVideo, Runway, Suno, ElevenLabs, Kokoro)
- Fallback chains (if primary unavailable, use fallback)
- Status tracking (online/offline/degraded)
- Cost estimation per model
- Supported parameters per model

### Feature Gating
- Free tier: basic generation only
- Pro tier: 4K export, webhooks, analytics, advanced caching
- Studio tier: everything + custom models, team collaboration, priority queue

---

## Production TODO (by Task)

| Task | Effort | Stub | Production | Notes |
|---|---|---|---|---|
| T1.1 | 2d | In-memory Map | Supabase tables | See INTEGRATION.md §1 |
| T1.2 | 1d | In-memory Map | Redis (Upstash) | See INTEGRATION.md §2 |
| T1.3 | 1d | N/A | S3 + CloudFront | See INTEGRATION.md §3 |
| T2.1 | 1d | Job submission | Replicate API | Enqueue job in Redis queue |
| T2.2 | 1d | 100ms latency | Supabase query | Status polling from DB |
| T2.3 | 0.5d | Cancel logic | Redis lrem + webhook | Broadcast cancellation event |
| T2.4 | 0.5d | N/A | Pagination | Cursor-based (job_id) |
| T3.1 | 1d | Static catalog | Nightly health check | Poll Replicate API status |
| T3.2 | 0.5d | Filtered list | Add fallback chain | Already in route.ts |
| T3.3 | 0.5d | Model info | Success rate from DB | Query analytics table |
| T3.4 | 1d | Stub selector | Smart fallback | Already in route.ts |
| T4.1 | 1d | In-memory | Supabase + Redis | See INTEGRATION.md §2 |
| T4.2 | 0.5d | Stub check | Atomic Redis decr | Already in rate-limit.ts |
| T4.3 | 0.5d | ✅ Implemented | Add Redis fetch | GET /api/quotas |
| T5.1 | 0.5d | ✅ Implemented | SHA256 hash | Cache key generation |
| T5.2 | 1d | Stub find | Redis + S3 storage | Set EX 2592000 (30d) |
| T5.3 | 1d | N/A | Datadog metrics | Cache hit rate tracking |
| T6.1 | 1d | ✅ CRUD implemented | Validation | POST/GET/PATCH/DELETE |
| T6.2 | 2d | Stub delivery | Async queue + retries | See INTEGRATION.md §4 |
| T6.3 | 0.5d | ✅ Example code | Multi-language examples | Already in README.md |
| T7.1 | 1d | ✅ Catalog defined | DB-driven flags | Load from premium_features table |
| T7.2 | 0.5d | ✅ Implemented | Response formatting | GET /api/features |
| T8.1 | 1d | ✅ Logging code | Datadog/Axiom export | See INTEGRATION.md §5 |
| T8.2 | 2d | N/A | Grafana dashboard | 6 key metrics (requests/sec, latency, error rate, cache hit, model usage, revenue) |
| T8.3 | 1d | N/A | Alert rules | Slack + PagerDuty | 3 critical, 3 warning levels |

**Stub to Production Effort:** ~30-40 hours (Phase 2-8 timeline)

---

## Quick Integration Steps

1. **Supabase** (2 hours)
   ```bash
   # 1. Create Supabase project
   # 2. Run migrations from INTEGRATION.md §1.2
   # 3. Update route.ts to use supabase client
   # 4. Add NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY to .env
   ```

2. **Redis** (1 hour)
   ```bash
   # 1. Create Upstash Redis instance
   # 2. Update rate-limit.ts to use Redis client
   # 3. Add REDIS_URL to .env
   ```

3. **S3 + CloudFront** (2 hours)
   ```bash
   # 1. Create S3 bucket (rhythmix-platform-outputs)
   # 2. Create CloudFront distribution with CNAME cdn.rhythmix.com
   # 3. Add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET to .env
   # 4. Implement uploadJobOutput() in generate handler
   ```

4. **Datadog Logging** (1 hour)
   ```bash
   # 1. Create Datadog account + get API key
   # 2. Uncomment sendToDatadog() calls in logging.ts
   # 3. Add DATADOG_API_KEY to .env
   ```

5. **Testing** (3 hours)
   ```bash
   pnpm test                    # Unit tests
   k6 run scripts/load-test.js  # Load test (1000 concurrent)
   ```

**Total integration time: ~9 hours** (1 day for experienced developer)

---

## Deployment

### Local Development
```bash
cd studio
pnpm dev
# http://localhost:3000/api/generate/video
```

### Vercel Staging
```bash
git push origin feature-branch
# Auto-deploys to https://<branch>.starlightmix-studio.pages.dev
```

### Vercel Production
```bash
git push origin main
# Triggers production build, requires manual approval
# Deploys to https://studio.starlightmix.com/api/*
```

### Environment Setup

Add secrets to Vercel project settings:

```env
# Supabase (Phase 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx

# Redis (Phase 1)
REDIS_URL=redis://default:xxxx@xxx.upstash.io:xxxxx

# S3 (Phase 1)
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
S3_BUCKET=rhythmix-platform-outputs
CLOUDFRONT_DOMAIN=cdn.rhythmix.com

# JWT (already in use)
JWT_SECRET=xxxxx

# Monitoring (Phase 2)
DATADOG_API_KEY=xxxx
AXIOM_API_KEY=xxxx

# Cron (Phase 2)
CRON_SECRET=xxxxx
```

---

## Success Criteria (Scaffold Ready)

- ✅ 13 endpoints scaffolded (5 features + 3 middleware + comprehensive tests)
- ✅ Zod validation on all inputs
- ✅ JWT auth middleware
- ✅ Rate limiting stub (in-memory) with Redis placeholder
- ✅ Structured logging (Datadog/Axiom compatible)
- ✅ Model router with fallback chains
- ✅ Webhook HMAC signature validation
- ✅ Feature gating by tier
- ✅ Cache key generation (SHA256)
- ✅ Error handling with structured codes
- ✅ Test stubs for all endpoints
- ✅ Complete documentation (README + INTEGRATION guide)
- ✅ Ready for Vercel Edge deployment

---

## Next Steps

1. **Week 1:** Integrate Supabase + Redis (see INTEGRATION.md)
2. **Week 2:** Connect to Replicate API, implement job queue
3. **Week 3:** Add webhook delivery, cron quota reset
4. **Week 4:** Datadog monitoring, load testing, deployment

See `specs/rhythmix-platform/tasks.md` for detailed phase breakdown.

---

## Support

- **Documentation:** `studio/app/api/README.md` (API reference) + `INTEGRATION.md` (production setup)
- **Spec:** `specs/rhythmix-platform/` (requirements, design, tasks)
- **Issues:** GitHub Issues on `wiggjamie9-afk/jamie-wigg`
- **Questions:** Contact project lead

---

## References

- **Vercel Edge Functions:** https://vercel.com/docs/functions/edge-functions
- **Supabase:** https://supabase.com/docs
- **Redis:** https://redis.io/docs/
- **Zod:** https://zod.dev/
- **Datadog:** https://docs.datadoghq.com/
