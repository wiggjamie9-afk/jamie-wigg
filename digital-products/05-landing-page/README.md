# One-Page Launch Site Template

**A polished single-file HTML landing page for digital products. Tailwind via CDN, no build step, deploy in 5 minutes.**

Price: **$24**

Sales blurb:
> Skip the WordPress mess. One file, one upload, one paid customer. This is a battle-tested landing page structure (hero → problem → how it works → what's inside → proof → CTA → FAQ) that works for prompt packs, courses, templates, and services.

3-bullet description:
- Single `index.html`, Tailwind via CDN — no build, no Node, no React
- Deploy free on Cloudflare Pages, GitHub Pages, Netlify, or Vercel in 5 min
- Every section commented with `[BRACKETS]` showing what to replace

## Customize

Open `index.html` and replace every `[BRACKET]` with your specifics:

- `[Your Brand]`, `[Your Offer]`, `[SPECIFIC BUYER]`
- `[Big specific outcome]`, `[concrete timeframe]`, `[PRICE]`
- Pain points, steps, items, testimonials, FAQs
- `[GUMROAD_OR_PAYHIP_LINK]` — your real checkout URL
- `[YOUR EMAIL]`

Find/replace works fine — most variables appear 1–3 times.

## Deploy

### Cloudflare Pages (recommended, free)

1. Push this folder to a GitHub repo.
2. Go to dash.cloudflare.com → Pages → Create → Connect to Git.
3. Select repo, root directory: `digital-products/05-landing-page`. No build command.
4. Deploy. Takes ~30 seconds. Free SSL included.

### GitHub Pages

1. Push to a public repo.
2. Settings → Pages → Source: Deploy from branch → main, `/digital-products/05-landing-page`.
3. Visit `https://<your-handle>.github.io/<repo>/digital-products/05-landing-page/`.

### Netlify drag-and-drop

1. Go to app.netlify.com.
2. Drag the `05-landing-page/` folder onto the page.
3. Live URL in 10 seconds. Add custom domain in settings.

## What's intentionally not included

- **Analytics:** Add `<script>` for Plausible/Umami/PostHog before `</head>` when ready.
- **A/B testing framework:** Premature for first launch — get to 10 sales first.
- **Heavy JS framework:** This is a sales page, not an app.
- **Stripe checkout embed:** Send to Gumroad/Payhip; they handle payment + delivery + tax.

## After 100 visitors

If you've had 100+ visits and 0 sales:

1. Re-read the headline. Is the outcome specific enough?
2. Re-read the pain points. Did you guess them or ask 5 real buyers?
3. Look at scroll depth (Plausible / Umami). If most leave at the hero, the headline is wrong. If they leave at proof, you need real testimonials.
4. Don't redesign — rewrite.
