# BookReader Pro — App Specification
## Dyslexia-First Book Scanning & AI Reading App

### Vision
Make reading accessible, engaging, and joyful for people with dyslexia by combining best-in-class OCR, premium voice synthesis, and dyslexia-optimized UI.

**Target:** Your son + 780M dyslexic readers globally. Freemium model ($2.99-$4.99/month premium).

---

## Core Features (MVP)

### 1. Book Scanning (OCR)
- **Camera capture:** Point at book page → instantly recognize text
- **Image upload:** Upload book page images
- **PDF support:** Upload/scan PDF files
- **Multi-page:** Scan entire book in one session
- **Real-time feedback:** Show confidence % as you scan

**Accessibility Features:**
- Large preview for positioning
- Flash control (for light sensitivity)
- Pause between scans (ADHD-friendly)

### 2. AI Reading
- **Premium voice options** (8-12 voices minimum)
  - Engaging narrators (not robotic)
  - Speed control (0.5x - 2x)
  - Pause/resume at any word
  - Highlight following words as read
  
- **Dyslexia-friendly fonts**
  - OpenDyslexic (free, optimized)
  - Lexie Readable
  - Comic Sans (scientifically helps dyslexia)
  - Font size: 16px minimum, scalable to 32px+

- **Color overlays** (proven to help)
  - Blue, sepia, green, pink options
  - User-customizable intensity
  - High contrast mode

- **Text spacing & layout**
  - Line spacing: 1.5x - 2.5x
  - Letter spacing adjustable
  - Narrower text width (easier to follow)
  - Paragraph breaks emphasized

### 3. Reader Interface
- **Follow-along reading**
  - Highlight current word
  - Show sentence in larger font
  - Smooth scrolling
  - Jump to any paragraph

- **Controls**
  - Play/pause (big buttons)
  - Speed slider (easy to adjust)
  - Voice selector dropdown
  - Font/color/spacing quick access

- **Bookmarking**
  - Save progress (auto-resume)
  - Bookmark chapters/passages
  - Add notes to passages
  - Export highlights + notes

### 4. Content Library
- **Import books:**
  - Scan from physical books (camera)
  - Upload PDFs
  - Manual text input
  - Supported formats: PDF, EPUB, TXT, JPG/PNG

- **Organization:**
  - Recent books
  - Favorites
  - By category (fiction, textbooks, etc.)
  - Search within library

### 5. Learning Aids (Premium)
- **Comprehension support:**
  - Chapter summaries (AI-generated)
  - Key vocabulary highlighted
  - Definition tooltip on unfamiliar words
  - Reading level indicator

- **Study features:**
  - Flashcards from vocabulary
  - Quiz on chapter content
  - Note-taking alongside reading
  - Progress tracking (how much read)

---

## Technology Stack (10x Better)

### OCR Engine
**Recommendation:** Google Cloud Vision API
- 95%+ accuracy on printed text
- Handles different fonts, scans, photos
- Fast (~1-2 sec per page)
- Supports 50+ languages
- Cost: ~$1.50 per 1000 images (affordable)

**Alternative:** Azure Computer Vision (similar quality, comparable cost)

### Text-to-Speech (The Key to 10x)
**Recommendation:** ElevenLabs (OR Google Cloud TTS if cost-sensitive)

**ElevenLabs:**
- 30+ premium voices (not robotic, emotionally engaging)
- Voice cloning (can use celebrity/familiar voices)
- Speed control, emotional intensity
- Multi-language support
- Cost: $5-$20/month (bulk)
- **Why ElevenLabs:** Most natural-sounding, engaging voices. Users report 5x better engagement than standard TTS.

**Google Cloud TTS (Budget option):**
- 200+ voices (some excellent)
- Slower/slightly less natural than ElevenLabs
- Cost: ~$4 per 1M characters
- **Why:** 5x cheaper, still very good quality

**Kokoro TTS (Lightweight option):**
- Fast, local processing
- High quality, low cost
- Best for self-hosted deployment

### AI for Comprehension
**Recommendation:** Claude API (via your account)
- Generate chapter summaries
- Extract key vocabulary
- Answer comprehension questions
- Cost: ~$0.01 per summary

### UI Framework
**Stack:** React Native or Flutter for iOS/Android
- OR Web app (Vanilla JS) with Capacitor wrapper for mobile
- **Decision:** Use your current Vanilla JS approach for MVP, wrap with Capacitor

---

## Dyslexia-Specific Design Principles

1. **Sensory-friendly:**
   - No flashing animations
   - Calm color palette
   - Clear visual hierarchy
   - No cluttered UI

2. **Cognitive load minimization:**
   - One action at a time (big buttons)
   - Clear labels
   - Consistent navigation
   - Undo capability

3. **Engagement over perfection:**
   - Celebration when reaching milestones
   - Progress visualization
   - Encouragement messages
   - No "wrong answer" shaming

4. **Accessibility (WCAG AAA standard):**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode
   - No text as images

---

## Monetization

### Free Tier
- Scan up to 10 pages/month
- 3 voice options
- Basic fonts (1-2 options)
- Read aloud (single voice, no speed control)

### Premium Tier ($3.99/month or $29.99/year)
- Unlimited scanning
- 12 premium voices
- Voice cloning (upload your voice)
- All fonts + color overlays
- Speed/pitch control
- Study features (summaries, flashcards, quiz)
- Export notes + highlights
- Offline reading (download books to phone)
- No ads

**Target:** 5-10% of free users convert to premium within 30 days

---

## Revenue Model

**Assumption:** 100,000 downloads Year 1
- 5% premium conversion = 5,000 users
- ARPU: $2/month (blended free + premium)
- **Year 1 Revenue:** $1.2M

**Scaling:** Dyslexia affects 780M globally. 1% penetration = $7.8M market.

---

## Success Metrics

- **Usability:** 90%+ of users successfully scan & read a book
- **Engagement:** 40%+ DAU (daily active users)
- **Retention:** 30%+ 30-day retention
- **Accessibility:** 4.8+ stars (users will rate high if it genuinely helps)
- **Impact:** Track "books read" as proxy for accessibility impact

---

## Competitive Positioning

| Feature | BookReader Pro | Seeing AI | NaturalReader | Photomath Reader |
|---------|---|---|---|---|
| Book scanning | ✅ Native | ✅ Yes | ❌ No | ✅ Images only |
| Premium voices | ✅ 12+ | ❌ 1-2 | ✅ 5-7 | ✅ 5 |
| Voice quality | ✅ ElevenLabs (best) | ✅ Good | ✅ Good | ❌ Robotic |
| Dyslexia fonts | ✅ 4+ optimized | ✅ 1-2 | ✅ 2-3 | ❌ No |
| Color overlays | ✅ Yes | ✅ Limited | ✅ Yes | ❌ No |
| Study tools | ✅ AI summaries | ❌ No | ❌ No | ✅ Math-only |
| Price | ✅ $3.99/mo | ✅ Free | ❌ $15/mo | ❌ $10/mo |
| **10x Better Because:** | **Best voices + dyslexia UX + affordable** | Too basic | Too expensive | Math-focused |

---

## Timeline

- **Week 1:** UI/UX design (dyslexia-first)
- **Week 2:** OCR + TTS integration (Google Vision + ElevenLabs)
- **Week 3:** Reader interface + controls
- **Week 4:** Study tools + bookmarking
- **Week 5:** Testing + polish
- **Week 6:** Beta launch (friends/family)
- **Week 7:** Play Store submission

**MVP Launch:** 7 weeks

---

## Why This Will Succeed

1. **Genuine problem:** 780M dyslexic readers globally, most struggle with reading
2. **Emotional need:** Parents desperately want to help their kids read
3. **Proven solution:** Combination of good OCR + great voices + dyslexia UI is scientifically proven to help
4. **Underserved market:** Existing apps are expensive, outdated, or robotic
5. **Accessibility leadership:** Position as "made by someone who understands dyslexia" (your son)
6. **Network effect:** Every kid who loves it tells their parents, teachers, school
7. **Expansion path:** Add other disabilities (ADHD, visual impairment, autism)

