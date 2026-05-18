# Codex — Design

References: `requirements.md` (R1–R10).

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui | `saas-scaffolder` skill maps to this; fast to ship; PWA-able |
| Backend | Supabase (Postgres + Auth + Storage) | Solo-operator friendly; row-level security covers content gating |
| Payments | Stripe one-time payment (AU$30) | Founding tier — no subscription complexity |
| Native wrap | Capacitor + `@flomentumsolutions/capacitor-health-extended` | One codebase → iOS + Android + web; unlocks HealthKit / Health Connect HRV |
| HRV (browser) | `getUserMedia` + `<canvas>` + WebAudio — vanilla JS | Self-contained, no native dependency, runs in PWA |
| HRV (hardware) | Web Bluetooth (Polar GATT 0x180D) + HeartCloud API (HeartMath) + Whoop API | Free integrations; HealthKit only via Capacitor wrap |
| Audio | Web Audio API + royalty-free WAVs from ZENmix / Jaapi | Solfeggio + binaural without licensing cost |
| Content production | ElevenLabs Professional Voice Clone of Jamie's narration | Sustains 30-month content commitment |
| Background music | Replicate MusicGen (already wired in `.mcp.json`) | Per-protocol soundscapes |

## The Coherence Engine — algorithm (R1)

Camera-based PPG pipeline, runs entirely client-side:

1. **Capture.** `getUserMedia({ video: { facingMode: 'environment' } })`. Activate flashlight via `track.applyConstraints({ advanced: [{ torch: true }] })` where supported.
2. **Sample.** Each `requestAnimationFrame`, draw an 80×80 center patch of the video frame to an off-screen canvas. Compute mean red-channel intensity. Push `{ t, r }` to a rolling buffer (10 seconds at ~30 Hz = 300 samples).
3. **Detrend.** Subtract a 2-second moving average from each sample to remove DC drift.
4. **Bandpass.** Constrain to 0.7–3.5 Hz (40–210 BPM) via a simple two-pass IIR. Pure JS, ~20 lines.
5. **Peak detect.** Find local maxima above adaptive threshold (median + 1.5× MAD). Reject peaks closer than 300 ms apart (refractory).
6. **RR series.** Compute inter-peak intervals in milliseconds. Maintain a rolling window of the last 30 RR values.
7. **HRV.** RMSSD = `sqrt(mean((rr[i+1] - rr[i])^2))`. Reported as a stability score.
8. **Coherence score.** Run a Goertzel filter at the breath cadence frequency (default 0.1 Hz). Coherence score = the magnitude of HR oscillation at the breath frequency, normalized against total HR power in 0.04–0.4 Hz. Output 0–100.
9. **Render.** Three visuals — pulsing heart (per detected beat), expanding orb (breath pacer, sine-eased 5s in / 5s out), coherence number rising over the session.

Fallback when no pulse detected within 8 seconds: breath-pacer-only mode. Still useful, no "demo failed" feeling.

## Hardware integration order (R2)

| Order | Device | Path | Effort |
|---|---|---|---|
| 1 | Phone camera | `getUserMedia` (browser) | Days |
| 2 | Polar H10 / Verity Sense | Web Bluetooth, GATT 0x180D + RR characteristic | Days |
| 3 | Apple Watch / Garmin / Oura / Fitbit | Capacitor + `capacitor-health-extended` | Weeks (requires native wrap) |
| 4 | HeartMath Inner Balance | HeartCloud API (OAuth) | Weeks (apply for API key) |
| 5 | Whoop | Whoop Developer API (OAuth) | Weeks |

Browser app gets devices 1–2 on day one. Native wrap (month 2) brings 3. HeartMath + Whoop slot in once their API approvals come through.

## Data model (Supabase)

```
users                 -- supabase auth
  id, email, voice_clone_voice_id, created_at

purchases
  id, user_id, stripe_payment_intent, amount_cents, currency,
  founding_member bool, created_at

protocols
  id, slug, category enum('release','manifest','reverse','recover'),
  title, narration_url, breath_pattern jsonb,
  unlock_at_day int,           -- staged drip per R7
  duration_seconds, created_at

sessions
  id, user_id, protocol_id, started_at, ended_at,
  source_device enum('camera','polar','heartmath','apple_watch','garmin','whoop'),
  avg_bpm, rmssd_ms, coherence_score, raw_rr_intervals jsonb

streaks
  user_id, current_streak_days, longest_streak_days, last_session_date
```

Content gating: `purchases` row + `unlock_at_day <= (now - purchase.created_at)` controls access via RLS.

## Brand identity (codified from the AU$30 page + TikTok aesthetic)

- **Palette.** Deep navy `#0a1628` background. Gold `#d4a843` primary accent. Parchment `#f4ecd6` text. Cyan-glow `#5ce5e0` for coherence rising. Magenta-warn `#ff3b6b` for the TikTok-style alarm chips.
- **Typography.** Display: serif italic ("Cormorant Garamond" or "Playfair Display Italic"). UI: geometric sans ("Inter"). Mono labels: small-caps mono ("JetBrains Mono" letter-spaced).
- **Motion.** 5s sine ease for breath pacer. 300ms cubic-bezier for UI. Coherence orb pulses at detected HR. No bounce, no decorative motion — only feedback-bearing motion.
- **Mood.** "Ancient + scientific" — parchment textures and circuit-board diagrams coexist. Sober, not playful. Authoritative, not corporate.

Full visual language goes in `sites/codex-of-reality/styleguide.md`.

## Funnel (R8)

```
TikTok bio link
   ↓
landing page (sites/codex-of-reality/home.html)
   ├─ within 10s: working Coherence Engine demo
   ├─ scroll: protocols, hardware compatibility, social proof
   ├─ pricing: AU$30 Founding Membership (Stripe Payment Link)
   └─ exit intent: email capture → "Free starter protocol" delivery
```

The landing page itself is the funnel's centerpiece. It must work cold on iPhone 5G, run the demo without registration, and convert at AU$30. Build this first; the full app follows.

## Build sequence (maps to `tasks.md`)

Week 1 — Landing page with working Coherence Engine demo, Stripe Payment Link, email capture. *Sellable surface, no app yet.*  
Week 2 — Next.js app shell, Supabase auth + content gating, post-purchase access.  
Week 3 — First 10 protocols (top TikTok hits scripted to 5-min sessions, narrated via ElevenLabs voice clone), protocol player UI.  
Week 4 — Streak + notifications + frequency player. Launch as PWA.  
Month 2 — Capacitor native wrap. HealthKit / Health Connect HRV via `capacitor-health-extended`.  
Month 2–3 — Polar Web Bluetooth pairing. HeartCloud API integration. App Store submission.  
Month 3+ — Whoop integration. Monthly content drops. Founding-cap closes, next pricing tier opens.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Camera PPG noise on dark skin / low light | Adaptive threshold + breath-pacer-only fallback; promote hardware pairing as upgrade |
| App store reviewer rejects "reverses aging" claims | In-app copy is clinically neutral; marketing site keeps mystique |
| AU$30 lifetime kills LTV | Founding tier capped (e.g., 500 members); next tiers ladder up to AU$197 |
| HeartCloud / Whoop API approval timeline | Ship Web Bluetooth + camera on day one; partner integrations are upgrades, not blockers |
| Solo content cadence | ElevenLabs voice clone shrinks per-protocol production from hours to minutes |
