# NEONDECK — Neon-Noir Dashboard UI Kit

**Version 1.2.0 — Full-Stack Edition + Pulse Engine**

Four production-grade dashboard templates in a hand-tuned neon-noir design system,
plus a **zero-dependency local backend** that feeds them live data and powers a real
login. Pure HTML + CSS + vanilla JS + plain Node.js. **No frameworks, no build step,
no npm install.**

## What's included

```
neondeck/
├── index.html                  ← gallery / preview of the whole kit
├── templates/
│   ├── analytics.html          ← "Pulse" — AI/product analytics dashboard
│   ├── finance.html            ← "Ledger" — fintech / trading desk dashboard
│   ├── agents.html             ← "Fleet" — AI agent fleet monitoring
│   └── auth.html               ← "Access Console" — working sign-in page
├── server/
│   └── server.js               ← zero-dependency Node API + static server
├── data/
│   ├── analytics.json          ← the data each dashboard displays —
│   ├── finance.json            ←   edit these files, refresh the page,
│   └── agents.json             ←   and the dashboards update
├── assets/
│   ├── neondeck.css            ← the entire design system (1 file, token-driven)
│   ├── neondeck-charts.js      ← 6 KB SVG chart library (line, donut, bars, sparkline)
│   ├── neondeck-data.js        ← data binder: connects pages to the API
│   └── neondeck-sim.js         ← Pulse Engine: living-data simulation
├── README.md
└── LICENSE.txt
```

## Quick start — two ways to use it

**Static (no server):** open `index.html` in a browser. Every page renders
with its built-in sample data. Perfect for design work and static hosting.

**Full-stack (with the backend):** requires only Node.js (v16+, no packages):

```bash
node server/server.js
# → http://localhost:4200
```

Now the dashboards are fed by the JSON files in `data/` — edit
`data/analytics.json`, refresh, and the charts, stats and event feed update.
The sign-in page performs a real login against the API
(**demo account: any email + password `neondeck`**) and redirects on success.

The pages detect the server automatically: with it they bind to the API,
without it they fall back to their built-in sample data. Nothing breaks either way.

## The API (server/server.js)

| Route | Method | What it does |
|---|---|---|
| `/api/analytics` `/api/finance` `/api/agents` | GET | Returns the matching `data/*.json` |
| `/api/login` | POST | `{email, password}` → session token (demo password: `neondeck`) |
| `/api/me` | GET | Validates a `Bearer` token |
| `/api/health` | GET | Uptime + session count |

It's a starter backend in one dependency-free file: replace the JSON reads
with your database queries when you wire in a real product.

## The Pulse Engine (assets/neondeck-sim.js)

A living-data simulation that makes every dashboard breathe — no server
needed, it runs in the browser. Honest simulation, not AI: it borrows the
mathematics of living systems.

- **Breathing metrics** — every stat follows a random walk with momentum
  and mean-reversion, so values drift naturally and never explode
- **Circadian rhythm** — a slow global load wave that all metrics feel
- **Homeostasis** — occasional stress spikes are detected, flagged with a
  red glow, narrated in the event feed, and recover on their own
- **Heartbeat feed** — the terminal streams what the system is doing

It auto-starts on dashboard pages (paused for visitors with reduced-motion
preferences) and can be toggled with the floating PULSE ENGINE button.
To remove it entirely, delete the neondeck-sim.js script tag or set
`<body data-nd-sim="off">`. Perfect for client demos and portfolio pieces
where a frozen dashboard would fall flat.

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
