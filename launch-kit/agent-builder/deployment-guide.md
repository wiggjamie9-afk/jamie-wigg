# Agent Builder: Deployment & Infrastructure Guide

## Overview

This guide covers deploying the Agent Builder platform (web app + API) to production environments. The platform consists of:

- **Web App**: Next.js 15 static export (Cloudflare Pages or Vercel)
- **API Backend**: Node.js/Express or serverless functions (AWS Lambda, Vercel Functions)
- **Database**: PostgreSQL (optional, for user/project persistence)
- **Auth**: Clerk, Auth0, or custom JWT

---

## Local Development Setup

### Prerequisites

- Node 20+ and pnpm 9+
- `.env.local` file with required secrets (see `.env.example`)

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/agent-builder.git
cd agent-builder

# Install dependencies
pnpm install

# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your API keys and database URL
nano .env.local

# Run dev server
pnpm dev
```

**Dev server** runs at `http://localhost:3000`

### Environment Variables

Required for local development:

```env
# Anthropic API (for agent execution)
ANTHROPIC_API_KEY=sk-ant-...

# Authentication (choose one)
CLERK_SECRET_KEY=sk_test_...
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...

# Database (optional, for user persistence)
DATABASE_URL=postgresql://user:password@localhost:5432/agent_builder

# Email (optional, for password resets / invitations)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@agentbuilder.com

# Optional: Stripe for billing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Production Deployments

### Option A: Cloudflare Pages + Workers

**Best for**: Static marketing site + serverless API, global CDN, pay-as-you-go pricing.

#### Web App Deployment

```bash
# 1. Install Wrangler
pnpm add -D wrangler

# 2. Build Next.js static export
pnpm build

# 3. Create wrangler.toml in project root
cat > wrangler.toml <<EOF
name = "agent-builder"
type = "javascript"
main = "src/index.js"
account_id = "YOUR_ACCOUNT_ID"
workers_dev = true
route = "https://app.agentbuilder.com/*"
zone_id = "YOUR_ZONE_ID"
EOF

# 4. Deploy to Cloudflare Pages
wrangler pages deploy out/
```

#### API Deployment (Cloudflare Workers)

Create `src/index.js` for API endpoints:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Agents endpoint
    if (url.pathname === '/api/agents' && request.method === 'GET') {
      const token = request.headers.get('Authorization');
      if (!token) return new Response('Unauthorized', { status: 401 });
      
      // Fetch agents from database or return mock
      const agents = await env.DB.prepare(
        'SELECT * FROM agents WHERE user_id = ?'
      ).bind(extractUserId(token)).all();
      
      return new Response(JSON.stringify({ data: agents.results }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
```

**Cloudflare env setup**:
- Bind a KV namespace for caching: `wrangler kv:namespace create "AGENT_CACHE"`
- Bind D1 database: `wrangler d1 create agent_builder`
- Set secrets: `wrangler secret put ANTHROPIC_API_KEY`

---

### Option B: Vercel (Recommended)

**Best for**: Tight Next.js integration, preview deployments, auto-scaling.

#### Setup

```bash
# 1. Connect GitHub repo to Vercel
# https://vercel.com/new (import from GitHub)

# 2. Set environment variables in Vercel dashboard
# Settings → Environment Variables:
ANTHROPIC_API_KEY=sk-ant-...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...

# 3. Configure vercel.json in project root
cat > vercel.json <<EOF
{
  "buildCommand": "pnpm build",
  "outputDirectory": "out",
  "envPrefix": "NEXT_PUBLIC_",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
EOF

# 4. Push to main or production branch
# Vercel auto-deploys on push
```

**Preview deployments**: Every pull request gets a preview URL automatically.

**Production**: Requires approval from a designated GitHub Environment (`production`).

---

### Option C: AWS Lambda + API Gateway

**Best for**: Custom infrastructure, cost control, VPC integration.

#### Setup with Serverless Framework

```bash
# Install Serverless Framework
npm install -g serverless

# Create serverless.yml
cat > serverless.yml <<EOF
service: agent-builder-api

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  environment:
    ANTHROPIC_API_KEY: \${ssm:/agent-builder/api-key}
    DATABASE_URL: \${ssm:/agent-builder/db-url}
  iam:
    role:
      statements:
        - Effect: Allow
          Action: ssm:GetParameter
          Resource: "arn:aws:ssm:*:*:parameter/agent-builder/*"

functions:
  listAgents:
    handler: src/handlers/agents.list
    events:
      - http:
          path: agents
          method: get
          authorizer: authorizer
  createAgent:
    handler: src/handlers/agents.create
    events:
      - http:
          path: agents
          method: post
          authorizer: authorizer
  authorizer:
    handler: src/handlers/auth.authorizer

plugins:
  - serverless-python-requirements
  - serverless-offline
EOF

# Deploy
serverless deploy
```

---

## Database Setup

### PostgreSQL (Recommended)

```bash
# Local development
docker run --name agent-builder-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=agent_builder \
  -p 5432:5432 \
  -d postgres:16

# Connect
psql postgresql://postgres:password@localhost:5432/agent_builder
```

**Schema**:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  tier VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  tier VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  event_type VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_analytics_agent_id ON analytics(agent_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
```

### Run migrations

```bash
# Using Node migration tool (e.g., migrate-mongo, Flyway, Liquibase)
npx migrate-mongo up
```

---

## Authentication Setup

### Clerk (Recommended)

```bash
# 1. Create account at https://clerk.com
# 2. Get API keys from Clerk dashboard
# 3. Set environment variables
export CLERK_SECRET_KEY=sk_test_...
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# 4. In Next.js app, wrap app with ClerkProvider
# (app/layout.tsx)
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}

# 5. Protect API routes
// pages/api/agents.ts
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  // Fetch agents for userId
}
```

### Auth0

```bash
# 1. Create application at https://auth0.com
# 2. Get credentials from Auth0 dashboard
export AUTH0_DOMAIN=your-domain.auth0.com
export AUTH0_CLIENT_ID=...
export AUTH0_CLIENT_SECRET=...

# 3. Integrate with next-auth or auth0-react
```

---

## Monitoring & Observability

### Logging

```javascript
// Use structured logging
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty'
  }
});

logger.info({ user_id, agent_id }, 'Agent created');
```

### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Set up in pages/_app.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

- **Vercel Analytics**: Automatic for Vercel-deployed apps
- **Cloudflare Analytics**: Built-in for Cloudflare Pages
- **Custom**: Use web vitals library

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getFCP(console.log); // First Contentful Paint
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

---

## Scaling & Performance

### Database Connection Pooling

```bash
# Use PgBouncer for connection pooling
docker run --name pgbouncer \
  -e PGBOUNCER_DATABASE_URL=postgresql://postgres:password@db:5432/agent_builder \
  -p 6432:6432 \
  pgbouncer/pgbouncer
```

### CDN Caching

**Cloudflare**: Cache static assets at edge globally
```
Cache-Control: public, max-age=31536000, immutable
```

**Vercel**: Automatic via deployment infrastructure

### Rate Limiting

Implement per-user rate limits using Redis or in-memory store:

```javascript
import Ratelimit from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 req/hour
});

export async function handler(req) {
  const { success } = await ratelimit.limit(req.user.id);
  if (!success) return new Response('Rate limited', { status: 429 });
}
```

---

## Deployment Checklist

- [ ] Environment variables set in production dashboard
- [ ] Database migrations run
- [ ] Authentication configured (Clerk / Auth0 / custom)
- [ ] API keys rotated and secured
- [ ] CORS headers configured (`Access-Control-Allow-Origin`)
- [ ] SSL/TLS certificates installed
- [ ] Monitoring & logging enabled
- [ ] Rate limiting configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Load testing completed (e.g., k6, JMeter)
- [ ] Security audit completed (OWASP Top 10)

---

## Support & Troubleshooting

**500 errors on API calls?**
- Check API logs in Vercel/Cloudflare dashboard
- Verify environment variables are set correctly
- Test database connection: `psql $DATABASE_URL`

**High latency?**
- Enable database query caching
- Use CDN for static assets
- Check rate limits (429 responses)
- Profile with Vercel Analytics or Cloudflare insights

**Database connection timeouts?**
- Increase connection pool size
- Check VPC/security group settings
- Verify DATABASE_URL is accessible from deployment region

**Authentication failures?**
- Verify Clerk/Auth0 credentials
- Check callback URLs match configured domains
- Clear browser cookies and try again

---

## Next Steps

1. **Staging environment**: Deploy to staging before production (use `vercel env production` to control this)
2. **Load testing**: Use k6 or Artillery to test API under load
3. **Security hardening**: Run OWASP dependency checks, configure WAF rules
4. **Analytics setup**: Connect Google Analytics / Mixpanel to track user behavior
5. **CI/CD pipeline**: Automate tests + lint checks on every commit
