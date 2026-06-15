# Database Migrations

## Overview
Three migrations set up the Agent Builder database:

1. **001_users.sql** — Users table + auth + RLS policies
2. **002_projects.sql** — Projects table + indexes
3. **003_analytics.sql** — Analytics table + aggregation functions

## For Local Development (Supabase)

### Option A: Automatic (Recommended)
```bash
bash scripts/run-migrations.sh
```

### Option B: Manual
```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push < agent-builder/migrations/001_users.sql
supabase db push < agent-builder/migrations/002_projects.sql
supabase db push < agent-builder/migrations/003_analytics.sql

# Verify
supabase db console  # Opens dashboard
```

## For Cloud Supabase (Production)

### Step-by-step:
1. Create account at https://supabase.com
2. Create new project
3. Go to **SQL Editor** in dashboard
4. For each migration file:
   - Open: `agent-builder/migrations/XXX_name.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run"
5. Repeat for 001, 002, 003 (in order)

### Verify setup:
```bash
cd agent-builder
npm run dev

# Then:
# 1. Sign up (test@example.com / testpass123)
# 2. Click Dashboard
# 3. Create a new agent
# 4. Go to https://app.supabase.com → SQL Editor
# 5. Run: SELECT * FROM projects;
# 6. Should see your new agent!
```

## What Each Migration Creates

### 001_users.sql
```sql
users
├── id (UUID, pk)
├── email (unique)
├── name
├── created_at
└── updated_at

RLS Policies:
├── Users can read own profile
├── Users can update own profile
└── Only service role can delete
```

### 002_projects.sql
```sql
projects
├── id (UUID, pk)
├── user_id (fk → users)
├── name
├── description
├── agent_type (enum: code-review, ...)
├── config (JSONB)
├── tier (enum: starter, pro, addon)
├── created_at
└── updated_at

Indexes:
├── user_id (fast user lookups)
├── tier (billing queries)
└── created_at (timeline queries)

RLS Policies:
├── Users can read own projects
├── Users can create for themselves
├── Users can update own projects
└── Users can delete own projects
```

### 003_analytics.sql
```sql
analytics
├── id (UUID, pk)
├── project_id (fk → projects)
├── event_type (string)
├── metadata (JSONB)
└── timestamp

Indexes:
├── project_id + timestamp (dashboard)
└── event_type (aggregations)

Functions:
├── count_by_date(project_id) → usage over time
├── count_by_event(project_id) → event distribution
└── cleanup_old_analytics() → retention policy
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permission denied" | Check RLS policies: `SELECT * FROM pg_policies;` |
| "Column does not exist" | Migration didn't run. Re-run from step 1. |
| "Unique constraint violation" | Delete test data: `DELETE FROM projects WHERE user_id = '...';` |
| Auth not working | Check NEXTAUTH_SECRET in .env |
| Can't create project | Verify user is logged in (check auth token) |

## Resetting Database (Development Only)

```bash
# ⚠️  WARNING: This deletes all data!
supabase db reset

# Then run migrations again
bash scripts/run-migrations.sh
```

---

**Ready on iMac after Supabase setup (Step 2)!**
