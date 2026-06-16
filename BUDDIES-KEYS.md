# Unlock Premium Buddies — 30-Second Setup

Your 50 AI Buddy companions work **right now** with free browser voice. Unlock rich portrait avatars and premium voice by pasting your API keys.

## What You Get

| Feature | Free (Default) | Premium (Your Keys) |
|---------|---|---|
| **Voice** | Browser SpeechSynthesis (works immediately) | ElevenLabs realistic voices + lip-sync |
| **Avatar** | Colorful emoji | AI-generated portrait (Higgsfield Soul) |
| **Animation** | Static | Talking-head video (Higgsfield DOP) |
| **Network** | Offline ✓ | Requires internet |

---

## Quick Start (Copy & Paste)

### 1. Get Your Keys

**Higgsfield (avatar + talking-head):**
- Go to [Higgsfield Dashboard](https://dashboard.higgsfield.ai) (create account if needed)
- Copy your **API Key ID** and **API Secret**

**ElevenLabs (voice):**
- Go to [ElevenLabs Settings](https://elevenlabs.io/app/settings/api-keys)
- Copy your **API Key**

### 2. Paste Into Buddy App

Open any buddy (e.g., `buddy-1.html`) in your browser:

1. Scroll to **⚙️ Settings** (bottom of left sidebar)
2. Paste your keys in the form:
   - **Higgsfield API Key** → `ab10...`
   - **Higgsfield Secret** → `80e1...`
   - **ElevenLabs API Key** → `sk_42...`
3. Click **Save**

Keys are stored **locally in your browser** (`localStorage`) — never sent to our servers.

### 3. Generate Avatar

In the same **Settings**:
- Type a visual description of your buddy (e.g., "warm, approachable, professional headshot")
- Click **Generate Avatar**
- Wait ~10 seconds
- Your custom portrait appears

### 4. Talk to Your Buddy

In the chat area:
1. Type a message and press Send
2. Your buddy replies with **ElevenLabs voice** (if key saved) or free browser voice
3. If avatar is generated, they speak as a **talking-head animation**

---

## Troubleshooting

**"Avatar proxy is not running"**
- Premium avatars require a local server (for security — your secrets stay on your machine)
- Run this in a terminal from the repo root:
  ```bash
  npm install -g express cors dotenv
  node apps/avatar-proxy-local.mjs
  ```
- Then reload the buddy page
- Leave the terminal running while you use buddies

**"I'm getting HTTP 403"**
- Your Higgsfield Secret is wrong or expired
- Regenerate it in the Higgsfield Dashboard and paste again

**"Voice not working"**
- Browser SpeechSynthesis should work immediately (no key needed)
- For ElevenLabs: check your API key in Settings
- Some browsers (Safari) may have TTS limitations — try Chrome or Firefox

**"Keys aren't saving"**
- Clear browser cache/cookies for the buddy app
- Check that your browser allows localStorage (not in private mode)

---

## Security Notes

- ✅ Your keys are stored **locally** in browser `localStorage` — only your machine uses them
- ✅ The avatar proxy (`avatar-proxy-local.mjs`) runs on `localhost:3001` — no internet traffic except to Higgsfield
- ✅ Free browser voice (no keys) is **fully offline** — works without internet
- ⚠️  If you share your buddy app with someone else, **clear Settings first** (remove your keys)

---

## Pricing

- **Browser Voice** — Free forever
- **Higgsfield** — Pay-as-you-go ($.01–.05 per avatar generation, ~$.02–.05 per video animation)
- **ElevenLabs** — Free tier (~10,000 chars/month) or paid plans (~$11–99/month)

For casual use (1–2 avatars, daily chat), **under $1/month**.

---

## Support

Issues? Check:
- **ElevenLabs Dashboard** → Settings → Usage (confirm plan is active)
- **Higgsfield Dashboard** → API Keys (confirm Secret is current)
- **Browser Console** (`F12` → Console) → error messages often show the issue

Or reach out to support@higgsfield.ai or support@elevenlabs.io.

---

**That's it.** You now have 50 AI companions with custom voices and faces. Enjoy. 🫂
