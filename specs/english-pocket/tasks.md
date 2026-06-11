# Tasks: English Pocket

## Overview

28 tasks, grouped by phase. Each task has stable ID (T1–T28), explicit file globs, depends list, and acceptance criteria.

---

## Phase 1: Content & Data (Days 1–2)

- [ ] **T1** — Gather 500-word English vocabulary library
  - **files**: `specs/english-pocket/content/vocabulary.md`, `public/data/vocabulary.json`
  - **depends**: —
  - **satisfies**: R1, R2
  - **acceptance**: 500+ words in vocabulary.json, organized by 10+ categories (Greetings, Food, Business, Travel, Health, etc.), each with English/definition/example sentence; no duplicates

- [ ] **T2** — Create category & lesson structure
  - **files**: `src/data/lessons.json`, `src/data/categories.json`
  - **depends**: T1
  - **satisfies**: R2, R14
  - **acceptance**: JSON defines 50 free lessons + 50 premium lessons; each lesson = list of 10 word IDs; free lessons marked; premium marked

- [ ] **T3** — Write Hindi, Bengali, Spanish translations for 500 words
  - **files**: `public/data/vocabulary.json`
  - **depends**: T1
  - **satisfies**: R4
  - **acceptance**: Each word has { "hi": "...", "bn": "...", "es": "..." } translations

- [ ] **T4** — Generate TTS audio (Kokoro) for all 500 words
  - **files**: `public/audio/*.wav` (500 files)
  - **depends**: T1
  - **satisfies**: R3, N3
  - **acceptance**: All 500 words have corresponding .wav file; audio is <200KB per file (Kokoro, mono); all files play without errors

- [ ] **T5** — Write onboarding copy & level assessment quiz
  - **files**: `src/data/quiz.json`, `src/copy/onboarding.md`
  - **depends**: —
  - **satisfies**: R12, R13
  - **acceptance**: Quiz has 10 questions, returns level (beginner/intermediate/advanced); onboarding explains 3 main features in <50 words each

- [ ] **T6** — Design wireframes for all 6 screens
  - **files**: `specs/english-pocket/wireframes/*.png`
  - **depends**: T1, T2, T5
  - **satisfies**: All (design input for build)
  - **acceptance**: Wireframes for: Onboarding, Lesson Browser, Flashcard Player, Dashboard, Writing Practice, Settings; 1 wireframe per screen; shows layout, buttons, info hierarchy

---

## Phase 2: Core App Build (Days 3–7)

- [ ] **T7** — Set up Capacitor project structure
  - **files**: `apps/english-pocket/`, `apps/english-pocket/www/index.html`, `apps/english-pocket/package.json`, `apps/english-pocket/capacitor.config.json`
  - **depends**: —
  - **satisfies**: R1 (scaffolding)
  - **acceptance**: `npm install` runs; `npx cap sync` succeeds; project is ready for frontend build

- [ ] **T8** — Build Onboarding screen (level assessment + tour)
  - **files**: `apps/english-pocket/www/pages/onboarding.html`, `apps/english-pocket/www/js/onboarding.js`
  - **depends**: T5, T7
  - **satisfies**: R12, R13, N6
  - **acceptance**: User completes quiz in <2 min; result saved to localStorage; tutorial explains features; skip button works; no console errors

- [ ] **T9** — Build Lesson Browser screen
  - **files**: `apps/english-pocket/www/pages/lessons.html`, `apps/english-pocket/www/js/lessons.js`
  - **depends**: T2, T7
  - **satisfies**: R1, R2, R14
  - **acceptance**: 50 free lessons display (free users); premium users see all; filter by category works; tap lesson starts flashcard player; responsive on mobile

- [ ] **T10** — Build Flashcard Player core (display + flip)
  - **files**: `apps/english-pocket/www/pages/flashcard.html`, `apps/english-pocket/www/js/flashcard.js`
  - **depends**: T1, T4, T7, T9
  - **satisfies**: R3, R4, R6, N2, N3
  - **acceptance**: Card displays English word + example; flip reveals translation; audio button plays TTS; card persists to localStorage; flip animation is smooth; responsive on mobile

- [ ] **T11** — Implement SRS algorithm
  - **files**: `apps/english-pocket/www/js/srs.js`
  - **depends**: T1, T10
  - **satisfies**: R5, R6
  - **acceptance**: Algorithm correctly schedules cards (new → 1d → 3d → 7d → 30d); localStorage tracks interval + ease per card; nextReview date is calculated correctly

- [ ] **T12** — Integrate SRS into Flashcard Player
  - **files**: `apps/english-pocket/www/js/flashcard.js`, `apps/english-pocket/www/js/srs.js`
  - **depends**: T10, T11
  - **satisfies**: R5, R6
  - **acceptance**: After user rates card (easy/good/hard), nextReview updates; card doesn't appear again until nextReview date; progress saves to localStorage

- [ ] **T13** — Build Progress Dashboard
  - **files**: `apps/english-pocket/www/pages/dashboard.html`, `apps/english-pocket/www/js/dashboard.js`
  - **depends**: T7, T11, T12
  - **satisfies**: R8, R9, R11
  - **acceptance**: Dashboard displays: current streak, total words learned, lessons completed, total study time; 30-day history graph shows; streak counter updates on app open

- [ ] **T14** — Implement Daily Streak counter
  - **files**: `apps/english-pocket/www/js/streak.js`
  - **depends**: T11, T13
  - **satisfies**: R8
  - **acceptance**: Streak increments on first card review of the day; resets if app not opened for 24h; localStorage persists streak across sessions; dashboard displays correctly

- [ ] **T15** — Build Writing Practice screen
  - **files**: `apps/english-pocket/www/pages/writing.html`, `apps/english-pocket/www/js/writing.js`
  - **depends**: T1, T7
  - **satisfies**: R7, N6
  - **acceptance**: 50+ fill-in-the-blank sentences display; user types answer; system checks case-insensitively; feedback (correct/incorrect); at least 1 sentence per 10 words

- [ ] **T16** — Implement Achievement badges
  - **files**: `apps/english-pocket/www/js/achievements.js`, `apps/english-pocket/www/components/badge.html`
  - **depends**: T13, T14
  - **satisfies**: R10
  - **acceptance**: 5+ badges defined (First Steps, Getting There, Language Learner, Consistent, Dedicated); unlocked when milestones reached (10/50/100 words, 7d/30d streak); dashboard displays unlocked badges with icons

- [ ] **T17** — Build Settings screen (level, language, export, reset)
  - **files**: `apps/english-pocket/www/pages/settings.html`, `apps/english-pocket/www/js/settings.js`
  - **depends**: T7, T11
  - **satisfies**: R18, R19, R21
  - **acceptance**: User can change level; select language (English → Hindi/Bengali/Spanish); export data as JSON; import JSON; reset all progress (with warning); about + privacy policy link

---

## Phase 3: Polish & Integration (Days 8–10)

- [ ] **T18** — Implement offline mode (service worker)
  - **files**: `apps/english-pocket/www/sw.js`, `apps/english-pocket/www/js/app.js`
  - **depends**: T10, T13
  - **satisfies**: R17, N1
  - **acceptance**: Service worker caches all HTML/CSS/JS; audio files cached on first play; app works with no network; cache busts on version update

- [ ] **T19** — Premium paywall (free tier limit + paywall UI)
  - **files**: `apps/english-pocket/www/js/premium.js`, `apps/english-pocket/www/pages/upsell.html`
  - **depends**: T2, T9, T10, T16
  - **satisfies**: R14, R15, R16
  - **acceptance**: Free users see 50 lessons max; premium button appears in settings; tapping "premium" opens upsell modal (lists 3 features); toggle in settings for testing; localStorage flag controls access

- [ ] **T20** — Add Dark/Light mode
  - **files**: `apps/english-pocket/www/css/theme.css`, `apps/english-pocket/www/js/theme.js`
  - **depends**: T7–T17 (all screens)
  - **satisfies**: N5, N6
  - **acceptance**: Respects OS dark mode preference; toggle in settings; all text has 4.5:1 contrast ratio in both modes; smooth transition

- [ ] **T21** — Optimize bundle size & load time
  - **files**: `apps/english-pocket/www/js/*.js`, `apps/english-pocket/www/css/*.css`
  - **depends**: T7–T20
  - **satisfies**: N1
  - **acceptance**: App loads in <2s on 2G (test via DevTools throttling); gzip bundle is <300KB; lazy-load vocabulary.json by category

- [ ] **T22** — Add native speaker audio (premium feature)
  - **files**: `public/data/vocabulary.json`, `apps/english-pocket/www/audio/premium/*.mp3`
  - **depends**: T3, T19
  - **satisfies**: R15
  - **acceptance**: Premium users hear .mp3 (native voice) instead of TTS; .mp3 files optional (can be recorded later or use ElevenLabs); fallback to TTS if .mp3 missing

- [ ] **T23** — Implement accessibility (WCAG 2.1 AA)
  - **files**: `apps/english-pocket/www/**/*.html`, `apps/english-pocket/www/js/**/*.js`
  - **depends**: T7–T22 (all screens)
  - **satisfies**: N6
  - **acceptance**: All buttons/inputs have accessible labels; color contrast is 4.5:1 (text) or 3:1 (UI components); keyboard navigation works (Tab, Enter, Esc); screen reader announces key elements

- [ ] **T24** — Create app store screenshots (5–8 per store)
  - **files**: `specs/english-pocket/assets/screenshots/*{ios,android}*.png`
  - **depends**: T7–T20
  - **satisfies**: Listing requirement (screenshots)
  - **acceptance**: 5 screenshots per platform; dimensions correct (iOS: 1125×2436 or 1242×2208; Android: 1080×1920); each highlights 1 feature (learning, progress, offline, premium, achievement); text overlay is readable

- [ ] **T25** — Build app icon (1024×1024 + platform variants)
  - **files**: `apps/english-pocket/icon/*.png`, `apps/english-pocket/icon/icon.svg`
  - **depends**: T7
  - **satisfies**: Listing requirement (icon)
  - **acceptance**: 1024×1024 PNG provided (no rounded corners — OS will apply); 512×512 Android icon; icon is recognizable at 60px (typical home screen size)

---

## Phase 4: Testing & Launch Prep (Days 11–13)

- [ ] **T26** — QA testing on real devices (iOS + Android)
  - **files**: `specs/english-pocket/qa/test-cases.md`
  - **depends**: T7–T25
  - **satisfies**: All
  - **acceptance**: App installs successfully on iOS + Android; all core flows tested (onboarding → lesson → flashcard → dashboard); no crashes; storage persists after restart; audio plays; offline works

- [ ] **T27** — Create app store listing (title, description, keywords)
  - **files**: `specs/english-pocket/store/listing.md`
  - **depends**: T5, T24, T25
  - **satisfies**: R1, R20, R21, R22
  - **acceptance**: App name + tagline; description (500 chars) explains value prop; keywords (business, learning, ESL, offline, freemium); privacy policy URL included; screenshots embedded

- [ ] **T28** — Privacy policy & Terms (in-app + web)
  - **files**: `apps/english-pocket/www/pages/privacy.html`, `apps/english-pocket/www/pages/terms.html`
  - **depends**: T7, T17
  - **satisfies**: R20, R21, R22
  - **acceptance**: Privacy policy states "no data collection, all local, nothing uploaded"; terms explain free vs premium; both linked in Settings screen; plain language, <1000 words each

---

## Summary

| Phase | Tasks | Duration | Output |
|-------|-------|----------|--------|
| **Content** | T1–T6 | Days 1–2 | Vocabulary library, wireframes, copy |
| **Build** | T7–T17 | Days 3–7 | Functional app with all core screens |
| **Polish** | T18–T25 | Days 8–10 | Offline, premium, accessible, icons, screenshots |
| **Launch** | T26–T28 | Days 11–13 | QA'd, listed, privacy policy ready |

**Total effort**: ~80 engineer-hours (parallelizable across agents)  
**Critical path**: T1 → T4 → T10 → T12 (content + flashcard core)  
**Parallel tracks**: UI build (T7–T17) can run alongside content (T1–T6)

---

## Next Steps

- [ ] Run `/spec-analyze english-pocket` to surface ambiguities
- [ ] Run `/spec-run english-pocket` to execute tasks in parallel waves
- [ ] Or proceed directly to frontend-design agent for T6 (wireframes)

