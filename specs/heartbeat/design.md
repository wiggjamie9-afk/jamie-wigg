# HEARTBEAT: Design System & UI/UX

---

## Visual Identity

### Color Palette

- **Primary (Warmth):** `#FF6B9D` (soft coral pink) — represents human connection
- **Secondary (Trust):** `#6366F1` (indigo) — calm, safe space
- **Accent (Hope):** `#10B981` (emerald) — growth, positive momentum
- **Neutral Dark:** `#1F2937` (dark gray)
- **Neutral Light:** `#F9FAFB` (off-white)
- **Mood indicators:**
  - Sad: `#3B82F6` (blue)
  - Anxious: `#F59E0B` (amber)
  - Neutral: `#6B7280` (gray)
  - Happy: `#10B981` (green)
  - Hopeful: `#EC4899` (pink)

### Typography

- **Display:** Inter 700 (headings, titles)
- **Body:** Inter 400 (conversation, descriptions)
- **Mono:** SF Mono (code snippets, timestamps if needed)
- **Base size:** 16px (body), 14px (secondary), 20px (headings)

### Motion

- **Ease:** `cubic-bezier(0.4, 0, 0.2, 1)` (standard iOS easing)
- **Micro-interactions:** 200-300ms (message arrival, voice playback indicator)
- **Animations:** Subtle pulse on AI avatar, smooth fade-in for responses

---

## Screen Flows

### 1. Onboarding (5 screens)

**Screen 1.1: Welcome**
- Large emoji heart animation (pulsing)
- Heading: "Heartbeat"
- Subheading: "An AI friend who listens"
- CTA: "Let's talk"

**Screen 1.2: Select Personality**
- 4 cards:
  - 🎧 **Listener** — "Empathy first"
  - 💡 **Advisor** — "Practical help"
  - 😂 **Entertainer** — "Keep me smiling"
  - 🧙 **Mentor** — "Wise guidance"
- Default: Listener

**Screen 1.3: Select Language**
- Dropdown or scrollable list of 20+ languages
- Default: Device locale

**Screen 1.4: Select Voice**
- 3 voice previews (Maya, James, Sofia)
- Play audio snippet for each
- Option: "Text only (no voice)"

**Screen 1.5: Privacy & Trust**
- Heading: "Your privacy matters"
- Icon: 🔒
- Copy: "Everything you share stays on your phone. We never sell your data."
- Checkbox: "Got it"
- CTA: "Start chatting"

---

### 2. Main Chat Screen

**Layout:**

```
┌─────────────────────────┐
│ HEARTBEAT               │ ← Header (avatar + name)
│ [Avatar] Maya is here   │
├─────────────────────────┤
│                         │
│ Hey there. How's your   │ ← AI message (left-aligned, indigo bg)
│ day going?              │
│                         │
│                 Pretty   │
│                 rough.   │ ← User message (right-aligned, pink bg)
│                         │
│ I hear you. Want to     │
│ talk about it?          │
│                         │
│                         │
├─────────────────────────┤
│ [🎤] [Text input field] │ ← Input bar (mic button + text)
│      Type or tap mic    │
└─────────────────────────┘
```

**Elements:**

1. **Header (top, sticky):**
   - Avatar: 48px circle with AI's name below
   - Mood indicator (small emoji under avatar)
   - Menu icon (⋮) → Settings, Clear Chat, Info

2. **Message bubbles:**
   - **AI messages:** Left-aligned, indigo background (`#6366F1`), rounded corners, shadow
   - **User messages:** Right-aligned, pink background (`#FF6B9D`), white text, rounded
   - **Timestamps:** Gray, 12px, below message

3. **Input area:**
   - Mic button (left): toggles voice input
   - Text field: "Type or just talk..."
   - Send button (right): only visible if text/audio pending
   - Visual feedback: pulsing circle during recording

4. **Typing indicator (when AI is thinking):**
   - Three animated dots: "Maya is typing..."

---

### 3. Settings Screen

**Layout:**

```
┌────────────────────────┐
│ ← SETTINGS             │
├────────────────────────┤
│ Personality            │
│ [Listener         ⟩]  │ ← Tap to change
│                        │
│ Voice                  │
│ [Maya (Female)    ⟩]  │ ← Tap to change
│                        │
│ Language               │
│ [English (US)     ⟩]  │
│                        │
│ Clear Chat History     │
│ [Delete all messages ⚠]│
│                        │
│ ─────────────────────  │
│                        │
│ About Heartbeat        │
│ Version 1.0            │
│                        │
│ Privacy Policy         │
│ Terms of Service       │
│ Crisis Resources       │
│                        │
│ [Delete Account]       │ ← Destructive
│                        │
└────────────────────────┘
```

---

### 4. Mood Tracker Screen (Premium)

**Layout:**

```
┌────────────────────────┐
│ ← MOOD CALENDAR        │
├────────────────────────┤
│ Last 7 Days            │
│                        │
│ Mon Tue Wed Thu Fri Sat│
│  😢   😐   😐   🙂   😊  │
│  3.1  5.0  5.2  6.1  7.5│
│                        │
│ Trend: ↗ Getting better│
│                        │
│ Conversation Streaks   │
│ 🔥 5 days             │ ← Gamified
│                        │
│ [Start new chat]       │
│                        │
└────────────────────────┘
```

---

## Voice Design

### Voice Personas

| Name | Gender | Age | Tone | Best For |
|---|---|---|---|---|
| **Maya** | Female | 30s | Warm, patient, slightly accented | Default, Listener |
| **James** | Male | 40s | Calm, authoritative, British accent | Advisor, Mentor |
| **Sofia** | Female | 50s | Grandmotherly, slow cadence | Elderly users, Mentor |

### Voice Quality Standards

- **Sampling rate:** 44.1 kHz minimum
- **Speech rate:** 140-160 words per minute (natural, not rushed)
- **Pitch:** Natural human range (no robotic monotone)
- **Emotion:** Slight inflection changes with sentiment (sad = lower pitch, happy = slightly higher)

---

## Interaction Patterns

### Voice Input

1. User taps 🎤
2. Phone vibrates (haptic feedback)
3. Pulsing red circle appears: "Listening..."
4. User speaks
5. Circle pulsing stops → "Processing..."
6. Transcript appears: "I'm feeling really lonely today"
7. AI responds with voice + text

### Voice Output

1. AI's message appears in chat
2. Avatar starts speaking (mouth animation pseudo)
3. User can tap to replay
4. Auto-plays unless muted

### Text Mode (Offline)

1. User types message
2. AI responds instantly with text only
3. No voice; conversation continues

---

## Accessibility

### WCAG AA Compliance

- **Color contrast:** All text ≥4.5:1 contrast ratio
- **Touch targets:** All buttons ≥44px × 44px
- **Focus indicators:** Visible focus ring on all interactive elements
- **Screen reader:** Aria labels on avatar, mood indicators, buttons
- **Captions:** Optional captions for voice responses (auto-generated)

### Voice User Interface

- **Speech rate adjustable:** Settings → Voice speed (0.8x to 1.5x)
- **Visual alternatives:** Text always shown alongside voice
- **Haptic feedback:** Phone vibrates on message arrival (optional)

---

## Mobile-First Responsive Design

| Breakpoint | Device | Layout |
|---|---|---|
| <480px | Mobile | Full-width, bottom input bar |
| 480-768px | Tablet (portrait) | Slightly wider messages, larger fonts |
| >768px | Tablet/Desktop | Side-by-side with mood tracker |

**Note:** Optimize for **mobile first** (90% of users). Desktop is secondary.

---

## Dark Mode

- **Primary background:** `#0F172A` (nearly black)
- **Message bubbles:** Slightly lighter (`#1E293B`)
- **Text:** `#F1F5F9` (off-white)
- **Accents:** Keep pink (`#FF6B9D`) and indigo (`#6366F1`) but slightly adjust for dark background

**Default:** Always dark mode (battery-saving, modern aesthetic).

---

## Loading States

- **App launch:** Splash screen with pulsing heart emoji (2 seconds max)
- **First message:** "Maya is waking up..." (1-2 seconds)
- **Conversation load:** Chat history fades in gradually
- **Error state:** Red banner "Connection lost. Try text mode."

---

## Onboarding Completion

After 5 screens, user lands directly in chat with AI's first message:

> "Hey there. I'm Maya. I'm here to listen, no judgment. What's on your mind today?"

---

## Analytics (Privacy-First)

Track **without identifying:**
- Session length (daily aggregate, not per-user)
- Crash events (no user data attached)
- Feature usage: % using voice vs. text
- **Never track:** Conversation content, user identity, location, device ID

