# Buddy System - AI Companion Ecosystem

A mobile-first web app providing 28 customizable AI buddy companions, each with specialized support for different mental health, wellness, and life coaching scenarios.

## Features

### Core App
- **28 Unique Buddies**: Each with distinct personality, color theme, and use case
- **Carousel Navigation**: Smooth swipe-based buddy selection
- **Multi-Tab Interface**: Home, Health, Photos, Chat, Notes, Settings per buddy
- **Responsive Design**: Mobile-first, iOS-safe-area aware
- **Dark Theme**: RHYTHMIX-branded gradient background

### Avatar Customization (Higgsfield AI)
- **AI Avatar Generation**: Describe your buddy's appearance → AI generates portrait
- **Modal UI**: Seamless in-app customization
- **localStorage Persistence**: Avatars survive page reloads
- **Emoji Fallback**: Works without API if generation fails
- **Error Handling**: Friendly messages and retry options

### Buddy Features
1. **Home Tab**: Daily affirmation, mood check-in, quick actions
2. **Health Tab**: Vital stats tracking (heart rate, mood, sleep, breathing)
3. **Photos Tab**: Memory gallery for photos with each buddy
4. **Chat Tab**: Text-based conversation interface
5. **Notes Tab**: Personal journal for reflections
6. **Settings Tab**: Buddy customization, voice speed, emergency contacts

## Quick Start

### 1. Open the App

```bash
# Option A: Direct file open
open apps/buddy-system.html

# Option B: Via local server
python3 -m http.server 8000 --bind 127.0.0.1
# Then visit http://localhost:8000/apps/buddy-system.html
```

### 2. Generate Avatar (Optional)

To customize a buddy's avatar:

1. Click on any buddy to open their detail screen
2. Go to **Settings** tab
3. Click **Customize Avatar** button
4. Describe the buddy (e.g., "warm older mentor with kind eyes")
5. Click **Generate Avatar** button
6. Wait 3-15 seconds for AI generation
7. Click **Use This Avatar** to save

**Note**: Avatar generation requires the proxy server running (see below).

### 3. Run the Avatar Proxy

#### Option A: Local Node.js Server (Development)

```bash
cd apps
node avatar-proxy-local.mjs
```

Requires:
- Node.js 18+ installed
- `.env` file with `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET`

Output:
```
========================================
Avatar Proxy Server
========================================

✨ Listening on http://localhost:3001

Endpoints:
  GET  /health
  POST /api/higgsfield-generate
```

#### Option B: Cloudflare Worker (Production)

```bash
cd studio/workers/avatar-proxy

# Install dependencies
npm install

# Set credentials
wrangler secret put HIGGSFIELD_API_KEY
wrangler secret put HIGGSFIELD_SECRET

# Deploy
wrangler deploy --env production
```

Then update buddy-system.html line to use:
```javascript
const response = await fetch('https://avatar-proxy.starlightmix.com/api/higgsfield-generate', {
```

#### Option C: Docker (Self-Hosted)

```bash
# Create Dockerfile in apps/
docker build -t buddy-avatar-proxy .
docker run -e HIGGSFIELD_API_KEY=xxx -e HIGGSFIELD_SECRET=yyy -p 3001:3001 buddy-avatar-proxy
```

## API Setup

### Get Higgsfield Credentials

1. Visit https://platform.higgsfield.ai
2. Sign up / Log in
3. Create an API key
4. Copy `API_KEY` and `API_SECRET`

### Store in .env

```bash
cp .env.example .env
```

Edit `.env`:
```
HIGGSFIELD_API_KEY=your-api-key-here
HIGGSFIELD_SECRET=your-secret-here
```

⚠️ **Important**: `.env` is gitignored. Never commit it.

## Architecture

### Files

```
apps/
├── buddy-system.html          # Main app (28 buddies + UI)
├── avatar-proxy-local.mjs     # Local Node.js proxy
├── HIGGSFIELD-SETUP.md        # Detailed setup guide
├── BUDDY-SYSTEM-README.md     # This file

studio/workers/avatar-proxy/
├── src/index.ts               # Cloudflare Worker
├── wrangler.toml              # Worker config
├── package.json               # Dependencies
```

### Data Flow

```
Buddy System (HTML)
    ↓
/api/higgsfield-generate (POST)
    ↓
Avatar Proxy (Local or Cloudflare)
    ↓
Higgsfield Soul API
    ↓
Generated Image URL
    ↓
localStorage (persist)
    ↓
Display in Avatar Circle
```

### Storage

**localStorage schema**:
```javascript
{
  "buddy-avatar-1": "https://...",      // My Buddy
  "buddy-avatar-2": "https://...",      // Anxiety Relief
  // ... etc for buddies 3-28
}
```

**Typical storage**: 5-20MB per origin (URLs are ~100 bytes each)

## Buddy Roster

| # | Name | Emoji | Use Case |
|---|---|---|---|
| 1 | My Buddy | 😊 | Best friend |
| 2 | Anxiety Relief | 🧘 | Calm support |
| 3 | Depression Buddy | 💜 | Hopeful companion |
| 4 | Sleep Buddy | 🌙 | Restful guide |
| 5 | Grief Buddy | 🌸 | Gentle support |
| 6 | Elderly Companion | 👵 | Caring presence |
| 7 | Parenting Coach | 👶 | Parent support |
| 8 | Teen Mentor | 🌟 | Youth guide |
| 9 | Recovery Buddy | 💚 | Strength ally |
| 10 | Job Search Buddy | 💼 | Career helper |
| 11 | Career Coach | 🚀 | Career mentor |
| 12 | Study Buddy | 📚 | Learning partner |
| 13 | Creative Partner | 🎨 | Art collaborator |
| 14 | Startup Mentor | ⚡ | Business guide |
| 15 | Fitness Coach | 💪 | Workout buddy |
| 16 | Nutrition Buddy | 🥗 | Health helper |
| 17 | Travel Companion | ✈️ | Adventure guide |
| 18 | Financial Coach | 💰 | Money mentor |
| 19 | Hobby Explorer | 🎯 | Interest finder |
| 20 | Life Goals Coach | 🎆 | Goal guide |
| 21 | Anti-Bullying Buddy | 💛 | Self-worth builder |
| 22 | ADHD Buddy | ⚙️ | Focus helper |
| 23 | Autism Spectrum | 🌈 | Understanding friend |
| 24 | Chronic Pain Buddy | 🤝 | Pain support |
| 25 | Addiction Buddy | 🌱 | Recovery strength |
| 26 | LGBTQ+ Ally | 🏳️‍🌈 | Safe space |
| 27 | Disability Buddy | ♿ | Accessibility friend |
| 28 | Imposter Syndrome | ⭐ | Confidence builder |

## UI/UX Details

### Design System

- **Font**: Inter (UI), Lexend (headings)
- **Color Scheme**: Dark mode with gradient accents
- **Spring Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Animations**: 0.3-0.45s transitions, snap scrolling

### Responsive Breakpoints

- Mobile: Full width, touch-friendly buttons (48px min)
- Tablet: Grid layout adapts
- Desktop: Works but optimized for mobile

### Avatar Modal

**States**:
1. **Closed**: Hidden overlay
2. **Open (Ready)**: Input focus, Generate button visible
3. **Loading**: Spinner, disabled button, animated shimmer
4. **Generated**: Image preview, "Use This Avatar" / "Try Again" buttons
5. **Saved**: Success message, auto-close after 1.5s

## Error Handling

### Common Issues

**"Generation issue: Missing prompt"**
- Solution: Write a longer, more descriptive avatar description

**"API error: 401 Unauthorized"**
- Check: API key and secret in .env
- Check: Proxy can read environment variables
- Check: Higgsfield API key is valid at https://platform.higgsfield.ai

**"Network error" (dev)**
- Check: Local proxy running: `node avatar-proxy-local.mjs`
- Check: Proxy on port 3001
- Check: Buddy System pointing to http://localhost:3001/api/higgsfield-generate

**"Network error" (production)**
- Check: Cloudflare Worker deployed
- Check: Secrets set via `wrangler secret put`
- Check: Route configured in wrangler.toml

### Fallback Behavior

If generation fails:
1. Emoji avatar remains visible
2. User can retry generation
3. localStorage continues to work for previously saved avatars
4. App remains fully functional

## Performance

- **App Load**: <500ms (HTML only)
- **Avatar Generation**: 3-15 seconds (Higgsfield processing)
- **Image Display**: <100ms after load
- **localStorage**: Instant persistence

### Optimization Tips

1. **Cache avatars**: Generated URLs are stable; no need to re-generate
2. **Batch generation**: Generate 3 at once, user picks favorite
3. **Preload proxy**: Warm up Higgsfield with a test call on app load
4. **Compression**: Store URLs, not image files (already 10x smaller)

## Development

### Local Testing Checklist

- [ ] App loads and shows 28 buddy cards
- [ ] Carousel swipes smoothly left/right
- [ ] Click buddy card opens detail screen
- [ ] All 6 tabs work (Home, Health, Photos, Chat, Notes, Settings)
- [ ] Avatar customization button visible in Settings
- [ ] Modal opens with description input
- [ ] Proxy running at http://localhost:3001
- [ ] Avatar generates after 5-15 seconds
- [ ] Generated image displays in preview
- [ ] Clicking "Use This Avatar" saves to localStorage
- [ ] Refresh page → avatar persists
- [ ] Error messages display if proxy down
- [ ] Mobile swipe gestures work smoothly

### Customization

**Change buddy names/emojis**:
Edit the `BUDDIES` array in buddy-system.html (lines ~170-199).

**Change colors**:
Update CSS variables: `--bg`, `--text`, `--border`, or buddy colors.

**Change API endpoint**:
Line ~650: Update fetch URL.

**Add new tabs**:
See existing tab pattern (Home, Health, etc.) and duplicate structure.

## Deployment

### GitHub Pages

```bash
cp apps/buddy-system.html ../buddy-system.html
git add buddy-system.html
git commit -m "Add Buddy System app"
git push origin main
```

Live at: `https://rhythmixapp.com.au/buddy-system.html`

### Cloudflare Pages (with Worker)

**Pages**: Deploy apps folder
```bash
wrangler pages deploy apps
```

**Worker**: Deploy avatar proxy
```bash
cd studio/workers/avatar-proxy
wrangler deploy --env production
```

## Troubleshooting

### Avatar not saving?
- Check: localStorage enabled in browser
- Check: No quota exceeded (unlikely, URLs are small)
- Check: Console for JavaScript errors

### Modal won't close?
- Click ✕ button
- Or press Escape key (add if desired)
- Refresh page to reset

### Proxy connection error?
- Verify `.env` has correct credentials
- Check network tab in DevTools for 401/403 responses
- Try `curl http://localhost:3001/health`

### Emoji showing instead of avatar?
- Avatar generation failed silently → check console
- Proxy not running → start it with `node avatar-proxy-local.mjs`
- API credentials wrong → verify in `.env`

## Future Enhancements

1. **Chat Integration**: Connect to Claude API for real conversations
2. **Voice**: TTS responses using Kokoro or ElevenLabs
3. **Animations**: GSAP animations on avatar load
4. **Presets**: "Cartoon", "Realistic", "Minimalist" style options
5. **Batch Generation**: Generate 3 avatars, user votes on favorite
6. **Image Upload**: Let users supply their own avatar images
7. **DOP Integration**: Use Higgsfield DOP to animate avatars
8. **Buddy Badges**: Unlock achievements (10 check-ins, etc.)
9. **Export**: Save buddy data as JSON/PDF
10. **Sync**: Cloud sync across devices

## Support

- **Higgsfield Docs**: https://docs.higgsfield.ai
- **GitHub Issues**: File bug reports here
- **Contact**: jamie.jack.28@hotmail.com

## License

Part of the RHYTHMIX ecosystem. All rights reserved.
