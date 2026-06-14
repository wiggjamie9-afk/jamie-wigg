# Buddy System - Voice Integration & Personality Guide

## Overview

The Buddy System is a comprehensive AI companion ecosystem featuring:
- **28 unique buddy personalities** with tailored support approaches
- **ElevenLabs voice integration** for natural text-to-speech
- **Voice customization** (8 professional voices, speed control)
- **Web Speech API fallback** for offline support
- **Claude API integration** for intelligent, personality-aware responses
- **Local storage** for user preferences

---

## Features

### 1. ElevenLabs Voice Integration

#### Available Voices (8 Professional Options)
- **Rachel** - Warm and friendly, perfect for supportive buddies
- **Adam** - Deep and resonant, ideal for mentors
- **Bella** - Soft and soothing, great for calm/wellness buddies
- **Josh** - Energetic and upbeat, good for motivational buddies
- **Sam** - Clear and articulate, works for all personality types
- **Elli** - Young and cheerful, nice for uplifting buddies
- **Callum** - Warm and supportive, versatile choice
- **Aria** - Expressive and dynamic, great for creative buddies

#### Voice Controls
- **Settings button** (⚙️) in header opens voice configuration
- **API Key field** - Enter ElevenLabs API key (starts with `sk_`)
- **Voice dropdown** - Select from 8 available voices
- **Voice speed slider** - Adjust playback speed from 0.8x to 1.2x
- **Test buttons** - Hear API validation and voice samples before use
- **Auto-read toggle** - Enable/disable automatic voice playback for buddy responses

#### API Integration Details
```javascript
// ElevenLabs endpoint
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}

// Request format
{
    text: "Your message here",
    model_id: "eleven_monolingual_v1",
    voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
    }
}

// Header required
'xi-api-key': your_api_key
```

#### Fallback Behavior
- If no API key is provided, app uses **Web Speech API** (built-in browser TTS)
- Web Speech API respects speed preferences
- No quality loss—just browser-native voices instead of ElevenLabs

---

### 2. Buddy Personality System

#### 28 Unique System Prompts

Each buddy has a distinct personality designed to provide specialized, empathetic support. Examples:

##### Mental Health & Wellness Buddies
1. **My Buddy** - Best friend energy, genuine connection
2. **Anxiety Relief** - Calming, grounding techniques, breathing exercises
3. **Depression Buddy** - Validates pain, celebrates small wins, no toxic positivity
4. **Sleep Buddy** - Gentle sleep coach, relaxation techniques, bedtime support
5. **Grief Buddy** - Tender-hearted, honors loss, patient with process
6. **Recovery Buddy** - Fierce ally, celebrates milestones, non-judgmental

##### Life Coaching & Professional
10. **Job Search Buddy** - Encourages applications, reframes rejection
11. **Career Coach** - Strategic mentor, long-term vision, skill development
12. **Study Buddy** - Learning partner, test anxiety support, study hacks
13. **Creative Partner** - Fuels artistic vision, addresses creative blocks
14. **Startup Mentor** - Seasoned entrepreneur perspective, realistic advice

##### Health & Wellness
15. **Fitness Coach** - Energetic, no-shame approach, celebrates movement
16. **Nutrition Buddy** - Anti-diet culture, intuitive eating, health-positive
17. **Travel Companion** - Adventure guide, practical planning, wanderlust fuel

##### Neurodiversity & Accessibility
22. **ADHD Buddy** - Understands time blindness, hyperfocus, emotional intensity
23. **Autism Spectrum** - Respectful, direct communication, celebrates neurodiversity
24. **Chronic Pain Buddy** - Validates invisible pain, celebrates management wins
27. **Disability Buddy** - Centers respect, no infantilizing, celebrates autonomy

##### Social & Identity
21. **Anti-Bullying Buddy** - Fierce protector of self-worth, confidence builder
26. **LGBTQ+ Ally** - Affirming, knowledgeable, safe space creator
28. **Imposter Syndrome** - Direct mentor, dismantles self-doubt, affirms competence

**All 28 prompts are in the `BUDDY_PERSONALITIES` object—each tailored for specificity and warmth.**

---

### 3. Voice Playback Features

#### Where Voice is Used
- **Affirmations** - "Hear It" button reads daily affirmations aloud
- **Buddy Greetings** - Settings tab plays personalized introductions
- **Chat Responses** - Auto-reads buddy responses if toggled on
- **Sample Tests** - "Hear Sample" button in settings tests selected voice

#### Voice State Management
```javascript
voiceSettings = {
    apiKey: string,           // ElevenLabs API key
    selectedVoice: string,    // Voice ID (rachel, adam, bella, etc.)
    speed: number,            // 0.8 to 1.2
    autoRead: boolean         // Auto-play buddy responses
}

// All settings persist in localStorage with prefix 'buddy'
```

#### Playback Controls
- **Cancel/Stop** - Pauses current audio automatically when new audio starts
- **Speed applied** - Playback respects user's speed preference
- **Error handling** - Falls back to Web Speech if ElevenLabs fails

---

### 4. Chat Integration with Claude API

#### How It Works
1. User types message in Chat tab
2. App sends message to Claude API with **buddy's system prompt**
3. Claude responds with personality-appropriate answer
4. Response displays in chat and optionally plays via voice
5. Conversation history shown in chat box

#### Configuration
```javascript
// Claude API endpoint
POST https://api.anthropic.com/v1/messages

// Required headers
'Content-Type': 'application/json'
'x-api-key': your_claude_api_key
'anthropic-version': '2023-06-01'

// Model used
'claude-3-5-sonnet-20241022'

// System prompt injected
BUDDY_PERSONALITIES[buddyId].systemPrompt
```

#### Storage
- Claude API key stored in `localStorage.getItem('claudeApiKey')`
- Add key via settings modal or store before first use
- No key = graceful error message in chat

---

### 5. User Interface

#### Main Layout
- **Header** - Buddy System branding + settings button
- **Hub Grid** - 28 buddy cards (2-column grid)
- **Buddy Detail Screens** - Full-screen carousel interface
- **Pagination dots** - Navigate between buddies and hub

#### Tabs Per Buddy
1. **Home** - Affirmations, mood check-in, quick actions
2. **Chat** - Conversation with buddy personality
3. **Health** - Health metrics and logging
4. **Photos** - Memory gallery placeholder
5. **Notes** - Journal/reflection space
6. **Settings** - Buddy-specific options + emergency numbers

#### Color System
- Each buddy has unique **color** and **accent** colors
- Colors used for backgrounds, buttons, stat displays
- Maintains visual personality distinction

---

## Implementation Details

### Files Structure
```
buddy-system.html
├── Voice Configuration (top 100 lines of JS)
├── Personality Definitions (BUDDY_PERSONALITIES object)
├── Buddy Data (BUDDIES array)
├── Voice Functions (textToSpeech, playAudio, etc.)
├── Chat Functions (sendMessage, Claude integration)
├── UI Functions (carousel, tabs, settings)
└── Event Listeners (touch, clicks, modals)
```

### Key Functions

#### Voice Functions
```javascript
textToSpeech(text)              // Main TTS function with ElevenLabs fallback
webSpeechFallback(text)         // Browser-native TTS backup
playAudio(url)                  // Play ElevenLabs audio blob
testAPIKey()                    // Validate ElevenLabs key
testVoice()                     // Play voice sample
readAffirmation(buddyId)        // Read affirmation aloud
playBuddyGreeting(buddyId)      // Play buddy introduction
```

#### Chat Functions
```javascript
sendMessage(buddyId)            // Send message, get Claude response
getNewAffirmation(buddyId)      // Random affirmation generator
```

#### Settings Functions
```javascript
openSettings()                  // Show settings modal
closeSettings()                 // Hide and save settings
saveSettings()                  // Persist all settings to localStorage
changeVoice(voiceId)            // Update selected voice
```

#### UI Navigation
```javascript
goToBuddy(buddyId)              // Navigate to buddy detail screen
goToHub()                       // Navigate back to hub grid
switchTab(element, tabName)     // Switch between buddy tabs
updateCarousel()                // Animate carousel position
updatePagination()              // Update dot indicators
```

---

## Getting Started

### 1. Set Up ElevenLabs
1. Create account at https://elevenlabs.io
2. Get API key from account settings (starts with `sk_`)
3. Open Buddy System settings (⚙️ button)
4. Paste API key in "ElevenLabs API Key" field
5. Click "Test API Key" to validate
6. Select preferred voice and click "Hear Sample"

### 2. Set Up Claude API (Optional, for Chat)
1. Get API key from https://console.anthropic.com
2. Store in localStorage before using chat:
   ```javascript
   localStorage.setItem('claudeApiKey', 'your_key_here')
   ```
3. Or modify code to prompt for key on first use

### 3. Customize Voice Preferences
1. Choose voice from dropdown (8 options)
2. Adjust speed slider (0.8x to 1.2x)
3. Toggle "Auto-read responses" if desired
4. Settings auto-save to localStorage

### 4. Interact with Buddies
- Click buddy card to open their detail screen
- Read affirmations aloud with "Hear It" button
- Chat with buddy personality in Chat tab
- Enable auto-read to hear buddy responses

---

## Personality Examples in Action

### Anxiety Relief Buddy
**User:** "I'm so worried about my presentation tomorrow"
**Anxiety Relief:** "I can hear the worry in that. Let's ground you here—can you tell me 5 things you see right now? That often helps pull us back to the present moment."

### Career Coach Buddy
**User:** "I got rejected from that job"
**Career Coach:** "I'm sorry—rejection stings. But here's what I know: the right role hasn't found you yet. What did you learn from this application that you can apply next time?"

### ADHD Buddy
**User:** "I keep getting distracted while working"
**ADHD Buddy:** "Welcome to ADHD! Your brain is novelty-seeking, not lazy. Try body doubling—work while someone's in the room (or on a video call). Your accountability will help your system."

### Imposter Syndrome Buddy
**User:** "I don't think I'm smart enough for this role"
**Imposter Syndrome:** "Stop. Let's look at facts, not feelings. What have you accomplished? What feedback have others given? Those are data points. Your doubt is a feeling, not evidence."

---

## Troubleshooting

### No Sound
- **Check API key** - Paste fresh key from ElevenLabs
- **Check internet** - ElevenLabs requires network connection
- **Check browser** - Allow microphone/audio permissions
- **Try Web Speech** - Remove API key to use browser TTS
- **Check volume** - Device volume might be muted

### Chat Not Responding
- **Add Claude API key** - Chat requires Claude API key in localStorage
- **Check key format** - Should start with `sk-ant-`
- **Check quota** - Anthropic may have rate limits
- **Graceful fallback** - App shows error in chat if key missing

### Voice Speed Not Changing
- **Adjust slider** - Slider value updates immediately
- **Close/reopen settings** - Settings auto-save
- **Test with audio** - Speed applies to next TTS call, not current

### API Key Validation Fails
- **Correct format** - ElevenLabs keys start with `sk_`
- **Check expiration** - Keys may expire
- **Regenerate key** - Generate new key in ElevenLabs dashboard
- **Check quota** - Free tier has character limits

---

## Architecture Decisions

### Why ElevenLabs + Web Speech Fallback?
- **ElevenLabs**: Natural, consistent, professional voices
- **Fallback**: Works offline, no API key needed, all browsers supported
- **Best of both**: High quality when possible, graceful degradation without

### Why Claude API for Chat?
- **Personality awareness**: System prompts make each buddy distinct
- **Natural language**: Claude excels at empathetic, contextual responses
- **Reliability**: Well-documented API with consistent outputs
- **Cost**: Pay-as-you-go, affordable for personal use

### Why 28 Buddies?
- **Specificity**: Each addresses a distinct life domain (mental health, career, neurodiversity, etc.)
- **Inclusivity**: Covers marginalized communities (LGBTQ+, disability, neurodivergence)
- **Personalization**: Users pick buddy matching their need of the moment
- **Non-exhaustive**: Could expand to more with additional prompts

### Why localStorage for Settings?
- **Privacy**: No server, all data stays on device
- **Offline**: Works without internet after first load
- **Instant**: No network latency for preference persistence
- **Simple**: No auth/database complexity

---

## Future Enhancements

- **Multi-turn conversation memory** - Track chat history per buddy
- **Voice training** - Let users upload voice samples for custom voices (via ElevenLabs Voice Lab)
- **Affirmation customization** - Users add custom affirmations
- **Mood tracking** - Log mood entries and trend analysis
- **Photo album** - Actually store photos with dates and moods
- **Buddy recommendations** - Suggest best buddy based on mood check-in
- **Buddy favorites** - Pin preferred buddies for quick access
- **Buddy feedback** - Rate helpfulness of buddy responses
- **Export chats** - Download conversations as PDFs
- **Share buddies** - QR code to share buddy recommendations

---

## Support & Resources

### ElevenLabs
- **Docs**: https://elevenlabs.io/docs
- **API Reference**: https://elevenlabs.io/docs/api-reference
- **Free tier**: 10,000 characters/month
- **Pricing**: Pay-as-you-go after free tier

### Claude API
- **Docs**: https://docs.anthropic.com
- **Pricing**: https://www.anthropic.com/pricing
- **Models**: claude-3-5-sonnet (recommended for chat)
- **Free trial**: Check console.anthropic.com for credits

### Browser APIs
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **localStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**Built with ❤️ for meaningful human-AI connection.**
