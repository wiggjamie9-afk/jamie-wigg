# Fitness Companion

Your AI fitness coach with real-time voice guidance. Multi-modal (strength, cardio, yoga, wellness), encouraging personality, personalized coaching powered by Claude.

**MVP Stack:**
- Next.js 15 + React 19 (web app)
- Web Speech API (voice input)
- Web Speech Synthesis + ElevenLabs (voice output)
- Claude Haiku (real-time coaching)
- IndexedDB (offline workouts & memory)
- Capacitor (iOS/Android wrapper)
- Tailwind v4 (mobile-first UI)

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Claude API key from [console.anthropic.com](https://console.anthropic.com)

### Dev
```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

### Build
```bash
pnpm build
# Static export → .next/out/
```

---

## Features

### Current (MVP)
- ✅ Multi-modal workout support (strength/cardio/yoga/wellness)
- ✅ Real-time voice coaching via Claude
- ✅ Voice input (Web Speech API) + voice output (Web Speech Synthesis)
- ✅ Local workout history (IndexedDB)
- ✅ Offline-first (service worker ready)
- ✅ Encouraging coach personality
- ✅ Mobile-optimized UI

### Next Wave (Post-MVP)
- Camera-based form checking
- ElevenLabs premium voice integration
- Workout stats & analytics dashboard
- Social features (share workouts)
- Custom coaching plans

---

## Architecture

```
App Flow:
1. User picks workout type (strength/cardio/yoga/wellness)
2. Mic listens → user says exercise ("3 reps of squats done", "form feels off")
3. Claude analyzes with context (their history, goals, personality)
4. Voice response → personalized coaching feedback
5. Repeat until done
6. Save to IndexedDB for offline access & coaching memory
```

### File Structure
```
fitness-companion/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Tailwind
│   ├── page.tsx            # Home (dashboard)
│   ├── workout/page.tsx    # Main workout (voice coaching)
│   ├── setup/page.tsx      # Onboarding
│   └── settings/page.tsx   # Settings
├── lib/
│   ├── useSpeechRecognition.ts  # Voice input hook
│   ├── useSpeechSynthesis.ts    # Voice output hook
│   ├── db.ts                    # IndexedDB utilities
│   ├── claude.ts                # Claude coaching API
├── public/
│   └── manifest.json       # PWA manifest
└── package.json
```

---

## Deploy to App Store & Google Play

### Step 1: Build Web App
```bash
pnpm build
# Output: .next/out/ (static HTML/JS)
```

### Step 2: Wrap in Capacitor

Copy your existing `capacitor/` folder structure:
```bash
cp -r /path/to/capacitor fitness-companion-ios/
cd fitness-companion-ios/

# Update app name, bundle ID
# Edit capacitor.config.ts
# Update www/ → point to fitness-companion/.next/out/
pnpm sync:web
```

### Step 3: iOS (Codemagic)

Same as STARLIGHTMIX Studio:
1. Push to GitHub branch
2. Codemagic builds automatically
3. TestFlight upload
4. Submit to App Store (manual approval)

### Step 4: Android (Appflow or Local)

**Option A: Appflow (recommended — same as Codemagic but for Android)**
```bash
npm install -g @ionic/cli
ionic link
ionic build  # Builds to Android
ionic package build android
# Download signed APK → upload to Google Play Console
```

**Option B: Local Android Studio**
```bash
npx cap add android
npx cap build android
# Opens Android Studio
# Build signed APK → Google Play Console
```

---

## Configuration

### Claude API Key
Users add via onboarding flow → stored locally (IndexedDB, never uploaded).

### ElevenLabs (Optional Premium Voice)
Users can add voice ID in settings for custom cloned voice.

---

## Performance Notes

- **Cold start:** ~2s (Next.js static export)
- **Voice latency:** <500ms (Claude Haiku)
- **Offline:** Full capability after first sync (IndexedDB)
- **Bundle size:** ~300KB (production)

---

## Roadmap

### Phase 1 (Current MVP)
- [x] Voice input/output
- [x] Real-time coaching
- [x] Offline memory
- [x] Multi-modal workouts
- [ ] Deploy to TestFlight + Google Play alpha

### Phase 2 (Post-Launch)
- [ ] Camera form checking
- [ ] ElevenLabs voice cloning
- [ ] Workout analytics
- [ ] Social sharing
- [ ] Custom plans

### Phase 3 (6+ months)
- [ ] Wearable integration (Apple Watch)
- [ ] Video form feedback
- [ ] Nutrition coaching
- [ ] Mental health check-ins

---

## License

MIT
