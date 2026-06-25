# RHYTHMIX Platform Schema — API Integration Examples

**Date:** 2026-06-25  
**Language:** TypeScript (Vercel Functions + Supabase)

---

## Overview

This document shows how the backend API will interact with the schema to implement requirements R1-R7 (jobs, models, quotas, webhooks, features, usage).

---

## 1. Video Generation Job Submission (R1)

**Endpoint:** `POST /api/generate/video`

**Request:**
```typescript
interface GenerateVideoRequest {
  input_data: {
    prompt: string;
    dimensions?: '1080x1920' | '1920x1080' | '1080x1080';
    duration?: number;
    template?: string;
  };
  model: 'flux_pro' | 'hunyuan_video' | 'suno_v5';
  tier: 'free' | 'pro' | 'studio';
}
```

**Implementation:**
```typescript
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const userId = req.headers['x-user-id'];
  const { input_data, model, tier } = req.body;

  // 1. CHECK QUOTA
  const { data: quota, error: quotaErr } = await supabase
    .from('model_quotas')
    .select('used_today, quota_per_day')
    .eq('user_id', userId)
    .eq('model', model)
    .single();

  if (!quota) {
    return res.status(404).json({ error: 'Quota not found for user' });
  }

  if (quota.used_today >= quota.quota_per_day) {
    // Log to usage_logs as "failure"
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        model,
        timestamp: new Date(),
        duration_sec: 0,
        cost_credits: 0,
        status: 'failure'
      });

    return res.status(429).json({
      error: 'Quota exceeded',
      remaining: 0,
      reset_at: quota.reset_at
    });
  }

  // 2. CREATE JOB
  const jobId = randomUUID();
  const { error: jobErr } = await supabase
    .from('video_generation_jobs')
    .insert({
      id: jobId,
      user_id: userId,
      input_type: 'api',
      input_data,
      model,
      tier,
      status: 'queued',
      cost_estimate: 0.0,  // Will update after processing
      created_at: new Date()
    });

  if (jobErr) {
    return res.status(500).json({ error: jobErr.message });
  }

  // 3. INCREMENT QUOTA
  await supabase
    .from('model_quotas')
    .update({ used_today: quota.used_today + 1 })
    .eq('user_id', userId)
    .eq('model', model);

  // 4. QUEUE JOB (to pg_boss or Bull queue)
  // Pseudocode:
  // queue.enqueue('process-video', { job_id: jobId });

  return res.status(202).json({
    job_id: jobId,
    status: 'queued',
    queue_position: 1,  // Would be calculated from queue depth
    estimated_completion_time: 120  // seconds
  });
}
```

**Response Headers:**
```
X-Quota-Remaining: 19
X-Quota-Reset-At: 2026-06-26T00:00:00Z
X-Job-ID: <uuid>
```

---

## 2. Job Status Polling (R1)

**Endpoint:** `GET /api/generate/:job_id`

**Implementation:**
```typescript
export default async function handler(req, res) {
  const { job_id } = req.query;
  const userId = req.headers['x-user-id'];

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY  // User can see own job
  );

  const { data: job, error } = await supabase
    .from('video_generation_jobs')
    .select('*')
    .eq('id', job_id)
    .eq('user_id', userId)
    .single();

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status === 'complete') {
    return res.status(200).json({
      job_id: job.id,
      status: 'complete',
      output_url: job.output_url,
      processing_time_sec: job.processing_time_sec,
      cost_estimate: job.cost_estimate,
      completed_at: job.completed_at
    });
  }

  if (job.status === 'failed') {
    return res.status(200).json({
      job_id: job.id,
      status: 'failed',
      error_message: job.error_message,
      processing_time_sec: job.processing_time_sec
    });
  }

  // Still processing or queued
  return res.status(200).json({
    job_id: job.id,
    status: job.status,
    queue_position: 1  // Calculated from queue depth
  });
}
```

---

## 3. Quota Check (R3)

**Endpoint:** `GET /api/quotas`

**Implementation:**
```typescript
export default async function handler(req, res) {
  const userId = req.headers['x-user-id'];

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: quotas } = await supabase
    .from('model_quotas')
    .select('*')
    .eq('user_id', userId);

  // Transform to API response
  const quotaResponse = quotas.map(q => ({
    model: q.model,
    quota_per_day: q.quota_per_day,
    used_today: q.used_today,
    remaining: q.quota_per_day - q.used_today,
    resets_at: q.reset_at
  }));

  return res.status(200).json(quotaResponse);
}
```

**Response:**
```json
[
  {
    "model": "flux_pro",
    "quota_per_day": 20,
    "used_today": 3,
    "remaining": 17,
    "resets_at": "2026-06-26T00:00:00Z"
  },
  {
    "model": "suno_v5",
    "quota_per_day": 20,
    "used_today": 1,
    "remaining": 19,
    "resets_at": "2026-06-26T00:00:00Z"
  }
]
```

---

## 4. Webhook Registration (R5)

**Endpoint:** `POST /api/webhooks/register`

**Request:**
```typescript
interface WebhookRegisterRequest {
  webhook_url: string;
  event_types: ('job.complete' | 'job.failed' | 'quota.limit_exceeded')[];
}
```

**Implementation:**
```typescript
import { randomUUID } from 'crypto';
import { randomBytes } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const userId = req.headers['x-user-id'];
  const { webhook_url, event_types } = req.body;

  // Validate webhook URL
  try {
    new URL(webhook_url);
  } catch {
    return res.status(400).json({ error: 'Invalid webhook URL' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Generate secret key for HMAC signing
  const secretKey = randomBytes(32).toString('hex');

  const { data, error } = await supabase
    .from('webhook_subscriptions')
    .insert({
      user_id: userId,
      webhook_url,
      event_types,
      active: true,
      secret_key: secretKey,  // Store hashed in production
      created_at: new Date()
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    id: data.id,
    webhook_url: data.webhook_url,
    event_types: data.event_types,
    active: data.active,
    secret_key: secretKey  // Return once, user must store
  });
}
```

---

## 5. Webhook Delivery (Backend Service)

**Job Queue Consumer** (runs async, triggered when job completes)

```typescript
// workers/webhook-delivery.ts

async function deliverWebhook(jobId: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY  // Service role to bypass RLS
  );

  // 1. Get job details
  const { data: job } = await supabase
    .from('video_generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (!job) return;

  // 2. Get user's active webhooks
  const { data: subscriptions } = await supabase
    .from('webhook_subscriptions')
    .select('*')
    .eq('user_id', job.user_id)
    .eq('active', true);

  // 3. Filter subscriptions by event type
  const eventType = job.status === 'complete' ? 'job.complete' : 'job.failed';
  const relevantSubs = subscriptions.filter(sub =>
    sub.event_types.includes(eventType)
  );

  // 4. Deliver to each webhook (with retries)
  for (const sub of relevantSubs) {
    await deliverWithRetries(sub, job, eventType);
  }
}

async function deliverWithRetries(
  subscription,
  job,
  eventType,
  attempt = 1,
  maxAttempts = 5
) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const payload = {
    job_id: job.id,
    status: job.status,
    output_url: job.output_url,
    processing_time_sec: job.processing_time_sec,
    cost_credits: job.cost_estimate,
    event_type: eventType,
    timestamp: new Date().toISOString()
  };

  // Sign with HMAC-SHA256
  const signature = hmacSha256(
    JSON.stringify(payload),
    subscription.secret_key
  );

  try {
    const response = await fetch(subscription.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RHYTHMIX-Signature': signature,
        'X-RHYTHMIX-Event': eventType
      },
      body: JSON.stringify(payload),
      timeout: 5000
    });

    // Log delivery
    await supabase
      .from('webhook_deliveries')
      .insert({
        subscription_id: subscription.id,
        job_id: job.id,
        event_type: eventType,
        payload,
        http_status: response.status,
        attempt_num: attempt,
        created_at: new Date()
      });

    if (response.status === 200) {
      return;  // Success
    }

    // Failure — retry with backoff
    if (attempt < maxAttempts) {
      const backoffMs = Math.pow(2, attempt - 1) * 1000;  // 1s, 2s, 4s, 8s
      setTimeout(
        () => deliverWithRetries(subscription, job, eventType, attempt + 1, maxAttempts),
        backoffMs
      );
    }
  } catch (error) {
    // Network error — log and retry
    console.error('Webhook delivery failed:', error);

    await supabase
      .from('webhook_deliveries')
      .insert({
        subscription_id: subscription.id,
        job_id: job.id,
        event_type: eventType,
        payload,
        http_status: null,  // No response
        attempt_num: attempt,
        created_at: new Date()
      });

    if (attempt < maxAttempts) {
      const backoffMs = Math.pow(2, attempt - 1) * 1000;
      setTimeout(
        () => deliverWithRetries(subscription, job, eventType, attempt + 1, maxAttempts),
        backoffMs
      );
    }
  }
}

function hmacSha256(data: string, secret: string): string {
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}
```

---

## 6. Premium Feature Gating (R6)

**Endpoint:** `GET /api/features`

**Implementation:**
```typescript
export default async function handler(req, res) {
  const userId = req.headers['x-user-id'];

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: features } = await supabase
    .from('premium_features')
    .select('feature_flag, enabled, tier')
    .eq('user_id', userId);

  // Transform to feature set
  const enabledFeatures = features
    .filter(f => f.enabled)
    .map(f => f.feature_flag);

  return res.status(200).json({
    enabled_features: enabledFeatures,
    all_features: features
  });
}
```

**Usage in API:**
```typescript
// Before returning 4K export endpoint
const features = await getEnabledFeatures(userId);
if (!features.includes('video_export_4k')) {
  return res.status(403).json({ error: 'Feature not enabled for your tier' });
}
```

---

## 7. Usage Analytics (R7)

**Endpoint:** `GET /api/admin/usage` (admin only)

**Implementation:**
```typescript
export default async function handler(req, res) {
  const userRole = req.headers['x-user-role'];

  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY  // Admin role
  );

  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Query all partitions
  const { data: logs } = await supabase
    .from('usage_logs')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Aggregate by day
  const byDay = {};
  for (const log of logs) {
    const date = new Date(log.created_at).toISOString().split('T')[0];
    if (!byDay[date]) {
      byDay[date] = {
        jobs: 0,
        revenue: 0,
        duration_sec: 0,
        success_count: 0
      };
    }
    byDay[date].jobs++;
    byDay[date].revenue += log.cost_credits;
    byDay[date].duration_sec += log.duration_sec;
    if (log.status === 'success') byDay[date].success_count++;
  }

  return res.status(200).json({
    period: { from: thirtyDaysAgo, to: new Date() },
    by_day: byDay,
    total_revenue: logs.reduce((sum, log) => sum + log.cost_credits, 0),
    total_jobs: logs.length,
    success_rate: (logs.filter(l => l.status === 'success').length / logs.length * 100).toFixed(2) + '%'
  });
}
```

---

## 8. Job Completion Handler

**Backend Job Processing** (triggered by job queue)

```typescript
async function processJob(jobId: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // 1. Get job
  const { data: job } = await supabase
    .from('video_generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  // 2. Update status to "processing"
  await supabase
    .from('video_generation_jobs')
    .update({ status: 'processing' })
    .eq('id', jobId);

  try {
    // 3. Call Replicate / HunyuanVideo API
    const output = await callModel(job.model, job.input_data);

    // 4. Upload to S3
    const s3Url = await uploadToS3(output, jobId);

    // 5. Mark complete
    const now = new Date();
    const processingTime = Math.round(
      (now.getTime() - new Date(job.created_at).getTime()) / 1000
    );

    await supabase
      .from('video_generation_jobs')
      .update({
        status: 'complete',
        output_url: s3Url,
        processing_time_sec: processingTime,
        completed_at: now
      })
      .eq('id', jobId);

    // 6. Log usage
    await supabase
      .from('usage_logs')
      .insert({
        user_id: job.user_id,
        model: job.model,
        timestamp: job.created_at,
        duration_sec: processingTime,
        cost_credits: calculateCost(job.model, processingTime),
        status: 'success',
        created_at: now
      });

    // 7. Deliver webhook
    await deliverWebhook(jobId);

  } catch (error) {
    // Mark failed
    await supabase
      .from('video_generation_jobs')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date()
      })
      .eq('id', jobId);

    // Log failure
    await supabase
      .from('usage_logs')
      .insert({
        user_id: job.user_id,
        model: job.model,
        timestamp: job.created_at,
        duration_sec: 0,
        cost_credits: 0,
        status: 'failure',
        created_at: new Date()
      });

    // Deliver webhook
    await deliverWebhook(jobId);
  }
}
```

---

## 9. Daily Quota Reset (Cron)

**Endpoint:** `GET /api/cron/reset-quotas`

**Implementation:**
```typescript
export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Reset all quotas where reset_at <= now
  const { data, error } = await supabase
    .from('model_quotas')
    .update({
      used_today: 0,
      reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000)  // Tomorrow
    })
    .lte('reset_at', new Date().toISOString())
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    message: 'Quotas reset successfully',
    count: data?.length || 0
  });
}
```

**Vercel cron config (vercel.json):**
```json
{
  "crons": [
    {
      "path": "/api/cron/reset-quotas",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## Testing Patterns

### Unit test: Job submission
```typescript
test('POST /api/generate/video creates job and increments quota', async () => {
  const userId = 'test-user-123';
  const response = await fetch('/api/generate/video', {
    method: 'POST',
    headers: { 'x-user-id': userId },
    body: JSON.stringify({
      model: 'flux_pro',
      input_data: { prompt: 'a sunset' }
    })
  });

  expect(response.status).toBe(202);
  const { job_id } = await response.json();
  expect(job_id).toBeDefined();

  // Check quota incremented
  const quotaResp = await fetch('/api/quotas', {
    headers: { 'x-user-id': userId }
  });
  const quotas = await quotaResp.json();
  expect(quotas[0].used_today).toBe(1);
});
```

### Load test: 1000 concurrent jobs
```typescript
async function loadTest() {
  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(
      fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'x-user-id': `user-${i}` },
        body: JSON.stringify({
          model: 'flux_pro',
          input_data: { prompt: 'test' }
        })
      })
    );
  }

  const results = await Promise.all(promises);
  const success = results.filter(r => r.status === 202).length;
  console.log(`Success rate: ${success}/1000`);
  // Target: >99% success
}
```

---

## Error Handling

### Standard error responses
```typescript
// 400 Bad Request
{ error: 'Invalid input', details: '...' }

// 401 Unauthorized
{ error: 'Invalid token' }

// 403 Forbidden
{ error: 'Feature not enabled for your tier' }

// 404 Not Found
{ error: 'Job not found' }

// 429 Too Many Requests
{ error: 'Quota exceeded', remaining: 0, reset_at: '...' }

// 500 Internal Server Error
{ error: 'Database error', details: '...' }
```

---

## References

- `schema.sql` — Database DDL
- `SCHEMA-DESIGN.md` — Table rationale, indexes, RLS
- `requirements.md` — R1-R8 requirements
