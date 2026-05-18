# Codex — Tasks

References: `requirements.md` (R1–R10), `design.md`.

## Week 1 — Sellable surface

- [ ] **T1** — Landing page with embedded Coherence Engine demo.
  - satisfies: R1, R8
  - files: `sites/codex-of-reality/home.html`, `sites/codex-of-reality/styleguide.md`, `sites/codex-of-reality/sitemap.md`, `sites/codex-of-reality/wireframes/home.md`
  - acceptance: page loads under 2s on iPhone 5G, camera-PPG demo detects pulse within 8s of finger placement, breath pacer runs at 0.1 Hz, coherence number visibly responds to breath sync. Self-contained HTML, no build step.

- [ ] **T2** — Stripe Payment Link for AU$30 founding tier.
  - satisfies: R6
  - files: `sites/codex-of-reality/home.html`
  - depends: stripe account configured with AU$30 one-time product
  - acceptance: CTA button opens Stripe-hosted checkout; success redirect returns to landing page with claim flow placeholder.

- [ ] **T3** — Email capture for non-buyers (exit intent + footer).
  - satisfies: R8
  - files: `sites/codex-of-reality/home.html`
  - acceptance: form posts to a simple endpoint (Supabase function or Formspree placeholder); user receives a "first protocol" follow-up.

## Week 2 — App shell

- [ ] **T4** — Scaffold Next.js 14 app via `saas-scaffolder` skill.
  - satisfies: R6, R9
  - files: `app/**`
  - acceptance: Next.js + Tailwind + shadcn/ui + Supabase auth + Stripe webhook handler. `npm run dev` opens shell at localhost.

- [ ] **T5** — Supabase schema + RLS.
  - satisfies: R6, R7
  - files: `supabase/migrations/0001_init.sql`
  - depends: T4
  - acceptance: `users`, `purchases`, `protocols`, `sessions`, `streaks` per `design.md`. RLS gates protocols by `unlock_at_day <= now() - purchase.created_at`.

- [ ] **T6** — Post-purchase claim flow.
  - satisfies: R6
  - files: `app/claim/page.tsx`, `app/api/stripe/webhook/route.ts`
  - depends: T4, T5
  - acceptance: Stripe success → webhook writes `purchases` row → claim page creates Supabase user via magic link → user lands inside the app.

## Week 3 — Protocols

- [ ] **T7** — Protocol player UI (breath pacer + live coherence score + audio).
  - satisfies: R1, R3
  - files: `app/protocols/[slug]/page.tsx`, `components/CoherenceEngine.tsx`
  - acceptance: plays narration, renders breath pacer locked to protocol's pattern, runs Coherence Engine, writes a `sessions` row on completion.

- [ ] **T8** — ElevenLabs Professional Voice Clone setup.
  - satisfies: R10
  - depends: 30 min of Jamie's TikTok narration uploaded
  - acceptance: voice_id stored in env; sample 30s narration generated and reviewed.

- [ ] **T9** — Author 10 launch protocols.
  - satisfies: R3, R7
  - files: `content/protocols/*.md`, `content/protocols/*.mp3`
  - depends: T8
  - acceptance: 10 protocols across 4 categories. Scripted from top TikTok hits. Each 4–7 minutes, narrated via voice clone, paired with a breath pattern + suggested frequency layer.

## Week 4 — Ritual + launch

- [ ] **T10** — Streak + notification scheduler.
  - satisfies: R5
  - files: `app/streak/page.tsx`, `components/StreakRing.tsx`, push notification service
  - acceptance: daily session increments streak; missed day resets; notifications fire at morning + evening windows in user TZ.

- [ ] **T11** — Frequency player.
  - satisfies: R4
  - files: `components/FrequencyPlayer.tsx`
  - acceptance: solfeggio tones (174–963 Hz), binaural beats, brand soundscapes. Loops independently of protocols. Royalty-free assets only.

- [ ] **T12** — PWA manifest + service worker.
  - satisfies: R9
  - files: `app/manifest.json`, `app/sw.ts`
  - acceptance: add-to-homescreen works on iPhone; offline shell loads; protocols cached on first listen.

## Month 2 — Native + hardware

- [ ] **T13** — Capacitor wrap (iOS + Android).
  - satisfies: R9
  - files: `capacitor.config.ts`, `ios/**`, `android/**`
  - acceptance: same React codebase ships as native app.

- [ ] **T14** — `capacitor-health-extended` integration (HealthKit + Health Connect HRV).
  - satisfies: R2
  - depends: T13
  - acceptance: in native app, "Connect Apple Watch" / "Connect Garmin" pulls HRV samples; sessions can record device-sourced RR intervals.

- [ ] **T15** — Polar Web Bluetooth pairing.
  - satisfies: R2
  - files: `components/PolarPair.tsx`
  - acceptance: in supporting browsers (Chrome / Edge), user can pair an H10 or Verity Sense and the protocol player consumes its RR characteristic instead of camera PPG.

- [ ] **T16** — HeartCloud API integration.
  - satisfies: R2
  - depends: HeartMath API key approved
  - acceptance: OAuth flow links Inner Balance account; HRV history imports.

## Month 3+ — Scale

- [ ] **T17** — Whoop Developer API integration.
  - satisfies: R2
  - depends: Whoop dev access approved

- [ ] **T18** — Monthly content drop cadence.
  - satisfies: R7
  - acceptance: protocols with `unlock_at_day > 0` auto-appear in users' libraries as the calendar advances.

- [ ] **T19** — Founding-tier cap + next-tier launch.
  - satisfies: R6
  - acceptance: when founding cap (e.g., 500 members) is reached, Stripe Payment Link auto-rolls to next tier (AU$97).
