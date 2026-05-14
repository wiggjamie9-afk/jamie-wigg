# RHYTHMIX Mobile

State-of-the-art cinematic mobile app for iOS + Android, built around the AI music platform from this monorepo's landing pages and promo videos.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Expo SDK 54** + React Native 0.81 + New Architecture | Cloud builds via EAS, no Xcode needed for dev |
| Routing | **Expo Router v6** (file-based, typed routes) | First-class deep linking + auth gating |
| Motion | **Reanimated 4** + **react-native-worklets** | 60–120fps gesture- and scroll-driven motion |
| Graphics | **@shopify/react-native-skia 2.6** | GPU-accelerated gradients, blur, grain, waveforms |
| Styling | **NativeWind 4** + Tailwind 3.4 | Tailwind ergonomics on RN, no runtime cost |
| Auth | **Supabase** + PKCE + Apple Sign In + Google Sign In | Native sign-in flows, secure session storage |
| Audio | **expo-audio 1.1** with background mode + lock-screen | Production-ready replacement for expo-av |
| Payments (Android/web) | **Stripe PaymentSheet 0.65** | Apple Pay / Google Pay built in |
| Payments (iOS) | **StoreKit / RevenueCat (stub)** | Apple's IAP rules require this for digital goods |
| State | **Zustand 5** | Tiny, idiomatic, no boilerplate |
| Storage | **expo-secure-store** + **react-native-mmkv** | Encrypted secrets + fast KV cache |

## What's in the box

```
app/
  _layout.tsx                Root providers (Stripe, SafeArea, GestureHandler)
  index.tsx                  Cinematic landing (Skia aurora + Reanimated entrance)
  (auth)/sign-in.tsx         Apple + Google sign-in (Supabase PKCE id-token flow)
  (app)/_layout.tsx          Auth gate — redirects to sign-in if no session
  (app)/(tabs)/index.tsx     Feed of tracks with animated Skia waveforms
  (app)/(tabs)/create.tsx    Prompt-to-track UI (hook up your generation API)
  (app)/(tabs)/library.tsx   Stub — wire to Supabase Storage
  (app)/(tabs)/profile.tsx   Account + lifetime upgrade entry
  (app)/player.tsx           Full-screen player, Skia waveform, lock-screen audio
  (app)/checkout.tsx         $149 lifetime — Stripe on Android/web, IAP stub on iOS

components/cinematic/
  AuroraBackdrop.tsx         Animated Skia gradient + film grain
  Waveform.tsx               Reactive Skia bars, drop-in for FFT data
  CinematicButton.tsx        Pressable with haptics + spring + gradient/blur

lib/
  supabase.ts                Client with PKCE + SecureStore + processLock
  session.ts                 useSession hook + signOut
  auth-apple.ts              Apple Sign In → Supabase id-token exchange
  auth-google.ts             Google Sign In → Supabase id-token exchange
  payments.ts                Routes iOS → IAP stub, Android/web → Stripe sheet
  audio-store.ts             Zustand store for current track + playback state
  theme.ts                   Palette + motion tokens (synced with tailwind.config.js)
```

## Setup (one-time)

```bash
cd rhythmix-mobile
cp .env.example .env
# fill in EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY,
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY, EXPO_PUBLIC_STRIPE_INTENT_URL,
# EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
npm install
```

## Dev workflow (iPhone-only)

You don't need a Mac. The cycle:

1. Edit files in **GitHub Codespaces** (browser VS Code on your phone).
2. Push a dev build to your phone with **EAS**:
   ```bash
   npx eas-cli login
   npx eas-cli build --profile development --platform ios
   ```
3. Install the resulting `.ipa` via TestFlight or the EAS install link.
4. Run `npm start` from Codespaces — your phone's dev client connects over LAN/tunnel for hot reload.
5. For Android, swap `--platform ios` → `--platform android` to get an `.apk`.

Once the dev client is on your phone you only need to rebuild when you change native config (`app.json`, native deps).

## Cloud build profiles

`eas.json` ships three profiles:

- **development** — internal distribution, dev client, large iOS resource class.
- **preview** — internal distribution, release JS, for stakeholder testing.
- **production** — App Store / Play Store, auto-increment build numbers.

```bash
# Quick smoke build
npx eas-cli build --profile preview --platform all

# Submit when reviews pass
npx eas-cli submit --profile production --platform all
```

## Before you ship

- Replace `REPLACE_ME` / `REPLACE_WITH_EAS_PROJECT_ID` in `app.json` after running `eas init`.
- Fill `appleId`, `ascAppId`, `appleTeamId` in `eas.json` for iOS submission.
- Generate `google-services.json` (Firebase or Google Cloud) for Android Google Sign In.
- Set `usesAppleSignIn: true` only if you actually have the Apple Sign In capability on your developer team.
- Apple Developer Program: $99/yr · Google Play Console: $25 one-time.
- For iOS lifetime IAP: wire RevenueCat in `lib/payments.ts::purchaseIAP`.

## Architecture notes

- **Auth gate** lives in `app/(app)/_layout.tsx` — a `<Redirect>` based on session, no flicker.
- **Skia + Reanimated coexistence**: shared values from Reanimated drive Skia's `useDerivedValue` directly. Don't mix `Animated.Value` here.
- **Tab bar blur**: only on iOS (`Platform.OS === 'ios'` check in `(tabs)/_layout.tsx`). Android gets a solid colour.
- **Audio session**: configured once in the player screen via `setAudioModeAsync` — survives backgrounding.
- **Payments**: the iOS / Android split is enforced at the `lib/payments.ts` boundary so the screens stay clean.

## License

Proprietary — part of the RHYTHMIX project.
