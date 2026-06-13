# Quick Start: Run on Your Mac

Pull the latest changes and run the event platform with asset generation.

## 1. Pull Latest Changes

```bash
cd ~/jamie-wigg-workspace/event-platform
git fetch origin claude/event-platform-design-f3b0df
git checkout claude/event-platform-design-f3b0df
git pull origin claude/event-platform-design-f3b0df
```

## 2. Install New Dependencies

```bash
# Event platform (Next.js)
npm install

# Content automation tools
cd ../content-automation
pip install -r requirements.txt
cd ../event-platform
```

## 3. Set Environment Variables

Create `.env.local` in event-platform directory:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Asset generation (choose what you need)
REPLICATE_API_TOKEN=your-replicate-token
LEONARDO_API_KEY=your-leonardo-key
# OPENAI_API_KEY=your-openai-key
# ANTHROPIC_API_KEY=your-anthropic-key
```

**Get free API keys:**
- Replicate: https://replicate.com (free credits)
- Leonardo: https://leonardo.ai (free tier)
- OpenAI: https://platform.openai.com (free trial credits)
- Anthropic Claude: https://console.anthropic.com (free tier)

**Craiyon requires no API key** (free tier available)

## 4. Start the Dev Server

```bash
cd ~/jamie-wigg-workspace/event-platform
npm run dev
```

Output should show:
```
▲ Next.js 15.0.0
- Local: http://localhost:3000
```

Open **http://localhost:3000** in your browser.

## 5. Test Asset Generation

1. Click **"Create Event"**
2. Enter event title (e.g., "Tech Conference 2025")
3. Click **"+ Generate Event Image & Description"**
4. Select image generator:
   - **Craiyon** (no API key needed, best for testing)
   - **Replicate** (best quality, requires API token)
   - **Leonardo** (fast & stylized, requires API key)
5. Click **"Generate Assets"**
6. Wait for generation (15-30 seconds)
7. Review generated image and description
8. Fill remaining fields (date, time, location)
9. Click **"Create Event"**

Your event appears instantly on all devices connected to the same Supabase project.

## 6. Test on iPhone (Optional)

Build and run iOS app:

```bash
cd ~/jamie-wigg-workspace/event-platform
npm run build
npm run cap:sync
npm run cap:open:ios
```

Xcode opens → click Play to run on simulator or device.

Both devices see the same events in real-time (websocket sync via Supabase).

## 7. Test Content Automation CLI (Optional)

Generate thumbnails, captions, images, scripts from command line:

```bash
cd ~/jamie-wigg-workspace/content-automation

# Generate thumbnail
python3 thumbnail_generator.py --title "My Event"

# Generate image
python3 image_generator.py --title "My Event" --generator craiyon

# Generate script
python3 script_generator.py --prompt "Event description" --type event-description
```

## Troubleshooting

### "npm: command not found"
```bash
brew install node
```

### "python3: command not found"
```bash
brew install python3
```

### "ModuleNotFoundError: No module named 'PIL'"
```bash
pip install Pillow
```

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
# Then open http://localhost:3001
```

### Asset generation times out
First generation (model download) can take 60+ seconds. Increase timeout in `event-platform/src/app/api/generate-event-assets/route.ts` if needed.

### "Cannot find content-automation"
Ensure `content-automation/` directory exists at same level as `event-platform/`:
```bash
ls -la ~/jamie-wigg-workspace/
# Should show: event-platform, content-automation, claude-config-backup
```

## What You Have Now

| Feature | Status | How to Use |
|---------|--------|-----------|
| **Event Creation** | ✅ Working | Click "Create Event" |
| **AI Image Generation** | ✅ Working | Click "Generate Event Image & Description" |
| **AI Event Description** | ✅ Working | Auto-generate from image generator |
| **Real-time Sync** | ✅ Working | Create event on iPhone, see on Mac instantly |
| **iOS App** | ✅ Built | `npm run cap:open:ios` |
| **Content Tools CLI** | ✅ Working | `cd content-automation && python3 [script]` |
| **Thumbnail Generator** | ✅ Working | `python3 thumbnail_generator.py` |
| **Caption Generator** | ✅ Working | `python3 caption_generator.py video.mp4` |
| **Social Scheduler** | ⏳ Coming | Next feature |

## Next Steps

1. **Test locally** on http://localhost:3000
2. **Add Supabase credentials** (ask in Supabase dashboard)
3. **Test on iPhone** (build with Xcode)
4. **Deploy to Vercel** when ready: `vercel deploy`
5. **Build for App Store** when ready: `npm run cap:open:ios` → Product → Archive in Xcode

---

**Questions?** Check `event-platform/README.md` or `event-platform/ASSET_GENERATION.md` for detailed setup.

**Need to pull other changes?** All work is on branch `claude/event-platform-design-f3b0df`.
