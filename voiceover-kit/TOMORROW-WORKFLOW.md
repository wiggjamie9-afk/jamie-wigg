# Tomorrow Morning: Complete Voice Setup + Episode 2 Generation

## Preparation (Do This Tonight)

Create a folder with your Episode 1 MP3s:

```
voiceover-kit/
  ├── audio-ep1/
  │   ├── ep1-01.mp3  (True Crime Brief)
  │   ├── ep1-02.mp3  (AI Briefing)
  │   ├── ep1-03.mp3  (Dating Decoded)
  │   ├── ... 
  │   └── ep1-20.mp3  (Wanderlust)
  └── setup-and-generate-ep2.py
```

If you've already recorded Episode 1s, just place all 20 MP3 files in `audio-ep1/` and rename them to this pattern.

## Tomorrow Morning (15 minutes)

1. **Start Voicebox** on your Mac
2. **Open Terminal** in `voiceover-kit/` directory
3. **Run:**
   ```bash
   python setup-and-generate-ep2.py
   ```

## What Happens Automatically

**Phase 1: Voice Cloning** (2–5 min)
- Reads your 20 Episode 1 MP3s
- Clones each voice in Voicebox via API
- Creates 20 voice profiles (one per podcast)

**Phase 2: Episode 2 Generation** (30s–1 min to submit)
- Submits all 20 Episode 2 scripts to Voicebox
- Uses the cloned voices for perfect matching
- Starts generation jobs

**Phase 3: You Monitor**
- Check Voicebox app → "Generations" tab
- Wait for all 20 jobs to complete (5–30 min depending on Voicebox load)
- Download MP3s to `audio-ep2/` folder

## After Generation

1. **Download all 20 MP3s** from Voicebox
2. **Save to** `voiceover-kit/audio-ep2/`
3. **Rename as:** `ep2-01.mp3`, `ep2-02.mp3`, ... `ep2-20.mp3`
4. **Upload to Buzzsprout** for Mon/Wed/Fri release

## Files Ready

- ✅ All 20 Episode 2 scripts (created)
- ✅ Complete automation script (`setup-and-generate-ep2.py`)
- ✅ Kokoro quick-gen fallback (`generate-ep2-kokoro-quick.py`)
- ✅ This workflow guide

**You just need to:**
1. Organize Episode 1 MP3s into `audio-ep1/` folder
2. Run the setup script
3. Watch Voicebox complete generation
