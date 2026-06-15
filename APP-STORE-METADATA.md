# App Store Submission Metadata for 50 Buddy Apps

## App Details

**App Name:** 50 Buddy Apps
**Subtitle:** Your AI Companion for Every Journey
**Bundle ID:** `au.rhythmix.buddyapps`
**Version:** 1.0.0
**Build Number:** 1
**Category:** Health & Fitness (secondary: Lifestyle)
**Min iOS:** 14.0

---

## Marketing Description (1024 char max)

Meet your personal AI companion for every life moment. Choose from 50 distinct buddies — each with unique expertise and personality.

**Struggling with anxiety?** Anxiety Relief is your calm, grounding presence.
**Navigating a breakup?** Breakup Recovery Buddy walks with you through healing.
**Burning out at work?** Burnout Recovery Coach reframes stress as systemic, not personal.
**Want to improve your sleep?** Sleep Optimization Coach guides rest and recovery.

Every app features:
- 💬 Claude AI chat (streaming, personality-injected)
- 🎬 Avatar Studio (talking-head AI faces)
- ❤️ Health monitoring (camera-based heart rate, manual tracking)
- 📝 Journal & affirmations (offline, all on-device)
- 🔒 Complete privacy (zero tracking, all data stays on your phone)
- ⚡ Crisis detection (routes to 988, Crisis Text Line when needed)

**50 distinct personalities:**
- 28 original buddies (anxiety, depression, sleep, career, fitness, creativity, learning)
- 10 loneliness-focused (dating, relationships, making friends, community)
- 12 enterprise wellness (burnout, executive stress, sleep, work-life balance, resilience)

**Freemium model:**
- Chat with your buddy: Free (bring your own Claude API key, or subscribe for premium)
- Avatar generation, premium voice, mood export: $4.99/month or $49.99/year

**All data stays on your device.** No cloud uploads. No tracking. No ads (premium).

---

## Keywords (up to 30 chars each, 5-10 total)

1. `AI companion`
2. `mental health`
3. `loneliness support`
4. `wellness coach`
5. `anxiety relief`
6. `sleep guide`
7. `burnout recovery`
8. `offline diary`

---

## Privacy Policy URL

`https://rhythmixapp.com.au/privacy.html`

(Create this if it doesn't exist)

---

## Support URL

`https://rhythmixapp.com.au/help`

(Create support/FAQ page)

---

## Demo Account (if needed for review)

- **Email:** `reviewer@example.com` (optional)
- **Password:** N/A (no login required)
- **Notes:** Each buddy works as a standalone app. No authentication. Paste Claude API key in Settings to test chat.

---

## Screenshots (5-6 for 6.1" iPhone)

Recommended shots:

1. **Launcher Hub** — Grid of all 50 buddy emoji cards
   - Caption: "Choose your buddy: 50 distinct personalities"

2. **Home Tab (Anxiety Relief example)** — Greeting + affirmation + mood input
   - Caption: "Daily affirmations tailored to your journey"

3. **Chat Tab** — User message + buddy response (streaming)
   - Caption: "AI chat with personality injection"

4. **Health Tab** — Heart rate card + camera capture
   - Caption: "Track your wellness with camera-based heart rate"

5. **Settings Tab** — API key input + avatar studio + voice settings
   - Caption: "Configure your buddy (optional: Avatar Studio, ElevenLabs)"

6. **Premium Upgrade** — Pricing modal ($4.99/mo, $49.99/yr)
   - Caption: "Unlock avatars, premium voice, and data export"

---

## App Preview Video (optional, 15-30 seconds)

Sequence:
- Open buddies.html → tap a buddy
- Show home tab (affirmation)
- Show chat tab (send message, get response)
- Show health tab (quick heart rate check)
- Show settings (API key entry)
- Text overlay: "50 AI Buddies. One tap away."

---

## Version Release Notes

```
v1.0.0 Launch

🤝 50 AI Buddy Apps — Your personal companion for every journey.

Features:
✅ Choose from 50 distinct buddies (mental health, relationships, wellness, career)
✅ Claude AI streaming chat with personality injection
✅ Offline-first PWA (all data on your device, zero tracking)
✅ Camera-based heart rate monitoring + manual health logging
✅ Journal, affirmations, mood tracking
✅ Avatar Studio (Higgsfield AI talking-head avatars)
✅ ElevenLabs TTS voice synthesis
✅ Crisis detection with emergency resources
✅ Freemium: Chat free, premium unlocks avatars + export ($4.99/mo or $49.99/yr)

No ads. No login. All your data stays on your device.
```

---

## Compliance Checklist

- [ ] Privacy policy created and linked
- [ ] EULA/Terms created (if needed)
- [ ] Age rating questionnaire completed (IARC)
- [ ] No crash reports on submission
- [ ] Camera permission message clear
- [ ] Microphone permission message clear
- [ ] Test on iOS 14+
- [ ] Dark mode support verified
- [ ] Notch/Dynamic Island safe areas verified
- [ ] Sign in with Apple (if monetized) - N/A (Gumroad handles)

---

## Rejection Risk Mitigation

**Potential rejection reasons & fixes:**

1. **"App doesn't provide value on its own"**
   - Fix: Clarify that chat works free with user's own API key. Premium features are optional.

2. **"Misleading health claims"**
   - Fix: Add disclaimer: "Not a medical device. Not a substitute for professional help."

3. **"Crashes on launch"**
   - Fix: Test thoroughly on iOS 14, 15, 16, 17. Verify Service Worker loads.

4. **"Requires external account/key entry"**
   - Fix: Acceptable — many apps require API keys. Just be clear in onboarding.

5. **"High crash rate on camera access"**
   - Fix: Test PPG heart rate thoroughly. Fallback to manual HR entry works.

---

## Post-Launch Monitoring

- Monitor crash reports in App Store Connect
- Track user reviews (aim for 4.5+ stars)
- Collect feedback on premium conversion rate
- Plan next features based on user requests (avatar improvements, more buddies, voice cloning)

---

## Timeline

- **Week 1:** Create Xcode build, sign with Apple Developer account
- **Week 2:** Submit to App Store Review
- **Week 3:** Hopefully: App Review approval → TestFlight beta
- **Week 4:** Launch on App Store

