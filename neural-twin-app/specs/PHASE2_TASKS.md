# Neural Twin - Phase 2 Task Breakdown

**Format:** Organized by week, platform, and story points  
**Total Points:** ~144 (18 points/week × 8 weeks)  
**Team Size:** 2-3 developers recommended  
**Velocity Baseline:** 18-24 points/week

---

## Week 9: Database & Backend Runtime

### Backend Setup & Database
- [ ] **T9.1** Create `.env` file with ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET (2 pts)
- [ ] **T9.2** Install dependencies & configure Prisma (1 pt)
- [ ] **T9.3** Run Prisma migrations (init schema → PostgreSQL) (2 pts)
- [ ] **T9.4** Seed database with 9 Twin configs, test user, sample data (3 pts)
- [ ] **T9.5** Start backend server locally, verify no errors (1 pt)

### API Testing & Documentation
- [ ] **T9.6** Create Postman collection (all 31 endpoints) (3 pts)
- [ ] **T9.7** Test all voice endpoints (POST, GET, GET/:id) (2 pts)
- [ ] **T9.8** Test all decision endpoints (POST, GET, GET/:id, patterns) (2 pts)
- [ ] **T9.9** Test all Twin endpoints (POST interaction, GET list, GET history) (2 pts)
- [ ] **T9.10** Test coherence endpoints (GET current, GET history) (2 pts)
- [ ] **T9.11** Test accessibility endpoints (scan-book, TTS, settings) (2 pts)

**Subtotal Week 9:** 23 pts

---

## Week 10: Android Backend Integration & Voice

### Android Network & Infrastructure
- [ ] **T10.1** Update ApiClient.kt to use real backend URL (localhost:3000) (1 pt)
- [ ] **T10.2** Add error handling & retry logic (exponential backoff) (3 pts)
- [ ] **T10.3** Add loading states to all API calls (2 pts)
- [ ] **T10.4** Implement JWT token storage (SharedPreferences + encryption) (2 pts)

### Voice Recording Feature
- [ ] **T10.5** Wire VoiceRecordingScreen to real `/api/voice` endpoint (2 pts)
- [ ] **T10.6** Add audio file upload (base64 encoding) (2 pts)
- [ ] **T10.7** Display emotion scores from API response (2 pts)
- [ ] **T10.8** Add emotion icons/colors to emotion display (1 pt)
- [ ] **T10.9** Implement "Save Recording" → stored in DB (1 pt)
- [ ] **T10.10** Test on Android emulator (record, verify emotion scores) (2 pts)
- [ ] **T10.11** Test on physical Android device (2 pts)

**Subtotal Week 10:** 22 pts

---

## Week 11: iOS Backend Integration & Coherence

### iOS Network & Infrastructure
- [ ] **T11.1** Create URLSession wrapper for API calls (3 pts)
- [ ] **T11.2** Add error handling & retry logic (2 pts)
- [ ] **T11.3** Add loading states (2 pts)
- [ ] **T11.4** Implement JWT token storage (Keychain) (2 pts)

### Coherence Feature
- [ ] **T11.5** Wire CoherenceView to real `/api/coherence` endpoint (2 pts)
- [ ] **T11.6** Display 8-layer coherence with real percentages (2 pts)
- [ ] **T11.7** Add coherence history chart (timeline view) (3 pts)
- [ ] **T11.8** Color-code layers (green = coherent, yellow = transitioning, red = stressed) (1 pt)
- [ ] **T11.9** Test on iOS simulator (2 pts)
- [ ] **T11.10** Test on physical iOS device (2 pts)

**Subtotal Week 11:** 21 pts

---

## Week 12: Twin Interactions (Android & iOS)

### Android Twin Chat
- [ ] **T12.1** Build TwinChatScreen UI (list of 9 Twins, chat interface) (3 pts)
- [ ] **T12.2** Implement message input & send button (2 pts)
- [ ] **T12.3** Wire to `/api/twins/interaction` endpoint (POST message) (2 pts)
- [ ] **T12.4** Display Twin response with personality (2 pts)
- [ ] **T12.5** Store conversation history locally (Room DB) (2 pts)
- [ ] **T12.6** Load message history on screen open (1 pt)
- [ ] **T12.7** Add loading state while waiting for Twin response (1 pt)
- [ ] **T12.8** Test all 9 Twin personalities (2 pts)

### iOS Twin Chat
- [ ] **T12.9** Build TwinChatView (same as Android) (3 pts)
- [ ] **T12.10** Wire to API endpoint (2 pts)
- [ ] **T12.11** Store conversation history (Core Data) (2 pts)
- [ ] **T12.12** Test on simulator & device (2 pts)

**Subtotal Week 12:** 24 pts

---

## Week 13: Decision Logging & Authentication

### Android Decision Logging
- [ ] **T13.1** Build DecisionLoggingScreen UI (title, context, strategy inputs) (2 pts)
- [ ] **T13.2** Wire to `/api/decisions` endpoint (POST) (2 pts)
- [ ] **T13.3** Display returned metacognitive score & 4-pillar breakdown (2 pts)
- [ ] **T13.4** Save decision to local DB (Room) (1 pt)
- [ ] **T13.5** Build decision history screen (list view, sortable) (2 pts)
- [ ] **T13.6** Test decision logging flow end-to-end (2 pts)

### Authentication (Android & iOS)
- [ ] **T13.7** Backend: Implement `/api/auth/login` endpoint with JWT generation (3 pts)
- [ ] **T13.8** Backend: Add password hashing (bcrypt) (1 pt)
- [ ] **T13.9** Android: Build LoginScreen (email + password inputs) (2 pts)
- [ ] **T13.10** Android: Implement login API call → store JWT (2 pts)
- [ ] **T13.11** Android: Add auto-login on app restart if token valid (1 pt)
- [ ] **T13.12** iOS: Build LoginView (same as Android) (2 pts)
- [ ] **T13.13** iOS: Implement login → store JWT (Keychain) (2 pts)
- [ ] **T13.14** Test login/logout flow on both platforms (2 pts)

**Subtotal Week 13:** 24 pts

---

## Week 14: Book Scanner & Accessibility

### Book Scanner (Android)
- [ ] **T14.1** Wire BookScannerScreen to real `/api/accessibility/scan-book` endpoint (2 pts)
- [ ] **T14.2** Implement image picker → convert to base64 (2 pts)
- [ ] **T14.3** Display simplified text from API (2 pts)
- [ ] **T14.4** Add reading time & word count display (1 pt)
- [ ] **T14.5** Implement text-to-speech UI (play/pause/speed) (1 pt)
- [ ] **T14.6** Test on Android device with real book pages (2 pts)

### Accessibility Settings (Android & iOS)
- [ ] **T14.7** Implement font size slider (14-32pt) (1 pt)
- [ ] **T14.8** Implement line spacing slider (1.2-2.4) (1 pt)
- [ ] **T14.9** Implement high contrast toggle (1 pt)
- [ ] **T14.10** Implement focus mode (hide distractions) (1 pt)
- [ ] **T14.11** Save accessibility preferences to backend (1 pt)
- [ ] **T14.12** Load preferences on app startup (1 pt)
- [ ] **T14.13** iOS: Build same accessibility UI (2 pts)
- [ ] **T14.14** Test accessibility features on both platforms (2 pts)

**Subtotal Week 14:** 20 pts

---

## Week 15: Polish, Performance & Analytics

### Performance & Bug Fixes
- [ ] **T15.1** Profile app memory usage (both platforms) (2 pts)
- [ ] **T15.2** Optimize API request batching (fewer calls) (2 pts)
- [ ] **T15.3** Add pagination to history screens (20 items per page) (2 pts)
- [ ] **T15.4** Fix any crashes found in testing (3 pts)
- [ ] **T15.5** Implement network error retry logic (already done? verify) (1 pt)

### UI/UX Polish
- [ ] **T15.6** Add loading animations (skeleton screens) (2 pts)
- [ ] **T15.7** Add empty state screens (no data yet) (2 pts)
- [ ] **T15.8** Add onboarding flow (welcome, how to use each feature) (3 pts)
- [ ] **T15.9** Review color scheme, typography, spacing (1 pt)
- [ ] **T15.10** Ensure all buttons/text are readable (accessibility audit) (1 pt)

### Analytics
- [ ] **T15.11** Implement event tracking (voice record, decision log, Twin chat, coherence check) (2 pts)
- [ ] **T15.12** Add API performance monitoring (request/response time) (2 pts)
- [ ] **T15.13** Set up crash reporting (Sentry or similar) (2 pts)
- [ ] **T15.14** Create analytics dashboard (internal) (2 pts)

**Subtotal Week 15:** 25 pts

---

## Week 16: Closed Beta Launch

### Release Builds
- [ ] **T16.1** Build signed Android APK (release variant) (1 pt)
- [ ] **T16.2** Build iOS app for TestFlight (1 pt)
- [ ] **T16.3** Deploy backend to staging (Railway/Render/Vercel) (2 pts)
- [ ] **T16.4** Verify staging backend is live & healthy (1 pt)

### Beta Testing Setup
- [ ] **T16.5** Create privacy policy & terms of service (2 pts)
- [ ] **T16.6** Create beta feedback form (Google Forms or similar) (1 pt)
- [ ] **T16.7** Recruit 10-20 beta testers (coordinate with marketing) (1 pt)
- [ ] **T16.8** Send beta access links & instructions to testers (1 pt)

### Launch & Monitoring
- [ ] **T16.9** Set up crash reporting dashboard (Sentry) (1 pt)
- [ ] **T16.10** Monitor API logs for errors (first 24h intensive) (2 pts)
- [ ] **T16.11** Respond to beta tester feedback & bugs (ongoing) (3 pts)
- [ ] **T16.12** Create post-launch report (metrics, feedback, next steps) (2 pts)

**Subtotal Week 16:** 18 pts

---

## Summary by Week

| Week | Backend | Android | iOS | Other | Total |
|------|---------|---------|-----|-------|-------|
| 9    | 13      | -       | -   | 10    | 23    |
| 10   | -       | 16      | -   | 6     | 22    |
| 11   | -       | -       | 15  | 6     | 21    |
| 12   | -       | 13      | 9   | 2     | 24    |
| 13   | 4       | 9       | 7   | 4     | 24    |
| 14   | -       | 9       | 8   | 3     | 20    |
| 15   | -       | -       | -   | 25    | 25    |
| 16   | 4       | 2       | 2   | 10    | 18    |
| **Total** | **21** | **49** | **41** | **66** | **177** |

---

## Task Dependencies

### Critical Path
1. **T9.1-9.5** (Database setup) → must complete before any backend work
2. **T9.6-9.11** (API testing) → verify before frontend integration
3. **T10.1-10.4** (Android network setup) → prerequisite for T10.5+
4. **T11.1-11.4** (iOS network setup) → prerequisite for T11.5+
5. **T13.7-13.8** (Auth backend) → must complete before T13.9+
6. **T16.1-16.4** (Release builds) → prerequisite for T16.5+

### Parallel Tracks (can run simultaneously)
- Week 10: Android voice (T10.5+)
- Week 11: iOS coherence (T11.5+)
- Week 12: Android & iOS Twin chat (can run in parallel)
- Week 13: Android decision logging + Auth (can run in parallel)
- Week 15: All polish tasks (independent)

---

## Effort Estimation

### By Platform
- **Backend:** 21 pts (~3 days)
- **Android:** 49 pts (~1.5 weeks)
- **iOS:** 41 pts (~1.5 weeks)
- **QA/Ops/Analytics:** 66 pts (~2 weeks)

### Team Allocation
**Option 1: 3 developers**
- Dev 1: Backend (full Week 9) + Android support (Weeks 10-13)
- Dev 2: Android lead (Weeks 10-13) + Auth support
- Dev 3: iOS lead (Weeks 11-14) + QA/Analytics

**Option 2: 2 developers**
- Dev 1: Backend (Week 9) + Android (Weeks 10-14)
- Dev 2: iOS (Weeks 11-14) + Polish/Beta (Weeks 15-16)
- Both: Week 16 launch support

---

## Sprint Planning

### Sprint 1 (Weeks 9-10): Infrastructure & Voice
- Goal: Backend live, Android voice working
- Stories: Database setup, API testing, Android network layer, voice recording
- Definition of Done: Backend runs locally, Android can record voice & get emotion scores

### Sprint 2 (Weeks 11-12): iOS & Twins
- Goal: iOS networking, Twin interactions working
- Stories: iOS network layer, coherence display, Twin chat UI (Android & iOS)
- Definition of Done: iOS can display coherence, both platforms can chat with Twins

### Sprint 3 (Weeks 13-14): Auth & Features
- Goal: Authentication, decision logging, book scanning
- Stories: Login/logout, decision logging UI, book scanner
- Definition of Done: Users can log in, log decisions, scan books

### Sprint 4 (Weeks 15-16): Polish & Launch
- Goal: App ready for beta
- Stories: Performance optimization, analytics, release builds, beta launch
- Definition of Done: Beta users have access, can use all features

---

## Definition of Done

Each task is "done" when:
- [ ] Code written & reviewed
- [ ] Unit tests pass (if applicable)
- [ ] Manual testing on device/emulator completed
- [ ] No new crashes or errors introduced
- [ ] Documented in code comments or PR description
- [ ] Merged to main branch

---

## Risk Tracking

### Week 9 Risks
- Database migration fails → Rollback plan: re-create schema from scratch
- API testing reveals bugs → Extend testing window to Week 10

### Week 10-11 Risks
- Network layer issues → Test with mock data first, then real API
- Audio encoding problems → Use open-source library (e.g., androidmedia-transcoder)

### Week 12-13 Risks
- Claude API quota exceeded → Fall back to mock responses
- JWT token refresh issues → Implement refresh token flow early

### Week 15-16 Risks
- Last-minute crashes found → Have rollback plan ready
- Beta testers can't access app → Have backup distribution method ready

---

## Notes for Team

1. **Pair Programming:** Consider pair programming for complex tasks (T9.2, T13.7, T13.10, T16.3)
2. **Code Review:** All PRs require review before merge
3. **Daily Standup:** 15 min daily sync to unblock issues
4. **Weekly Demo:** Show progress to stakeholders
5. **Bug Tracking:** Use GitHub Issues for bugs found during testing
6. **Documentation:** Update README with setup steps as you go

---

**Created:** 2026-06-25  
**Status:** Ready for sprint planning  
**Next Step:** Assign tasks to team members, update Jira/Linear
