# G-73 Expansion Pack — Hard Sci-Fi Technical Standard

**Version 1.0.0**

A complete, internally consistent fictional FTL standard — the **G-73 Universal
Expansion framework** ("Fable Suite") — packaged as a technical manual, an
interactive mission calculator, and a worldbuilding license.

Pure HTML + CSS + vanilla JS. **No frameworks, no build step, zero external
requests.** Open any file in a browser and it works, offline, forever.

## What's included

```
g73/
├── index.html          ← pack overview / landing page
├── manual.html         ← FBL-G73-TM-001, the G-73 Technical Manual
├── calculator.html     ← interactive Transit Calculator
├── assets/
│   └── g73.css         ← the entire design system (token-driven)
├── README.md
└── LICENSE.txt
```

## The honesty layer (please keep it)

G-73 is fiction, and the pack is built so that never gets blurry:

- Red **◈ FICTIONAL STANDARD** banners flag invented canon.
- Green **▣ REALITY CHECK** panels quote the real physics (Alcubierre metric,
  time dilation, vacuum energy, conservation of momentum) the fiction riffs on.
- Appendix A of the manual is a claim-by-claim REAL vs FABLE table.

That contrast is the product's teaching hook — if you republish or adapt the
material, keep fiction labeled as fiction.

## Quick start

1. Unzip anywhere.
2. Open `index.html` in a browser.
3. To get the manual as a PDF: open `manual.html` → Print → "Save as PDF".
   A print stylesheet reformats it to a clean light document automatically.

## Using the canon in your own work

The license (see `LICENSE.txt`) lets you use the G-73 universe — the names,
hardware, formulas, protocols, and lore — in your own commercial stories,
tabletop campaigns, videos, and games. Canon quick reference:

| Element | Canon value |
|---|---|
| Effective velocity multiplier | ×30 conventional cruise velocity |
| Anchor frequency | 7.3 Hz |
| Negative Sink η (certified) | 0.01 (ship pays 1%, vacuum pays 99%) |
| Transit time | `T = D / (V_conv × 30)` |
| Bubble energy | `E = 1.71×10⁴⁴ J × (v_eff/c)²` |
| Spinner | 16 pillars, counter-rotating octet pairs |

Extend it however you like — new hull classes, higher Negative Sinks, lock
failures. Internal consistency is the only house rule.

## Theming

All colors, fonts, and radii are CSS custom properties at the top of
`assets/g73.css`:

```css
:root {
  --g73-space: #0b0e14;   /* page background  */
  --g73-amber: #ffb454;   /* primary accent   */
  --g73-cyan:  #6ee7ff;   /* secondary accent */
  /* … */
}
```

Edit that block to rebrand the entire pack. All motion respects
`prefers-reduced-motion`.

## The calculator's math

The cyan numbers are real special relativity: Earth-frame time `D/v` and
ship-frame time `D/(vγ)` with `γ = 1/√(1−v²/c²)`. The amber numbers are G-73
canon. The logic is ~40 lines of commented vanilla JS at the bottom of
`calculator.html` — easy to extend with your own destinations or canon tweaks.

## Browser support

Evergreen browsers (Chrome, Edge, Firefox, Safari). System monospace fonts
only — nothing to download, nothing to expire.

## License

Worldbuilding-friendly: unlimited use of the G-73 IP and this code in your own
commercial and personal works; no reselling the pack itself. Full text in
`LICENSE.txt`.
