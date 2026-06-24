# Neural Twin - Complete App

Production-grade AI companion ecosystem with native iOS + Android + backend.

## Project Structure

```
neural-twin-app/
├── backend/              # Node.js/Express + TypeScript backend
│   ├── src/
│   │   ├── index.ts      # Main server
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   ├── prisma/
│   │   └── schema.prisma # Database schema (11 tables, 7 layers)
│   ├── package.json
│   └── README.md
│
├── ios/                  # Swift + SwiftUI native iOS app
│   ├── NeuralTwin/
│   │   └── NeuralTwin.swift
│   └── README.md
│
├── android/              # Kotlin + Jetpack Compose Android app
│   ├── app/
│   │   ├── src/main/
│   │   │   └── java/com/neuraltwin/app/
│   │   │       ├── MainActivity.kt
│   │   │       └── AuthViewModel.kt
│   │   └── build.gradle.kts
│   └── README.md
│
├── design/               # Figma design system
├── docs/                 # Documentation
├── infrastructure/       # Docker, Kubernetes, CI/CD
└── README.md
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Backend runs on `http://localhost:3000`

### iOS Setup

```bash
cd ios
open NeuralTwin.xcworkspace
⌘ + R
```

### Android Setup

```bash
cd android
# Open in Android Studio
# Run on emulator or device
```

## Architecture Overview

### 7-Layer System

1. **User Interface Layer**
   - iOS native (SwiftUI)
   - Android native (Jetpack Compose)
   - Web companion (PWA)

2. **Real-Time Orchestration**
   - Voice capture + emotion analysis
   - Decision logging
   - Biometric streaming
   - Local processing (privacy-first)

3. **API Gateway + Sync**
   - Encrypted communication
   - Offline-capable sync

4. **8 Specialist Twins**
   - Task Twin
   - Coach Twin
   - Growth Twin
   - Health Twin
   - Relationship Twin
   - Financial Twin
   - Creative Twin
   - Research Twin

5. **Ecosystem Brain**
   - Knowledge graph
   - Pattern detection
   - Inter-Twin communication

6. **Coherence Engine**
   - Heart-brain coherence @ 0.1 Hz
   - Breath coherence optimization
   - Brain coherence (EEG if available)
   - Vagal tone measurement
   - Circadian alignment
   - Biofield coherence (Tesla principle)

7. **Foundation Layer**
   - Voice corpus (100+ hours)
   - Decision patterns (100+)
   - Values & principles (15-25)
   - Knowledge base (50+)
   - Fine-tuning pipeline (weekly updates)
   - Biometric data (real-time)
   - Privacy & encryption

### Database Schema

**11 tables across 5 domains:**

**Authentication & Users**
- User (account, subscription, privacy settings)

**Phase 1: Foundation**
- VoiceRecording (emotion analysis, acoustic features)
- Decision (logging, pattern analysis)
- Value (core beliefs, how they guide decisions)
- KnowledgeEntry (insights, evidence, applicability)

**Phase 2: Twins**
- Twin (8 specialists, fine-tuned models)
- TwinInteraction (conversations, context)

**Phase 3+: Intelligence**
- KnowledgeGraph (nodes, edges, clusters)
- BiometricData (heart, breath, sleep, activity, posture)
- CoherenceMetric (7 layers of consciousness)
- FineTuningJob (Anthropic API integration)
- LearningLoop (weekly/monthly re-training)
- AuditLog (data governance)

## 52-Week Development Timeline

### Phase 0 (Weeks 1-4): Architecture & Design ✅
- [x] Complete database schema
- [x] Backend API scaffolding (Express.js + TypeScript)
- [x] iOS native app scaffolding (SwiftUI)
- [x] Android native app scaffolding (Jetpack Compose)
- [ ] Figma design system

### Phase 1 (Weeks 5-16): Foundation + Voice 🚀
- [ ] Voice recording (AVAudioEngine / MediaRecorder)
- [ ] Voice emotion recognition (Whisper + acoustic features)
- [ ] Decision logging (structured template)
- [ ] Values definition (15-25 core beliefs)
- [ ] Knowledge base entry
- [ ] Fine-tuning pipeline init (Anthropic Batch API)
- [ ] Real-time learning loop

### Phase 2 (Weeks 17-28): Twin Ecosystem
- [ ] Task Twin (productivity)
- [ ] Coach Twin (voice-based coaching)
- [ ] Growth Twin (learning patterns)
- [ ] Health Twin (biometric optimization)
- [ ] Relationship Twin (social coherence)
- [ ] Financial Twin (money psychology)
- [ ] Creative Twin (flow state)
- [ ] Research Twin (knowledge synthesis)
- [ ] Ecosystem Brain (inter-Twin communication)
- [ ] Knowledge graph (causal relationships)

### Phase 3 (Weeks 29-36): Biometric Integration
- [ ] Apple Health integration (iOS)
- [ ] Google Fit integration (Android)
- [ ] Wearable data (Oura Ring, Withings, Apple Watch)
- [ ] Computer vision (posture, breathing rate)
- [ ] Biometric-aware coaching

### Phase 4 (Weeks 37-44): Coherence Layer
- [ ] Heart-brain coherence measurement
- [ ] Breath coherence optimization
- [ ] Brain coherence (EEG if available)
- [ ] Vagal tone measurement
- [ ] Circadian alignment tracking
- [ ] Biofield coherence (Tesla 369 principle)
- [ ] Decision coherence scoring
- [ ] Real-time coherence coaching
- [ ] Harmonic frequency resonance

### Phase 5 (Weeks 45-52): Launch
- [ ] Lock screen widgets (iOS)
- [ ] Always-on display (Android)
- [ ] Siri Shortcuts (iOS)
- [ ] Google Assistant integration (Android)
- [ ] Web companion app
- [ ] App Store submission (iOS)
- [ ] Google Play submission (Android)
- [ ] Beta launch (1k users)

## Key Technologies

**Backend:**
- Node.js 20+
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Anthropic Claude API
- Redis

**iOS:**
- Swift 5.9+
- SwiftUI
- AVAudioEngine
- HealthKit
- Socket.IO

**Android:**
- Kotlin 1.9+
- Jetpack Compose
- MediaRecorder
- Health Connect / Google Fit
- Hilt DI

**Infrastructure:**
- Docker / Kubernetes
- GitHub Actions (CI/CD)
- Cloudflare (edge)
- AWS S3 (audio storage)
- PostgreSQL (managed)
- Redis (cache)

## Features Overview

### Phase 1 MVP
- Voice recording with real-time waveform
- Voice emotion analysis (happy, sad, angry, neutral, surprised, fearful, disgusted)
- Decision logging with pattern recognition
- Core values definition
- Knowledge base entry
- Fine-tuning pipeline for personalized Claude models

### Phase 2 MVP+
- 8 active AI Twins, each with specialized purpose
- Real-time chat with any Twin
- Ecosystem Brain coordination across Twins
- Weekly learning loop (re-training on new user data)

### Phase 3 Beta
- Apple Health + Google Fit integration
- Wearable data (heart rate, HRV, sleep, activity)
- Computer vision analysis (posture, breathing)
- Biometric-aware coaching

### Phase 4 Pro
- 7-layer coherence dashboard
- Real-time coaching based on nervous system state
- Tesla resonance frequency tuning
- Entrainment coaching

### Phase 5 Launch
- Production-grade iOS + Android apps
- Organic growth model (app adapts like living organism)
- Public beta (1k users)
- App Store / Play Store release

## Accessibility Feature: Book Scanning 📖

**NEW:** Dyslexia/ADHD Support - Book scanning with text-to-speech

### Implementation (Phase 1C-2)
- Camera-based book scanning (optical character recognition)
- Real-time text extraction
- Text-to-speech reading (multiple voices)
- Highlighting/tracking during playback
- Adjustable speed & voice preferences
- Offline reading mode

### Integration Points
- **iOS:** Vision framework + AVSpeechSynthesizer
- **Android:** ML Kit text recognition + TextToSpeech
- **Backend:** Optional OCR service (Tesseract or Google Cloud Vision)

### User Flow
1. Tap "Scan Book" in Coach Twin
2. Point camera at book page
3. Text extracted automatically
4. Choose voice & speed
5. Listen while text highlights
6. Save to knowledge base for later

This helps make Neural Twin not just a personal companion, but an **accessibility tool for people with dyslexia, ADHD, or vision challenges**.

---

## Getting Started

**Option 1: Quick MVP (4-6 weeks)**
- Focus on voice + decision logging
- Single Twin (Coach) active
- Basic biometric sync

**Option 2: Complete Phase 1 (12 weeks)**
- All Phase 1 features
- Task Twin + Coach Twin
- Fine-tuning pipeline running

**Option 3: Full Vision (52 weeks)**
- Complete 7-layer system
- All 8 Twins active
- Biometrics + Coherence
- Production launch

---

## Next: Jump to Phase 1

Ready to start building?

**Week 1 Tasks:**
1. Set up local backend (npm install, db:migrate)
2. Implement voice recording endpoints
3. Wire up Whisper API for transcription
4. Build Voice Recording UI (iOS/Android)
5. Start collecting your voice corpus

See `NEURAL-TWIN-APP-COMPLETE-BUILD.md` for detailed phase breakdown.

---

**Start date:** June 24, 2024  
**Current phase:** Phase 0 (Architecture) ✅  
**Next phase:** Phase 1 (Foundation + Voice) 🚀
