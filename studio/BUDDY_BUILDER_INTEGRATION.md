# Buddy Builder API — Integration Checklist

This file guides you through the next steps after API scaffolding.

**Scaffolded by:** Claude Code  
**Date:** 2025-06-25  
**Status:** Ready for database integration (all endpoints have TODO markers)  
**Total LOC:** 2,734 lines (14 route files + 2 utilities + types + docs)

---

## What's Been Created

### ✅ Complete
- **Endpoint structure** — 15 API routes following Next.js App Router conventions
- **Zod validation** — Input validation on all POST/PATCH requests
- **JWT auth** — Bearer token extraction, user_id verification
- **Error handling** — Consistent 400/401/403/404/500 responses
- **Type definitions** — Full TypeScript interfaces for all domain models
- **Logging** — Structured JSON logging with request tracing
- **Tests** — Vitest test suites (placeholder tests, activate after DB)
- **Documentation** — 400+ line API.md with examples & performance targets

### ⏳ Remaining (TODO markers in code)
- **Database queries** (~30 TODO markers across endpoints)
- **S3 file upload** — Presigned URL generation, virus scanning
- **Audio analysis** — BPM/key/loudness detection job enqueuing
- **Stripe API** — Code exchange, account status fetching, webhook handling
- **Cache** — Redis for filter options & trending calculations

---

## Step 1: Supabase Setup (T1.1)

### 1.1 Create migrations

**Time estimate:** 2-3 hours

Create these tables in Supabase (run `supabase migration new buddy_builder_schema`):

```sql
-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX creators_user_id_idx ON creators(user_id);
CREATE INDEX creators_stripe_account_id_idx ON creators(stripe_account_id);

-- Enable RLS
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own creator profile"
  ON creators FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own creator profile"
  ON creators FOR UPDATE
  USING (auth.uid() = user_id);

-- Tracks table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  title TEXT NOT NULL,
  artist TEXT,
  genre TEXT,
  bpm INTEGER,
  key TEXT,
  duration_seconds INTEGER,
  loudness_lufs DECIMAL(5,2),
  audio_url TEXT NOT NULL,
  analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'analyzing', 'completed', 'failed')),
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX tracks_creator_id_idx ON tracks(creator_id);
CREATE INDEX tracks_published_idx ON tracks(published);

-- Full-text search on title/artist
CREATE INDEX tracks_search_idx ON tracks USING GIN (to_tsvector('english', title || ' ' || COALESCE(artist, '')));

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own tracks"
  ON tracks FOR SELECT
  USING (creator_id = (SELECT id FROM creators WHERE user_id = auth.uid()));

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  track_id UUID NOT NULL REFERENCES tracks(id),
  title TEXT NOT NULL,
  template_schema JSONB DEFAULT '{"canvas_width": 1920, "canvas_height": 1080, "elements": [], "timeline": []}',
  royalty_percentage DECIMAL(5,2) DEFAULT 50 CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
  price_cents INTEGER DEFAULT 0,
  license_type TEXT DEFAULT 'commercial' CHECK (license_type IN ('personal', 'commercial', 'exclusive')),
  published BOOLEAN DEFAULT FALSE,
  version TEXT DEFAULT '0.1.0',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX templates_creator_id_idx ON templates(creator_id);
CREATE INDEX templates_published_idx ON templates(published);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published templates"
  ON templates FOR SELECT
  USING (published OR creator_id = (SELECT id FROM creators WHERE user_id = auth.uid()));

-- Remixes table
CREATE TABLE remixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  template_id UUID NOT NULL REFERENCES templates(id),
  title TEXT NOT NULL,
  settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX remixes_creator_id_idx ON remixes(creator_id);
CREATE INDEX remixes_template_id_idx ON remixes(template_id);
CREATE INDEX remixes_status_idx ON remixes(status);

ALTER TABLE remixes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own remixes"
  ON remixes FOR SELECT
  USING (creator_id = (SELECT id FROM creators WHERE user_id = auth.uid()));

-- Royalties table
CREATE TABLE royalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id),
  remix_id UUID NOT NULL REFERENCES remixes(id),
  amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX royalties_status_idx ON royalties(status);
CREATE INDEX royalties_template_id_idx ON royalties(template_id);

-- Collaborators table
CREATE TABLE collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email TEXT NOT NULL,
  royalty_percentage DECIMAL(5,2) NOT NULL CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
  role TEXT DEFAULT 'co-producer' CHECK (role IN ('co-producer', 'contributor')),
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
  invite_token TEXT,
  invite_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX collaborators_template_id_idx ON collaborators(template_id);
CREATE INDEX collaborators_user_id_idx ON collaborators(user_id);

-- Template versions table
CREATE TABLE template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id),
  version TEXT NOT NULL,
  template_schema JSONB NOT NULL,
  published_at TIMESTAMPTZ DEFAULT now(),
  remix_count INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  UNIQUE(template_id, version)
);

CREATE INDEX template_versions_template_id_idx ON template_versions(template_id);
```

### 1.2 Deploy migrations

```bash
cd studio/
supabase migration up
```

### 1.3 Verify in Supabase dashboard

- Check "SQL Editor" → "Database" → verify all 7 tables exist
- Check "Authentication" → "Policies" → verify RLS is enabled
- Check "Table Editor" → verify indexes on creator_id, published, status

---

## Step 2: Implement Database Queries (T1.2-T1.4)

### 2.1 Find all TODO markers

```bash
grep -rn "TODO:" studio/app/api/*.ts | wc -l
# Should show ~30 TODOs
```

### 2.2 Example: Implement `POST /api/creators`

**File:** `studio/app/api/creators/route.ts`

Replace this TODO:
```javascript
// TODO: Check if creator already exists for this user
// TODO: Insert into creators table (Supabase)
// TODO: Set user_id, timestamps, defaults
```

With:
```javascript
import { supabase } from '@/lib/auth';

// Check if creator already exists
const { data: existingCreator } = await supabase
  .from('creators')
  .select('id')
  .eq('user_id', userId)
  .single();

if (existingCreator) {
  return NextResponse.json(
    { error: 'Creator profile already exists for this user' },
    { status: 409 }
  );
}

// Insert new creator
const { data: creator, error: insertError } = await supabase
  .from('creators')
  .insert([{
    user_id: userId,
    display_name: validatedData.display_name,
    bio: validatedData.bio || null,
    avatar_url: validatedData.avatar_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }])
  .select()
  .single();

if (insertError) {
  logError(requestId, 'Failed to create creator', insertError);
  return NextResponse.json(
    { error: 'Failed to create creator profile' },
    { status: 500 }
  );
}
```

### 2.3 Repeat for all endpoints

Priority order (from spec):
1. Creators CRUD (T1.2) — 2-3 hours
2. Tracks CRUD (T1.3) — 3-4 hours
3. Search/Filter (T1.4) — 2-3 hours
4. Templates CRUD — 3-4 hours
5. Stripe OAuth — 2-3 hours

**Tip:** Start with simple GET endpoints (no auth), then move to POST/PATCH.

---

## Step 3: S3 Upload Integration (T3.1)

### 3.1 Configure AWS credentials

```env
# .env.local
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=buddy-builder-audio
```

### 3.2 Generate presigned upload URL

Create `studio/lib/s3.ts`:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUploadUrl(trackId: string, filename: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `tracks/${trackId}/${filename}`,
    ContentType: 'audio/mpeg',
  });
  
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
```

### 3.3 Call in `POST /api/tracks`

Replace S3 TODO:
```typescript
const presignedUrl = await getPresignedUploadUrl(trackId, file.name);
// Return presignedUrl to frontend
// Frontend uploads directly to S3 (no server-side bandwidth)
```

---

## Step 4: Audio Analysis (T3.2)

### 4.1 Set up job queue (Supabase pg_boss)

```bash
supabase link --project-ref <project-id>
supabase functions new analyze-track
```

**File:** `studio/supabase/functions/analyze-track/index.ts`

```typescript
import { ffprobe } from 'ffmpeg-utils';

export const handler = async (req) => {
  const { trackId, audioUrl } = req.body;
  
  // Download audio from S3
  const audioBuffer = await fetch(audioUrl).then(r => r.arrayBuffer());
  
  // Analyze with ffprobe (BPM, duration)
  const analysis = await ffprobe(Buffer.from(audioBuffer));
  
  // Update track in DB
  const { error } = await supabase
    .from('tracks')
    .update({
      bpm: Math.round(analysis.bpm),
      duration_seconds: Math.round(analysis.duration),
      analysis_status: 'completed',
      loudness_lufs: analysis.loudness,
    })
    .eq('id', trackId);
  
  return { success: !error };
};
```

### 4.2 Trigger job from `GET /api/tracks/:id/analyze`

Replace job TODO:
```typescript
const { data, error } = await supabase
  .from('jobs')
  .insert([{
    type: 'analyze-track',
    payload: { trackId: id, audioUrl: track.audio_url },
    status: 'queued',
  }])
  .select()
  .single();
```

---

## Step 5: Stripe Connect Integration (T2.2)

### 5.1 Configure Stripe secrets

```env
# .env.local
STRIPE_CONNECT_CLIENT_ID=ca_...  # Get from Stripe Dashboard → Settings
STRIPE_CONNECT_SECRET_KEY=sk_...  # Restricted API key with "Connect" scope
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5.2 Implement OAuth code exchange

**File:** `studio/app/api/stripe/oauth/route.ts`

Replace this TODO:
```typescript
// TODO: Call Stripe API to exchange code for account_id
```

With:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_CONNECT_SECRET_KEY!);

const tokenResponse = await stripe.oauth.token({
  grant_type: 'authorization_code',
  code,
});

const stripeAccountId = tokenResponse.stripe_user_id;

// Update creator in DB
await supabase
  .from('creators')
  .update({ stripe_account_id: stripeAccountId })
  .eq('id', creatorId);
```

### 5.3 Set up webhooks

**File:** `studio/app/api/webhooks/stripe/route.ts`

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_CONNECT_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const event = await req.json();
  
  // Verify webhook signature
  const sig = req.headers.get('stripe-signature')!;
  try {
    const verifiedEvent = stripe.webhooks.constructEvent(
      await req.text(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    if (verifiedEvent.type === 'account.updated') {
      const account = verifiedEvent.data.object as Stripe.Account;
      
      // Update creator with new account status
      await supabase
        .from('creators')
        .update({
          stripe_charges_enabled: account.charges_enabled,
          stripe_payouts_enabled: account.payouts_enabled,
        })
        .eq('stripe_account_id', account.id);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
```

---

## Step 6: Testing

### 6.1 Activate unit tests

Uncomment test cases in:
- `studio/app/api/__tests__/creators.test.ts`
- `studio/app/api/__tests__/tracks.test.ts`
- `studio/app/api/__tests__/templates.test.ts`
- `studio/app/api/__tests__/stripe.test.ts`

### 6.2 Run tests

```bash
cd studio/
pnpm test app/api/__tests__/
```

### 6.3 Manual testing with curl

```bash
# Get JWT token (from Supabase auth)
TOKEN="eyJ..."

# Create creator
curl -X POST http://localhost:3000/api/creators \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Test Creator", "bio": "Testing"}'

# Upload track
curl -X POST http://localhost:3000/api/tracks \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/audio.mp3" \
  -F "title=My Track" \
  -F "artist=Me" \
  -F "bpm=128"

# List templates
curl http://localhost:3000/api/templates?sort=trending&limit=10
```

---

## Step 7: Deployment

### 7.1 Environment variables

**GitHub Secrets** (for CI/CD):

```
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
STRIPE_CONNECT_CLIENT_ID=ca_...
STRIPE_CONNECT_SECRET_KEY=sk_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### 7.2 Deploy to Cloudflare Pages

The existing `.github/workflows/studio-deploy.yml` will handle this.

```bash
git push origin main
# Watch .github/workflows/studio-deploy.yml for deployment
```

### 7.3 Verify in production

```bash
# Test endpoints against production URL
curl https://studio.starlightmix.com/api/templates?limit=5
```

---

## Performance Checklist

- [ ] **GET /api/creators/:id/stats** — <100ms response (materialized view or cache)
- [ ] **GET /api/discover** — <200ms response (pagination, indexes on published)
- [ ] **POST /api/tracks** — <5s for 10 MB file (multipart + S3 upload)
- [ ] **GET /api/templates** — <2s page load (50 items, inline schema)

Use Datadog/CloudWatch to monitor:
```typescript
console.log(JSON.stringify({
  endpoint: '/api/creators',
  latency_ms: Date.now() - startTime,
  status: 200,
}));
```

---

## Checklist for Phase 1 (Schema & API Foundation)

**T1.1: Supabase Migrations**
- [ ] Create all 7 tables
- [ ] Add indexes on foreign keys (creator_id, template_id, etc.)
- [ ] Add full-text search index on tracks
- [ ] Enable RLS on all tables
- [ ] Test RLS policies (SELECT as user, PATCH as non-owner should fail)

**T1.2: Creator CRUD**
- [ ] POST /api/creators (201)
- [ ] GET /api/creators/:id (200)
- [ ] PATCH /api/creators/:id (200, auth-gated)
- [ ] GET /api/creators/:id/stats (200, <100ms)

**T1.3: Track CRUD**
- [ ] POST /api/tracks (multipart, 201)
- [ ] GET /api/tracks (list with pagination, 200)
- [ ] GET /api/tracks/:id (200)
- [ ] PATCH /api/tracks/:id (auth-gated, 200)
- [ ] DELETE /api/tracks/:id (soft delete, 200)
- [ ] GET /api/tracks/:id/analyze (202 Accepted, async job)

**T1.4: Search & Filter**
- [ ] GET /api/templates (discovery, published only)
- [ ] Filters: category, bpm_min/max, mood, license
- [ ] Sort: trending, newest, price
- [ ] Pagination: limit + offset (<200ms)

**Acceptance:**
- [ ] All endpoints return 401 without auth
- [ ] PATCH/DELETE return 403 if not owner
- [ ] Validation errors return 400 with details
- [ ] Database queries use RLS (auto-filtered by auth.uid())
- [ ] Performance targets met (see checklist above)

---

## Contact & Support

**Questions?**
- See `studio/API.md` for full endpoint documentation
- See `specs/buddy-builder/tasks.md` for task details
- Check test files for usage examples

**Debugging:**
```bash
# View logs
tail -f logs/*.log

# Check Supabase RLS
supabase functions logs

# Test JWT
echo $TOKEN | jq -R 'split(".") | .[1] | @base64d | fromjson'
```

---

**Good luck! You've got a solid foundation to build on. 🚀**
