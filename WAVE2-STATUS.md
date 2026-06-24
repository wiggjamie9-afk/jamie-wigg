# Wave 2 Status — Creator Ecosystem & Embedded Platforms (Week 5-8)

Wave 2 extends STARLIGHTMIX beyond the solo user. Three concurrent products unlock the full ecosystem: creator monetization (Buddy Builder), iOS-native recovery workflows (Recovery iOS), and the RHYTHMIX backend that powers premium features for all three Wave 1 products.

**Timeline:** 4 weeks (Week 5-8). Deploy after Wave 1 is live for 48 hours and stable.

---

## 1. Buddy Builder — Creator Marketplace & Collaboration Platform

**What it is:** Studio for independent music video creators. Upload instrumental tracks, monetize custom video templates, collaborate with co-producers, earn from royalty-sharing pools.

**Key users:**
- Solopreneur producers (10k+ globally)
- Creator collectives / bands
- Music platforms looking for white-label content

**Phase 2a: MVP Launch (Week 5-6)**

### Product Scope

| Feature | Status | Notes |
|---------|--------|-------|
| Creator sign-up & profile | Code | Email + social auth (Apple, Google) |
| Track upload | Code | MP3/WAV, auto-detect BPM, fade-in/out |
| Template editor | Code | Drag-drop scene builder, preview |
| Monetization setup | Code | Stripe Connect (payout splits) |
| Earnings dashboard | Code | Real-time royalties, withdrawal |
| Search & discovery | Code | Filters: genre, BPM, mood, license type |
| Collaboration invite | Code | Share template → co-producer rights |
| Audio metadata | Code | ISRC, publishing, mechanical rights |

### Deployment

- **Host:** Vercel (same as course-platform)
- **Database:** Supabase (shared with Wave 1)
- **Storage:** AWS S3 (audio + templates)
- **Payments:** Stripe Connect + Plaid for banking

### Database Schema (New Tables)

```sql
-- Buddy Builder

CREATE TABLE creators (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  stripe_account_id TEXT UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE tracks (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  title TEXT NOT NULL,
  artist TEXT,
  duration_seconds INT,
  bpm INT,
  genre TEXT,
  mood TEXT,
  s3_url TEXT,
  isrc TEXT UNIQUE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

CREATE TABLE templates (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  name TEXT NOT NULL,
  track_id UUID REFERENCES tracks(id),
  preview_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  remix_price_cents INT,
  royalty_split JSONB,
  created_at TIMESTAMP
);

CREATE TABLE remixes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  template_id UUID REFERENCES templates(id),
  output_video_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

CREATE TABLE royalties (
  id UUID PRIMARY KEY,
  remix_id UUID REFERENCES remixes(id),
  creator_id UUID REFERENCES creators(id),
  amount_cents INT,
  status TEXT, -- 'pending', 'processed', 'paid'
  processed_at TIMESTAMP
);

-- RLS Policies
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE remixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalties ENABLE ROW LEVEL SECURITY;
```

### API Endpoints

```
POST   /api/creators                -- Sign up as creator
GET    /api/creators/:id            -- Profile
PATCH  /api/creators/:id            -- Update profile
GET    /api/creators/:id/tracks     -- List creator's tracks
POST   /api/creators/:id/tracks     -- Upload track
GET    /api/tracks/:id              -- Track detail
GET    /api/discover/tracks         -- Search & filter
POST   /api/templates               -- Create template
GET    /api/templates/:id           -- Template detail
POST   /api/templates/:id/remixes   -- Publish remix
GET    /api/royalties               -- Earnings dashboard
POST   /api/stripe-connect/auth     -- Stripe Connect setup
POST   /api/withdraw                -- Request payout
```

### Files to Create

| File | Purpose |
|------|---------|
| `apps/buddy-builder/` | Next.js 15 app |
| `apps/buddy-builder/app/creator/onboarding/page.tsx` | Creator sign-up flow |
| `apps/buddy-builder/app/studio/tracks/page.tsx` | Track upload & management |
| `apps/buddy-builder/app/studio/templates/page.tsx` | Template editor |
| `apps/buddy-builder/app/discover/page.tsx` | Search marketplace |
| `apps/buddy-builder/app/dashboard/earnings/page.tsx` | Royalty tracking |
| `apps/buddy-builder/lib/stripe-connect.ts` | Payout integration |
| `apps/buddy-builder/lib/s3-upload.ts` | Audio upload handler |
| `apps/buddy-builder/app/api/webhooks/stripe/payout/route.ts` | Payout webhooks |

---

## 2. Recovery iOS — Native Team Sport Rehab App

**What it is:** Injury recovery tracking for team sports athletes. Personalized rehab protocols, team integration (coach oversight), real-time alerts if athlete re-injures.

**Key users:**
- Collegiate & semi-pro athletes
- Athletic trainers / team medical staff
- Physiotherapists (patient referral)

**Phase 2b: MVP Launch (Week 6-7)**

### Product Scope

| Feature | Status | Notes |
|---------|--------|-------|
| Native iOS UI | Code | Built with Capacitor (can also PWA) |
| Injury intake | Code | Diagnosis picker (ICD-10), severity scale |
| Rehab protocol editor | Code | Exercises, sets/reps, photos, video demos |
| Daily check-in | Code | Pain scale, ROM, compliance tracking |
| Coach dashboard | Code | Team view, alert on non-compliance |
| Re-injury alert | Code | Spike in pain or ROM loss → SMS/push |
| Offline mode | Code | IndexedDB, sync on reconnect |
| Export to medical | Code | PDF report for provider |

### Deployment

- **Host:** iOS App Store (via Capacitor + App Store Connect)
- **Backend:** Vercel serverless (shared with Wave 1)
- **Database:** Supabase (shared)
- **Push notifications:** Firebase Cloud Messaging + Apple Push Notification service (APNs)

### Database Schema (New Tables)

```sql
-- Recovery iOS

CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  team_id UUID,
  jersey_number INT,
  sport TEXT,
  position TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP
);

CREATE TABLE injuries (
  id UUID PRIMARY KEY,
  athlete_id UUID REFERENCES athlete_profiles(id),
  icd10_code VARCHAR(10),
  diagnosis TEXT,
  onset_date DATE,
  severity INT, -- 1-5 scale
  location TEXT,
  closed_date DATE, -- NULL if ongoing
  created_at TIMESTAMP
);

CREATE TABLE rehab_protocols (
  id UUID PRIMARY KEY,
  injury_id UUID REFERENCES injuries(id),
  provider_id UUID REFERENCES users(id),
  name TEXT,
  estimated_duration_days INT,
  exercises JSONB, -- [{name, sets, reps, video_url}, ...]
  created_at TIMESTAMP
);

CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY,
  injury_id UUID REFERENCES injuries(id),
  date DATE,
  pain_scale INT, -- 0-10
  rom_percentage INT,
  exercises_completed INT,
  exercises_total INT,
  notes TEXT,
  created_at TIMESTAMP
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  injury_id UUID REFERENCES injuries(id),
  alert_type TEXT, -- 'pain_spike', 'rom_regression', 'missed_checkin'
  severity TEXT, -- 'info', 'warning', 'critical'
  message TEXT,
  coach_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

-- RLS Policies
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
```

### API Endpoints

```
POST   /api/athletes                -- Athlete registration
GET    /api/athletes/:id            -- Athlete profile
PATCH  /api/athletes/:id            -- Update profile
POST   /api/injuries                -- Record injury
GET    /api/injuries/:id            -- Injury detail
POST   /api/injuries/:id/checkin    -- Daily check-in
GET    /api/injuries/:id/checkins  -- Checkin history
GET    /api/injuries/:id/protocol   -- Rehab protocol
POST   /api/alerts/:id/notify       -- Coach notification
GET    /api/coach/team              -- Team dashboard
GET    /api/coach/alerts            -- Alerts feed
POST   /api/export/pdf              -- Generate PDF report
POST   /api/push-subscribe          -- Register device for push
```

### Files to Create

| File | Purpose |
|------|---------|
| `recovery-ios/src/` | Capacitor + React source |
| `recovery-ios/src/pages/InjuryIntake.tsx` | Diagnosis & intake form |
| `recovery-ios/src/pages/RehabDaily.tsx` | Daily check-in |
| `recovery-ios/src/pages/CoachDashboard.tsx` | Team view |
| `recovery-ios/src/pages/AlertCenter.tsx` | Notifications & alerts |
| `recovery-ios/lib/icd10-picker.ts` | ICD-10 code search |
| `recovery-ios/lib/push-notifications.ts` | Firebase + APNs setup |
| `recovery-ios/lib/pdf-export.ts` | Report generation (PDFKit) |
| `recovery-ios/app/api/alerts/route.ts` | Alert webhook handler |
| `recovery-ios/capacitor.config.ts` | Capacitor iOS config |

---

## 3. RHYTHMIX Platform — Backend API & AI Integration

**What it is:** Shared backend for all RHYTHMIX products. Handles video generation orchestration, AI model management, caching, webhooks, and premium feature access.

**Key services:**
- Video generation queue (HyperFrames → Replicate → S3)
- AI model router (FLUX, HunyuanVideo, Suno, ElevenLabs)
- Premium feature gating (Studio, Buddy Builder, Recovery)
- Analytics & telemetry

**Phase 2c: MVP Launch (Week 7-8)**

### Product Scope

| Feature | Status | Notes |
|---------|--------|-------|
| Video generation API | Code | Stateless, job-based queue |
| Model router | Code | Smart routing by tier/capability |
| Job status polling | Code | WebSocket + REST fallback |
| Webhooks | Code | Completion, failure, progress events |
| Rate limiting | Code | Per-user, per-model quotas |
| Caching | Code | Redis: generated video results |
| CDN origin | Code | CloudFront serving outputs |
| Premium tier gating | Code | Feature flags by subscription |

### Deployment

- **Host:** Vercel Edge Functions (for latency-sensitive endpoints)
- **Job queue:** Supabase (pg_boss) or Bull/Redis
- **Cache:** Redis (Upstash free tier or Heroku Redis)
- **CDN:** Cloudflare (edge caching) + CloudFront (origin)
- **Telemetry:** Datadog or Axiom (logs + metrics)

### Database Schema (New Tables)

```sql
-- RHYTHMIX Platform

CREATE TABLE video_generation_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  input_type TEXT, -- 'hyperframes', 'api'
  input_data JSONB,
  model TEXT, -- 'flux', 'hunyuan', 'runway'
  tier TEXT, -- 'pro', 'studio'
  status TEXT, -- 'queued', 'processing', 'complete', 'failed'
  output_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP,
  completed_at TIMESTAMP,
  ttl_days INT DEFAULT 30
);

CREATE TABLE model_quotas (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  model TEXT,
  quota_per_day INT,
  used_today INT,
  reset_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE premium_features (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  feature_flag TEXT,
  tier TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  enabled_at TIMESTAMP
);

CREATE TABLE webhooks_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES video_generation_jobs(id),
  event_type TEXT, -- 'job.complete', 'job.failed', 'job.progress'
  webhook_url TEXT,
  payload JSONB,
  retries INT DEFAULT 0,
  created_at TIMESTAMP
);

-- RLS Policies
ALTER TABLE video_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_features ENABLE ROW LEVEL SECURITY;
```

### API Endpoints

```
POST   /api/generate/video          -- Start video generation job
GET    /api/generate/:job_id        -- Poll job status
DELETE /api/generate/:job_id        -- Cancel job
POST   /api/models/available        -- List models by tier
GET    /api/quotas                  -- User quotas & usage
POST   /api/webhooks/register       -- Register webhook for events
GET    /api/features                -- Premium features enabled
POST   /api/preview                 -- Quick preview (upsampled result)
```

### Files to Create

| File | Purpose |
|------|---------|
| `rhythmix-api/` | Vercel serverless API |
| `rhythmix-api/api/generate.ts` | Video generation endpoint |
| `rhythmix-api/api/status.ts` | Job status polling |
| `rhythmix-api/api/models.ts` | Model router & availability |
| `rhythmix-api/api/webhooks.ts` | Event webhook delivery |
| `rhythmix-api/lib/job-queue.ts` | pg_boss queue management |
| `rhythmix-api/lib/model-router.ts` | AI model selection logic |
| `rhythmix-api/lib/rate-limiter.ts` | Quota enforcement |
| `rhythmix-api/lib/cache.ts` | Redis caching |
| `rhythmix-api/app.json` | Vercel Edge config |

---

## Implementation Roadmap

### Week 5 (Buddy Builder foundation)
- [ ] Supabase migrations (creators, tracks, templates, royalties tables)
- [ ] Creator sign-up flow (Stripe Connect OAuth)
- [ ] Track upload & metadata extraction (BPM detection)
- [ ] Template CRUD API

### Week 6 (Buddy Builder → live, Recovery iOS start)
- [ ] Monetization & royalty calculation
- [ ] Marketplace search & filters
- [ ] Collaboration invite system
- [ ] Recovery iOS intake form & schema

### Week 7 (Recovery iOS → alpha, RHYTHMIX Platform start)
- [ ] Daily check-in + alert logic
- [ ] Coach dashboard
- [ ] Push notifications setup
- [ ] RHYTHMIX video generation API (Replicate proxy)

### Week 8 (All three to production)
- [ ] Recovery iOS App Store submission prep
- [ ] RHYTHMIX model router & caching layer
- [ ] Premium feature gating across all three products
- [ ] Performance tuning & load testing
- [ ] Production deployment & monitoring

---

## Infrastructure & Costs

| Service | Wave 1 | Wave 2 | Total | Monthly Cost |
|---------|--------|--------|-------|--------------|
| Supabase (Database) | $25 | +$50 (3× tables) | $75 | ~$75 |
| Vercel (Functions/hosting) | $20 | +$80 (2 new apps) | $100 | ~$100 |
| AWS S3 (Storage) | ~$5 | +$20 (audio + templates) | ~$25 | ~$25 |
| Stripe (payments) | 2.9% | + Stripe Connect | 2.9% + 0.8% | ~$50/month (avg) |
| Twilio SMS (HerdCheck) | ~$10 | (no change) | ~$10 | ~$10 |
| Firebase (Push notif) | — | $5 (Recovery iOS) | $5 | ~$5 |
| Upstash Redis (cache) | — | $10 | $10 | ~$10 |
| **Total monthly** | **~$60** | **~+$155** | **~$215** | — |

**Notes:**
- Supabase scales to $275/mo at 10k DAU (still < $0.03/user/mo)
- Stripe Connect reduces payment processing latency; transaction fees stay 2.9% + 0.8%
- Recovery iOS in App Store costs $99/year (one-time developer account)
- S3 scales to ~$50/mo at 100 TB of output video storage

---

## Verification Checklist (Pre-launch)

### Buddy Builder
- [ ] Creator can sign up and connect Stripe account
- [ ] Track upload works; BPM auto-detection returns correct values
- [ ] Template can be created, previewed, and remixed
- [ ] Royalty payout calculated correctly (split logic tested with 3 creators)
- [ ] Search filters work: genre, BPM range, mood
- [ ] Marketplace displays 50+ templates (load test)

### Recovery iOS
- [ ] Injury intake form accepts ICD-10 codes via picker
- [ ] Daily check-in saves to IndexedDB (offline mode)
- [ ] Check-in syncs when reconnected
- [ ] Coach dashboard shows team alerts (alert spike in pain → SMS)
- [ ] PDF export includes injury history + checkin data
- [ ] iOS app builds & runs on physical device (via Xcode)

### RHYTHMIX Platform
- [ ] Video generation job queues and processes via Replicate
- [ ] Job status accessible via `/api/generate/:job_id`
- [ ] Webhook fires on completion with payload
- [ ] Rate limiting enforces quota (blocks requests after limit)
- [ ] Model router selects correct model by tier & capability
- [ ] Redis caching hits for repeated requests (99%+ cache hit rate)

---

## Post-Wave 2 Roadmap (Wave 3 & Beyond)

**Week 9+: Polish & scale**
- Buddy Builder: co-producer dashboard, licensing agreements
- Recovery iOS: multi-team management, advanced analytics
- RHYTHMIX Platform: model fine-tuning, A/B testing framework

**Month 3-6: Growth**
- White-label RHYTHMIX API (for external partners)
- Creator revenue share: top 1% of creators earn $10k+/month
- Recovery iOS enterprise: hospital & clinic integrations

**Month 6-12: Acquisition**
- Sync Buddy Builder with YouTube Music, Spotify playlists
- Recovery iOS medical device certification (FDA 510k track)
- RHYTHMIX Studio: video-to-merchandise pipeline (print-on-demand)

---

## Current Branch

All Wave 2 work commits to `claude/cybersecurity-skills-agents-70sxup`. After Wave 1 deploys and stabilizes (48 hours), merge Wave 2 branch to `main` and deploy.

**Next step:** Create specs for each product, then begin implementation in parallel.
