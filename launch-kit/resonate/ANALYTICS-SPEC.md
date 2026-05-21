# RESONATE — Analytics & Tracking Events Specification

**Owner:** Jamie Wigg
**Property:** `rhythmixapp.com.au/resonate.html`
**Conversion target:** Gumroad purchase at `https://wiggjamie.gumroad.com`
**Decision window:** Within 24h of launch, Jamie must know — is this working?

This spec is privacy-first, lightweight, and designed to be wired into `resonate.html` in under 30 minutes. It mirrors the brand promise on the page itself: *"Nothing leaves your phone."* — so the visitor-side analytics stay on the same axis (no PII, no third-party cookies, no session replay).

---

## 1. Tool Stack (Recommended)

| Layer | Tool | Why |
|---|---|---|
| **Site analytics** | **Plausible** (preferred) or Fathom | Cookieless, GDPR-compliant, no consent banner needed in AU. Custom events via `plausible('event-name')`. ~AU$14/mo for 10k pageviews. Matches the privacy moat in the page copy. |
| **Sales** | Gumroad built-in dashboard | Already wired. Use Gumroad's **Ping** webhook to forward `sale` events into Plausible as a Goal (revenue attribution). |
| **Event funnel (optional)** | **PostHog Cloud (EU)** free tier | Only add if Plausible's funnel visualizer feels too coarse. Free for 1M events/mo. Self-hostable later. Use anonymous distinct_id (no email). |
| **Email capture** | Whatever powers the Day One form (ConvertKit / Buttondown / Resend) | Track form-submit as a Plausible custom event, then verify in the ESP. |
| **Uptime / launch-day pulse** | Plausible "Realtime" view + Gumroad sales tab open in two browser tabs | No extra tool needed for day-one. |

**DO NOT use:** Google Analytics 4 (cookie consent required in AU + opaque sampling), Hotjar (session replay leaks PII), Meta Pixel (no paid social planned for launch).

**Plausible script (drop into `<head>`):**
```html
<script defer data-domain="rhythmixapp.com.au" src="https://plausible.io/js/script.tagged-events.outbound-links.js"></script>
<script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
```

The `.tagged-events.outbound-links` variant auto-tracks any `<a>` with `class="plausible-event-name=..."` plus all external links — covering Gumroad clicks without extra JS.

---

## 2. Events to Instrument (18 events)

Each event uses `plausible('name', { props: {...} })`. Properties stay low-cardinality (Plausible caps at 4 props/event).

### Awareness & engagement

| # | Event | When it fires | Properties | Why it matters |
|---|---|---|---|---|
| 1 | `page_view` | Auto on every load | `path`, `referrer_source`, `utm_source`, `utm_campaign` | Top of funnel. Plausible captures automatically. |
| 2 | `scroll_depth_25` | User scrolls past `#premise` (~25%) | `time_on_page_s` | Did they read past the hero? |
| 3 | `scroll_depth_50` | Past `#loop` (~50%) | `time_on_page_s` | Got past the moat table. Heavy intent signal. |
| 4 | `scroll_depth_90` | Past `#faq` (~90%) | `time_on_page_s` | Read everything. Highest-intent non-purchaser. |
| 5 | `time_on_page_60s` | Fires once at 60s dwell | — | Filter bounces from real readers. |

### Interaction (page-specific elements)

| # | Event | When it fires | Properties | Why it matters |
|---|---|---|---|---|
| 6 | `hr_slider_interact` | First `input` event on `#hrSlider` | `final_bpm` (debounced 2s) | Did the closed-loop demo land? Strong correlation with intent. |
| 7 | `mode_sample_click` | Any `[data-mode-tone]` button | `mode` (`focus`\|`calm`\|`rest`) | Which mode resonates most — informs ad copy. |
| 8 | `breath_tone_play` | `#cohPlay` clicked | — | Played the 0.1 Hz tone. The "aha" moment for skeptics. |
| 9 | `faq_open` | Any `<details class="faq-item">` opened | `question` (first 40 chars of summary) | Which objections are alive — informs FAQ rewrites. |
| 10 | `pwa_install_prompt_shown` | `beforeinstallprompt` fires | — | iOS Safari doesn't fire this; Android/desktop only. Tracks PWA potential. |
| 11 | `pwa_install_accepted` | User accepts the prompt | — | True PWA adoption — these users return without ads. |

### Conversion (THE critical path)

| # | Event | When it fires | Properties | Why it matters |
|---|---|---|---|---|
| 12 | `cta_click_hero` | Click on `.btn-primary[href="#pricing"]` (hero "Begin · AU$30") | — | Hero CTA strength. |
| 13 | `cta_click_gumroad` | Click on `a[href*="gumroad.com"]` (pricing card "Begin · Pay Once") | `source_section` (`hero`\|`pricing`\|`footer`) | **THIS IS THE CONVERSION EVENT.** Everything before this is leading indicator; everything after is Gumroad's problem. |
| 14 | `purchase_completed` | Posted from Gumroad Ping webhook → server-side → Plausible Events API | `price_aud`, `is_gift` | The only real number. Set as Plausible **Goal** with revenue attribution. |

### Forms

| # | Event | When it fires | Properties | Why it matters |
|---|---|---|---|---|
| 15 | `dayone_form_submit` | `#dayOneForm` submit succeeds (200 from ESP) | — | Soft conversion — captures non-buyers for the 7-day Day One sequence. |
| 16 | `dayone_form_error` | Submit fails | `error_code` | Spot a broken form on launch day before it kills 50 signups. |
| 17 | `feedback_form_submit` | `#feedbackForm` submit succeeds | `rating` (1–5), `tried` | Quality signal — high ratings on Day 1 from real users = green light to spend on ads. |

### Outbound

| # | Event | When it fires | Properties | Why it matters |
|---|---|---|---|---|
| 18 | `outbound_click` | Auto-tracked by Plausible's `outbound-links` plugin | `url` | YouTube / press / mailto exits. Sanity-check footer activity. |

---

## 3. Conversion Funnel

The 4-stage funnel Jamie watches on launch day:

```
Stage 1: VISIT
  ↓  Event: page_view
  ↓  Healthy benchmark: ≥500 on launch day, ≥80% from intended source
Stage 2: ENGAGE
  ↓  Event: scroll_depth_50  (proxy for "read the moat & loop")
  ↓  Healthy benchmark: 40–60% of visits
Stage 3: INTENT
  ↓  Event: cta_click_gumroad
  ↓  Healthy benchmark: 3–8% of visits
Stage 4: PURCHASE
  ↓  Event: purchase_completed  (Gumroad webhook)
  ↓  Healthy benchmark: 1–3% of visits (Gumroad-side checkout drop is ~50–70%)
```

**Stage definitions:**
- **Visit → Engage drop** > 70% means the hero isn't landing. Action: shorten the sub-headline or rotate the orb animation.
- **Engage → Intent drop** > 95% means the pricing card or moat table isn't closing. Action: A/B the CTA copy ("Begin · AU$30" vs "Own Lifetime · AU$30").
- **Intent → Purchase drop** > 70% is a Gumroad checkout problem (price shock, country/currency confusion, payment method). Action: check Gumroad's own funnel view.

**Plausible setup:** Create a "Funnel" report with the four events above. Conversion rate auto-computes.

---

## 4. Dashboards (Build Pre-Launch)

### Dashboard 1 — Launch-Day Pulse (Plausible "Realtime" + custom view)

Live tile layout (refresh every 30s):

```
┌─────────────────────────────────────────────────────────┐
│  CURRENT VISITORS (last 5 min):     ▓▓▓▓▓▓▓▓  47       │
│  PAGE VIEWS TODAY:                            1,284     │
│  GUMROAD CLICKS TODAY:                          38      │
│  PURCHASES TODAY:                                7  →   │
│  $$  AUD TODAY:                              $210       │
├─────────────────────────────────────────────────────────┤
│  FUNNEL:  Visit → Engage → Intent → Buy                 │
│           100% →  52%  →   3.0% →  0.5%                 │
├─────────────────────────────────────────────────────────┤
│  TOP REFERRERS (today):                                 │
│  1. youtube.com               412                        │
│  2. Direct                    298                        │
│  3. news.ycombinator.com      201                        │
└─────────────────────────────────────────────────────────┘
```

Save as a **Plausible Shared Link** so Jamie can open it from his phone without logging in.

### Dashboard 2 — Daily Growth (7-day rolling)

Plausible "Top Sources" + "Goals" report, scoped to a 7-day window. Track:
- Daily visits, segmented by `utm_source` (`youtube`, `producthunt`, `email`, `direct`, `twitter`)
- `dayone_form_submit` count per day per source
- `purchase_completed` count + AUD per day per source
- **Cost per acquisition** (manual): paid-source spend ÷ purchases-from-that-source

Use this to decide each evening: "Where do I spend tomorrow's energy?"

### Dashboard 3 — Retention (D7 / D14 / D30)

RESONATE is a one-time purchase, so "retention" here means **practice retention** — did the buyer actually open the app?

Two data sources needed:
1. **PWA install events** (from `pwa_install_accepted`) → proxy for intent to return.
2. **Gumroad's "License key activated" event** (if Jamie enables license keys) → harder signal.

If the iOS app phones home for the Lyria audio stream, that's where the ground-truth retention lives — but the page copy promises "no analytics ping," so any backend retention tracking must be:
- **Opt-in only** (a "Share anonymous usage" toggle in the app settings, off by default)
- **Aggregated** (counts of sessions per day, not per-user logs)
- **Documented** in the privacy section if shipped

**If opt-in usage telemetry is built:**
- D7 retention: % of buyers who opened a session on days 1–7
- D14: % who opened in week 2
- D30: % who opened in week 4
- Mode mix: which mode (Focus / Calm / Rest) gets most sessions per buyer

**If not built (recommended for launch):** Track retention via the **post-purchase email sequence open rates** in the ESP. Crude but honest.

---

## 5. Implementation Snippets

Drop this single `<script>` block at the bottom of `resonate.html`, just before `</body>`. No libraries required — Plausible's script is already loaded in `<head>`.

```html
<script>
(function() {
  'use strict';
  if (typeof plausible !== 'function') return;

  // ───── 1. UTM capture (persist across the session) ─────
  var params = new URLSearchParams(location.search);
  var utm = {
    source: params.get('utm_source') || document.referrer.split('/')[2] || 'direct',
    campaign: params.get('utm_campaign') || '(none)'
  };

  // ───── 2. Scroll depth ─────
  var seen = { 25: false, 50: false, 90: false };
  var startedAt = Date.now();
  function timeOn() { return Math.round((Date.now() - startedAt) / 1000); }

  window.addEventListener('scroll', function() {
    var pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    [25, 50, 90].forEach(function(threshold) {
      if (!seen[threshold] && pct >= threshold) {
        seen[threshold] = true;
        plausible('scroll_depth_' + threshold, { props: { time_on_page_s: timeOn() } });
      }
    });
  }, { passive: true });

  // ───── 3. 60s dwell ─────
  setTimeout(function() { plausible('time_on_page_60s'); }, 60000);

  // ───── 4. HR slider (debounced) ─────
  var hrSlider = document.getElementById('hrSlider');
  var hrFired = false, hrTimer;
  if (hrSlider) {
    hrSlider.addEventListener('input', function() {
      clearTimeout(hrTimer);
      hrTimer = setTimeout(function() {
        if (!hrFired) {
          hrFired = true;
          plausible('hr_slider_interact', { props: { final_bpm: hrSlider.value } });
        }
      }, 2000);
    });
  }

  // ───── 5. Mode sample buttons ─────
  document.querySelectorAll('[data-mode-tone]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      plausible('mode_sample_click', { props: { mode: btn.dataset.modeTone } });
    });
  });

  // ───── 6. Breath tone play ─────
  var cohPlay = document.getElementById('cohPlay');
  if (cohPlay) {
    cohPlay.addEventListener('click', function() { plausible('breath_tone_play'); }, { once: true });
  }

  // ───── 7. FAQ opens ─────
  document.querySelectorAll('details.faq-item').forEach(function(d) {
    d.addEventListener('toggle', function() {
      if (d.open) {
        var q = d.querySelector('summary').textContent.trim().slice(0, 40);
        plausible('faq_open', { props: { question: q } });
      }
    });
  });

  // ───── 8. Hero CTA + Gumroad clicks ─────
  document.querySelectorAll('a[href="#pricing"]').forEach(function(a) {
    a.addEventListener('click', function() { plausible('cta_click_hero'); });
  });

  document.querySelectorAll('a[href*="gumroad.com"]').forEach(function(a) {
    a.addEventListener('click', function() {
      var section = a.closest('section');
      var src = section ? (section.id || 'unknown') : 'footer';
      plausible('cta_click_gumroad', { props: { source_section: src, utm_source: utm.source } });
    });
  });

  // ───── 9. Day One form ─────
  var dayOne = document.getElementById('dayOneForm');
  if (dayOne) {
    dayOne.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = dayOne.querySelector('[name="email"]').value;
      fetch('/api/dayone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, utm_source: utm.source })
      })
        .then(function(r) {
          if (r.ok) {
            plausible('dayone_form_submit', { props: { utm_source: utm.source } });
            document.getElementById('dayOneStatus').textContent = 'Day One is on its way.';
            dayOne.reset();
          } else {
            plausible('dayone_form_error', { props: { error_code: String(r.status) } });
            document.getElementById('dayOneStatus').textContent = 'Try again?';
          }
        })
        .catch(function() {
          plausible('dayone_form_error', { props: { error_code: 'network' } });
        });
    });
  }

  // ───── 10. Feedback form ─────
  var fb = document.getElementById('feedbackForm');
  if (fb) {
    fb.addEventListener('submit', function(e) {
      e.preventDefault();
      var rating = document.getElementById('ratingValue').value || '0';
      var tried = fb.querySelector('[name="tried"]').value;
      // ... POST to /api/feedback ...
      plausible('feedback_form_submit', { props: { rating: rating, tried: tried } });
      document.getElementById('feedbackStatus').textContent = 'Read by Jamie. Thank you.';
      fb.reset();
    });
  }

  // ───── 11. PWA install ─────
  window.addEventListener('beforeinstallprompt', function(e) {
    plausible('pwa_install_prompt_shown');
    e.userChoice && e.userChoice.then(function(choice) {
      if (choice.outcome === 'accepted') plausible('pwa_install_accepted');
    });
  });
})();
</script>
```

**Server-side: Gumroad → Plausible (purchase webhook)**

Gumroad Settings → Advanced → Ping → set URL to `https://rhythmixapp.com.au/api/gumroad-ping`. Endpoint forwards to Plausible Events API:

```js
// /api/gumroad-ping  (Node / Cloudflare Worker / Vercel function)
export default async function handler(req) {
  const body = await req.json();
  if (body.product_permalink !== 'resonate') return new Response('skip', { status: 200 });

  await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': req.headers.get('user-agent') || 'gumroad-ping',
      'X-Forwarded-For': body.ip_country || '0.0.0.0'
    },
    body: JSON.stringify({
      name: 'purchase_completed',
      url: 'https://rhythmixapp.com.au/resonate.html',
      domain: 'rhythmixapp.com.au',
      props: {
        price_aud: body.price / 100,
        is_gift: body.gift_receiver_email ? 'true' : 'false',
        country: body.ip_country || 'unknown'
      }
    })
  });
  return new Response('ok', { status: 200 });
}
```

In Plausible, mark `purchase_completed` as a **Goal** and set revenue currency to AUD. Funnel + revenue per source will populate automatically.

---

## 6. Pre-Launch Checklist

- [ ] Plausible script in `<head>`, domain set to `rhythmixapp.com.au`
- [ ] Tracking `<script>` block added before `</body>`
- [ ] `cta_click_gumroad`, `dayone_form_submit`, `purchase_completed`, `feedback_form_submit` marked as Plausible **Goals**
- [ ] Gumroad Ping webhook pointed at `/api/gumroad-ping`
- [ ] Shared Plausible dashboard link bookmarked on Jamie's phone home screen
- [ ] Test purchase done end-to-end (use Gumroad's test mode) — verify `purchase_completed` lands in Plausible
- [ ] Test event for each form submit + the 4 CTA paths
- [ ] UTM-tagged links prepared for YouTube description, Product Hunt, press release, email
- [ ] Disclaimer in privacy section updated to mention "anonymous, aggregated analytics via Plausible — no cookies, no personal data"

---

## 7. What Jamie Watches in the First 24h

In order of priority:

1. **Gumroad sales tab.** Hard truth. Number goes up = working.
2. **Plausible Realtime + Funnel.** `cta_click_gumroad` per hour vs. `purchase_completed` per hour. If clicks happen but no sales — Gumroad checkout problem. Open the Gumroad sales page yourself, try to buy, find the friction.
3. **`scroll_depth_50` / `page_view` ratio.** If <30%, hero is failing. Cut the orb animation or rewrite the sub-headline before hour 6.
4. **Top referrer.** Whichever source over-indexes on sales — that's where tomorrow's effort goes.
5. **`faq_open` props.** Which objection is being clicked most? If "Refunds?" is #1, price is the fear. If "Is the science actually real?" is #1, the moat copy needs more proof.
