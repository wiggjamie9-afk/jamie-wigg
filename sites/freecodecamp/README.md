# sites/freecodecamp

An independently designed landing page rendering of **freeCodeCamp.org**'s open-source
README content — built as a full design pass, not a scrape.

- **Aesthetic:** "Campfire in the dark." freeCodeCamp's mark is a campfire and its
  name is *camp*, so the page is built around warm embers glowing against deep
  midnight-navy — using the real brand navy (`#0a0a23`) + gold (`#f1be32`) with a
  fire-orange accent. Editorial serif body (Newsreader), characterful display
  (Bricolage Grotesque), mono labels (JetBrains Mono).
- **Motion:** staggered hero reveal, animated SVG campfire (WAAPI flicker), drifting
  ember particles, scroll-triggered section reveals. All gated behind
  `prefers-reduced-motion`.
- **Self-contained:** single `index.html`, inline CSS + JS. Fonts via Google Fonts
  (loads on GitHub Pages; the sandbox blocks the fetch, hence flat fonts in local QA).

## Sections

Hero → stats band → 6 full-stack certifications grid → how-a-cert-works path (with a
terminal "cert issued" card) → language certifications → interview-prep chips →
community channels → trust/academic-honesty band → final CTA → footer.

## Preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/freecodecamp
# open http://127.0.0.1:8000
```

## Honesty note

This is an **unofficial design tribute** — not affiliated with or endorsed by
freeCodeCamp.org. The footer says so and links to the real site. Content © 2014
freeCodeCamp.org; software BSD-3-Clause; `/curriculum` resources © freeCodeCamp.org.
Reference notes live in [`reference/freecodecamp.md`](../../reference/freecodecamp.md).
