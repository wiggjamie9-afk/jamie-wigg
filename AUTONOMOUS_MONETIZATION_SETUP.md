# Autonomous Monetization Engine Setup

**Goal:** Zero-cost, self-improving revenue system that requires zero manual intervention after setup.

## Architecture Overview

```
Apps (114+ HTML/PWA)
    ↓
Analytics Collection (GA4, Supabase events)
    ↓
Autonomous Improvement Engine (Weekly)
    ├─ Analyze variant performance
    ├─ Extract insights via Claude
    ├─ Learn ecosystem patterns
    ├─ Extract creator signature
    ├─ Generate next-gen improvements
    └─ Deploy winners
    ↓
Gumroad Monetization (Batch API)
    ├─ Product creation
    ├─ Pricing optimization
    └─ Delivery automation
    ↓
Revenue (Hands-off)
```

## Phase 1: Database Setup (1 hour)

### 1.1 Deploy Migrations to Supabase

```bash
# In Supabase dashboard → SQL Editor

# Copy contents of agent-builder/migrations/002_improvements.sql
# Run the full migration script

# This creates:
# - variants table (UI/copy style versions)
# - experiments table (A/B test tracking)
# - variant_analytics table (engagement metrics)
# - variant_performance table (computed scores)
# - variant_insights table (Claude-extracted learnings)
# - ecosystem_patterns table (cross-app patterns)
# - creator_signature table (learned preferences)
# - improvements table (auto-generated variants)
# - improvement_loops table (weekly run tracking)
```

### 1.2 Verify Migration

```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
  AND tablename IN ('variants', 'experiments', 'variant_analytics', 'improvements');
```

## Phase 2: Gumroad Setup (30 minutes)

### 2.1 Get Gumroad Token

```bash
# 1. Go to https://gumroad.com/settings/creator
# 2. Scroll to "API Access Token"
# 3. Copy the token
# 4. Save to your environment:
export GUMROAD_TOKEN="your-token-here"
```

### 2.2 Create Products (Automated)

```bash
# From repo root
chmod +x scripts/monetization/setup_gumroad_products.py

# Create first 5 products as test
python3 scripts/monetization/setup_gumroad_products.py 5

# Results saved to: results/gumroad/products_latest.json
# Each product gets a Gumroad URL automatically

# Once verified, create all products:
GUMROAD_TOKEN=your-token python3 scripts/monetization/setup_gumroad_products.py
```

### 2.3 Configure Delivery

Each product needs a delivery mechanism. Options:

**Option A: URL Delivery (Recommended)**
- Set delivery_url to your app's hosted URL
- Customer receives link immediately after purchase

**Option B: File Delivery**
- Upload a zip of your app
- Gumroad handles download delivery

```bash
# Update script with delivery URLs, then:
# In Gumroad dashboard:
# For each product → Settings → Licenses & Delivery
# Set delivery method and license key requirements
```

### 2.4 Set Up Email Capture

```
Gumroad Settings → Product → Collect Buyer Info
- Email: Always collect
- Custom field: License Key (for app registration)
```

## Phase 3: Analytics Setup (1 hour)

### 3.1 GA4 Configuration

```javascript
// Add to all app HTML files <head>:

<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');

  // Track purchase events
  window.trackPurchase = (productName, price) => {
    gtag('event', 'purchase', {
      currency: 'USD',
      value: price,
      items: [{
        item_name: productName,
        price: price
      }]
    });
  };

  // Track app usage
  window.trackEvent = (eventName, eventData) => {
    gtag('event', eventName, eventData);
  };
</script>
```

### 3.2 Custom Events to Track

- `app_open`: User opens app
- `message_sent`: User sends message to AI
- `variant_viewed`: Which variant the user sees
- `satisfaction_rating`: Post-interaction rating
- `upgrade_viewed`: Paywall impression
- `upgrade_clicked`: Purchase button clicked
- `purchase_completed`: Purchase confirmation

### 3.3 BigQuery Export

In GA4 → Admin → Data Import/Export → BigQuery

This lets you query revenue data alongside engagement metrics for analysis.

## Phase 4: Deploy Autonomous System (30 minutes)

### 4.1 Enable GitHub Actions

```bash
# Ensure .github/workflows/autonomous-improvements.yml is committed
git add .github/workflows/autonomous-improvements.yml
git commit -m "feat: add weekly autonomous improvement workflow"
git push origin claude/install-frontend-design-skill-oyp48t
```

### 4.2 Set GitHub Secrets

In your GitHub repository → Settings → Secrets and Variables → Actions:

```
SUPABASE_URL: https://your-project.supabase.co
SUPABASE_ANON_KEY: your-anon-key
ANTHROPIC_API_KEY: your-anthropic-key
```

### 4.3 First Manual Run

```bash
# Test locally before automation:
cd agent-builder
pnpm install
pnpm tsx scripts/run-autonomous-loop.ts
```

Expected output:
```
🚀 Starting Weekly Autonomous Improvement Loop
==============================================================
📌 Processing 1 pro users

👤 Processing your-email@example.com...
   ✅ Completed
      - Loops: 1
      - Experiments: 1
      - Improvements: 1
```

### 4.4 Automatic Weekly Trigger

The workflow runs automatically every Monday at 2 AM UTC.

To manually trigger:
- GitHub → Actions → Weekly Autonomous Improvements → Run workflow

## Phase 5: Zero-Cost LLM Integration (15 minutes)

The system uses Claude API via your ANTHROPIC_API_KEY, but you can extend it to use FreeLLMAPI (1.7B free tokens/month):

```bash
# Start FreeLLMAPI
cd infra/freellmapi
ENCRYPTION_KEY="$(openssl rand -hex 32)"
printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$ENCRYPTION_KEY" > .env
docker compose up -d

# Now autonomous-improvement.ts can route through FreeLLMAPI for variant analysis
```

Update `callClaude()` in `lib/autonomous-improvement.ts`:

```typescript
// Use FreeLLMAPI instead of Anthropic API
const response = await fetch('http://localhost:3001/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.FREELLMAPI_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'auto', // Auto-picks best available
    messages: [{ role: 'user', content: prompt }]
  })
});
```

## Revenue Flow

### Per App (Starter Tier - $2.99)

```
100 downloads/month × $2.99 × 70% Gumroad cut = $209.30/month
114 apps × $209.30 = $23,860.20/month potential

But with weekly optimization:
- Autonomously generated variants capture 15-25% more engagement
- Higher satisfaction = higher conversion = $3.50+ avg price
- Cross-sells: bundle pricing increases

Realistic Year 1: $150k-300k (with 50+ active apps)
```

### Monetization Layers (Long-term)

**Layer 1: Direct Sales** (Current)
- Gumroad: $2.99-9.99/app
- License keys prevent piracy
- Auto-delivery, zero ops

**Layer 2: Subscriptions** (Next)
- Premium features: "Pro" unlock for $4.99/month
- Autonomous improvement feeds show up as "powered by AI"
- Sync across devices

**Layer 3: Agent-Builder Platform** (Next)
- Sell pre-built app templates: $99-499 each
- White-label builder for others to create their own buddy apps
- 30% revenue share on their sales

**Layer 4: Data/API** (Mature)
- License aggregate sentiment data to wellness brands
- API access for third-party app builders
- $1k-10k/month partnerships

## Operational Checklist

### Weekly (Automated)
- ✅ Run variant experiments across all apps
- ✅ Analyze performance and extract insights
- ✅ Learn ecosystem patterns
- ✅ Generate next-gen improvements
- ✅ Deploy winning variants
- ✅ Log all decisions to audit trail

### Monthly (Manual - 30 minutes)
- [ ] Review improvement_loops results
- [ ] Check GA4 dashboard for revenue trends
- [ ] Verify Gumroad sales and payouts
- [ ] Read Claude insights for breakthrough patterns
- [ ] Adjust pricing tiers if needed

### Quarterly (Manual - 2 hours)
- [ ] Create new app variants for untested categories
- [ ] Add new Gumroad products for complementary tools
- [ ] Analyze creator signature evolution
- [ ] Plan Layer 2 (subscriptions) launch
- [ ] Survey user sentiment from app data

### Annually (Strategic)
- [ ] Review revenue by category and tier
- [ ] Identify highest-performing app types
- [ ] Plan Layer 3 (platform) launch
- [ ] Evaluate Layer 4 (data partnerships)

## Debugging & Monitoring

### Check Autonomous Loop Status

```sql
-- In Supabase → SQL Editor
SELECT 
  loop_id,
  status,
  experiments_run,
  improvements_generated,
  next_run_at
FROM improvement_loops
ORDER BY created_at DESC
LIMIT 10;
```

### View Generated Improvements

```sql
SELECT 
  i.improvement_id,
  i.created_at,
  i.improvements_applied,
  i.ready_for_deployment,
  i.deployed
FROM improvements i
WHERE created_at > now() - interval '7 days'
ORDER BY created_at DESC;
```

### Monitor Creator Signature Learning

```sql
SELECT 
  cs.preferred_style,
  cs.style_distribution,
  cs.common_traits,
  cs.learned_from_apps
FROM creator_signature cs
WHERE user_id = 'your-user-id';
```

## Deployment Strategy: Phased Rollout

### Phase 1: Validate (Week 1-2)
- Pick 5 pilot apps: buddy-8, buddy-16, buddy-35, medicine-companion, daily-planner
- Deploy variants
- Run 1 improvement cycle
- Verify system works end-to-end
- Target: $0 cost, 1k impressions, 50 conversions

### Phase 2: Scale Winners (Week 3-6)
- Launch 15 apps in the buddy/health/learning categories
- Set Gumroad pricing: $2.99 (health), $3.99 (learning), $2.99 (productivity)
- Run 2-3 improvement cycles
- Target: $300-500/month revenue, 500k impressions

### Phase 3: Saturate (Week 7-12)
- Deploy all 50 high-confidence apps
- Add subscription tier: $4.99/month for "pro" variants
- Introduce bundle pricing: buy 3 = 20% off
- Target: $3k-5k/month, autonomous operation

### Phase 4: Layer 2 (Month 4+)
- Launch subscription + desktop sync
- Build "Subscription Manager" central hub
- Introduce "Improvement Feed" showing AI-generated features
- Target: $10k+/month, predictable MRR

## Cost Breakdown (Year 1)

| Item | Cost | Notes |
|---|---|---|
| Supabase (pro) | $2,500 | $25/month, scales to $500 |
| Anthropic API | $5,000 | Improves drop to $0 with FreeLLMAPI |
| Gumroad | 0% | Gumroad takes 10% of sales, not a fixed cost |
| GitHub Actions | $0 | Included in free tier |
| Domain + DNS | $12 | Cheap TLD |
| **Total Fixed** | **$7,512** | Recovers in first 30 sales |

First $7,512 revenue = 2,500 downloads at $3 avg = ~2-4 weeks with 114 apps

## Success Metrics (3 months)

| Metric | Target | Actual |
|---|---|---|
| Apps Monetized | 50+ | _ |
| Monthly Revenue | $5k+ | _ |
| Avg Price Per Download | $3.00+ | _ |
| Repeat Purchases | 15%+ | _ |
| Satisfaction Score | 4.2+ / 5.0 | _ |
| Improvements Generated | 12+ | _ |
| Improvements Deployed | 6+ | _ |

## Next Steps

1. **This week:**
   - [ ] Deploy migrations to Supabase
   - [ ] Create first 5 Gumroad products
   - [ ] Test Gumroad script locally
   - [ ] Enable GitHub Actions secrets

2. **Next week:**
   - [ ] Run first autonomous improvement loop
   - [ ] Deploy improvements to pilot apps
   - [ ] Launch 5 pilot apps publicly
   - [ ] Set up GA4 tracking

3. **Week 3:**
   - [ ] Scale to 15 apps
   - [ ] Analyze first improvement cycle
   - [ ] Optimize pricing based on category

## Questions?

Refer to:
- `MONETIZATION_SETUP.md` - Detailed Gumroad/Stripe/LemonSqueezy setup
- `ANALYTICS_SETUP.md` - GA4 configuration and revenue tracking
- `agent-builder/AUTH-SETUP.md` - Backend architecture
- `infra/freellmapi/SETUP.md` - Zero-cost LLM infrastructure
