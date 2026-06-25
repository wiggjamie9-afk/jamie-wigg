# Recovery iOS — Supabase Schema Documentation

## Overview

This document describes the complete Supabase PostgreSQL schema for the Recovery iOS athlete rehabilitation tracking app. The schema supports:

- **Athlete Profiles** — registration, sport, team affiliation
- **Injury Tracking** — ICD-10 diagnosis, onset date, severity, baseline metrics
- **Rehab Protocols** — exercise list, duration, provider (coach/PT)
- **Daily Check-ins** — pain scores, ROM %, exercise adherence, notes, photos
- **Alerts** — automatic detection of pain spikes, ROM regression, missed check-ins, low adherence
- **Push Subscriptions** — FCM tokens for iOS/Android notifications
- **Notification Preferences** — check-in time, quiet hours, alert toggles

**Row-Level Security (RLS):** Athletes see only their data; coaches see data for athletes on their team.

---

## Tables

### 1. `athlete_profiles`

Athlete account metadata, linked to Supabase Auth `users`.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique profile ID |
| `user_id` | UUID | FK → auth.users, UNIQUE | Linked to auth user |
| `team_id` | UUID | FK → teams (optional) | Null if not on a team |
| `display_name` | TEXT | NOT NULL | First + last name |
| `date_of_birth` | DATE | | For age calculations, optional |
| `sport` | VARCHAR(100) | | e.g., "football", "basketball" |
| `position` | VARCHAR(100) | | e.g., "striker", "center" |
| `created_at` | TIMESTAMP | DEFAULT now() | Account creation |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last profile edit |

**Indexes:**
- `user_id` (unique)
- `team_id` (filter by team)
- `created_at DESC` (order by join date)

**RLS Policies:**
- Athletes view/update own profile
- Coaches view team members' profiles

---

### 2. `injuries`

Injury record for each athlete. Multiple injuries allowed per athlete (history).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique injury ID |
| `athlete_id` | UUID | FK → athlete_profiles | Required |
| `icd10_code` | VARCHAR(10) | NOT NULL | e.g., "M17.11" (knee OA) |
| `diagnosis` | TEXT | NOT NULL | Searchable injury description |
| `onset_date` | DATE | NOT NULL | When injury occurred |
| `severity` | INT | 1-5 scale, CHECK | 1=mild, 5=severe |
| `location` | VARCHAR(100) | | Body part: "left knee", "right shoulder", etc. |
| `status` | injury_status ENUM | DEFAULT 'active' | active\|completed\|reinjured\|paused |
| `closed_date` | DATE | | NULL if ongoing |
| `baseline_pain` | INT | 0-10 CHECK | Reference pain score at intake |
| `baseline_rom` | INT | 0-100 CHECK | Reference ROM % at intake |
| `created_at` | TIMESTAMP | DEFAULT now() | Injury recorded date |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last updated |

**Indexes:**
- `athlete_id` (list athlete's injuries)
- `icd10_code` (filter by diagnosis)
- `status` (filter by active/completed)
- `created_at DESC` (order by date)
- `onset_date` (range queries)
- Full-text search on `diagnosis`

**RLS Policies:**
- Athletes view/insert/update own injuries
- Coaches view/update team athletes' injuries

---

### 3. `rehab_protocols`

Personalized recovery plan for each injury. One protocol per injury.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique protocol ID |
| `injury_id` | UUID | FK → injuries, UNIQUE | 1:1 relationship |
| `provider_id` | UUID | FK → auth.users | Coach or PT who created |
| `name` | TEXT | NOT NULL | e.g., "ACL Rehab Phase 2" |
| `estimated_duration_days` | INT | NOT NULL | e.g., 21, 60 |
| `exercises` | JSONB | DEFAULT '[]' | Array of {name, sets, reps, demo_url, notes} |
| `adherence_target` | INT | 0-100 CHECK | Target % compliance (default 80%) |
| `start_date` | DATE | | When protocol began |
| `end_date` | DATE | | NULL if ongoing |
| `created_at` | TIMESTAMP | DEFAULT now() | Protocol creation date |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last protocol edit |

**Exercise JSONB structure:**
```json
{
  "exercises": [
    {
      "id": "ex-001",
      "name": "Quad sets",
      "sets": 3,
      "reps": 15,
      "demo_url": "https://...",
      "notes": "Hold 5 seconds each rep"
    }
  ]
}
```

**Indexes:**
- `injury_id` (unique)
- `provider_id` (list coach's protocols)
- `created_at DESC` (order by date)

**RLS Policies:**
- Athletes view protocols for their injuries
- Coaches (providers) view/update own protocols
- Coaches insert protocols for their athletes

---

### 4. `daily_checkins`

Daily athlete self-assessment: pain, ROM, exercise adherence, notes.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique check-in ID |
| `athlete_id` | UUID | FK → athlete_profiles | Required |
| `injury_id` | UUID | FK → injuries | Required |
| `check_in_date` | DATE | NOT NULL | Date of check-in (not timestamp) |
| `pain_score` | INT | 0-10 CHECK | 0=no pain, 10=worst pain |
| `range_of_motion` | INT | 0-100 CHECK | % of baseline or normal |
| `exercises_completed` | INT | DEFAULT 0 | Count of exercises done today |
| `exercises_total` | INT | DEFAULT 0 | Expected exercises for today |
| `notes` | TEXT | | Athlete observations, soreness, etc. |
| `photo_url` | TEXT | | S3 link to optional photo (swelling, etc.) |
| `synced` | BOOLEAN | DEFAULT false | True if uploaded to backend |
| `created_at` | TIMESTAMP | DEFAULT now() | Check-in submitted timestamp |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last edited timestamp |

**Indexes:**
- `athlete_id` (list athlete's check-ins)
- `injury_id` (filter by injury)
- `check_in_date DESC` (order by date)
- `created_at DESC` (order by submission)
- Composite: `athlete_id, check_in_date DESC` (fast range queries)
- Full-text search on `notes`

**Triggers:**
- `trigger_pain_spike` — auto-create alert if pain ≥ baseline+4
- `trigger_rom_regression` — auto-create alert if ROM drops >10%
- `trigger_low_adherence` — auto-create alert if exercises < 50% completed

**RLS Policies:**
- Athletes view/insert own check-ins
- Athletes update own check-ins (within 24 hours)
- Coaches view team athletes' check-ins

---

### 5. `alerts`

Auto-triggered or manual alerts for coaches and athletes.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique alert ID |
| `athlete_id` | UUID | FK → athlete_profiles | Required |
| `injury_id` | UUID | FK → injuries | Required |
| `alert_type` | alert_type ENUM | NOT NULL | pain_spike\|rom_regression\|missed_checkin\|low_adherence |
| `severity` | alert_severity ENUM | DEFAULT 'warning' | info\|warning\|critical |
| `message` | TEXT | NOT NULL | Human-readable alert message |
| `data` | JSONB | DEFAULT '{}' | Structured metadata (e.g., pain values, trigger details) |
| `coach_notified` | BOOLEAN | DEFAULT false | SMS/email sent to coach |
| `coach_response` | TEXT | | Coach's notes or action taken |
| `triggered_at` | TIMESTAMP | DEFAULT now() | When alert condition was detected |
| `acknowledged_at` | TIMESTAMP | | NULL until athlete or coach acknowledges |
| `created_at` | TIMESTAMP | DEFAULT now() | Record creation |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last modification |

**Example alert data:**
```json
{
  "alert_type": "pain_spike",
  "data": {
    "baseline_pain": 3,
    "current_pain": 8,
    "check_in_id": "uuid-xxx",
    "regression_percent": 166
  }
}
```

**Indexes:**
- `athlete_id` (list athlete's alerts)
- `injury_id` (list injury's alerts)
- `alert_type` (filter by type)
- `severity` (priority sorting)
- `triggered_at DESC` (order by trigger time)
- `created_at DESC` (order by creation)
- Composite: `athlete_id, acknowledged_at` (find unacknowledged alerts)

**RLS Policies:**
- Athletes view/acknowledge own alerts
- Coaches view alerts for team athletes
- Coaches respond to team alerts
- System (authenticated users) can insert alerts

---

### 6. `push_subscriptions`

FCM/APNs device tokens for push notifications.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique subscription ID |
| `user_id` | UUID | FK → auth.users | Required |
| `device_token` | TEXT | NOT NULL | FCM or APNs token |
| `platform` | device_platform ENUM | NOT NULL | ios\|android |
| `device_info` | JSONB | DEFAULT '{}' | iOS version, device model, etc. |
| `enabled` | BOOLEAN | DEFAULT true | Notifications on/off |
| `created_at` | TIMESTAMP | DEFAULT now() | Registration date |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last sync |

**Indexes:**
- `user_id` (list user's devices)
- `device_token` (dedup check)
- `platform` (filter by OS)
- `enabled` (query active subscriptions)
- `created_at DESC` (order by registration)
- Unique composite: `user_id, device_token` (prevent duplicates)

**RLS Policies:**
- Users view/insert/update/delete own subscriptions

---

### 7. `notification_preferences`

User settings for notifications (optional, for future expansion).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, auto | Unique preference ID |
| `user_id` | UUID | FK → auth.users, UNIQUE | One row per user |
| `check_in_time` | TIME | DEFAULT '08:00:00' | Daily check-in reminder time |
| `check_in_enabled` | BOOLEAN | DEFAULT true | Toggle check-in reminders |
| `alert_enabled` | BOOLEAN | DEFAULT true | Toggle alert notifications |
| `message_enabled` | BOOLEAN | DEFAULT true | Toggle coach message notifications |
| `quiet_hours_start` | TIME | | Do-not-disturb start (e.g., 22:00) |
| `quiet_hours_end` | TIME | | Do-not-disturb end (e.g., 07:00) |
| `created_at` | TIMESTAMP | DEFAULT now() | Record creation |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last updated |

**Indexes:**
- `user_id` (unique)

**RLS Policies:**
- Users view/insert/update own preferences

---

## Enum Types

### `alert_type`
```sql
'pain_spike'      -- Pain increase ≥4 points from baseline
'rom_regression'  -- ROM decrease >10% from previous day
'missed_checkin'  -- No check-in for 2+ days
'low_adherence'   -- <50% exercises completed on a day
```

### `alert_severity`
```sql
'info'      -- Informational
'warning'   -- Needs attention
'critical'  -- Immediate action required
```

### `injury_status`
```sql
'active'     -- Currently recovering
'completed'  -- Protocol finished
'reinjured'  -- Re-injury occurred
'paused'     -- Temporarily paused
```

### `device_platform`
```sql
'ios'       -- Apple iOS
'android'   -- Google Android
```

---

## Foreign Key Dependencies

```
auth.users
  ├── athlete_profiles.user_id (1:1)
  ├── rehab_protocols.provider_id (many:1, coaches/PTs)
  ├── push_subscriptions.user_id (1:many)
  └── notification_preferences.user_id (1:1)

teams (Wave 1)
  └── athlete_profiles.team_id (many:1)

athlete_profiles
  ├── injuries.athlete_id (1:many)
  ├── daily_checkins.athlete_id (1:many)
  ├── alerts.athlete_id (1:many)
  └── push_subscriptions.user_id (via auth.users)

injuries
  ├── rehab_protocols.injury_id (1:1)
  ├── daily_checkins.injury_id (1:many)
  └── alerts.injury_id (1:many)

rehab_protocols
  └── daily_checkins (implicit, via injury_id)
```

---

## Row-Level Security (RLS) Policies

All tables have RLS enabled. Key policies:

### Athlete Access
- View own profile, injuries, check-ins, alerts
- Insert injuries and check-ins
- Update own profile and check-ins (within 24 hours)
- Acknowledge own alerts

### Coach Access
- View profiles, injuries, check-ins, alerts for team members
- Update team members' injuries
- Insert and update protocols for team injuries
- Respond to alerts

### Authentication
- All policies check `auth.uid()` (current user ID)
- Coaches filtered by `teams.coach_id = auth.uid()`

### Example Policy Query
```sql
-- Athletes see only their own injuries
SELECT * FROM injuries
WHERE athlete_id IN (
  SELECT id FROM athlete_profiles WHERE user_id = auth.uid()
);

-- Coaches see injuries of their athletes
SELECT * FROM injuries
WHERE athlete_id IN (
  SELECT ap.id FROM athlete_profiles ap
  JOIN teams t ON ap.team_id = t.id
  WHERE t.coach_id = auth.uid()
);
```

---

## Automatic Alert Triggers

Three PostgreSQL triggers auto-create alerts in response to check-in data:

### 1. `trigger_pain_spike` (after insert/update on daily_checkins)
```
IF pain_score >= baseline_pain + 4
  → Create alert (type: pain_spike, severity: critical)
ELSE IF pain_score >= previous_pain + 4
  → Create alert (type: pain_spike, severity: warning)
```

### 2. `trigger_rom_regression` (after insert/update on daily_checkins)
```
IF range_of_motion < (previous_rom * 0.9)
  → Create alert (type: rom_regression, severity: warning)
```

### 3. `trigger_low_adherence` (after insert/update on daily_checkins)
```
IF exercises_completed / exercises_total < 0.5
  → Create alert (type: low_adherence, severity: warning)
```

**Note:** Triggers do not auto-notify coaches; a separate backend job (Cloud Function) reads alerts and sends SMS/push.

---

## Helper Functions

### `is_coach(user_id UUID) → BOOLEAN`
Check if user is a coach (has any team).

### `coach_manages_athlete(coach_id UUID, athlete_id UUID) → BOOLEAN`
Check if coach is assigned to athlete.

### `athlete_compliance_percentage(injury_id UUID) → NUMERIC`
Calculate total % exercises completed for an injury:
```
(SUM(exercises_completed) / SUM(exercises_total)) * 100
```

---

## Deployment Instructions

### Step 1: Set Up Supabase Project
1. Create a new Supabase project (if not already done)
2. Note the database URL and API keys

### Step 2: Run Migration
1. Open Supabase Dashboard → SQL Editor
2. Create new query
3. Copy entire contents of `schema.sql`
4. Click **Run**
5. Verify all tables created (check Schema inspector)

### Step 3: Verify RLS
1. Dashboard → Authentication → Policies
2. Confirm policies listed for all 7 tables

### Step 4: Test Data (Optional)
Run the test data script (if provided) to populate sample injuries, check-ins, and alerts.

### Step 5: Update App Client
Update your iOS app's Supabase client config:
```typescript
const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);
```

### Rollback (if needed)
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `schema-rollback.sql`
3. Click **Run**
4. All tables and types deleted

---

## Indexing Strategy

| Index | Type | Use Case |
|-------|------|----------|
| athlete_id (all tables) | B-tree | Filter by athlete |
| injury_id (protocols, check-ins, alerts) | B-tree | Filter by injury |
| created_at DESC | B-tree | Order by date (latest first) |
| check_in_date DESC | B-tree | Filter daily check-ins by date |
| Full-text (diagnosis, notes) | GIN | Search by text |
| Unique (user_id, device_token) | B-tree | Prevent duplicate push subscriptions |
| Composite (athlete_id, acknowledged_at) | B-tree | Find unacknowledged alerts efficiently |

---

## Performance Considerations

### Query Optimization
- Use `athlete_id` index for athlete-specific queries
- Use `check_in_date` for date-range queries (last 30 days, etc.)
- Full-text search on `diagnosis` and `notes` for search features
- Composite indexes speed up `WHERE athlete_id = ? AND status = ?` queries

### Triggers & Functions
- Triggers execute on every `daily_checkins` insert/update
- For high-volume check-ins, consider moving alerts to async job (Cloud Function)
- Functions (`is_coach`, `coach_manages_athlete`) use `SECURITY DEFINER` for performance

### Caching Recommendations
- Cache athlete profile + team info on app load
- Cache protocols (rarely updated)
- Cache notifications preferences
- Stream check-in data (don't cache, as it's frequently updated)

---

## Security Notes

1. **RLS is enforced:** All queries must pass policy checks (read, insert, update, delete)
2. **Auth dependency:** Policies rely on `auth.uid()`; without authentication, all queries fail
3. **Photo storage:** `photo_url` should reference S3 URLs; use Supabase Storage or external S3
4. **HIPAA-like measures:** Athlete data encrypted at rest; access logs should be audited
5. **Session timeout:** Implement 15-min inactivity timeout in app (separate from DB)
6. **Biometric unlock:** Implement in native iOS layer (Capacitor + LocalAuthentication API)

---

## Testing Checklist

- [ ] Schema created without errors
- [ ] All tables visible in Dashboard
- [ ] All indexes created
- [ ] RLS policies enabled and listed
- [ ] Triggers show in Function list
- [ ] Test athlete can insert own injury
- [ ] Test coach can view team athletes
- [ ] Test pain spike creates alert
- [ ] Test offline check-in creation + sync
- [ ] Test push subscription CRUD
- [ ] Test notification preferences CRUD

---

## Support & Troubleshooting

**Issue: "permission denied for schema public"**
- Ensure you're logged in as project owner (or have role `postgres`)
- Check Supabase authentication status

**Issue: "table already exists"**
- Drop existing tables first (see `schema-rollback.sql`)
- Or run a full rollback + re-migrate

**Issue: "foreign key constraint violation"**
- Ensure `teams` table exists (Wave 1 prerequisite)
- Ensure `auth.users` table accessible

**Issue: RLS preventing all queries**
- Check that `auth.uid()` is set (user must be authenticated)
- Verify policy logic with manual query in SQL Editor

---

## Related Documentation

- `specs/recovery-ios/requirements.md` — functional requirements
- `specs/recovery-ios/design.md` — UI/UX design
- `specs/recovery-ios/tasks.md` — implementation tasks
- `recovery-ios/` root — iOS app code

---

**Generated:** 2026-06-25  
**Last Updated:** schema.sql v1.0  
**Status:** Ready for deployment
