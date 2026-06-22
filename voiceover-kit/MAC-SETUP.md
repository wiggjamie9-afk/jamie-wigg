# Mac Setup — Episode 2 Audio Generation

## Quick Start (2 minutes)

### Step 1: Copy this command into Terminal

```bash
bash <(curl -s https://raw.githubusercontent.com/wiggjamie9-afk/jamie-wigg/claude/system-prompts-leaks-2sg44g/voiceover-kit/setup-mac.sh)
```

**Copy the entire command above and paste it into Terminal on your Mac.**

### Step 2: What it does

The setup script will:
- ✅ Download all 20 Episode 2 scripts
- ✅ Download all 20 Episode 3 scripts  
- ✅ Set up the Python generation pipeline
- ✅ Check that Voicebox is running
- ✅ Print next steps

### Step 3: Run the generation

After setup completes, it will show you:

```bash
python3 generate-all-ep2-now.py
```

Copy that command and run it.

---

## Detailed Steps (If you prefer manual setup)

### 1. Open Terminal

Press `Cmd + Space`, type `Terminal`, press Enter.

### 2. Download the files

```bash
# Clone the repository
git clone --branch claude/system-prompts-leaks-2sg44g \
  https://github.com/wiggjamie9-afk/jamie-wigg.git ~/rhythmix-podcast-network

# Go to the voiceover-kit directory
cd ~/rhythmix-podcast-network/voiceover-kit
```

### 3. Check Python is installed

```bash
python3 --version
```

You should see `Python 3.x.x`. If not, install from https://www.python.org/downloads/

### 4. Install the requests library

```bash
pip3 install requests
```

### 5. Start Voicebox

Open the **Voicebox** app on your Mac and make sure it's running.

### 6. Run the generation

```bash
python3 generate-all-ep2-now.py
```

---

## What Happens Next

1. **Script runs** — clones 20 voices from your uploaded ElevenLabs samples
2. **Jobs submitted** — all 20 Episode 2 generation jobs start in Voicebox
3. **You monitor** — watch Voicebox app → "Generations" tab
4. **Download** — when jobs finish (5–30 min), download all 20 MP3s
5. **Rename** — rename them to `ep2-01.mp3`, `ep2-02.mp3`, ... `ep2-20.mp3`
6. **Upload** — upload to Buzzsprout for Mon/Wed/Fri release

---

## Troubleshooting

**"Voicebox not running"**
→ Open the Voicebox app, wait for it to fully load, then run the script again.

**"Python not found"**
→ Install from https://www.python.org/downloads/ (choose the latest 3.x version)

**"requests library not found"**
→ Run: `pip3 install requests`

**Script is slow**
→ That's normal. Voice cloning takes 1–2 seconds per voice. Total ~30–60 seconds for all 20.

---

## All Files You Need

Everything is in `~/rhythmix-podcast-network/voiceover-kit/`:

| File | What it is |
|---|---|
| `generate-all-ep2-now.py` | Main generation script (run this) |
| `01-true-crime-brief-ep2.txt` through `20-wanderlust-ep2.txt` | All 20 Episode 2 scripts |
| `01-true-crime-brief-ep3.txt` through `20-wanderlust-ep3.txt` | All 20 Episode 3 scripts (for tomorrow) |
| `VOICE-MAPPING.md` | Shows which voice matches each podcast |
| `START-HERE.md` | Quick reference guide |

---

**Ready?** Paste the setup command into Terminal and let's go! 🚀
