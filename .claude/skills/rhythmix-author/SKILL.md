---
name: rhythmix-author
description: Author a new RHYTHMIX promo video (HyperFrames HTML composition with TTS narration) end-to-end. Use whenever the user asks for a new RHYTHMIX video, a new variant of an existing one, or a recut at a different length / aspect ratio. Encodes the locked-in brand identity, scene patterns, voice choices, and render pipeline so output is on-brand without re-deriving from the codebase each time.
metadata:
  tags: rhythmix, video, hyperframes, brand
---

## When to use

User asks for any of:
- "make me a rhythmix video", "build a new rhythmix promo"
- a length variant (30s / 60s / 90s) or aspect variant (landscape / portrait / square) of an existing rhythmix-* project
- a recut focused on a specific theme (founder story, four pillars, audience, CTA-only)
- a new voiceover variant of an existing video

For unrelated video tasks, prefer the generic `hyperframes` skill instead.

## Hard rules

1. **Brand identity is fixed** — colors, fonts, motion eases, "What NOT to Do" anti-patterns are defined in `rhythmix-teaser-60s/DESIGN.md`. Read that file before authoring; do not invent palette or typography.
2. **Five-scene pattern** is the proven structure (see "Scene template" below). Deviate only when the user explicitly asks.
3. **Audio is always a separate `<audio>` clip** on track-index 0; visuals on tracks 1–5. Never use a `<video>` element for audio.
4. **Compute scene timing from the actual narration duration** — read it with `python3 -c "import wave; w=wave.open('narration.wav','rb'); print(w.getnframes()/w.getframerate())"` and place a 1.5s pre-roll + the narration + the remainder as outro hold.
5. **Use `npx --yes hyperframes@0.4.42`** for all CLI commands — never assume a globally-installed CLI version.
6. **Render to MP4 in the project root with the project name as filename**, e.g. `rhythmix-overview-60s/rhythmix-overview-60s.mp4`. The downloads page uses these paths.
7. **After rendering, append the new card to `downloads.html`** under the `── Latest · Just Rendered ──` section (create that section if it doesn't exist) with a `raw.githubusercontent.com/<user>/<repo>/<commit>/<path>` link pinned to the commit hash.

## Project layout

A new RHYTHMIX video lives at `rhythmix-<slug>-<duration>s/` at the repo root with these files:

```
rhythmix-<slug>-<duration>s/
├── DESIGN.md           # copied from rhythmix-teaser-60s/DESIGN.md (don't edit)
├── gsap.min.js         # copied from any sibling rhythmix-*-60s/ project
├── hyperframes.json    # {"version":"0.4.42"}
├── meta.json           # {"id":"rhythmix-<slug>","width":1920,"height":1080}  (or 1080x1920 / 1080x1080)
├── package.json        # standard dev/check/render/publish scripts (copy from rhythmix-overview-60s/)
├── script.txt          # plain-text narration (~140 words for 60s, ~70 for 30s)
├── narration.wav       # generated via `npx --yes hyperframes@0.4.42 tts script.txt --voice <id> --output narration.wav`
└── index.html          # the composition
```

## Voice catalog

Available pre-rendered voiceovers at the repo root:
- `voiceover-emma.wav` — bf_emma — British female, warm, modern (default for new compositions)
- `voiceover-adam.wav` — am_adam — American male, confident
- `voiceover-michael.wav` — am_michael — American male, conversational

For a fresh narration use Kokoro voices via `npx hyperframes tts`:
- **bf_emma** — British female (default, fits the "modern/aspirational" tone)
- **am_michael** — American male (use for conversion/CTA videos)
- **am_adam** — American male, more authoritative
- **bf_isabella** — British female alternative
- **af_nova / af_heart** — American female options

Confirm the voice with the user before generating; cost of regen is real (~30s on this CPU).

## Scene template (60s, 1920×1080)

Five scenes, all on different `data-track-index` so they can crossfade by overlap:

| # | Scene | Window | Track | Beat |
|---|---|---|---|---|
| 1 | HOOK + REVEAL | 0–11s | 1 | Cycle 2-3 hooks, then RHYTHMIX wordmark + tagline |
| 2 | FOUR PILLARS | 10.5–22.5s | 2 | Generate / Master / Distribute / Earn (2×2 grid) |
| 3 | HOW IT WORKS | 22–29.5s | 3 | Describe → Refine → Release (3 horizontal cards) |
| 4 | BUILT FOR | 29–39.5s | 4 | Audience lines (Bedroom / First-time / Solo / Anyone) |
| 5 | CTA | 39–60s | 5 | Waitlist badge, "Be first." headline, RHYTHMIX wordmark, breathe + final fade |

Crossfade pattern: each scene ends with `tl.to("#scene<n>-inner", { opacity: 0, duration: 0.5 }, <end-0.5>)` and the next starts with `tl.from("#scene<n+1>-inner", { opacity: 0, duration: 0.5 }, <end-0.5>)` at the same time.

For 30s recuts: drop scenes 3 and 4, compress 1+2+5 to ~10s each.
For 90s recuts: split scene 1 into separate hook and reveal, expand scene 4 to 4 audience archetypes.

## Voice rules

- Open with a question or a denial pattern ("What if…" / "No producer. No studio. No instrument.")
- Reveal RHYTHMIX as the answer, not the topic
- Four pillars are always: **Generate · Master · Distribute · Earn** (in that order)
- Three steps are always: **Describe → Refine → Release**
- Close with **"RHYTHMIX. Coming soon."** or "Just be first in line. RHYTHMIX. Coming soon."
- Never promise pricing in the narration unless the user explicitly asks for a $149/lifetime variant
- Never use the phrase "AI-powered" — the platform IS AI-music; saying "AI-powered" sounds defensive

## End-to-end pipeline

```bash
# 1. Scaffold from a sibling project
SLUG=overview && DUR=60 && DIR=rhythmix-${SLUG}-${DUR}s
mkdir -p $DIR
cp rhythmix-teaser-60s/{DESIGN.md,gsap.min.js} $DIR/
cp rhythmix-overview-60s/{package.json,hyperframes.json} $DIR/

# 2. Write script and meta
echo '<narration text>' > $DIR/script.txt
echo '{"id":"'$DIR'","width":1920,"height":1080}' > $DIR/meta.json

# 3. Generate narration
cd $DIR && npx --yes hyperframes@0.4.42 tts script.txt --voice bf_emma --output narration.wav

# 4. Measure narration duration (anchors scene timing)
python3 -c "import wave; w=wave.open('narration.wav','rb'); print(w.getnframes()/w.getframerate())"

# 5. Author index.html (5-scene template — see rhythmix-overview-60s/index.html as canonical reference)

# 6. Lint, inspect, validate
npx --yes hyperframes@0.4.42 lint
npx --yes hyperframes@0.4.42 inspect
npx --yes hyperframes@0.4.42 validate   # contrast warnings on faded-scene text are expected false positives — verify they all fall inside transition windows

# 7. Render
npx --yes hyperframes@0.4.42 render --quality standard --output ${DIR##*/}.mp4

# 8. Commit + push (NEVER without explicit user instruction)
cd .. && git add $DIR && git commit -m "Add $DIR" && git push
```

## Publishing to the iPhone download page

After the user approves the render, append a card to `downloads.html` in the `── Latest · Just Rendered ──` section. Pattern (use the actual commit hash that contains the MP4):

```html
<div class="card">
  <span class="badge l">60s · Landscape · <one-line summary></span>
  <h2>Video N — <Title></h2>
  <p>"<key line from script>" — <one-sentence description>. <Voice> voiceover.</p>
  <a class="btn btn-l" href="https://raw.githubusercontent.com/wiggjamie9-afk/jamie-wigg/<COMMIT>/<DIR>/<DIR>.mp4">
    ⬇ Download Video N
  </a>
  <p class="hint"><FILESIZE> · <WIDTH>×<HEIGHT> · iPhone-ready</p>
</div>
```

Use `badge p` for portrait, `badge l` for landscape, `badge s` for square. Increment N from the highest existing video number.

## Common pitfalls (do not repeat)

- **Don't trust the lint warning about file size** — splitting a 5-scene composition into sub-compositions usually hurts more than it helps for this brand.
- **Don't animate `display` or `visibility`** — the framework's `class="clip"` handles visibility; you only animate visual properties.
- **Don't `repeat: -1`** anywhere — capture engine breaks. Calculate finite repeats from duration.
- **Don't put exit animations on every scene** — the next scene's fade-in IS the transition. Only the final CTA scene fades to black at the very end.
- **Don't `gsap.set()` clip elements from later scenes** at parse time — they're not in the DOM yet. Use `tl.set(selector, vars, time)` inside the timeline at or after the clip's `data-start`.
- **Don't pull whisper for word-level transcript timing** — the model download is blocked in this sandbox. Use proportional word-count math instead (script word index / total words × narration duration).

## Reference projects

- `rhythmix-overview-60s/` — canonical 60s landscape platform overview (the most recent, cleanest example)
- `rhythmix-teaser-60s/` — 60s portrait teaser (alternative aspect ratio reference)
- `rhythmix-platform-60s/` — feature-showcase variant
- `rhythmix-getit-60s/` — conversion / CTA variant with $149 pricing

When in doubt, copy from `rhythmix-overview-60s/` and modify.
