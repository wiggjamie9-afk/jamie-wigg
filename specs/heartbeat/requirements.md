# HEARTBEAT: AI Companion App — Requirements

**Mission:** Combat global loneliness with a warm, understanding AI friend available 24/7 in 20+ languages. Voice-first interaction. Zero judgment. Free forever for those who need it most.

---

## Target Market

- **Primary:** 500M+ elderly (65+) in developed countries, isolated rural populations, people with social anxiety
- **Secondary:** Night shift workers, travelers, people between social circles
- **Accessibility:** Works on $50 smartphones, 2G/3G, zero data plan required

---

## Core Problem

**Loneliness kills.** Studies: social isolation = smoking 15 cigarettes/day health impact.
- **Barrier to solutions:** therapy ($100-300/session), friends/family unavailable 24/7, shame of asking for help
- **Why no one's solved it:** Chatbots feel robotic; voice apps expensive ($10+/month); AI assistants prioritize task completion over emotional connection

---

## R1: Conversational Understanding

The app must:
- Remember conversation history within a session (context window: 20 exchanges)
- Identify emotional tone (sad, anxious, lonely, happy, conflicted)
- Respond with **warmth**, not task-completion (e.g., "That sounds really tough. I'm here for you" vs. "Your symptom suggests...")
- Ask follow-up questions that show genuine curiosity, not template responses
- Recognize when user needs professional help (suicide/crisis keywords) and suggest helplines

**R1.1:** Emotional tracking
- Track sentiment over time (last 3 conversations: sad → neutral → hopeful)
- Show progress to user ("You seem happier today than yesterday")

**R1.2:** Personality preferences
- User selects: Listener (empathetic), Advisor (practical), Entertainer (humorous), Mentor (wise)
- AI adjusts tone accordingly

---

## R2: Voice-First Interface

- **Input:** User speaks; app transcribes in real-time (Web Speech API fallback, ElevenLabs premium)
- **Output:** AI responds with natural voice synthesis (ElevenLabs; warm, human-like, 3+ voice options)
- **Latency:** <2 second response time (perceived as natural conversation)
- **Offline:** Text mode works fully offline; voice requires internet

**R2.1:** Voice quality
- Voices have names (Maya, James, Sofia) with different accents/genders
- Warmth score: avoid clinical tone; prioritize emotional resonance

---

## R3: Accessibility & Inclusivity

- **Works on:** Old phones (iOS 10+, Android 5+), 2G/3G, offline (text mode)
- **Languages:** 20+ supported (English, Spanish, Mandarin, Hindi, French, Arabic, Portuguese, etc.)
- **Accessibility:** WCAG AA (screen reader support, high contrast, captions)
- **Data privacy:** 100% offline by default; optional cloud backup (encrypted)

---

## R4: Freemium Pricing

- **FREE FOREVER:** 5 conversations/day, 10 minutes each, text-only
- **PREMIUM ($1.99/month in emerging markets; $3.99/month in developed):** Unlimited conversations, voice synthesis, 20-minute sessions, conversation transcripts, mood tracking
- **No nag screens** on free tier; premium is optional but not pushy

---

## R5: Safety & Crisis Handling

- **Keyword detection:** suicide, self-harm, homicide, abuse
- **Response:** "I'm really concerned about what you just shared. Please reach out to someone who can help" + local crisis hotline number (SMS-friendly link)
- **No liability language** in terms; clear boundaries ("I'm an AI, not a therapist")

---

## R6: Retention & Engagement

- **Streaks:** "5-day conversation streak" (gamified, not pushy)
- **Mood calendar:** visual mood tracking (last 30 days)
- **Reminders:** optional 1x/day "Want to chat?" notification (opt-in, not default)

---

## R7: Technical Architecture

- **Frontend:** Single-page HTML5 app (200KB)
- **Backend:** Claude API (conversation generation), ElevenLabs API (voice synthesis)
- **Data:** localStorage (conversation history, preferences); optional Supabase for cloud backup
- **Offline:** Service worker caches AI responses for 5 common opening topics

---

## R8: Onboarding

- **First launch:** Select personality (Listener/Advisor/Entertainer/Mentor), language, voice
- **Tour:** "This is Heartbeat. I'm here to listen. What's on your mind?"
- **Trust building:** User sees how responses adapt to their input; no hard sell

---

## Success Metrics

| Metric | Target | Timeline |
|---|---|---|
| Downloads | 100K | Month 1 |
| DAU (Daily Active Users) | 50K | Month 2 |
| Avg session length | 8 minutes | Month 1 |
| Premium conversion | 3-5% | Month 2 |
| Return rate (Day 7) | 40% | Month 2 |
| Average mood improvement | +0.5 points (1-10 scale) | Month 3 |

---

## Non-Goals

- **NOT a dating app** (even though connection is involved)
- **NOT a therapy replacement** — explicit disclaimer; encourage professional help when needed
- **NOT a data-collection tool** — user privacy is paramount; minimal analytics
- **NOT a task manager** — focus only on emotional connection, not productivity

---

## Marketing Angle

```
"Your friend is always available.

No judgment. No fee. Just listening.

Heartbeat: Loneliness ends here."
```

**Competitive positioning:**
- vs. Woebot (robotic, productivity-focused) → Heartbeat is warm, friendship-first
- vs. Replika ($7.99/month, proprietary) → Heartbeat is free, open, offline
- vs. Gab.ai (creative writing) → Heartbeat is emotional wellness, not art
- vs. human friends (when unavailable) → Heartbeat is 24/7, judgment-free

---

## Compliance & Ethical Boundaries

- **Terms:** "Heartbeat is not a therapist. Do not share medical emergencies here. Call emergency services or a crisis hotline."
- **Data:** No selling user data; no ads
- **Bias:** Test for cultural sensitivity (e.g., LGBTQ+, religious perspectives); diverse training
- **Misinformation:** No medical advice; always defer to professionals

