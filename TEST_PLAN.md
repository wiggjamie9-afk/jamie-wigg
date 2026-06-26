# Neural Twin Phase 2 — Quick Start Test Plan

## Prerequisites
1. Backend running: `cd neural-twin-app/backend && npm run dev`
2. iOS: Open `neural-twin-app/ios/NeuralTwin.xcodeproj` in Xcode
3. Android: Open `neural-twin-app/android` in Android Studio

---

## Quick Test Flow (5 min per platform)

### iOS Simulator
```bash
# 1. Build & run
xcodebuild -scheme NeuralTwin -configuration Debug -simulator

# 2. Auth flow
- Tap "Sign Up"
- Enter: email=test@neuraltwin.ai, password=Test123!, name=Test User
- Expected: Home screen loads

# 3. Home screen verification
- Coherence card shows 0–100% score
- Recording count: 0, Decision count: 0
- Recent sections empty (OK for fresh account)

# 4. Voice Recording
- Tap "Voice Journal" tab
- Tap "Start Recording"
- Speak for 3 seconds: "I feel good today"
- Tap "Stop Recording"
- Expected: Transcript displayed, emotion scores appear

# 5. Decision Logging
- Tap "Thinking" tab
- Fill: title="Career Choice", description="Accept new role", category="Career"
- Set sliders: planning=8, monitoring=7, evaluating=9
- Tap "Log Decision"
- Expected: Score calculated, decision added to list

# 6. Twin Chat
- Tap "Twins" tab
- Select "Coach Twin" (🏆)
- Type: "What's the best way to think about this decision?"
- Expected: Twin response appears in <2s, message history maintained

# 7. Coherence
- Tap "Coherence" tab
- Expected: 8 layers rendered with bars, overall score displayed
- Tap timeframe buttons (24h, 7d, 30d, all) — no crash

# 8. Settings
- Tap "Settings" tab
- Verify profile displays name/email
- Tap "Sign Out" → confirm → auth screen returns
- Expected: Token cleared, need to login again
```

### Android Emulator
```bash
# 1. Build & run
cd neural-twin-app/android
./gradlew build
# Open in Android Studio → Run

# 2-8. Same test flow as iOS
- Watch Logcat (grep "NeuralTwin") for any errors
- Check StateFlow emission in Android Profiler
```

---

## API Endpoint Verification (curl)
```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@neuraltwin.ai","password":"Test123!"}' \
  | jq -r '.token')

# Verify token works
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/voice

# Expected: 200 with VoiceRecordingsResponse { success: true, recordings: [] }
```

---

## Compilation & Build Status
- [ ] iOS: `xcodebuild -scheme NeuralTwin -configuration Release` succeeds
- [ ] Android: `./gradlew build` succeeds
- [ ] No lint warnings in either platform

---

## Critical Path (must verify)
1. ✅ Auth login/register/logout
2. ✅ Token persists across app restart
3. ✅ Home screen loads coherence data
4. ✅ Voice recording endpoint called
5. ✅ Decision scoring calculated correctly
6. ✅ Twin response received
7. ✅ Coherence 8-layer rendering
8. ✅ Settings logout clears token

---

## Known Acceptable Limitations
- Transcription is placeholder text (not real speech-to-text)
- Emotion detection uses keyword heuristics (not real ML)
- Coherence data is demo mock values (not real wearable data)
- Twin responses use Claude API (may have rate limits)

**Run this test plan before deployment. Report any test failures.**
