# pulse / web

The handcrafted landing page for the trend engine. Next.js 16 + Tailwind + Framer Motion. No template anywhere — every section is hand-built.

## Run it

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

## Deploy (3 minutes, free)

1. Push the repo to GitHub (already done).
2. Go to <https://vercel.com/new>, import the repo.
3. **Set the root directory to `web`** in the import screen.
4. Click deploy. You get a `*.vercel.app` URL.
5. Add a custom domain whenever you're ready.

The site fetches Reddit / HN / Google Trends server-side with `revalidate: 300`,
so the live trends update every 5 minutes without slowing the page.

## Customizing

- **Brand** — `web/lib/brand.ts` (one file, every label updates).
- **Colors / type** — `web/tailwind.config.ts` + `web/app/globals.css`.
- **Sections** — `web/components/*.tsx`. Each is independent; reorder in `app/page.tsx`.

## Layout

```
web/
  app/
    layout.tsx          fonts, metadata, viewport
    page.tsx            section composition
    globals.css         design system, gradients, grain
  components/
    Nav.tsx
    Hero.tsx + Halo.tsx
    Ticker.tsx          live marquee, server component
    HowItWorks.tsx
    LiveTrends.tsx      server component, fetches at request time
    TruthFilter.tsx
    CTA.tsx             terminal block + buttons
    Footer.tsx
  lib/
    brand.ts            single source of truth for copy
    trends.ts           Reddit / HN / Google Trends fetchers
```
