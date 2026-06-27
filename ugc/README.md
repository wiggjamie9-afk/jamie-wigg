# ugc/ — the property-reel production engine

Turn property listings (photos + details) into finished **9:16 vertical reels** —
branded title/outro cards, Ken Burns motion, feature captions, music + optional
voiceover. One listing or a whole batch, unattended. **This is the production
engine behind `docs/BUSINESS-PLAN.md`.**

Pure **ffmpeg + Pillow** — the core needs **no API keys**. Voice and AI b-roll are
optional plug-ins.

## Install (Codespace / local)

```bash
pip install pillow imageio-ffmpeg     # imageio-ffmpeg bundles ffmpeg; or use system ffmpeg
```

## 1. One listing

```bash
python ugc/build_reel.py ugc/listings/12-smith-st
# → ugc/out/12-smith-st/reel.mp4   (1080x1920)
```

## 2. The loop — a whole batch, unattended

```bash
python ugc/build_batch.py                 # build every ugc/listings/*/
python ugc/build_batch.py --workers 3     # parallel
python ugc/build_batch.py --watch 300     # re-scan every 5 min (cron-style)
python ugc/build_batch.py --force         # rebuild existing
```

Drop N listing folders in → get N finished reels out. That's the automation: one
person, agency output.

## Listing format

`ugc/listings/<slug>/`:
```
listing.json
01.jpg  02.jpg  03.jpg  ...        # the property photos (any order)
```
```json
{
  "address": "12 Smith Street",
  "suburb": "Bondi NSW 2026",
  "price": "$2,450,000",
  "beds": 4, "baths": 3, "cars": 2,
  "features": ["Light-filled living", "Chef's kitchen + stone island",
               "Master with ensuite + WIR", "North-facing level yard"],
  "agent": { "name": "Jamie Wigg", "phone": "0400 000 000", "brand": "#1a73e8" },
  "music": "bed.mp3",          // optional, relative to the listing dir
  "voiceover": "vo.wav"        // optional
}
```
`features[i]` becomes the caption on photo `i+1`. `brand` colours the cards.

## Optional plug-ins (your stack, no Higgsfield / no ElevenLabs)

- **Voiceover (free):** generate `vo.wav` with **Kokoro** and reference it as `voiceover`.
  ```bash
  npx --yes hyperframes@0.4.42 tts   # or: kokoro-tts script.txt vo.wav
  ```
  Premium voice: a Replicate **MiniMax speech-02 / Chatterbox** call → save as `vo.wav`.
- **Music bed:** drop an `.mp3` and set `music`. Generate one with **MusicGen** (`replicate_music`)
  or use a licensed track.
- **AI b-roll / enhanced stills:** generate extra frames with **FLUX / Kling** (`replicate_image`,
  `fal-*`) and just add them as photos in the listing folder — the pipeline treats them like any
  other shot.

## How this is the business (see docs/BUSINESS-PLAN.md)

- A freelancer makes one reel at a time. `build_batch.py` makes them at scale → the margin and the
  "for life" part.
- Intake (agent emails photos + details) → drop a folder → run the loop → deliver same day.
- Productise later: a web form that writes the `listing.json` + uploads photos, then triggers this
  pipeline = the self-serve SaaS.

## Notes

- Output: 1080×1920 H.264 + AAC, ~12–18s depending on photo count (3s/photo + cards).
- Tune `SECS_PER_PHOTO`, `CARD_SECS`, zoom, and card layout at the top of `build_reel.py`.
- Real-estate reels are mostly **photos + motion + text** (not full AI video), which is exactly
  what this does — fast, cheap, on-brand.
