# Codex of Reality — Email Sequence

The email-capture follow-up promised in `specs/codex-app/requirements.md` R8.

Triggered when a visitor hits the landing page, doesn't purchase, and leaves their email through either the exit-intent modal or the footer form. The sequence runs the prospect from "curious tourist" to "founding member" over 14 days, with a clean exit at day 14.

## Files

| Send | File | Trigger | Goal |
|---|---|---|---|
| Day 0 (5 min) | `01-welcome-starter-protocol.md` | email captured | deliver promised starter protocol; condition expectation of pattern (real mechanism + lineage frame) |
| Day 2 | `02-day-2-tesla-codex.md` | day 0 sent | reveal the Tesla Codex vertical as the brand wrapper around the practice |
| Day 5 | `03-day-5-founding-offer.md` | day 2 sent | first hard pitch on the AU$30 founding tier; lifetime framing |
| Day 14 | `04-day-14-last-call.md` | day 5 sent, not converted | last call before founding cap closes; price ladder reveal |

Exits the sequence on purchase via webhook (Stripe `checkout.session.completed` → mark user as `converted`, suppress remaining sends).

## Voice

Same brand voice as the landing page and the TikTok narration. Reference: `sites/codex-of-reality/styleguide.md` and `launch-kit/codex/clips-60s-pitch/narration.txt`.

- Decisive sentences. No hedging.
- Numbers as receipts (AU$249, AU$99/yr, AU$30 once).
- "Practice, not a treatment." No medical claims, ever.
- Lineage references are mythology; mechanism references are clinical. Both, separately, in every email.
- One CTA per email. No multi-link clutter.

## Delivery

Tool: any transactional provider with sequence scheduling (Postmark + a simple delay queue, Resend Audiences, or ConvertKit if the buyer wants drag-and-drop). The files are plain markdown — the subject line is the first H1, body is everything below.

## Variables

Templates use `{{first_name}}` (optional, blank-safe), `{{starter_protocol_url}}`, and `{{founding_link}}`. Leave brackets in if a variable is missing — the sequence reads fine without them.
