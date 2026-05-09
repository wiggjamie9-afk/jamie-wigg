# RHYTHMIX site (Astro)

Astro + Tailwind v4 rebuild of the RHYTHMIX landing site, designed to deploy to Cloudflare Pages.

## Status

**Phase 1 complete:** `index.html` ported to `src/pages/index.astro` using shared components.

**Pending:** Other pages (`features`, `studio`, `founder`, `downloads`, `privacy`, `terms`, `refunds`, `thank-you`, `launch-section`, `download`, `rhythmix`, `thumbnail`).

## Local development

```bash
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve dist/ locally
```

## Deploy to Cloudflare Pages

In the Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git:

- **Repository:** `wiggjamie9-afk/jamie-wigg`
- **Production branch:** `main` (or whichever branch you cut over from)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory (advanced):** `site`
- **Node version env var:** `NODE_VERSION=22`

Once deployed, point `rhythmixapp.com.au` at the Cloudflare Pages project (Custom Domains tab).

## Brand tokens

Defined in `src/styles/global.css` via Tailwind v4 `@theme`:

- `canvas` `#08050d`, `magenta` `#ff1f5a`, `purple` `#7c3aed`, `cyan` `#00d8ff`, `green` `#00e887`, `gold` `#f5c000`, `pink` `#ff6fc8`, `muted` `#a0a0b0`, `card` `#1a1325`
- Display: Space Grotesk · Mono: JetBrains Mono

Custom utilities: `brand-gradient-text`, `gold-gradient`, `purple-gradient`, `cyan-gradient`, `animate-pulse-dot`.

## Components

- `layouts/Base.astro` — full HTML shell with OG/Twitter meta
- `components/Nav.astro` — sticky nav with brand gradient logo + Gumroad CTA
- `components/Footer.astro` — page footer
- `components/Hero.astro` — landing hero with badge, headline, CTAs
- `components/ProofStrip.astro` — 22 / 120+ / 47s / 100% proof numbers
- `components/Pillars.astro` — Generate / Master / Distribute / Earn
- `components/Venues.astro` — 4 venue tiles (Disco / Rock / Jazz / Rave)
- `components/PriceBlock.astro` — $149 lifetime CTA with Gumroad link
- `components/EmailSignup.astro` — videos card + FormSubmit waitlist

## Payment

Gumroad: <https://wiggjamie.gumroad.com/l/rhythmix-studio>

## Email signup

FormSubmit: `jamie28rhythmixapp@yahoo.com`
