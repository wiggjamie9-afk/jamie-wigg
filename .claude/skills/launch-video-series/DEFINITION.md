# launch-video-series

End-to-end workflow for producing and publishing an animated video series (4 weeks).

## Trigger

User runs: `/launch-video-series "Series Concept"` or loads this skill for multi-week video production.

## What this skill does

Orchestrates all agents across 4-week pipeline:

**Week 1: Concept → Script**
- Story breakdown into 5-minute episodes
- Script + voiceover cues
- Voice recording (Voicebox)

**Week 2: Storyboard → Animation**
- Character design (illustrator agent)
- Full animation (cartoon-animator agent)
- Motion polish (motion-graphics-designer agent)

**Week 3: Render → Publish**
- Final render (video-producer agent)
- YouTube upload + SEO (youtube-strategist agent)
- Thumbnail variations (thumbnail-designer agent)

**Week 4: Distribute → Measure**
- TikTok/Reels clips (shorts-producer agent)
- Community engagement (community-manager agent)
- Analytics dashboard (analytics-engineer agent)

## Requires

- Series concept (2-3 sentence pitch)
- 10-20 minute production budget (agents run in parallel)
- Voicebox running locally (for voice recording)
- YouTube channel + upload API access
- Stripe account (optional, for monetization step)

## Related docs

- `ECOSYSTEM.md` — Full agent roster and workflow architecture
- `VOICEBOX-SETUP.md` — Voice cloning setup
- Workflow orchestration in `docs/workflows/`

## Agent chain

```
story-concept
  → storyboard-artist (Figma boards)
  → illustrator (character design)
  → cartoon-animator (keyframe animation, lip-sync)
  → motion-graphics-designer (titles, transitions)
  → voicebox-agent (voice recording)
  → video-producer (render)
  → youtube-strategist (upload + SEO)
  → thumbnail-designer (A/B thumbnails)
  → shorts-producer (TikTok extraction)
  → community-manager (engagement)
  → analytics-engineer (tracking)
```

## Output artifacts

- 5-minute animated video (MP4)
- YouTube listing (title, description, tags)
- 3 thumbnail variations (PNG)
- 6× 15-second Shorts clips
- Community engagement dashboard
- Weekly analytics report
