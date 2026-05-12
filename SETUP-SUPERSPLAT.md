# Setting up SuperSplat for this workspace

[SuperSplat](https://github.com/playcanvas/supersplat) is PlayCanvas's open-source editor for **3D Gaussian Splats** — the point-cloud-like 3D scene format produced by tools like Polycam, Luma AI, and NeRFstudio. It runs entirely in the browser (WebGPU/WebGL) and lets you crop, transform, denoise, and re-export `.ply` / `.splat` / `.compressed.ply` files.

> Honest framing: this repo is a Remotion/HyperFrames video pipeline plus RHYTHMIX landing-page work. SuperSplat is **unrelated** to the daily workflow — there's no Gaussian splat content here today. Set it up only if you're planning to bring 3D-captured scenes into RHYTHMIX promo videos (e.g. a splat of a venue used as a background for `rhythmix-venue-*` scenes via screen recording → HyperFrames). For everything else, you can skip this doc.

For the full feature list, screenshots, and roadmap, see the upstream repo: <https://github.com/playcanvas/supersplat>.

(Steps verified against the upstream README as of **2026-05-12**.)

---

## ⚠️ Port collision with Remotion Studio

SuperSplat's dev server listens on `http://localhost:3000`. So does this repo's **Remotion Studio** (`npm run dev` inside `video/` — see `CLAUDE.md`). Don't run both at the same time, or override SuperSplat's port:

```bash
# In the supersplat checkout, after npm install:
PORT=3100 npm run develop      # use 3100 (or anything free) instead of 3000
```

If you're only going to use SuperSplat as the deployed web app, skip the dev setup entirely and use <https://superspl.at> — no install needed.

## 1. Prerequisites

- Node.js **18 or later** (this repo's `video/` already pins a similar range; `node --version` to check)
- A WebGPU-capable browser for the best editing performance (Chrome ≥ 113, Safari TP, Edge ≥ 113). WebGL fallback works but is slower.

## 2. Clone and install (in a sibling directory, **not** inside this repo)

```bash
cd ..                                                  # leave the jamie-wigg repo
git clone https://github.com/playcanvas/supersplat.git
cd supersplat
npm install
```

> Don't clone it inside `/home/user/jamie-wigg/` — it would pull a separate `node_modules` and pollute the working tree.

## 3. Run the dev server

```bash
PORT=3100 npm run develop
```

Then in the browser:

1. Open `http://localhost:3100`
2. Disable caching on the **Network** tab of DevTools (Safari: `Cmd+Option+E` or **Develop → Empty Caches**; Chrome: **Application → Service Workers** → tick *Update on reload* and *Bypass for network*).
3. Edits to `supersplat/src/**` rebuild automatically — just refresh.

## 4. Where it could actually help this repo

| Use case                                                                          | Why SuperSplat helps                                                              |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Clean a Polycam/Luma splat of a venue, then screen-record a fly-through            | The fly-through becomes a background plate for `rhythmix-venue-*` HyperFrames     |
| Export a `.compressed.ply` and embed it in a landing-page hero (`splat-viewer`)   | Adds a 3D interactive element to `rhythmix.html` / `studio.html`                  |
| Crop noisy background out of a captured stage / instrument scan                    | Cleaner input for any 3D shot in a promo                                          |

For *just* viewing a splat in a video, a screen recording → HyperFrames is fine and avoids the editor entirely.

## 5. Localizing (only if you're contributing back upstream)

If you actually contribute to SuperSplat (not just use it):

1. Add `static/locales/<locale>.json` in the SuperSplat checkout.
2. Register it in `src/ui/localization.ts`.
3. Test with `http://localhost:3100/?lng=<locale>`.

This is a contribution to the SuperSplat repo, not something this repo tracks.

## 6. What this does *not* affect

- This repo's `video/` Remotion project — completely independent (other than the port collision noted above).
- `.mcp.json`, `.claude/settings.json`, HyperFrames pipelines — untouched.
- RHYTHMIX skills — none of them call SuperSplat. Any integration would be manual (record splat fly-through → drop into a HyperFrames composition).

## 7. Troubleshooting

- **Port 3000 already in use** → either stop Remotion Studio (`pkill -f 'remotion'`) or run SuperSplat with `PORT=3100 npm run develop`.
- **WebGPU not available** → the editor falls back to WebGL. For best performance, enable WebGPU in your browser's experimental flags.
- **Service worker serving stale JS after edits** → re-tick *Update on reload* / *Bypass for network*, then hard-refresh.
