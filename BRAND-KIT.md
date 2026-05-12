# RHYTHMIX — Brand Kit (Source of Truth for All Graphics)

> **Read this before producing any visual output** — video, landing page, social post, poster, thumbnail, ad creative. The `frontend-design`, `canvas-design`, `theme-factory`, `hyperframes`, and `algorithmic-art` skills should all anchor here.
>
> Video-specific motion rules live in `rhythmix-teaser-60s/DESIGN.md`. This file is the broader brand grammar.

---

## 1. Palette

Locked. Do not introduce colors outside this list without explicit user approval.

| Token | Hex | Use |
|---|---|---|
| Canvas | `#08050d` | Primary background (near-black with violet bias) |
| Card surface | `#1a1325` | Cards, modals, raised surfaces |
| Magenta | `#ff1f5a` | Primary CTA, emphasis, hero highlight |
| Purple | `#7c3aed` | Secondary accents, glow rings, brand mark gradient |
| Cyan | `#00d8ff` | Tertiary accent, data viz, hover states |
| Signal green | `#00e887` | Success, "now/live" states, positive numbers |
| Hot gold | `#f5c000` | Money, highlights, premium tier |
| Soft pink | `#ff6fc8` | Subdued accent — counts, secondary numbers |
| Display text | `#ffffff` | Headlines, hero copy |
| Muted body | `#a0a0b0` | Body copy, captions, microcopy |

**Pairing rules:**
- Magenta + cyan = primary brand contrast (use sparingly, max one of each per composition)
- Magenta on canvas = highest emphasis. Cyan on canvas = secondary. Gold on canvas = money/premium only.
- Never put magenta on purple (insufficient contrast); never put cyan on signal green (vibrates).

## 2. Typography

| Role | Font | Stack |
|---|---|---|
| Display | Space Grotesk (700/600) | `"Space Grotesk", system-ui, sans-serif` |
| Mono | JetBrains Mono | `"JetBrains Mono", ui-monospace, monospace` |

**Scale** (rem, 16px base — scale up proportionally for video/poster contexts):

| Token | Size | Line | Tracking | Use |
|---|---|---|---|---|
| Hero | 4.5rem | 1.0 | -0.03em | Hero numbers, wordmark |
| Display 1 | 3.0rem | 1.05 | -0.02em | Section headlines |
| Display 2 | 2.0rem | 1.1 | -0.015em | Slide headlines |
| Title | 1.5rem | 1.2 | -0.01em | Card titles |
| Body | 1.0rem | 1.5 | 0 | Body copy |
| Mono caption | 0.8125rem | 1.4 | 0.02em uppercase | Labels, taglines, microcopy |

**Numbers are heroes.** When a stat is on screen, it gets the largest type weight and is the focal point. Surrounding copy is always smaller and `#a0a0b0`.

## 3. Layout Grammar

Three repeating layout templates. Mix-and-match within these; don't invent new structures.

### 3a. Hero / Ad Creative (single-frame poster, app-store ad, thumbnail)

```
┌─────────────────────────────────────────────────┐
│  [Glow ring around subject]                     │
│                                                 │
│  WORDMARK                                       │
│  Mono tagline — Three. Beats. Max.              │
│                                                 │
│  ◯  Headline 1                                  │
│     Sub copy in muted body.                     │
│  ◯  Headline 2                                  │
│     Sub copy in muted body.                     │
│  ◯  Headline 3                                  │
│     Sub copy in muted body.                     │
│                                                 │
│  [Download on App Store badge]                  │
└─────────────────────────────────────────────────┘
```

Rules:
- **One hero subject** (product shot, character, logo) with a radial glow ring in magenta or cyan. Never linear gradient backgrounds — use radial glow + solid canvas.
- **Three benefit bullets max.** Each is icon + 1-line headline + 1-line mono sub.
- **One CTA**, bottom-left or bottom-center.
- Maintain ~40% negative space.

### 3b. Carousel Slide (IG/LinkedIn/TikTok carousel)

```
┌─────────────────────────────────────────────────┐
│  ▲ RHYTHMIX                              1 / 8  │
│                                                 │
│  COMMON MISTAKE                                 │
│  More tools                                     │
│  ≠ more                                         │
│  efficiency                                     │
│                                                 │
│  Body explanation in muted text spanning        │
│  two to three lines max. Specific. No filler.   │
│                                                 │
│                                       @handle   │
└─────────────────────────────────────────────────┘
```

Rules:
- **Brand mark top-left, slide indicator top-right** (`1 / 8`, mono, muted).
- **One concept per slide.** Concept goes in a kicker line (`COMMON MISTAKE`, `WHAT YOU MISSED`, `STEP 3`) in mono caption size, magenta or cyan.
- **Headline uses highlight-on-keyword treatment**: the strongest 1–2 words wrapped in a magenta or signal-green highlight box. Never highlight more than 2 words per slide.
- **Body is 2–3 lines max.** Specific. Cut filler.
- **Footer is the handle**, bottom-right, mono caption muted.
- Aspect: 1080×1080 square, or 1080×1350 vertical.

### 3c. Landing Page Section

- Section anchored by a `<h2>` in Display 1.
- One eyebrow mono caption above the h2 (e.g. `04 — PRICING`).
- 3-up or 2-up card grid, never 4+ in a row.
- Cards: `#1a1325` surface, 1px `rgba(255,255,255,0.08)` border, 24px padding, 16px radius.
- Card hover: border becomes magenta, subtle 1.02× scale, 200ms ease-out.

## 4. Motion Vocabulary

Cross-medium (video, web, social):

- **In**: `power3.out` or `expo.out`, 0.4–0.7s. Never linear, never bounce.
- **Hold**: confident — at least 0.8s before next move on hero elements.
- **Out**: crossfade only (0.5s). Scenes don't exit on their own; the next scene's fade-in is the transition.
- **Stagger**: 60–120ms across grid items.
- **Number counters**: ease-out, not linear, ~0.8s to settle on final value.
- **Glow pulse**: 2.5s breathe loop, opacity 0.6 → 1.0 → 0.6, never the whole scene — only on the hero element.

## 5. The "Outstanding vs Generic" Test

Before shipping any visual, check it against these five splits. If you fall on the right of three or more, redo.

| Outstanding | Generic AI default |
|---|---|
| One subject + radial glow on dark canvas | Subject floating on a linear-gradient backdrop |
| Numbers/stats as the focal hero | Decorative imagery as the focal point |
| Mono caption + grotesque display pairing | Single all-grotesque or all-mono |
| One highlight color per composition | Three+ accent colors competing |
| Highlight box wrapping the strongest 1–2 words | Whole sentence colored or bolded |
| Tight 2–3 line body copy | Five+ line paragraph |
| 40%+ negative space | Wall-to-wall content |
| Confident hold beats | Constant motion, ken-burns on everything |

## 6. Anti-Patterns (Hard Stops)

- **No** `#3b82f6`, `#333`, default Roboto/Arial, or Helvetica.
- **No** full-frame linear gradients (banding shows on iPhone OLED). Use radial glow + solid canvas.
- **No** bouncy / elastic / back eases. Wrong tonal register for the brand.
- **No** emoji-heavy decoration. One icon glyph per feature card max.
- **No** "AI-powered" anywhere in copy. The product IS AI music — saying "AI-powered" sounds defensive.
- **No** stock photography of generic happy people with headphones. Use product UI, abstract glows, or commissioned imagery only.
- **No** drop shadows on text. Use glow or contrast — not shadow.
- **No** Material/Bootstrap component aesthetics — those are tells of generic AI output. Build from scratch with the tokens above.

## 7. Inputs You Need Before Generating

Before producing a graphic, confirm:

1. **Medium** — video frame? Landing section? IG square? IG vertical? Poster?
2. **Aspect** — 16:9 / 9:16 / 1:1 / 4:5
3. **One headline** — what's the single thing this asset has to say?
4. **One number or proof point** — what's the hero stat?
5. **One CTA** — what should the viewer do next?

If any of those five are missing, ask — don't guess. Guessing produces generic output.

## 8. Occasion Library (Music Video Presets)

RHYTHMIX is a music **video** tool — the user brings an MP3, RHYTHMIX cuts the visuals. Eight launch occasions, each presets model selection, pacing, palette tilt, and prompt library:

| Occasion | Model lean | Pacing | Aspect default | Palette tilt |
|---|---|---|---|---|
| Music drop reel | Kling v2 chorus, Hunyuan verses | Beat-snapped, drop-anchored | 9:16 | Magenta + cyan |
| Album trailer | Mixed, one per track | One scene per hook | 16:9 | Full palette |
| Wedding first dance | Luma Ray throughout | Lyric-snapped, long holds | 16:9 | Soft pink, warm white |
| Brand promo | Pexels stock | Caption-driven | 16:9 / 1:1 | Restricted — magenta only |
| Travel reel | Luma Ray | Long chorus holds, fast build cuts | 9:16 | Cyan + signal green |
| Workout hype | MiniMax | Hard cuts on every kick | 9:16 | Magenta + hot gold |
| DJ set highlight | Kling drop, Hunyuan crowd | Drop-anchored | 9:16 | Magenta + cyan strobe |
| Memorial tribute | Luma Ray | Wide holds, no fast cuts | 16:9 | Muted, soft pink only |

When scripting promo videos, marketing copy, or carousel posts about RHYTHMIX, lean on these concrete moments instead of abstract "AI music video" language. **Concrete > abstract.** ("Cut your wedding first dance" beats "AI-powered music videos.")

## 9. Three Inputs (Positioning)

When describing what the user brings to RHYTHMIX, use this three-input framing — not the four-pillar one (Generate/Master/Distribute/Earn). The four pillars are about what the engine does; the three inputs are about what the user does.

| Input | What it is | Status |
|---|---|---|
| **MP3** | Drop in a finished track. RHYTHMIX analyzes loudness, BPM, structure. | Live today |
| **Theme** | A short text vibe ("neon city night," "lo-fi anime," "cinematic chorus"). LLM scene prompts. | Coming (Studio web app) |
| **Photo seed** | One reference image. RHYTHMIX uses it as the visual anchor across all scenes for consistency. | Roadmap |

Headline copy template: **"Drop your track. Pick your moment. Render the video."** Use this — or close variants — whenever a hero or hook needs the user-facing pitch in one line.

## 11. Reference Compositions

Look at these before authoring a new asset:

- `rhythmix-overview-60s/index.html` — canonical 60s landscape video
- `rhythmix-teaser-60s/index.html` — 60s portrait teaser
- `rhythmix.html` — landing page (full)
- `index.html` — current homepage (now includes the Occasions section)
- `rhythmix-teaser-60s/DESIGN.md` — video-specific motion spec
