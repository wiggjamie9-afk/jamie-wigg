---
name: app-backend-architect
description: Backend architecture patterns for iOS/Android apps, databases, APIs, and cloud deployment
---

# App Backend Architect

Design scalable backend systems for STARLIGHTMIX Studio, iOS/Android apps, and distributed generation workloads.

## When to use

- Building user authentication and accounts
- Storing generation history and user preferences
- Creating real-time collaboration features
- Scaling to 10K+ concurrent users
- Integrating with Replicate, Higgsfield, ElevenLabs APIs
- Building payment systems (Gumroad licenses)
- Setting up monitoring and error tracking

## Architecture Patterns

### Pattern 1: Lightweight (MVP)

```
Client (Next.js/React)
    ↓
Cloudflare Workers (edge)
    ├─ License validation
    ├─ API proxy (CORS)
    └─ Rate limiting
    ↓
Third-party APIs (Replicate, Higgsfield, ElevenLabs)
Storage: localStorage + IndexedDB (client-side only)

Pros: No backend ops, cost-free
Cons: No user persistence, no sharing, limited features
Best for: STARLIGHTMIX Studio (current setup)
```

### Pattern 2: Serverless (Scale-ready)

```
Client (iOS/Android + Web)
    ↓
Cloudflare Workers OR AWS Lambda
    ├─ Authentication (JWT)
    ├─ API gateway
    ├─ Rate limiting
    └─ Webhook handlers
    ↓
Database: Supabase (PostgreSQL)
    ├─ User accounts
    ├─ Generation history
    └─ Preferences
    ↓
Queue: Bull (Redis) or Firestore
    └─ Async generation jobs
    ↓
Storage: S3 or Supabase Storage
    └─ Generated files (MP4, MP3, etc)

Pros: Scales automatically, pay-per-use, fast iteration
Cons: Multiple vendor lock-in, cold starts
Best for: Growth phase (100-10K users)
```

### Pattern 3: Full-stack (Production)

```
Client
    ↓
API Gateway (Kong or AWS API Gateway)
    ├─ Authentication
    ├─ Rate limiting
    ├─ Request validation
    └─ Metrics
    ↓
Microservices
    ├─ Auth service (user mgmt, JWT)
    ├─ Generation service (Replicate API)
    ├─ History service (read/write generation logs)
    ├─ Social service (sharing, collaboration)
    └─ Payment service (Gumroad integration)
    ↓
Database: PostgreSQL (primary) + Redis (cache)
Queue: Bull + Redis (job processing)
Storage: S3 (media files)
Monitoring: Datadog/New Relic

Pros: Highly scalable, independent teams, observability
Cons: Operational complexity, high cost
Best for: >10K users, revenue-generating
```

## Database Design (Supabase/PostgreSQL)

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free', -- free, pro, lifetime
  monthly_generation_limit INT DEFAULT 10,
  monthly_generations_used INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Generation History
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'image', 'video', 'music', 'avatar'
  model TEXT NOT NULL, -- 'FLUX', 'seedance-v2', 'elevenlabs', etc
  prompt TEXT NOT NULL,
  parameters JSONB, -- model-specific params
  output_url TEXT,
  output_size_bytes INT,
  quality_score FLOAT, -- 0-10
  cost_credits FLOAT,
  status TEXT DEFAULT 'pending', -- pending, processing, complete, failed
  error_message TEXT,
  generation_time_seconds INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  default_model TEXT DEFAULT 'FLUX',
  quality_preference TEXT DEFAULT 'balanced', -- fast, balanced, premium
  theme TEXT DEFAULT 'dark',
  notification_preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credits/Usage
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount FLOAT NOT NULL,
  type TEXT NOT NULL, -- 'purchase', 'generation', 'refund'
  reference_id UUID, -- links to generation or order
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
```

## API Design

### Authentication

```
POST /auth/signup
├─ email, password → JWT token + refresh token
├─ Return: { accessToken, refreshToken, user }
└─ Status: 201

POST /auth/login
├─ email, password → JWT token
├─ Return: { accessToken, refreshToken, user }
└─ Status: 200

POST /auth/refresh
├─ refreshToken → new accessToken
├─ Return: { accessToken }
└─ Status: 200

POST /auth/logout
├─ Invalidate refreshToken
└─ Status: 204
```

### Generation API

```
POST /api/generate
├─ Authorization: Bearer {token}
├─ Body: { type, model, prompt, parameters }
├─ Response: { generationId, status: 'pending' }
├─ Webhook: POST user's webhook_url when complete
└─ Status: 202 Accepted

GET /api/generations/{id}
├─ Authorization: Bearer {token}
├─ Response: Full generation object + output URL
└─ Status: 200

GET /api/generations
├─ Authorization: Bearer {token}
├─ Query: ?limit=20&offset=0&type=video
├─ Response: paginated generations
└─ Status: 200

DELETE /api/generations/{id}
├─ Authorization: Bearer {token}
├─ Delete generation record
└─ Status: 204
```

### Usage/Credits

```
GET /api/user/credits
├─ Authorization: Bearer {token}
├─ Response: {
│   monthly_limit: 100,
│   monthly_used: 32,
│   remaining: 68,
│   lifetime_generations: 523,
│   plan: 'pro'
│ }
└─ Status: 200

GET /api/user/usage
├─ Authorization: Bearer {token}
├─ Response: { today: 5, this_week: 22, this_month: 45 }
└─ Status: 200
```

## Job Queue Architecture

### Generation Workflow

```
User requests video generation
    ↓
API validates request + deducts credits
    ↓
Create generation record (status: pending)
    ↓
Enqueue job: { userId, generationId, model, prompt }
    ↓
Worker picks up job
    ├─ Call Replicate/Higgsfield API
    ├─ Poll for completion
    ├─ Download result
    ├─ Upload to S3
    └─ Update generation record (status: complete, output_url)
    ↓
Webhook: POST to user's webhook_url
    ├─ generationId, status, output_url, quality_score
    └─ User app is notified in real-time
    ↓
User sees notification → downloads result
```

### Retries & Dead Letter Queue

```
Job fails:
├─ Retry 1: Wait 30s, try again
├─ Retry 2: Wait 2min, try again
├─ Retry 3: Wait 10min, try again
├─ Retry 4: Move to dead letter queue
└─ Alert: ops@company, user notified of failure

Dead Letter Handler:
├─ Investigate error
├─ Manual intervention or auto-refund credits
└─ Log for analysis
```

## Authentication & Security

### JWT Tokens

```
Access Token:
├─ Expires: 15 minutes
├─ Payload: { userId, email, plan, iat, exp }
└─ Use: API requests

Refresh Token:
├─ Expires: 30 days
├─ Stored: Secure, httpOnly cookie
├─ Use: Getting new access tokens
└─ Rotation: New refresh token on each use
```

### API Key for CLI/Automation

```
User generates API key → stored hashed in DB
CLI tool: RHYTHMIX_API_KEY=sk_live_abc123xyz...
Authorization: Bearer {API_KEY} in header
Scopes: read, write, admin (granular permissions)
Rotation: Auto-rotate every 90 days
```

## Cost Optimization

### Tiered Pricing

```
Free:
├─ 10 generations/month
├─ 1080p max quality
├─ No exports to social
└─ Community only

Pro ($9.99/mo):
├─ 100 generations/month
├─ 4K quality
├─ Priority processing
└─ Private projects

Lifetime ($99 one-time):
├─ Unlimited generations
├─ 4K quality
├─ Fast processing
└─ API access
```

### Database Cost Reduction

```
-- Archive old generations after 90 days
CREATE TABLE generations_archive AS
SELECT * FROM generations WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM generations WHERE created_at < NOW() - INTERVAL '90 days';

-- Purge failed generations after 30 days
DELETE FROM generations WHERE status = 'failed' AND created_at < NOW() - INTERVAL '30 days';

-- Keep only recent for analytics
CREATE TABLE generation_analytics (daily aggregates, kept 1 year)
```

## Monitoring & Observability

### Key Metrics

```
Availability:
├─ API uptime: 99.9%
├─ Database uptime: 99.95%
└─ Generation success rate: 98%+

Performance:
├─ API response time: <200ms p95
├─ Generation queue time: <5min avg
└─ Database query time: <50ms p99

Usage:
├─ DAU (daily active users)
├─ Generations per user (average)
├─ Credit conversion rate
└─ Churn rate
```

### Alerting

```
PagerDuty alerts for:
├─ API error rate > 1%
├─ Response time > 500ms
├─ Queue backing up > 10min
├─ Database CPU > 80%
└─ Disk space < 10%
```

## Deployment

### Cloudflare Workers (Lightweight)
```bash
wrangler deploy
# Near-instant, global edge deployment
```

### AWS Lambda + RDS (Serverless)
```bash
# Deploy API
sam deploy

# Database
aws rds create-db-instance \
  --db-instance-identifier rhythmix-prod \
  --db-instance-class db.t3.micro \
  --engine postgres
```

### Docker + Kubernetes (Full-stack)
```bash
kubectl apply -f k8s/deployment.yaml
# Auto-scales based on CPU
```

## Next Steps

1. **Start with:** Lightweight (Cloudflare Workers only)
2. **Add when:** Users request accounts/history
3. **Add when:** >100 users
4. **Upgrade to:** Serverless (Supabase + Lambda)
5. **Scale to:** Full-stack (Kubernetes) at >10K users

**Current state:** Stateless (localStorage)
**Next state:** Lightweight + Supabase
