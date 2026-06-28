# HyperFrames Cut — `rhythmix-overview-60s`

This folder is the **canonical reference Cut** for the RHYTHMIX HyperFrames
video pipeline (per ADR-0001 — Promos are authored as HyperFrames HTML, not
Remotion). It's a 60-second, 1920×1080 landscape Promo. Treat this doc as the
anatomy guide for *any* Cut folder, with this one as the worked example.

A "Cut" is a self-contained, renderable video: one HTML composition driven by a
paused GSAP timeline, plus its narration audio, config, and rendered outputs.

## What it does

`index.html` plays a single GSAP timeline (`window.__timelines["main"]`, paused
and scrubbed by the renderer) over five crossfaded scenes, synced to a narration
`.wav`. Rendered to MP4 by the HyperFrames CLI.

The 60s storyline (see `script.txt` for the verbatim narration):

| Scene | Window | Beat |
|-------|--------|------|
| 1 | 0–11s | Hook ("What if making music didn't take years?") → wordmark reveal |
| 2 | 10.5–22s | Four pillars: Generate / Master / Distribute / Earn |
| 3 | 22–29s | Three-step flow: describe → refine → release |
| 4 | 29–39s | Audience cards (bedroom producer, first-time artist, …) |
| 5 | 39–60s | Waitlist CTA + breathing wordmark ("Coming soon") |

---

## Anatomy of a Cut

```
rhythmix-<name>-<length>/
├── index.html          # GSAP + CSS composition (the whole video)
├── script.txt          # verbatim narration text
├── narration.wav       # TTS audio (Kokoro / ElevenLabs)
├── hyperframes.json    # { "version": "0.4.42" }   — CLI version pin
├── meta.json           # { "id", "width", "height" } — render identity
├── package.json        # dev / check / render / publish scripts
├── gsap.min.js         # vendored GSAP (no CDN at render time)
├── DESIGN.md           # palette / type / motion for this Cut
└── <name>-poster.jpg, <name>-preview.gif, <name>.mp4  # outputs
```

### Composition contract (`index.html`)

The renderer reads a specific DOM structure — these attributes are load-bearing:

- **Root** `#root` carries `data-composition-id="main"`, `data-start`,
  `data-duration` (60), `data-width`, `data-height`. The id must match the
  timeline key registered on `window.__timelines`.
- **Clips** (`<audio>` and each `.scene`) carry `data-start`, `data-duration`,
  and a unique `data-track-index` (audio is track 0; scenes 1–5). These place
  the element on the render timeline.
- **Narration** `<audio id="narration">` starts at `1.5s` — the hook plays
  ~1.5s of silence first so the first spoken word lands on the reveal, not the
  cold open.
- **Timeline** is built `paused: true`, registered as
  `window.__timelines["main"] = tl`, and **scrubbed frame-by-frame by the
  renderer** — it is never `.play()`-ed. Every animation is positioned at an
  absolute time (the trailing number in each `tl.from(...)` call), so the
  timeline is deterministic at any seek point.

### Scene transition pattern

Each scene fades its `#sceneN-inner` in at its `data-start` and out ~0.5s
before the next scene starts. **The crossfade IS the exit** — there are no
scene-internal exit animations (DESIGN.md rule). Entrances use
`expo.out` / `power3.out`, staggered 60–120ms across grid items, no bounce.

---

## Conventions to preserve

- **Time is absolute, not chained.** Position every tween with an explicit start
  time so the renderer can seek any frame. Don't rely on default sequential
  insertion if it would make a frame's state depend on playback history.
- **Scene start/duration must agree in two places** — the element's
  `data-start`/`data-duration` *and* the timeline's fade in/out positions. If
  they drift, the render shows a clip with no animation (or vice-versa).
- **Lock visuals to `DESIGN.md`.** Fixed palette (`#08050d` canvas, magenta
  `#ff1f5a`, …), Space Grotesk / JetBrains Mono, confident eases. No
  `#3b82f6`/Arial, no full-frame linear gradients, no elastic eases.
- **Vendor GSAP locally.** `gsap.min.js` is committed; the renderer has no
  network. Don't switch to a CDN `<script>`.
- **Pin the CLI version.** `hyperframes.json` + `package.json` both pin
  `0.4.42`. Bump them together; don't run a Cut on a mismatched CLI.

### Gotcha: narration and timeline are synced by hand

There's no auto-alignment between `narration.wav` and the GSAP timeline. The
scene windows were tuned to the spoken cadence (note the `1.5s` audio offset and
the 43.5s narration inside a 60s video — the tail is music/CTA breathing room).
If you re-record narration, **re-check every scene's start time against the new
audio** — the lint/inspect step won't catch desync.

---

## Commands (run from this folder)

```bash
npm run dev       # → hyperframes preview  (browser preview)
npm run check     # → hyperframes lint && inspect  (validate composition)
npm run render    # → hyperframes render  (MP4; needs ffmpeg)
npm run publish   # → hyperframes publish (push to registry)
# narration:  npx --yes hyperframes@0.4.42 tts   (needs kokoro-onnx)
```

## Key files

| File | Role |
|------|------|
| `index.html` | The composition — CSS scenes + the single paused GSAP timeline. Owns all timing. |
| `script.txt` | Verbatim narration; source of truth for TTS and the storyline. |
| `narration.wav` | Rendered narration audio, hand-synced to the timeline. |
| `meta.json` | Render identity: `id`, `width`, `height`. |
| `hyperframes.json` | CLI version pin (`0.4.42`). |
| `package.json` | dev / check / render / publish scripts. |
| `gsap.min.js` | Vendored GSAP (no network at render time). |
| `DESIGN.md` | Palette / typography / motion rules this Cut is locked to. |
| `*.mp4`, `*-poster.jpg`, `*-preview.gif` | Rendered outputs. |
