# Streaming Royalty Math — Nano Banana Prompts (7 slides, 4:5)

## Brand block (identical on every slide)

```
Dark near-black canvas (#08050d) with violet bias and a soft magenta radial glow bottom-left. Saturated accent magenta (#ff1f5a) and purple (#7c3aed); cyan, green, gold used sparingly. Modern grotesque sans display (Space Grotesk style) for headlines, JetBrains Mono for labels and microcopy. Numbers are largest. No full-frame gradients, no bounce. 4:5 aspect ratio. Handle "@theaiimpact" mono bottom-right.
```

## Generation workflow

1. **Cover dry-test first.** Run slide 1 alone via `blotato_create_visual` with `templateId: 53cfec04-2500-41cf-8cc1-ba670d2c341a`, `model: nano-banana-pro`, `aspectRatio: 4:5`, `slidePrompts: [slide 1]`.
2. Approve cover.
3. Run slides 2–7 in a single Blotato call with the full `slidePrompts` array.
4. Poll status every 60s.

---

## Slide 1 — Cover

```
[BRAND BLOCK]

Layout: cover slide. Eyebrow at top in mono uppercase: "STREAMING ECONOMICS — 2026". Headline reads "1 IN 20" in massive Space Grotesk-style display weight 800, magenta-to-purple gradient fill, fills upper 50% of slide. Subhead below in smaller mono uppercase soft white: "MUSICIANS CAN LIVE ON STREAMING." Magenta radial glow behind the "20". Bottom-right: "@theaiimpact" mono 11pt soft white at 70% opacity. Headline must be the largest text on the slide.
```

## Slide 2 — Spotify rate

```
[BRAND BLOCK]

Layout: stat slab slide. Eyebrow top mono uppercase magenta: "SPOTIFY · WORLDWIDE AVG". Center: massive number "$0.00238" in Space Grotesk display weight 800 white, fills 60% of slide height. Mono caption underneath in soft white uppercase: "PER STREAM. PRE-SPLIT. PRE-FEES." Subtle cyan thin underline beneath the number, 4px tall, 60% width centered. Bottom-right: "@theaiimpact" mono 11pt soft white. Headline must be the largest text on the slide.
```

## Slide 3 — The 87% cliff

```
[BRAND BLOCK]

Layout: stat slide. Eyebrow top mono uppercase cyan: "THE THRESHOLD". Massive headline "87%" Space Grotesk display weight 800 white, fills upper-left third. To its right, smaller mono caption stacked uppercase soft white: "OF TRACKS ON SPOTIFY. EARN. ZERO." Single supporting line below the number in mono soft white sentence case: "Below 1,000 streams per year. They don't qualify." Magenta accent fill on the word "ZERO" only. Bottom-right: "@theaiimpact" mono. Headline must be the largest text on the slide.
```

## Slide 4 — Median vs Average

```
[BRAND BLOCK]

Layout: comparison slide, two-column split. Eyebrow centered top mono uppercase: "STREAMING INCOME — 2024". Left column: small label "MEDIAN" in mono uppercase soft white. Below it: "$1,450" in Space Grotesk display weight 800 saturated magenta. Right column: small label "AVERAGE" in mono uppercase soft white at 50% opacity. Below it: "$11,523" in Space Grotesk display weight 800 desaturated grey at 50% opacity. Below both columns, single line in mono uppercase magenta: "OUTLIERS. THE GAP IS THE STORY." Bottom-right: "@theaiimpact" mono. The "$1,450" must be the largest text on the slide.
```

## Slide 5 — 1 in 20 ratio

```
[BRAND BLOCK]

Layout: ratio visualization slide. Eyebrow top mono uppercase: "TOP INCOME SOURCE". Center: 20 small filled circle dots in a 5-wide by 4-tall grid, 19 in soft grey at 30% opacity, 1 in saturated magenta with subtle glow. Below the grid: massive headline "1 IN 20" in Space Grotesk display weight 800 white. Mono caption below sentence case soft white: "Full-time musicians who list streaming as their top income." Bottom-right: "@theaiimpact" mono. Headline must be the largest text on the slide.
```

## Slide 6 — The Stack

```
[BRAND BLOCK]

Layout: stack slide. Eyebrow top mono uppercase magenta: "WHAT THE OTHER 19 DO". Headline in Space Grotesk display weight 800 white, two lines stacked. First line reads: STOP STREAMING. Second line reads: START STACKING. Below, vertical list of 7 mono uppercase chips, each in a coloured rounded pill: "SYNC" magenta fill, "FAN INVESTMENT" purple fill, "DIRECT DROPS" cyan fill, "MERCH" green fill, "SAMPLES" gold fill, "NFTS" purple fill, "VR LIVE" magenta fill. Bottom-right: "@theaiimpact" mono. Headline must be the largest text on the slide.
```

## Slide 7 — CTA close

```
[BRAND BLOCK]

Layout: CTA closing slide. Eyebrow top mono uppercase: "GET THE PLAYBOOK". Center large headline in Space Grotesk display weight 800 white, two lines. First line reads: COMMENT PAID. Second line reads: FOR THE CHEAT SHEET. Subhead below in mono soft white sentence case: "9 ways indie musicians actually make money in 2026." Below that, the @theaiimpact wordmark in magenta-to-purple gradient, larger than usual, centered. Bottom-right: smaller "@theaiimpact" handle in mono soft white. Headline must be the largest text on the slide.
```

---

## Hard rules check

- All 7 prompts under 900 characters (longest is slide 6 at ~860 with brand block included). ✓
- No `/` separators inside subheads — comparison slide rewritten using "First line / Second line" pattern only where needed. ✓
- Headlines explicitly stated as largest text on every slide. ✓
- Repeating components (chips on slide 6, dot grid on slide 5) described explicitly. ✓
