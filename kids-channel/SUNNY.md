# Sonny's Cozy Quokka Bedtime Tales

Automated kids YouTube channel producing calm bedtime stories for toddlers (ages 1–5).
Runs fully automatically — 3 episodes per day, every day.

---

## What each episode produces

Every run of the pipeline creates a complete content bundle:

| File | What it is |
|---|---|
| `final.mp4` | Full episode video (6 scenes, ~55s, narration + music) |
| `thumbnail.jpg` | YouTube thumbnail (1280×720, navy/gold, episode title) |
| `ebook.pdf` | PDF picture book — one page per scene with illustration + narration text |
| `narration.mp3` | Voice-over audio track |
| `music.mp3` | Background lullaby music |
| `scene_01.jpg` … `scene_06.jpg` | Individual scene illustrations |
| `script.json` | Full episode script (title, description, tags, narration, scenes) |

All files land in `kids-channel/episodes/<episode-slug>/`.

---

## The ebook

Each episode automatically generates a **PDF picture book** alongside the video:

- **Portrait format** — 800×1120px per page, children's book proportions
- **Title page** — navy night sky, golden title, show name
- **One page per scene** — scene illustration on top, narration text below
- **Closing page** — "Sweet dreams!" sign-off
- Saves as `ebook.pdf` in the episode folder
- Uploaded as a workflow artifact (kept 7 days) — download from GitHub Actions

---

## Schedule

Runs automatically via GitHub Actions:

| Time (AEST) | UTC cron |
|---|---|
| 7:00 AM | `0 21 * * *` |
| 1:00 PM | `0 3 * * *` |
| 7:00 PM | `0 9 * * *` |

---

## Episode queue

86 pre-written scripts in `kids-channel/scripts/`. Queue order in `kids-channel/queue.txt`.
After each successful episode, the top entry is removed and the queue advances automatically.
86 episodes = approximately 3 months of daily content with no further action needed.

---

## Image generation (priority order)

All images now generate in **professional watercolour children's book style** (Beatrix Potter / Jill Barklem aesthetic):

1. **Higgsfield Soul** — AI watercolour illustrations with professional art direction (needs `HIGGSFIELD_API_KEY`)
2. **Replicate FLUX Dev** — Professional watercolour-style FLUX Dev (needs `REPLICATE_API_TOKEN`)
3. **FAL.ai FLUX Schnell** — Professional watercolour via FLUX Schnell (~$0.003/image, needs `FAL_KEY`)
4. **Pollinations FLUX** — Free professional watercolour AI images (may be rate-limited in CI)
5. **Pexels / Pixabay stock** — Royalty-free nature photos (needs free API keys)
6. **PIL illustration** — Fallback procedural art (always works, no external calls)

**Character consistency:** Sonny the quokka has an identical appearance across all 12 scenes — same golden-brown fur colour, same eye size and warmth, same expression, same ear shape. All prompts emphasize this consistency.

**Professional watercolour attributes:**
- Hand-painted texture with visible brushstrokes
- Soft pigment bleeds and gentle colour washes
- Textured cold-press paper appearance
- Warm earthy palette (ochres, burnt siennas, soft greens, deep blues)
- Loose, sketchy linework for gum trees
- No digital/vector artefacts, no glossy 3D, no sharp crisp edges

---

## Narration (priority order)

1. **ElevenLabs** — premium voice (needs `ELEVENLABS_API_KEY`)
2. **Piper TTS** — free offline TTS, calm voice, no API key needed

---

## Background music (priority order)

1. **Pixabay Music** via OpenMontage — real royalty-free lullaby tracks, no key needed
2. **ffmpeg pentatonic tones** — generated C-E-G-A-C lullaby, always works

---

## Character

**Sonny** — a sweet small quokka with golden-brown fur, big warm brown eyes, tiny round ears, gentle curious expression. Set in the Australian bush at night — deep navy sky, soft moonlight, glowing fireflies.

---

## GitHub Secrets required

| Secret | Purpose | Status |
|---|---|---|
| `ANTHROPIC_API_KEY` | Script generation (Claude Haiku) | ✅ Set |
| `ELEVENLABS_API_KEY` | Premium narration voice | ✅ Set |
| `YOUTUBE_CLIENT_ID` | YouTube OAuth | ✅ Updated |
| `YOUTUBE_CLIENT_SECRET` | YouTube OAuth | ✅ Updated |
| `YOUTUBE_ACCESS_TOKEN` | YouTube upload auth | ⚠️ Needs refresh |
| `YOUTUBE_REFRESH_TOKEN` | YouTube upload auth | ⚠️ Needs refresh |
| `HIGGSFIELD_API_KEY` | AI image generation (optional) | ✅ Set |
| `HIGGSFIELD_SECRET` | AI image generation (optional) | ✅ Set |
| `FAL_KEY` | FLUX images via fal.ai (optional) | — |
| `PEXELS_API_KEY` | Stock photos (optional, free) | — |
| `PIXABAY_API_KEY` | Stock photos (optional, free) | — |

---

## To refresh YouTube tokens

Run on your computer from the repo folder:

```bash
python kids-channel/youtube_auth.py
```

Follow the link → sign in → paste the code back.
Then update `YOUTUBE_ACCESS_TOKEN` and `YOUTUBE_REFRESH_TOKEN` in GitHub Secrets.

---

## Manual trigger

Go to **Actions → Little Sunny — New Episode → Run workflow**.
Tick **Dry run** to test without uploading. Leave it unticked for a real episode.

---

## Files

```
kids-channel/
├── pipeline.py          # Main pipeline — runs everything
├── youtube_auth.py      # One-time OAuth setup script
├── queue.txt            # Episode queue (one script path per line)
├── channel-art.png      # YouTube channel banner (2560×1440)
├── lunch-fix.html       # OAuth fix reference page
├── SUNNY.md             # This file
├── scripts/             # 86 pre-written episode scripts (.json)
└── episodes/            # Generated episode output folders
```
