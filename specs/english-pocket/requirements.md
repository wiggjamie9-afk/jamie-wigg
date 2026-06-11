# Requirements: English Pocket

## Problem

Non-English speakers in emerging markets (India, Africa, SE Asia) struggle to learn English due to:
- High cost of tutoring ($50+/month)
- Lack of access to quality learning materials
- No offline-capable learning tools
- Limited access to native speaker instruction

## Goal

Build a professional ESL learning app that enables 1B+ non-English speakers to learn English in 10 min/day, offline, with affordable premium access ($2.99/month), and demonstrates job-opportunity impact through certificate system.

## Functional requirements

### Core Learning
- **R1**: App displays 500+ English vocabulary words organized by category (Greetings, Business, Daily Life, Food, Travel, Health, etc.) and difficulty level (Beginner, Intermediate, Advanced)
- **R2**: User can browse lessons by category/level, with at least 50 lessons in free tier
- **R3**: Flashcard interface shows English word/phrase with definition, example sentence, and free TTS-generated pronunciation audio
- **R4**: User can flip cards to reveal Hindi/Bengali/Spanish translation based on device language
- **R5**: Spaced repetition algorithm (SRS) schedules cards: new words → 1d → 3d → 7d → 30d
- **R6**: User's progress is saved to localStorage, persisting across sessions
- **R7**: Writing practice: fill-in-the-blank exercises for 50+ example sentences

### Progress Tracking & Gamification
- **R8**: Daily streak counter tracks consecutive login days (resets on missed day)
- **R9**: Progress dashboard shows: lessons completed, words learned, current streak, total learning time
- **R10**: Achievement system with 5+ badges (e.g., "First 100 Words", "7-Day Streak", "Complete Beginner Level")
- **R11**: User can view learning history (dates, words learned per day) over past 30 days

### Onboarding
- **R12**: First-time user assessment determines starting level (Beginner, Intermediate, Advanced) via 2-min quiz
- **R13**: Onboarding flow explains core features: flashcards, SRS, streaks, premium (takes <1 min)

### Premium Features
- **R14**: Freemium model: free tier shows 50 lessons + 100 unique words; premium ($2.99/month) unlocks all 500+ words + all lessons
- **R15**: Premium users get native speaker audio (pre-recorded professional voices) instead of TTS; free users get TTS
- **R16**: Premium exclusive features: job interview module (20+ mock Q&A), grammar explanations, reading passages, certificate generator

### Offline & Persistence
- **R17**: App works fully offline after initial load; no internet required for learning
- **R18**: User can export learning data as JSON for backup
- **R19**: User can import previously exported data to restore progress

### Data & Privacy
- **R20**: No personal data collected; all data stored locally on device via localStorage
- **R21**: No user accounts, login, or registration required
- **R22**: Privacy policy available in-app; clearly states "nothing uploaded"

## Non-functional requirements

- **N1**: App loads in <2 seconds on 2G connection (gzip + minimal CSS/JS)
- **N2**: Flashcard flip animation is smooth (60fps, <200ms transition)
- **N3**: Audio playback is clear; TTS uses Kokoro (fast, multi-language support)
- **N4**: Mobile responsive: works on phones 320px–1080px wide, tablets up to 768px
- **N5**: Dark mode supported (respects OS dark mode preference)
- **N6**: Accessibility: WCAG 2.1 AA (alt text for icons, sufficient color contrast, keyboard navigable)
- **N7**: No external analytics or tracking; all telemetry is local-only

## Out of scope

- Cloud sync / multi-device sync (local-only for v1)
- Video lessons (text + audio only for v1)
- Social features (leaderboards, friend challenges)
- Advanced grammar module (covered in premium but basic only)
- Speech recognition / speaking practice (pre-recorded audio only)
- Third-party authentication (no accounts)

## Open questions

- None (clarifying round resolved scope)

---

## Acceptance Criteria (MVP)

The MVP ships when:
- ✅ App loads in <2s on slow connection
- ✅ User can complete 10-card lesson in 5 minutes
- ✅ Flashcards persist across app restart
- ✅ Free tier shows 50 lessons; premium paywall works
- ✅ Premium users see native speaker audio; free users see TTS
- ✅ Dashboard shows streak, words learned, progress
- ✅ Offline mode works (no network needed after first load)
- ✅ App store listing complete (screenshots, description, keywords)
- ✅ Privacy policy visible in-app
