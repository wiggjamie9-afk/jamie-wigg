---
name: nano-banana-pro
description: Generate a still image with Google's Gemini 3 Pro Image ("Nano Banana Pro") via Replicate. Reach for it when a Cut or HyperFrames `<img>` slot needs sharper text rendering, multi-reference character consistency, 2K/4K output, or real-world knowledge baked into the image — situations where FLUX 1.1 Pro (the repo default) underperforms. Route everything through the `replicate_run` tool from the `creative-stack` MCP server.
---

# Nano Banana Pro

Google's Gemini 3 Pro Image (codename "Nano Banana Pro"). State of the art for prompt fidelity, embedded text, multi-image fusion, and character consistency. Slower and more expensive per image than FLUX 1.1 Pro — pick it deliberately, not by default.

## When to use it (vs the FLUX 1.1 Pro default)

Reach for Nano Banana Pro when:

- **Embedded text matters.** Posters, album covers, screenshots-inside-images, signage, lyric stills. FLUX text drifts; Nano Banana Pro renders clean typography.
- **You need character consistency across multiple shots.** Pass 1–14 reference images and it preserves the subject. The repo's existing Higgsfield route handles still→motion; Nano Banana Pro handles still→still continuity.
- **2K or 4K output.** The repo's default pipeline is 1024px-class. Use Nano Banana Pro when the asset will be on a landing-page hero or printed.
- **Multi-image fusion.** Composite a product shot into a generated environment, or merge a logo + a character + a setting in one pass.
- **World knowledge.** Real architecture, real brands (legally — avoid trademark issues), recent events, scientific diagrams. Gemini's training pulls accurate references.

Stay on **FLUX 1.1 Pro** when:

- Speed and per-image cost are the bottleneck (Nano Banana Pro is ~3–5× more per image).
- Pure photoreal vibes with no text and no reference subject — FLUX is sharper and cheaper here.
- You're iterating prompts. Draft on FLUX schnell or SDXL, finalize with Nano Banana Pro only if the brief actually needs its strengths.

## How to call it

The `creative-stack` MCP server doesn't have a dedicated `nano_banana_pro` tool. Route through `replicate_run` from the same server.

```ts
mcp__creative-stack__replicate_run({
  model: "google/nano-banana-pro",
  input: {
    prompt: "<your prompt>",
    aspect_ratio: "16:9",          // 1:1, 9:16, 16:9, 4:3, 3:4, 21:9
    output_format: "png",          // png | jpg
    output_resolution: "2K",       // 1K | 2K | 4K — 2K is the value-tier default
    // image_input: ["./hero-ref.png", "./logo.png"],  // optional, up to 14 refs
    // safety_filter_level: "block_only_high",
  },
  // filename: "hero-2k.png",  // pass when saving into a Cut folder
});
```

Then save into the Cut's folder so HyperFrames can reference it relatively:

```
rhythmix-<name>-<length>/
├── index.html
├── hero.png          ← replicate_run output, renamed
└── narration.wav
```

```html
<img src="hero.png" alt="" />
```

## Brand prompt patterns

For RHYTHMIX work, pull the visual vocabulary from `rhythmix-teaser-60s/DESIGN.md`:

- Canvas: near-black `#08050d` with violet undertones.
- Accents: magenta `#ff1f5a`, cyan `#00d8ff`, signal green `#00e887`.
- Vibe: "dark, energetic, neon AI-music aesthetic."

Nano Banana Pro responds well to structured prompts. Lead with subject, then setting, then lighting, then style descriptors:

> "A vinyl record spinning on a glossy black turntable, neon-lit underground music studio, magenta and cyan key lights from the side, shallow depth of field, photorealistic, cinematic, 2K, RHYTHMIX brand palette (#ff1f5a / #00d8ff against #08050d)"

For text-in-image prompts, **quote the exact string** you want rendered:

> "Concert poster, bold display typography reading exactly 'RHYTHMIX · LIVE TONIGHT', kerning tight, magenta foil on matte black, halftone grain"

## Cost discipline

Per `CREATIVE-AI-STACK.md`, the working budget is ~$10/month on Replicate. Nano Banana Pro is the most expensive image model in the rotation — treat it like Veo 3 in the video lineup:

- Prototype prompts on FLUX 1.1 Pro first. Once you know the framing works, regenerate on Nano Banana Pro.
- Pin `output_resolution` to `"1K"` while iterating, bump to `"2K"` or `"4K"` only for the final.
- Pass reference images aggressively when continuity matters — one good ref saves multiple rerolls.

## When NOT to reach for Nano Banana Pro

- **Animation / video** → use HunyuanVideo (`replicate_video`) or Veo 3 via `replicate_run`.
- **Still → motion (animate a generated still)** → use Higgsfield DOP via the `higgsfield-to-hyperframes` skill.
- **Background music** → `replicate_music`. Wrong modality entirely.
- **A throwaway thumbnail or quick mockup** → FLUX schnell or SDXL. Don't spend Pro dollars on disposable assets.

## Verify the schema before each session

Replicate model schemas drift. Before a serious batch run, confirm parameter names on the model page:

> https://replicate.com/google/nano-banana-pro

In particular, `output_resolution` accepted values and the upper bound on `image_input` array length have changed in past minor versions. If a parameter rejects, drop it and re-run.
