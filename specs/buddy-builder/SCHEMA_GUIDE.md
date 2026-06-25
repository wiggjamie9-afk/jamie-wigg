# Buddy Builder Supabase Schema Guide

## Overview

The `schema.sql` file contains the complete Supabase PostgreSQL schema for the Buddy Builder creator marketplace. It includes 9 tables, comprehensive RLS policies, indexes for performance, and triggers for automation.

**Total Lines:** 678 | **Generated:** 2026-06-25

---

## Tables & Relationships

### 1. **creators**
Stores creator profiles linked to Supabase auth users.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID FK | Links to `auth.users`, unique |
| `display_name` | TEXT | Required, min 1 char |
| `bio` | TEXT | Max 500 chars |
| `avatar_url` | TEXT | S3 URL |
| `website_url` | TEXT | Optional, validated URL |
| `stripe_account_id` | TEXT | Stripe Connect OAuth, unique |
| `stripe_verified_at` | TIMESTAMP | When Stripe verification completed |
| `verified` | BOOLEAN | Creator badge (Phase 2c) |
| `email_verified_at` | TIMESTAMP | Email verification timestamp |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Indexes:** user_id, stripe_account_id, verified, created_at, display_name (trigram for prefix search)

**RLS Policies:**
- ✓ Creators view/edit own profile
- ✓ All authenticated users read public profiles (with sensitive fields excluded)

---

### 2. **tracks**
Audio files uploaded by creators; supports metadata extraction & duplicate detection.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `creator_id` | UUID FK | Links to creators, cascades on delete |
| `title` | TEXT | Required |
| `artist` | TEXT | Optional |
| `isrc` | TEXT | International Standard Recording Code, unique |
| `duration_seconds` | INTEGER | Must be > 0 |
| `bpm` | INTEGER | Auto-detected, 0-300 range |
| `key` | TEXT | Musical key (C, C#, D, etc.) |
| `loudness_lufs` | NUMERIC(5,2) | Loudness in LUFS (-100 to 0 range) |
| `genre` | TEXT | Primary genre |
| `mood` | TEXT[] | Array: ['upbeat', 'chill', 'dark', etc.] |
| `s3_url` | TEXT | S3 audio file URL |
| `s3_key` | TEXT | S3 object key for deletion, unique |
| `audio_fingerprint` | TEXT | Acoustid fingerprint for dedup |
| `loudness_normalized` | BOOLEAN | Normalized to -14 LUFS |
| `published` | BOOLEAN | Default: false |
| `soft_deleted` | BOOLEAN | Soft delete flag |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Indexes:** creator_id, published, genre, created_at, bpm, soft_deleted, audio_fingerprint, title/artist (trigram)

**RLS Policies:**
- ✓ Creators view/edit own tracks
- ✓ All users view published tracks (excluding soft-deleted)

---

### 3. **templates**
Video template compositions; defines canvas, price, royalty split, and versioning.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `creator_id` | UUID FK | Links to creators |
| `track_id` | UUID FK | Links to tracks (restrict on delete) |
| `name` | TEXT | Required template name |
| `description` | TEXT | Optional |
| `canvas_size` | VARCHAR(10) | '16:9' \| '9:16' \| '1:1' |
| `preview_url` | TEXT | S3 URL to thumbnail PNG |
| `preview_s3_key` | TEXT | S3 object key, unique |
| `price_cents` | INTEGER | 0 (free) to 9900 ($0.01-$99.00) |
| `royalty_split` | JSONB | {co_producer_id: percentage, ...} |
| `license_type` | VARCHAR(20) | 'personal' \| 'commercial' \| 'exclusive' \| 'non-exclusive' |
| `composition_json` | JSONB | Canvas state: layers, keyframes, effects |
| `version` | TEXT | Semantic versioning (v1.0, v1.1) |
| `view_count` | INTEGER | Track views |
| `published` | BOOLEAN | Published status |
| `published_at` | TIMESTAMP | Publish timestamp |
| `deprecated` | BOOLEAN | Deprecate old versions |
| `soft_deleted` | BOOLEAN | Soft delete flag |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Constraints:**
- Royalty percentages sum to ≤100
- publish_at consistency: published=TRUE requires published_at timestamp
- Soft delete consistency: soft_deleted=TRUE requires soft_deleted_at timestamp

**Indexes:** creator_id, track_id, published, created_at, price, license_type, soft_deleted, view_count (DESC), name (trigram), published+created_at (for discovery)

**RLS Policies:**
- ✓ Creators view/edit own templates
- ✓ All users view published templates (not deprecated, not soft-deleted)
- ✓ Collaborators view invited templates

---

### 4. **remixes**
User-generated remixes created from templates.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID FK | Links to auth.users |
| `template_id` | UUID FK | Links to templates |
| `output_video_url` | TEXT | S3 URL to rendered video |
| `output_s3_key` | TEXT | S3 object key, unique |
| `status` | VARCHAR(20) | 'draft' \| 'rendering' \| 'published' \| 'failed' |
| `render_error` | TEXT | Error message if status='failed' |
| `published` | BOOLEAN | Published status |
| `published_at` | TIMESTAMP | Publish timestamp |
| `view_count` | INTEGER | Remix views |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Indexes:** user_id, template_id, published, created_at, status, user_id+published

**RLS Policies:**
- ✓ Users view/edit own remixes
- ✓ All users view published remixes
- ✓ Template creators view remixes of their templates

---

### 5. **royalties**
Payment records for remix creators and co-producers.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `remix_id` | UUID FK | Links to remixes |
| `creator_id` | UUID FK | Links to creators (template creator) |
| `co_producer_id` | UUID FK | Optional co-producer (nullable) |
| `amount_cents` | INTEGER | Royalty amount (must be > 0) |
| `status` | VARCHAR(20) | 'pending' \| 'processed' \| 'paid' \| 'failed' |
| `stripe_payout_id` | TEXT | Stripe payout ID when status='paid' |
| `created_at` | TIMESTAMP | Auto-managed |
| `processed_at` | TIMESTAMP | When status changed to 'processed' |
| `paid_at` | TIMESTAMP | When status changed to 'paid' |

**Constraints:**
- Status→timestamp consistency: pending has no timestamps; paid requires paid_at

**Indexes:** creator_id, co_producer_id, remix_id, status, created_at (DESC), creator_id+status, creator_id+created_at (WHERE status IN unpaid)

**RLS Policies:**
- ✓ Creators view royalties owed to them
- ✓ Remixers view royalties they've earned
- ✓ System can insert/update (relies on app logic)

---

### 6. **template_collaborators**
Co-producer invitations & role management for templates.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `template_id` | UUID FK | Links to templates |
| `creator_id` | UUID FK | Links to creators (co-producer) |
| `royalty_percentage` | INTEGER | 0-100, co-producer's share |
| `role` | VARCHAR(20) | 'co-producer' \| 'editor' \| 'viewer' |
| `invite_token` | TEXT | JWT invite token, unique |
| `invite_token_expires_at` | TIMESTAMP | Invite expiration (e.g., 7 days) |
| `accepted_at` | TIMESTAMP | When co-producer accepted |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Constraints:**
- Unique (template_id, creator_id): prevents duplicate invites

**Indexes:** template_id, creator_id, invite_token, accepted_at

**RLS Policies:**
- ✓ Template creators manage collaborators
- ✓ Collaborators view their own invite

---

### 7. **payouts**
Withdrawal requests & payout history.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `creator_id` | UUID FK | Links to creators |
| `amount_cents` | INTEGER | Payout amount (minimum $10 = 1000 cents) |
| `status` | VARCHAR(20) | 'pending' \| 'processing' \| 'paid' \| 'failed' |
| `stripe_payout_id` | TEXT | Stripe payout ID, unique |
| `failure_reason` | TEXT | Reason for failed payout |
| `requested_at` | TIMESTAMP | When requested |
| `processed_at` | TIMESTAMP | When processing started |
| `paid_at` | TIMESTAMP | When funds reached creator |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Constraints:**
- amount_cents >= 1000 (minimum $10)

**Indexes:** creator_id, status, created_at (DESC), creator_id+status

**RLS Policies:**
- ✓ Creators view own payouts
- ✓ Creators request withdrawals
- ✓ System updates via webhooks

---

### 8. **moderation_flags**
Content moderation, reporting, and dispute tracking.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `template_id` | UUID FK | Template being flagged (nullable) |
| `creator_id` | UUID FK | Creator being flagged (nullable) |
| `reason` | VARCHAR(50) | 'profanity' \| 'nsfw' \| 'copyright' \| 'spam' \| 'other' |
| `description` | TEXT | Details about the flag |
| `auto_flagged` | BOOLEAN | TRUE if auto-scanned, FALSE if manual report |
| `flagged_by` | UUID FK | Reporter's user_id (nullable) |
| `status` | VARCHAR(20) | 'pending' \| 'reviewed' \| 'dismissed' \| 'actioned' |
| `action_taken` | VARCHAR(50) | 'none' \| 'warning' \| 'temporary_removal' \| 'permanent_removal' |
| `reviewed_by` | UUID FK | Moderator's user_id (nullable) |
| `dispute_status` | VARCHAR(20) | 'pending' \| 'approved' \| 'rejected' (nullable) |
| `dispute_submitted_at` | TIMESTAMP | Creator dispute submission |
| `dispute_resolved_at` | TIMESTAMP | When dispute resolved |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Indexes:** template_id, creator_id, status, created_at (DESC)

**RLS Policies:**
- ✓ Creators view flags on own content
- ✓ Users can report content
- ✓ Creators submit disputes

---

### 9. **analytics_daily**
Daily aggregated metrics for dashboards.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `creator_id` | UUID FK | Links to creators |
| `template_id` | UUID FK | Template (nullable for overall stats) |
| `metric_date` | DATE | Date of metrics |
| `views` | INTEGER | Template views that day |
| `remixes` | INTEGER | Remixes created that day |
| `revenue_cents` | INTEGER | Revenue earned that day |
| `created_at`, `updated_at` | TIMESTAMP | Auto-managed |

**Constraints:**
- Unique (creator_id, template_id, metric_date)

**Indexes:** creator_id+metric_date (DESC), template_id+metric_date (DESC)

**RLS Policies:**
- ✓ Creators view own analytics
- ✓ System updates daily via scheduled job

---

## Indexes Summary

**High-Volume Queries:**
- `templates(published, created_at DESC)` — for discovery/browsing
- `tracks(title, artist) USING GIST (trigram)` — for search autocomplete
- `royalties(creator_id, status)` — for earnings dashboard
- `templates(creator_id)` — for creator's template list
- `analytics_daily(creator_id, metric_date DESC)` — for revenue charts

**Pagination:**
- All tables have `created_at DESC` indexes for sorting by recency
- `view_count DESC` for trending queries

**Foreign Keys:**
- All FK indexes auto-created by Postgres

---

## Row-Level Security (RLS)

All 9 tables have RLS enabled. Policies follow this pattern:

| Access Level | Users | Policies |
|--------------|-------|----------|
| **Own data** | Authenticated | SELECT/UPDATE own rows via user_id or FK chain |
| **Public data** | Authenticated | SELECT published templates, public profiles |
| **System** | App backend | System functions can INSERT/UPDATE (app logic enforces rules) |
| **Moderators** | App level | RLS allows SELECT on all; app checks role separately |

**Key Design:**
- No policies for INSERT/UPDATE allow unauthenticated users
- Soft deletes (`soft_deleted = TRUE`) are excluded from public views
- Collaborators can access templates via `template_collaborators` join

---

## How to Deploy

### 1. Connect to Supabase CLI
```bash
supabase link --project-ref <ref>
supabase db pull  # optional: see current schema
```

### 2. Run Migration
```bash
supabase migration up specs/buddy-builder/schema.sql
```

Or via Supabase SQL Editor in dashboard:
```
1. Copy entire schema.sql
2. Paste into SQL editor
3. Click "Run"
```

### 3. Verify
```sql
-- In Supabase SQL editor:
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'creator%';
```

---

## API Patterns

### Create Creator (Sign-up)
```sql
-- App creates auth.users first, then:
INSERT INTO creators (user_id, display_name, avatar_url)
VALUES (auth.uid(), 'Artist Name', 'https://...')
RETURNING *;
```

### Upload Track
```sql
INSERT INTO tracks (creator_id, title, s3_url, s3_key, duration_seconds, ...)
VALUES (
  (SELECT id FROM creators WHERE user_id = auth.uid()),
  'Song Title',
  'https://s3.../audio.wav',
  'tracks/creator-id/audio.wav',
  180,
  ...
)
RETURNING id;

-- Then async: call BPM detector → UPDATE tracks SET bpm = ...
```

### Create Template
```sql
INSERT INTO templates (creator_id, track_id, name, canvas_size, composition_json, ...)
VALUES (
  (SELECT id FROM creators WHERE user_id = auth.uid()),
  '<track-id>',
  'Tropical Vibes Template',
  '16:9',
  '{"layers": [...], "keyframes": [...]}',
  ...
);
```

### Publish Remix → Generate Royalty
```sql
-- User publishes remix
UPDATE remixes SET published = TRUE, published_at = now() WHERE id = '<remix-id>';

-- App inserts royalty record for template creator
INSERT INTO royalties (remix_id, creator_id, amount_cents, status)
VALUES ('<remix-id>', '<template-creator-id>', 50, 'pending');

-- Aggregate into analytics_daily (daily batch job)
```

### Request Payout
```sql
INSERT INTO payouts (creator_id, amount_cents, status)
VALUES (
  (SELECT id FROM creators WHERE user_id = auth.uid()),
  10000,  -- $100
  'pending'
);

-- Webhook updates: UPDATE payouts SET status = 'paid', paid_at = now() ...
```

---

## Performance Notes

### Search Queries (<200ms SLA)
**Option A: Postgres Trigram (In-DB)**
```sql
SELECT * FROM templates
WHERE published = TRUE
  AND (name ILIKE '%query%' OR track_id IN (
    SELECT id FROM tracks WHERE title ILIKE '%query%'
  ))
LIMIT 50;
```
Uses `name_trgm` index, ~50-100ms for 100k templates.

**Option B: Algolia (Recommended)**
External full-text search; instant <10ms, fuzzy matching, faceted filtering. Sync via webhook on template publish.

### Bulk Operations
Royalty aggregation (daily):
```sql
INSERT INTO analytics_daily (creator_id, template_id, metric_date, revenue_cents)
SELECT r.creator_id, t.id, CURRENT_DATE, SUM(ry.amount_cents)
FROM royalties ry
JOIN remixes r ON ry.remix_id = r.id
JOIN templates t ON r.template_id = t.id
WHERE ry.created_at::date = CURRENT_DATE
GROUP BY r.creator_id, t.id
ON CONFLICT (creator_id, template_id, metric_date) DO UPDATE
SET revenue_cents = EXCLUDED.revenue_cents;
```

---

## Maintenance

### Backups
Supabase auto-backups daily. Manual snapshots via dashboard or `supabase db push --backup`.

### Soft Deletes
Don't hard-delete; set `soft_deleted = TRUE` + `soft_deleted_at = now()`. Allows recovery & preserves FK integrity.

### Monitoring
- **Slow queries:** Enable `log_min_duration_statement = 1000` (1s+)
- **RLS overhead:** Query `pg_stat_statements` for SELECT latency
- **Storage:** Check `pg_database_size()` monthly

---

## Next Steps (Post-Launch)

1. **Analytics Refresh**: Add materialized views for trending templates (top 50 by remixes/week)
2. **Dispute Management**: Add `moderation_appeals` table for structured dispute workflow
3. **Revenue Sharing**: Add `revenue_splits` table for multi-creator projects
4. **Notification Preferences**: Add `user_preferences` table for email/push opt-in per template/creator
5. **Audit Logging**: Add `audit_logs` table for Stripe webhooks, moderation actions, payouts

---

## References
- Supabase Docs: https://supabase.com/docs
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- PostgreSQL JSON: https://www.postgresql.org/docs/current/functions-json.html
