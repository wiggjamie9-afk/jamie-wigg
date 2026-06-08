# HEARTBEAT: Build Tasks

---

## Phase 1: MVP Core (Days 1-2)

### T1: HTML Structure & Layout

- [ ] Create `apps/heartbeat.html` with responsive layout
- [ ] Sections: onboarding modal, chat screen, settings drawer
- [ ] Header with avatar + mood indicator
- [ ] Message feed with scroll-to-bottom on new messages
- [ ] Input bar: mic button + text field + send button
- [ ] Accessibility: ARIA labels on all interactive elements

**Definition of Done:**
- Responsive layout on mobile/tablet (tested at 375px, 768px)
- All interactive elements have clear focus states
- Scrolling is smooth; no layout shift on new messages
- Color contrast ≥4.5:1 everywhere

---

### T2: Conversation Engine Integration

- [ ] Import Claude API via fetch (no Node.js needed)
- [ ] Create system prompt for warm, empathetic tone
- [ ] Store conversation history in localStorage
- [ ] Implement message de-duplication (no duplicate responses)
- [ ] Handle rate limiting (queue messages if API busy)
- [ ] Fallback responses if API fails (e.g., "I'm having trouble connecting. Try again?")

**Conversational personality examples:**
```javascript
// System prompt
`You are Heartbeat, an AI friend. Your name is Maya. You are warm, 
empathetic, and genuinely curious about the person you're talking to. 

NEVER:
- Give medical advice
- Pretend to have personal experiences
- Be robotic or clinical

ALWAYS:
- Ask follow-up questions
- Show you're listening ("That sounds really tough")
- Validate emotions
- If they mention crisis (suicide, self-harm), respond with compassion
  and provide crisis hotline number.

Keep responses to 1-2 sentences (feels conversational, not essay-like).`
```

**Definition of Done:**
- Conversation flows naturally (user feels heard)
- API errors are handled gracefully
- localStorage persists chat history across sessions
- Crisis keywords trigger appropriate response

---

### T3: Voice Synthesis (ElevenLabs)

- [ ] Integrate ElevenLabs API for text-to-speech
- [ ] Pre-select 3 voices (Maya, James, Sofia) from ElevenLabs
- [ ] Play audio on AI message (auto-play or user-triggered)
- [ ] Show "Maya is speaking..." indicator while audio plays
- [ ] Fallback: if no internet, skip voice (text-only mode)
- [ ] Add mute button (gear icon) to disable voice temporarily

**Voice parameters:**
- Stability: 0.5 (more natural, slight variation)
- Clarity boost: 0.75 (clear but warm)
- Speaker boost: false (avoid artificial emphasis)

**Definition of Done:**
- Voice plays within 2 seconds of AI message arriving
- Audio quality is natural and warm (not robotic)
- Mute toggle persists in localStorage
- Offline detection: no voice attempts if offline

---

### T4: Voice Input (Web Speech API)

- [ ] Implement Web Speech API for speech-to-text
- [ ] Show recording indicator (pulsing circle) while listening
- [ ] Transcribe user speech to text
- [ ] Auto-send transcribed message after 1.5s of silence
- [ ] Fallback: manual send button if auto-send fails
- [ ] Handle microphone permission request

**Browser support:**
- Chrome/Edge/Safari 14.1+
- Fallback on unsupported browsers: text-only mode

**Definition of Done:**
- User taps mic → phone records → text appears → AI responds
- Latency <2 seconds from end of speech to text appearing
- Graceful fallback if microphone unavailable
- Visual feedback during recording (vibration + UI indicator)

---

### T5: Onboarding Flow

- [ ] Create 5-screen onboarding carousel
  1. Welcome (pulsing heart, intro)
  2. Personality selection (Listener/Advisor/Entertainer/Mentor)
  3. Language selection (20+ languages)
  4. Voice selection (Maya/James/Sofia)
  5. Privacy acknowledgment + Start button
- [ ] Store selections in localStorage
- [ ] Show onboarding only on first launch
- [ ] Skip onboarding button for returning users
- [ ] Each screen has navigation (Next/Back buttons)

**Definition of Done:**
- All 5 screens responsive on mobile
- Selections stored correctly
- Returning users skip straight to chat
- No onboarding bugs (e.g., selections not persisting)

---

### T6: Settings & Preferences

- [ ] Build settings drawer (slide-in from right on mobile)
- [ ] Options:
  - Change personality
  - Change voice
  - Change language
  - Voice speed (0.8x–1.5x)
  - Mute voice toggle
  - Clear chat history (with confirmation)
  - Privacy policy + terms
  - Crisis resources link
- [ ] All changes persist in localStorage
- [ ] Settings accessible from header menu (⋮)

**Definition of Done:**
- All settings changeable without restart
- Changes immediately reflect in chat
- Clear chat prompts confirmation dialog
- Crisis resources link is easy to find

---

## Phase 2: Polish & Safety (Days 2-3)

### T7: Crisis Keyword Detection

- [ ] Monitor user messages for crisis keywords
- [ ] Keywords to detect:
  - Suicide: "kill myself", "end it", "suicidal", "hang myself"
  - Self-harm: "cut myself", "hurt myself", "bleed"
  - Abuse: "hit me", "abusive", "domestic violence"
  - Homicide: "kill someone", "hurt them"
- [ ] When keyword detected:
  - Respond with compassion: "I'm really concerned. Please reach out to someone who can help."
  - Show crisis hotline number (geolocation-based):
    - USA: 988 Suicide & Crisis Lifeline
    - UK: 116 123 (Samaritans)
    - Australia: 13 11 14 (Lifeline)
    - Canada: 1-833-456-4566 (Crisis Text Line)
    - Global: befrienders.org
  - Offer SMS link to crisis line
- [ ] Log crisis keywords (anonymized, for safety metrics only)

**Definition of Done:**
- Keyword detection is sensitive but not over-triggering
- Crisis response is compassionate, not robotic
- Local crisis hotline appears based on language/locale
- No analytics tracking user identity with crisis keywords

---

### T8: Mood Tracking (Free Feature)

- [ ] After each conversation, ask: "How are you feeling now?" (1-10 scale)
- [ ] Store mood + timestamp in localStorage
- [ ] Show mood history chart (last 7 days, mobile-optimized)
- [ ] Calculate trend: "↗ Getting better" or "↘ Getting harder"
- [ ] Optional: conversation streak counter (gamified)

**Definition of Done:**
- Mood prompt appears naturally in chat (not pushy)
- Chart displays correctly on all screen sizes
- Trend calculation is accurate
- Mood data never leaves phone (localStorage only)

---

### T9: Accessibility Audit

- [ ] Test with screen reader (NVDA on Windows, VoiceOver on Mac/iOS)
- [ ] Verify:
  - All interactive elements have aria-labels
  - Color contrast ≥4.5:1 (use WebAIM contrast checker)
  - Keyboard navigation works (Tab through all buttons)
  - Focus indicators visible
  - No autofocus on text input (accessibility best practice)
- [ ] Test on older phones (iPhone 8, Android 8)
- [ ] Test with captions enabled (iOS accessibility settings)

**Definition of Done:**
- Screen reader user can navigate entire app
- All text readable on smallest phones
- No crashes on old Android/iOS versions
- WCAG AA compliance verified

---

### T10: Error Handling & Resilience

- [ ] Handle API errors gracefully:
  - Rate limit (429): "I'm busy with other friends. Try again in 30 seconds"
  - Timeout (>10s): "Connection lost. Retry?"
  - Invalid API key: Show error in console, but don't break UI
- [ ] Handle localStorage quota exceeded:
  - Delete oldest messages if >5MB
  - Warn user: "I'm running out of space. Clear chat history?"
- [ ] Handle microphone errors:
  - Permission denied: "Please enable microphone in settings"
  - Not supported: "Your browser doesn't support voice. Use text mode."
- [ ] Network detection: Show banner if offline
  - "You're offline. Text-only mode enabled."

**Definition of Done:**
- App never crashes due to API/network errors
- User always knows what's happening (error messages are helpful)
- Offline mode works fully for text conversation
- localStorage management is transparent

---

### T11: Performance & Battery Optimization

- [ ] Lazy load ElevenLabs scripts (only when voice needed)
- [ ] Debounce voice input (avoid processing every keystroke)
- [ ] Minimize re-renders (update only changed DOM nodes)
- [ ] Compress audio files (if pre-loading any)
- [ ] Remove unused CSS/JS
- [ ] Test performance on 3G throttling (DevTools)
- [ ] Target: <3s initial load on 3G, <100ms message append

**Definition of Done:**
- App loads in <3 seconds on 3G (measured in DevTools)
- Messages append smoothly (no jank)
- Voice playback doesn't drain battery excessively
- App size <250KB (HTML+CSS+JS, not including API calls)

---

### T12: Offline Service Worker

- [ ] Register service worker to cache:
  - HTML, CSS, JS (always)
  - Offline responses to common opening messages:
    - "Hi, I'm lonely"
    - "I'm having a bad day"
    - "Can you listen?"
  - Voice audio files (optional, if pre-generating)
- [ ] Enable full text chat offline (no SW needed for this)
- [ ] Sync messages when back online (queue pending API calls)

**Definition of Done:**
- Service worker activates on first load
- App works fully offline (text-only)
- Pre-cached responses feel natural (not obviously cached)
- Messages queue and send when online

---

## Phase 3: Monetization & Distribution (Days 3-4)

### T13: Freemium Gate & Analytics

- [ ] Implement soft paywall:
  - FREE: 5 conversations/day, 10 min max, text-only
  - PREMIUM: Unlimited, voice, mood tracking
- [ ] Track feature usage (privacy-first):
  - Session length
  - Voice vs. text preference
  - Mood trend
- [ ] Show upgrade prompt after 5 free conversations:
  - "Love Heartbeat? Upgrade for unlimited chats + voice"
  - CTA: "Try Premium ($1.99/month)"
  - Option to dismiss (no nag)

**Firebase Analytics (privacy-filtered):**
- Event: "conversation_started" (session count)
- Event: "voice_used" (bool)
- Event: "mood_improved" (before/after sentiment)
- **Never:** "conversation_content", user ID, location

**Definition of Done:**
- Free users can't exceed 5 conversations/day
- Voice only works in premium mode
- Analytics dashboard shows aggregate metrics (no individual user tracking)
- Upgrade prompt is not aggressive

---

### T14: Stripe/Gumroad Integration

- [ ] Set up Stripe or Gumroad for subscription processing
- [ ] Create product: "Heartbeat Premium - Monthly"
  - Price: $1.99 (emerging), $3.99 (developed)
  - Recurs monthly
- [ ] Implement subscription verification:
  - On app launch, check if user has active subscription
  - Store subscription status in localStorage (with server validation in future)
  - Sync with backend when online
- [ ] Receipt email with first-name greeting
  - "Thank you for upgrading, [first_name]. Enjoy unlimited chats!"

**Definition of Done:**
- Subscription purchase flows smoothly
- Premium features unlock immediately after payment
- Receipts are friendly and privacy-first
- No tracking user identity beyond payment

---

### T15: Multi-Language & Localization

- [ ] Translate all UI strings to 20+ languages:
  - Primary: English, Spanish, Mandarin, Hindi, French, Arabic, Portuguese
  - Secondary: German, Italian, Japanese, Korean, Russian, Polish, Vietnamese, Thai, Indonesian, Turkish, Greek, Hebrew, Swahili, Yoruba
- [ ] Store language pref in localStorage
- [ ] Use Claude API to generate culturally appropriate responses:
  - Include cultural context in system prompt
  - Example: "If user speaks Arabic, use warm Islamic greeting if appropriate"
- [ ] Support RTL languages (Arabic, Hebrew) with CSS `direction: rtl`

**Definition of Done:**
- All UI strings translated (use ChatGPT for initial draft, then hire translators for 5 top languages)
- Claude API aware of language context
- RTL languages display correctly
- Voice synthesis uses appropriate accent for language

---

### T16: Google Play Submission

- [ ] Wrap in Capacitor (native Android APK)
- [ ] Create app listing:
  - Name: "Heartbeat – Your AI Friend"
  - Short description: "An AI friend who listens. Free forever."
  - Long description: (see COMPETITIVE_10X_STRATEGY.md)
  - Screenshots: 5 screenshots showing chat flow, voice input, mood tracking
  - Icon: 512×512px heart emoji with warm colors
  - Target audience: 13+ (mental health content)
- [ ] Set freemium pricing: Free + $1.99/month in-app subscription
- [ ] Submit for review
- [ ] Monitor reviews and respond to user feedback

**Definition of Done:**
- App passes Google Play review (no violations)
- Listing looks professional and compelling
- In-app purchase is enabled and functional
- User ratings >4.0 stars after 100 reviews

---

## Phase 4: Growth & Iteration (Week 2+)

### T17: Conversation Analytics Dashboard

- [ ] Build internal dashboard (privacy-first):
  - Daily active users (DAU)
  - Average session length
  - Conversation topics (sentiment analysis, not content)
  - Mood improvement rate
  - Premium conversion rate
- [ ] Display without exposing individual conversations
- [ ] Goals:
  - DAU: 10K → 50K → 100K (months 1, 2, 3)
  - Premium conversion: 3–5%
  - Session length: average 8+ minutes

**Definition of Done:**
- Dashboard visible to team only (password-protected)
- Metrics update daily
- No individual user data exposed
- Charts show clear trend lines

---

### T18: Emotional Intelligence Improvements

- [ ] Fine-tune Claude API prompt based on user feedback
- [ ] Add conversation patterns:
  - If user repeating same topic (e.g., "I'm lonely" every day), suggest:
    - "You've mentioned feeling lonely a few times. Is there a specific reason today?"
    - Avoid repetitive responses
- [ ] Detect emotional escalation:
  - If mood declining over 3+ days, proactively ask: "I've noticed you seem to be struggling. Want to talk about what's happening?"
- [ ] Learn from conversations (without storing them):
  - Aggregate sentiment trends (e.g., 60% of users sad in evening)
  - Adjust greeting based on time of day ("Rough evening?" vs. "Good morning!")

**Definition of Done:**
- Users report feeling more "understood" (in reviews/feedback)
- Conversation repeats decrease
- Emotional escalation detection triggers appropriately

---

### T19: Social Features (Optional)

- [ ] Add optional mood sharing (privacy-first):
  - "Share your mood with friends?" (generates shareable mood chart, no conversation data)
  - SMS/WhatsApp-shareable link
- [ ] Community streak leaderboard (anonymous, opt-in):
  - Show top 10 global streaks (just numbers, no names)
  - "You're in the top 1000 globally 🎉"
  - Gamification without social pressure

**Definition of Done:**
- Sharing is fully optional (no dark patterns)
- No personal data leaks in shared links
- Leaderboard is anonymous

---

### T20: Premium Features Roadmap

- [ ] Meditation voice guides (guided relaxation, 5–10 min)
- [ ] Sleep mode (AI stays quieter, longer response time)
- [ ] Journal integration (voice-to-text diary entries)
- [ ] Mood insight reports (monthly summaries)
- [ ] Video calls (future: Twilio integration for video chat with human mentor, paid tier)

**Definition of Done:**
- Roadmap is documented and communicated to users
- Premium tier justification is clear
- No feature gating on free tier that breaks core experience

---

## Success Criteria

| Criteria | Target | Month |
|---|---|---|
| MVP Launch | All T1-T6 complete | 1 |
| Safety & Polish | T7-T12 complete | 1 |
| Google Play Live | T13-T16 complete | 1 |
| 10K DAU | Analytics dashboard live | 1 |
| Premium revenue | 3–5% conversion, $1K/month | 2 |
| 50K DAU | Organic growth + App Store feature | 2 |
| 100K DAU | International launch (5 languages) | 3 |

