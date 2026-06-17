# Carousel Generation Skill

Convert text posts into multi-platform carousel images for Threads, Instagram, LinkedIn, TikTok, Stories, and presentations.

## Quick Start

In Claude Code:

```
/carousel-generate "Your text post here" --format=threads-4x5
```

Or paste a text block:

```
/carousel-generate
Here's my carousel content.

1. Hook line
2. Body point one
3. Body point two
4. Stats: 3× faster
5. Call to action

---
--format=linkedin-pdf --surface=paper --accent=teal
```

## Parameters

- `--format` — Target platform (default: threads-4x5)
  - `threads-4x5` — Threads carousel
  - `instagram-square` — Instagram Feed
  - `linkedin-pdf` — LinkedIn document
  - `tiktok-9x16` — TikTok vertical
  - `stories-9x16` — Instagram Stories
  - `wide-16x9` — Presentation deck
- `--font` — Typography (default: minimal)
  - minimal, editorial, clean, mono, condensed
- `--surface` — Background color (default: dark)
  - dark, white, light, paper, gradient, pastel, neon, ember
- `--accent` — Highlight color (default: yellow)
  - yellow, red, teal, coral, orange, violet, lime, blue, fuchsia, pink, amber
- `--bg` — Background decoration (default: glow)
  - none, blobs, dot-grid, lines, ruled-paper, noise, watermark, glow

## How It Works

1. **Parse** — Analyzes your text, auto-detects slide types:
   - First line → hook
   - Bulleted lists → list slides
   - Numbers + labels → stats
   - Quotes → quote slides
   - Rest → body slides
   - Last slide → CTA

2. **Generate** — Creates carousel config using threads-carousel template

3. **Preview** — Opens http://localhost:3333 with live toolbar
   - Switch format, font, surface, accent, background in real-time
   - Toggle RU/EN UI labels

4. **Export**
   - Download individual PNG slides
   - Batch download all PNGs
   - Export single PDF (all slides compressed)

## Content Hints

Add special markers to your text:

```
**keyword** — Highlight in accent color
- Bulleted item — Converted to list slide
✓ Checkmark item — Converted to checklist
"Quote text" — Converted to quote slide
123 →  — Will become stats if formatted as "123 label"
[Image: filename.png] — Image slide (file must be in images/ folder)
```

## Design Combos

| Look | Settings |
|------|----------|
| Noir tech | dark + minimal + teal |
| Literary warm | paper + editorial + orange |
| Dramatic | ember + mono + lime |
| Sharp editorial | white + clean + coral |
| Playful | pastel + clean + fuchsia |
| Radiant | gradient + minimal + amber |

## Integration

- **Nucleus Mary agent** — Carousel generation tool for automated campaign assets
- **Social media pipelines** — Multi-platform distribution
- **Launch kits** — Campaign carousel bundles

## Under the Hood

- Extends: `~/.claude/skills/threads-carousel/`
- Engine: Next.js 15, React 19, html-to-image, jsPDF
- Deployment: runs locally on port 3333
- Export: PNG (via html-to-image), PDF (via jsPDF with JPEG compression)

## Customization

After preview opens:
1. Manually edit slides in the browser (live reload)
2. Save carousel URL for bookmarking
3. Use toolbar to experiment with styles
4. Export when happy

For programmatic customization, edit `.claude/skills/carousel-generation/index.ts` and the `parseTextToSlides()` function to add custom slide detection logic.
