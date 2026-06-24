# Recovery iOS — Athlete Rehab Tracking Requirements

**Project ID:** recovery-ios  
**Phase:** Wave 2, Week 6-7 (MVP launch)  
**Status:** Specification phase

---

## Vision

Enable injured athletes to self-manage recovery with coach oversight. Daily check-ins track pain, range of motion, and exercise compliance. Alerts notify coaches of regression or non-compliance. Built as native iOS app (Capacitor wrapper) to feel native while sharing backend with Wave 1 products.

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Athletes registered | 200+ | Week 12 |
| Daily active athletes | 50+ | Week 12 |
| Protocol adherence (exercises completed ≥80%) | 60%+ | Week 14 |
| Coach alert response time | <30 min | Ongoing |
| App Store rating | 4.5+ | Week 14 |

---

## Functional Requirements

### R1: Athlete Onboarding

**Description:** Athletes sign up, enter injury details, join a team (optional), and receive rehab protocol.

**Acceptance Criteria:**
- [ ] Email or social auth (Apple, Google)
- [ ] Profile: first name, last name, date of birth, sport, position
- [ ] Injury intake form: select ICD-10 diagnosis code (searchable picker)
- [ ] Injury details: onset date, severity scale (1-5), location (body part), mechanism
- [ ] Team join: optional (coach provides invite link)
- [ ] Notification permissions: request iOS push & SMS
- [ ] Re-injury check: alert if joining with ongoing injury

**Dependencies:** Wave 1 Supabase auth, ICD-10 Codes MCP server

**Out of scope:** Team creation (coaches create teams in dashboard) — handled separately

---

### R2: Rehab Protocol Assignment

**Description:** After injury intake, athlete receives a personalized rehab protocol from their provider (coach/PT).

**Acceptance Criteria:**
- [ ] Protocol includes: exercise list (name, sets, reps, photo/video demo), duration estimate (days), frequency (daily/3×/week)
- [ ] Protocol visible in app with progress indicator (Day 1 of 21)
- [ ] Exercises marked complete/incomplete per day
- [ ] Optional rest days or reduced volume days
- [ ] Protocol can be modified by provider (athlete notified)

**Dependencies:** Coach dashboard (separate product) or manual protocol creation in admin

**Out of scope:** AI-generated protocols — use templates for MVP

---

### R3: Daily Check-in & Pain/ROM Tracking

**Description:** Each day, athlete logs pain level, range of motion, exercise compliance, and notes.

**Acceptance Criteria:**
- [ ] Check-in prompt: appears at scheduled time (e.g., 8 AM daily)
- [ ] Pain scale: 0-10 slider (visual feedback: green/yellow/red)
- [ ] Range of motion: % (0-100) — compare to baseline
- [ ] Exercises logged: checkboxes for each exercise that day
- [ ] Notes: optional text field (soreness, limitations, questions)
- [ ] Photo upload: optional (document visible swelling, etc.)
- [ ] Offline mode: save locally (IndexedDB), sync when online
- [ ] Timestamp on all data (for provider review)

**Dependencies:** Wave 1 Supabase, IndexedDB for offline

**Out of scope:** Video submission of exercises — just checkboxes for MVP

---

### R4: Re-Injury Alert System

**Description:** Detect signs of re-injury or setback; alert coach and athlete immediately.

**Acceptance Criteria:**
- [ ] Alert triggers:
  - Pain spike: today's pain > baseline by ≥4 points
  - ROM regression: today's ROM < yesterday by ≥10%
  - Missed check-in: no check-in for 2+ days
  - Exercises missed: <50% exercises completed 2 days in a row
- [ ] Alert delivered: in-app notification + SMS to coach
- [ ] Alert details: injury ID, alert type, metric, timestamp
- [ ] Athlete sees alert: in-app banner + notification history
- [ ] Coach actions: can dismiss alert or mark for follow-up

**Dependencies:** Firebase Cloud Messaging (FCM) or Twilio SMS for push

**Out of scope:** ML-based anomaly detection — rule-based thresholds for MVP

---

### R5: Coach Dashboard

**Description:** Coaches view their team, monitor progress, and respond to alerts.

**Acceptance Criteria:**
- [ ] Team view: list of athletes, filter by status (active, completed, re-injured)
- [ ] Athlete detail: full injury history, daily check-ins, compliance %, last alert
- [ ] Alerts feed: incoming alerts with athlete name, type, timestamp
- [ ] Respond to alert: acknowledge, schedule follow-up call, adjust protocol
- [ ] Export: PDF report of athlete progress (for records)
- [ ] Bulk actions: send message to team, adjust protocol for multiple athletes

**Dependencies:** Web dashboard (separate from mobile app)

**Out of scope:** Video calls with athletes — schedule via external tool

---

### R6: Offline Capability

**Description:** App works offline (no internet). Data syncs automatically when online.

**Acceptance Criteria:**
- [ ] All screens (view profile, check-in, view protocol) load offline
- [ ] Check-in data saved locally (IndexedDB)
- [ ] Sync queue: on reconnect, upload pending check-ins
- [ ] Conflict resolution: if protocol changed while offline, alert athlete
- [ ] Offline indicator: shows sync status (green = synced, yellow = pending)

**Dependencies:** Service Worker (already in recovery/ PWA), IndexedDB

**Out of scope:** Binary sync (for large files) — text only for MVP

---

### R7: Push Notifications & Alerts

**Description:** Timely notifications for check-in reminders, alerts, protocol updates, and coach messages.

**Acceptance Criteria:**
- [ ] Check-in reminder: daily at user-configured time (default 8 AM)
- [ ] Alert notification: "Pain spike detected. Check in with coach."
- [ ] Coach message: "Coach has reviewed your progress. Protocol adjusted."
- [ ] Protocol update: "New protocol available. Review and acknowledge."
- [ ] Deep link: tap notification → relevant screen in app (injury detail, alert history)
- [ ] Do-not-disturb: athlete can set quiet hours (e.g., 10 PM - 7 AM)

**Dependencies:** Firebase Cloud Messaging (FCM) + Apple Push Notification service (APNs)

**Out of scope:** Rich media notifications (images) — text only for MVP

---

### R8: Reporting & Export

**Description:** Generate reports for medical records and provider handoff.

**Acceptance Criteria:**
- [ ] PDF report: injury details, protocol, daily check-ins (configurable date range)
- [ ] Format: printable (white background), includes charts (pain over time, ROM progress)
- [ ] Share: email to provider or download
- [ ] Compliance summary: % exercises completed, adherence score

**Dependencies:** PDFKit (Node) or client-side library (pdfmake)

**Out of scope:** Video transcript (athletes doing exercises) — future phase

---

## Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| App startup (launch to home) | <2s |
| Check-in submission | <1s |
| Offline sync completion (100 check-ins) | <5s |
| iOS App Store file size | <50 MB |

### Reliability

| Metric | Target |
|--------|--------|
| Uptime (backend API) | 99.95% |
| Offline data loss (0 crashes) | 100% zero-loss |
| Notification delivery | 99%+ (FCM + APNs queue) |

### Security

- [ ] All endpoints behind JWT auth (Wave 1)
- [ ] Data encrypted at rest (Supabase encryption)
- [ ] HIPAA-like measures: athlete data not shared without consent
- [ ] Biometric unlock optional (Face ID / Touch ID)
- [ ] Session timeout: 15 min inactivity

### Accessibility

- [ ] WCAG 2.1 Level AA (text contrast, keyboard nav)
- [ ] Voice-over support (iOS accessibility)
- [ ] Color-blind friendly (pain scale doesn't rely on red=bad alone)

---

## Data Model

### Core Entities

**Athlete Profile**
- id (UUID)
- user_id (FK → users)
- team_id (FK → teams, optional)
- display_name, date_of_birth
- sport, position
- created_at

**Injury**
- id (UUID)
- athlete_id (FK)
- icd10_code (varchar, indexed)
- diagnosis, onset_date
- severity (1-5 scale)
- location (body part)
- closed_date (NULL if ongoing)
- baseline_pain, baseline_rom (reference points)
- created_at

**Rehab Protocol**
- id (UUID)
- injury_id (FK)
- provider_id (FK → users, coach/PT)
- name, estimated_duration_days
- exercises (JSONB array: [{name, sets, reps, demo_url, notes}])
- start_date, end_date (NULL if ongoing)
- created_at

**Daily Check-in**
- id (UUID)
- injury_id (FK)
- date (DATE)
- pain_scale (0-10 int)
- rom_percentage (0-100 int)
- exercises_completed (int)
- exercises_total (int)
- notes (text)
- photo_url (S3, optional)
- synced (boolean, for offline tracking)
- created_at

**Alert**
- id (UUID)
- injury_id (FK)
- alert_type (enum: pain_spike, rom_regression, missed_checkin, low_adherence)
- severity (enum: info, warning, critical)
- message, metadata (JSONB)
- coach_notified (boolean)
- coach_response (text, optional)
- created_at, acknowledged_at

**Push Subscription** (for FCM tokens)
- id (UUID)
- user_id (FK)
- fcm_token (Stripe-like token storage)
- device_info (iOS version, device model)
- active (boolean)
- created_at

---

## API Surface

### Authentication
```
POST /api/auth/signup                -- Email/social sign-up (mobile)
POST /api/auth/signin                -- Sign in
POST /api/auth/logout                -- Sign out
```

### Athlete Management
```
POST /api/athletes                   -- Register as athlete
GET /api/athletes/:id                -- Get athlete profile
PATCH /api/athletes/:id              -- Update profile
GET /api/athletes/:id/injuries       -- List injuries
```

### Injuries & Intake
```
POST /api/injuries                   -- Record new injury (intake)
GET /api/injuries/:id                -- Get injury detail
PATCH /api/injuries/:id              -- Update injury (close, reopen)
GET /api/injuries/:id/protocol       -- Get assigned protocol
```

### Daily Check-ins
```
POST /api/injuries/:id/checkin       -- Submit daily check-in
GET /api/injuries/:id/checkins       -- List check-ins (date range)
PATCH /api/injuries/:id/checkins/:cid -- Edit check-in (if allowed)
DELETE /api/injuries/:id/checkins/:cid -- Delete (soft delete)
```

### Alerts
```
GET /api/injuries/:id/alerts         -- Get alerts for this injury
POST /api/alerts/:id/acknowledge     -- Mark alert acknowledged
GET /api/alerts/history              -- Alert history (paginated)
```

### Notifications
```
POST /api/push/subscribe             -- Register FCM token
POST /api/push/unsubscribe           -- Deregister FCM token
GET /api/push/preferences            -- Get notification settings
PATCH /api/push/preferences          -- Update quiet hours, frequency
```

### Reports
```
POST /api/export/pdf                 -- Generate PDF report
GET /api/export/pdf/:id              -- Download generated PDF
```

### Coach Integration (Web Dashboard)
```
GET /api/coach/teams/:id             -- Get team & athletes
GET /api/coach/alerts                -- Get team alerts
POST /api/coach/alerts/:id/respond   -- Coach responds to alert
```

---

## Success Criteria (Wave 2 End)

- [ ] iOS app builds and runs on physical device (via Xcode)
- [ ] Athlete can sign up → enter injury → receive protocol → log check-in
- [ ] Check-in saves offline and syncs when online
- [ ] Pain spike alert triggers correctly and notifies coach
- [ ] PDF export generates valid report
- [ ] App Store submission ready (privacy policy, screenshots, etc.)
- [ ] Lighthouse accessibility ≥ 95
- [ ] <2s startup time on iPhone 12+
