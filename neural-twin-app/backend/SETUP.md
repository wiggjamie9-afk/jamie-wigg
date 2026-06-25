# Neural Twin Backend — Phase 2 Setup

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or Neon/Supabase)
- ANTHROPIC_API_KEY from https://console.anthropic.com/account/keys

## Step 1: Get DATABASE_URL

### Option A: Neon (Free tier recommended)

1. Go to https://console.neon.tech
2. Create a new project
3. Copy the connection string: `postgresql://user:password@host/dbname`

### Option B: Supabase

1. Go to https://supabase.com/dashboard
2. Create a new project
3. Go to Settings → Database → Connection strings
4. Copy the "Connection pooler" URI

## Step 2: Create .env File

```bash
cd neural-twin-app/backend

# Copy template and edit with your values
cp .env.example .env

# Edit .env:
# - DATABASE_URL: your PostgreSQL connection string
# - ANTHROPIC_API_KEY: sk-ant-... from Anthropic console
# - JWT_SECRET: run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
# - SESSION_SECRET: run the same command again
```

## Step 3: Install Dependencies

```bash
cd neural-twin-app/backend
npm install
```

## Step 4: Initialize Database

```bash
# Generate Prisma client (required after schema changes)
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Seed test data (creates test user with credentials)
npm run seed
```

## Step 5: Start Backend

```bash
npm run dev
```

Should see:
```
✓ Server running on http://localhost:5000
✓ Swagger docs: http://localhost:5000/api-docs
✓ Connected to PostgreSQL
```

## Test Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@neuraltwin.app",
    "password": "SecurePass123!"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@neuraltwin.app",
    "password": "SecurePass123!"
  }'
```

Response includes `accessToken` — use for authenticated requests.

### 4. Record Voice (Authenticated)
```bash
curl -X POST http://localhost:5000/api/voice \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I feel great today, ready to learn new things",
    "audioUrl": "https://example.com/voice.wav"
  }'
```

## Environment Variables Reference

| Variable | Required | Example | Notes |
|---|---|---|---|
| DATABASE_URL | ✓ | postgresql://... | Neon or Supabase |
| ANTHROPIC_API_KEY | ✓ | sk-ant-... | From console.anthropic.com |
| JWT_SECRET | ✓ | 32+ random hex | Never commit to git |
| NODE_ENV | | development | development \| staging \| production |
| PORT | | 5000 | Change if conflict |
| CORS_ORIGIN | | http://localhost:3000 | Frontend URL |
| LOG_LEVEL | | debug | debug \| info \| warn \| error |

## Troubleshooting

### "Error: Can't reach database server"
- Verify DATABASE_URL is correct
- Check PostgreSQL is running (Neon: no action needed)
- Ensure IP is whitelisted (Supabase: add your IP in Settings)

### "ANTHROPIC_API_KEY is required"
- Copy from https://console.anthropic.com/account/keys
- Paste into .env (no quotes needed)

### "Prisma schema validation failed"
- Run `npx prisma validate`
- Check `prisma/schema.prisma` syntax

### Port 5000 already in use
- Change `PORT=5001` in .env
- Or: `lsof -i :5000 && kill -9 <PID>`

## Next Steps

Once backend is running:
1. **Android**: Wire Android app to http://localhost:5000 (or your deployment URL)
2. **iOS**: Wire iOS app to same backend URL
3. **Test Suite**: Run `npm run test` to validate endpoints
4. **Deployment**: See `DEPLOY.md` for staging/production setup

## Database Schema

Key tables created by migration:

- `User` — accounts with JWT secrets, hashed passwords
- `VoiceRecording` — emotional state snapshots with Claude API scores
- `Decision` — logged decisions with metacognitive pillar scores
- `TwinInteraction` — chat history with 9 specialist Twins
- `AccessLog` — API call tracking for analytics

See `prisma/schema.prisma` for full schema.
