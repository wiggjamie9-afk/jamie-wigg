# RHYTHMIX site (Astro)

Astro + Tailwind v4 rebuild of the RHYTHMIX landing site, deployable to Cloudflare Pages.

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Main landing page |
| `/features` | `src/pages/features.astro` | Feature deep-dive, countdown, savings table, testimonials |
| `/studio` | `src/pages/studio.astro` | Pre-sale page, FAQ, video hero |
| `/downloads` | `src/pages/downloads.astro` | Promo video library (~17 videos) |
| `/download` | `src/pages/download.astro` | Mobile iPhone-save mini-page (3 aspect ratios) |
| `/founder` | `src/pages/founder.astro` | Private (`noindex,nofollow`) — gated by code `JAMIE2026` |
| `/thank-you` | `src/pages/thank-you.astro` | Post-purchase landing (`noindex`) |
| `/privacy` | `src/pages/privacy.astro` | Legal — uses `Legal.astro` layout |
| `/terms` | `src/pages/terms.astro` | Legal |
| `/refunds` | `src/pages/refunds.astro` | Legal |
| `/rhythmix.html` | `public/rhythmix.html` | Alt 22-feature landing (Syne/Inter/Space Mono — kept verbatim) |
| `/thumbnail.html` | `public/thumbnail.html` | 1280×720 thumbnail generator with switcher |
| `/launch-section.html` | `public/launch-section.html` | Snippet, retained for reference |

`_redirects` rewrites all legacy `*.html` URLs to clean Astro routes (301).

## Local development

```bash
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve dist/ locally
```

## Deploy to Cloudflare Pages

### One-time setup

In the Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git:

- **Repository:** `wiggjamie9-afk/jamie-wigg`
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory (advanced):** `site`
- **Environment variable:** `NODE_VERSION=22`

### Cutover from GitHub Pages

The site currently serves from GitHub Pages at `rhythmixapp.com.au` (CNAME at the repo root).

1. Push this branch (or merge to `main`).
2. Confirm the Cloudflare Pages preview at `<project>.pages.dev` looks right.
3. In Cloudflare → your Pages project → Custom domains → add `rhythmixapp.com.au`.
4. Cloudflare will hand you DNS records (CNAME or A/AAAA). Update them at your registrar.
5. Once DNS propagates, **delete the root-level `CNAME` file** so GitHub Pages stops serving.

### What `_redirects` and `_headers` do

- **`_redirects`** — 301s every legacy `*.html` URL to its clean route, so old inbound links keep working.
- **`_headers`** — long-caches hashed assets in `_astro/`, short-caches HTML, sets baseline security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

## Brand tokens

Defined in `src/styles/global.css` via Tailwind v4 `@theme`:

- `canvas` `#08050d`, `magenta` `#ff1f5a`, `purple` `#7c3aed`, `cyan` `#00d8ff`, `green` `#00e887`, `gold` `#f5c000`, `pink` `#ff6fc8`, `muted` `#a0a0b0`, `card` `#1a1325`
- Display: Space Grotesk · Mono: JetBrains Mono

Custom utilities: `brand-gradient-text`, `gold-gradient`, `purple-gradient`, `cyan-gradient`, `animate-pulse-dot`.

## Components

- `layouts/Base.astro` — full HTML shell with OG/Twitter meta + Nav + Footer
- `layouts/Legal.astro` — minimal nav + summary card + slot, used by privacy/terms/refunds
- `components/Nav.astro`, `Footer.astro` — site chrome
- `components/Hero.astro`, `ProofStrip.astro`, `Pillars.astro`, `Venues.astro`, `PriceBlock.astro`, `EmailSignup.astro` — index-page sections

## Payment & email

- Gumroad checkout: <https://wiggjamie.gumroad.com/l/rhythmix-studio> ($149 lifetime)
- Waitlist email: FormSubmit → `jamie28rhythmixapp@yahoo.com`
- Studio waitlist: Formspree → `mjglrdeo`
