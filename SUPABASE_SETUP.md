# Supabase Setup Guide for Agent Builder

## Quick Start (Local Development)

### Option A: Local Supabase (Recommended for Development)

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Initialize local Supabase**
```bash
supabase init
supabase start
```

This starts a local PostgreSQL instance at `localhost:54321`

3. **Get connection details**
```bash
supabase status
```

Copy the credentials into `agent-builder/.env`:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from output>
SUPABASE_SERVICE_ROLE_KEY=<from output>
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

4. **Run migrations**
```bash
cd agent-builder
supabase db pull  # Get migrations from config
```

---

### Option B: Cloud Supabase (Production)

1. **Create Supabase account** at https://supabase.com
2. **Create new project** (any region)
3. **Go to Settings → API Keys**
4. **Copy credentials into** `agent-builder/.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

5. **Run migrations in SQL editor**:
   - Go to SQL Editor
   - Run `migrations/001_users.sql`
   - Run `migrations/002_projects.sql`
   - Run `migrations/003_analytics.sql`

---

## Database Migrations

### Files to run (in order):
1. `agent-builder/migrations/001_users.sql` — Users table + RLS policies
2. `agent-builder/migrations/002_projects.sql` — Projects table + indexes
3. `agent-builder/migrations/003_analytics.sql` — Analytics table + functions

### What they create:

**users** table:
- id (UUID, primary key)
- email (unique)
- name
- created_at, updated_at
- RLS: Users can only read/write their own rows

**projects** table:
- id, user_id (foreign key)
- name, description
- agent_type (code-review|document-processing|research|...)
- config (JSONB — full Agent Config)
- tier (starter|pro|addon)
- created_at, updated_at
- Indexes on user_id, tier, created_at
- RLS: Users can only access their own projects

**analytics** table:
- id, project_id (foreign key)
- event_type (string)
- metadata (JSONB)
- timestamp
- Indexes for dashboard queries
- Functions for aggregation (count_by_date, etc.)

---

## Testing the Connection

```bash
cd agent-builder
npm run dev
```

Then in the app:
1. Click "Sign Up"
2. Create an account (email: test@example.com, password: testpass123)
3. Go to Dashboard — should load empty
4. Create a new agent — should save to Supabase

Check data:
```bash
supabase db console  # Opens Supabase dashboard locally
```

---

## Production Deployment

1. **Set up cloud Supabase** (Option B above)
2. **Run migrations** in SQL editor
3. **Update environment variables** in Cloudflare Pages:
   - Settings → Environment Variables
   - Add NEXT_PUBLIC_SUPABASE_URL
   - Add NEXT_PUBLIC_SUPABASE_ANON_KEY
4. **Enable Row Level Security** in Supabase:
   - Authentication → Enable RLS on all tables
   - Policies already created in migrations

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No such key" error | Check .env file has correct keys |
| RLS denies all writes | Run migrations to set up policies |
| Connection refused | Ensure supabase start is running (local) |
| Auth not working | Verify NEXTAUTH_SECRET is set |

---

## Next Steps

After setup:
- [ ] Run migrations (001, 002, 003)
- [ ] Test signup/login flow
- [ ] Create a test agent
- [ ] Verify data appears in projects table
- [ ] Ready for deployment!

Contact: mhdbdb@plus.ac.at (for questions)
