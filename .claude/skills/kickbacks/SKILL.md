---
name: kickbacks
version: 1.0.0
description: |
  Monetize the thinking spinner in Claude Code and Codex. Turn idle UI real estate
  into sponsored ad slots. English-ascending auction, up to 50% revenue share, 
  real-time balance tracking. Passive income while you code.
compatibility: claude-code codex vscode
license: Proprietary (source-available)
---

# Kickbacks — Monetize Your IDE Thinking Time

Turn the AI thinking spinner into an ad slot. Passive income while Claude thinks.

## Why Kickbacks?

### The Opportunity

When Claude Code or Codex is thinking, it shows a verb ("Discombobulating…", "Baking…", "Percolating…"). That's prime real estate doing nothing.

**Kickbacks turns it into a tiny, tasteful, sponsored ad slot.**

- No surveys
- No crypto
- No "watch this video"
- Just keep coding, and your balance ticks up

```
- ✶ Discombobulating… (esc to interrupt)
+ ✶ Linear — issue tracking that's actually fast ↗ (esc to interrupt)
```

### The Economics

- **Advertisers:** Buy attention from the most technical audience on earth
- **Developers:** Up to 50% of ad revenue, credited per impression + click
- **Real-time tracking:** Balance visible in status bar (Today / Month / Lifetime)

---

## How It Works

### Four Ad Surfaces

| Surface | Where | Show In |
|---|---|---|
| **Spinner overlay** | Claude Code VS Code panel | Think overlay |
| **Thinking-shimmer** | Codex VS Code panel | Think overlay |
| **Status-bar line** | Claude Code terminal CLI | CLI status bar |
| **Spinner verb** | Claude Code terminal CLI | Thinking verb line |

Works on:
- Local VS Code
- Remote-SSH
- Dev containers
- code-server

### Revenue Model

**Impressions:**
- 1 block = 1,000 five-second impressions
- Advertisers bid per block
- English-ascending auction decides placement

**Clicks:**
- Clicks worth 50× an impression
- Tracked in real-time
- Counted toward balance

**Revenue Share:**
- Up to 50% of ad revenue accrues to developer
- Who rendered the ad gets the credit
- Automatic, per impression + per click

---

## Installation

### Quick Start

1. **Install from VS Code Marketplace**
   ```
   Search "Kickbacks" in Extensions
   Click Install
   ```

2. **Sign In**
   - Click "Kickbacks: Sign in" in status bar
   - Authenticate with Google
   - Done

3. **Start Earning**
   - Earnings start immediately
   - Check status bar for balance
   - View full ledger at kickbacks.ai

### What Gets Installed

```
src/
  adapters/        per-tool injection (claude-code, codex, claude-cli, codex-cli)
  activation/      lifecycle: ad rotation, self-update, status bar, injection
  auth/            sign-in + OS-keychain-sealed token vault
  metrics/         impression / view-threshold / click telemetry (idempotent)
  viewTracking/    "was it actually on screen long enough?" timer
  killswitch/      server-controlled global off-switch
media/             logos + icons
test/              vitest suite (editor-safety net)
```

---

## For Developers (You)

### Earnings Tracking

**Status Bar:**
```
Kickbacks  ($0.42 today · $7.11)
```

Shows:
- Today's earnings
- This month's earnings
- Lifetime balance

### Full Ledger

Visit **kickbacks.ai** to see:
- Impression count
- Click count
- Revenue per advertiser
- Payout schedule

### Safety Guarantees

- **Nothing breaks** — Older CLIs keep stock verbs if Kickbacks unavailable
- **Transparent code** — Public mirror (read-only) on GitHub
- **Sealed token vault** — Credentials stored in OS keychain, not readable
- **Idempotent telemetry** — Impressions counted safely, no double-counting

---

## For Advertisers

### How to Buy

1. Visit **kickbacks.ai**
2. Set bid per block (1,000 impressions)
3. Upload ad creative (single line, text + optional link)
4. Set budget (blocks purchased)
5. Go live

### Audience

- Most technical people on earth
- Using Claude Code / Codex
- While actively thinking + coding
- Calm, non-intrusive format

### Pricing

Bids set by English-ascending auction. Developers see up to 50%, so effective CPM depends on demand.

**Example:**
- You bid $2 per 1,000 impressions (standard impression CPM)
- Developer keeps $1
- Kickbacks takes $1
- Your ad shows to the highest bidders first

---

## Examples

### Good Ad Copy (One Line)

```
Linear — issue tracking that's actually fast
GitHub Copilot — code suggestions while you think
Stripe — payments API for every language
Vercel — deploy instantly, no config
```

### Ad with Link

```
Arc Browser — 70% faster, works everywhere ↗
```

(Link navigates to landing page on click)

### What NOT to Do

- Don't use pop-ups or overlays (ad is the overlay)
- Don't use animated GIFs (text only, one line)
- Don't ask for surveys or data
- Don't link to signup/paywall (drive clicks, not friction)

---

## Integration with Claude Ecosystem

### Use Case: Monetize Your Tools

If you've built custom Claude Code skills or extensions:

```
Add Kickbacks
    ↓
Users install your extension + Kickbacks
    ↓
Your extension earns while users think
    ↓
Up to 50% revenue share
```

### Example: Plan Enforcer Extension

You build a `/plan-enforcer` extension that hooks into Claude Code's thinking phase.

```
Before: Plan Enforcer thinking…
After:  Plan Enforcer — Linear (issue tracking) ↗
```

Each thinking moment = impression → revenue.

### Real-World Scenario

1. Ecosystem user installs Kickbacks
2. Develops with `/plan-enforcer`, `/spec-writer`, `/scope-reviewer`
3. Each think phase shows an ad
4. Developer earns $0.001-0.005 per impression
5. If 100 thinking moments per day: $0.10-0.50/day
6. At scale (1000 devs): $100-500/day collective

---

## Earnings Potential

### Conservative Estimate

- **Thinking events per day:** 20-50 (average developer)
- **Impression rate:** 50% of thinking events become impressions
- **CPM equivalent:** $0.001-0.005 per impression (500+ impressions needed for $1)
- **Daily earnings:** $0.05-0.25/day
- **Monthly:** $1.50-7.50/month

### Optimistic Estimate (Power Users)

- **Thinking events per day:** 100+
- **Impression rate:** 80%
- **High-demand ads:** $0.01+ per impression
- **Daily earnings:** $0.80-1.20/day
- **Monthly:** $24-36/month

### At Ecosystem Scale

If 100 users adopt → $150-750/month collective
If 1,000 users adopt → $1,500-7,500/month collective

---

## FAQ

### How is my privacy protected?

- **No personal data collected** — Only impression + click counts
- **Token sealed in OS keychain** — Not readable, not logged
- **Telemetry is idempotent** — No double-counting, no tracking you personally
- **Open-source code review** — Public mirror lets you audit what runs

### Can I turn off ads?

Not currently, but:
- Extension can be uninstalled anytime
- Older Claude Code versions show stock verbs (ads only on 2.1.143+)
- Server-controlled killswitch lets Kickbacks stop ads if needed

### What if I don't see ads?

Possible reasons:
- Claude Code version <2.1.143 (upgrade to see ads)
- Codex not running (ads need active thinking)
- Network issue (killswitch activated, check kickbacks.ai status)
- Ad auction has no current bids (rare)

### How often do ads rotate?

Every 5 seconds of thinking (or when thinking ends, whichever is first). New ad selected from active bids via auction.

### Can I see what ads are showing?

Visit kickbacks.ai → Dashboard → Ad History. See all impressions + clicks + revenue per ad.

### Is this a crypto thing?

No. Real currency, real auction, real payments. Payouts via Stripe.

---

## Getting Started

### Step 1: Install

VS Code Marketplace → Search "Kickbacks" → Install

### Step 2: Sign In

Status bar → "Kickbacks: Sign in" → Google auth → Done

### Step 3: Watch Earnings

Status bar shows: `Kickbacks ($X.XX today · $Y.YY)`

### Step 4: Advertise (Optional)

kickbacks.ai → "Buy inventory" → Set bid + creative → Go live

---

## Transparency & Safety

### Code Audit

The extension code is public (read-only mirror) so you can:
- Audit what runs on your machine
- Verify telemetry is safe
- Check that no data is stolen

### Killswitch

Kickbacks team can disable ads server-side if:
- Ads become intrusive
- Revenue model breaks
- Security issue discovered

### Payment Guarantee

Payouts are automatic + guaranteed. If Kickbacks shuts down, final payouts within 30 days.

---

## Contact

- **Install:** VS Code Marketplace
- **Advertise:** kickbacks.ai
- **Support:** support@kickbacks.ai
- **Status:** kickbacks.ai/status

---

**Kickbacks:** Earn while you think.
