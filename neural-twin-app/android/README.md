# Neural Twin Android App

Native Android application for Neural Twin using Kotlin and Jetpack Compose.

## Setup

```bash
# Prerequisites
# - Android Studio Giraffe or newer
# - Android SDK 28+
# - Kotlin 1.9+

# Open in Android Studio
# File → Open → neural-twin-app/android

# Build and run
⌥ ⇧ F10 (Run)
```

## Architecture

### Screens
- **HomeScreen** — Dashboard with stats
- **VoiceRecordingScreen** — Record voice with real-time waveform
- **TwinsListScreen** — Browse 8 Twins
- **CoherenceScreen** — 7-layer coherence metrics
- **SettingsScreen** — Account & app settings
- **LoginScreen** — Sign-in
- **SignupScreen** — Create account

### ViewModels
- **AuthViewModel** — JWT, login/logout, OAuth
- **TwinViewModel** — Twin interactions
- **VoiceViewModel** — Voice recording state

### Navigation
- Bottom navigation bar for main tabs
- NavController for screen transitions
- Hilt for dependency injection

## Stack

- **UI:** Jetpack Compose + Material 3
- **Navigation:** Compose Navigation
- **Networking:** Retrofit + OkHttp
- **Database:** Room
- **DI:** Hilt
- **Audio:** MediaRecorder

## Phase Implementation

### Phase 1 (MVP)
- [ ] Voice recording with MediaRecorder
- [ ] Emotion recognition (Whisper + acoustic features)
- [ ] Decision logging
- [ ] Basic chat with Twins

### Phase 2
- [ ] All 8 Twins active
- [ ] Ecosystem Brain knowledge graph

### Phase 3
- [ ] Google Fit integration
- [ ] Wearable data support
- [ ] Posture/breathing analysis

### Phase 4
- [ ] Coherence dashboard
- [ ] Real-time coaching
- [ ] Resonance frequency

### Phase 5
- [ ] Always-on display support
- [ ] Google Assistant integration
- [ ] Play Store submission

## Key Features

### Voice Recording
- Real-time waveform visualization
- Emotion analysis
- Acoustic feature extraction

### 8 Specialist Twins
Task, Coach, Growth, Health, Relationship, Financial, Creative, Research

### Coherence Metrics
7-layer coherence dashboard for nervous system optimization

## Privacy

- Local-first processing
- End-to-end encryption
- User data ownership

## Next Steps

1. Implement AuthViewModel with Hilt
2. Set up Retrofit API client
3. Implement MediaRecorder voice recording
4. Add Whisper integration for transcription
5. Wire up backend API calls

---

**Start date:** June 2024
**Phase 0 complete:** June 24, 2024
