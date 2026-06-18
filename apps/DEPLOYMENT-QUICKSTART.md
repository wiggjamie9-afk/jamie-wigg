# Buddy System - Deployment Quick Start 🚀

## 50 AI Buddy Apps — Ready to Deploy

All 50 apps are **production-ready** with:
- ✅ Claude AI responses (personality-driven)
- ✅ Hugging Face avatar generation (Stable Diffusion 3)
- ✅ ElevenLabs voice (optional)
- ✅ Offline-first PWA
- ✅ Crisis support & emergency contacts

---

## 1. User Setup (60 seconds)

Users open any `buddy-*.html` file and add **3 optional API keys** in Settings:

### Claude API (for chat responses)
1. Get free token: https://console.anthropic.com/account/keys
2. Paste in **Settings** → "Claude API Key"

### Hugging Face (for avatar generation)
1. Get free token: https://huggingface.co/settings/tokens
2. Paste in **Settings** → "Hugging Face API Key"

### ElevenLabs (for voice, optional)
1. Get token: https://elevenlabs.io/app/account
2. Paste in **Settings** → "ElevenLabs API Key"

---

## 2. Deployment Options

### Option A: GitHub Pages (Easiest)
```bash
git push origin main
# Apps live at: https://yourdomain.com/apps/buddy-system.html
```

### Option B: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
# Apps live at: https://your-project.vercel.app/apps/
```

### Option C: Netlify
```bash
# Connect repo to Netlify
# Auto-deploys on every push
# Apps live at: https://your-site.netlify.app/apps/
```

### Option D: Local Server
```bash
python3 -m http.server 8000 --bind 127.0.0.1
# Open: http://localhost:8000/apps/buddy-system.html
```

---

## 3. Files Included

| File | Purpose |
|------|---------|
| `buddy-system.html` | Main hub (28+ personalities) |
| `buddy-1.html` - `buddy-50.html` | Individual buddy apps |
| `buddy-personalities.js` | Personality library |
| `buddy-system-manifest.webmanifest` | PWA manifest |
| `buddy-system-sw.js` | Service worker (offline) |
| `BUDDY_SYSTEM_GUIDE.md` | Feature guide |
| `DEPLOYMENT-QUICKSTART.md` | This file |

---

## 4. Key Features

### 🤖 Chat Tab
Real-time AI responses with 28+ personalities (anxiety relief, career coach, grief buddy, etc.)

### 💪 Health Tab
Track mood, wellness, and patterns over time

### 📸 Avatar Studio
Generate photoreal avatars using Stable Diffusion 3 (Hugging Face)

### 🎙️ Voice
Optional voice I/O with ElevenLabs (8+ professional voices)

### 🆘 Emergency Support
Crisis hotlines, emergency contacts, grounding techniques

### 📝 Notes Tab
Private journal (stays on device, never uploaded)

### ⚙️ Settings
API key management, voice speed, voice selection, country/region

---

## 5. Troubleshooting

| Issue | Fix |
|-------|-----|
| "No API key" error | Add Claude token in Settings |
| Avatar generation fails | Add Hugging Face token in Settings |
| Voice not working | Add ElevenLabs token in Settings (optional) |
| App is slow | Clear cache in Settings → "Clear Cache" |
| Data lost after reload | Ensure localStorage is not cleared |

---

## 6. Mobile Installation

### Install as PWA (home screen app)
1. Open `buddy-system.html` in mobile browser
2. Tap **⋮** (menu) → **"Add to Home Screen"**
3. App appears as native app icon
4. Works offline (after first load)

---

## 7. Analytics & Monitoring

Users' data stays **100% local** (device storage only). No server uploads unless API keys are set.

### Optional: Track Usage
Add Google Analytics to `buddy-system.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

---

## 8. Next Steps

1. **Deploy** to your platform (GitHub Pages / Vercel / Netlify)
2. **Share** the link with users
3. **Users add API keys** (Claude, Hugging Face, ElevenLabs)
4. **Start chatting!** 💬

---

## Support

- **Docs**: See `BUDDY_SYSTEM_GUIDE.md` for features
- **Issues**: Open GitHub issue
- **Contact**: See repo README

---

**Status:** ✅ **Production Ready**  
**Last Updated:** 2026-06-18  
**Branch:** `claude/apps-made-today-zczp6o`
