# NEONDECK — Neon-Noir Dashboard UI Kit

**Version 1.0.0**

Four production-grade dashboard templates in a hand-tuned neon-noir design system.
Pure HTML + CSS + a tiny vanilla-JS chart library. **No frameworks, no build step, no dependencies.**
Open any file in a browser and it works.

## What's included

```
neondeck/
├── index.html                  ← gallery / preview of the whole kit
├── templates/
│   ├── analytics.html          ← "Pulse" — AI/product analytics dashboard
│   ├── finance.html            ← "Ledger" — fintech / trading desk dashboard
│   ├── agents.html             ← "Fleet" — AI agent fleet monitoring
│   └── auth.html               ← "Access Console" — sign-in page
├── assets/
│   ├── neondeck.css            ← the entire design system (~1 file, token-driven)
│   └── neondeck-charts.js      ← 6 KB SVG chart library (line, donut, bars, sparkline)
├── README.md
└── LICENSE.txt
```

## Quick start

1. Unzip anywhere.
2. Open `index.html` in a browser.
3. Copy any template, delete what you don't need, drop your data in.

The only external requests are two Google Fonts families (Chakra Petch, IBM Plex Mono).
To go fully offline, download the fonts and swap the `<link>` for `@font-face` rules —
everything else is local.

## Theming

All colors, glows, radii and fonts are CSS custom properties at the top of
`assets/neondeck.css`. Rebrand the whole kit by editing the token block:

```css
:root {
  --nd-cyan: #00f3ff;      /* primary accent */
  --nd-magenta: #ff00ff;   /* secondary accent */
  --nd-obsidian: #0a0a0b;  /* page background */
  /* … */
}
```

Want a calmer look? Lower the two `--nd-glow-*` values.

## Charts

Charts are rendered by `neondeck-charts.js` from data attributes — no JS to write:

```html
<!-- Line/area chart, two series -->
<div style="height:280px" data-nd-chart="line"
     data-values="[[1800,2400,3100],[900,1400,1700]]"
     data-labels="Mon,Tue,Wed"
     data-colors="#00f3ff,#ff00ff"></div>

<!-- Sparkline -->
<div style="height:36px" data-nd-chart="sparkline"
     data-color="#7b5cff" data-values="[3,5,4,7,6,9]"></div>

<!-- Donut with center label -->
<div style="width:190px;height:190px" data-nd-chart="donut"
     data-center="82%" data-center-sub="UTILIZED"
     data-values='[{"label":"A","value":42,"color":"#00f3ff"},
                   {"label":"B","value":58,"color":"#ff00ff"}]'></div>

<!-- Bars -->
<div style="height:220px" data-nd-chart="bars"
     data-values="[12,19,14,22]" data-labels="Q1,Q2,Q3,Q4"></div>
```

Charts auto-render on `DOMContentLoaded`. If you inject markup later, call
`NDCharts.render()` (optionally with a root element).

## Components

Everything is class-based and composable — see any template for usage:

- **Shell**: `.nd-shell`, `.nd-sidebar`, `.nd-main`, `.nd-topbar`
- **Cards**: `.nd-card`, `.nd-card--bracket` (signature glowing corner brackets)
- **Stats**: `.nd-stat`, `.nd-delta--up/down/flat`
- **Status**: `.nd-badge`, `.nd-dot--live/warn/down/idle`
- **Data**: `.nd-table`, `.nd-meter` (+ `--magenta/--acid/--amber`), `.nd-terminal`
- **Forms**: `.nd-field`, `.nd-input`, `.nd-switch`, `.nd-search`
- **Buttons**: `.nd-btn` + `--primary/--magenta/--ghost`
- **Motion**: `.nd-rise` + `.nd-rise-1…6` staggered reveals

All motion respects `prefers-reduced-motion`.

## Browser support

Evergreen browsers (Chrome, Edge, Firefox, Safari). Uses CSS grid,
custom properties, and `backdrop-filter` (degrades gracefully).

## License

Commercial-friendly single license: unlimited personal and client projects;
no redistribution/resale of the kit itself. Full text in `LICENSE.txt`.
