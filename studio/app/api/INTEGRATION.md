# API Integration Guide — Production Migrations

This guide covers replacing stub implementations with production services:
Supabase (jobs, quotas, webhooks), Redis (rate limit, cache), S3 (output storage).

---

## 1. Supabase Integration (Jobs, Quotas, Webhooks)

### 1.1 Setup Supabase Project

```bash
# Create project at supabase.com
# Get credentials:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx (service_role key)
```

### 1.2 Run Migrations

See `specs/rhythmix-platform/schema.sql` for full schema.

Quick setup:

```sql
-- 1. Video generation jobs
CREATE TABLE video_generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  model text NOT NULL,
  input jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'processing', 'complete', 'failed', 'cancelled')),
  output_url text,
  error_message text,
  processing_time_ms integer,
  cost_estimate numeric,
  cached boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_jobs_user_id ON video_generation_jobs(user_id);
CREATE INDEX idx_jobs_status ON video_generation_jobs(status);
CREATE INDEX idx_jobs_created_at ON video_generation_jobs(created_at DESC);

-- Enable RLS
ALTER TABLE video_generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs" ON video_generation_jobs
  FOR SELECT USING (auth.uid()::text = user_id);

-- 2. Quotas
CREATE TABLE model_quotas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  model text NOT NULL,
  quota_per_day integer NOT NULL,
  used_today integer DEFAULT 0,
  reset_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, model)
);

CREATE INDEX idx_quotas_user_id ON model_quotas(user_id);

-- 3. Webhook subscriptions
CREATE TABLE webhook_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  webhook_url text NOT NULL,
  event_types text[] NOT NULL,
  secret_key text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_webhooks_user_id ON webhook_subscriptions(user_id);

-- 4. Webhook deliveries (audit)
CREATE TABLE webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES webhook_subscriptions(id),
  job_id uuid,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  http_status integer,
  attempt_num integer DEFAULT 1,
  next_retry_at timestamp with time zone,
  delivered_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_deliveries_subscription ON webhook_deliveries(subscription_id);
```

### 1.3 Update generate/route.ts

Replace stub job store:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// In POST handler, replace jobStore.set():
const { data, error } = await supabase
  .from('video_generation_jobs')
  .insert([job])
  .select()
  .single()

if (error) throw error
```

### 1.4 Update quotas/route.ts

Replace stub quota store:

```typescript
// In GET /api/quotas
const { data: quotas } = await supabase
  .from('model_quotas')
  .select('*')
  .eq('user_id', user_id)

if (!quotas) {
  // Initialize quotas
  await supabase.from('model_quotas').insert(newQuotas)
}
```

### 1.5 Update webhooks/route.ts

Replace stub webhook store:

```typescript
// In POST /api/webhooks/register
const { data: subscription, error } = await supabase
  .from('webhook_subscriptions')
  .insert([{
    user_id,
    webhook_url,
    event_types,
    secret_key: secretKey,
    active: true
  }])
  .select()
  .single()
```

---

## 2. Redis Integration (Rate Limiting, Cache)

### 2.1 Setup Redis (Upstash)

```bash
# Create free tier at upstash.com
# Get connection string:
REDIS_URL=redis://default:xxxxx@xxx.upstash.io:xxxxx
```

### 2.2 Update rate-limit.ts

Replace stub in-memory store:

```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL!,
})

export async function checkRateLimit(userId: string, tier: string) {
  const key = `quota:${userId}:${tier}:day`
  const quotaLimit = QUOTA_LIMITS[tier] || QUOTA_LIMITS.free

  if (quotaLimit === -1) return { allowed: true, remaining: -1, resetAt: ... }

  // Atomic decrement
  const remaining = await redis.decr(key)
  
  if (remaining === 0) {
    // First use this day, set expiry to midnight UTC
    await redis.expireat(key, getMidnightUTC())
  }

  return {
    allowed: remaining >= 0,
    remaining: Math.max(0, remaining),
    resetAt: await redis.ttl(key) * 1000,
  }
}
```

### 2.3 Add Nightly Quota Reset

Create `pages/api/cron/reset-quotas.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// Verify Vercel Cron secret
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = createClient(...)
  const redis = new Redis(...)

  // Get all users with quotas expiring today
  const { data: quotas } = await supabase
    .from('model_quotas')
    .select('*')
    .lt('reset_at', new Date())

  // Reset in Supabase
  const { error } = await supabase
    .from('model_quotas')
    .update({
      used_today: 0,
      reset_at: new Date(new Date().setUTCDate(new Date().getUTCDate() + 1))
    })
    .lt('reset_at', new Date())

  // Clear Redis cache
  await redis.del(`quota:*`)

  return NextResponse.json({ reset: quotas.length })
}
```

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/reset-quotas",
    "schedule": "0 0 * * *"
  }]
}
```

### 2.4 Cache Integration (generate/route.ts)

```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({ url: process.env.REDIS_URL! })

// Check cache before creating job
const cacheKey = generateCacheKey(validatedInput, model)
const cachedResult = await redis.get(cacheKey)

if (cachedResult && (validatedInput as Record<string, unknown>).cache_check !== false) {
  return NextResponse.json({
    job_id: cachedResult.job_id,
    status: 'complete',
    output_url: cachedResult.output_url,
    cached: true,
    created_at: cachedResult.created_at,
  })
}

// ... later, on job completion
await redis.set(cacheKey, {
  job_id: jobId,
  output_url: outputUrl,
  processing_time_ms: processingTime,
  cost: costEstimate,
  created_at: new Date().toISOString(),
}, { ex: 2592000 }) // 30 days TTL
```

---

## 3. S3 Integration (Output Storage)

### 3.1 Create S3 Bucket

```bash
# AWS Console
# Bucket: rhythmix-platform-outputs
# Region: us-east-1
# Encryption: AES-256
# Lifecycle rule: Delete after 30 days
```

IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::rhythmix-platform-outputs/*"
    }
  ]
}
```

### 3.2 Create CloudFront Distribution

1. **Origin:** `rhythmix-platform-outputs.s3.amazonaws.com`
2. **Cache policy:** 1 hour for videos, 5 min for metadata
3. **CNAME:** `cdn.rhythmix.com`

### 3.3 Upload to S3 (generate/route.ts)

Create `lib/s3.ts`:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: 'us-east-1' })

export async function uploadJobOutput(jobId: string, buffer: Buffer): Promise<string> {
  const key = `jobs/${jobId}/output.mp4`
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'video/mp4',
    Metadata: { job_id: jobId },
  }))

  return `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`
}
```

Then in job completion handler:

```typescript
const outputUrl = await uploadJobOutput(jobId, outputBuffer)
await supabase
  .from('video_generation_jobs')
  .update({ status: 'complete', output_url: outputUrl })
  .eq('id', jobId)
```

---

## 4. Webhook Delivery Engine

Create `lib/webhooks.ts`:

```typescript
import * as crypto from 'crypto'

export async function deliverWebhook(
  webhookUrl: string,
  secret: string,
  payload: any,
  maxRetries: number = 5
) {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Attempt': String(attempt),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30s timeout
      })

      // Log delivery
      await supabase.from('webhook_deliveries').insert({
        webhook_url: webhookUrl,
        payload,
        http_status: response.status,
        attempt_num: attempt,
        delivered_at: response.ok ? new Date() : null,
        success: response.ok,
      })

      if (response.ok) return true
    } catch (err) {
      // Retry with exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  return false
}
```

Trigger on job completion:

```typescript
// In job completion handler
const { data: subscriptions } = await supabase
  .from('webhook_subscriptions')
  .select('*')
  .eq('user_id', jobUserId)
  .eq('active', true)

for (const sub of subscriptions) {
  // Enqueue async delivery (or call directly for simple version)
  await deliverWebhook(sub.webhook_url, sub.secret_key, {
    event_type: 'job.complete',
    job_id: jobId,
    output_url: outputUrl,
    timestamp: new Date().toISOString(),
  })
}
```

---

## 5. Monitoring & Logging

### 5.1 Datadog Integration

Create `lib/datadog.ts`:

```typescript
export async function sendMetric(
  metricName: string,
  value: number,
  tags?: Record<string, string>
) {
  await fetch('https://api.datadoghq.com/api/v1/series', {
    method: 'POST',
    headers: {
      'DD-API-KEY': process.env.DATADOG_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      series: [{
        metric: `rhythmix.${metricName}`,
        points: [[Math.floor(Date.now() / 1000), value]],
        tags: Object.entries(tags || {}).map(([k, v]) => `${k}:${v}`),
      }],
    }),
  })
}
```

### 5.2 Add to API Handlers

```typescript
import { sendMetric } from '@/lib/datadog'

// In POST /api/generate/video
await sendMetric('job.submitted', 1, {
  tier,
  model: validatedInput.model,
})

// On job completion
await sendMetric('job.completed', processingTimeMs, {
  model,
  cached: String(cached),
})

// On quota exceeded
await sendMetric('quota.exceeded', 1, { tier })
```

---

## 6. Testing Production Integrations

### 6.1 Integration Tests

Create `app/api/__tests__/integration.test.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'

describe('Integration tests', () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const redis = new Redis({ url: process.env.REDIS_URL! })

  it('should create job in Supabase', async () => {
    const { data: job } = await supabase
      .from('video_generation_jobs')
      .insert([{ user_id: 'test', model: 'flux', input: {}, status: 'queued' }])
      .select()
      .single()

    expect(job.id).toBeDefined()
    expect(job.status).toBe('queued')
  })

  it('should enforce rate limits with Redis', async () => {
    await redis.set('quota:test:free:day', 3)
    const remaining1 = await redis.decr('quota:test:free:day')
    const remaining2 = await redis.decr('quota:test:free:day')
    const remaining3 = await redis.decr('quota:test:free:day')
    const remaining4 = await redis.decr('quota:test:free:day')

    expect(remaining1).toBe(2)
    expect(remaining2).toBe(1)
    expect(remaining3).toBe(0)
    expect(remaining4).toBe(-1) // Over quota
  })
})
```

### 6.2 Load Test with Real Services

```bash
k6 run scripts/load-test.js \
  --env SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --env SUPABASE_KEY=$SUPABASE_SERVICE_KEY \
  --env REDIS_URL=$REDIS_URL \
  --vus 100 \
  --duration 5m
```

---

## 7. Deployment Checklist

- [ ] Supabase project created + migrations run
- [ ] Redis (Upstash) instance created
- [ ] S3 bucket + CloudFront distribution setup
- [ ] All secrets added to Vercel environment
- [ ] Cron job configured (quota reset)
- [ ] Datadog/Axiom project setup
- [ ] Integration tests pass
- [ ] Load test completes successfully
- [ ] Monitoring dashboards created
- [ ] Alerts configured
- [ ] Documentation updated

---

## References

- Supabase docs: https://supabase.com/docs
- Upstash Redis: https://upstash.com/docs/redis/overall/getstarted
- AWS S3: https://docs.aws.amazon.com/s3/
- Datadog APM: https://docs.datadoghq.com/logs/

See `specs/rhythmix-platform/` for full implementation details.
