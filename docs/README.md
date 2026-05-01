# RHYTHMIX — Build Index

This is the working asset folder for the RHYTHMIX brand and product. Generated
by the `brand`, `design-system`, `ui-ux-pro-max`, `ui-styling`, `banner-design`,
`slides`, and `high-ticket-offer-architect` skills in a single build pass.

---

## Source of truth

| File | Owns |
|---|---|
| `docs/brand-guidelines.md` | Voice, identity, messaging, asset rules |
| `assets/design-tokens.json` | Three-layer tokens (primitive → semantic → component) |
| `assets/design-tokens.css` | CSS variable export of the above |

Anything visual in this repo imports `assets/design-tokens.css`. If you change
a token, every downstream surface picks it up on next reload.

---

## Deliverables

### Marketing site
- `landing/index.html` — full single-page landing, token-driven, no build step.
  Open the file directly in a browser to view.

### Banner set
All token-driven HTML, screenshot to PNG at the indicated dimensions.

| File | Platform | Size |
|---|---|---|
| `assets/banners/launch/twitter-header-1500x500.html` | Twitter / X header | 1500 × 500 |
| `assets/banners/launch/linkedin-personal-1584x396.html` | LinkedIn personal banner | 1584 × 396 |
| `assets/banners/launch/instagram-post-1080x1080.html` | Instagram square post | 1080 × 1080 |
| `assets/banners/launch/_banner-base.css` | Shared styles for all banners | — |

**Export to PNG** (when chrome-devtools / a headless browser is available):
```bash
node .claude/skills/chrome-devtools/scripts/screenshot.js \
  --url "file://$PWD/assets/banners/launch/twitter-header-1500x500.html" \
  --width 1500 --height 500 \
  --output "assets/banners/launch/twitter-header-1500x500.png"
```

### Pitch deck
- `assets/slides/rhythmix-pitch.html` — 10-slide investor pitch with two
  Chart.js charts (growth + competitive moat radar). Keyboard nav: ←/→,
  Space, Home, End. Click anywhere to advance.

  Slide order: Title · Problem · Solution · Why now · Market · Traction ·
  Business model · Competition · Team · Ask.

### Strategy
- `docs/high-ticket-offer-brief.md` — DRAFT 6-stage offer brief for the
  "Independent Artist Operating System" $3K cohort. Sections marked `[ASSUMED]`
  need real input from the live `/high-ticket-offer-architect` interview.

---

## How the skills produced each artifact

| Skill | Produced |
|---|---|
| `brand` | `docs/brand-guidelines.md` |
| `design-system` | `assets/design-tokens.{json,css}` |
| `ui-ux-pro-max` + `ui-styling` | `landing/index.html` |
| `banner-design` | `assets/banners/launch/*.html` |
| `slides` | `assets/slides/rhythmix-pitch.html` |
| `high-ticket-offer-architect` | `docs/high-ticket-offer-brief.md` |
| `design` | (latent — wraps the above; logo generation pending Gemini API key) |

---

## Known gaps / next steps

1. **Logo generation** — the `design` skill's `scripts/logo/generate.py` needs
   `GEMINI_API_KEY`. Wordmark + gradient mark are specified in
   `docs/brand-guidelines.md §6` and rendered live in the landing/banners as
   the `R` lockup; AI raster variants are pending.
2. **Banner PNG export** — `chrome-devtools` skill not available in this
   environment. HTML files are pixel-perfect at the correct viewport sizes;
   any headless browser will produce the PNGs.
3. **High-ticket offer brief** — Stage 1–6 interview not yet run with Jamie.
   Today's brief is a strategic *draft* based on public RHYTHMIX product data.
   Run `/high-ticket-offer-architect` to replace `[ASSUMED]` markers.
4. **Magic MCP** — install command captured from screenshot but the API key
   was truncated. Run manually when ready:
   `claude mcp add magic --scope user --env API_KEY="<your-key>"`
5. **Landing page tracking / form wiring** — email signup is currently a
   client-side stub. Wire to the real list provider before launch.

---

## Maintenance

To re-run the brand → tokens sync after editing `docs/brand-guidelines.md`:
```bash
node .claude/skills/brand/scripts/sync-brand-to-tokens.cjs
```

To validate tokens are referenced (no raw hex) across the repo:
```bash
node .claude/skills/design-system/scripts/validate-tokens.cjs --dir .
```
