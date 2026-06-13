# macOS Installation Guide - Jamie Wigg Complete Stack

## 🎯 What You're Installing

**Complete development environment** with:
- ✅ Event Platform (Next.js 15 + Supabase real-time sync)
- ✅ iOS native app (Capacitor)
- ✅ Content automation tools (Whisper, Faster-Whisper, thumbnails)
- ✅ Claude Code backup system
- ✅ All dependencies and configurations

---

## 📥 Download & Install (3 Simple Steps)

### Step 1: Download Setup Script

Open Terminal on your MacBook and run:

```bash
cd ~/Downloads

curl -fsSL https://raw.githubusercontent.com/wiggjamie9-afk/jamie-wigg/claude/event-platform-design-f3b0df/SETUP_MACOS.sh -o setup.sh

chmod +x setup.sh
```

### Step 2: Run Installation

```bash
./setup.sh
```

This will:
1. ✅ Check prerequisites (Homebrew, Node, Python, FFmpeg)
2. ✅ Create workspace at `~/jamie-wigg-workspace`
3. ✅ Clone/setup all projects
4. ✅ Install all dependencies
5. ✅ Create configuration files
6. ✅ Setup documentation

**Time:** ~10-15 minutes (depending on internet speed)

### Step 3: Configure Credentials

After installation:

```bash
cd ~/jamie-wigg-workspace/event-platform

# Edit Supabase credentials
nano .env.local

# Add your credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🚀 Quick Start After Installation

### Start Development Server

```bash
cd ~/jamie-wigg-workspace/event-platform
npm run dev

# Open browser → http://localhost:3000
```

### Generate Thumbnails

```bash
cd ~/jamie-wigg-workspace/content-automation

python3 thumbnail_generator.py --title "My Video Title"
# Creates: thumbnail.png (1280×720)
```

### Generate Captions from Video

```bash
python3 caption_generator.py video.mp4
# Creates: video.srt (subtitle file)

# Burn captions into video
python3 caption_generator.py video.mp4 --burn output.mp4
```

### Build iOS App

```bash
cd event-platform

npm run build
npm run cap:sync
npm run cap:open:ios

# Xcode opens → Build & Run on simulator or device
```

---

## 📋 What Gets Installed

### Projects

| Project | Location | Purpose |
|---------|----------|---------|
| **event-platform** | `~/jamie-wigg-workspace/event-platform/` | Main app (Next.js 15 + Supabase) |
| **content-automation** | `~/jamie-wigg-workspace/content-automation/` | YouTube/social tools |
| **claude-config-backup** | `~/jamie-wigg-workspace/claude-config-backup/` | Config backup (Git) |

### Tools & Libraries

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| Python 3 | Latest | AI/automation scripts |
| FFmpeg | Latest | Video processing |
| Whisper | Latest | Auto-captions |
| Faster-Whisper | Latest | Optimized captions |
| Pillow | Latest | Image processing |

### npm Packages (Event Platform)
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase client
- Capacitor

### Python Packages
- openai-whisper
- faster-whisper
- Pillow

---

## 🔧 Configuration Files Created

After setup, you'll have:

```
~/jamie-wigg-workspace/
├── event-platform/.env.local          ← Edit with Supabase credentials
├── README_SETUP.md                     ← Quick reference
└── INVENTORY.md                        ← Complete inventory
```

---

## ✅ Verification Checklist

After installation, verify everything works:

```bash
# Check Node
node --version
# Should be v20 or higher

# Check Python
python3 --version
# Should be 3.8+

# Check FFmpeg
ffmpeg -version
# Should show FFmpeg version

# Check Whisper
whisper --version
# Should be latest

# Start event platform
cd ~/jamie-wigg-workspace/event-platform
npm run dev
# Should say "Ready in XXms" on localhost:3000
```

---

## 🔐 First-Time Setup: Supabase Credentials

### 1. Create Supabase Account

Go to [supabase.com](https://supabase.com) and sign up

### 2. Create New Project

- Name: `event-platform`
- Region: Choose closest to you
- Password: Generate strong one

### 3. Get Your Credentials

In Supabase dashboard:
- Settings → API
- Copy: **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy: **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Add to Configuration

```bash
cd ~/jamie-wigg-workspace/event-platform
nano .env.local

# Paste:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 5. Setup Database

In Supabase SQL Editor:
1. Click **SQL Editor**
2. Click **New Query**
3. Copy content from `event-platform/supabase/schema.sql`
4. Paste and click **Run**

Done! Database is ready.

---

## 🚀 Deploy to Production

### Deploy Web App to Vercel

```bash
cd ~/jamie-wigg-workspace/event-platform

npm install -g vercel
vercel login
vercel deploy

# Select project defaults
# → Your app is live!
```

### Build iOS App for App Store

```bash
cd event-platform
npm run cap:open:ios

# Xcode opens
# Product → Archive
# Distribute App → App Store Connect
# (Requires Apple Developer account)
```

---

## 📚 Documentation

Inside `~/jamie-wigg-workspace/`:

- **README_SETUP.md** — Quick start guide
- **INVENTORY.md** — Complete inventory of what's installed
- **event-platform/README.md** — Event platform documentation
- **content-automation/README.md** — Content tools documentation
- **event-platform/SUPABASE_SETUP.md** — Detailed Supabase guide

---

## 🆘 Troubleshooting

### npm: command not found
```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node
brew install node
```

### Python issues
```bash
# Reinstall Python
brew install python3

# Verify
python3 --version
```

### Whisper/Faster-Whisper not working
```bash
pip3 install --upgrade openai-whisper faster-whisper
```

### Port 3000 already in use
```bash
# Find process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 💡 Next Steps After Installation

1. ✅ Run setup script
2. ✅ Add Supabase credentials
3. ✅ Test `npm run dev`
4. ✅ Create event on localhost:3000
5. ✅ Deploy to Vercel
6. ✅ Build iOS app in Xcode
7. ✅ Test real-time sync (iPhone ↔ MacBook)
8. ✅ Generate thumbnails & captions for your videos

---

## 🎉 You're All Set!

Everything is configured and ready to go. Start building! 🚀

**Questions?** Check the project READMEs or reach out.

---

**Installation script**: `SETUP_MACOS.sh`  
**Complete inventory**: `INVENTORY.md`  
**Quick reference**: `README_SETUP.md`
