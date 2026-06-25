# Neural Twin - Phase 2 Specification

**Status:** Draft  
**Timeline:** Weeks 9-16 (8 weeks)  
**Release Target:** Beta with real backend + core features  
**Priority:** Get database live, wire end-to-end, launch closed beta

---

## Phase 2 Overview

Phase 1 delivered complete architecture: all backend routes, API endpoints, Android/iOS UI screens, and data models. Phase 2 focuses on **making the app live and functional** with real data, real API calls, and real user workflows.

### Phase 2 Goals
- ✅ Database live (Postgres + Prisma migrations)
- ✅ Backend running locally & in staging
- ✅ Android & iOS connected to live backend
- ✅ Authentication working (JWT + login screen)
- ✅ Core workflows end-to-end (voice → Twin interaction → coherence visualization)
- ✅ Closed beta with 10-20 early users
- ✅ Analytics & error tracking

---

## Feature Scope Decisions

### What's REAL (Built) vs. MOCKED (Stubbed) in Phase 2

#### 1. Voice Recording & Emotion Detection
**Decision: REAL with Claude API**
- Status: Build real emotion detection via Claude Vision + audio analysis
- Timeline: Week 9-10
- Implementation:
  - Audio upload → base64 encoding
  - Claude API for emotion classification (happy, sad, angry, neutral, surprised, fearful, disgusted)
  - Acoustic feature extraction (pitch, speech rate, formants)
  - Store in PostgreSQL
- Testing: Record test voices, verify emotion scores match expected ranges
- Fallback: Use mock emotion data for demo if API quota hit

#### 2. Decision Logging & Metacognitive Scoring
**Decision: REAL with Claude API**
- Status: Build real scoring via Claude API analysis
- Timeline: Week 10-11
- Implementation:
  - User logs decision with title, context, strategy
  - Claude API analyzes for metacognitive insights (4 pillars: planning, monitoring, evaluating, reflecting)
  - Calculate weighted scores (each 25%)
  - Store decision + metrics in PostgreSQL
- Testing: Log 20+ test decisions, verify metacognitive scores improve with better inputs
- Fallback: Use hardcoded scoring formula if Claude quota hit

#### 3. 9 Specialist Twins (AI Companions)
**Decision: REAL with Claude API + personality system**
- Status: Build real Twin interactions
- Timeline: Week 11-12
- Implementation:
  - Each Twin has system prompt (Task, Coach, Growth, Health, Relationship, Financial, Creative, Research, Metacognition)
  - User chat with Twin → Claude API responds with Twin-specific personality
  - Store conversation history in PostgreSQL
  - Support follow-up messages within same session
- Testing: Chat with each Twin, verify personality consistency
- Fallback: Use pre-written Twin responses if API quota hit

#### 4. 8-Layer Coherence Visualization
**Decision: REAL with biometric data integration**
- Status: Build real coherence scoring + visualization
- Timeline: Week 12-13
- Implementation:
  - Layers 1-7 (physical): Accept mock data from UI sliders or integrate Apple Health/Google Fit
  - Layer 8 (metacognitive): Calculate from decision history + voice emotions
  - Real-time calculation of weighted coherence (87.5% physical, 12.5% metacognitive)
  - Visualize as carousel, ring chart, or timeline
- Testing: Log biometric data, verify coherence scores update
- Fallback: Use mock biometric data in Phase 2, plan real integration for Phase 3

#### 5. Text-to-Speech (TTS) for Book Scanning
**Decision: MOCKED initially, ElevenLabs real in Phase 2.5**
- Status: Phase 2 stub with Play button, Phase 2.5 real TTS
- Timeline: Week 13 (stub), Week 15-16 (ElevenLabs integration)
- Implementation (Phase 2):
  - Book scanner returns simplified text
  - UI shows TTS play/pause/speed controls
  - Play button is wired but no audio output yet
- Implementation (Phase 2.5):
  - Integrate ElevenLabs API for real voice synthesis
  - Support speed control (0.5x to 2.0x)
  - Cache generated audio
- Testing: Verify UI works, placeholder audio works
- Reason for delay: ElevenLabs costs $$ per minute; defer until user base confirms feature value

#### 6. Accessibility Features (Dyslexia/ADHD)
**Decision: REAL with Claude Vision OCR**
- Status: Build real book scanning + text simplification
- Timeline: Week 9-10 (overlaps with voice)
- Implementation:
  - User uploads book page image
  - Claude Vision API extracts text (OCR)
  - Claude API simplifies text (70% of original, dyslexia-friendly)
  - Section breaking for ADHD readers
  - Reading time estimation
  - UI controls: font size, line spacing, high contrast, focus mode
- Testing: Scan 10 different book pages, verify text extraction & simplification
- Fallback: Use mock simplified text if Claude quota hit

#### 7. Authentication & User Management
**Decision: REAL with JWT + Google/Apple OAuth (Phase 2.5)**
- Status: Phase 2 JWT only, Phase 2.5 OAuth
- Timeline: Week 13-14 (JWT), Week 15-16 (OAuth)
- Implementation (Phase 2):
  - Login screen with email/password
  - Backend creates JWT token on login
  - Android/iOS store JWT in secure storage
  - All API calls include Bearer token
  - Logout clears token
- Implementation (Phase 2.5):
  - Google OAuth on Android
  - Apple Sign-In on iOS
  - Federated login
- Testing: Login/logout flow, verify JWT in requests, test token expiration
- Reason for phasing: OAuth setup requires app store verification; defer until app is live

#### 8. Biometric Integration
**Decision: MOCKED in Phase 2, real in Phase 3**
- Status: UI sliders for manual biometric input
- Timeline: Phase 3 (after Phase 2 launch)
- Phase 2 Implementation:
  - CoherenceScreen shows sliders for heart rate, HRV, sleep, activity
  - User manually enters values to test UI
  - Stored in PostgreSQL for trend analysis
- Phase 3 Plan:
  - Apple Health integration (iOS)
  - Google Fit integration (Android)
  - Real-time data sync
- Reason: Requires native platform APIs; Phase 2 focuses on core Twin functionality

---

## Technical Implementation Plan

### Week 9: Database & Backend Runtime

**Tasks:**
1. Create `.env` file with:
   - ANTHROPIC_API_KEY (provided)
   - DATABASE_URL (Neon connection string)
   - JWT_SECRET (generate secure key)
   - CORS_ORIGIN (localhost + staging)
   - NODE_ENV=development

2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Seed database with:
   - 9 Twin configurations
   - User test account
   - Sample decisions & voice recordings

4. Test all 31 API endpoints locally:
   ```bash
   npm run dev
   ```

5. Create Postman collection for API testing

**Deliverable:** Backend running locally, database seeded, all endpoints tested

---

### Week 10: Android Backend Integration

**Tasks:**
1. Update `ApiClient.kt` to use real backend URL (localhost:3000 for dev)
2. Wire BookScannerScreen to real `/api/accessibility/scan-book` endpoint
3. Wire VoiceRecordingScreen to real `/api/voice` endpoint
4. Implement error handling & retry logic
5. Add loading states & error UI
6. Test on emulator & physical device

**Deliverable:** Android can upload voice recording, get emotion scores, scan books with OCR

---

### Week 11: iOS Backend Integration

**Tasks:**
1. Create iOS network layer (URLSession wrapper)
2. Wire VoiceRecordingView to real `/api/voice` endpoint
3. Wire MetacognitionView to real `/api/coherence` endpoint
4. Implement error handling & retry logic
5. Add loading states
6. Test on simulator & physical device

**Deliverable:** iOS can upload voice, retrieve coherence data, display real metrics

---

### Week 12: Twin Interactions

**Tasks:**
1. Backend: Ensure TwinInteraction endpoints handle multi-turn conversations
2. Android: Build TwinChatScreen
   - List of 9 Twins
   - Chat interface (input + message history)
   - Send message → API call → display response
3. iOS: Build TwinChatView
   - Same as Android
4. Test: Chat with each Twin, verify personality consistency

**Deliverable:** Full Twin interaction workflow on both platforms

---

### Week 13: Decision Logging & Metacognition

**Tasks:**
1. Android: Build DecisionLoggingScreen
   - Title, context, strategy inputs
   - Submit → API stores decision + calculates metacognitive score
   - Display 4-pillar breakdown
2. iOS: Build DecisionLoggingView
   - Same as Android
3. Backend: Ensure decision scoring works with real Claude API calls
4. Test: Log 20+ decisions, verify scores are reasonable

**Deliverable:** Full decision logging workflow, metacognitive scores calculated

---

### Week 14: Authentication

**Tasks:**
1. Backend: Implement login route (email/password)
   - Hash password with bcrypt
   - Generate JWT on successful login
   - Return token + user data
2. Android: Build LoginScreen
   - Email + password inputs
   - Submit → API login → store JWT
   - Auto-login on app restart if token valid
3. iOS: Build LoginView
   - Same as Android
4. Test: Login/logout, verify token in requests, test token expiration (set to 24h)

**Deliverable:** Authentication working, users can log in/out

---

### Week 15: Polish & Bug Fixes

**Tasks:**
1. Performance optimization
   - Profile app memory usage
   - Optimize API request batching
   - Add pagination to history screens
2. Error handling
   - Graceful API failure handling
   - Retry logic with exponential backoff
   - User-friendly error messages
3. UI/UX polish
   - Loading animations
   - Empty states
   - Onboarding flow
4. Analytics
   - Track key events (voice record, decision log, Twin chat)
   - Track API performance metrics

**Deliverable:** App feels polished, no crashes, analytics running

---

### Week 16: Closed Beta Launch

**Tasks:**
1. Backend deployment to staging (Railway, Render, or similar)
2. Build release versions:
   - Android: Build signed APK for beta testing
   - iOS: Build for TestFlight
3. Create privacy policy & terms of service
4. Recruit 10-20 beta testers
5. Set up crash reporting (Sentry or similar)
6. Create feedback form
7. Launch closed beta
8. Monitor metrics & user feedback

**Deliverable:** App live with beta users, collecting feedback & usage data

---

## Data Model Refinements

### New Fields for Phase 2

**User Model:**
```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  passwordHash String
  name String?
  avatar String? // URL to profile pic
  
  // Authentication
  jwtSecret String @unique // For token validation
  lastLogin DateTime?
  
  // Privacy
  privacyMode Boolean @default(false)
  shareMetricsPublicly Boolean @default(false)
  
  // Onboarding
  onboardingCompleted Boolean @default(false)
  preferredTwins TwinType[] @default([COACH, GROWTH])
  
  // Relationships
  voices VoiceRecording[]
  decisions Decision[]
  twins TwinInteraction[]
  biometrics BiometricData[]
  coherence CoherenceMetric[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**VoiceRecording Model (updated):**
```prisma
model VoiceRecording {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  
  audioUrl String // S3 or CDN URL
  audioBase64 String? // Store first 30 seconds only
  
  // Emotion detection
  primaryEmotion String // happy, sad, angry, neutral, surprised, fearful, disgusted
  emotionScores EmotionScore[] // All 7 emotions with confidence
  
  // Acoustic features
  pitchHz Float?
  speechRate Float?
  jitterPercent Float?
  formant1Hz Float?
  formant2Hz Float?
  mfccMean Float[]? // 13 MFCC coefficients
  prosodyScore Float?
  
  // Context
  context String? // What was the decision about?
  location String?
  
  // Transcription (for future speech-to-text)
  transcription String?
  
  createdAt DateTime @default(now())
}
```

**Decision Model (updated):**
```prisma
model Decision {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  
  title String
  description String?
  category String // personal, professional, health, financial, relationship, creative, research, growth
  
  // Metacognitive input
  planningClarity Int @default(5) // 1-10
  strategyChosen String?
  monitoringComprehension Int @default(5) // 1-10
  evaluationEffectiveness Int @default(5) // 1-10
  reflectionInsights String?
  
  // Scores
  metacognitiveScore Float @default(0.5) // 0-1, calculated
  planningScore Float?
  monitoringScore Float?
  evaluatingScore Float?
  reflectingScore Float?
  
  // Outcome tracking (Phase 2.5)
  outcome String? // Pending, Positive, Negative, Mixed
  outcomeDate DateTime?
  lessonsLearned String?
  
  // Related data
  voiceRecording VoiceRecording? // Decision discussed in voice recording
  twinInteraction TwinInteraction? // Twin helped with this decision
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## API Endpoint Summary

### Phase 2 New Endpoints

```
POST   /api/auth/login              - Login with email/password
POST   /api/auth/logout             - Logout (invalidate token)
POST   /api/auth/register           - Register new user (Phase 2.5)
GET    /api/auth/profile            - Get current user profile
PUT    /api/auth/profile            - Update profile
POST   /api/auth/password-reset     - Password reset (Phase 2.5)

POST   /api/voice                   - Upload voice recording (REAL)
GET    /api/voice                   - Get voice history (paginated)
GET    /api/voice/:id               - Get specific recording with emotion scores (REAL)
DELETE /api/voice/:id               - Delete recording

POST   /api/decisions               - Log decision (REAL)
GET    /api/decisions               - Get decisions (paginated, filterable)
GET    /api/decisions/:id           - Get decision with analysis (REAL)
PUT    /api/decisions/:id           - Update decision
DELETE /api/decisions/:id           - Delete decision
GET    /api/decisions/patterns      - Get decision patterns (REAL)

POST   /api/twins/interaction       - Chat with Twin (REAL)
GET    /api/twins                   - List all 9 Twins with interaction counts
GET    /api/twins/:type/history     - Get Twin conversation history

GET    /api/coherence               - Get current 8-layer coherence (REAL)
GET    /api/coherence/history       - Get coherence progression (REAL)
POST   /api/coherence/manual        - Manually log biometric data

POST   /api/accessibility/scan-book - Scan book image, extract text (REAL)
GET    /api/accessibility/settings  - Get accessibility preferences
PUT    /api/accessibility/settings  - Update preferences

POST   /api/analytics/event         - Track user event (internal)
GET    /api/analytics/dashboard     - Get user analytics (Phase 2.5)
```

---

## Testing Strategy

### Unit Tests (Week 14-15)
- Backend route tests (Jest + supertest)
- Metacognitive scoring calculation
- JWT token validation
- Password hashing

### Integration Tests (Week 15)
- End-to-end voice upload → emotion detection → stored
- End-to-end decision log → Twin consultation → coherence update
- Authentication flow (login → token → API call → logout)

### Manual Testing (Week 15-16)
- Android on real device
- iOS on real device
- Test with unreliable network (throttle, disconnect)
- Test with mock API failures

### Beta Testing (Week 16)
- 10-20 users testing real workflows
- Collect feedback via form
- Monitor error logs & performance metrics

---

## Deployment Plan

### Development (Weeks 9-14)
- Backend: localhost:3000
- Database: Local Postgres or Neon dev branch
- Android: Emulator + physical device
- iOS: Simulator + physical device

### Staging (Week 15)
- Backend: Deploy to Railway/Render/Vercel
- Database: Neon production database
- Android: Internal test track
- iOS: TestFlight

### Closed Beta (Week 16)
- Same as staging
- 10-20 beta testers get access
- Collect feedback

### Phase 3 (Weeks 17+)
- Open beta → app store submission
- App Store (iOS) + Google Play (Android)

---

## Risk Mitigation

### Risk: Claude API Quota Exhaustion
**Mitigation:**
- Implement request caching (Redis)
- Set rate limits per user
- Fall back to mock data for demo if quota hit
- Monitor API usage daily

### Risk: Database Performance
**Mitigation:**
- Add indexes on common queries (userId, createdAt)
- Implement pagination (default 20 records)
- Archive old data after 6 months
- Monitor query performance with Prisma Studio

### Risk: Mobile App Crashes
**Mitigation:**
- Implement crash reporting (Sentry)
- Graceful error handling for all API failures
- Test on low-end devices (simulate slow network)
- Unit tests for ViewModels

### Risk: User Retention
**Mitigation:**
- Onboarding flow explains each feature
- Push notifications for check-ins (Phase 2.5)
- Weekly summary reports (Phase 2.5)
- Collect feedback early & iterate

---

## Success Metrics

### Phase 2 Definition of Done
- ✅ Backend compiles, runs locally, all endpoints tested
- ✅ Database migrations run, data persists
- ✅ Android app connects to backend, can perform 3 workflows:
  1. Record voice → get emotion scores
  2. Log decision → get metacognitive score
  3. Chat with Twin → get response
- ✅ iOS app connects to backend, same 3 workflows
- ✅ Authentication working (login/logout)
- ✅ No critical crashes or data loss
- ✅ 10-20 beta testers with positive feedback
- ✅ API response time < 500ms (p95)
- ✅ Daily active users > 50% of beta testers

### Phase 2 KPIs to Track
- Crash rate < 1%
- API success rate > 99%
- Average session length > 5 minutes
- Voice recording completion rate > 80%
- Twin interaction completion rate > 60%
- User retention (Day 1) > 70%

---

## Next Steps (After Phase 2 Complete)

### Phase 3 (Weeks 17-24)
- App Store submission
- Real biometric integration (Apple Health, Google Fit)
- OAuth2 (Google Sign-In, Apple Sign-In)
- Push notifications
- Weekly/monthly reports
- Social sharing (privacy-preserved)

### Phase 4 (Weeks 25+)
- Fine-tuning Twins per user
- Advanced coherence analysis
- Predictive coherence modeling
- Community features (compare anonymized metrics)
- Premium tier (subscription)

---

## Summary

Phase 2 transforms Neural Twin from architecture → real, functional application. Focus is on:
1. **Getting backend live** (database, JWT, real API calls)
2. **Wiring frontend to backend** (Android/iOS connect, workflows end-to-end)
3. **Real feature implementation** (voice, decisions, Twins, coherence with Claude API)
4. **Launching closed beta** (10-20 users, feedback loop)

By end of Phase 2, Neural Twin will be a working mobile app with real AI interactions, ready for public beta or app store submission.

---

**Status:** Ready for review  
**Prepared by:** Claude (Agent)  
**Date:** 2026-06-25  
**Next Review:** After user feedback on Phase 2 scope decisions
