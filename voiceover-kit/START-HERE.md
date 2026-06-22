# 🎙️ Episode 2 Audio Generation — START NOW

## One Minute Setup

### Step 1: Organize Your Episode 1 MP3s

If you've already recorded Episode 1 (shows 01-20), organize them like this:

```
voiceover-kit/
  └── audio-ep1/
      ├── ep1-01.mp3
      ├── ep1-02.mp3
      ├── ... 
      └── ep1-20.mp3
```

**On Mac:**
```bash
cd voiceover-kit
mkdir -p audio-ep1
# Copy your 20 Episode 1 MP3s into audio-ep1/
# If they have different names, rename them to ep1-01.mp3, ep1-02.mp3, etc.
```

### Step 2: Start Voicebox

Open Voicebox app on your Mac.

### Step 3: Run the Pipeline

```bash
cd voiceover-kit
bash RUN-NOW.sh
```

**That's it.** The script will:
- ✅ Verify Voicebox is running
- ✅ Clone your 20 Episode 1 voices
- ✅ Submit all 20 Episode 2 scripts for generation
- ✅ Guide you to download the MP3s

---

## Don't Have Episode 1 MP3s Yet?

Use **Kokoro preset voices** instead (no cloning):

```bash
python generate-ep2-kokoro-quick.py
```

This generates all 20 immediately with built-in voices. You can match to Episode 1 later.

---

## After Running

1. **Watch Voicebox** → "Generations" tab
2. **Wait** for jobs to complete (5–30 min)
3. **Download** all 20 MP3s to `audio-ep2/`
4. **Rename** to `ep2-01.mp3`, `ep2-02.mp3`, ... `ep2-20.mp3`
5. **Upload** to Buzzsprout

---

## What You're Getting

✅ All 20 Episode 2 scripts (voice-optimized, TTS-ready)
✅ Automated voice cloning from Episode 1 audio
✅ Batch generation with full voice matching
✅ MP3s ready for Buzzsprout publishing

---

**Questions?** Check TOMORROW-WORKFLOW.md or VOICEBOX-VOICE-PROFILES.md for detailed guides.
