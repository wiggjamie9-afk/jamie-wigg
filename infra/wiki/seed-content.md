# RHYTHMIX

AI music platform — landing pages, promo videos, downloads.

## Live

- **Downloads page**: https://wiggjamie9-afk.github.io/jamie-wigg/downloads.html
- **Repo**: https://github.com/wiggjamie9-afk/jamie-wigg

## Promo video catalog

18 rendered MP4s across 50 project dirs. Latest highlights:

| Video | Duration | Resolution | Notes |
|---|---|---|---|
| rhythmix-soul-60s | 60s | 1920×1080 | 3D character via Three.js, Higgsfield avatar |
| rhythmix-anthem-60s | 60s | 1920×1080 | Fixed-hook re-render with preview GIF |
| rhythmix-livenow-60s | 60s | 1920×1080 | Live-now urgency cut |
| rhythmix-launch-60s | 60s | 1920×1080 | Launch announcement |
| rhythmix-itslive-60s | 60s | 1920×1080 | It's-live variant |
| rhythmix-overview-60s | 60s | 1920×1080 | Canonical landscape example |

Each video dir contains:
- `index.html` — HyperFrames composition
- `*.mp4` — rendered output
- `*-poster.jpg` — first-frame still
- `*-preview.gif` — looping preview
- `*-qr.png` — one-tap iPhone download QR code

## Brand identity

See `rhythmix-teaser-60s/DESIGN.md` in the repo for the canonical palette, typography, and motion eases.

## Pipeline

- **HyperFrames** — HTML-based video composition (chosen over Remotion; see `docs/adr/ADR-0001`).
- **TTS** — ElevenLabs (creative-stack MCP) or Higgsfield Speech-to-Video.
- **Imagery** — Pollinations (free anonymous), Higgsfield Soul, or Replicate FLUX.
- **Music** — Replicate MusicGen or Pollinations Suno.
- **Render** — `hyperframes render` → MP4.
- **Deploy** — GitHub Actions `deploy-pages.yml` → GitHub Pages on every push to `main`.

## MCP servers wired

| Server | Status | Notes |
|---|---|---|
| creative-stack | needs keys | Replicate + ElevenLabs |
| higgsfield | needs keys | Soul, DOP, Speech-to-Video |
| pollinations | wired, free tier | Sandbox egress allowlist required |

## Workflows

- `deploy-pages.yml` — auto-deploys main to GitHub Pages
- `render-music-video.yml` — render a video on push
- `render-thumbnails.yml` — generate posters + preview GIFs
- `build-announcement.yml`, `build-manifesto.yml` — text assembly

## Key docs

- `CLAUDE.md` — pipeline guide + quick-start commands
- `CONTEXT.md` — domain language (Promo, Cut, Narration, Hook)
- `docs/adr/ADR-0001` — HyperFrames over Remotion
- `CREATIVE-AI-STACK.md` — iPhone-driven cloud-AI tools
