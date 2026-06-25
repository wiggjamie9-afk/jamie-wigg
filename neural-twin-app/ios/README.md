# Neural Twin — iOS App

Native SwiftUI app for Neural Twin. The single source file is `NeuralTwin/App.swift`
(SwiftUI App lifecycle, `@main struct NeuralTwinApp`).

## Project generation

There is **no committed `.xcodeproj`** — it is generated from `project.yml` with
[XcodeGen](https://github.com/yonaskolb/XcodeGen) so the project file never drifts
or causes merge conflicts.

```bash
cd ios
brew install xcodegen      # one-time
xcodegen generate          # writes NeuralTwin.xcodeproj from project.yml
open NeuralTwin.xcodeproj   # build & run with ⌘R  (needs Xcode 15+, iOS 17 SDK)
```

In CI (Codemagic), run `xcodegen generate` as a pre-build step, then build the
`NeuralTwin` scheme.

## Configuration

| Setting | Value |
|---|---|
| Bundle ID | `com.neuraltwin.app` |
| Deployment target | iOS 17.0 |
| Display name | Neural Twin |
| Signing | Automatic (set your Team in Xcode, or via Codemagic env) |

Usage strings (in `NeuralTwin/Info.plist`): microphone (voice capture) and camera
(book scanning). Add an `AppIcon` 1024×1024 image to
`NeuralTwin/Assets.xcassets/AppIcon.appiconset/` before App Store submission — the
slot exists but is currently empty (builds run fine without it).

## What exists vs. what's next

**Exists:** the full SwiftUI UI — Home, Voice, Twins carousel (9 Twins),
8-layer Coherence dashboard, Metacognition view, Settings, Auth. All screens
currently render **mock/hardcoded data**.

**Next (see repo task tracker):**
1. Networking layer — `URLSession` API client + `Codable` models pointing at the
   backend, Keychain token storage.
2. Real auth (Sign in with Apple via `AuthenticationServices`) replacing the
   `AuthManager.login` stub.
3. Replace hardcoded coherence/twin/stat data with live backend responses.
4. Real voice capture (`AVAudioEngine` + microphone permission) replacing the
   timer-based placeholder, if voice stays in v1.

## Architecture (current)

- **Views:** `MainTabView`, `HomeView`, `VoiceRecordingView`, `TwinsCarouselView`,
  `TwinChatView`, `CoherenceView`, `MetacognitionView`, `SettingsView`, `AuthView`.
- **State:** `AuthManager`, `AppState`, `VoiceRecorder` (`ObservableObject`s).
- **Design:** `DesignTokens` (palette, spacing, radii) drives the glassmorphism UI.
