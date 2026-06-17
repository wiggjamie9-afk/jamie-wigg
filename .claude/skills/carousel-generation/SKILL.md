# /carousel-generate

Convert text posts into multi-platform carousel images: Threads, Instagram, LinkedIn, TikTok, Stories, or wide presentation decks.

## Usage

```
/carousel-generate <text> [--format=FORMAT] [--font=FONT] [--surface=SURFACE] [--accent=ACCENT] [--bg=BACKGROUND]
```

## Examples

```
/carousel-generate "Here's how to use carousels effectively. One: write a hook. Two: break content into 5-7 slides..."

/carousel-generate "AI is transforming marketing" --format=linkedin-pdf --surface=paper --accent=teal

/carousel-generate <paste your text> --format=tiktok-9x16 --font=clean --surface=neon --accent=lime --bg=glow
```

## Format Presets

| Format | Dimensions | Platform | Use Case |
|--------|-----------|----------|----------|
| `threads-4x5` (default) | 1080×1350 | Threads | Text-first carousel |
| `instagram-square` | 1080×1080 | Instagram Feed | Square format |
| `linkedin-pdf` | 1920×1440 | LinkedIn | Document PDF export |
| `tiktok-9x16` | 1080×1920 | TikTok/Reels | Vertical scrolling |
| `stories-9x16` | 1080×1920 | Instagram Stories | Story format |
| `wide-16x9` | 1920×1080 | YouTube/Presentations | Presentation deck |

## Design System Axes

**Fonts** (pick one)
- `minimal` — Unbounded bold display (default)
- `editorial` — Playfair serif
- `clean` — Inter sans-serif
- `mono` — JetBrains Mono tech feel
- `condensed` — Oswald narrow poster

**Surfaces** (pick one, default: dark)
- `dark` — Black bg, white text
- `white` — White bg, dark text
- `light` — Light gray bg
- `paper` — Cream/beige paper
- `gradient` — Colorful gradient
- `pastel` — Soft pastels
- `neon` — Bright neon
- `ember` — Deep warm tones

**Accents** (pick one, default: yellow)
- yellow, red, teal, coral, orange, violet, lime, blue, fuchsia, pink, amber

**Backgrounds** (pick one, default: glow)
- `none` — Solid only
- `blobs` — Organic blob shapes
- `dot-grid` — Polka dot grid
- `lines` — Diagonal lines
- `ruled-paper` — Notebook lines
- `noise` — SVG noise texture
- `watermark` — Big number watermark
- `glow` — Radial gradient glow

## Output

The skill:
1. Analyzes your text post
2. Splits into 5–12 slides (hook, body, list, stats, quote, etc.)
3. Generates carousel config
4. Opens live preview at `http://localhost:3333`
5. Toolbar lets you switch format, font, surface, accent, and background in real-time
6. **Export options**:
   - Individual PNG per slide
   - Batch PNG (all slides)
   - Single PDF (all slides, JPEG-compressed, 5–8 MB for 10 slides)

## Slide Types Auto-Detected

The skill automatically chooses slide types based on content:

| Content | Auto-Type |
|---------|-----------|
| Opening line | `hook` |
| Title + paragraph | `body` |
| Bulleted list | `list` |
| Numbers + labels | `stats` |
| Pulled quote | `quote` |
| Checklist items | `checklist` |
| Step-by-step | `process` |
| Comparison | `comparison` |
| Call-to-action | `cta` |

## Great Combos

- **dark + teal** — Noir tech aesthetic
- **paper + orange** — Literary warm
- **ember + lime** — Dramatic announcement
- **white + coral** — Sharp editorial
- **pastel + fuchsia** — Playful
- **gradient + amber** — Radiant

## Tips

1. **Add images**: Create a `carousel-work/` subfolder, add PNG/JPG files, then reference in your post:
   ```
   [Image: screenshot.png]
   ```

2. **Highlight keywords**: Any word you want emphasized in accent color:
   ```
   "Claude Code is smarter with **skills**"
   ```

3. **Bilingual UI**: Toggle between Russian (RU) and English (EN) in the toolbar.

4. **Optimize for platform**: LinkedIn PDFs work best with `paper` surface and `editorial` font; TikTok prefers `neon` + `condensed`.

5. **Save your config**: After the preview opens, right-click → Save → bookmark the URL for one-click carousel regeneration.

## Integrations

- Works with **Nucleus Mary agent** for automated campaign carousel generation
- Feeds carousels into **social media posting pipelines**
- Supports **multi-language** content (English, Russian, any LTR language)

## References

- Upstream: https://github.com/itchernetski/threads-carousel-claude-skill
- Tech: Next.js 15, React 19, html-to-image, jsPDF
- License: MIT
