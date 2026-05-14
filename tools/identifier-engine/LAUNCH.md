# Launch checklist — today → first paying customer

Two brands, one engine. Whisky (Drambook) launches first because the willingness-to-pay is higher. BoxSorted launches second using the same backend.

The whole list is doable from iPhone except step 5 (one-time Mac borrow OR cloud VM via GitHub Codespaces in Safari).

## Day 0 — accounts (iPhone, ~1 hour)

- [ ] Buy domain. Suggested: `drambook.com`, `whiskysnap.app`, or `dramscan.io`. Cloudflare Registrar is cheapest and integrates with Workers.
- [ ] Sign up for Cloudflare Workers — free tier covers 100k requests/day, more than enough for V1.
- [ ] Sign up for Anthropic API. Console → get an API key starting with `sk-ant-`. Add $20 of credit to start.
- [ ] Sign up for Stripe. ID verification takes 1–2 business days for payouts to your bank.
- [ ] (Optional) Sign up for Vercel or Netlify free tier to host the static landing + capture pages. Or use Cloudflare Pages — one less account.

## Day 1 — deploy the engine (30 min, needs one-time terminal access)

You need to run `wrangler` once. Three options:
1. **Borrow a Mac/PC for 30 min.** Easiest.
2. **GitHub Codespaces in Safari.** Open this repo on github.com, click `Code → Codespaces → New`. Codespaces gives you a full terminal in browser. Works on iPhone.
3. **Pay someone $20 on Upwork to do steps 1–4 below from your repo.** Fastest if you hate terminals.

### Option 2 in detail — iPhone Safari + Codespaces (recommended)

The free tier is **60 core-hours/month** for personal accounts. A full deploy is ~10 minutes of running time. You'd have to deploy 360 times a month to hit the cap. Realistic monthly use: 1–3 hours.

1. Open Safari. Go to `github.com/wiggjamie9-afk/jamie-wigg`.
2. Switch to desktop site if it loads mobile (`aA` button → Request Desktop Website). Codespaces UI is much easier on desktop layout.
3. Tap the green **Code** button → **Codespaces** tab → **Create codespace on `claude/new-session-fhZuL`**.
4. Wait 60–90 seconds. A full VS Code editor opens in Safari with a terminal at the bottom. If the terminal isn't visible: top-left hamburger menu → Terminal → New Terminal.
5. In the terminal, paste these one at a time (long-press in the terminal to paste):

```bash
cd tools/identifier-engine/engine
npm install
npx wrangler login
```

The `wrangler login` step opens a Cloudflare auth page in a new tab. Sign in / sign up. When it says "Authorized," go back to the Codespaces tab.

6. Add your secrets:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
# paste your sk-ant-... key when prompted, hit return

npx wrangler secret put IDENTIFIER_KEY
# paste any long random string (e.g. generate with: openssl rand -hex 32)
# save this somewhere — you'll need it in capture.html
```

7. Deploy:

```bash
npx wrangler deploy
```

It prints a URL like `https://identifier-engine.YOUR-SUBDOMAIN.workers.dev`. **Copy it.**

8. Verify in Safari (new tab): paste `<your-url>/health` — should return `{"ok":true,"brands":["whisky","boardgame"]}`.

9. **Stop the codespace to preserve hours**: top-right hamburger in the Codespaces UI → Codespace → Stop Current Codespace. (It also auto-stops after 30 min idle.) You can restart it any time without losing state.

### Codespaces hours — what you'd actually burn

| Action | Approx. minutes |
|---|---|
| First deploy (cold start + npm install + login + deploy) | 10 |
| Redeploy after code change | 2 |
| Editing the prompt and redeploying 5 times in a session | 15 |
| **A whole month of normal iteration** | **60–120** |
| Free tier ceiling | **3,600** (60 hours × 60 min) |

Plenty of headroom. Don't worry about it.

## Day 2 — wire the capture page (iPhone, ~20 min)

Edit `tools/identifier-engine/brands/whisky/capture.html` line ~57: replace `https://identifier-engine.YOUR-SUBDOMAIN.workers.dev/scan` with your real Worker URL. Same for `IDENTIFIER_KEY`.

Same edit for `brands/boardgame/capture.html`.

Then deploy the static pages. Easiest from iPhone:
- **Cloudflare Pages**: connect to this GitHub repo, point `Root directory` at `tools/identifier-engine/brands/whisky/`, output to your custom domain. Repeat for boardgame.
- **Or Vercel**: same flow.

## Day 3 — test it with real bottles (iPhone, ~30 min)

Open the deployed `capture.html` on your phone. Snap 5 real whisky bottles from your liquor cabinet (or a bar). Note where the model is wrong. Cases to test:
- Common (Glenfiddich 12) — should nail it
- Mid-tier (Lagavulin 16, Highland Park 18)
- Limited edition (anything with a batch number on the neck)
- Tricky label (Compass Box, independent bottlers)
- Deliberate fail case (cover the label) — should return `needs_more_photos: true`

If accuracy is bad, the fix is in `brands/whisky/system.js` — adjust the prompt. Iterate 3-5 times.

## Day 4 — Stripe checkout (~2 hours, not yet scaffolded)

Two endpoints to add to the Worker (next coding session):
- `POST /checkout` — creates a Stripe Checkout Session for `$9.99/mo` (whisky) or one-time `$0.99 / $7.99 / $29` (boardgame). Returns the checkout URL.
- `POST /webhook` — Stripe webhook for `customer.subscription.created` and `checkout.session.completed`. Writes the customer to Cloudflare KV (or Durable Objects) with their scan quota.

Then update worker.js's `fetch` handler to read the customer ID from a signed cookie + check quota in KV before calling Anthropic. **This is the next coding session.**

## Day 5 — launch (free)

- [ ] Post one demo video to your TikTok and Instagram, using HyperFrames to render it. 15 seconds: "I scanned my whisky shelf and this is what came back." Show your phone screen.
- [ ] Submit to BetaList, Product Hunt scheduled for the following Tuesday.
- [ ] Post in r/whisky and r/Scotch with "I built a thing, here's a free trial" — moderators are strict, lead with value not pitch.
- [ ] Email 10 whisky bar owners locally with a free month code.

## Realistic expectations

- **Week 1**: 50–200 free scans. 0–5 conversions. Mostly bug reports.
- **Month 1**: $50–500 MRR if accuracy is solid and you posted on TikTok consistently.
- **Month 3**: $1k–5k MRR if you've iterated on the prompt and DB and shipped 4+ TikTok demo videos.
- **Month 6**: $5–15k MRR is realistic for a niche tool at this price point with this audience.

The killer skill isn't building — it's posting demo videos every day. The product itself is 20% of the job.

## What kills this

- Accuracy stays below 70% on common bottles → people refund. Fix the prompt.
- The model hallucinates auction prices → someone bids on a fake and blames you. Add bigger warnings, never claim authenticity.
- No one finds the site → marketing is the actual job, not coding. Schedule the TikTok posts before launching.
