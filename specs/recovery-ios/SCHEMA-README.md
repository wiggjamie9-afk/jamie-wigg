# Recovery iOS — Schema Deployment Quick Start

## Files Included

| File | Purpose |
|------|---------|
| `schema.sql` | Complete DDL: tables, enums, indexes, RLS policies, triggers, helper functions |
| `schema-rollback.sql` | Cleanup script (destroys all schema) |
| `SCHEMA.md` | Full documentation: table structure, RLS logic, deployment, troubleshooting |
| `SCHEMA-TESTDATA.sql` | Sample data for QA and local testing |
| `SCHEMA-README.md` | This file |

---

## Deployment in 5 Minutes

### 1. Open Supabase SQL Editor
- Dashboard → SQL Editor
- Click **New Query**

### 2. Copy & Paste Schema
```
1. Open schema.sql
2. Copy entire file
3. Paste into SQL Editor
4. Click Run
```

### 3. Wait for completion
- Watch the **Results** panel
- If no errors, all tables created successfully
- If errors, check troubleshooting section below

### 4. Verify Tables
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected tables:
- `athlete_profiles`
- `injuries`
- `rehab_protocols`
- `daily_checkins`
- `alerts`
- `push_subscriptions`
- `notification_preferences`

---

## Key Features

### 1. Complete Data Model
✓ 7 tables covering athlete profiles → injuries → protocols → check-ins → alerts  
✓ Full foreign key relationships with ON DELETE CASCADE  
✓ Strategic indexes (athlete_id, injury_id, created_at, full-text search)  

### 2. Row-Level Security (RLS)
✓ Athletes see **only their own** data  
✓ Coaches see **assigned athletes** (via team)  
✓ No admin backdoor (all policies strict)  

### 3. Automatic Alert Triggers
✓ Pain spike alert: pain ≥ baseline + 4 points  
✓ ROM regression alert: ROM drops > 10% from previous day  
✓ Low adherence alert: < 50% exercises completed  

### 4. Full-Text Search
✓ Search injuries by diagnosis  
✓ Search check-in notes  

### 5. Helper Functions
```sql
is_coach(user_id)                                    -- Check if user is coach
coach_manages_athlete(coach_id, athlete_id)         -- Check athlete assignment
athlete_compliance_percentage(injury_id)             -- Calculate % adherence
```

---

## Testing Checklist

After deployment, run these verification queries:

### ✓ Check tables exist
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Expected: 7
```

### ✓ Check indexes exist
```sql
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
-- Expected: 20+ indexes
```

### ✓ Check RLS enabled
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = TRUE;
-- Expected: 7 tables with rowsecurity = true
```

### ✓ Check policies exist
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
-- Expected: 30+ policies
```

### ✓ Check triggers exist
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
-- Expected: 3 triggers on daily_checkins
```

### ✓ Check functions exist
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
-- Expected: 6 functions
```

---

## Populate Test Data

### Option A: Interactive testing
```sql
-- 1. Create test users in Supabase Auth (Email/Pass)
--    alice@test.local / password
--    bob@test.local / password
--    coach@test.local / password

-- 2. Get their auth.users IDs (copy from Auth → Users table)

-- 3. Open SCHEMA-TESTDATA.sql
-- 4. Replace placeholder UUIDs (10000000-..., 20000000-..., 30000000-...)
-- 5. Copy & paste into SQL Editor
-- 6. Run
```

### Option B: Programmatic (Node.js)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, serviceKey);

// Insert athlete
const { data: athlete } = await supabase
  .from('athlete_profiles')
  .insert({
    user_id: alice_user_id,
    display_name: 'Alice Johnson',
    sport: 'soccer',
  })
  .select()
  .single();

// Insert injury
const { data: injury } = await supabase
  .from('injuries')
  .insert({
    athlete_id: athlete.id,
    icd10_code: 'S83.5',
    diagnosis: 'ACL tear',
    onset_date: new Date('2026-06-01'),
    baseline_pain: 7,
    baseline_rom: 45,
  })
  .select()
  .single();

// Insert check-in (triggers alert)
await supabase
  .from('daily_checkins')
  .insert({
    athlete_id: athlete.id,
    injury_id: injury.id,
    check_in_date: new Date(),
    pain_score: 10,  // Will trigger alert (≥7+4)
    range_of_motion: 45,
    exercises_completed: 4,
    exercises_total: 4,
  });
```

---

## RLS Policy Examples

### Athlete Views Own Injury
```sql
SELECT * FROM injuries 
WHERE athlete_id IN (
  SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
);
-- Returns: only injuries where user is the athlete
```

### Coach Views Team Athletes' Injuries
```sql
SELECT * FROM injuries 
WHERE athlete_id IN (
  SELECT ap.id FROM athlete_profiles ap
  JOIN teams t ON ap.team_id = t.id
  WHERE t.coach_id = auth.uid()
);
-- Returns: only injuries of athletes on coach's team
```

### Athlete Inserts Own Check-in
```sql
INSERT INTO daily_checkins (athlete_id, injury_id, check_in_date, pain_score, ...)
WHERE athlete_id IN (
  SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
);
-- Succeeds only if athlete_id matches user's profile
```

---

## Alert Triggers Explained

### Scenario 1: Pain Spike
```
Baseline pain = 7
Today's pain = 11
Alert trigger: 11 >= (7 + 4) ✓ ALERT CREATED
Severity: 'critical'
Message: "Pain spike detected. Current pain: 11/10"
```

### Scenario 2: ROM Regression
```
Yesterday's ROM = 50%
Today's ROM = 42%
Threshold: 50 * 0.9 = 45
Alert trigger: 42 < 45 ✓ ALERT CREATED
Severity: 'warning'
Message: "Range of motion regression detected. Current ROM: 42%"
```

### Scenario 3: Low Adherence
```
Exercises completed = 2
Exercises total = 4
Adherence = 2/4 = 50%
Alert trigger: 50% not < 50% ✗ NO ALERT
(Triggers only when < 50%)
```

---

## Troubleshooting

### Error: "permission denied for schema public"
**Cause:** Not logged in as project owner  
**Fix:** 
- Open Supabase Dashboard
- SQL Editor → check top-left (should show project name)
- If not authenticated, click profile icon → re-authenticate

### Error: "table 'athlete_profiles' already exists"
**Cause:** Schema was already applied  
**Fix:**
```sql
-- Option 1: Run rollback first
-- Copy/run schema-rollback.sql
-- Then run schema.sql

-- Option 2: Skip existing tables (manual)
-- Comment out CREATE TABLE statements for existing tables
-- Or just run new migrations separately
```

### Error: "violates foreign key constraint 'athletes_team_id_fkey'"
**Cause:** `teams` table doesn't exist (Wave 1 prerequisite missing)  
**Fix:**
```sql
-- Ensure teams table exists with structure:
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- Then re-run schema.sql
```

### Error: "RLS prevents all queries"
**Cause:** User not authenticated or wrong auth context  
**Fix:**
- Ensure you're signed in (auth.uid() must be set)
- Test with SQL Editor authenticated query
- For app, ensure Supabase client is initialized with user session

### No alerts created after check-in
**Cause:** Trigger conditions not met  
**Fix:**
- Check baseline_pain, baseline_rom set in injuries table
- Check pain_score/range_of_motion actually exceeds threshold
- Verify exercises_completed < 50% for adherence alert
- Check alerts table: `SELECT * FROM alerts ORDER BY created_at DESC`

---

## Performance Tips

### Indexes Already Optimized For:
- **By athlete:** `athlete_id` index on all major tables
- **By injury:** `injury_id` index on protocols, check-ins, alerts
- **By date:** `created_at DESC` and `check_in_date DESC` for time-series queries
- **By status:** composite index on `(athlete_id, acknowledged_at)` for unacknowledged alerts

### Query Examples (Fast)
```sql
-- List athlete's check-ins (uses athlete_id index)
SELECT * FROM daily_checkins 
WHERE athlete_id = ?
ORDER BY check_in_date DESC;

-- Get last 7 days of check-ins (uses composite index)
SELECT * FROM daily_checkins
WHERE athlete_id = ? AND check_in_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY check_in_date DESC;

-- Find unacknowledged alerts (uses composite index)
SELECT * FROM alerts
WHERE athlete_id = ? AND acknowledged_at IS NULL;
```

---

## Security Checklist

- [ ] RLS enabled on all 7 tables
- [ ] All policies check `auth.uid()` or team membership
- [ ] No `admin` or `anon` role can bypass policies
- [ ] Photo URLs stored as S3 paths (not raw data)
- [ ] No sensitive medical data in JSONB fields (only metadata)
- [ ] Session timeout enforced in app (separate from DB)
- [ ] Audit logs enabled (optional: Supabase → Settings → Logs)

---

## Next Steps

### 1. iOS App Integration
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// App is now connected to schema
// All RLS policies enforced automatically
```

### 2. Coach Dashboard (Web)
- Build React/Next.js dashboard
- Query: `athlete_profiles` (list team)
- Query: `injuries` (view athlete's injuries via RLS)
- Query: `daily_checkins` (view progress)
- Query: `alerts` (view & respond to alerts)

### 3. Push Notifications (Backend)
- Cloud Function: Poll `alerts` table
- Filter by `coach_notified = false`
- Send SMS via Twilio or FCM via Firebase
- Update `coach_notified = true`

### 4. PDF Export (Backend)
- Cloud Function: Query injury + check-ins + alerts
- Render PDF template (pdfkit or similar)
- Store in Supabase Storage
- Return signed URL

---

## Rollback Procedure

If you need to reset everything:

```sql
-- 1. Open SQL Editor
-- 2. Create new query
-- 3. Copy & paste entire schema-rollback.sql
-- 4. Click Run
-- 5. Confirm all tables dropped
```

Warning: This is **irreversible**. Ensure you have backups before running.

---

## Support

### Documentation
- `SCHEMA.md` — Full reference (tables, RLS, functions, testing)
- `requirements.md` — Functional requirements this schema fulfills

### Testing Data
- `SCHEMA-TESTDATA.sql` — Sample data for QA

### Issues?
Check the Troubleshooting section above or see `SCHEMA.md` → Support & Troubleshooting.

---

## File Manifest

```
specs/recovery-ios/
├── schema.sql                 # Main migration (run first)
├── schema-rollback.sql        # Cleanup (run to reset)
├── SCHEMA.md                  # Full documentation
├── SCHEMA-TESTDATA.sql        # Test data
├── SCHEMA-README.md           # This file
├── requirements.md            # Functional requirements
├── design.md                  # UI/UX design
└── tasks.md                   # Implementation tasks
```

---

## Version

- **Schema Version:** 1.0
- **Generated:** 2026-06-25
- **Status:** Ready for production deployment
- **Dependencies:** Supabase project with Auth + Storage enabled

---

**Deployment Ready!** ✓  
Run `schema.sql` in Supabase SQL Editor to begin.
