# Campaign Consistency Audit — Landing Pages × Launch Kit

Scope: 6 landing pages (resonate, dreams, live, hum, rhythmix, index) cross-checked against the new campaign assets in `launch-kit/{resonate,dreams,live,hum}/`, `launch-kit/distribution/`, `launch-kit/seo/`, plus `STRATEGIC-ALIGNMENT.md` and `BRAND-VOICE-AUDIT.md`. Auditor pass date: 2026-05-21.

## Summary

The product-tier silos (RESONATE, DREAMS, HUM, LIVE) are internally coherent: the AU$30 lifetime story and the LIVE freemium story each hold up on their own page. The drift is concentrated at the **umbrella layer** — `index.html` and `rhythmix.html` present two completely incompatible pictures of what RHYTHMIX is (single-purpose $149 music-video tool vs. four-pillar $9/$19/$49/mo SaaS with a $149 lifetime add-on), and `launch-kit/seo/best-ai-music-tools-2026.md` invents a third pricing model ($29/$79/mo + $149 lifetime) that exists nowhere else. The 4-pillar promise is also leaking onto product-level pages (LIVE press release names LIVE as "the Earn pillar"), and `STRATEGIC-ALIGNMENT.md`'s Q2/Q3/Q4 2026 roadmap is contradicted by `hackernews-show.md` which adds a "Generation pillar (Q2 2026)" that isn't in the alignment doc. Press contact is split: RESONATE + DREAMS press releases use `press@rhythmixapp.com.au`, but LIVE + HUM press releases use `wiggjamie9@gmail.com`. Net: 17 drift items, 5 high-severity (4 umbrella-pricing/scope, 1 product-page subsection).

## Drift findings

### 1. Umbrella pricing — `index.html` and `rhythmix.html` ship two different RHYTHMIX products. (HIGH)
- Source A: `/home/user/jamie-wigg/index.html:6-7`
- Current text: `<title>RHYTHMIX — Turn any track into a cinematic AI music video</title>` / `<meta name="description" content="Drop in your MP3. Get a beat-synced, AI-generated music video built from Kling, Hunyuan, Luma and MiniMax. $149 once. Lifetime updates.">`. Pricing strip lines 188–189 lists `$0 Free Mode · $149 Lifetime`. No subscription tiers.
- Source B: `/home/user/jamie-wigg/rhythmix.html:493, 508, 524, 541, 568`
- Current text: Free `$0` / Starter `$9/mo` / Pro `$19/mo` / Studio `$49/mo` + a separate `$149` lifetime card billed as "RHYTHMIX Studio forever, all 22 AI features, unlimited credits". Counter widget claims `Only 47 spots left`.
- Drift: These are two different products under one brand. `index.html` is the "AI music video studio" (single use case, single price). `rhythmix.html` is the "world's most complete AI music platform" with four monthly tiers AND a lifetime. A user landing on `/` then clicking through to `/rhythmix.html` will see incompatible offers.
- Suggested fix: pick one umbrella shape. If the truth is "music-video tool today, four pillars across 2026" (per `STRATEGIC-ALIGNMENT.md` line 19), then `rhythmix.html` needs to be retired or rewritten — the $9/$19/$49 tiers describe a product that doesn't ship.
- Severity: **high**.

### 2. Umbrella pricing — `launch-kit/seo/best-ai-music-tools-2026.md` invents a third pricing model. (HIGH)
- Source: `/home/user/jamie-wigg/launch-kit/seo/best-ai-music-tools-2026.md:88, 112, 128, 134`
- Current text: line 88 "Standalone LIVE access is **$19/month with a 4-video monthly cap**". Line 112 "Creator at **$29/month** (10 tracks/month, full distribution), Studio at **$79/month** (unlimited tracks, LIVE videos, label tools), Lifetime at **$149 one-time** (Creator tier forever, 1,200 lifetime credits)". Line 128 comparison table "$29-79/mo or $149 lifetime".
- Drift: $29/$79 tiers and "Creator/Studio" naming exist nowhere else. The brief's stated umbrella shape is `AU$149 lifetime`; `rhythmix.html` has $9/$19/$49 (not $29/$79). LIVE's actual cap on the product page is 10 videos/mo on Pro, not 4 (`live.html:641`).
- Suggested fix: rewrite the RHYTHMIX listings (lines 82–128) to match the resolved umbrella shape from `STRATEGIC-ALIGNMENT.md` (AU$149 lifetime, music-video pipeline ships today, roadmap across 2026). Update the LIVE row to "10 videos/mo Pro · $19" or "1 video/mo Free, 10/mo Pro, unlimited Studio".
- Severity: **high**.

### 3. Umbrella pricing — `rhythmix.html` "47 spots left" counter conflicts with `STRATEGIC-ALIGNMENT.md` framing. (HIGH)
- Source: `/home/user/jamie-wigg/rhythmix.html:572-578`
- Current text: `Only 47 spots left` plus a live countdown timer (`11 HOURS 47 MINS 00 SECS`).
- Drift: `STRATEGIC-ALIGNMENT.md` positions AU$149 as "founding-member entry to the full roadmap" — open-ended, not a 47-spot scarcity drop. None of the launch-kit docs reference a 47-seat cap. `newsletter.md:66` uses `founding-100 only` for the **bundle**, not the lifetime.
- Suggested fix: either remove the spot counter, or align it with `founding-100` framing used in `dreams/email-sequence.md`, `resonate/email-sequence.md`, and `newsletter.md` — and surface that cap in the launch-kit so the asset matches.
- Severity: **high**.

### 4. Product-vs-umbrella scope — LIVE press release calls LIVE "the Earn pillar". (HIGH)
- Source: `/home/user/jamie-wigg/launch-kit/live/press-release.md:25`
- Current text: "RHYTHMIX LIVE is the second product in the RHYTHMIX line, following the AU$149 lifetime RHYTHMIX platform launched earlier in 2026. The two products share the company's four-pillar model — Generate, Master, Distribute, Earn — with LIVE owning the video-and-merch surface of the Earn pillar."
- Drift: per `STRATEGIC-ALIGNMENT.md:48`, LIVE is "its own standalone product at its own price (... subscription for LIVE)" — not the Earn pillar of the umbrella. Per the same doc, Earn is a Q4 2026 roadmap item on the umbrella platform. Calling LIVE the Earn pillar collapses the umbrella's roadmap into a launched product.
- Suggested fix: replace line 25 with "RHYTHMIX LIVE is the second product in the RHYTHMIX line, following the AU$149 lifetime RHYTHMIX platform launched earlier in 2026. LIVE is a standalone music-video subscription, not part of the umbrella's four-pillar roadmap." or drop the pillar-mapping sentence entirely.
- Severity: **high**.

### 5. Roadmap dates — `hackernews-show.md` adds a fifth "Generation pillar (Q2 2026)" not in STRATEGIC-ALIGNMENT.md. (HIGH)
- Source: `/home/user/jamie-wigg/launch-kit/distribution/hackernews-show.md:20-23`
- Current text: lists four roadmap items — `Generation pillar (Q2 2026)`, `Mastering pillar (Q2 2026)`, `Distribution pillar (Q3 2026)`, `Earn pillar (Q4 2026)`.
- Drift: `STRATEGIC-ALIGNMENT.md:21` and `rhythmix/gumroad-listing.md:85-87` agree on three roadmap pillars — Master Q2, Distribute Q3, Earn Q4. The "Generation pillar (Q2 2026)" is new. The shipped-today pillar is Generate (per gumroad listing line 83) — adding a "Q2 2026 Generation pillar" implies the live product isn't actually Generate, which contradicts the day-1 framing.
- Suggested fix: drop the Generation row from `hackernews-show.md:20` or relabel it as "Generation v2 — text-to-song" if that's the intent. Keep the three-pillar roadmap consistent with the gumroad listing.
- Severity: **high**.

### 6. Press contact — LIVE + HUM press releases don't use `press@rhythmixapp.com.au`. (MED)
- Source A: `/home/user/jamie-wigg/launch-kit/live/press-release.md:35-37`
- Current text: `Jamie Wigg, founder / wiggjamie9@gmail.com / rhythmixapp.com.au/live`
- Source B: `/home/user/jamie-wigg/launch-kit/hum/press-release.md:33-36`
- Current text: `Jamie Wigg / Founder, HUM / wiggjamie9@gmail.com / rhythmixapp.com.au/hum`
- Drift: RESONATE (`resonate/press-release.md:35`) and DREAMS (`dreams/press-release.md:41`) use `press@rhythmixapp.com.au`. LIVE and HUM still route press to the founder's personal Gmail. `LAUNCH-KIT-INDEX.md:125` lists "Press release contact email `press@rhythmixapp.com.au` → set up the mailbox" as a launch dependency.
- Suggested fix: update LIVE and HUM press releases to use `press@rhythmixapp.com.au` and add `Founder enquiries: wiggjamie9@gmail.com` as a secondary line if useful.
- Severity: **medium**.

### 7. LIVE pricing — landing page mixes AU$ and USD; press release says USD. (MED)
- Source A: `/home/user/jamie-wigg/live.html:624` — `<small>AU$</small>0` for Free tier.
- Source B: `/home/user/jamie-wigg/live.html:639, 654` — `<small>$</small>19` / `<small>$</small>49` (no AU$ prefix).
- Source C: `/home/user/jamie-wigg/live.html:668` — footnote "All prices · USD · monthly · Stripe".
- Source D: `/home/user/jamie-wigg/launch-kit/live/press-release.md:11` — "Pro at USD $19 per month, and Studio at USD $49 per month".
- Drift: Free is in AU$ (locally), Pro/Studio are in USD, and the page mixes both glyph treatments. A reader who clocks the AU$0 Free tier will assume the $19/$49 are also AU$.
- Suggested fix: standardise to USD on `live.html` ("US$0 · forever · 1 video / month" and "US$19", "US$49") and remove the AU$ on Free. Update `live/email-sequence.md:9` ("for the price of a coffee") if currency matters there.
- Severity: **medium**.

### 8. Hook line — DREAMS landing page hook ≠ press release / PH hook. (MED)
- Source A: `/home/user/jamie-wigg/dreams.html:314-318` — H1 "Compose your night."
- Source B: `/home/user/jamie-wigg/launch-kit/dreams/press-release.md:9` (lede headline) — uses "Compose your night" framing but PH primary tagline at `dreams/producthunt.md:10` is "Compose your night. AU$30 once. Sleep ritual, lifetime."
- Source C: `/home/user/jamie-wigg/launch-kit/dreams/email-sequence.md:19-20` — Subjects "The ritual you didn't know you needed" / "Something new — for the night". Neither uses "Compose your night."
- Drift: The hook "Compose your night" is locked on the landing page and PH, but the first email — which is the cold-open warm-up — doesn't carry it. The hook should anchor email 1.
- Suggested fix: rewrite Email 1 Subject A to "Compose your night — something new for after dark" or similar; the locked hook must lead the cold list.
- Severity: **medium**.

### 9. Hook line — LIVE BRAND.md says the locked hook is "Now what?" but the landing page H1 drops it. (MED)
- Source A: `/home/user/jamie-wigg/live.html:363-366` — H1 "Made the song. / Now make the moment."
- Source B: `BRAND-VOICE-AUDIT.md:25-28` — already flagged in v1: "LIVE BRAND.md tone lists 'now what' as on-brand … pitch clip replaces it with a softer, almost wellness-adjacent line." The audit suggested `Made the song. Now what? RHYTHMIX LIVE.`
- Drift: The landing page itself ships the softened "Now make the moment" hook, not just the narration. So the brand-voice audit's recommended fix (item 3) hasn't been propagated to `live.html` or to the `<title>` (`live.html:6`).
- Suggested fix: decide if the locked hook is "Now what?" (BRAND.md / narration) or "Now make the moment" (landing page + PH backup variant at `live/producthunt.md:43`). Pick one; update the other surfaces.
- Severity: **medium**.

### 10. Hook line — HUM landing has two competing hero hooks. (MED)
- Source A: `/home/user/jamie-wigg/hum.html:736` — cover hero `HUM. A practice.`
- Source B: `/home/user/jamie-wigg/hum.html:774` — Today screen hero `Hum yourself back into rhythm.`
- Source C: `/home/user/jamie-wigg/launch-kit/hum/producthunt.md:10` — PH tagline `A 90-second daily hum. AU$30 once. Yours forever.`
- Source D: `/home/user/jamie-wigg/launch-kit/hum/press-release.md:9` — headline `HUM launches lifetime humming practice grounded in vagus-nerve research`.
- Drift: No single line carries across landing → PH → press → email. The closest to a brand-locked hook is "Hum yourself back into rhythm" — but the cover, PH, and press release each use different framing.
- Suggested fix: lock "Hum yourself back into rhythm." as the brand hook; ensure cover (`hum.html:736`), PH tagline, and press-release deck/headline all reference it directly.
- Severity: **medium**.

### 11. Founding-tier naming — three different forms across product line. (MED)
- Source A: `/home/user/jamie-wigg/launch-kit/resonate/email-sequence.md:4, 130` — "founding-100"
- Source B: `/home/user/jamie-wigg/launch-kit/dreams/email-sequence.md:8, 105, 135, 157` — "founding tier" (no cap number)
- Source C: `/home/user/jamie-wigg/launch-kit/hum/email-sequence.md:54, 68, 97, 105` — "founding tier" / "founding members"
- Source D: `/home/user/jamie-wigg/dreams.html:682` — "founding-100 is yours"
- Source E: `/home/user/jamie-wigg/resonate.html:652` — "founding-100 invite is yours"
- Source F: `/home/user/jamie-wigg/launch-kit/distribution/newsletter.md:66` — "founding-100 only" (bundle)
- Drift: RESONATE and the umbrella bundle commit to a hard 100-seat founding cohort. DREAMS and HUM use the same "founding tier" language but never name the cap. If the cap is 100 across all four products, the DREAMS + HUM email sequences should say so. If it's only for RESONATE + the bundle, the landing-page line in `dreams.html:682` is incorrect.
- Suggested fix: decide. Either (a) all four products have a founding-100 cap, in which case update DREAMS/HUM emails and Gumroad listings; or (b) only RESONATE + bundle do, in which case fix `dreams.html:682` to say "founding tier".
- Severity: **medium**.

### 12. Date contradiction — `STRATEGIC-ALIGNMENT.md` and `reddit-posts.md` disagree on RHYTHMIX public-release timing. (MED)
- Source A: `/home/user/jamie-wigg/launch-kit/distribution/launch-week-calendar.md:3` — "T+0 = Mon 2026-06-08" (launch in <3 weeks from audit date 2026-05-21).
- Source B: `/home/user/jamie-wigg/launch-kit/distribution/reddit-posts.md:135, 226` — "MVP is in private beta with around 40 producers right now, public release is targeted for **Q3 2026**" / "Waitlist open, private beta with around 40 producers, public release Q3 2026."
- Drift: The launch calendar says launch is June 8, 2026 (Q2). The Reddit-posts file says public release is Q3 2026. These are mutually exclusive unless one refers to the umbrella platform and the other to the music-video tool, but neither qualifies the scope.
- Suggested fix: clarify in `reddit-posts.md` lines 135 and 226 which product is Q3 2026 (probably the four-pillar platform per `STRATEGIC-ALIGNMENT.md`) — and reaffirm that the music-video tool ships T+0 June 8.
- Severity: **medium**.

### 13. CTA URL — DREAMS press release uses `/dreams`, landing page is `/dreams.html`. (LOW)
- Source A: `/home/user/jamie-wigg/launch-kit/dreams/press-release.md:43` — `https://rhythmixapp.com.au/dreams`
- Source B: `/home/user/jamie-wigg/dreams.html:20` — `<link rel="canonical" href="https://rhythmixapp.com.au/dreams.html" />`
- Drift: Press release and most launch-kit assets use the clean `/dreams` slug; canonical URL on the landing page is the `.html` form. Either one is fine — but the canonical needs to redirect cleanly or both need to match.
- Suggested fix: confirm `/dreams` redirects to `/dreams.html` server-side, or update the canonical to `/dreams` and serve the HTML at that path. Same review for `/resonate`, `/live`, `/hum`.
- Severity: **low**.

### 14. Pillar leak — competitor SEO pages assume umbrella has all 4 pillars today. (MED)
- Source A: `/home/user/jamie-wigg/launch-kit/seo/rhythmix-vs-suno.md:17, 27, 37, 46` — "RHYTHMIX … runs it through an AI mastering chain, ships the finished master to 40+ streaming platforms … and gives the artist a royalty-split engine, a merch pipeline, fan-investment tools, and an Artist DNA model".
- Source B: `/home/user/jamie-wigg/launch-kit/seo/rhythmix-vs-udio.md:49-51, 67, 127` — "the four pillars are Generate · Master · Distribute · Earn".
- Source C: `/home/user/jamie-wigg/launch-kit/seo/rhythmix-vs-landr.md:58, 64, 66` — claims RHYTHMIX ships mastering, 40+ stores, merch print-on-demand, royalty splits, fan investment.
- Drift: These three SEO pages describe the four-pillar platform as if it's the day-1 product. `STRATEGIC-ALIGNMENT.md:42` explicitly flags `rhythmix-vs-suno.md`, `-vs-udio.md`, `-vs-landr.md` as needing a "what ships day-1 / what's on the roadmap" footer. That footer has not been added.
- Suggested fix: add the 1-sentence "today / 2026 roadmap" caveat at the foot of each of the three competitor comparison pages, as `STRATEGIC-ALIGNMENT.md:42` specifies.
- Severity: **medium**.

### 15. Brand-voice drift — DREAMS landing page uses "Nothing is sent anywhere" (not the canonical "kept on this device"). (LOW)
- Source: `/home/user/jamie-wigg/dreams.html:339` — "Nothing is sent anywhere."
- Drift: `BRAND-VOICE-AUDIT.md:55-58` already flagged a related drift in the DREAMS narration ("Nothing leaves the device" vs canonical "Kept on this device"). The landing page introduces a third variant — "Nothing is sent anywhere" — at the layer-one description.
- Suggested fix: replace with "Kept on this device." to lock the family canonical phrase per the brand audit recommendation.
- Severity: **low**.

### 16. Brand-voice drift — `dreams.html` H1 splits "your" onto its own line, breaks rhythm with PH tagline. (LOW)
- Source: `/home/user/jamie-wigg/dreams.html:314-318`
- Current text: `<h1><span class="line">Compose</span><span class="line italic-gold serif">your</span><span class="line">night.</span></h1>` — three lines, with "your" floated as the italic-gold middle.
- Drift: PH tagline (`dreams/producthunt.md:10`) is "Compose your night. AU$30 once." — one tight phrase. The HTML break treats "your" as a hero word, which doesn't match the "compose your night" cadence the press release leans on.
- Suggested fix: either keep the 3-line typography but lock the same reading in PH/press/email, or collapse to "Compose your night." as a single phrase.
- Severity: **low**.

### 17. Press contact missing entirely on RHYTHMIX umbrella pages. (LOW)
- Source A: `/home/user/jamie-wigg/index.html:269-280` — no press contact in footer.
- Source B: `/home/user/jamie-wigg/rhythmix.html:626-643` — no press contact in footer or anywhere on the page (search for `press@` returns no hits in this file).
- Drift: Per `LAUNCH-KIT-INDEX.md:125`, `press@rhythmixapp.com.au` should be live for launch. The four product pages reference it (RESONATE 765, 783; LIVE 783, 790; DREAMS 802, 837; HUM 1143). The umbrella pages do not.
- Suggested fix: add `Press: press@rhythmixapp.com.au` to the footers of `index.html` and `rhythmix.html`.
- Severity: **low**.

## Recommendations

1. **Resolve the umbrella collision (highest priority, blocks launch).** Decide which of `index.html` / `rhythmix.html` is the canonical umbrella page, retire or rewrite the other, and align `launch-kit/seo/best-ai-music-tools-2026.md` to whichever survives. Until this is fixed, a user clicking through `rhythmixapp.com.au` → product page → competitor SEO page sees three different pricing structures and three different product descriptions.

2. **Lock the umbrella roadmap to three pillars across one doc.** `STRATEGIC-ALIGNMENT.md` says Master Q2, Distribute Q3, Earn Q4. `rhythmix/gumroad-listing.md` matches. `hackernews-show.md` invents a fourth "Generation Q2" item that contradicts day-1 framing. Edit `hackernews-show.md:20` to remove or relabel the Generation row.

3. **Standardise the press contact.** Update `live/press-release.md:35-37` and `hum/press-release.md:33-36` to `press@rhythmixapp.com.au`. Add the address to the umbrella page footers. Then propagate that mailbox to `LAUNCH-KIT-INDEX.md`'s pre-launch checklist as complete.

4. **Lock one hook line per product and use it verbatim across landing + PH + press + email Subject A.** Per `BRAND-VOICE-AUDIT.md` rec #5, this discipline is missing — DREAMS, LIVE, and HUM each carry 2–3 competing hooks. The cheapest fix is a 4-row table (Product / Landing H1 / PH tagline / Press lede / Email 1 Subject) with one phrase per row.

5. **Add the day-1-vs-roadmap caveat to the three competitor SEO pages.** `STRATEGIC-ALIGNMENT.md:42` already specifies this; the edits haven't been made. One sentence per file, at the foot, of the form: "Day-1 scope: cinematic music-video pipeline. Master, Distribute, and Earn pillars ship across 2026 — included in the AU$149 lifetime."
