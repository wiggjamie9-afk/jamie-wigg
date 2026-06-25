# Podcast Episode Upload Schedule

**Release Strategy:** Mon/Wed/Fri drip cadence  
**Start Date:** Monday, June 29, 2026 (Episode 3)  
**Total Episodes:** 26 (across 20 shows)  
**Status:** Episodes 1–3 manually uploaded; Episodes 4–26 automated via GitHub Actions

## Schedule

| Episode | Release Date | Day | Status |
|---------|--------------|-----|--------|
| 1 | (before June 17) | — | Manual upload (complete) |
| 2 | (between 1–3) | — | Manual upload (complete) |
| 3 | June 29, 2026 | Mon | GitHub Actions automated (complete) |
| 4 | July 1, 2026 | Wed | Ready (audio files needed) |
| 5 | July 3, 2026 | Fri | Ready (audio files needed) |
| 6 | July 6, 2026 | Mon | Ready (audio files needed) |
| 7 | July 8, 2026 | Wed | Ready (audio files needed) |
| 8 | July 10, 2026 | Fri | Ready (audio files needed) |
| 9 | July 13, 2026 | Mon | Ready (audio files needed) |
| 10 | July 15, 2026 | Wed | Ready (audio files needed) |
| 11 | July 17, 2026 | Fri | Ready (audio files needed) |
| 12 | July 20, 2026 | Mon | Ready (audio files needed) |
| 13 | July 22, 2026 | Wed | Ready (audio files needed) |
| 14 | July 24, 2026 | Fri | Ready (audio files needed) |
| 15 | July 27, 2026 | Mon | Ready (audio files needed) |
| 16 | July 29, 2026 | Wed | Ready (audio files needed) |
| 17 | July 31, 2026 | Fri | Ready (audio files needed) |
| 18 | August 3, 2026 | Mon | Ready (audio files needed) |
| 19 | August 5, 2026 | Wed | Ready (audio files needed) |
| 20 | August 7, 2026 | Fri | Ready (audio files needed) |
| 21 | August 10, 2026 | Mon | Ready (audio files needed) |
| 22 | August 12, 2026 | Wed | Ready (audio files needed) |
| 23 | August 14, 2026 | Fri | Ready (audio files needed) |
| 24 | August 17, 2026 | Mon | Ready (audio files needed) |
| 25 | August 19, 2026 | Wed | Ready (audio files needed) |
| 26 | August 21, 2026 | Fri | Ready (audio files needed) |

## How It Works

1. **Audio files ready**: Once episode audio files are available at `voiceover-kit/audio-ep4/`, `voiceover-kit/audio-ep5/`, etc. (ep#-01.mp3 through ep#-20.mp3), add them to git:
   ```bash
   git add -f voiceover-kit/audio-ep4/*.mp3
   git add -f voiceover-kit/audio-ep5/*.mp3
   # ... repeat for each episode
   ```

2. **Trigger upload**: Update `UPLOAD_TARGET` to the episode number and push:
   ```bash
   echo "4" > UPLOAD_TARGET
   git add UPLOAD_TARGET
   git commit -m "Upload Episode 4"
   git push -u origin claude/system-prompts-leaks-2sg44g
   ```

3. **GitHub Actions handles the rest**:
   - Workflow detects the push to this branch
   - Reads `UPLOAD_TARGET` to find episode number
   - Runs `buzzsprout_episode_uploader.py --only-episode 4 --publish-now`
   - Uploads all 20 shows with unique titles/descriptions from `EPISODES_PER_SHOW` dict
   - Episodes publish on Buzzsprout at 6:00 AM on their scheduled release date

## Metadata Status

✅ **Episode 3**: Titles/descriptions in `buzzsprout_episode_uploader.py`  
✅ **Episodes 4–26**: All metadata pre-loaded in `EPISODES_PER_SHOW` dict  
❌ **Audio files**: Only Episodes 2, 3, 27 currently have audio files on disk

## Next Steps

1. Generate or obtain audio files for Episodes 4–26 from `voiceover-kit/`
2. Place them in `voiceover-kit/audio-ep4/`, `voiceover-kit/audio-ep5/`, etc.
3. Add them to git with `git add -f` (they're gitignored by default)
4. Update `UPLOAD_TARGET` and push to trigger the automated upload
5. Repeat for each episode on its scheduled Mon/Wed/Fri date

**No further user involvement required** once audio files are added — the automation handles everything else.
