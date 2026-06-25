# Buddy Builder API — Scaffolding Guide

This document covers the scaffolded Express.js-style API endpoints for Buddy Builder (creator marketplace + template editor).

**Status:** Stub implementations with Zod validation, JWT auth middleware, and error handling. Ready for database integration.

---

## Quick Start

All endpoints require JWT Bearer token in the `Authorization` header:

```bash
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### Creators

#### `POST /api/creators` — Create Creator Profile
**Auth:** Required (JWT)

Create a new creator profile from an authenticated user.

**Request:**
```json
{
  "display_name": "string (required, 1-100 chars)",
  "bio": "string (optional, max 500 chars)",
  "avatar_url": "string (optional, valid URL)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "display_name": "string",
  "bio": "string | null",
  "avatar_url": "string | null",
  "stripe_account_id": "string | null",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Errors:**
- `400` — Invalid request body (validation error)
- `401` — Missing or invalid auth token
- `409` — Creator already exists for this user (TODO: implement)

---

#### `GET /api/creators/:id` — Get Creator Profile
**Auth:** Optional

Fetch creator profile by ID.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "display_name": "string",
  "bio": "string | null",
  "avatar_url": "string | null",
  "stripe_account_id": "string | null",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Errors:**
- `404` — Creator not found

---

#### `PATCH /api/creators/:id` — Update Creator Profile
**Auth:** Required (JWT, owner only)

Update creator profile. Only the owner can update their own profile.

**Request:**
```json
{
  "display_name": "string (optional, 1-100 chars)",
  "bio": "string (optional, max 500 chars)",
  "avatar_url": "string (optional, valid URL)",
  "stripe_account_id": "string (optional)"
}
```

**Response:** `200 OK` (same as GET)

**Errors:**
- `400` — Invalid request body
- `401` — Missing or invalid auth token
- `403` — Not authorized (not owner)
- `404` — Creator not found

---

#### `GET /api/creators/:id/stats` — Get Creator Stats
**Auth:** Optional

Fetch real-time creator statistics (revenue, templates, followers). Performance target: **<100ms**.

**Response:** `200 OK`
```json
{
  "creator_id": "uuid",
  "total_revenue_cents": "integer (e.g., 15000 = $150.00)",
  "total_templates": "integer",
  "total_remixes": "integer",
  "follower_count": "integer",
  "top_templates": [
    {
      "template_id": "uuid",
      "title": "string",
      "remixes": "integer",
      "revenue_cents": "integer"
    }
  ]
}
```

**Errors:**
- `404` — Creator not found

---

### Tracks

#### `POST /api/tracks` — Upload Track
**Auth:** Required (JWT)

Upload an audio track with metadata. Expects `multipart/form-data`.

**Form Fields:**
- `file` (required) — audio file (.mp3 or .wav, max 500 MB)
- `title` (required) — track title (1-200 chars)
- `artist` (optional) — artist name (max 200 chars)
- `genre` (optional) — genre (max 100 chars)
- `bpm` (optional) — beats per minute (positive integer)
- `key` (optional) — musical key (e.g., "D Major")

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "title": "string",
  "artist": "string | null",
  "genre": "string | null",
  "bpm": "integer | null",
  "key": "string | null",
  "duration_seconds": "integer | null",
  "loudness_lufs": "number | null",
  "audio_url": "string (S3 URL)",
  "analysis_status": "pending | analyzing | completed | failed",
  "published": "boolean",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Process:**
1. Validate file type and size
2. Upload to S3 with presigned URL
3. Trigger ClamAV virus scan (async)
4. Check Acoustid for duplicates (fingerprint)
5. Enqueue BPM/key/loudness analysis job
6. Return track record with `analysis_status: 'pending'`

**Errors:**
- `400` — Invalid file type or size exceeds 500 MB
- `401` — Missing or invalid auth token

---

#### `GET /api/tracks` — List Creator's Tracks
**Auth:** Required (JWT)

List all tracks uploaded by the authenticated creator.

**Query Params:**
- `limit` (optional, default 50, max 100) — results per page
- `offset` (optional, default 0) — pagination offset
- `cursor` (optional) — cursor for cursor-based pagination

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "creator_id": "uuid",
      "title": "string",
      "artist": "string | null",
      "genre": "string | null",
      "bpm": "integer | null",
      "key": "string | null",
      "duration_seconds": "integer | null",
      "loudness_lufs": "number | null",
      "audio_url": "string",
      "analysis_status": "string",
      "published": "boolean",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "pagination": {
    "limit": "integer",
    "offset": "integer",
    "total": "integer"
  }
}
```

**Errors:**
- `401` — Missing or invalid auth token

---

#### `GET /api/tracks/:id` — Get Track Detail
**Auth:** Optional (public tracks)

Fetch track metadata and audio URL.

**Response:** `200 OK` (same as individual track object)

**Errors:**
- `404` — Track not found

---

#### `PATCH /api/tracks/:id` — Update Track Metadata
**Auth:** Required (JWT, creator only)

Update track title, artist, BPM, key, genre, etc.

**Request:**
```json
{
  "title": "string (optional, 1-200 chars)",
  "artist": "string (optional, max 200 chars)",
  "genre": "string (optional, max 100 chars)",
  "bpm": "integer (optional, positive)",
  "key": "string (optional)"
}
```

**Response:** `200 OK` (updated track object)

**Errors:**
- `400` — Invalid metadata
- `401` — Missing or invalid auth token
- `403` — Not authorized (not creator)
- `404` — Track not found

---

#### `DELETE /api/tracks/:id` — Soft Delete Track
**Auth:** Required (JWT, creator only)

Soft delete (set `published=false`, preserve data).

**Response:** `200 OK`
```json
{
  "message": "Track deleted successfully"
}
```

**Errors:**
- `401` — Missing or invalid auth token
- `403` — Not authorized
- `404` — Track not found

---

#### `GET /api/tracks/:id/analyze` — Trigger Analysis
**Auth:** Required (JWT, creator only)

Enqueue async analysis job (BPM, key, loudness detection). Returns immediately with `202 Accepted`.

**Response:** `202 Accepted`
```json
{
  "job_id": "uuid",
  "track_id": "uuid",
  "status": "queued",
  "analysis_results": null,
  "created_at": "ISO8601"
}
```

**Process:**
- Download audio from S3
- Run ffmpeg + aubio-tools (BPM) or call Essentia API
- Run chromagram analysis (key detection)
- Measure loudness (LUFS)
- Update track record with results

**Poll Status:** Check `GET /api/tracks/:id` — `analysis_status` field updates when complete.

**Errors:**
- `401` — Missing or invalid auth token
- `403` — Not authorized
- `404` — Track not found

---

### Templates

#### `POST /api/templates` — Create Template
**Auth:** Required (JWT)

Create a new template from an uploaded track.

**Request:**
```json
{
  "track_id": "uuid (required)",
  "title": "string (optional, 1-200 chars)",
  "settings": "object (optional, any valid JSON)",
  "royalty_percentage": "number (optional, 0-100, default 50)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "track_id": "uuid",
  "title": "string",
  "template_schema": {
    "canvas_width": 1920,
    "canvas_height": 1080,
    "elements": [],
    "timeline": []
  },
  "royalty_percentage": "number",
  "price_cents": 0,
  "published": false,
  "version": "0.1.0",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Errors:**
- `400` — Invalid request body or track not found
- `401` — Missing or invalid auth token

---

#### `GET /api/templates` — List Published Templates (Discovery)
**Auth:** Optional

List all published templates with filtering & sorting. Used for the marketplace discovery page.

**Query Params:**
- `category` (optional) — filter by genre/category
- `bpm_min` (optional) — minimum BPM
- `bpm_max` (optional) — maximum BPM
- `mood` (optional) — filter by mood (e.g., "energetic", "calm")
- `license` (optional) — filter by license type (personal, commercial, exclusive)
- `sort` (optional) — sort by: `trending` (remixes in last 7 days), `newest`, `price`
- `limit` (optional, default 50, max 100)
- `offset` (optional, default 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "creator_id": "uuid",
      "track_id": "uuid",
      "title": "string",
      "template_schema": { ... },
      "royalty_percentage": "number",
      "price_cents": "integer",
      "published": true,
      "version": "1.0.0",
      "remix_count": "integer",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "pagination": {
    "limit": "integer",
    "offset": "integer",
    "total": "integer"
  },
  "filters_applied": {
    "category": "string | null",
    "bpm_min": "integer | null",
    "bpm_max": "integer | null",
    "mood": "string | null"
  }
}
```

**Performance:**
- **Search latency:** <200ms (p99)
- Cache filter options in Redis (1-hour TTL)
- Use PostgreSQL FTS for keyword search

---

#### `GET /api/templates/:id` — Get Template Detail
**Auth:** Optional

Fetch template JSON and metadata. If draft, auth-gated to creator.

**Response:** `200 OK` (template object with full schema)

**Errors:**
- `403` — Unauthorized (draft template, not creator)
- `404` — Template not found

---

#### `PATCH /api/templates/:id` — Update Draft Template
**Auth:** Required (JWT, creator only)

Update template in draft state. Once published, immutable (create new version instead).

**Request:**
```json
{
  "title": "string (optional, 1-200 chars)",
  "template_schema": "object (optional, full or partial schema)",
  "royalty_percentage": "number (optional, 0-100)",
  "price_cents": "integer (optional, ≥0)",
  "license_type": "string (optional: personal|commercial|exclusive)"
}
```

**Response:** `200 OK` (updated template)

**Notes:**
- Auto-save every 30s from UI (update `updated_at` timestamp)
- Published templates are immutable; create new version on re-publish

**Errors:**
- `400` — Invalid metadata or template already published
- `401` — Missing or invalid auth token
- `403` — Not authorized (not creator)
- `404` — Template not found

---

#### `POST /api/templates/:id/publish` — Publish Template
**Auth:** Required (JWT, creator only)

Publish template (set `published=true`, auto-generate version).

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "track_id": "uuid",
  "title": "string",
  "template_schema": { ... },
  "published": true,
  "version": "1.0.0",
  "published_at": "ISO8601",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Versioning:**
- First publish: `v1.0.0`
- Subsequent publishes: `v1.1.0`, `v1.2.0`, etc.
- Each version is immutable

**Errors:**
- `400` — Template has validation errors or invalid state
- `401` — Missing or invalid auth token
- `403` — Not authorized
- `404` — Template not found

---

#### `GET /api/templates/:id/versions` — List Template Versions
**Auth:** Optional

List all published versions of a template.

**Response:** `200 OK`
```json
{
  "template_id": "uuid",
  "versions": [
    {
      "id": "uuid",
      "template_id": "uuid",
      "version": "1.0.0",
      "template_schema": { ... },
      "published_at": "ISO8601",
      "remix_count": "integer",
      "downloads": "integer"
    }
  ]
}
```

---

#### `DELETE /api/templates/:id` — Soft Delete Template
**Auth:** Required (JWT, creator only)

Soft delete (set `published=false`, preserve versions).

**Response:** `200 OK`
```json
{
  "message": "Template deleted successfully"
}
```

**Errors:**
- `401` — Missing or invalid auth token
- `403` — Not authorized
- `404` — Template not found

---

### Remixes

#### `POST /api/remixes` — Create Remix
**Auth:** Required (JWT)

Create a remix from a published template.

**Request:**
```json
{
  "template_id": "uuid (required)",
  "title": "string (optional, 1-200 chars)",
  "settings": "object (optional, template-specific overrides)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "template_id": "uuid",
  "title": "string",
  "settings": "object",
  "status": "draft",
  "published": false,
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Checks:**
- Verify template is published
- Check license type (personal/commercial/exclusive)
- Create royalty record if published later

**Errors:**
- `400` — Template not found or not published
- `401` — Missing or invalid auth token

---

#### `GET /api/remixes` — List Remixes
**Auth:** Optional

List remixes (published or creator-specific).

**Query Params:**
- `creator_id` (optional) — filter by creator (requires auth if not your own)
- `published` (optional, boolean) — filter published remixes only
- `template_id` (optional) — filter by template
- `limit` (optional, default 50, max 100)
- `offset` (optional, default 0)

**Response:** `200 OK`
```json
{
  "data": [ /* remix objects */ ],
  "pagination": { ... }
}
```

---

### Stripe Connect

#### `GET /api/stripe/oauth/auth` — Generate OAuth URL
**Auth:** Required (JWT)

Generate Stripe Connect authorization URL for creator onboarding.

**Response:** `200 OK`
```json
{
  "authorization_url": "https://connect.stripe.com/oauth/authorize?client_id=...&state=...",
  "state": "uuid (for CSRF verification)"
}
```

**Notes:**
- Store state in session/cache with 10-minute expiry
- Redirect user to `authorization_url`

**Errors:**
- `401` — Missing or invalid auth token
- `500` — STRIPE_CONNECT_CLIENT_ID not configured

---

#### `GET /api/stripe/oauth/callback` — OAuth Callback Handler
**Auth:** Query params (code, state, stripe_user_id)

Handle OAuth redirect from Stripe after creator authorizes.

**Query Params:**
- `code` (required) — authorization code from Stripe
- `state` (required) — state param for CSRF verification
- `stripe_user_id` (required) — Stripe account ID

**Response:** `302 Found` (redirect)
- **Success:** Redirect to `/creator/stripe-connect-success?account_id=acct_...`
- **Error:** Redirect to `/creator/stripe-connect-error?error=oauth_failed`

**Process:**
1. Verify state against stored value (CSRF protection)
2. Exchange code for account token via Stripe API
3. Extract `stripe_account_id` from response
4. Update `creators` table with `stripe_account_id`
5. Redirect with success/error

**Errors:**
- `400` — Missing code or state
- `403` — Invalid state (CSRF verification failed)

---

#### `GET /api/stripe/oauth/status` — Check Account Status
**Auth:** Required (JWT)

Check Stripe Connect account onboarding progress.

**Response:** `200 OK`
```json
{
  "stripe_account_id": "acct_...",
  "charges_enabled": boolean,
  "payouts_enabled": boolean,
  "requirements": {
    "currently_due": ["string"],
    "eventually_due": ["string"],
    "past_due": ["string"]
  },
  "onboarding_complete": boolean
}
```

**Notes:**
- `charges_enabled`: ready to accept payments
- `payouts_enabled`: ready to pay out earnings
- `requirements`: list of missing info for full onboarding
- Disable payout button in UI until `payouts_enabled=true`

**Errors:**
- `401` — Missing or invalid auth token
- `404` — Creator not found or no Stripe account

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "string (error type)",
  "details": "string (optional, validation errors)"
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET, PATCH, DELETE, POST publish) |
| 201 | Created (POST create) |
| 202 | Accepted (async jobs: POST analyze) |
| 400 | Bad Request (validation, missing required fields) |
| 401 | Unauthorized (missing/invalid JWT) |
| 403 | Forbidden (not owner, insufficient permissions) |
| 404 | Not Found (resource does not exist) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Authentication

### JWT Verification

All endpoints extract `user_id` from JWT claims:

```javascript
// Supported claim names (in order of preference):
const userId = token.sub || token.user_id || token.uid;
```

Verify tokens using your auth provider:
- **Supabase:** `supabase.auth.getUser(token)`
- **Auth0:** `jwt.verify(token, process.env.AUTH0_SECRET)`
- **jsonwebtoken:** `jwt.verify(token, process.env.JWT_SECRET)`

### Example Header

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6OTk5OTk5OTk5OX0.mock
```

---

## Logging

All API endpoints use structured JSON logging via `lib/logging.ts`:

```json
{
  "requestId": "uuid",
  "timestamp": "ISO8601",
  "level": "info|warn|error",
  "endpoint": "/api/...",
  "status": "started|success|error",
  "metadata": { ... }
}
```

Request IDs enable request tracing across logs. Enable JSON log parsing in your monitoring (Datadog, CloudWatch, etc.).

---

## Database Integration TODO

The scaffolded endpoints require these Supabase tables (see `specs/buddy-builder/tasks.md` T1.1):

- `creators` (user_id, display_name, bio, avatar_url, stripe_account_id, RLS policies)
- `tracks` (creator_id, title, audio_url, bpm, key, analysis_status, FTS on title/artist)
- `templates` (creator_id, track_id, template_schema, published, version)
- `remixes` (creator_id, template_id, published, status index)
- `royalties` (template_id, remix_id, status, amount_cents)
- `collaborators` (junction table for template co-producers)

All tables require RLS policies (auth-based filtering).

---

## Testing

Run tests with Vitest:

```bash
pnpm test app/api/__tests__/
```

Test files:
- `app/api/__tests__/creators.test.ts`
- `app/api/__tests__/tracks.test.ts`
- `app/api/__tests__/templates.test.ts`
- `app/api/__tests__/stripe.test.ts`

Mock JWT tokens in tests (see `creators.test.ts` for examples).

---

## File Structure

```
studio/
├── app/
│   └── api/
│       ├── creators/
│       │   ├── route.ts            # POST, GET /
│       │   └── [id]/
│       │       └── route.ts        # GET, PATCH, DELETE /:id
│       ├── tracks/
│       │   ├── route.ts            # POST, GET /
│       │   └── [id]/
│       │       ├── route.ts        # GET, PATCH, DELETE /:id
│       │       └── analyze/
│       │           └── route.ts    # GET /:id/analyze
│       ├── templates/
│       │   ├── route.ts            # POST, GET /
│       │   └── [id]/
│       │       ├── route.ts        # GET, PATCH, DELETE /:id
│       │       ├── publish/
│       │       │   └── route.ts    # POST /:id/publish
│       │       └── versions/
│       │           └── route.ts    # GET /:id/versions
│       ├── remixes/
│       │   └── route.ts            # POST, GET /
│       ├── stripe/
│       │   └── oauth/
│       │       └── route.ts        # GET /oauth/auth|callback|status
│       └── __tests__/
│           ├── creators.test.ts
│           ├── tracks.test.ts
│           ├── templates.test.ts
│           └── stripe.test.ts
├── lib/
│   ├── auth.ts                      # JWT verification + ownership checks
│   └── logging.ts                   # Structured JSON logging
└── API.md                           # This file
```

---

## Next Steps

1. **Database setup** (T1.1) — Create Supabase tables & RLS policies
2. **Complete DB queries** in each endpoint (replace TODO comments)
3. **Integrate Stripe API** — Replace mock account exchange in `/oauth/callback`
4. **Integration tests** — Use real Supabase instance (staging env)
5. **Rate limiting** — Add via middleware (e.g., `express-rate-limit` equivalent)
6. **Request validation** — Expand Zod schemas as needed
7. **Error tracking** — Integrate Sentry or similar
8. **API documentation** — Generate OpenAPI spec from this doc
