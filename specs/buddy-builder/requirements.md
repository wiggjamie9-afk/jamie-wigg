# Buddy Builder — Creator Marketplace Requirements

**Project ID:** buddy-builder  
**Phase:** Wave 2, Week 5-6 (MVP launch)  
**Status:** Specification phase

---

## Vision

Empower independent music producers to monetize custom video templates. Creators upload instrumentals, build video templates, set pricing, and earn royalties when others remix their work. A creator-first marketplace where the best producers can earn $1k-10k/month.

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Creator sign-ups | 500+ | Week 12 (after Wave 2 launch) |
| Published templates | 100+ | Week 12 |
| Revenue per top creator | $500-2k | Week 16 |
| Marketplace search <200ms | 100% | Week 8 |
| Payout success rate | 99.9% | Week 8 |

---

## Functional Requirements

### R1: Creator Onboarding

**Description:** New creators can sign up, create a profile, and connect Stripe for payouts.

**Acceptance Criteria:**
- [ ] Email sign-up with strong password validation
- [ ] Social auth (Apple, Google, GitHub)
- [ ] Profile fields: display name, bio, avatar, website (optional)
- [ ] Stripe Connect OAuth integration (no manual API keys)
- [ ] Bank verification completes within 5 minutes
- [ ] Verification email sent on sign-up

**Dependencies:** Wave 1 Supabase auth, Stripe Connect API

**Out of scope:** Artist verification (blue checkmarks) — Phase 2c

---

### R2: Track Upload & Metadata

**Description:** Creators upload MP3/WAV files; system extracts metadata (BPM, duration, key, loudness).

**Acceptance Criteria:**
- [ ] Drag-drop file upload, <500 MB file size limit
- [ ] Auto-detect BPM (±2 BPM accuracy) using Essentia or Sonic Annotator
- [ ] Auto-detect key (C, C#, D, etc.) from chromagram
- [ ] Auto-detect loudness (LUFS) and normalize to -14 LUFS
- [ ] Manual override for all metadata fields
- [ ] S3 upload with virus scan (ClamAV)
- [ ] Playback preview in browser (wavesurfer.js)
- [ ] Duplicate detection by audio fingerprint (Acoustid)

**Dependencies:** Essentia MCP or local subprocess (ffmpeg + aubio-tools)

**Out of scope:** Stem separation (acapella/instrumental), mastering — Phase 2d

---

### R3: Template Editor & Versioning

**Description:** Creators drag-drop elements (text, shapes, footage, effects) onto a canvas to build video templates. Save as draft, preview, publish.

**Acceptance Criteria:**
- [ ] Canvas: 1920×1080 (16:9), 1080×1920 (9:16), 1080×1080 (1:1)
- [ ] Elements: text layers, solid colors, gradients, custom footage, animated loops
- [ ] Timeline editor with frame-accurate scrubbing
- [ ] Real-time preview (not rendered)
- [ ] Save versions with auto-backup every 30s
- [ ] Publish template with version number (v1.0, v1.1, etc.)
- [ ] Unpublish or deprecate old versions

**Dependencies:** HyperFrames HTML spec, GSAP, Tailwind v4

**Out of scope:** Multi-user real-time collaboration (Figma-style) — Phase 2e

---

### R4: Monetization Setup

**Description:** Creators set pricing, royalty splits for co-producers, and licensing terms.

**Acceptance Criteria:**
- [ ] Pricing: $0 (free), $1-99 (premium template)
- [ ] Royalty split: creator retains 70%, co-producer can earn 30%
- [ ] Licensing: personal use, commercial use, exclusive (no resale), non-exclusive (resale allowed)
- [ ] Terms of service acceptance (accept before publish)
- [ ] ISRC code auto-generation (per track upload)
- [ ] Mechanical rights attribution (songwriter, producer)

**Dependencies:** Stripe pricing tables, ISRC registry API

**Out of scope:** SoundExchange registration, publishing admin — Phase 3

---

### R5: Marketplace Search & Discovery

**Description:** Users discover templates by browsing, searching, and filtering.

**Acceptance Criteria:**
- [ ] Full-text search on title, artist, track name (Postgres full-text or Algolia)
- [ ] Filters: genre (50+ genres), BPM range (60-180), mood (upbeat, chill, dark, etc.), license type
- [ ] Sort: trending, newest, price (low-high), rating
- [ ] Grid view: template thumbnail, track name, price, creator name
- [ ] Creator profile link from search result
- [ ] 50 results per page, lazy-load on scroll
- [ ] Search response time <200 ms

**Dependencies:** Supabase full-text search or Algolia

**Out of scope:** Recommendation engine (ML-based) — Phase 2f

---

### R6: Collaboration & Co-Producer Rights

**Description:** Creators can invite co-producers to share royalties on a template.

**Acceptance Criteria:**
- [ ] Creator sends invite link (no email required, link-based access)
- [ ] Co-producer accepts and gets added to royalty split
- [ ] Display "Made with [co-producer names]" on template card
- [ ] Co-producer can edit template with creator approval
- [ ] Royalties split automatically per agreement

**Dependencies:** JWT-based shareable invite links

**Out of scope:** Credit metadata (tags, mentions) — Phase 2g

---

### R7: Earnings Dashboard

**Description:** Creators track real-time earnings, payouts, and dispute history.

**Acceptance Criteria:**
- [ ] Real-time balance (updated every 60s)
- [ ] Breakdown by template (top earners highlighted)
- [ ] Revenue chart: daily/weekly/monthly totals
- [ ] Payout history: requested, processed, paid dates
- [ ] Minimum $10 before withdrawal
- [ ] Manual withdraw button → Stripe Connect payout (2-5 business days)
- [ ] Export earnings CSV (30-day, YTD, all-time)
- [ ] Dispute history (if chargebacks occur)

**Dependencies:** Stripe Connect API, Supabase real-time subscriptions

**Out of scope:** Tax form generation (1099), accounting integration — Phase 3

---

### R8: Content Moderation & Anti-Abuse

**Description:** System detects and flags inappropriate content; creators can dispute.

**Acceptance Criteria:**
- [ ] Auto-scan: profanity, explicit imagery (NSFW classification)
- [ ] Manual review queue for flagged content (24h SLA)
- [ ] Creators get notification of flag reason
- [ ] Dispute process: appeal within 7 days
- [ ] Take-down if copyright infringement reported (DMCA)

**Dependencies:** AWS Rekognition (image), moderation API

**Out of scope:** Multi-language content policies — Phase 2h

---

## Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| Page load (Lighthouse FCP) | <1.5s |
| Search response | <200ms |
| Template render preview | <500ms |
| Payout processing | <5 min (async) |
| CDN cache hit rate | >95% (templates) |

### Reliability

| Metric | Target |
|--------|--------|
| Uptime | 99.95% |
| Payment success rate | 99.9% |
| Payout failure recovery | 24h auto-retry |

### Security

- [ ] All endpoints behind auth (Wave 1 JWT)
- [ ] Stripe Connect uses OAuth (no API keys in frontend)
- [ ] File uploads scanned for malware
- [ ] Rate limit: 100 requests/min per user
- [ ] CORS allows only `rhythmixapp.com.au` + white-listed partner domains
- [ ] Payout data encrypted at rest (Supabase encryption)

### Accessibility

- [ ] WCAG 2.1 Level AA compliance
- [ ] Keyboard navigation on all pages
- [ ] Alt text on all imagery
- [ ] Color contrast ratio ≥ 4.5:1

---

## Data Model

### Core Entities

**Creator**
- id (UUID)
- user_id (FK → users)
- display_name, bio, avatar_url
- stripe_account_id (Stripe Connect)
- verified (Boolean)
- created_at

**Track**
- id (UUID)
- creator_id (FK)
- title, artist, isrc, duration_seconds
- bpm, key, loudness_lufs
- genre, mood (tags)
- s3_url (audio file)
- published (Boolean)
- created_at

**Template**
- id (UUID)
- creator_id (FK)
- name, track_id (FK)
- canvas_size ('16:9' | '9:16' | '1:1')
- preview_url (rendered thumbnail)
- price_cents (0 = free)
- royalty_split (JSONB: {co_producer_id: percentage})
- license_type ('personal' | 'commercial' | 'exclusive')
- published (Boolean)
- created_at

**Remix**
- id (UUID)
- user_id (FK → users)
- template_id (FK)
- output_video_url (S3)
- published (Boolean)
- created_at

**Royalty**
- id (UUID)
- remix_id (FK)
- creator_id (FK)
- co_producer_id (FK → creators, optional)
- amount_cents
- status ('pending' | 'processed' | 'paid')
- created_at, processed_at

---

## API Surface

### Authentication
```
POST /api/auth/signup                -- Email/social sign-up
POST /api/auth/signin                -- Sign in
POST /api/auth/logout                -- Sign out
```

### Creator Management
```
POST /api/creators                   -- Create creator profile
GET /api/creators/:id                -- Get profile
PATCH /api/creators/:id              -- Update profile
GET /api/creators/:id/tracks         -- List creator's tracks
GET /api/creators/:id/stats          -- Stats (revenue, templates, etc.)
POST /api/creators/stripe-connect    -- OAuth redirect
```

### Tracks
```
POST /api/tracks                     -- Upload track
GET /api/tracks/:id                  -- Get track detail
PATCH /api/tracks/:id                -- Update metadata
DELETE /api/tracks/:id               -- Delete track (soft delete)
GET /api/tracks/:id/analyze          -- Get BPM/key/loudness analysis
```

### Templates
```
POST /api/templates                  -- Create template
GET /api/templates/:id               -- Get template detail
PATCH /api/templates/:id             -- Update template
DELETE /api/templates/:id            -- Delete template (soft delete)
POST /api/templates/:id/publish      -- Publish template
POST /api/templates/:id/unpublish    -- Unpublish template
GET /api/templates/:id/preview       -- Render preview thumbnail
```

### Discovery
```
GET /api/discover                    -- Browse templates (paginated)
GET /api/discover/search?q=...       -- Full-text search
GET /api/discover/filters            -- Available filters & genres
GET /api/discover/trending           -- Trending templates
GET /api/discover/new                -- Newest templates
```

### Collaboration
```
POST /api/templates/:id/collaborators       -- Invite co-producer
GET /api/templates/:id/collaborators        -- List collaborators
DELETE /api/templates/:id/collaborators/:cid -- Remove collaborator
```

### Monetization
```
POST /api/royalties                  -- Create royalty record (on remix publish)
GET /api/royalties                   -- User's earnings
GET /api/royalties/breakdown          -- Breakdown by template
POST /api/withdraw                   -- Request payout
GET /api/withdraw/history            -- Payout history
POST /api/stripe-webhooks/payout     -- Payout completion webhook
```

---

## Success Criteria (Wave 2 End)

- [ ] 500+ creators signed up
- [ ] 100+ published templates
- [ ] $50k+ total GMV (gross merchandise value)
- [ ] <200ms search latency (p99)
- [ ] 99.9% payout success rate
- [ ] <5 support tickets/week (quality metric)
