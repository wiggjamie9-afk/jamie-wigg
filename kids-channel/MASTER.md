# SUNNY — Master Plan & Canonical Assets

**This file is the single source of truth for Sonny's Cozy Quokka Bedtime Tales.
Every new asset — episode scene, book page, cover, thumbnail, promo — must come
back to the masters below. Do not invent new character designs, styles, or
title treatments.**

---

## 1. Master character (LOCKED — user-approved 2026-07-05)

| Asset | Path |
|---|---|
| **Canonical Sunny reference image** | `kids-channel/character/sonny-ref.jpg` |

Every image of Sunny is *painted from this file* via image-referenced
generation — never re-rolled from a text prompt alone. The written description
(`SONNY_CHARACTER` in `kids-channel/pipeline.py`) matches this artwork and is
only a fallback aim for generators that cannot take an image reference.

Design: baby quokka, golden-brown fluffy fur, big fluffy ears with pale inner
fur, huge sparkling dark-brown eyes, rosy blush cheeks, pale blaze down the
nose, cream chest/tummy, tiny paws tucked together, gentle closed-mouth smile.

To redesign Sunny: replace `sonny-ref.jpg` and update `SONNY_CHARACTER` to
match. Nothing else.

## 2. Master style (LOCKED)

Hand-painted watercolour children's picture book: textured cold-press paper,
visible brushstrokes, soft pigment bleeds, deep navy starry night sky, warm
honey-gold palette, glowing fireflies, soft dreamy vignette, cosy bedtime mood.
Codified as `WATERCOLOUR_STYLE` in `kids-channel/pipeline.py`.

**Approved sample:** `review/higgsfield/sunny-stream-nanobanana.png`
(user: "This is the one I want").
**Rejected:** Higgsfield Soul output with `enhance_prompt` (grinning teeth,
digital look) — never use Soul for Sunny; user: "that is disgusting".

## 3. Master cover design (LOCKED)

| Asset | Path | Use |
|---|---|---|
| Official portrait cover | `book1/redesign/art/cover-official-portrait.png` | print, store listings, thumbnails |
| Official landscape cover | `book1/redesign/art/cover-official-landscape.png` | PDF page 1, video opening |

Layout: gold ornate storybook title at top; "Sonny's Cozy Quokka Bedtime
Tales — Book N" beneath; Sunny centred in moonlit meadow; bluebells + clover
foreground; cream ribbon banner "WRITTEN BY JAMIE WIGG"; small
owl-reading-a-book emblem at bottom centre; thin gold frame on cream paper.

## 4. Canonical generation method

**Higgsfield `nano_banana_pro`** (Plus plan, ~1 credit per 2k image) with
`kids-channel/character/sonny-ref.jpg` attached as the image reference and a
prompt beginning "Using the provided reference image: keep this exact quokka
character completely unchanged — …". Proven on all of Book 1.

Priority order for any Sunny image:
1. Higgsfield Nano Banana Pro + master ref (via MCP or API)
2. Replicate FLUX Kontext + master ref (`generate_scene_image_kontext`) — needs Replicate credit
3. Replicate FLUX Dev / Pollinations FLUX with the aligned `SONNY_CHARACTER` prompt (style matches, face may drift — acceptable for episodes only, never for books/covers)

## 5. Book 1 — finished package (2026-07-05)

| Deliverable | Path |
|---|---|
| Stitched PDF (17 pages) | `book1/redesign/sunny-and-the-flying-fox.pdf` |
| Page images | `book1/redesign/pages/BOOK-1-PAGE-01…17-REDESIGN.png` |
| Raw illustrations | `book1/redesign/art/` |
| Read-aloud video (narrated, lullaby) | `book1/redesign/sunny-and-the-flying-fox-readaloud.mp4` |
| Read-aloud generator | `generate-book1-readaloud.py` + `.github/workflows/book1-readaloud.yml` |
| Page/PDF generator | `generate-book1-redesign.py` |

Narration: ElevenLabs voice (pipeline `VOICE_ID`), Piper fallback. Intro/outro
lines live in `generate-book1-readaloud.py`.

## 6. Episode pipeline status

- Workflow: `.github/workflows/little-sunny-episode.yml` (3 crons/day; dry-run
  path works; push-trigger test hook on the rebuild branch)
- Music-mix bug fixed (Path("") → directory → silent episodes)
- Prompts aligned to the master character/style
- **Blocked for uploads only:** YouTube OAuth refresh token dead
  (`invalid_grant`) — Jamie must re-auth (token-fix page) and update the
  `YOUTUBE_ACCESS_TOKEN` / `YOUTUBE_REFRESH_TOKEN` secrets
- Character lock in scheduled episodes requires either Replicate credit
  (Kontext path) or the Higgsfield nano-banana path once wired into
  `pipeline.py`

## 7. Future books / episodes — the loop to follow

1. Script → pages/scenes
2. Illustrate every image from the master ref (method §4)
3. Covers follow the master cover design (§3)
4. Compose pages → PDF; narrate per-page → read-aloud video
5. Ship to `book1`-style folder (`bookN/…`) and the channel
