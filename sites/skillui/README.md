# SkillUI — landing site

Self-contained bilingual marketing page for **SkillUI**, in the **MindBlow Media**
brand. Highlights SkillUI's headline feature: the **automatic cookie / consent
dismiss** that runs *before* design-system extraction.

English is the default; German is a full translation.

## Files

| File | Purpose |
|---|---|
| `index.html` | English landing page (default — served at `/`) |
| `de.html` | German version (served at `/de.html`) |
| `styles.css` | Shared stylesheet (MindBlow Media tokens + layout) |
| `app.js` | Shared behaviour (consent-dismiss demo, scroll reveal, header state) |
| `demo.webm` | Hero demo video, self-hosted (VP8, ~0.25 MB, 1280×720, 8 s) |
| `poster.png` | Video poster frame |
| `logo-head.png` | Brand mark (square, transparent) |
| `logo-horizontal.png` | Mark + `skillui` wordmark (transparent) |
| `DESIGN.md` | Stitch-format design system for this brand surface |

A language switch (**EN / DE**) sits in the header and footer of both pages.

> **Note on the video format:** the hero demo ships as `demo.webm` (VP8). The
> `<video>` element also lists a `demo.mp4` source, so you can drop in an H.264
> encode later for older Safari without touching the markup. The **primary**
> demo is the live, JS-driven animation in the hero — it needs no video file and
> literally performs the consent-dismiss → extraction flow.

## Deploy

Static site, zero config. On **Vercel**: *Add New Project → Import this repo*,
framework preset **Other** (no build command), set the root directory to
`sites/skillui`, **Deploy**. Vercel redeploys on every push.

## View locally

```bash
python3 -m http.server 8000 --directory sites/skillui
# http://localhost:8000
```

---

Made with ❤ in Munich & Bangkok · **MindBlow Media**
