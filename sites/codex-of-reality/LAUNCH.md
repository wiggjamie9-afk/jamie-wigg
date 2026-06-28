# Codex of Reality — Launch Runbook

A step-by-step, do-this-then-this guide to get Codex organized, honest, live, and
selling. Honest framing: this is a **small bounded bet** to find out if the
product resonates — not a guarantee of sales. Realistic outcome over 6 months of
real effort: likely $0 for the first months, $100–500/mo if a channel catches,
rarely more. The code is the easy 10%; consistent posting (Phase 4) is the 90%.

Legend:  ✅ done (in this repo) · 🟡 you (account/login) · 🔵 I can do on request

---

## Phase 0 — Two gates before anything goes live

- [ ] 🟡 **Verify the TikTok proof.** The home page shows "183K followers · 935K
  likes · @codex.of.reality." **If that account is real and yours, keep it.** If
  it isn't, it MUST come off the sales page before launch — fake social proof
  triggers refunds and bans. Tell me which, and I'll keep or remove it.
- [ ] 🟡 **Pick ONE channel** for Phase 4 (TikTok / Reels / YouTube Shorts).
  One. Going deep on one beats spreading across all three.

---

## Phase 1 — Make it purchasable  (≈1 hour, mostly you)

- [ ] 🟡 On Gumroad, create the product **"Codex of Reality"**, price **AU$30**,
  and turn **license keys ON** (Settings → check "Generate a unique license key
  per sale").
- [ ] 🟡 Copy the product **permalink** (the part after `/l/` in the URL).
- [ ] 🔵 Tell me the permalink — I'll set it in the 3 places it's used:
  `access.js` (`GUMROAD_PERMALINK` + `PURCHASE_URL`), `home.html`, `app.html`.
  (Right now they're the placeholder `codex-of-reality`.)
- [ ] 🟡 **Buy it yourself once** (Gumroad has a test mode, or use a real card and
  refund). Confirm the full loop: pay → Gumroad emails a key → paste it in the
  app's claim screen → "✓ Lifetime member." If that works, your money machinery
  is real.

✅ Already done: the checkout button is wired (it linked to a dead `#claim`
anchor before), license activation + verification works, refunds auto-revoke.

---

## Phase 2 — Make it honest  (≈30 min, you approve)

The app's FAQ is already responsible ("not a medical device", "not clinical
HRV") — good. The problem is the **marketing claims**. Apply this honest hero
(🔵 I'll paste it in on your "yes"):

> **Eyebrow:** THE CODEX OF REALITY · FOUNDING MEMBER
> **Headline:** Your heart has a *rhythm*. Learn to steer it.
> **Lead:** An HRV biofeedback studio for your phone. Read your heart-rate
> variability live with the camera, then use guided breathing to bring it into
> coherence — the calm, steady state athletes and clinicians train for. One
> price, yours forever.

- [ ] 🔵 Replace the current hero ("Reality has a frequency · Tesla's 3-6-9 · the
  Schumann lock") with the above.
- [ ] 🔵 Do the same honest pass on the rest of the page (the "Tesla Codex
  protocols" / "Schumann picks today's protocol" copy) — keep the calm mood,
  drop the pseudoscience-as-fact.
- [ ] 🟡 Decide the TikTok line (Phase 0).

Keep the frequency soundscapes and breathing protocols as **features/experience**
— that's fine. Just don't state them as scientific keys to reality.

---

## Phase 3 — Get it live  (≈20 min)

Codex is a static site, so this is simple:

- [ ] 🟡 Merge this branch to `main`. GitHub Pages already deploys the repo, so
  the app appears at `rhythmixapp.com.au/sites/codex-of-reality/home.html`.
- [ ] 🟡 (Optional, nicer) point a subdomain like `codex.rhythmixapp.com.au` at
  it later. Not required to start.
- [ ] 🟡 Open the live URL on your phone, run one coherence session end to end,
  and click the buy button to confirm it reaches Gumroad.

---

## Phase 4 — The content engine  (daily, ongoing — the real work)

This is where it's won or lost. No tool can do this part for you.

- [ ] 🔵 / ✅ The drafting is ready: from `auto-runner/`, run
  `python runner.py --preset codex --once` to generate an honest hook + shoot
  brief (hook + what to show + caption + CTA) into `drafts/`.
- [ ] 🟡 **Every day:** record the 15-second screen-capture demo it describes
  (a heartbeat → live coherence reading), post to your ONE channel.
- [ ] 🟡 Do this for **90 days**. Most people quit here. Don't.

---

## Phase 5 — Free funnel  (after Phase 4 has momentum)

- [ ] 🔵 Add an email capture + a "try the free version → buy Codex" CTA to
  Roomtone (the finished free audio PWA), turning it into a top-of-funnel entry.
- [ ] 🟡 Connect the email capture to a real provider (Formspree/ConvertKit —
  free tiers). Right now Codex's email box says "Sent" but stores nothing; that
  gets wired here.

---

## Phase 6 — Measure & decide at Day 90

- [ ] 🟡 Set `GUMROAD_ACCESS_TOKEN` and run `python runner.py --preset codex
  --once` — `gumroad_sales` reports your **real** numbers.
- [ ] 🟡 **Go/no-go rule (decide it now):** if it's selling, double down on the
  channel + add a second price tier. If it's flat after 90 honest days of daily
  posting, change the **wedge or product** — not just "post more."

---

## This week — the only 3 things that matter right now

1. 🟡 Answer the TikTok gate (Phase 0).
2. 🟡 Create the Gumroad product + send me the permalink (Phase 1).
3. 🔵 I apply the honest copy (Phase 2) + set the permalink everywhere.

Do those, and Codex is live, honest, and purchasable. Then it's 90 days of
Phase 4 — the part only you can do.
