# RESONANCE Local Development Setup

Complete guide to running RESONANCE (all 21 apps + backend API) locally.

## Prerequisites

- **Node.js 20+** (`node --version`)
- **Docker & Docker Compose** (`docker --version`)
- **PostgreSQL 16** (or use Docker)
- **Git**

## Quick Start (5 minutes with Docker)

```bash
# 1. Clone repo (if not already done)
cd ~/Desktop
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg

# 2. Start all services (PostgreSQL, Redis, API, Web)
docker-compose up -d

# 3. Wait for services to be healthy (~30s)
docker-compose ps  # All should say "healthy"

# 4. Initialize database
cd resonance-api
npm install
npm run db:setup
cd ..

# 5. Start web app (in a new terminal)
cd resonance-web
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## Manual Setup (without Docker)

### Step 1: PostgreSQL Setup

**On Mac (with Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Create database:**
```bash
createdb resonance
export DATABASE_URL="postgresql://localhost:5432/resonance"
```

### Step 2: Backend API

```bash
cd resonance-api
npm install

# Set up environment
cp .env.example .env
# Edit .env and set DATABASE_URL if needed

# Run migrations & seed data
npm run db:setup

# Start dev server
npm run dev
```

API will be available at **http://localhost:3001/api/v1**

Health check: http://localhost:3001/health

### Step 3: Web App

```bash
cd resonance-web
npm install

# Create .env.local
cat > .env.local <<EOF
REACT_APP_API_URL=http://localhost:3001/api/v1
EOF

# Start dev server
npm run dev
```

Web will be available at **http://localhost:3000**

---

## Environment Variables

### API (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost:5432/resonance
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-xxx  # Get from console.anthropic.com
JWT_SECRET=dev-secret-change-in-production
REFRESH_SECRET=dev-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

### Web (.env.local)
```
REACT_APP_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## Testing the System

### 1. Sign Up

```bash
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

Response includes `accessToken` and `refreshToken`.

### 2. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Complete a Lesson (with auth token)

Replace `YOUR_TOKEN` with the token from signup/login:

```bash
curl -X POST http://localhost:3001/api/v1/progress/USER_ID/bright-brains/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "trackId": "bright-brains-track-0",
    "lessonIndex": 0,
    "timeSpent": 600,
    "emotionalRating": 4
  }'
```

### 4. Chat with JARVIS

```bash
curl -X POST http://localhost:3001/api/v1/chat/USER_ID/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "I'm feeling overwhelmed with my to-do list",
    "appId": "steady",
    "sessionId": "session_123"
  }'
```

### 5. Submit Biometrics

```bash
curl -X POST http://localhost:3001/api/v1/biometrics/USER_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "heartRate": 72,
    "hrv": 45,
    "breathingRate": 14,
    "stressLevel": 35,
    "emotionalState": "calm",
    "source": "manual"
  }'
```

---

## Docker Compose Services

The `docker-compose.yml` file runs 4 services:

| Service | Port | Health Check |
|---------|------|--------------|
| PostgreSQL | 5432 | Query port 5432 |
| Redis | 6379 | Ping port 6379 |
| API | 3001 | GET /health |
| Web | 3000 | TCP port 3000 |

### View Logs
```bash
docker-compose logs -f api      # API logs
docker-compose logs -f web      # Web logs
docker-compose logs -f postgres # Database logs
```

### Stop Services
```bash
docker-compose down              # Stop all services
docker-compose down -v           # Stop and remove volumes (clean slate)
```

---

## Troubleshooting

### "Database connection refused"
- Check PostgreSQL is running: `brew services list` (Mac) or `systemctl status postgresql` (Linux)
- Verify DATABASE_URL: `echo $DATABASE_URL`
- Check port 5432 is open: `lsof -i :5432`

### "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### "Migration failed"
```bash
# Check schema_migrations table
psql resonance -c "SELECT * FROM schema_migrations;"

# Reset migrations (⚠️ deletes data)
psql resonance -c "DROP TABLE schema_migrations;"
npm run db:migrate
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API returning 503 errors
```bash
# Check database connection
curl http://localhost:3001/health

# Check database is running
psql resonance -c "SELECT NOW();"
```

---

## Development Workflow

### Adding a New Lesson
Edit `resonance-api/src/db/seed.ts` and rerun:
```bash
npm run db:seed
```

### Modifying Database Schema
1. Create a new migration file: `resonance-api/src/db/migrations/0002_add_something.sql`
2. Run: `npm run db:migrate`

### Testing React Components
```bash
cd resonance-web
npm run test
```

### Building for Production
```bash
# API
cd resonance-api
npm run build
npm start

# Web
cd resonance-web
npm run build
npm start
```

---

## Next Steps

1. **Sign up** and explore the 21 apps
2. **Complete lessons** in each app to test progress tracking
3. **Chat with JARVIS** in the Brain Buddy app
4. **Submit biometrics** to test health data integration
5. **Check database** to see data persistence:
   ```bash
   psql resonance
   SELECT * FROM users;
   SELECT * FROM progress;
   SELECT * FROM biometrics;
   ```

---

## Production Deployment

See `RESONANCE-BUILD-PLAN.md` Phase 7 (Deployment & CI/CD) for:
- Railway API deployment
- Vercel web deployment
- iOS/Android apps via Capacitor
- GitHub Actions CI/CD pipeline

---

**Questions?** Check DOCKER-SETUP.md for Docker-specific details.
