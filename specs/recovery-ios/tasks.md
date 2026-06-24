# Recovery iOS — Implementation Tasks

**Total effort:** 60-80 hours (2 weeks, 1 FTE mobile + 1 backend support)

---

## Phase 1: Schema & API Foundation (3 days)

### T1.1: Supabase migrations (database schema)

**Subtasks:**
- [ ] Create `athlete_profiles` table (user_id, team_id, sport, position, DOB)
- [ ] Create `injuries` table (athlete_id, icd10_code, diagnosis, onset_date, severity, location, baseline_pain, baseline_rom, closed_date)
- [ ] Create `rehab_protocols` table (injury_id, provider_id, name, duration_days, exercises JSONB, start/end dates)
- [ ] Create `daily_checkins` table (injury_id, date, pain_scale, rom_percentage, exercises_completed, exercises_total, notes, photo_url, synced)
- [ ] Create `alerts` table (injury_id, alert_type, severity, message, metadata JSONB, coach_notified, coach_response)
- [ ] Create `push_subscriptions` table (user_id, fcm_token, device_info, active)
- [ ] Add RLS policies to all tables

**Acceptance:**
- [ ] All tables exist with proper indexes
- [ ] RLS policies allow read/write by athlete + coach only
- [ ] Constraints prevent invalid states (e.g., pain > 10)

---

### T1.2: Injury & Protocol API

**Subtasks:**
- [ ] POST `/api/injuries` — Create new injury (ICD-10 code, severity, location)
- [ ] GET `/api/injuries/:id` — Fetch injury detail
- [ ] PATCH `/api/injuries/:id` — Update injury (close, reopen, update severity)
- [ ] GET `/api/injuries/:id/protocol` — Fetch assigned protocol
- [ ] GET `/api/athletes/:id/injuries` — List athlete's injuries

**Implementation:**
- ICD-10 code validation (via ICD-10 Codes MCP)
- Create alert on injury close (for provider acknowledgment)
- Protocol includes exercise array with metadata

**Acceptance:**
- [ ] Create injury with ICD-10 code succeeds
- [ ] Fetch protocol returns exercises with sets/reps
- [ ] Close injury marks as closed_at (immutable)

---

### T1.3: Check-in API

**Subtasks:**
- [ ] POST `/api/injuries/:id/checkin` — Submit daily check-in
- [ ] GET `/api/injuries/:id/checkins` — List check-ins (paginated, date range)
- [ ] PATCH `/api/injuries/:id/checkins/:cid` — Edit check-in (if same day)
- [ ] Trigger alert detection on check-in creation

**Implementation:**
- Check-in validation: pain 0-10, ROM 0-100, exercises_completed ≤ exercises_total
- Alert detection: compare vs baseline and previous check-in
- Offline sync: mark synced=false locally, set synced=true after POST success

**Acceptance:**
- [ ] Submit check-in succeeds
- [ ] Alerts generated correctly on pain spike/ROM regression
- [ ] Offline data persists and syncs

---

### T1.4: Notification & Alert API

**Subtasks:**
- [ ] POST `/api/push/subscribe` — Store FCM token
- [ ] GET `/api/alerts` — List athlete's alerts
- [ ] POST `/api/alerts/:id/acknowledge` — Mark alert acknowledged
- [ ] POST `/api/alerts/notify` — Internal endpoint to send FCM notification
- [ ] Webhook: Scheduled job (nightly) to check for re-injury patterns

**Implementation:**
- FCM: integrate Firebase Admin SDK
- Alert types: pain_spike, rom_regression, missed_checkin, low_adherence
- Notification payload: deep link (alert ID) for in-app routing

**Acceptance:**
- [ ] FCM token stored successfully
- [ ] Alerts list returns all unacknowledged + recent
- [ ] Acknowledge marks alert as seen

---

## Phase 2: Mobile App Setup (2 days)

### T2.1: Capacitor project initialization

**Subtasks:**
- [ ] Init Capacitor project (from recovery/ PWA)
- [ ] Configure iOS platform (add Xcode project)
- [ ] Setup Bundle ID (com.rhythmix.recovery)
- [ ] Configure signing (Apple Developer team)
- [ ] Setup icons & splash screens
- [ ] Configure app.json (version, name, permissions)

**Acceptance:**
- [ ] App builds in Xcode without errors
- [ ] Simulator launch successful
- [ ] Home screen app icon appears

---

### T2.2: React Native / Mobile Navigation Setup

**Subtasks:**
- [ ] Setup React Navigation (bottom tab navigator)
- [ ] Create 5 tab screens (Home, Protocol, Injuries, Alerts, Settings)
- [ ] Setup routing (deep linking for notifications)
- [ ] Create root layout component
- [ ] Setup Redux or Context for state management
- [ ] Setup error boundaries

**Acceptance:**
- [ ] Tab navigation works (tap tabs, screens switch)
- [ ] Back button works on all screens
- [ ] Deep link from notification opens correct screen

---

### T2.3: Authentication Integration

**Subtasks:**
- [ ] Integrate Wave 1 Supabase auth (reuse auth.ts)
- [ ] Store JWT in secure storage (AsyncStorage or Keychain)
- [ ] Auto-login if token valid on app launch
- [ ] Logout clears stored token
- [ ] Handle token refresh

**Acceptance:**
- [ ] Sign up / sign in works
- [ ] App restarts with valid auth state
- [ ] Logout clears token

---

## Phase 3: Athlete Onboarding (2 days)

### T3.1: Onboarding UI (5-step form)

**Subtasks:**
- [ ] Step 1: Welcome screen (hero + CTA)
- [ ] Step 2: Athlete profile form (name, DOB, sport, position)
- [ ] Step 3: Injury intake (ICD-10 picker, onset, severity, location)
- [ ] Step 4: Notification permissions (iOS requestUserNotificationPermissions)
- [ ] Step 5: Confirmation + redirect to home
- [ ] Progress indicator + back button on each step

**Implementation:**
- Multi-step state management (useState or Context)
- Form validation before next step
- ICD-10 picker: searchable input, returns code + description
- Notification permission: uses iOS native API

**Acceptance:**
- [ ] All 5 steps render correctly
- [ ] Form validation works
- [ ] Notification permission prompt appears
- [ ] Complete onboarding redirects to home

---

### T3.2: ICD-10 Code Picker Component

**Subtasks:**
- [ ] Create searchable ICD-10 picker
- [ ] Fetch codes via ICD-10 Codes MCP server
- [ ] Autocomplete/filter as user types
- [ ] Display code + description
- [ ] Return selected code on confirm

**Implementation:**
- Use React-select or custom autocomplete
- Debounce API calls (300ms)
- Cache recent selections

**Acceptance:**
- [ ] Search returns matching codes quickly (<200ms)
- [ ] Selected code stored correctly
- [ ] Can override or change selection

---

### T3.3: Profile Creation API Call

**Subtasks:**
- [ ] On completion of onboarding, POST to `/api/athletes` with profile data
- [ ] POST to `/api/injuries` with injury details
- [ ] Store athlete_id + injury_id in local state
- [ ] Assign default protocol (if available) or notify coach

**Acceptance:**
- [ ] Athlete profile created in DB
- [ ] Injury record created
- [ ] Redirect to home with data loaded

---

## Phase 4: Daily Check-in Flow (3 days)

### T4.1: Check-in Prompt & Home Screen

**Subtasks:**
- [ ] Home screen shows: day X of Y, progress bar, last check-in summary
- [ ] Check-in reminder (configurable time, default 8 AM)
- [ ] CTA card: "Check in now" (pulsing if pending)
- [ ] Display alerts if any (bottom sheet)
- [ ] Pull-to-refresh to reload data

**Implementation:**
- Check-in time comparison: if current time ≥ scheduled time and no check-in today, show pending state
- Local notification at scheduled time
- Swipe down to refresh (Pull-to-refresh)

**Acceptance:**
- [ ] Home screen loads and displays data
- [ ] Pull-to-refresh updates data
- [ ] CTA pulses when check-in pending
- [ ] Alerts appear in bottom sheet

---

### T4.2: Check-in Form (pain, ROM, exercises)

**Subtasks:**
- [ ] Pain scale input (0-10 slider with labels)
- [ ] ROM percentage input (0-100 slider)
- [ ] Exercise checklist (today's exercises from protocol)
- [ ] Notes text field (optional)
- [ ] Photo upload (optional, for swelling)
- [ ] Submit button (validates pain + ROM required)
- [ ] Offline support: save locally if no connection

**Implementation:**
- Custom slider components (pain scale with emoji progression)
- Checkbox group for exercises
- Image picker (Photos app integration)
- Offline: save to IndexedDB, queue for sync
- Detect pain spike on submit (compare to baseline)

**Acceptance:**
- [ ] Form renders all fields
- [ ] Submit validates pain + ROM
- [ ] Offline check-in saves locally
- [ ] Pain spike alert triggered if threshold exceeded
- [ ] Form submits <1s when online

---

### T4.3: Check-in Sync & Conflict Resolution

**Subtasks:**
- [ ] Track synced status (pending/synced badge)
- [ ] Automatic sync when connection regained
- [ ] Retry logic (exponential backoff, max 3 retries)
- [ ] Conflict detection: if check-in modified while offline, show warning

**Implementation:**
- Service Worker or React Query for sync
- Retry on 5xx errors (not 4xx client errors)
- Show user sync status in UI

**Acceptance:**
- [ ] Pending check-ins sync when online
- [ ] Synced badge changes to green
- [ ] Conflicts handled gracefully

---

## Phase 5: Protocol & Exercise Tracking (2 days)

### T5.1: Protocol Display & Exercise List

**Subtasks:**
- [ ] Fetch protocol for current injury
- [ ] Display protocol header (name, days remaining, completion %)
- [ ] Collapsible exercise list (expandable per day)
- [ ] Each exercise shows: name, sets, reps, demo photo (if available)
- [ ] Mark exercises complete (checkbox, persist to check-in)

**Implementation:**
- Protocol exercises array: {name, sets, reps, demo_url, notes}
- Exercises collapsible by day
- Tap exercise to expand details

**Acceptance:**
- [ ] Protocol loads and displays
- [ ] Exercises collapsible/expandable
- [ ] Completion checkboxes persist

---

### T5.2: Exercise Demo Video/Photo Viewer

**Subtasks:**
- [ ] Display demo image/video if available
- [ ] Full-screen viewer (pinch zoom for images)
- [ ] Play/pause for videos (iOS native video player)

**Implementation:**
- Image: native Image component
- Video: native Video component (from expo-video or similar)

**Acceptance:**
- [ ] Demo loads from URL
- [ ] Video plays correctly

---

## Phase 6: Alerts & Notifications (3 days)

### T6.1: Alert Detection & Triggering

**Subtasks:**
- [ ] Pain spike detection: if today's pain > baseline + 4, create alert
- [ ] ROM regression: if today's ROM < yesterday - 10%, create alert
- [ ] Missed check-in: if no check-in for 2+ days, create alert
- [ ] Low adherence: if <50% exercises 2 days in row, create alert
- [ ] On alert creation, notify coach (FCM to coach's device)

**Implementation:**
- Alert detection on check-in POST (backend logic in POST /api/injuries/:id/checkin)
- FCM: coach receives notification with alert type + details
- Athlete sees alert in app immediately

**Acceptance:**
- [ ] Pain spike alert created correctly
- [ ] Coach receives FCM notification
- [ ] Athlete sees alert in Alerts tab

---

### T6.2: FCM Setup & Registration

**Subtasks:**
- [ ] Integrate Firebase SDK (iOS)
- [ ] Request user notification permission (iOS prompt)
- [ ] Register FCM token on first launch
- [ ] POST /api/push/subscribe with FCM token
- [ ] Handle token refresh (FCM emits new token)
- [ ] Store token securely (Keychain)

**Implementation:**
- Firebase iOS SDK integration
- APNs certificate setup (Apple Developer)
- Token registration on app launch

**Acceptance:**
- [ ] Firebase initialized successfully
- [ ] FCM token registered
- [ ] Notifications received when app in background

---

### T6.3: Notification Handler & Deep Linking

**Subtasks:**
- [ ] Handle foreground notification (app running)
- [ ] Handle background notification (app in background)
- [ ] Deep link on notification tap: open relevant alert/screen
- [ ] Display notification in app (if alert)
- [ ] Alert history screen

**Implementation:**
- Firebase onMessageReceived() for foreground
- APNs payload deep link: `rhythmix://alert/:id`
- Deep link navigation via React Navigation

**Acceptance:**
- [ ] Notification appears in-app (foreground)
- [ ] Tap notification opens correct screen
- [ ] Background notification wakes app

---

## Phase 7: Injury History & Charts (2 days)

### T7.1: Injury Detail Screen

**Subtasks:**
- [ ] Display injury summary (diagnosis, onset, severity, location)
- [ ] Protocol status (active, completed, closed)
- [ ] Line charts: pain over time, ROM over time
- [ ] Check-in history list (scrollable)
- [ ] Actions: view protocol, export PDF, close injury

**Implementation:**
- Charts: react-native-chart-kit or Skia (native performance)
- Check-in list: FlatList with pagination
- Actions: buttons with modals

**Acceptance:**
- [ ] Charts render data correctly
- [ ] Check-in history scrolls smoothly
- [ ] Action buttons work

---

### T7.2: PDF Export & Sharing

**Subtasks:**
- [ ] Generate PDF report: injury details, protocol, check-in history, charts
- [ ] Include date range selector
- [ ] Save to device or share via email/Messages
- [ ] Compliance summary (% exercises, adherence score)

**Implementation:**
- React-native-pdf-lib or similar for PDF generation
- Share via React Native Share API

**Acceptance:**
- [ ] PDF generates successfully
- [ ] PDF includes all required data
- [ ] Share sheet works

---

## Phase 8: Settings & Notifications Preferences (2 days)

### T8.1: Settings Screen

**Subtasks:**
- [ ] Profile section (edit name, sport, team)
- [ ] Notification settings (quiet hours, reminder time, alert frequency)
- [ ] Privacy settings (profile visibility, share with coach)
- [ ] Biometric unlock (Face ID / Touch ID)
- [ ] About section (version, privacy policy, terms)
- [ ] Sign out button

**Implementation:**
- Time pickers for quiet hours + reminder
- Toggle switches for privacy + biometric
- Link to external privacy/terms pages
- Persist settings to Supabase

**Acceptance:**
- [ ] All settings persist
- [ ] Biometric unlock works (if enabled)
- [ ] Quiet hours prevent notifications

---

### T8.2: Notification Scheduling

**Subtasks:**
- [ ] Schedule local notification at reminder time (e.g., 8 AM)
- [ ] Respect quiet hours (don't notify 10 PM - 7 AM)
- [ ] Update schedule if user changes reminder time

**Implementation:**
- React-native-alarm-manager or react-native-scheduled-notifications
- Store reminder time in local state + Supabase

**Acceptance:**
- [ ] Notification appears at scheduled time
- [ ] Quiet hours observed
- [ ] Time change updates schedule

---

## Phase 9: Offline Support (2 days)

### T9.1: IndexedDB Setup & Data Persistence

**Subtasks:**
- [ ] Create IndexedDB stores: checkins, injuries, protocols, alerts
- [ ] On app launch, load data from IndexedDB
- [ ] On API call, save to local IndexedDB first (optimistic)
- [ ] Sync queue: track pending uploads

**Implementation:**
- React-native can use SQLite (better than IndexedDB on mobile)
- Or Realm (better performance)
- Or AsyncStorage (simpler, but slower)
- Prefer SQLite or Realm

**Acceptance:**
- [ ] App loads offline data on startup
- [ ] Check-in form renders with cached data offline

---

### T9.2: Sync Engine

**Subtasks:**
- [ ] On reconnection, auto-sync pending check-ins
- [ ] Retry failed uploads (exponential backoff)
- [ ] Sync status indicator (pending/synced)
- [ ] Handle conflicts (if data changed on server)

**Implementation:**
- Network status listener (NetInfo)
- Sync queue with retry logic
- Show sync status badge

**Acceptance:**
- [ ] Pending check-ins sync when online
- [ ] Synced badge changes to green
- [ ] Retries work correctly

---

## Phase 10: QA & Polish (2 days)

### T10.1: Testing & Bug Fixes

**Subtasks:**
- [ ] End-to-end testing (sign up → injury → check-in → alert)
- [ ] Device testing (iPhone 12, iPhone SE)
- [ ] iOS 16+ compatibility
- [ ] Offline mode testing
- [ ] Accessibility audit (Voice-over, Dynamic Type)
- [ ] Performance profiling (startup time, memory)
- [ ] Bug fixes from testing

**Acceptance:**
- [ ] All flows work end-to-end
- [ ] App launches <2s
- [ ] Voice-over labels all interactive elements
- [ ] Text resizable via Dynamic Type

---

### T10.2: App Store Submission Prep

**Subtasks:**
- [ ] Create app screenshots (5 for different device sizes)
- [ ] Write app description for App Store
- [ ] Privacy policy (link to website)
- [ ] Terms of service (link to website)
- [ ] TestFlight build for beta testing
- [ ] Fix any App Store review issues
- [ ] Submit for review

**Acceptance:**
- [ ] TestFlight build created
- [ ] All metadata complete
- [ ] Ready for App Store submission

---

## Parallel Work Streams

### Backend (Week 1-2)
- Team member: Backend dev
- Implements all API endpoints (T1-T6)
- Unblocks mobile development

### Mobile (Week 1-2, in parallel)
- Team member: Mobile/React dev
- Builds UI screens + navigation
- Mocked API responses until backend ready

### QA (Week 2, final week)
- Team member: QA engineer
- End-to-end testing, bug fixes
- App Store submission prep

---

## Success Criteria (Week 2 end)

- [ ] Athlete can sign up → enter injury → log check-in
- [ ] Check-in saves offline and syncs online
- [ ] Pain spike alert triggers and notifies coach
- [ ] App launches <2s on iPhone 12+
- [ ] Offline mode works (no data loss)
- [ ] All interactive elements accessible (Voice-over)
- [ ] App Store submission ready
- [ ] Lighthouse accessibility ≥ 95
