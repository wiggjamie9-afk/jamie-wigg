# RHYTHMIX Launch Kit — Master Index

> Last updated: 2026-05-20 · Branch: `claude/research-emerging-tech-TTjUm`
> All voice work is v1 (mbrola placeholder). See `NARRATION-STATUS.md` for the v2 re-voice plan with ElevenLabs.

## TL;DR

**17 voiced 60s promos shipped** in this branch — 8 product-level + 9 brand-level. **9 additional renders are in flight** at 1080×1920 (Phase 3 of the build). Plus 9 thumbnail posters, 9 social-cut breakdowns, brand-voice audit, and competitive positioning map.

---

## 1. Product-level promos (4 apps × 2 clips = 8)

Each app has its own `launch-kit/<app>/` folder with full kit (BRAND.md, visuals/, thumbnails/, copy/, gumroad-listing.md, clips-3s/, clips-30s/, clips-60s/).

| App | Clip | Voice (v1 / v2-target) | Hook | Voiced MP4 |
|---|---|---|---|---|
| **RESONATE** | pitch | mb-us1 / Charlotte | "Music that breathes with you." | [`launch-kit/resonate/clips-60s/pitch/pitch-voiced.mp4`](./resonate/clips-60s/pitch/pitch-voiced.mp4) |
| **RESONATE** | science | mb-us1 / Charlotte | "What if the music listened back?" | [`launch-kit/resonate/clips-60s/science/science-voiced.mp4`](./resonate/clips-60s/science/science-voiced.mp4) |
| **DREAMS** | pitch | mb-us1 / Emma | bedtime ritual + dream recall | [`launch-kit/dreams/clips-60s/pitch/pitch-voiced.mp4`](./dreams/clips-60s/pitch/pitch-voiced.mp4) |
| **DREAMS** | ritual | mb-us1 / Emma | generative bedtime ritual | [`launch-kit/dreams/clips-60s/ritual/ritual-voiced.mp4`](./dreams/clips-60s/ritual/ritual-voiced.mp4) |
| **LIVE** | pitch | mb-us2 / Adam | beat-synced AI music video co-pilot | [`launch-kit/live/clips-60s/pitch/pitch-voiced.mp4`](./live/clips-60s/pitch/pitch-voiced.mp4) |
| **LIVE** | pipeline | mb-us2 / Adam | Kling 2.6 pipeline | [`launch-kit/live/clips-60s/pipeline/pipeline-voiced.mp4`](./live/clips-60s/pipeline/pipeline-voiced.mp4) |
| **HUM** | howto | mb-en1 / Alice | daily humming practice | [`launch-kit/hum/clips-60s/howto/howto-voiced.mp4`](./hum/clips-60s/howto/howto-voiced.mp4) |
| **HUM** | origins | mb-en1 / Alice | the science of humming | [`launch-kit/hum/clips-60s/origins/origins-voiced.mp4`](./hum/clips-60s/origins/origins-voiced.mp4) |

Each product app has a landing page at `<app>.html` (root) and Gumroad listing copy at `launch-kit/<app>/gumroad-listing.md`. All AU$30 lifetime.

---

## 2. Brand-level RHYTHMIX promos

### Shipped (9 voiced, in repo root as `rhythmix-<slug>-60s/`)

| Slug | Voice (v1) | Angle | Hook line | Has poster.html | Has social-cuts.md |
|---|---|---|---|---|---|
| anthem | mb-us1 | Democratization | "No producer. No studio. No instrument." | ✅ | ✅ |
| itslive | mb-us2 | Launch declaration | "The wait is over. RHYTHMIX is live." | ✅ | ✅ |
| launch | mb-us2 | Competitive positioning | "Suno writes the song. Udio writes the song. LANDR masters the song. Then what?" | ✅ | ✅ |
| teaser | mb-us1 | Pre-launch soft hook | "What if you could make music." | ✅ | ✅ |
| founder | mb-us1 | Personal founder pitch | "Hi. I'm Jamie. I built this." | ✅ | ✅ |
| livenow | mb-us2 | Available-today | "Right now. Yours today." | ✅ | ✅ |
| overview | mb-us1 | Comprehensive intro | covers all 4 pillars | ✅ | ✅ |
| soul | mb-us1 | Emotional core | "your spark is already there" | ✅ | ✅ |
| square | mb-us2 | Social-feed scroll-stopper | "What if making music didn't take YEARS?" | ✅ | ✅ |

### In-progress (Phase 3 renders running, 9 more queued)

| Slug | Status | Has narration.txt | Has index.html |
|---|---|---|---|
| backstory | 🔄 rendering at 1080×1920, will bake on completion | ✅ | ✅ |
| getit | 🔄 rendering | ✅ | ✅ |
| iphone | ⏳ next batch | ✅ | ✅ |
| origin | ⏳ next batch | ✅ | ✅ |
| platform | ⏳ next batch | ✅ | ✅ |
| premiere | ⏳ next batch | ✅ | ✅ |
| creator | ⏳ Phase 4 (after Phase 3 clears CPU) | ✅ | ✅ (Phase 2 agent) |
| debut | ⏳ Phase 4 | ✅ | ✅ (Phase 2 agent) |
| era | ⏳ Phase 4 | ✅ | ✅ (Phase 2 agent) |

Phase 3 also re-renders anthem + itslive at 1080×1920 so they're Shorts/TikTok-eligible (current voiced.mp4s are 1920×1080 landscape — still valid for YouTube horizontal).

---

## 3. Aspect-ratio status per promo (for social distribution)

| Aspect | 9:16 vertical (TikTok/Reels/Shorts) | 1:1 square (IG feed) | 16:9 landscape (YouTube) |
|---|---|---|---|
| anthem | 🔄 re-rendering | — | ✅ |
| itslive | 🔄 re-rendering | — | ✅ |
| launch | ✅ already 9:16 | — | needs reframe |
| teaser | ✅ already 9:16 | — | needs reframe |
| founder | needs re-render | — | ✅ |
| livenow | ✅ already 9:16 | — | needs reframe |
| overview | needs re-render | — | ✅ (canonical landscape per CLAUDE.md) |
| soul | needs re-render | — | ✅ |
| square | needs reframe | ✅ already 1:1 | needs reframe |
| backstory/getit/iphone/origin/platform/premiere | 🔄 rendering at 9:16 | — | — |
| creator/debut/era | ⏳ Phase 4 at 9:16 | — | — |

---

## 4. Supporting docs in this kit

| Doc | Purpose |
|---|---|
| [`NARRATION-STATUS.md`](./NARRATION-STATUS.md) | v1 placeholder details + v2 re-voice playbook |
| [`VOICEOVER-CHECKLIST.md`](./VOICEOVER-CHECKLIST.md) | Phone-side checklist for re-voicing the 8 product clips in ElevenLabs |
| [`VOICEOVER-WORKFLOW.md`](./VOICEOVER-WORKFLOW.md) | The pipeline mechanics |
| [`RESEARCH-APPS-INDEX.md`](./RESEARCH-APPS-INDEX.md) | Strategy synthesis (emerging-tech-2026 research bundle) |
| [`BRAND-VOICE-AUDIT.md`](./BRAND-VOICE-AUDIT.md) | 9 drift items found across 12 narrations — all 9 fixed in commits c364f45 / 200990e / 3275e6b |
| [`COMPETITIVE-POSITIONING-2026.md`](./COMPETITIVE-POSITIONING-2026.md) | RHYTHMIX vs Suno / Udio / LANDR / Stable Audio / AIVA / Boomy / Soundful / Beatoven across pillar coverage + 5-year TCO + sharpened positioning lines |

---

## 5. Reproducing the build (in a fresh container)

```bash
# Python toolkit (audio + video Python libraries)
pip install -r requirements-audio.txt
pip install -r requirements-tools.txt

# System packages (Ubuntu/Debian — see APT-PACKAGES.md for full list)
sudo apt-get install -y build-essential \
  libcairo2-dev libpango1.0-dev python3-dev \
  libgstreamer1.0-dev libsoup-3.0-dev \
  espeak-ng mbrola mbrola-us1 mbrola-us2 mbrola-en1

# Render any HyperFrames composition at 9:16 vertical:
bash /tmp/render-clip-time.sh path/to/index.html 60 path/to/output.mp4 1080 1920

# Re-bake a clip after updating narration.mp3:
ffmpeg -y -i base.mp4 -i narration.mp3 \
  -c:v copy -c:a aac -b:a 192k -t 60 \
  -map 0:v -map 1:a -movflags +faststart \
  voiced.mp4
```

For ElevenLabs v2 re-voicing, see `NARRATION-STATUS.md`.

---

## 6. Headline metrics

- **17 promos** voiced + baked (8 product + 9 brand)
- **9 more** in active render
- **12 narrations** brand-voice-audit-compliant
- **9 poster.html thumbnails** + **9 social-cuts.md** breakdowns
- **24-agent parallel fan-out** executed in earlier turn covering posters, social cuts, narrations, brand audit, competitive positioning
- **Total branch commits this build:** ~25, all atomic
