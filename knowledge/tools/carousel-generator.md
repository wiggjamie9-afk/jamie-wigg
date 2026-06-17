# Threads Carousel Skill

Multi-platform carousel generator for Threads, Instagram, LinkedIn, TikTok, and Stories. Converts text posts into visual carousel images with composable design system.

## Key Features

**12 Slide Types**
- Hook, body, list, stats, quote, checklist, process, comparison, CTA, image (text + photo), emoji (giant illustration), number (hero digit)
- Points variant for pros/cons lists with SVG icons (✓/✗)

**6 Format Presets**
- Threads 4:5 (1080×1350)
- Instagram square (1080×1080)
- LinkedIn document PDF
- TikTok 9:16 (1080×1920)
- Stories 9:16 (1080×1920)
- Wide 16:9 (1920×1080) for presentations/YouTube

**4-Axis Style System** — 880 valid combinations
- Font (5): Minimal, Editorial, Clean, Mono, Condensed
- Surface (8): Dark, White, Light, Paper, Gradient, Pastel, Neon, Ember
- Accent (11): Yellow, Red, Teal, Coral, Orange, Violet, Lime, Blue, Fuchsia, Pink, Amber
- Purpose: Carousel (bold 44px uppercase) or Presentation (72px sentence case)

**8 Background Decorations**
- None, organic blobs, dot grid, diagonal lines, ruled paper, SVG noise, big number watermark, radial glow

**Additional Capabilities**
- Highlighted keywords in accent color with optional italic-box style
- Image support (PNG/JPG in template/public/images/)
- Small outlined badges (01, 02, TIP, NEW)
- Text balancing on hooks/titles to prevent orphan words
- Adaptive typography scales to content length
- Live preview toolbar (switch format, purpose, font, surface, accent, background without editing code)
- Bilingual UI (RU/EN toggle)
- PNG export (individual or batch) via html-to-image
- PDF export (all slides in single file, JPEG-compressed, 5–8 MB for 10 slides)

## Architecture

```
template/
├── public/images/          ← Add PNG/JPG files here
├── src/
│   ├── slides.ts          ← Content: SLIDES array + defaults
│   ├── lib/
│   │   ├── types.ts       ← Shared types
│   │   └── presets.ts     ← Styles + surfaces + accents + format presets
│   └── app/
│       ├── CarouselApp.tsx ← Rendering engine + toolbar
│       ├── page.tsx
│       └── layout.tsx
└── package.json
```

Golden rule: to change carousel content, only edit `src/slides.ts`. Everything else is engine.

## Tech Stack

- Next.js 15 (React framework)
- React 19
- TypeScript 5
- Tailwind CSS 4
- html-to-image (PNG/JPEG export)
- jsPDF (PDF export)
- Google Fonts (Unbounded, Inter, Playfair, JetBrains Mono, Oswald)

## Design System

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Hook | 88–170px | 800 | hookFontFamily |
| Title | 44px | 800 uppercase | fontFamily |
| Body | 48–88px | 600 | fontFamily |
| Points | 44–62px | 600 | fontFamily |
| Stats | 140–170px | 900 | fontFamily |
| Quote | 62px | 600 | fontFamily |
| List item | 46px | 600 | fontFamily |
| Emoji | 360px | — | OS emoji |
| Big number | 320–560px | 900 | hookFontFamily |

## Customization

**Adding a new font**: Edit `FONT_STYLES` in `src/lib/presets.ts`, load via `next/font/google` in layout.tsx, add CSS variable.

**Adding a new surface**: Edit `SURFACES` in presets.ts with bg, bgGradient, textColor, textSecondary, accentColor.

**Adding a new accent**: Add entry to `ACCENTS` with id, name, color.

**Modifying formats**: Edit `FORMAT_PRESETS` in presets.ts.

## Usage as Claude Code Skill

```bash
git clone https://github.com/itchernetski/threads-carousel-claude-skill.git ~/.claude/skills/threads-carousel
cd ~/.claude/skills/threads-carousel/template
bun install
```

In Claude Code, trigger with: "Make a Threads carousel from this text" or "Сделай карусель из этого поста"

Claude reads the text, splits into slides, edits `src/slides.ts`, launches `bun dev` on port 3333, and provides preview URL.

## Standalone Usage

```bash
cd template
bun install
# Edit src/slides.ts
bun dev --port 3333
# http://localhost:3333 → Click "Export All" for PNGs
```

## Related Projects

- Slashgear/linkedin-carousel-gen — LinkedIn carousels via Satori + PDF
- FranciscoMoretti/carousel-generator — in-browser LinkedIn carousel editor
- fern-opensource/carouselmaker — LinkedIn carousels via LangGraph + Claude + Figma MCP

## Roadmap

- Per-slide background override
- Cyrillic-optimized defaults (adaptive sizing for Russian/Cyrillic density)
- Satori + Resvg server-side export (sharper PNG output, CLI use)

## License

MIT

**Built with Claude Code.**

---

**Use Case for Nucleus:** Carousel generation as multi-platform social media asset creation tool. Mary agent can automatically generate campaign carousels for Threads, Instagram, LinkedIn from marketing briefs. Feeds into launch-kit distribution and social media posting automation.
