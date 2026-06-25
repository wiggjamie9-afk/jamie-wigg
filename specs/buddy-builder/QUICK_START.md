# Buddy Builder Schema — Quick Start

## Deploy Schema

```bash
# Option 1: Supabase CLI
supabase link --project-ref <your-project-ref>
supabase migration up specs/buddy-builder/schema.sql

# Option 2: Supabase Dashboard
# 1. SQL Editor → New Query
# 2. Copy entire specs/buddy-builder/schema.sql
# 3. Click "Run"
```

## Verify Deployment

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Should return 9 tables:
-- analytics_daily, creators, moderation_flags, payouts, remixes, 
-- royalties, template_collaborators, templates, tracks
```

## Key Tables at a Glance

| Table | Purpose | User Isolation | Key Fields |
|-------|---------|---|---|
| **creators** | User profiles | user_id (1:1) | display_name, stripe_account_id, verified |
| **tracks** | Audio files | creator_id (N:1) | s3_url, bpm, key, loudness_lufs, isrc |
| **templates** | Video templates | creator_id (N:1) | composition_json, price_cents, license_type, published |
| **remixes** | User remixes | user_id (N:1) | template_id (FK), output_video_url, status |
| **royalties** | Earnings | creator_id (N:1) | remix_id, amount_cents, status (pending/paid) |
| **template_collaborators** | Co-producers | template_id (N:1) | invite_token (JWT), role, royalty_percentage |
| **payouts** | Withdrawals | creator_id (N:1) | amount_cents, status, stripe_payout_id |
| **moderation_flags** | Reports | template_id (N:1) | reason, status, dispute_status |
| **analytics_daily** | Metrics | creator_id (N:1) | views, remixes, revenue_cents (daily agg) |

## Common Queries

### Sign Up Creator
```sql
INSERT INTO creators (user_id, display_name, avatar_url)
VALUES (auth.uid(), 'DJ Fresh', 'https://s3.../avatar.jpg')
RETURNING id, created_at;
```

### Upload Track
```sql
INSERT INTO tracks (
  creator_id, title, artist, s3_url, s3_key, duration_seconds, genre, mood
)
VALUES (
  (SELECT id FROM creators WHERE user_id = auth.uid()),
  'Tropical Nights',
  'DJ Fresh',
  'https://s3.amazonaws.com/tracks/...',
  'tracks/creator-123/tropical.wav',
  180,
  'Electronic',
  ARRAY['upbeat', 'tropical']
)
RETURNING id;

-- Then async: detect BPM/key/loudness
UPDATE tracks SET bpm = 128, key = 'D', loudness_lufs = -10.5 WHERE id = '...';
```

### Create Template
```sql
INSERT INTO templates (
  creator_id, track_id, name, canvas_size, composition_json, 
  price_cents, license_type
)
VALUES (
  (SELECT id FROM creators WHERE user_id = auth.uid()),
  'track-123',
  'Summer Vibes',
  '16:9',
  '{"layers": [...], "keyframes": [...]}',
  4999,  -- $49.99
  'non-exclusive'
)
RETURNING id;
```

### Publish Template
```sql
UPDATE templates 
SET published = TRUE, published_at = now()
WHERE id = 'template-123' 
  AND creator_id = (SELECT id FROM creators WHERE user_id = auth.uid())
RETURNING id, published_at;
```

### Browse Marketplace
```sql
SELECT 
  t.id, t.name, t.price_cents, c.display_name, c.avatar_url,
  tr.title, tr.bpm, tr.key, t.view_count
FROM templates t
JOIN creators c ON t.creator_id = c.id
JOIN tracks tr ON t.track_id = tr.id
WHERE t.published = TRUE 
  AND t.soft_deleted = FALSE
  AND t.deprecated = FALSE
  AND tr.genre = 'Electronic'  -- Optional filter
  AND tr.bpm BETWEEN 120 AND 140
ORDER BY t.created_at DESC
LIMIT 50;
```

### Search Templates
```sql
-- Trigram search (requires pgtrgm index)
SELECT t.id, t.name, c.display_name
FROM templates t
JOIN creators c ON t.creator_id = c.id
WHERE t.published = TRUE
  AND (t.name ILIKE '%tropical%' 
       OR (SELECT tr.artist FROM tracks tr WHERE tr.id = t.track_id) ILIKE '%tropical%')
ORDER BY t.created_at DESC
LIMIT 50;

-- For better search: integrate Algolia or Meilisearch
```

### User Creates Remix
```sql
INSERT INTO remixes (user_id, template_id, status)
VALUES (auth.uid(), 'template-123', 'draft')
RETURNING id;

-- After rendering:
UPDATE remixes 
SET status = 'published', 
    published = TRUE, 
    published_at = now(),
    output_video_url = 'https://s3.../remix-123.mp4',
    output_s3_key = 'remixes/user-456/remix-123.mp4'
WHERE id = 'remix-456'
RETURNING id;

-- Auto-create royalty record in app:
INSERT INTO royalties (
  remix_id, creator_id, amount_cents, status
)
SELECT 
  'remix-456',
  t.creator_id,
  FLOOR((t.price_cents * 0.70)::numeric),  -- 70% to template creator
  'pending'
FROM templates t
WHERE t.id = 'template-123';
```

### View Creator Earnings
```sql
SELECT 
  SUM(amount_cents) as total_cents,
  COUNT(*) as remix_count,
  COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_cents ELSE 0 END), 0) as paid_cents,
  COALESCE(SUM(CASE WHEN status IN ('pending', 'processed') THEN amount_cents ELSE 0 END), 0) as pending_cents
FROM royalties
WHERE creator_id = (SELECT id FROM creators WHERE user_id = auth.uid());
```

### Daily Earnings Breakdown
```sql
SELECT 
  template_id, 
  metric_date,
  views,
  remixes,
  revenue_cents
FROM analytics_daily
WHERE creator_id = (SELECT id FROM creators WHERE user_id = auth.uid())
  AND metric_date >= CURRENT_DATE - 30
ORDER BY metric_date DESC;
```

### Request Withdrawal
```sql
-- Check balance first
SELECT 
  COALESCE(SUM(amount_cents), 0) as available
FROM royalties
WHERE creator_id = (SELECT id FROM creators WHERE user_id = auth.uid())
  AND status = 'paid';

-- Request payout
INSERT INTO payouts (creator_id, amount_cents, status)
VALUES (
  (SELECT id FROM creators WHERE user_id = auth.uid()),
  10000,  -- $100
  'pending'
)
RETURNING id, requested_at;

-- Webhook updates: UPDATE payouts SET status = 'processing', ...
-- Then: UPDATE payouts SET status = 'paid', paid_at = now(), ...
```

### Invite Co-Producer
```sql
INSERT INTO template_collaborators (
  template_id, creator_id, role, royalty_percentage, 
  invite_token, invite_token_expires_at
)
VALUES (
  'template-123',
  'co-producer-creator-id',
  'co-producer',
  30,  -- 30% royalty share
  'jwt-token-here',
  now() + interval '7 days'
)
RETURNING invite_token;

-- Share link: https://app.rhythmixapp.com.au/collab?token=jwt-token-here
```

### Accept Collaboration Invite
```sql
UPDATE template_collaborators
SET accepted_at = now()
WHERE invite_token = 'jwt-token-here'
  AND creator_id = (SELECT id FROM creators WHERE user_id = auth.uid())
RETURNING template_id, role, royalty_percentage;
```

### Flag Content
```sql
-- Manual report
INSERT INTO moderation_flags (
  template_id, reason, description, auto_flagged, flagged_by, status
)
VALUES (
  'template-123',
  'copyright',
  'Contains copyrighted music without license',
  FALSE,
  auth.uid(),
  'pending'
)
RETURNING id;

-- Creator submits dispute
UPDATE moderation_flags
SET dispute_status = 'pending', dispute_submitted_at = now()
WHERE id = 'flag-123'
  AND template_id IN (
    SELECT id FROM templates 
    WHERE creator_id = (SELECT id FROM creators WHERE user_id = auth.uid())
  )
RETURNING dispute_status;
```

## RLS: How It Works

All tables enforce RLS. Users can only see:
- Their own profile/data
- Published templates (not soft-deleted, not deprecated)
- Published remixes
- Their own earnings/payouts

```sql
-- Authenticated users always have auth.uid() set
-- Example: A user can only INSERT a track into THEIR creator_id
SELECT auth.uid();  -- Returns user's UUID

-- RLS automatically filters:
SELECT * FROM templates;
-- Returns: own templates + published templates

-- The database enforces this; no app-level auth needed
```

## Performance Tips

**Search (<200ms SLA):**
- Use trigram indexes on name/artist/title
- Filter by published = TRUE, soft_deleted = FALSE first
- Consider external search (Algolia, Meilisearch) for full-text + facets

**Dashboards:**
- Query analytics_daily instead of aggregating live royalties
- Use composite indexes (creator_id, created_at DESC)

**Bulk Operations:**
- Run analytics_daily aggregation nightly (batch INSERT)
- Soft deletes preserve FK integrity

## Monitoring

```sql
-- Slow queries
SELECT query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- RLS performance
EXPLAIN ANALYZE SELECT * FROM templates WHERE published = TRUE;
```

## Troubleshooting

**"Permission denied for schema public"**
- Check RLS policies are enabled: `SELECT tablename FROM pg_tables WHERE schemaname='public';`
- Verify you're authenticated: `SELECT auth.uid();`

**"Violates unique constraint"**
- Tracks: Duplicate s3_key, isrc, or audio_fingerprint
- Template collaborators: Duplicate (template_id, creator_id)
- Creators: Duplicate user_id or stripe_account_id

**"Foreign key violation"**
- Template requires valid track_id, creator_id
- Remix requires valid template_id, user_id
- Ensure parent rows exist before inserting

**Soft delete confusion**
- Don't hard-delete; set soft_deleted = TRUE + soft_deleted_at = now()
- Queries automatically exclude soft_deleted rows (via RLS or app logic)
- Recover by setting soft_deleted = FALSE

## Files Reference

- **schema.sql** — Full DDL + RLS policies (run once)
- **SCHEMA_GUIDE.md** — Detailed docs + patterns + maintenance
- **QUICK_START.md** — This file; copy-paste queries

---

**Questions?** See SCHEMA_GUIDE.md or open an issue in specs/buddy-builder/
