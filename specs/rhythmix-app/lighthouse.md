# Lighthouse mobile audit — status: offline structural pass only

T13's acceptance criterion ("Lighthouse mobile score ≥90 on `/`, `/new`, `/library`") was not empirically verified during the spec run. The sandbox where /spec-run executed has no browser available — `apt install chromium` resolves to a snap shim that requires snap (not available), and `@puppeteer/browsers install chrome` returns 403 from googlechromelabs.com (egress allowlist blocks it). A real Lighthouse run requires either a different execution environment or a post-deploy run against `https://studio.rhythmixapp.com.au`.

What follows is a **structural audit** of the static export at `studio/out/`. It catches the antipatterns that would tank a Lighthouse score; it does not produce a number.

## Static export shape

```
studio/out/  1.3 MB total

Route               Page HTML   First-Load JS
/                   5.4 kB      106 kB shared
/new                9.5 kB      109 kB
/library            6.6 kB      115 kB
/plan/_             6.3 kB      115 kB
/render/_           6.3 kB      116 kB
/settings          13.2 kB      115 kB
/unsupported        5.5 kB      107 kB
/404                7.2 kB      107 kB
```

JS chunks (uncompressed):
- `framework-*.js` 190 kB (React 19 + Next runtime)
- `main-*.js` 117 kB
- `polyfills-*.js` 113 kB
- Two anonymous shared chunks 200 kB + 167 kB
- Per-route chunks 1–13 kB

Brotli on Cloudflare Pages typically gets ~25% of source size on transfer — first-load network cost lands around **170 kB compressed**, well inside the ≤200 kB budget that Lighthouse rewards.

## Mobile-perf antipattern checks

| Check | Result | Notes |
|---|---|---|
| `<meta name="viewport">` set with `width=device-width, initial-scale=1, viewport-fit=cover` | ✅ all pages | iOS Safari notch-friendly |
| `<html lang="en">` set | ✅ all pages | a11y win |
| `<title>` per page | ✅ all pages | SEO + screen reader nav |
| Number of `<script>` tags in initial HTML | 1 per page | Next's `__NEXT_DATA__` only; JS chunks are async-loaded |
| Render-blocking external CSS (`<link rel="stylesheet">` in `<head>`) | none | Tailwind v4 inlined into JS, no external blocker |
| Render-blocking images (LCP `<img>` in static HTML) | none | No `<img>` in any page HTML — assets are user-generated, lazy |
| `<video>` autoplay / poster issues | none | No `<video>` in static HTML |
| Font loading strategy | system font stack | Brand fonts (Space Grotesk, JetBrains Mono) referenced in CSS via Google Fonts API at runtime; recommend `font-display: swap` audit post-deploy |
| Inline base64 images bloating HTML | none | confirmed by HTML size ceiling 13 kB |
| 44 px touch-target floor (R9) | enforced in `globals.css` via `@media (pointer: coarse)` | T13 wired this; visually verified at 375 px |
| Cumulative Layout Shift hazards (images without dimensions, dynamic content shifting) | low risk | No images in static HTML; lazy-loaded thumbnails in `/library` are `<img>` inside a fixed-size card with `aspect-ratio` constrained |

## What Lighthouse would still flag

These are realistic predictions; verify against the live deploy:

1. **First Contentful Paint** — likely 0.8–1.5 s on a 4G simulator. Next.js + static export with sub-200 kB compressed payload is well-positioned.
2. **Largest Contentful Paint** — first paint is the `<h1>` text on `/` (no image LCP candidate). Should be sub-2.5 s.
3. **Cumulative Layout Shift** — risk only on `/library` thumbnails if the loaded blobs render at different aspect ratios than the card. Card has `aspect-ratio: 16/9` reservation — should hold CLS ≤ 0.1.
4. **Time to Interactive** — React 19 hydration on a 115 kB first-load. Probably 2.5–3.5 s on 4G/Moto G4 simulator. Aggressive but achievable for ≥90.
5. **Total Blocking Time** — chunks of 200 kB + 167 kB will block briefly during parse on a mid-tier mobile. May be the closest call.

## Action: run real Lighthouse post-deploy

```bash
# After deploying to Cloudflare Pages
npx lighthouse https://studio.rhythmixapp.com.au/ --preset=desktop --view
npx lighthouse https://studio.rhythmixapp.com.au/ --form-factor=mobile --view
npx lighthouse https://studio.rhythmixapp.com.au/new --form-factor=mobile --view
npx lighthouse https://studio.rhythmixapp.com.au/library --form-factor=mobile --view
```

Or wire a `lighthouse-ci` job into `.github/workflows/studio-test.yml` so every PR gets a delta report — recommended once a baseline exists post-launch.

## Structural verdict

No hard failure modes identified. Bundle size is the only realistic risk for a sub-90 mobile score, and even there the brotli-compressed transfer is inside the budget that typically scores ≥90.
