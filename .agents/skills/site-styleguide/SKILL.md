---
name: site-styleguide
description: Stage 3 of the four-stage site build. Define the visual language — colors, typography, spacing, components, motion. Output is sites/<slug>/styleguide.md, consumed by /site-design. Triggered by /site-styleguide.
---

# Site Styleguide

Third stage of the site build pipeline. Defines the visual language so the design stage can render consistent HTML/CSS.

## When to use

- "/site-styleguide <slug>"
- after `/site-sitemap` and `/site-wireframe`, before `/site-design`
- standalone: when a site already exists and you want to refactor its visual language

## Process

### 1. Read what's there

In parallel:
- `sites/<slug>/sitemap.md` (for tone / audience signals)
- `sites/<slug>/wireframes/*.md` (for component patterns that need to be defined)
- `rhythmix-teaser-60s/DESIGN.md` (if it exists — the RHYTHMIX brand source)
- Any `text*.txt` or existing `.html` in repo root — these are prior landing-page experiments worth pattern-matching against

### 2. Ask 1-3 clarifying questions via `AskUserQuestion`

The single most important question:

**Brand source**:
- **Use RHYTHMIX brand** — read `rhythmix-teaser-60s/DESIGN.md` and lock to its palette / typography / eases. Recommended for RHYTHMIX-adjacent sites.
- **Borrow from an existing site** — point at an existing `text*.txt` / `*.html` in the repo to extract tokens from
- **Fresh** — define from scratch based on tone

If "Fresh", also ask:

**Tone**:
- Editorial / minimal (lots of whitespace, serif headings, single accent color)
- Vibrant / playful (gradients, rounded everything, multiple accents)
- Technical / utilitarian (mono fonts, tight spacing, monochrome with one signal color)
- Premium / dark (dark background, glow accents, subtle gold/silver)

**Density**:
- Spacious (large gaps, big type)
- Standard
- Dense (tight gaps, compact components)

### 3. Generate `sites/<slug>/styleguide.md`

```markdown
# Styleguide: <Site Name>

## Brand source
<one line — "Locked to rhythmix-teaser-60s/DESIGN.md" / "Fresh, editorial / minimal tone" / etc.>

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0a0a0a` | page background |
| `--surface` | `#141414` | cards, modals |
| `--text` | `#f5f5f5` | body text |
| `--text-muted` | `#888888` | secondary text |
| `--accent` | `#ff3366` | primary CTA, links |
| `--accent-hover` | `#ff5588` | hover state |
| `--border` | `#222222` | dividers, card borders |
| ... | | |

## Typography

- **Heading font**: <font name>, fallback `system-ui, sans-serif`
- **Body font**: <font name>, fallback `system-ui, sans-serif`
- **Mono font** (if needed): <font name>, fallback `ui-monospace, monospace`

Scale:

| Token | Size | Line-height | Weight | Use |
|---|---|---|---|---|
| `--text-display` | 4rem | 1.05 | 700 | hero H1 |
| `--text-h1` | 3rem | 1.1 | 700 | section H1 |
| `--text-h2` | 2rem | 1.15 | 600 | sub-headers |
| `--text-h3` | 1.5rem | 1.2 | 600 | card titles |
| `--text-body` | 1rem | 1.55 | 400 | paragraph text |
| `--text-small` | 0.875rem | 1.45 | 400 | captions, eyebrows |

## Spacing scale

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px · `--space-6` 24px · `--space-8` 32px · `--space-12` 48px · `--space-16` 64px · `--space-24` 96px · `--space-32` 128px

Section padding: `--space-24` top/bottom on desktop, `--space-16` on mobile.
Container max-width: `1200px`, gutter `--space-6`.

## Radii

`--radius-sm` 4px · `--radius-md` 8px · `--radius-lg` 16px · `--radius-full` 9999px

## Shadows / Elevation

`--elev-1` 0 1px 2px rgba(0,0,0,0.1)
`--elev-2` 0 4px 16px rgba(0,0,0,0.2)
`--elev-3` 0 20px 60px rgba(0,0,0,0.4)

## Motion

- **Default ease**: `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo)
- **Default duration**: 320ms
- **Stagger**: 60ms between children
- **Reduce motion**: respect `prefers-reduced-motion: reduce` — skip transforms, keep opacity transitions only

## Components

### Button

- Primary: `--accent` bg, white text, `--radius-md`, padding `--space-3` `--space-6`, hover lifts with `--elev-2`
- Secondary: transparent bg, `--text` text, `--border` border, same padding
- Ghost: no bg, no border, just text + arrow glyph

### Card

- Bg `--surface`, border `--border`, radius `--radius-lg`, padding `--space-6`
- Hover: lift to `--elev-2`, border-color shifts to `--accent`

### Section

- Padding `--space-24` top/bottom desktop, `--space-16` mobile
- Container `1200px` max-width, gutter `--space-6`
- Section eyebrow: small uppercase tracking-wide, `--accent`

## Anti-patterns

- **Don't** mix more than 2 accent colors. Pick one.
- **Don't** use shadows on every card — reserve elevation for hover state or hero card only.
- **Don't** stack more than 3 text weights on the same screen.
- **Don't** animate scroll-triggered transforms on mobile — battery hit.
```

If the brand source is `rhythmix-teaser-60s/DESIGN.md`, the styleguide is a thin pointer rather than a duplicate:

```markdown
# Styleguide: <Site Name>

## Brand source
Locked to `rhythmix-teaser-60s/DESIGN.md`. Do not redefine palette, typography, or eases here.

## Site-specific additions

- Component patterns this site uses that are not in DESIGN.md:
  - <pattern name> — <how it adapts the locked tokens>
- Spacing density: <inherit | spacious override | dense override>
```

### 4. Land

Show:
- Path to `styleguide.md`
- A 5-line summary (colors, fonts, density, motion default, anti-patterns)
- Next step: `/site-design <slug>` (renders every page) or `/site-design <slug> <page>` (one page)

## Hard rules

- **Don't invent brand if a locked source exists.** RHYTHMIX work always inherits from `rhythmix-teaser-60s/DESIGN.md`.
- **Tokens have names.** Every color, size, and spacing value gets a CSS custom-property name (`--accent`, `--text-h1`, etc.) — the design stage uses these names.
- **Anti-patterns are part of the spec.** Always include at least 3.

## What this skill does NOT do

- Does not write HTML.
- Does not generate a logo or favicon. Those are separate creative tasks (use `/dream` or the canvas-design skill).
- Does not pick a CSS framework. The design stage decides Tailwind vs. vanilla vs. CSS modules based on what the repo already uses.
