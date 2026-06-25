# Neural Twin Backend — AIO Docker Container

Single container deployment with PostgreSQL, Node.js Backend, and Migrations bundled together.

## Quick Start

### Docker Compose (Recommended)

```bash
# 1. Copy environment template
cp .env.docker.example .env

# 2. Edit .env with your values
# - ANTHROPIC_API_KEY (required)
# - POSTGRES_PASSWORD (optional, auto-generated if not set)
nano .env

# 3. Start all services
docker compose -f docker-compose.aio.yml up -d
```

### Docker Run (Manual)

```bash
docker run -d \
  --name neural-twin-aio \
  -p 5000:5000 \
  -p 5432:5432 \
  -v neural_twin_db:/var/lib/postgresql/data \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  -e POSTGRES_PASSWORD="$(openssl rand -hex 16)" \
  -e JWT_SECRET="$(openssl rand -hex 32)" \
  -e SESSION_SECRET="$(openssl rand -hex 32)" \
  ghcr.io/neural-twin/backend-aio:latest
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | ✓ | - | Claude API key from console.anthropic.com |
| `POSTGRES_PASSWORD` | | `postgres` | PostgreSQL password |
| `POSTGRES_USER` | | `postgres` | PostgreSQL username |
| `POSTGRES_DB` | | `neural_twin` | Database name |
| `JWT_SECRET` | | auto-generated | JWT signing secret (32+ random bytes) |
| `SESSION_SECRET` | | auto-generated | Session encryption secret |
| `NODE_ENV` | | `development` | Environment: development \| staging \| production |
| `PORT` | | `5000` | Backend API port |
| `LOG_LEVEL` | | `debug` | Logging level: debug \| info \| warn \| error |
| `CORS_ORIGIN` | | localhost:3000,8000 | CORS allowed origins |

## Container Architecture

```
┌─────────────────────────────────────────────┐
│       Neural Twin AIO Container             │
│  ┌───────────────────────────────────────┐  │
│  │          supervisord                  │  │
│  └───────────────────────────────────────┘  │
│       ▲         ▲            ▲              │
│       │         │            │              │
│       ▼         ▼            ▼              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │PostgreSQL│ │Migrations│ │Backend   │◄──┼─── Port 5000 (API)
│  │(Port 5432│ │(Prisma)  │ │(Node.js) │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│       ▲                                     │
│       │ (volume)                            │
│       ▼                                     │
│  /var/lib/postgresql/data                   │
└─────────────────────────────────────────────┘
```

## Startup Sequence

**Order of operations (managed by supervisord):**

1. **PostgreSQL** starts (priority: 1)
   - Initializes data directory if new
   - Listens on localhost:5432
   
2. **Migrations** run (priority: 2)
   - Waits 10 seconds for PostgreSQL to be ready
   - Runs `prisma migrate deploy`
   - Creates tables, indexes, seed data
   
3. **Backend** starts (priority: 3)
   - Connects to initialized PostgreSQL
   - Starts Express server on port 5000
   - Routes: `/health`, `/api/auth/*`, `/api/voice`, `/api/decisions`, `/api/twins/*`

**Full startup time:** ~60-90 seconds (includes migration time)

## Health Checks

The container includes a health check that verifies:

```bash
# Check PostgreSQL readiness
pg_isready -h localhost -U postgres -d neural_twin

# Check backend API
curl http://localhost:5000/health
```

**Health check interval:** Every 30 seconds  
**Start grace period:** 120 seconds (allows time for migrations)  
**Failure threshold:** 3 consecutive failures → container marked unhealthy

View health status:
```bash
docker inspect --format='{{.State.Health.Status}}' neural-twin-aio
```

## Data Persistence

Database data persists in a Docker volume:

```bash
# View volumes
docker volume ls | grep neural_twin

# Inspect volume
docker volume inspect neural_twin_db

# Manual backup (see Backup section)
```

If the volume is deleted, the next container start will reinitialize PostgreSQL from scratch.

## Logs

### View all logs
```bash
docker logs -f neural-twin-aio
```

### View logs for specific service
```bash
# PostgreSQL
docker exec neural-twin-aio tail -f /var/log/supervisor/postgres.out.log

# Migrations
docker exec neural-twin-aio tail -f /var/log/supervisor/migrations.out.log

# Backend
docker exec neural-twin-aio tail -f /var/log/supervisor/backend.out.log

# Supervisord
docker exec neural-twin-aio tail -f /var/log/supervisord.log
```

## Testing

Once container is running:

### 1. Health Check
```bash
curl http://localhost:5000/health
# Response: {"status": "ok", "db": "connected"}
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@neuraltwin.app",
    "password": "SecurePass123!"
  }'
# Response: {"userId": "...", "accessToken": "..."}
```

### 3. Record Voice
```bash
# Get token from registration, then:
curl -X POST http://localhost:5000/api/voice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I feel great today",
    "audioUrl": "https://example.com/voice.wav"
  }'
```

## Backup & Restore

### Backup Database

```bash
# Plain SQL backup
docker exec neural-twin-aio pg_dump -U postgres \
  --clean --if-exists --no-owner \
  neural_twin > backup.sql

# Compressed backup
docker exec neural-twin-aio pg_dump -U postgres \
  --clean --if-exists --no-owner -Fc \
  neural_twin > backup.dump
```

### Restore from Backup

```bash
# Restore from SQL
cat backup.sql | docker exec -i neural-twin-aio \
  psql -U postgres neural_twin

# Restore from compressed
docker exec -i neural-twin-aio pg_restore -U postgres \
  --clean --if-exists -d neural_twin < backup.dump
```

### Backup & Restore Script

```bash
#!/bin/bash

# Backup
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

docker exec neural-twin-aio pg_dump -U postgres \
  --clean --if-exists --no-owner -Fc \
  neural_twin > $BACKUP_DIR/neural_twin_$TIMESTAMP.dump

echo "✓ Backup created: $BACKUP_DIR/neural_twin_$TIMESTAMP.dump"

# Restore (if needed)
# cat $BACKUP_DIR/neural_twin_TIMESTAMP.dump | \
#   docker exec -i neural-twin-aio pg_restore -U postgres \
#   --clean --if-exists -d neural_twin
```

## Common Operations

### Stop Container
```bash
docker compose -f docker-compose.aio.yml down

# Stop but keep database volume
docker compose -f docker-compose.aio.yml down -v  # removes volume
docker compose -f docker-compose.aio.yml down     # keeps volume
```

### Restart Services
```bash
docker restart neural-twin-aio

# Or restart specific service via supervisord
docker exec neural-twin-aio supervisorctl restart backend
```

### Access PostgreSQL Directly
```bash
docker exec -it neural-twin-aio psql -U postgres -d neural_twin

# Query examples:
# \dt                              # List tables
# SELECT * FROM "User";            # List users
# SELECT COUNT(*) FROM "Decision"; # Count decisions
# \q                               # Quit
```

### View Environment
```bash
docker exec neural-twin-aio env | grep -E "ANTHROPIC|DATABASE|JWT"
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs neural-twin-aio

# Check if port is already in use
lsof -i :5000
lsof -i :5432

# Try removing and rebuilding
docker compose -f docker-compose.aio.yml down -v
docker compose -f docker-compose.aio.yml up -d --build
```

### Database connection errors

```bash
# Wait 60-90 seconds for full startup (includes migrations)
# Check if PostgreSQL is ready:
docker exec neural-twin-aio pg_isready -U postgres -d neural_twin

# Check DATABASE_URL is correct in .env:
docker exec neural-twin-aio env | grep DATABASE_URL
```

### "ANTHROPIC_API_KEY is required"

```bash
# Verify it's in .env
cat .env | grep ANTHROPIC

# Restart container
docker compose -f docker-compose.aio.yml down
docker compose -f docker-compose.aio.yml up -d
```

### Migrations failed

```bash
# Check migration logs
docker exec neural-twin-aio tail -f /var/log/supervisor/migrations.err.log

# Manually trigger migration
docker exec neural-twin-aio npx prisma migrate deploy

# If stuck, reset (WARNING: deletes data)
docker compose -f docker-compose.aio.yml down -v
docker compose -f docker-compose.aio.yml up -d
```

### Permission errors on volume

```bash
# Fix volume permissions
docker run --rm -v neural_twin_db:/data alpine chown -R 999:999 /data
```

## Performance Considerations

### CPU/Memory

- **Minimum:** 2 CPU, 2GB RAM
- **Recommended:** 4 CPU, 4GB RAM
- **Production:** 8 CPU, 8GB RAM (separate instances for DB/app)

### Database

- PostgreSQL runs with default Alpine settings
- For production, use separate managed PostgreSQL (RDS, Supabase, Neon)
- Max connections: ~100 (configurable in supervisord.conf)

### Scaling

**Single-node AIO is NOT recommended for:**
- High-traffic production (>100 req/s)
- Separate DB failover needs
- Zero-downtime deployments
- Horizontal scaling

**For production, use:**
- `docker-compose.yml` (separate database container)
- Managed PostgreSQL (Supabase, Neon, RDS)
- Kubernetes deployment
- Multiple app instances behind load balancer

## When to Use AIO vs Standard Deployment

| Use AIO | Use Standard |
|---------|--------------|
| ✓ Local development | ✓ Production |
| ✓ Quick demos | ✓ High availability |
| ✓ Team testing | ✓ Separate DB backups |
| ✓ Low traffic (<100 req/s) | ✓ Horizontal scaling |
| ✓ Single-node setup | ✓ Microservices |

## Next Steps

1. **Android/iOS Integration:** Point apps to `http://localhost:5000` (or your Docker host IP)
2. **Store Deployment:** Tag image and push to container registry
3. **CI/CD:** Add to GitHub Actions for auto-build and registry push
4. **Staging:** Deploy to staging environment with managed PostgreSQL

## Reference

- [Dockerfile](./backend/Dockerfile)
- [supervisord.conf](./backend/supervisord.conf)
- [docker-compose.aio.yml](./docker-compose.aio.yml)
- [Setup Guide](./backend/SETUP.md)
