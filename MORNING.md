# Codex of Reality — Morning Brief

> Built overnight on branch `claude/new-session-DyR9R`. Everything pushed.
> Open this file first, then the app, in that order.

## Open the app on your phone (60 seconds)

```bash
# from the repo root, on your laptop:
cd sites/codex-of-reality
python3 -m http.server 8000 --bind 0.0.0.0
```

Then on your phone (same wifi), open:

```
http://<your-laptop-ip>:8000/app.html
```

To find `<your-laptop-ip>`: on macOS, *System Settings → Network → Wi-Fi → Details → TCP/IP → IPv4 Address*. Usually `192.168.x.x`.

**Add to home screen** when it loads — it's a PWA. The icon will live next to your other apps.

## What's live, right now

### Landing page — `sites/codex-of-reality/home.html`
- 9 sections, single-scroll, mobile-first
- Working Coherence Engine demo embedded in S2 (camera → BPM → coherence orb)
- "Open the App →" CTA in the header and hero now goes straight to the app
- AU$30 founding offer with placeholder Stripe CTA at the bottom

### The app — `sites/codex-of-reality/app.html`
- 8 screens, single self-contained HTML file, no build step
- **Home** — today's protocol (Kp-aware), Earth-pulse tile, geomagnetic tile, Tesla Codex rail, quick-start row, streak pill
- **Codex** — full library, category tabs (All / Tesla / Release / Manifest / Reverse / Recover), 9 protocols loaded
- **Live** — standalone Coherence Engine with breath pacer, cymatics background, save-session button
- **Player** — full protocol player. Combines breath pacer + camera PPG + frequency tone + cymatics + scripted narration text + progress bar. Completion writes a session, updates the streak, navigates to Streak screen.
- **Frequencies** — Web Audio API tone player. Tesla (Schumann 7.83 Hz binaural, 432 Hz, 40 Hz, 369 Hz) + 9 Solfeggio tones. Tap to play, volume slider, sticky bottom bar.
- **Streak** — current streak, total sessions, total minutes, 28-day calendar grid, recent sessions list
- **Settings** — Polar/HR strap pairing via Web Bluetooth (real, works in Chrome/Edge), other hardware as "Soon"/"Native only", reset progress, version info
- **Claim** — the AU$30 pricing screen, Stripe CTA placeholder

### Five Tesla Codex protocols are playable end-to-end
1. **The 3-6-9 Breath** — 3s in / 6s hold / 9s out, 12 cycles, 6 min, 432 Hz tone
2. **The Schumann Lock** — 5s in / 5s out, 36 cycles, 8 min, 7.83 Hz binaural beat
3. **Resonance Discovery** — pacer sweep 4–7 bpm, 5 min, finds your peak coherence
4. **The Toroidal Breath** — 4-4-4 box, 30 cycles, 6 min, 432 Hz
5. **The 369 Ritual** — 3 in / 6 hold / 9 out, journaling-paired, 3 min, 528 Hz
6. **The Violet Ray Tone** — 5/5 breath, 30 cycles, 5 min, 432 Hz + violet visual

Plus the three category sample protocols (Trauma Shake, Alpha State, 5-Min Monk Ritual).

### Live data feeds
- **NOAA Kp geomagnetic index** — fetched on home-screen load from `services.swpc.noaa.gov`. Color-coded tile + protocol recommender (Kp ≥ 4 = "Run the Schumann Lock").
- **Earth pulse tile** — currently showing the textbook 7.83 Hz fallback. The HeartMath GCMS live feed needs a server-side proxy because the data isn't CORS-friendly. See `specs/codex-app/tech-integrations.md` §1.1 for the integration plan — that's the week-1 next step.

### Hardware
- **Polar H10 / Verity Sense** — real Web Bluetooth pairing in Settings. Works in Chrome and Edge today. After pairing, the Coherence Engine consumes RR intervals from the strap instead of the camera.
- **HeartMath, Muse, Apple Watch, etc.** — UI placeholders in Settings, integration paths documented in `specs/codex-app/tech-integrations.md`.

### Content protocols (full markdown source)
All five Tesla protocols + the README authoring rules live in `content/protocols/`. Each has frontmatter (slug, breath pattern, audio refs, hardware notes), a mythology section, a clinically-neutral mechanism section, a timestamped narration script ready for ElevenLabs voice clone, practice notes, and real citations. **The voice clone is the next big unlock — once you record 30 minutes of your TikTok narration, ElevenLabs Professional Voice Cloning will produce all five sessions as audio in an afternoon.**

## Deploy to a public URL (5 minutes)

A GitHub Actions workflow is committed: `.github/workflows/pages.yml`. It auto-deploys `sites/codex-of-reality/` to GitHub Pages on every push to `main`.

To turn it on:

1. Merge `claude/new-session-DyR9R` → `main`
2. Go to repo Settings → Pages → Source → **GitHub Actions**
3. Push to `main` (or click "Run workflow" in the Actions tab)
4. Your URL: `https://wiggjamie9-afk.github.io/jamie-wigg/`

That URL drops straight into your TikTok bio.

## What's *not* done (priority order for today)

1. **Stripe Payment Link.** The "Claim Founding Membership" button shows a toast. Create an actual one-time AU$30 product in your Stripe dashboard, copy the Payment Link URL, paste into `app.html` near `// TODO: replace with real Stripe Payment Link` and into `home.html` near `#claim-cta`.
2. **ElevenLabs Professional Voice Clone.** Record 30 continuous minutes of your TikTok narration tone, upload to ElevenLabs, wait ~3 weeks for the professional clone. Then run all five Tesla scripts through it and host the MP3s. The protocol player is wired to play them once they exist — the `audio.narration` field in each `content/protocols/*.md` is the slot.
3. **HeartMath GCMS live Schumann feed.** Spin up a Supabase Edge Function that scrapes `heartmath.org/gci/gcms/live-data/` once per minute and serves a CORS-friendly JSON endpoint. Replace the fallback in `app.html` line near `state.lastSchumann`. The tile is ready to show live data — the data just isn't flowing yet.
4. **Native wrap.** When you want App Store distribution: Capacitor + `@flomentumsolutions/capacitor-health-extended` unlocks Apple Watch / Garmin / Oura / Fitbit HRV. Full plan in `specs/codex-app/tech-integrations.md` §1.3.

## Files added overnight

```
.github/workflows/pages.yml                          ← auto-deploys the app
MORNING.md                                           ← this brief
content/protocols/README.md                          ← protocol authoring rules
content/protocols/tesla-369-breath.md                ← hero protocol, fully scripted
content/protocols/tesla-schumann-lock.md             ← Earth-frequency protocol
content/protocols/tesla-toroidal-breath.md           ← visualization protocol
content/protocols/tesla-369-ritual.md                ← journaling ritual
content/protocols/tesla-violet-ray.md                ← sensory-anchor protocol
sites/codex-of-reality/sitemap.md                    ← landing site map
sites/codex-of-reality/styleguide.md                 ← visual language
sites/codex-of-reality/wireframes/home.md            ← landing wireframe
sites/codex-of-reality/home.html                     ← landing page (working demo)
sites/codex-of-reality/app.html                      ← THE APP (8 screens, 2100+ lines)
sites/codex-of-reality/index.html                    ← redirect to home.html
specs/codex-app/requirements.md                      ← R1–R11
specs/codex-app/design.md                            ← stack, algorithm, data model
specs/codex-app/tasks.md                             ← T1–T19, phased
specs/codex-app/tech-integrations.md                 ← cutting-edge tech roadmap
```

## The pitch you can post on TikTok today

> "I built a thing. It reads your heart through your camera. It tunes you to the Earth's frequency. It runs the Tesla 3-6-9 breath with a live coherence score. One price, lifetime, AU$30. Comment 'codex' for the link."

Drop the GitHub Pages URL once you've enabled Pages. The app works on iPhone Safari from a cold tap.

Sleep well. The Codex is live.
