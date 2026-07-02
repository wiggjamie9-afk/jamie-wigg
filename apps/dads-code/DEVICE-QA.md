# Dad's Code — On-Device QA Gauntlet

**Why this exists:** the app holds a father's *irreplaceable* words. Everything has been verified in a headless sandbox, but **the launch gate is proving it on real hardware** — especially iOS Safari, where PWAs quietly break. Run this on a real iPhone **and** a real Android before any beta. Tick every box. A single ❌ on a 🔴 item blocks launch.

How to serve it for testing: from `apps/dads-code/`, run `python3 -m http.server 8000` on a machine on your network, then open `http://<that-machine-ip>:8000/` on the phone (or deploy to a preview URL). IndexedDB needs http(s), not `file://`.

---

## 🔴 1. Durability — the whole promise (do this first)

- [ ] **iPhone (Safari):** add 5+ entries (journal text, a voice note, a Code value, a Focus session). Force-quit Safari, wait, reopen → **everything is still there.**
- [ ] **iPhone:** Add to Home Screen → open the installed icon → data is present in the standalone app too.
- [ ] **iOS 7-day eviction check:** after adding entries, leave the app untouched for **8+ days**, then reopen → data survives. *(This is the #1 iOS risk. If it fails, the escalating backup nudge + Home-Screen install is the mitigation — confirm the nudge is shouting.)*
- [ ] **`storage.persist()`:** in Settings/Backup, check the storage line. On iOS it may say "not marked persistent" — that's expected; confirm the backup nudge escalates to **urgent** once ≥3 entries exist with no backup.
- [ ] **Android (Chrome):** same persistence checks; `persist()` should grant → storage marked persistent.
- [ ] **Quota meter** (Backup screen) shows a sensible used/total figure.

## 🔴 2. Backup & restore — the safety net (must be bulletproof)

- [ ] Create a vault with **text + a voice note + a photo/recipe**. Export the **self-contained `.html` backup.**
- [ ] Open that `.html` file **on a different device, fully offline** (airplane mode) → it renders every entry **and the audio plays.**
- [ ] **Clear site data** (Safari: Settings→clear; or a fresh browser) → reopen the app → import the JSON/`.dadscode` backup → **everything restores, including audio.**
- [ ] **Encrypted export:** turn on a passphrase, export encrypted, open the bundled **standalone decrypter** on another device → correct passphrase reveals content; wrong passphrase fails safely.
- [ ] Print/"Save as PDF" the keepsake book → it's readable and complete.

## 🔴 3. Voice — the emotional core (needs a real mic)

- [ ] Record a voice note on iPhone Safari → it **saves, persists, and plays back.**
- [ ] Record on Android → saves/plays.
- [ ] Voice note **survives export → restore** (see §2).
- [ ] Deny mic permission → app **degrades to text, never blocks or crashes.**
- [ ] Transcript (if dictation used) is captured alongside the audio.

## 🟠 4. Install & offline (PWA)

- [ ] iOS: "Add to Home Screen" works; icon + splash look right; opens standalone (no Safari chrome).
- [ ] Android: install prompt / menu install works; icon correct.
- [ ] Turn on airplane mode → the installed app **opens and works fully offline.**
- [ ] Service worker updates cleanly on a new version (no stale white screen).

## 🟠 5. Encryption UX (logic already verified in code)

- [ ] Set a passphrase → journal/Code/chat bodies are unreadable if you inspect storage.
- [ ] Auto-lock on returning after idle; "Lock now" works; previews hidden when locked.
- [ ] Forgot-passphrase path shows the hint and the honest "cannot be recovered" message.

## 🟠 6. Accessibility (real assistive tech)

- [ ] **VoiceOver (iOS)** / **TalkBack (Android):** can complete onboarding + add an entry by voice-over alone.
- [ ] OS text size at 200% → layout holds, nothing clipped.
- [ ] All tap targets comfortably ≥44px; visible focus when using a keyboard.
- [ ] Reduced-motion setting → the breathing orb + settle animations calm down.
- [ ] Contrast check on brass-on-paper text (it's borderline — confirm ≥4.5:1 on body copy).

## 🟢 7. Cross-cutting polish

- [ ] Fonts: currently loaded from Google Fonts CDN — **offline, they fall back to serif.** Decide: self-host before launch (recommended) or accept fallback.
- [ ] No console errors on any screen (remote-debug the phone via Safari Web Inspector / Chrome DevTools).
- [ ] Rotate portrait/landscape → no breakage.
- [ ] Long entries, emoji, non-Latin text save and render correctly.

---

### Sign-off
- iPhone model / iOS version: ____________  Pass: ☐
- Android model / version: ____________  Pass: ☐
- Blocking issues found: ________________________________________________
- Cleared for beta by: ____________  Date: __________
