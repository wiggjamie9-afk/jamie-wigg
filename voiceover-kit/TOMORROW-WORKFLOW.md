# Tomorrow Morning: Generate Episode 2 Audio

## Quick Start (5 minutes)

1. **Start Voicebox** on your Mac
2. **Open Terminal** in `voiceover-kit/` directory
3. **Run:**
   ```bash
   python generate-ep2-kokoro-quick.py
   ```
4. **Wait** for all 20 jobs to submit (should see 20 ✅ lines)
5. **Check Voicebox app** → "Generations" tab to watch progress
6. **Download MP3s** once generation completes

## What This Does

- Submits all 20 Episode 2 scripts to Voicebox
- Uses **Kokoro preset voices** (no cloning needed)
- Voice map is pre-filled (can customize voice picks in the script)
- MP3s will appear in `audio-ep2/` folder

## After Generation

1. **Review** the 20 MP3s for quality
2. **If voice matching is off**, you can:
   - Clone Episode 1 voices in Voicebox
   - Update voice names in the script
   - Re-run for just the ones that need it
3. **Once happy**, move all MP3s to Buzzsprout as:
   - `ep2-01.mp3`, `ep2-02.mp3`, ... `ep2-20.mp3`

## Files Ready

- ✅ All 20 Episode 2 scripts (already created)
- ✅ Batch generation script (`generate-ep2-kokoro-quick.py`)
- ✅ Voice profile guide (if you want to customize later)

**Everything is ready. Just run the script tomorrow morning.**
