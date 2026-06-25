# Buddy Builder — Entity Relationship Diagram

## Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BUDDY BUILDER CREATOR MARKETPLACE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                                  auth.users
                                     (id)
                                      │
                                      │ 1:1
                                      ▼
┌──────────────────────────┐     ┌─────────────────────┐
│      CREATORS            │     │   TRACKS            │
├──────────────────────────┤     ├─────────────────────┤
│ PK: id (UUID)            │     │ PK: id (UUID)       │
│ FK: user_id (auth.users) │────◄┤ FK: creator_id      │
│ display_name             │ 1:N │ title, artist       │
│ bio, avatar_url          │     │ isrc, bpm, key      │
│ website_url              │     │ loudness_lufs       │
│ stripe_account_id        │     │ s3_url, s3_key      │
│ stripe_verified_at       │     │ audio_fingerprint   │
│ verified                 │     │ genre, mood[]       │
│ created_at, updated_at   │     │ published           │
│                          │     │ soft_deleted        │
│ RLS: owners can R/W own  │     │ created_at          │
│      others can R public │     │                     │
│                          │     │ RLS: creators R/W   │
│                          │     │      others R pub   │
└──────────────────────────┘     └─────────────────────┘
         │                                │
         │ 1:N                            │ 1:N (foreign key)
         └────────────┐                   │
                      ▼                   ▼
         ┌──────────────────────────────────────┐
         │        TEMPLATES                     │
         ├──────────────────────────────────────┤
         │ PK: id (UUID)                        │
         │ FK: creator_id (creators)            │
         │ FK: track_id (tracks) — RESTRICT     │
         │ name, description                    │
         │ canvas_size (16:9, 9:16, 1:1)        │
         │ composition_json (JSONB)             │
         │ preview_url, preview_s3_key          │
         │ price_cents (0-9900)                 │
         │ royalty_split (JSONB %)              │
         │ license_type (enum)                  │
         │ version (semantic)                   │
         │ view_count                           │
         │ published, published_at              │
         │ deprecated                           │
         │ soft_deleted                         │
         │ created_at, updated_at               │
         │                                      │
         │ RLS: creators R/W own                │
         │      collab R/W invited              │
         │      others R published              │
         └──────────────────────────────────────┘
                 │                 │
                 │ 1:N            │ 1:N
                 ▼                ▼
  ┌──────────────────────┐  ┌────────────────────────────┐
  │ TEMPLATE_            │  │ REMIXES                    │
  │ COLLABORATORS        │  ├────────────────────────────┤
  ├──────────────────────┤  │ PK: id (UUID)              │
  │ PK: id (UUID)        │  │ FK: user_id (auth.users)   │
  │ FK: template_id      │  │ FK: template_id            │
  │ FK: creator_id       │  │ status (draft/rendering)   │
  │    (co-producer)     │  │ output_video_url           │
  │ role (enum)          │  │ output_s3_key              │
  │ royalty_percentage   │  │ published, published_at    │
  │ invite_token (JWT)   │  │ view_count                 │
  │ invite_expires_at    │  │ created_at, updated_at     │
  │ accepted_at          │  │                            │
  │ created_at,updated_at│  │ RLS: users R/W own         │
  │                      │  │      templates R/W         │
  │ UNIQUE:              │  │      others R published    │
  │ (template_id, id)    │  └────────────────────────────┘
  │                      │           │
  │ RLS: creators R/W    │           │ 1:N
  │      collab R own    │           ▼
  └──────────────────────┘  ┌────────────────────────┐
                            │ ROYALTIES              │
                            ├────────────────────────┤
                            │ PK: id (UUID)          │
                            │ FK: remix_id           │
                            │ FK: creator_id         │
                            │ FK: co_producer_id(opt)│
                            │ amount_cents           │
                            │ status (enum)          │
                            │ stripe_payout_id       │
                            │ created_at             │
                            │ processed_at           │
                            │ paid_at                │
                            │                        │
                            │ RLS: creators R own    │
                            │      remixers R own    │
                            └────────────────────────┘
                                    │ (also linked from)
                                    ▼
         ┌──────────────────────────────────────┐
         │ PAYOUTS                              │
         ├──────────────────────────────────────┤
         │ PK: id (UUID)                        │
         │ FK: creator_id (creators)            │
         │ amount_cents (≥1000)                 │
         │ status (pending/processing/paid)     │
         │ stripe_payout_id (UNIQUE)            │
         │ failure_reason                       │
         │ requested_at, processed_at, paid_at  │
         │ created_at, updated_at               │
         │                                      │
         │ RLS: creators R/W own                │
         │      system can update (webhooks)    │
         └──────────────────────────────────────┘

         (SIDE TABLES)
         
         ┌──────────────────────────────────────┐
         │ MODERATION_FLAGS                     │
         ├──────────────────────────────────────┤
         │ PK: id (UUID)                        │
         │ FK: template_id (nullable)           │
         │ FK: creator_id (nullable)            │
         │ reason (enum)                        │
         │ auto_flagged (boolean)               │
         │ status, action_taken (enum)          │
         │ dispute_status, dispute_submitted_at │
         │ flagged_by, reviewed_by (user_id)    │
         │ created_at, updated_at               │
         │                                      │
         │ RLS: creators R own flags            │
         │      public can INSERT (report)      │
         │      mods can R all                  │
         └──────────────────────────────────────┘

         ┌──────────────────────────────────────┐
         │ ANALYTICS_DAILY                      │
         ├──────────────────────────────────────┤
         │ PK: id (UUID)                        │
         │ FK: creator_id (creators)            │
         │ FK: template_id (templates, nullable)│
         │ metric_date (DATE)                   │
         │ views, remixes, revenue_cents        │
         │ created_at, updated_at               │
         │                                      │
         │ UNIQUE: (creator_id, template_id,   │
         │          metric_date)                │
         │                                      │
         │ RLS: creators R own                  │
         │      system can R/W (batch jobs)     │
         └──────────────────────────────────────┘
```

## Table Relationships Summary

| Parent Table | Relationship | Child Table | Cascade |
|---|---|---|---|
| auth.users | 1:1 | creators | DELETE CASCADE |
| creators | 1:N | tracks | DELETE CASCADE |
| creators | 1:N | templates | DELETE CASCADE |
| creators | 1:N | template_collaborators | DELETE CASCADE |
| creators | 1:N | payouts | DELETE CASCADE |
| creators | 1:N | royalties | DELETE CASCADE |
| creators | 1:N | analytics_daily | DELETE CASCADE |
| creators | 1:N | moderation_flags | DELETE SET NULL |
| tracks | 1:N | templates | DELETE RESTRICT (prevent orphaning templates) |
| templates | 1:N | remixes | DELETE CASCADE |
| templates | 1:N | template_collaborators | DELETE CASCADE |
| templates | 1:N | moderation_flags | DELETE CASCADE |
| templates | 1:N | analytics_daily | DELETE SET NULL |
| remixes | 1:N | royalties | DELETE CASCADE |
| auth.users | 1:N | remixes | DELETE CASCADE |
| auth.users | 1:N | moderation_flags (flagged_by) | DELETE SET NULL |
| auth.users | 1:N | moderation_flags (reviewed_by) | DELETE SET NULL |

**Legend:**
- `→` One-to-many (1:N)
- `↔` One-to-one (1:1) with unique constraint
- **Cascade** = child rows deleted when parent deleted
- **Restrict** = cannot delete parent if children exist
- **Set NULL** = parent reference nullified when parent deleted

## Data Flow

### 1. Creator Joins
```
auth.users (email sign-up) → creators INSERT → profile created
```

### 2. Creator Uploads Track
```
creators → tracks INSERT (s3_url, s3_key)
         → async BPM/key detection
         → tracks UPDATE (bpm, key, loudness_lufs)
```

### 3. Creator Builds Template
```
creators → templates INSERT (track_id, composition_json, published=false)
        → template_collaborators INSERT (invite co-producers)
        → templates UPDATE (published=true, published_at=now)
```

### 4. User Remixes Template
```
auth.users → remixes INSERT (template_id, status='draft')
          → (user edits locally)
          → remixes UPDATE (status='rendering')
          → (async render job)
          → remixes UPDATE (status='published', output_video_url)
          → royalties INSERT (creator_id, amount_cents='pending')
          → analytics_daily UPDATE (increment remix count)
```

### 5. Creator Earns Royalties
```
remixes published → royalties created (status='pending')
                 → (daily batch) → analytics_daily aggregated
                 → royalties status='processed' (when threshold met)
                 → creator can request payout
                 → payouts INSERT (amount_cents, status='pending')
                 → Stripe webhook → payouts UPDATE (status='paid')
```

## RLS Policy Matrix

| Table | Owner (Creator/User) | Public (Authenticated) | System | Moderator |
|---|---|---|---|---|
| **creators** | R/W own | R public | - | - |
| **tracks** | R/W own | R published | INSERT async | - |
| **templates** | R/W own | R published | - | - |
| **remixes** | R/W own | R published | INSERT/UPDATE | - |
| **royalties** | R own | - | INSERT/UPDATE | - |
| **template_collaborators** | R/W own (creator) | - | - | - |
| **payouts** | R/W own | - | UPDATE (webhook) | - |
| **moderation_flags** | R own | INSERT (report) | - | R all |
| **analytics_daily** | R own | - | INSERT/UPDATE (batch) | - |

## Index Strategy

### Search Optimization
```
templates:
  - name_trgm (GIST trigram)      ← prefix search "Trop%"
  - artist_trgm (tracks join)    ← "DJ Fresh%"
  - published+created_at (compound) ← trending query
```

### Lookup Optimization
```
creators:
  - user_id (unique FK)           ← auth lookup
  - stripe_account_id (unique)    ← Stripe OAuth verify

tracks:
  - creator_id                    ← creator's tracks
  - audio_fingerprint             ← dedup detection
  - published                     ← filter in queries

templates:
  - creator_id                    ← creator's templates
  - track_id                      ← track detail view
  - published                     ← discovery filter
  - price_cents                   ← price filtering
  - genre (via track)             ← genre filtering
```

### Dashboard Optimization
```
royalties:
  - creator_id+status (compound)  ← earnings summary
  - created_at (DESC)             ← recent payments

analytics_daily:
  - creator_id+metric_date (compound) ← revenue chart
  - template_id+metric_date           ← per-template breakdown
```

## Soft Delete Pattern

Instead of hard `DELETE`, set:
```sql
soft_deleted = TRUE
soft_deleted_at = now()
```

**Benefits:**
1. Preserves referential integrity (FK constraints still valid)
2. Allows recovery (set soft_deleted = FALSE)
3. Data audit trail (know when deleted)
4. RLS automatically excludes soft-deleted from public views

**Example:**
```sql
-- Don't: DELETE FROM tracks WHERE id = 'xyz';
-- Do:
UPDATE tracks SET soft_deleted = TRUE, soft_deleted_at = now() WHERE id = 'xyz';

-- Soft-deleted still visible to owner, excluded from search:
SELECT * FROM templates WHERE published = TRUE AND soft_deleted = FALSE;
```

## Status State Machines

### Royalty Lifecycle
```
pending → processed → paid
  ↓                    ↑
  └───→ failed ────────┘
```

Timestamp constraints:
- `pending`: no processed_at, no paid_at
- `processed`: has processed_at, no paid_at
- `paid`: has paid_at
- `failed`: either state

### Payout Lifecycle
```
pending → processing → paid
  ↓          ↓
  └──→ failed ─────┘
```

Similar timestamp rules, plus `stripe_payout_id` required for paid status.

### Remix Status
```
draft → rendering → published
            ↓
          failed
```

### Moderation Flag Lifecycle
```
         pending (auto-scan)
           ↓ ↓
        reviewed
           ↓ ↓
    dismissed  actioned (take action)
                   ↓ (if disputed)
              dispute_pending → approved/rejected
```

---

**For interactive diagram:** Use draw.io, Lucidchart, or dbdiagram.io and import the table definitions from SCHEMA_GUIDE.md.
