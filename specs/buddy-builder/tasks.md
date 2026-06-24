# Buddy Builder — Implementation Tasks

**Total effort:** 80-100 hours (2 weeks, 1 FTE + parallel QA)

---

## Phase 1: Schema & API Foundation (4 days)

### T1.1: Supabase migrations (database schema)

**Subtasks:**
- [ ] Create `creators` table with indexes on `user_id`, `stripe_account_id`
- [ ] Create `tracks` table with FTS on title/artist
- [ ] Create `templates` table with published index
- [ ] Create `remixes` table with status index
- [ ] Create `royalties` table with status index
- [ ] Create `collaborators` junction table
- [ ] Add RLS policies to all tables (auth-based filtering)
- [ ] Write test migration (insert test data, verify constraints)

**Acceptance:**
- [ ] All tables exist in Supabase
- [ ] RLS policies allow CRUD only by owner + collaborators
- [ ] Constraints prevent invalid states (e.g., published track without audio)

**Dependencies:** Wave 1 `users` table (already exists)

---

### T1.2: Creator CRUD API

**Subtasks:**
- [ ] POST `/api/creators` — Create profile (from signed-in user)
- [ ] GET `/api/creators/:id` — Fetch profile
- [ ] PATCH `/api/creators/:id` — Update profile (auth-gated)
- [ ] GET `/api/creators/:id/stats` — Revenue, templates, followers (real-time)

**Implementation:**
- Use Wave 1 auth context (JWT)
- Return 403 if user not creator or doesn't own profile
- Stats endpoint uses materialized view for performance

**Acceptance:**
- [ ] Create creator succeeds, returns id
- [ ] Get returns full profile
- [ ] Update own profile succeeds, fails if not owner
- [ ] Stats endpoint <100ms response

---

### T1.3: Track CRUD API

**Subtasks:**
- [ ] POST `/api/tracks` — Upload (multipart form: file + metadata)
- [ ] GET `/api/tracks/:id` — Fetch track detail
- [ ] PATCH `/api/tracks/:id` — Update metadata
- [ ] DELETE `/api/tracks/:id` — Soft delete (set published=false, tombstone)
- [ ] GET `/api/tracks/:id/analyze` — Trigger BPM/key/loudness analysis

**Implementation:**
- File upload → S3 with virus scan (ClamAV via Lambda)
- BPM detection: spawn subprocess (ffmpeg + aubio-tools or call Essentia API)
- Metadata stored in Supabase, audio URL in S3
- Track publish date immutable (for analytics)

**Acceptance:**
- [ ] Upload <10 MB file succeeds in <5s
- [ ] BPM detection accurate within ±2 BPM
- [ ] Metadata override persists
- [ ] Soft delete hides from discovery, doesn't remove data

---

### T1.4: Search & Filter Endpoints

**Subtasks:**
- [ ] GET `/api/discover` — List templates (paginated, all fields)
- [ ] GET `/api/discover/search` — Full-text search (title, artist, creator)
- [ ] GET `/api/discover/filters` — Return available genres, BPM ranges, moods
- [ ] POST `/api/discover/trending` — Trending logic (remixes last 7 days)

**Implementation:**
- Pagination: limit 50, cursor-based using `id`
- Search: Postgres FTS or Algolia (prefer FTS first for MVP)
- Cache filter options in Redis (1-hour TTL)
- Trending: COUNT(remixes) per template, weighted by recency

**Acceptance:**
- [ ] Search returns results <200ms
- [ ] Filters endpoint <100ms
- [ ] Pagination cursor works (no duplicates across pages)
- [ ] Trending shows different results than "newest"

---

## Phase 2: Creator Onboarding (3 days)

### T2.1: Sign-up flow (frontend)

**Subtasks:**
- [ ] Multi-step form component (5 pages)
- [ ] Page 1: Email/social auth (reuse Wave 1 components)
- [ ] Page 2: Display name, bio, avatar upload
- [ ] Page 3: Stripe Connect OAuth button
- [ ] Page 4: Summary (review before confirm)
- [ ] Page 5: Confirmation + redirect to studio

**Implementation:**
- useState to track step
- Form data in context or URL state
- Auto-save step data to localStorage on each page
- Stripe Connect redirect → `/creator/stripe-connect-callback`

**Acceptance:**
- [ ] All 5 steps render correctly
- [ ] Back/Next navigation works
- [ ] Form data persists on page refresh (localStorage)
- [ ] Stripe OAuth redirects correctly

---

### T2.2: Stripe Connect integration

**Subtasks:**
- [ ] GET `/api/stripe-connect/auth` — Generate OAuth URL
- [ ] GET `/api/stripe-connect/callback` — Handle OAuth redirect, exchange code for account_id
- [ ] PATCH `/api/creators/:id` — Store `stripe_account_id` in DB
- [ ] GET `/api/stripe-connect/status` — Check onboarding progress (bank verification)

**Implementation:**
- Stripe OAuth scope: `read_write`, `payments`
- Verify account is ready before allowing payouts (connected_account.charges_enabled)
- Webhook for account.updated events (auto-refresh status)

**Acceptance:**
- [ ] OAuth flow completes end-to-end
- [ ] stripe_account_id stored in DB
- [ ] Status endpoint returns current onboarding step
- [ ] Payout button disabled until charges_enabled=true

---

### T2.3: Onboarding UI & flow

**Subtasks:**
- [ ] Progress indicator (step 1/5)
- [ ] Form validation (email format, password strength, required fields)
- [ ] Error handling (display Stripe errors, retry logic)
- [ ] Mobile-responsive layout
- [ ] Loading spinners during async operations

**Acceptance:**
- [ ] Form validates before submit
- [ ] Errors display clearly
- [ ] Mobile layout single-column, touch targets 48px+

---

## Phase 3: Track Upload & Metadata (3 days)

### T3.1: File upload & S3 integration

**Subtasks:**
- [ ] Drag-drop component (accept .mp3, .wav only)
- [ ] File size validation (max 500 MB)
- [ ] Pre-upload scan (detect duplicates by audio fingerprint via Acoustid API)
- [ ] Multipart S3 upload (chunked for large files)
- [ ] Progress indicator (bytes uploaded / total)
- [ ] Post-upload: trigger analysis

**Implementation:**
- Use AWS SDK v3 (browser)
- Presigned POST URL from Lambda
- Virus scan: ClamAV on S3 via Lambda event
- Duplicate detection: Acoustid API (fingerprint hash lookup)

**Acceptance:**
- [ ] Upload <500 MB file works
- [ ] Duplicate detection flags existing file
- [ ] Progress bar updates in real-time
- [ ] S3 file stored with proper ACL (private)

---

### T3.2: Metadata extraction & analysis

**Subtasks:**
- [ ] POST `/api/tracks/:id/analyze` — Trigger analysis
- [ ] BPM detection (ffmpeg + aubio-tools subprocess OR Essentia MCP)
- [ ] Key detection (chromagram analysis)
- [ ] Loudness measurement (LUFS)
- [ ] Duration calculation
- [ ] Return results to frontend

**Implementation:**
- Async job (enqueue in Supabase pg_boss or simple Lambda)
- Frontend polls `/api/tracks/:id` for analysis status
- Cache results in DB (don't re-analyze if already done)
- Fallback: manual override if detection fails

**Acceptance:**
- [ ] BPM detected ±2 BPM accuracy
- [ ] Key detected correctly (test with known samples)
- [ ] Loudness LUFS in realistic range (-20 to -10)
- [ ] Analysis completes within 30s

---

### T3.3: Metadata form & editing

**Subtasks:**
- [ ] Form fields: title, artist, genre (multi-select), mood (multi-select), notes
- [ ] Display detected metadata with override option
- [ ] Save updated metadata
- [ ] Track list UI (table or grid)
- [ ] Actions per track: edit, delete, preview, use in template

**Implementation:**
- Genre & mood dropdowns populated from DB
- Validate required fields before save
- Soft delete (set published=false)

**Acceptance:**
- [ ] All fields editable
- [ ] Override persists after save
- [ ] Track list shows all uploaded tracks

---

## Phase 4: Template Editor & Builder (4 days)

### T4.1: Template CRUD API

**Subtasks:**
- [ ] POST `/api/templates` — Create new template (from track_id)
- [ ] GET `/api/templates/:id` — Fetch template JSON
- [ ] PATCH `/api/templates/:id` — Save template (JSON blob)
- [ ] POST `/api/templates/:id/publish` — Publish (set published=true, version bump)
- [ ] DELETE `/api/templates/:id` — Soft delete
- [ ] GET `/api/templates/:id/versions` — List versions (v1.0, v1.1, etc.)

**Implementation:**
- Template JSON schema: `{canvas_width, canvas_height, elements: [{type, x, y, w, h, text, fill, ...}], timeline: [...]}`
- Auto-generate version on publish (v1.0 → v1.1)
- Immutable published versions (new version on re-publish)

**Acceptance:**
- [ ] Create returns empty template
- [ ] Save/patch persists to DB
- [ ] Publish increments version
- [ ] Versions queryable

---

### T4.2: Editor UI (canvas + panels)

**Subtasks:**
- [ ] 3-panel layout (left: layers, center: canvas, right: inspector)
- [ ] Canvas component (SVG or HTML5, 1920×1080, mouse events)
- [ ] Layer list with drag-reorder
- [ ] Element selection (click on canvas or layer list)
- [ ] Property panel (shows properties for selected element)
- [ ] Timeline at bottom with scrubber
- [ ] Keyboard shortcuts (Delete, Ctrl+Z, Ctrl+D)
- [ ] Auto-save (every 30s, visual indicator)

**Implementation:**
- Canvas: SVG for simplicity (easier to serialize/deserialize)
- Layer tree: Radix UI primitives
- Property panel: conditional rendering per element type
- Undo/redo: store history stack in state

**Acceptance:**
- [ ] Canvas renders elements correctly
- [ ] Drag layer to reorder updates canvas
- [ ] Click element selects it in layer list
- [ ] Properties update canvas in real-time
- [ ] Auto-save indicator visible
- [ ] Ctrl+Z undoes last change

---

### T4.3: Preview & export

**Subtasks:**
- [ ] "Preview" button opens new tab with HyperFrames HTML render
- [ ] Render template as HyperFrames composition (`.json` format)
- [ ] Preview loops infinitely
- [ ] "Download" button exports HyperFrames JSON

**Implementation:**
- Template schema → HyperFrames JSON conversion
- HyperFrames preview URL: `https://app.heygen.com/...` or local render
- JSON download uses `<a href="data:...">` blob URL

**Acceptance:**
- [ ] Preview opens in new tab
- [ ] Preview renders elements + animations
- [ ] Download JSON valid (can be uploaded to HyperFrames)

---

## Phase 5: Marketplace & Discovery (2 days)

### T5.1: Discovery page UI

**Subtasks:**
- [ ] Hero banner + search bar
- [ ] Filter sidebar (genre, BPM range, mood, license)
- [ ] Sort dropdown (trending, newest, price)
- [ ] Template grid (infinite scroll)
- [ ] Template card component (thumbnail, title, price, rating)

**Implementation:**
- Intersection Observer for infinite scroll
- Fetch 50 templates per page
- Filter state in URL params (shareable links)
- Skeleton loaders while fetching

**Acceptance:**
- [ ] Page loads templates <2s
- [ ] Filters update grid correctly
- [ ] Infinite scroll loads more on scroll
- [ ] Filter params persist in URL

---

### T5.2: Search & filtering

**Subtasks:**
- [ ] Full-text search on title/artist/creator
- [ ] Genre filter (checkbox list, multi-select)
- [ ] BPM range filter (slider, 60-180)
- [ ] Mood filter (checkbox list, multi-select)
- [ ] License filter (personal/commercial/exclusive)
- [ ] Sort: trending, newest, price

**Implementation:**
- Search input with debounce (300ms before API call)
- Filters sent as query params
- Trending: aggregate remix count last 7 days

**Acceptance:**
- [ ] Search returns results <200ms
- [ ] All filters work in combination
- [ ] No results message appears if none match

---

## Phase 6: Monetization & Payouts (3 days)

### T6.1: Pricing & royalty setup

**Subtasks:**
- [ ] Template pricing (free or $1-99)
- [ ] License type selector (personal/commercial/exclusive)
- [ ] Royalty split input (creator %, co-producer %)
- [ ] ISRC code display (auto-generated)
- [ ] Save pricing to template

**Implementation:**
- ISRC generation: use ISRC library (npm package)
- Pricing stored in `price_cents` (integer)
- Royalty split: JSONB with creator_id → percentage

**Acceptance:**
- [ ] Can set price $0-99
- [ ] Royalty split sums to 100%
- [ ] ISRC auto-generated on first save
- [ ] Pricing persists

---

### T6.2: Royalty tracking & payouts

**Subtasks:**
- [ ] On remix publish: create royalty record
- [ ] Earnings dashboard shows balance (sum of pending + processed royalties)
- [ ] Breakdown by template (top earners)
- [ ] Revenue chart (daily/weekly/monthly)
- [ ] Payout history (table with status)
- [ ] Manual withdraw button (min $10)

**Implementation:**
- Royalty row created on remix publish with status='pending'
- Nightly job: aggregate daily royalties, mark 'processed'
- Balance calculated real-time from DB
- Withdraw: call Stripe Create Payout API (connect account)

**Acceptance:**
- [ ] Balance updates on remix publish
- [ ] Chart data accurate
- [ ] Payout button only active if balance ≥ $10
- [ ] Payout request succeeds

---

### T6.3: Stripe Connect payouts

**Subtasks:**
- [ ] POST `/api/withdraw` — Request payout
- [ ] Validate minimum amount ($10)
- [ ] Call Stripe Create Payout API with connected account
- [ ] Mark royalties as 'paid' after payout completes
- [ ] Webhook: Stripe payout.completed → update status

**Implementation:**
- Payout method: bank transfer (default Stripe Connect behavior)
- Payout timing: 2-5 business days
- Error handling: retry failed payouts

**Acceptance:**
- [ ] Withdraw request succeeds
- [ ] Royalties marked 'paid' after payout
- [ ] Payout history shows completed payment

---

## Phase 7: Collaboration & Co-Producers (2 days)

### T7.1: Collaboration API

**Subtasks:**
- [ ] POST `/api/templates/:id/collaborators` — Invite co-producer (generate shareable link)
- [ ] GET `/api/templates/:id/collaborators` — List collaborators
- [ ] DELETE `/api/templates/:id/collaborators/:cid` — Remove collaborator
- [ ] PATCH `/api/templates/:id/collaborators/:cid` — Update split %

**Implementation:**
- Invite link: `https://.../?invite_token=...`
- Token valid for 7 days
- Co-producer accepts by clicking link (auto-adds if signed in)
- Royalty split updated on accept

**Acceptance:**
- [ ] Invite link generates
- [ ] Collaborator accepts and is added
- [ ] Split percentage updates

---

### T7.2: Collaboration UI

**Subtasks:**
- [ ] Collaborators panel in template editor
- [ ] Invite button (opens modal with email/link)
- [ ] List of collaborators with split %
- [ ] Remove button (only creator can remove)
- [ ] Template card shows co-producer names

**Acceptance:**
- [ ] Invite modal works
- [ ] Co-producer names display on template
- [ ] Remove succeeds

---

## Phase 8: QA & Polish (2 days)

### T8.1: Testing & bug fixes

**Subtasks:**
- [ ] Manual testing all flows (create template, upload track, search, payout)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance profiling (Lighthouse, WebVitals)
- [ ] Load testing (100 concurrent users on discovery page)
- [ ] Bug fixes from testing

**Acceptance:**
- [ ] All critical flows verified
- [ ] Mobile layout correct
- [ ] Lighthouse score ≥ 90
- [ ] <200ms search latency (p99)
- [ ] No console errors

---

### T8.2: Documentation & onboarding

**Subtasks:**
- [ ] Creator onboarding guide (5-page walkthrough)
- [ ] Template editor tutorial (video or GIF)
- [ ] FAQ page (common questions)
- [ ] API documentation (OpenAPI spec)
- [ ] Deployment guide (CI/CD, env vars)

**Acceptance:**
- [ ] All user flows documented
- [ ] Deployment runbook complete

---

## Parallel Work Streams

These can run concurrently with main phases:

### Database & Migrations (Week 1, Monday-Tuesday)
- Team member: Devops engineer or senior backend dev
- Creates all Supabase tables, RLS policies
- Unblocks API development immediately

### API Development (Week 1-2, in parallel with UI)
- Team member: Backend dev
- Implements all endpoints (T1-T6)
- Can be tested with Postman before UI is ready

### Frontend UI (Week 1-2, in parallel with API)
- Team member: Frontend dev
- Builds components, pages, flows
- Mocked API responses until real API ready

### Stripe Integration (Week 1.5-2, after T2.2)
- Team member: Anyone familiar with Stripe
- Integrates Stripe Connect, payouts

---

## Success Criteria (Week 2 end)

- [ ] Creator can sign up → upload track → create template → monetize
- [ ] Template discoverable in marketplace
- [ ] Payout button works end-to-end (test with Stripe test account)
- [ ] Mobile layout tested on real device
- [ ] Lighthouse accessibility ≥ 95
- [ ] All critical bugs fixed
- [ ] Documentation complete
