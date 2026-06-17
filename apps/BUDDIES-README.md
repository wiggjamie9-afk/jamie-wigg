# 28 AI Buddy Apps — Complete Suite

**Your personal AI companion for every journey.** A complete suite of 28 standalone apps, each with a distinct personality tailored to specific life situations and challenges.

## Quick Start

### 1. Set Up the Proxy (One-time)

The talking-head avatar feature requires a local proxy to keep your Higgsfield secret server-side (not in the browser).

```bash
cd /path/to/jamie-wigg/apps

# Install dependencies
cp avatar-proxy-package.json package.json
npm install express cors dotenv

# Start the proxy (in a separate terminal)
node avatar-proxy-local.mjs
```

You should see: `✓ Ready to generate avatars!` and `Listening on http://localhost:3001`.

### 2. Run the App Server

```bash
cd /path/to/jamie-wigg
python3 -m http.server 8000
```

### 3. Open the Launcher

**On your Mac:** Open `http://localhost:8000/apps/buddies.html`
**On your phone:** Open `http://<your-mac-ip>:8000/apps/buddies.html` (e.g., `http://192.168.1.100:8000/apps/buddies.html`)

## The 28 Buddies

| # | Buddy | Emoji | Use For |
|---|---|---|---|
| 1 | My Buddy | 👋 | Easygoing best friend |
| 2 | Anxiety Relief | 😰 | Panic, anxiety, overwhelm |
| 3 | Depression Buddy | 😔 | Low mood, hopelessness |
| 4 | Sleep Buddy | 🌙 | Sleep troubles, rest |
| 5 | Grief Buddy | 💔 | Loss, mourning |
| 6 | Elderly Companion | 👵 | Older adults, isolation |
| 7 | Parenting Coach | 👨‍👩‍👧 | Parenting challenges |
| 8 | Teen Mentor | 👦 | Teenagers, adolescence |
| 9 | Recovery Buddy | 🌱 | Addiction recovery |
| 10 | Job Search Buddy | 💼 | Job hunting, transitions |
| 11 | Career Coach | 📈 | Professional growth |
| 12 | Study Buddy | 📚 | Learning, exams, focus |
| 13 | Creative Partner | 🎨 | Art, writing, creativity |
| 14 | Startup Mentor | ⚡ | Entrepreneurship |
| 15 | Fitness Coach | 💪 | Exercise, health |
| 16 | Nutrition Buddy | 🥗 | Eating well, diet |
| 17 | Travel Companion | ✈️ | Trip planning, adventure |
| 18 | Financial Coach | 💰 | Money, budgeting |
| 19 | Hobby Explorer | 🎸 | Interests, passions |
| 20 | Life Goals Coach | 🎯 | Goals, purpose, direction |
| 21 | Anti-Bullying Buddy | 🛡️ | Bullying, harassment |
| 22 | ADHD Buddy | ⚡ | Focus, time blindness, RSD |
| 23 | Autism Spectrum Buddy | 🌈 | Neurodivergent, sensory |
| 24 | Chronic Pain Buddy | 🩹 | Pain management |
| 25 | Addiction Recovery | 🔥 | Substance recovery |
| 26 | LGBTQ+ Ally | 🏳️‍🌈 | LGBTQ+ support, affirming |
| 27 | Disability Buddy | ♿ | Disability support |
| 28 | Imposter Syndrome | 🌟 | Self-doubt, confidence |

## Features (All 28 Apps)

### 🎨 Design
- **2026 Glass Aesthetic**: Frosted-glass cards, ambient mesh background, floating shadows, per-buddy glow blooms
- **Mobile-First**: Optimized for iPhone and Android
- **Responsive**: Works at any screen size

### 💬 Chat
- **Claude AI**: Streaming conversations with domain-specific personalities
- **Affirmations**: 8-10 tailored affirmations per buddy
- **Crisis Detection**: Smart routing to emergency resources (988, Crisis Text Line, etc.)
- **Text-to-Speech**: ElevenLabs TTS (professional voices) with Web Speech fallback

### 🧠 Personality
Each buddy has a unique system prompt tailored to their domain. Examples:
- **Anxiety Relief**: Teaches grounding techniques, validates feelings
- **ADHD Buddy**: Acknowledges time blindness and rejection-sensitive dysphoria (RSD)
- **LGBTQ+ Ally**: Uses affirming pronouns, validates identity
- **Grief Buddy**: Normalizes loss, offers compassionate listening
- **Anti-Bullying Buddy**: Validates pain, provides resources

### ❤️ Health Monitoring
- **Camera Heart Rate**: 20-second PPG measurement via back camera
- **Manual Input**: Heart rate, mood, sleep, breathing
- **Health Trends**: Track wellness over time
- **Stress Relief**: Guided breathing and grounding exercises

### 🎬 Avatar Studio
- **Generate Face**: Text-to-image (Higgsfield Soul) creates a photoreal portrait
- **Bring to Life**: Image-to-video (Higgsfield DOP) animates talking-head
- **Lip-Sync**: Optional: sync audio to avatar mouth
- **Custom Proxy URL**: Point to your proxy or custom Higgsfield endpoint

### 📱 Data Privacy
- **All on Your Device**: Chat history, health data, notes stored in `localStorage`
- **No Server Upload**: Your Higgsfield secret never reaches the browser
- **Offline Ready**: Service worker enables offline mode for chat/notes
- **Persist Between Sessions**: Data syncs across page reloads and app reopens

## File Structure

```
apps/
├── buddies.html                # Launcher hub (all 28 buddies as clickable cards)
├── buddy-1.html                # My Buddy
├── buddy-2.html                # Anxiety Relief
├── ...
├── buddy-28.html               # Imposter Syndrome Buddy
├── buddy-app-template.html     # Base template (for reference)
├── generate-apps.mjs           # Generator script (creates all 28)
├── buddy-system.html           # Original unified app (28 in one carousel)
├── buddy-personalities.js      # Personality library (all 28 prompts + affirmations)
├── avatar-proxy-local.mjs      # Local proxy (Higgsfield Soul + DOP)
├── avatar-proxy-package.json   # Proxy dependencies
├── AVATAR-STUDIO-SETUP.md      # Proxy setup guide
└── BUDDIES-README.md           # This file
```

## API Keys Required

### Must-Have
- **Claude API Key** (Anthropic): `sk-ant-...` from https://console.anthropic.com
  - Set in Settings tab of any buddy app
  - Used for all conversations

### Optional
- **ElevenLabs API Key**: From https://elevenlabs.io/app/api-keys
  - Enables professional text-to-speech voices
  - Without it, falls back to Web Speech API (robotic but functional)
  - Set in Settings tab

### For Avatars (Optional)
- **Higgsfield API Key + Secret**: From your Higgsfield account
  - Set in `.env` at repo root (gitignored)
  - Proxy runs locally on your Mac, so secret never reaches the browser
  - Without it, Avatar Studio buttons don't work (but all other features do)

## Testing on Your Phone

### Same Network (Recommended)
1. Find your Mac IP: `ifconfig | grep "inet "`
2. On your phone, open: `http://<your-mac-ip>:8000/apps/buddies.html`
3. Settings → Proxy URL: `http://<your-mac-ip>:3001` (if avatar generation)

### Debug Tips
- **Settings tab** has health API key fields and proxy URL
- **Health tab** shows PPG status; point finger at camera + flash
- **Chat tab** shows real-time Claude responses
- **Home tab** displays daily affirmation (randomized per calendar day)

## Generating All 28 Apps (If You Edit the Template)

If you modify `buddy-app-template.html` or `buddy-personalities.js`, regenerate all apps:

```bash
cd /path/to/jamie-wigg/apps
node generate-apps.mjs
```

This overwrites all 28 `buddy-*.html` files with the latest template + personality data.

## Safety & Crisis Support

Each buddy includes crisis resources tailored to their domain:

- **Mental Health Buddies** (Anxiety, Depression, Grief, etc.):
  - 988 Suicide & Crisis Lifeline
  - Crisis Text Line: text HOME to 741741
  - International emergency services
  
- **Substance Recovery Buddy**:
  - SAMHSA National Helpline: 1-800-662-4357
  - Narcotics Anonymous, Alcoholics Anonymous
  
- **LGBTQ+ Ally Buddy**:
  - Trevor Project: 1-866-488-7386
  - Trans Lifeline
  
- **Anti-Bullying Buddy**:
  - Crisis Text Line
  - Local mental health resources

All buddies remind the user: *"I'm an AI companion, not a doctor, therapist, or emergency service. For immediate danger, call 911 or your local emergency number."*

## Performance & Browser Compatibility

- **Tested on**: iOS Safari, Chrome (Android), Firefox
- **Data Limits**: localStorage can hold ~5-10MB per origin (plenty for chat + health data)
- **Network**: Works best with 4G/WiFi; graceful fallback if network drops
- **Offline**: Service worker caches core UI; chat/notes work without internet

## Deployment

### Local Testing
```bash
python3 -m http.server 8000
```

### Production (GitHub Pages)
Just push to `main` — GitHub Pages auto-deploys all `.html` files.

### Custom Domain
Point your domain's DNS to GitHub Pages, and buddies are live at `yourdomain.com/apps/buddy-1.html`.

## Future Enhancements

Possible additions (not yet implemented):
- Photo gallery per buddy (store emotional support images)
- Voice journal (record audio notes)
- Mood tracker with charts (visualize trends)
- Emergency contact quick-dial (with consent)
- Group buddy chats (family, support groups)
- Offline-first PWA installation (currently loads from web)

## Support

- **Issues**: Check Settings → About for app version + features
- **Proxy Blocked**: Ensure `avatar-proxy-local.mjs` is running on your Mac
- **No Audio**: Check ElevenLabs key in Settings; Web Speech is the fallback
- **Chat Stuck**: Refresh the page; conversations sync from localStorage

---

**Built with ❤️ to help people feel less alone.**

*"You're not alone. You're allowed to ask for help. Everything is OK, and so are you."*
