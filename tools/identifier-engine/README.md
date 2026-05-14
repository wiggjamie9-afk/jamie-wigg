# identifier-engine

Shared backend for vision-LLM identification apps. One Cloudflare Worker, many brands.

## What's here

```
tools/identifier-engine/
  engine/                       # the shared Worker — one deploy, many brands
    worker.js                   # POST /scan handler
    wrangler.toml               # CF Worker config
    package.json                # deps
  brands/
    whisky/                     # Drambook (working name) — $9.99/mo unlimited
      brand.json                # name, pricing, copy
      system.js                 # vision-LLM system prompt
      data.json                 # seed distillery DB
      landing.html              # static landing page
    boardgame/                  # BoxSorted (working name) — $0.99 per scan
      brand.json
      system.js
      data.json
      landing.html
```

Mushroom brand is deliberately not included — vision LLMs are not safe enough for wild foraging ID in 2026.

## Architecture

```
[user phone camera]
      ↓
[brand landing page] → POST /scan { image, brand: "whisky" | "boardgame" }
      ↓
[Cloudflare Worker]
      ↓
[Anthropic Vision API]   ←─ brand-specific system prompt from brands/<brand>/system.js
      ↓
[brand-specific data.json lookup for enrichment]
      ↓
[structured JSON response] → user sees identification + next-step CTA
      ↓
[Stripe billing] (post-MVP)
```

## Status (May 2026)

- Engine + 2 brand configs scaffolded
- **Not deployed**. Wrangler config exists but `wrangler deploy` not run
- **No secrets wired**. `ANTHROPIC_API_KEY` + `IDENTIFIER_KEY` need to be added via `wrangler secret put`
- **No Stripe**. Pricing strings in `brand.json` are placeholders; checkout flow is post-MVP
- **Landing pages are static HTML placeholders**. Copy needs a pass before public launch

## How to develop locally

```bash
cd tools/identifier-engine/engine
npm install
npx wrangler dev          # local Worker on http://localhost:8787
```

Test:

```bash
curl -X POST http://localhost:8787/scan \
  -H "content-type: application/json" \
  -H "x-identifier-key: dev-key" \
  -d '{"brand":"whisky","image":"<base64 or url>"}'
```

## How to deploy

```bash
cd tools/identifier-engine/engine
npx wrangler secret put ANTHROPIC_API_KEY    # paste sk-ant-...
npx wrangler secret put IDENTIFIER_KEY        # generate a random string
npx wrangler deploy
```

Then point your brand domains at the Worker via CF Pages or a static host (Vercel, Netlify) that POSTs to the Worker.

## Adding a third brand later

Copy `brands/whisky/` → `brands/<newbrand>/`, edit the four files. Wire it into `worker.js` by adding the brand key to `BRANDS`. That's it.
