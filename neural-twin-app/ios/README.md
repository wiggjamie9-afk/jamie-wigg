# Neural Twin iOS App

Native iOS application for Neural Twin - your personal AI companion.

## Setup

```bash
# Install dependencies (CocoaPods)
cd ios
pod install

# Open Xcode
open NeuralTwin.xcworkspace

# Build and run
⌘ + R
```

## Architecture

### Views
- **MainTabView** — Tab-based navigation (Home, Voice, Twins, Coherence, Settings)
- **HomeView** — Dashboard with stats and quick actions
- **VoiceRecordingView** — Real-time voice recording with waveform
- **TwinsView** — List of 8 Twin specialists
- **TwinChatView** — Real-time chat with a Twin
- **CoherenceView** — 7-layer coherence metrics dashboard
- **SettingsView** — Account and app settings
- **AuthView** — Sign-in / Sign-up

### Managers
- **AuthManager** — JWT token handling, login/logout, OAuth (Apple, Google)
- **AppState** — Tab selection and global app state
- **VoiceRecorder** — AVAudioEngine voice recording and processing

## Phase Implementation

### Phase 1 (MVP)
- [ ] Voice recording with AVAudioEngine
- [ ] Voice emotion recognition (Whisper + acoustic features)
- [ ] Decision logging
- [ ] Basic Twin chat interface

### Phase 2
- [ ] All 8 Twins active
- [ ] Ecosystem Brain knowledge graph
- [ ] Weekly synthesis

### Phase 3
- [ ] Apple Health integration
- [ ] Wearable data (Apple Watch, Oura, Withings)
- [ ] Computer vision (posture, breathing)

### Phase 4
- [ ] 7-layer coherence dashboard
- [ ] Real-time coherence coaching
- [ ] Harmonic frequency resonance

### Phase 5
- [ ] Lock screen widgets
- [ ] Siri Shortcuts
- [ ] App Store submission

## Dependencies

- **SwiftUI** — Native UI framework
- **Combine** — Reactive programming
- **AVFoundation** — Voice recording
- **HealthKit** — Apple Health integration
- **Socket.IO** — Real-time communication with backend

## Key Features

### Voice Recording
- Real-time waveform visualization
- Emotion analysis (happy, sad, angry, neutral, surprised, fearful, disgusted)
- Acoustic feature extraction (pitch, speech rate, jitter, formants, MFCC)

### 8 Specialist Twins
1. **Task Twin** — Productivity & prioritization
2. **Coach Twin** — Real-time voice-based coaching
3. **Growth Twin** — Learning & development
4. **Health Twin** — Biometric optimization
5. **Relationship Twin** — Social coherence
6. **Financial Twin** — Money psychology
7. **Creative Twin** — Flow state & inspiration
8. **Research Twin** — Knowledge synthesis

### Coherence Metrics
- Heart-Brain Coherence
- Breath Coherence
- Brain Coherence
- Vagal Tone
- Circadian Alignment
- Biofield Coherence
- Decision Coherence

## Privacy

- Local-first processing (voice emotion on-device)
- End-to-end encryption for sync
- User owns all data
- Can export anytime

## Next Steps

1. Implement AVAudioEngine voice recording (`VoiceRecorder` class)
2. Integrate Whisper API for transcription
3. Add acoustic feature extraction library
4. Wire up backend API calls
5. Implement real-time chat with Twins

---

**Start date:** June 2024
**Phase 0 complete:** June 24, 2024
