# RESONANCE Ecosystem — Full Build Plan

**Mission:** One lesson a day makes your brain bigger and brighter.

**Timeline:** 14-15 weeks to production-ready full-stack system.

---

## Phase 1: Wireframes & Design System (This Week)

### 7 New Apps to Design via Google Stitch

**Brain Apps (3):**
1. **Mum Brain** — For mothers/caregivers on energy, patience, balance, connection
   - Tracks: Energy, Patience, Balance, Connection
   - 20 lessons × 4 tracks (80 total)
   - Breathing exercises, affirmations for overwhelm

2. **Dad Brain** — For fathers on presence, patience, strength, connection
   - Tracks: Presence, Patience, Strength, Connection
   - 20 lessons × 4 tracks (80 total)
   - Strength-based lessons, grounding techniques

3. **Abilities Brain** — For people with disabilities/chronic conditions on adaptation, strength, community, purpose
   - Tracks: Adaptation, Strength, Community, Purpose
   - 20 lessons × 4 tracks (80 total)
   - Accessible-first design, no ableism

**Tier 1 Apps (4):**
4. **Sleep** — For people struggling with sleep (insomnia, anxiety, restlessness)
   - Tracks: Wind-Down, Breathing, Body Scan, Dream
   - 20 lessons × 4 tracks (80 total)
   - Dimmed UI, slower SpeechSynthesis (0.85x), sleep sounds

5. **Relationships** — For navigating relationships (conflict, communication, intimacy, boundaries)
   - Tracks: Communication, Conflict, Intimacy, Boundaries
   - 20 lessons × 4 tracks (80 total)
   - Advice grounded in attachment theory, neuroscience

6. **Money** — For people with money anxiety (spending, saving, debt, abundance)
   - Tracks: Spending, Saving, Debt, Abundance
   - 20 lessons × 4 tracks (80 total)
   - Psychology of money, behavioral economics

7. **Sobriety** — For people in recovery (cravings, identity, community, purpose)
   - Tracks: Cravings, Identity, Community, Purpose
   - 20 lessons × 4 tracks (80 total)
   - Evidence-based, non-judgmental, always-visible crisis resources

### Design System Requirements

All wireframes must support:
- **Web** (responsive, PWA, offline-first)
- **iOS** (Capacitor wrapper)
- **Android** (Capacitor wrapper)
- **Windows/Mac** (Electron wrapper)
- **Apple Watch** (biometric integration layer)

**Visual Language:**
- Lock to `rhythmix-teaser-60s/DESIGN.md` palette
- Mobile-first responsive grid
- Accessibility-first (WCAG AA minimum)
- 432 Hz frequency support (audio generation)
- Breathing/humming animations (GSAP)

### Stitch Pipeline (8 Steps)

Each app follows this flow:
1. ✓ Requirements documented (above)
2. ✓ Design system locked
3. ✓ Screens planned
4. → **Step 4: Generate prompts for Stitch**
5. → **Step 5: Generate screens via Stitch MCP**
6. → **Step 6: Review & iterate**
7. → **Step 7: Export as React components**
8. → **Step 8: Integrate into codebase**

---

## Phase 2: React + TypeScript Core (Weeks 2-3)

### Single Codebase Strategy

All platforms (Web, iOS, Android, Windows, Mac) build from one React + TypeScript core:

```
resonance-core/
├── src/
│   ├── components/        # Shared UI components
│   ├── screens/           # Each app's 4-track lesson screen
│   ├── hooks/
│   │   ├── useLesson()
│   │   ├── useBiometrics()    # Apple Watch, Google Fit
│   │   ├── useStreak()
│   │   ├── useVoice()         # Speech synthesis + TTS
│   │   └── useAuth()          # User authentication
│   ├── services/
│   │   ├── api.ts             # Backend API client
│   │   ├── storage.ts         # localStorage + IndexedDB
│   │   ├── sync.ts            # Real-time sync (Firebase)
│   │   ├── biometrics.ts      # HealthKit/Google Fit bridge
│   │   └── voice.ts           # Voicebox + ElevenLabs
│   ├── context/
│   │   ├── UserContext         # Global user state
│   │   ├── BiometricContext    # Heart rate, HRV, breathing
│   │   └── AppContext          # Current lesson, track, streak
│   ├── types/
│   │   ├── App.ts
│   │   ├── User.ts
│   │   ├── Lesson.ts
│   │   ├── Biometric.ts
│   │   └── Voice.ts
│   └── pages/                  # Platform-specific entry points
│       ├── web/                # Next.js PWA
│       ├── mobile/             # Capacitor iOS/Android
│       └── desktop/            # Electron Windows/Mac
├── apps/
│   ├── bright-brains/          # Lesson data for each app
│   ├── creators-daily/
│   ├── ... (10 original + 7 new)
│   ├── mum-brain/
│   ├── dad-brain/
│   └── ...
└── design-system.css           # Shared Tailwind v4 config
```

### Component Architecture

**Lesson Screen** (reused across all 17 apps):
```typescript
interface Lesson {
  id: string;
  title: string;
  body: string[];              // 3-5 paragraphs
  affirmation: string;
  strength: string;
  audioUrl?: string;           // ElevenLabs TTS cache
  audioEmotionalTone?: 'calm' | 'energetic' | 'compassionate';
}

interface LessonScreenProps {
  appId: string;
  trackId: string;
  lessonIndex: number;
}
```

**Biometric Integration** (Apple Watch + Google Fit):
```typescript
interface Biometric {
  heartRate: number;
  hrv: number;                 // Heart Rate Variability
  breathingRate: number;
  stressLevel: 0-100;          // Derived from HRV
  emotionalState: 'calm' | 'anxious' | 'sad' | 'energized';
  timestamp: number;
}
```

**Voice Integration** (Voicebox + ElevenLabs):
```typescript
interface VoiceCommand {
  transcript: string;
  intent: 'lesson' | 'breathing' | 'humming' | 'chat' | 'emergency';
  confidence: number;
}
```

---

## Phase 3: Backend Infrastructure (Weeks 4-5)

### Node.js + Express API

```
resonance-api/
├── src/
│   ├── routes/
│   │   ├── auth.ts            # Sign up, login, OAuth (Google)
│   │   ├── users.ts           # Profile, preferences, settings
│   │   ├── lessons.ts         # Get lessons for app/track
│   │   ├── progress.ts        # Track completion, streaks, stats
│   │   ├── biometrics.ts      # Store HealthKit/Google Fit data
│   │   ├── voice.ts           # Voice authentication, commands
│   │   ├── chat.ts            # Claude API AI companion
│   │   ├── tts.ts             # ElevenLabs TTS generation
│   │   ├── payments.ts        # Stripe subscription management
│   │   └── admin.ts           # Dashboard, analytics
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── rateLimit.ts       # 100 req/min per user
│   │   ├── cors.ts
│   │   └── logging.ts         # Structured logs to Datadog
│   ├── models/
│   │   ├── User.ts
│   │   ├── Lesson.ts
│   │   ├── Progress.ts
│   │   ├── Biometric.ts
│   │   ├── Voice.ts
│   │   └── Chat.ts
│   ├── services/
│   │   ├── claude.ts          # Claude API integration
│   │   ├── elevenlabs.ts      # TTS with emotional tone
│   │   ├── healthkit.ts       # Apple HealthKit bridge
│   │   ├── googlefit.ts       # Google Fit bridge
│   │   ├── voicebox.ts        # Voice cloning
│   │   ├── stripe.ts          # Payment processing
│   │   ├── email.ts           # SendGrid transactional emails
│   │   └── notifications.ts   # Push notifications
│   ├── db/
│   │   ├── postgres.ts        # User accounts, lessons, progress
│   │   └── migrations/
│   └── config/
│       ├── environment.ts
│       ├── database.ts
│       └── external-apis.ts
├── tests/
├── Dockerfile
└── docker-compose.yml
```

### Database Schema (PostgreSQL)

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255),
  voiceFingerprint BYTEA,        -- Speaker verification
  appleHealthKitToken TEXT,
  googleFitToken TEXT,
  createdAt TIMESTAMP,
  subscriptionStatus ENUM('free', 'pro', 'lifetime'),
  subscriptionExpiresAt TIMESTAMP
);
```

**Progress Table:**
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  appId VARCHAR(50),
  trackId VARCHAR(50),
  lessonIndex INT,
  completedAt TIMESTAMP,
  timeSpent INT,               -- seconds
  emotionalRating 1-5,         -- user feedback
  streakDays INT,
  createdAt TIMESTAMP
);
```

**Biometrics Table:**
```sql
CREATE TABLE biometrics (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  heartRate INT,
  hrv INT,
  breathingRate INT,
  stressLevel INT,             -- 0-100
  emotionalState VARCHAR(50),
  detectedAt TIMESTAMP,
  source ENUM('apple_health', 'google_fit', 'manual')
);
```

### APIs

**REST Endpoints:**
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Email/password login
- `POST /api/auth/voice-verify` — Voice biometric authentication
- `GET /api/apps/:appId/track/:trackId/lessons` — Fetch 5 lessons
- `POST /api/progress/complete` — Mark lesson done
- `GET /api/user/stats` — Streaks, total lessons, emotional insights
- `GET /api/biometrics/latest` — Current heart rate, HRV, stress
- `POST /api/chat` — Claude AI companion (streaming)
- `POST /api/tts` — Generate emotional speech
- `POST /api/subscribe` — Create Stripe checkout session

**WebSocket (Real-time):**
- `/ws/biometrics` — Live Apple Watch/Google Fit streaming
- `/ws/voice-commands` — Real-time voice transcription
- `/ws/chat` — Streaming AI responses

---

## Phase 4: Platform-Specific Builds (Weeks 6-8)

### Web (Next.js PWA)

```bash
npm run build:web
# → Outputs to resonance-web/out/
# → Deploy to Vercel / Cloudflare Pages
```

Features:
- Responsive design (mobile-first)
- Service worker (offline support)
- Push notifications
- Home screen install (PWA)

### iOS (Capacitor)

```bash
npm run build:ios
# → Opens Xcode
# → Build with Xcode → App Store Connect → Submit
```

Integrations:
- Apple HealthKit (background syncing)
- Face/Touch ID biometric auth
- Siri voice commands
- Background app refresh (for streaming biometrics)

### Android (Capacitor)

```bash
npm run build:android
# → Opens Android Studio
# → Build with Gradle → Google Play Console → Submit
```

Integrations:
- Google Fit (background syncing)
- Biometric auth
- Google Assistant voice commands
- Background services

### Windows/Mac (Electron)

```bash
npm run build:desktop
# → Outputs electron-builder artifacts
# → Auto-updater built in
```

Integrations:
- Native menu bar widgets
- System notifications
- Native file system access
- OS-specific dark mode

---

## Phase 5: Full-Stack Features (Weeks 9-11)

### JARVIS-Level AI Companion

**Architecture:**
```typescript
interface AICompanion {
  context: {
    currentLesson: Lesson;
    userMood: string;
    recentBiometrics: Biometric;
    userHistory: string[];     // Past lessons, streaks
    appTheme: string;           // Which "brain" they're using
  };

  // Claude API with context
  async chat(userMessage: string): Promise<StreamingResponse> {
    const systemPrompt = buildContextualPrompt(context);
    const response = await claude.messages.create({
      model: 'claude-3-5-sonnet',
      system: systemPrompt,
      messages: conversationHistory,
      stream: true,
    });
    return response;
  }

  // Emotional tone detection
  async analyzeEmotion(): Promise<EmotionalTone> {
    const tone = classifyFromBiometrics(
      currentBiometrics.hrv,
      currentBiometrics.breathingRate,
      userVoiceTranscript
    );
    return tone;  // 'calm', 'anxious', 'sad', 'energized'
  }

  // Generate emotional speech
  async speak(text: string, emotion: string): Promise<AudioBuffer> {
    const voiceId = getUserVoiceId();  // Voicebox cloned voice
    const audio = await elevenlabs.textToSpeech({
      text,
      voice_id: voiceId,
      model_id: 'eleven_monolingual_v1',
      // Custom voice settings for emotional tone
      prosody: {
        pitch: emotionToPitch(emotion),
        rate: emotionToRate(emotion),
      },
    });
    return audio;
  }

  // Breathing/humming synchronization
  async guidedBreathing(durationSeconds: number, frequency?: number): Promise<void> {
    const animationFrames = generateBreathingAnimation(durationSeconds);
    const audioWave = frequency ? generate432HzFrequency(durationSeconds) : null;
    playAnimationAndAudio(animationFrames, audioWave);
  }

  // Voice authentication
  async authenticateVoice(audioSample: AudioBuffer): Promise<boolean> {
    const fingerprint = extractVoiceFeatures(audioSample);
    const similarity = compareToStoredVoiceprint(fingerprint);
    return similarity > 0.95;  // 95% match threshold
  }
}
```

### Admin Dashboard

Features:
- Content management (add/edit lessons)
- User analytics (engagement, streaks, emotional trends)
- Subscription management
- Feature flags (beta test new features)
- A/B testing framework
- Moderation tools (for community features)

### Community Features

- Private user messaging
- Group challenges (e.g., "7-day streak")
- Shared journeys (following another user's progress)
- Leaderboards (by streak, lessons completed, etc.)
- Moderation (report, block, mute)

---

## Phase 6: Testing & Deployment (Weeks 12-15)

### Security & Compliance

- HIPAA encryption (all health data at-rest)
- GDPR compliance (data export, deletion)
- SOC 2 Type II audit (plan)
- Penetration testing
- OAuth 2.0 + JWT + refresh tokens

### Performance

- API response time <200ms p95
- App startup <2s
- Offline mode works instantly
- Biometric streaming <500ms latency
- TTS generation cached (avoid re-generation)

### Testing

- Unit tests (Jest, Vitest)
- Integration tests (API + database)
- E2E tests (Playwright) — all user flows
- Load testing (k6) — 1,000 concurrent users
- Accessibility testing (axe-core)

### CI/CD Pipeline

**GitHub Actions:**
```yaml
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - eslint
      - typescript --noEmit
      - prettier --check
  
  test:
    runs-on: ubuntu-latest
    steps:
      - jest --coverage
      - vitest
      - playwright test
  
  build:
    runs-on: ubuntu-latest
    steps:
      - npm run build:web
      - npm run build:api
  
  deploy:
    if: branch == 'main'
    steps:
      - deploy web to Vercel
      - deploy API to Railway / AWS
      - trigger iOS/Android builds (Codemagic)
```

### Launch Strategy

**Beta (Week 14):**
- 1,000 testers via TestFlight (iOS) + Google Play (Android)
- Collect feedback, fix critical bugs
- Monitor crash rates, performance

**Public Launch (Week 15):**
- All platforms live (Web, iOS, Android, Windows, Mac)
- Press release
- Social media campaign
- Email to existing users

---

## Revenue Model

### Free Tier
- All 17 apps
- 3 lessons per day limit
- No AI companion
- No biometric integration

### Pro ($4.99/mo)
- Unlimited lessons
- JARVIS AI companion (1 chat/day)
- Biometric streaming (Apple Watch)
- Offline mode
- Ad-free

### Pro Plus ($9.99/mo)
- Everything above
- Unlimited AI companion chats
- Voice authentication
- Custom voice cloning
- Priority support

### Lifetime ($99)
- One-time purchase
- All features forever
- No ads, no limits

### B2B Tier
- License to therapists, coaches, corporate wellness
- $500-2,000/mo per seat
- White-label option
- API access for custom integrations

---

## Key Milestones

| Week | Milestone |
|---|---|
| 1 | Wireframes for 7 new apps via Stitch |
| 2 | React core + component library |
| 3 | All 17 apps functional (lessons only) |
| 4 | Backend API (auth, lessons, progress) |
| 5 | Biometric integration (Apple/Google) |
| 6 | Web PWA launch (beta) |
| 7 | iOS Capacitor build (beta) |
| 8 | Android Capacitor build (beta) |
| 9 | Electron desktop builds |
| 10 | AI companion (Claude API) |
| 11 | Community features, admin dashboard |
| 12 | Security audit, compliance |
| 13 | Load testing, performance tuning |
| 14 | Beta launch (1,000 users) |
| 15 | Public launch (all platforms) |

---

## Next Immediate Steps

1. **Use Stitch on your Mac** to design wireframes for 7 new apps (Mum Brain, Dad Brain, Abilities Brain, Sleep, Relationships, Money, Sobriety)
   - Open Claude Code on your Mac
   - Use the `stitch` MCP tool to generate screens
   - Export designs as React components if possible
   
2. **I will build in parallel:**
   - React + TypeScript core (shared across all platforms)
   - Lesson data for all 17 apps
   - Basic UI components
   - Authentication system

3. **We sync designs + code** once Stitch exports are ready

---

**Status:** Ready to build. Stitch MCP authenticated on user's Mac. Proceeding with Phase 1 (wireframes) and Phase 2 (React core) in parallel.
