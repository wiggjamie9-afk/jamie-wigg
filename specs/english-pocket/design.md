# Design: English Pocket

## Approach

English Pocket is a single-page web app (React or vanilla JS) bundled in Capacitor for iOS/Android distribution. Core architecture:
- **Data layer**: localStorage for all persistence (vocabulary, progress, user preferences)
- **Spaced repetition**: Algorithm schedules card reviews based on R5 (1d → 3d → 7d → 30d)
- **UI**: Mobile-first, dark/light mode, minimal JS for fast load (N1)
- **Audio**: Free tier uses Kokoro TTS via client-side (R3); premium fetches pre-recorded native speaker MP3s from bundled CDN
- **Paywall**: Premium detection via localStorage flag; free tier grayed-out content

This design prioritizes **offline-first** (R17) and **fast load time** (N1) over server complexity.

## Components

### Core UI Screens

#### Onboarding (R12, R13)
- **Responsibility**: Initial user assessment + feature tour
- **Files**: `src/pages/Onboarding.jsx`, `src/components/LevelQuiz.jsx`
- **Interface**:
  ```jsx
  <Onboarding onComplete={(userLevel) => setUserLevel(userLevel)} />
  // Returns: "beginner" | "intermediate" | "advanced"
  ```
- **Satisfies**: R12, R13, N6 (accessible form inputs)

#### Lesson Browser (R1, R2)
- **Responsibility**: Display lessons by category/level; allow lesson selection
- **Files**: `src/pages/LessonBrowser.jsx`, `src/components/LessonCard.jsx`
- **Interface**:
  ```jsx
  <LessonBrowser 
    lessons={lessons} 
    onSelectLesson={(lessonId) => startLesson(lessonId)}
    premium={isPremium}
  />
  ```
- **Satisfies**: R1, R2, R14 (premium paywall in UI)

#### Flashcard Player (R3, R4, R5, R6)
- **Responsibility**: Display flashcard, TTS audio, handle flips, SRS scheduling
- **Files**: `src/pages/FlashcardPlayer.jsx`, `src/components/Flashcard.jsx`, `src/utils/srs.js`
- **Interface**:
  ```jsx
  <FlashcardPlayer 
    cards={cardsInLesson}
    onComplete={(results) => saveProgress(results)}
  />
  // Emits: { cardId, difficulty: "easy|good|hard", time: ms }
  ```
- **Satisfies**: R3, R4, R5, R6, N2 (smooth animation), N3 (TTS), N6 (keyboard nav)

#### Progress Dashboard (R8, R9, R10, R11)
- **Responsibility**: Show streak, total words, achievements, learning history
- **Files**: `src/pages/Dashboard.jsx`, `src/components/StreakCounter.jsx`, `src/components/AchievementBadge.jsx`
- **Interface**:
  ```jsx
  <Dashboard 
    userStats={stats}
    achievements={unlocked}
    history={last30Days}
  />
  ```
- **Satisfies**: R8, R9, R10, R11

#### Writing Practice (R7)
- **Responsibility**: Fill-in-the-blank exercises
- **Files**: `src/pages/WritingPractice.jsx`, `src/components/BlankFiller.jsx`
- **Interface**:
  ```jsx
  <WritingPractice 
    sentence="I ___ a student" // blank = "am"
    onSubmit={(answer) => checkAnswer(answer)}
  />
  ```
- **Satisfies**: R7, N6 (accessible text input)

#### Premium Paywall (R14, R15, R16)
- **Responsibility**: Show premium features, trigger in-app purchase (fake for v1)
- **Files**: `src/components/PremiumUpsell.jsx`, `src/utils/premium.js`
- **Interface**:
  ```jsx
  <PremiumUpsell 
    features={["native speaker audio", "job interview module"]}
    onUpgrade={() => setPremium(true)} // v1: mock; v2: real IAP
  />
  ```
- **Satisfies**: R14, R15, R16

### Data Layer

#### Vocabulary Library (R1)
- **Responsibility**: Store 500+ words with translations, example sentences
- **Files**: `public/data/vocabulary.json`, `src/data/categories.json`
- **Schema**:
  ```json
  {
    "id": "word_001",
    "english": "Hello",
    "category": "Greetings",
    "level": "beginner",
    "definition": "A standard greeting",
    "example": "Hello, how are you?",
    "translations": {
      "hi": "नमस्ते",
      "bn": "হ্যালো",
      "es": "Hola"
    },
    "audioTts": "hello.wav",  // generated via Kokoro
    "audioPremium": "hello-native.mp3"  // pre-recorded (optional v1)
  }
  ```
- **Satisfies**: R1, R3, R4

#### User Progress (R6, R8, R9)
- **Responsibility**: Track learning history, streak, achievements
- **Files**: `src/utils/storage.js`
- **Schema** (localStorage keys):
  ```json
  "ep_user_level": "beginner",
  "ep_cards_progress": {
    "word_001": {
      "learned": true,
      "nextReview": "2026-06-12",
      "interval": 1,
      "ease": 2.5,
      "attempts": 3
    }
  },
  "ep_streak": {
    "current": 7,
    "lastLogin": "2026-06-11",
    "totalDays": 42
  },
  "ep_stats": {
    "wordsLearned": 127,
    "lessonsCompleted": 12,
    "totalTime": 3600  // seconds
  },
  "ep_premium": false  // becomes true when user upgrades
  ```
- **Satisfies**: R6, R8, R9, R11, R18, R19 (backup/restore via JSON export)

### Business Logic

#### SRS Algorithm (R5)
- **Responsibility**: Schedule card reviews based on user difficulty rating
- **Files**: `src/utils/srs.js`
- **Logic** (SM-2 algorithm):
  ```
  on "easy": interval *= 1.3, ease += 0.2
  on "good": interval *= 1.0, ease unchanged
  on "hard": interval = 1, ease -= 0.2
  nextReview = today + interval days
  ```
- **Satisfies**: R5, N2 (determines when cards appear next)

#### Premium Detection (R14, R15, R16)
- **Responsibility**: Check if user is premium; filter lessons/audio accordingly
- **Files**: `src/utils/premium.js`
- **Logic**:
  ```js
  isPremium = localStorage.getItem("ep_premium") === "true"
  if !isPremium:
    lessons = lessons.filter(l => l.index < 50)  // free: first 50 only
    audio = audioTts  // free: TTS only
  else:
    lessons = allLessons
    audio = audioPremium  // premium: native speaker
  ```
- **Satisfies**: R14, R15

#### Achievement System (R10)
- **Responsibility**: Unlock badges based on milestones
- **Files**: `src/utils/achievements.js`
- **Badges**:
  - "First Steps": 10 words learned
  - "Getting There": 50 words learned
  - "Language Learner": 100+ words learned
  - "Consistent": 7-day streak
  - "Dedicated": 30-day streak
- **Satisfies**: R10

## Data

**Local-only** — no server, no sync. User data lives in `localStorage`:

| Key | Purpose | Typical Size |
|-----|---------|---|
| `ep_user_level` | Starting level (beginner/intermediate/advanced) | <100 bytes |
| `ep_cards_progress` | SRS scheduling + attempts for each word | ~50KB (500 words × 100 bytes) |
| `ep_streak` | Current/total streak counters | <500 bytes |
| `ep_stats` | Words learned, lessons done, time | <500 bytes |
| `ep_achievements` | Unlocked badge IDs | <500 bytes |
| `ep_premium` | Boolean flag (free→premium state) | <100 bytes |
| `public/data/vocabulary.json` | 500-word library (bundled, not in localStorage) | ~200KB |

**Total localStorage**: ~52KB (well below typical 5MB limit)

## Risks

**Risk**: Vocabulary.json (500 words) is 200KB; slow downloads on 2G.
**Mitigation**: Gzip + lazy-load by category (load only current + next category). Ship with Beginner category (~100 words, 40KB) bundled; lazy-fetch others on demand.

**Risk**: TTS generation for 500 words is time-consuming.
**Mitigation**: Pre-generate all `.wav` files offline (one-time, before build). Include in `public/audio/` directory.

**Risk**: Premium paywall fake in v1; users expect real IAP.
**Mitigation**: Clearly label as "demo" in app; real IAP (Stripe/RevenueCat) is v2. For now, toggle `ep_premium = true` via settings screen for testing.

---

## Tech Stack

- **Frontend**: Vanilla JS or React (TBD by frontend-design agent)
- **Bundler**: Vite (fast, light)
- **CSS**: Tailwind v4 (already in repo)
- **Audio**: Kokoro TTS (client-side, free)
- **Storage**: localStorage (built-in, no deps)
- **Package**: Capacitor (web-to-iOS/Android wrapper)
- **Build/Deploy**: Vite → Capacitor → App Store/Play Store

---

## Wireframe Notes

- **Header**: App name + user stats (streak, words, level badge)
- **Main nav**: Lessons | Dashboard | Practice | Settings
- **Lessons screen**: Grid of lesson cards, filterable by category/level
- **Flashcard screen**: Large card (center), English (front) → translation (back), audio button, difficulty buttons (easy/good/hard), progress bar
- **Dashboard**: Streak counter, total words, achievements grid, 30-day history graph
- **Settings**: Level change, language preference, export data, reset progress, about/privacy

