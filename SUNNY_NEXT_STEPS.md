# Next Steps After Test Run

## Step 1: Run the Test (Today)

**GitHub Actions → Little Sunny — New Episode → Run workflow**
- Leave `script_file` blank
- ✓ Check "Dry run"
- Click "Run workflow"
- Wait ~10-15 minutes

---

## Step 2: Download & Validate (Today)

**After workflow completes:**
1. Go to the workflow run
2. Scroll to "Artifacts" section
3. Download "episode-files"
4. Use `SUNNY_TEST_RUN_VALIDATION.md` checklist

**Critical validation:**
- [ ] Sunny is identical across all 6 scenes (same fur color, body shape, expression)
- [ ] Fur is warm golden-brown (not dark, not grey)
- [ ] Thumbnail uses real scene artwork (not plain navy)
- [ ] Art style is soft watercolor with visible brushstrokes

---

## Step 3: Decide Path (Today or Tomorrow)

### Path A: Character Looks Perfect ✓
→ **Ready for live production**
1. Commit and push
2. Schedule live episodes:
   - 7:00 AM AEST (`0 21 * * *`)
   - 1:00 PM AEST (`0 3 * * *`)
   - 7:00 PM AEST (`0 9 * * *`)
3. Monitor first 3 real episodes
4. Publish to YouTube

### Path B: Character Needs Tweaks 🔧
→ **Refine prompts and retest**
1. Note what's wrong (too dark? wrong pose? etc.)
2. Update `SONNY_CHARACTER` or `WATERCOLOUR_STYLE` in pipeline.py
3. Commit: `git add kids-channel/pipeline.py && git commit -m "Refine Sonny character: [what you changed]"`
4. Push: `git push origin main`
5. Delete character reference: `rm kids-channel/character/sonny-ref.jpg` (local, don't commit this deletion)
6. Run test again (dry run)
7. Validate again
8. Repeat until satisfied

### Path C: Kontext Unavailable 🚨
If you get error: "flux-kontext-dev not available on this account"
1. Request Kontext access on Replicate account (https://replicate.com)
2. Or switch to FLUX Dev (automatic fallback, lower consistency)
3. Continue with Path A or B

---

## Step 4: Scale to Other Channels (Next Week)

Once Sunny is locked in, apply the same approach to your other 5 YouTube channels:

### Channels Ready for Same Pipeline
1. **Sunny the Crocker TV** — Set character ref + style
2. **[Other channel]** — Set character ref + style
3. **[Other channel]** — Set character ref + style
4. **[Other channel]** — Set character ref + style
5. **[Other channel]** — Set character ref + style

**For each channel:**
1. Create new character reference image (unique design per channel)
2. Set SONNY_CHARACTER and WATERCOLOUR_STYLE for that character
3. Configure separate `kids-channel/<channel>/` folder
4. Set cron schedule for that channel's upload time
5. Run initial test (dry run)
6. Deploy live

---

## Monitoring Checklist (After Going Live)

Once you schedule live episodes, monitor:

### Daily (First Week)
- [ ] 7 AM run completes successfully
- [ ] 1 PM run completes successfully
- [ ] 7 PM run completes successfully
- [ ] All 3 episodes upload to YouTube
- [ ] Character consistency maintained across scenes
- [ ] Thumbnails render correctly

### Weekly (After First Week)
- [ ] Queue advancing (top entry removed after each run)
- [ ] No API errors accumulating
- [ ] Character reference in git stays clean
- [ ] Cost tracking (if using paid APIs)

### Monthly
- [ ] Verify queue level (should have ~60 episodes left after 1 month)
- [ ] Check YouTube analytics (views, retention, engagement)
- [ ] Collect feedback on character/style
- [ ] Plan next character design iteration (if needed)

---

## Rollback Safety

If anything goes wrong in production:

### Character Looks Bad After Going Live
1. Pause scheduled runs (disable cron in workflow file)
2. Delete `kids-channel/character/sonny-ref.jpg` from main
3. Update character/style prompts
4. Run one dry run to validate
5. Resume scheduled runs

### One Episode Failed to Upload
- Check workflow logs for error
- Fix the issue (usually API key or quota)
- Rerun that episode manually:
  ```bash
  # Trigger via Actions UI with specific script:
  # Actions → Little Sunny → Run workflow → script_file: kids-channel/scripts/[episode-name].json
  ```

### Queue Empty (All Scripts Used)
1. Write more scripts (same format as existing 86)
2. Add to `kids-channel/scripts/`
3. Add one per line to `kids-channel/queue.txt`
4. Commit and push
5. Scheduled runs continue

---

## Cost Projection (If Using Paid APIs)

**Per Episode Cost** (6 scenes + 1 character ref):
- Higgsfield: ~$0.10-0.30
- FAL.ai FLUX: ~$0.02
- Pollinations: Free
- ElevenLabs narration: ~$0.10

**Daily Cost** (3 episodes × paid services):
- Higgsfield + ElevenLabs: ~$0.60-1.20/day
- FAL.ai + ElevenLabs: ~$0.36/day
- Free tier (Pollinations + Piper TTS): $0

**Monthly Cost** (30 days):
- Highsfield + ElevenLabs: ~$18-36
- FAL.ai + ElevenLabs: ~$11
- Free tier: $0

**Revenue Potential** (3 episodes/day × 365 days):
- 1,095 episodes/year
- If monetized at $1-3 per 1000 views (YouTube Partner Program)
- Bedtime story content typically gets 100K-500K views per episode
- Potential: $109K-$548K/year gross (before YouTube's cut)

---

## Success Criteria

You'll know this is working when:

✓ **Character consistency**: Same Sunny in every scene, every episode
✓ **Thumbnail quality**: Real artwork visible in YouTube feed (not plain gradient)
✓ **Upload consistency**: All 3 daily episodes appear on schedule
✓ **View growth**: Episodes getting views and retention > 50% (bedtime story metric)
✓ **Queue management**: Queue advancing smoothly, no manual intervention needed
✓ **Cost efficiency**: Operating profitably (revenue > API costs)

---

## Questions or Issues?

Before reaching out, check:
1. Workflow logs (GitHub Actions → workflow run → "Run pipeline" step)
2. `SUNNY_TEST_RUN_VALIDATION.md` for specific validation issues
3. `SUNNY_ARTWORK_FIX_SUMMARY.md` for code/change details
4. `.env` and GitHub Secrets for missing API keys

If stuck on character consistency, the rollback is simple:
- Delete ref image
- Adjust prompts
- Retest
- No data loss, no broken state
