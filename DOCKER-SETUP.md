# RESONANCE Docker Development Setup

**Quick Start:** Run the entire RESONANCE stack locally with Docker Compose.

## Prerequisites

- Docker Desktop (Mac/Windows) or Docker Engine (Linux)
- Docker Compose v2.0+
- Git

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg
```

### 2. Create Environment Files

#### API Configuration
```bash
cp resonance-api/.env.example resonance-api/.env
```

Edit `resonance-api/.env` and add your API keys:
- `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com/
- `ELEVENLABS_API_KEY` - Get from https://elevenlabs.io/
- `STRIPE_SECRET_KEY` - Get from https://stripe.com/

#### Web Configuration
```bash
cp resonance-web/.env.example resonance-web/.env.local
```

### 3. Start Docker Services

```bash
# Start all services (Postgres, Redis, API, Web)
docker-compose up -d

# View logs
docker-compose logs -f

# Or follow specific service
docker-compose logs -f api
docker-compose logs -f web
```

### 4. Initialize Database

```bash
# Run migrations (done automatically in postgres init, but you can manually run)
docker-compose exec api npm run migrate

# Seed with sample data (optional)
docker-compose exec postgres psql -U resonance -d resonance -f /docker-entrypoint-initdb.d/0001_initial_schema.sql
```

## Access Services

- **Web App:** http://localhost:3001
- **API:** http://localhost:3000
- **API Health Check:** http://localhost:3000/health
- **Database:** postgresql://resonance:resonance-dev-password@localhost:5432/resonance
- **Redis:** redis://localhost:6379

## Common Commands

### View Running Services
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs web
docker-compose logs postgres
docker-compose logs redis

# Follow logs
docker-compose logs -f api
```

### Access Services

#### Connect to Database
```bash
docker-compose exec postgres psql -U resonance -d resonance
```

#### Access API Container
```bash
docker-compose exec api bash
```

#### Access Web Container
```bash
docker-compose exec web bash
```

#### Access Redis
```bash
docker-compose exec redis redis-cli
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart api
```

### Stop Services
```bash
# Stop without removing
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild after changing Dockerfile or dependencies
docker-compose up -d --build

# Force rebuild
docker-compose build --no-cache
docker-compose up -d
```

## Development Workflow

### Hot Reload
Both API and Web services have hot reload enabled:
- API (`npm run dev`) watches TypeScript files
- Web (`npm run dev`) watches Next.js files

Changes to source files will automatically rebuild and reload.

### Adding Dependencies

#### API
```bash
docker-compose exec api npm install package-name
```

#### Web
```bash
docker-compose exec web npm install package-name
```

### Running Commands

```bash
# Run migrations
docker-compose exec api npm run migrate

# Run tests
docker-compose exec api npm test
docker-compose exec web npm test

# Build for production
docker-compose exec web npm run build
```

## Database Schema

The PostgreSQL schema includes:
- `users` - User accounts with subscription status
- `apps` - Lesson apps (Mum Brain, Sleep, etc.)
- `tracks` - Learning tracks within each app
- `lessons` - Individual lessons
- `progress` - User progress tracking with streaks
- `biometrics` - Health data from Apple HealthKit/Google Fit
- `chat_messages` - Chat history with JARVIS AI
- `subscriptions` - Stripe subscription status
- `voice_commands` - Voice command history

All tables have appropriate indexes for performance.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Change ports in docker-compose.yml
# Or kill the process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check database is healthy
docker-compose ps

# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### Out of Memory
```bash
# Increase Docker memory in Desktop settings
# Or limit container memory in docker-compose.yml
```

### Changes Not Reflecting
```bash
# Rebuild containers with fresh dependencies
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

For production, use:
- Managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- Managed Redis (AWS ElastiCache, etc.)
- API deployed to Railway, Heroku, or AWS
- Web deployed to Vercel or Netlify

See `resonance-api/Dockerfile` and `resonance-web/Dockerfile` for production builds.

## Next Steps

1. Start development with `docker-compose up -d`
2. Open http://localhost:3001 to test the web app
3. Build React components (already done in Phase 2)
4. Integrate API routes with React hooks
5. Test biometric integration with mock data
6. Set up authentication flow

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure Docker daemon is running
4. Check database migrations ran successfully
