---
name: replicate
description: Pick the right Replicate model and the right creative-stack MCP tool for generating an image, video, or music asset for a RHYTHMIX Promo. Use when the user wants AI imagery, b-roll, or background music produced via Replicate — or when you're authoring a Cut and need to fill an `<img>`, `<video>`, or `<audio>` slot with a generated asset.
---

# Replicate (creative-stack MCP)

The `creative-stack` MCP server (`.claude/mcp/creative-stack/`) exposes four Replicate tools. Pick by output modality, not by model name.

## Tools

| Tool              | Use for                                            | Default model                          | Output type |
| ----------------- | -------------------------------------------------- | -------------------------------------- | ----------- |
| `replicate_image` | Stills, posters, hero shots, thumbnails            | `black-forest-labs/flux-1.1-pro`       | `.png`      |
| `replicate_video` | B-roll clips, AI animation                         | `tencent/hunyuan-video`                | `.mp4`      |
| `replicate_music` | Background tracks, stings, loops                   | `meta/musicgen`                        | `.wav`      |
| `replicate_run`   | Anything else (Veo 3, Wan 2.1, a fine-tune, etc.)  | — (you supply `owner/name[:version]`)  | raw URL(s)  |

Outputs land on disk inside the working directory so HyperFrames can reference them by relative path.

## Model choice

These are the locked-in defaults for this repo (per `CREATIVE-AI-STACK.md`). Don't substitute without a reason.

**Image**
- Default: **FLUX 1.1 Pro** (`black-forest-labs/flux-1.1-pro`) — photorealism, prompt fidelity, cheap per image.
- Higher quality: **FLUX 1.1 Pro Ultra** — only when the default isn't sharp enough.
- Open-source/style alts (only if FLUX won't do it): **SDXL**, **FLUX schnell**, a fine-tune from Civitai.

**Video**
- Default: **HunyuanVideo** — open-source, decent quality, no subscription.
- Higher quality: **Google Veo 3** (`google/veo-3`) — the gold standard if budget allows. Cinematic, includes sound + dialogue.
- Style alt: **Wan 2.1** — when HunyuanVideo's output doesn't match the brand.

For Veo 3 / Wan 2.1, use `replicate_run` and pass `model: "google/veo-3"` (or equivalent) — they aren't `replicate_video`'s default.

**Music**
- Default: **MusicGen** (`meta/musicgen`) — short instrumental beds, loops, stings.
- For full songs: use **Suno** or **Udio** in a browser instead. Replicate is for short generative pieces that fit *under* a narration track, not chart-ready songs.

## Workflow inside a Cut

When you generate an asset for a Cut, save it inside that Cut's folder so the composition can reference it relatively:

```
rhythmix-<name>-<length>/
├── index.html
├── narration.wav
├── hero.png          ← replicate_image filename: "hero.png"
├── b-roll-1.mp4      ← replicate_video filename: "b-roll-1.mp4"
└── bed.wav           ← replicate_music filename: "bed.wav"
```

Then wire it into `index.html`:

```html
<img src="hero.png" alt="" />
<video src="b-roll-1.mp4" autoplay muted playsinline></video>
<audio src="bed.wav" autoplay></audio>
```

Pass an explicit `filename` to every tool — the default `replicate-<kind>-<timestamp>.<ext>` is fine for scratch but bad for committed Cuts.

## Prompt style

Pull the visual vocabulary from `rhythmix-teaser-60s/DESIGN.md` when generating assets that need to match the brand:

- Canvas: near-black `#08050d` with violet undertones.
- Accents: magenta `#ff1f5a`, cyan `#00d8ff`, signal green `#00e887`.
- Vibe: "dark, energetic, neon AI-music aesthetic."

Avoid (these break brand): default blue `#3b82f6`, Roboto/Arial typography, full-frame linear gradients, bouncy/elastic motion language.

## When NOT to reach for Replicate

- **The narration itself** → use the `elevenlabs_tts` tool from the same MCP server. Narration is not a Replicate concern.
- **A photorealistic still you want to then animate** → use the Higgsfield MCP (`mcp__higgsfield__*`) instead — it owns the still → motion pipeline via DOP image-to-video. See the `higgsfield-to-hyperframes` skill.
- **A full song** → Suno / Udio in a browser (see CREATIVE-AI-STACK.md). Replicate music models top out around 30s and aren't tuned for vocals.

## Cost discipline

Per `CREATIVE-AI-STACK.md`, the working budget is ~$10/mo on Replicate. To stay there:

- Iterate prompts on lower-cost models first (FLUX schnell, SDXL) before paying for Pro Ultra.
- For video, prototype with HunyuanVideo before spending Veo 3 dollars.
- Don't re-render a Cut just to regenerate one asset — re-generate the asset alone and drop it in.
