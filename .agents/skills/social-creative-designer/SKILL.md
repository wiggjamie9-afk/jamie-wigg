---
name: social-creative-designer
description: Generate one on-brand creative (image or short video) for a caption. Reads brand-style.md + the caption file's "Notes for designer", produces clients/<slug>/outputs/creatives/<YYYY-MM>/<NN-slug>.{png,mp4} via the creative-stack MCP (Replicate for image/video, ElevenLabs for voice) or HyperFrames for HTML-driven video. Invoked once per post by /social-media-manager. Encodes the visumind 1-second design rules.
metadata:
  tags: social, creative, design, video, image
---

# Social Creative Designer

One caption in, one creative out. Image OR short video — whichever the calendar's `format` requires.

## When to use

- "Design the creative for post <NN>"
- Orchestrator dispatch from `/social-media-manager` step 3b

## Inputs

Required:

1. `clients/<slug>/context/brand-style.md` — palette, fonts, motion, anti-patterns.
2. `clients/<slug>/outputs/captions/<YYYY-MM>/<NN>-*.md` — the caption frontmatter (`format`, `platform`) + "Notes for designer" + alt text.

## The 1-second rule (from visumind)

A scrolling viewer decides in **1 second**. Every creative must pass these checks before it ships:

- ❌ Long sentences on screen → ✅ **2-4 bold words max**
- ❌ Dull colors → ✅ **High contrast** against canvas (use brand-style primary on canvas)
- ❌ No emotion → ✅ **Clear face** (or one strong focal subject if no face)
- ❌ Random style → ✅ **Consistent brand** (palette + font from `brand-style.md`, no deviations)
- ❌ Buried hook → ✅ **Hook visible in first frame** (not after 2s of intro)

If the creative fails any of these, redo it. Don't ship "close enough."

## Output mapping by format

| `format` (from calendar/caption) | Tool | Output |
| --- | --- | --- |
| `single-image` | Replicate (flux/seedream) via creative-stack MCP | `<NN>-<slug>.png`, 1080×1080 or 1080×1350 (platform-dependent) |
| `carousel` | Replicate × N (3-8 frames) | `<NN>-<slug>-01.png` … `<NN>-<slug>-NN.png` |
| `short-video` | HyperFrames composition (preferred for RHYTHMIX — see `.claude/skills/hyperframes/`) OR Replicate veo/seedance | `<NN>-<slug>.mp4`, 1080×1920, ≤30s |
| `long-video` | HyperFrames composition with scene structure | `<NN>-<slug>.mp4`, ≤90s |
| `single-text` | Skip — no creative needed |
| `story` | Single-image, 1080×1920 | |
| `reply-video` | HyperFrames talking-head template | |

For RHYTHMIX `short-video` and `long-video`, prefer the `rhythmix-author` skill — it already knows the brand, scene patterns, and render pipeline. This skill delegates to it.

## Aspect ratios

- TikTok / IG Reels / Stories / YouTube Shorts → **1080×1920** (9:16)
- IG Feed → **1080×1350** (4:5)
- IG Carousel → **1080×1080** (1:1)
- Twitter/X / LinkedIn → **1200×630** (1.91:1) or 1080×1080
- Threads → 1080×1350 or 1080×1080

## Prompt construction (for Replicate image/video)

Build the prompt by composing, in order:

1. **Subject** — what's in frame (from caption "Notes for designer").
2. **Action / mood** — verb + tone.
3. **Style anchors** — copy verbatim from `brand-style.md` "Visual identity" (palette, motion, references).
4. **Composition** — rule of thirds, focal subject placement, negative space for caption overlay.
5. **Negatives** — copy from `brand-style.md` "Anti-patterns" (e.g., "no banding gradients, no Roboto, no bouncy motion").

Never use "epic," "stunning," "high-quality," "4k," or "trending on artstation." Those are noise.

## On-canvas text

If the creative needs on-canvas text (most short-videos do):

- 2-4 bold words per beat, max.
- Display font from `brand-style.md`.
- High contrast vs. canvas (use the brand's accent color on the canvas color).
- Drop shadow only if needed for legibility, never decorative.
- Caption overlay safe area: avoid the bottom 240px on TikTok / IG Reels (UI overlap).

## Tooling notes

- **Replicate + ElevenLabs MCP** lives at `.claude/mcp/creative-stack/`. If not installed, run `npm install` there and add the `mcpServers` block from its README. Requires `REPLICATE_API_TOKEN` and `ELEVENLABS_API_KEY`.
- **HyperFrames** is the preferred path for any motion creative — see `.claude/skills/hyperframes/` and `.claude/skills/hyperframes-cli/`. Lint and render via `npm run check && npm run render` from the composition dir.
- **No `Date.now()`, `Math.random()`, or network fetches** inside HyperFrames compositions — they break determinism.

## Validation

Before declaring done:

- File exists at the expected path with the expected aspect ratio.
- Passes the 1-second rule (re-check each ❌/✅ above).
- Palette inspected — no colors outside `brand-style.md` (eyeball or sample).
- For video, audio is on a separate `<audio>` clip (HyperFrames rule).

## Heartbeat

```
<ISO> · social-creative-designer · <slug> <YYYY-MM> <NN> · <output-path> · ok
```
