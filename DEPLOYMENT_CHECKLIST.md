# Autonomous Monetization System — Deployment Checklist

**Time Required:** ~2 hours  
**Complexity:** Low (mostly copy-paste & clicks)  
**Hands-on Work:** 2 hours, then completely automated

---

## Pre-Setup (5 minutes)

- [ ] Review `SYSTEM_COMPLETE.md` for overview
- [ ] Have Supabase account ready
- [ ] Have Gumroad account ready  
- [ ] Have GitHub account ready
- [ ] Have Anthropic API key from: https://console.anthropic.com

---

## Phase 1: Database Migrations (15 minutes)

**Objective:** Create improvement tracking schema in Supabase

- [ ] Open Supabase Dashboard
- [ ] Go to: Project → SQL Editor
- [ ] Copy entire contents of: `agent-builder/migrations/002_improvements.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Wait for completion (should say "Done!")
- [ ] Verify tables created with:
  ```sql
  SELECT COUNT(*) FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND (table_name LIKE '%variant%' OR table_name LIKE '%improvement%');
  ```
- [ ] Result should be: **10** (confirms tables created)

**Expected tables:**
- variants, experiments, variant_analytics, variant_performance
- variant_insights, ecosystem_patterns, creator_signature, improvements

---

## Phase 2: Gumroad Setup (30 minutes)

**Objective:** Create product catalog and API integration

### Step 2.1: Get API Token
- [ ] Go to: https://gumroad.com/settings/creator
- [ ] Scroll to "API Access Token"
- [ ] Copy the token
- [ ] Store temporarily: `export GUMROAD_TOKEN="your-token"`

### Step 2.2: Test with 3 Products
```bash
python3 scripts/monetization/setup_gumroad_products.py 3
```

- [ ] Script runs without errors
- [ ] See 3 products created
- [ ] Verify in Gumroad dashboard: https://app.gumroad.com/products

### Step 2.3: Create All Products
```bash
GUMROAD_TOKEN=$GUMROAD_TOKEN python3 scripts/monetization/setup_gumroad_products.py
```

- [ ] All products created (currently 16, extensible to 114)
- [ ] Check results: `cat results/gumroad/products_latest.json | jq '.[].name'`

---

## Phase 3: GitHub Secrets Setup (10 minutes)

**Objective:** Configure CI/CD authentication for auto-runs

### Get Required Values

**SUPABASE_URL:**
- [ ] Supabase Dashboard → Project Settings → API
- [ ] Copy "URL" value (looks like `https://xxx.supabase.co`)

**SUPABASE_ANON_KEY:**
- [ ] Supabase Dashboard → Project Settings → API  
- [ ] Copy "anon public" key (looks like `eyJ...`)

**ANTHROPIC_API_KEY:**
- [ ] https://console.anthropic.com → API Keys
- [ ] Click "Create Key" and copy (looks like `sk-...`)

### Add to GitHub
- [ ] Go to: GitHub → Settings → Secrets and Variables → Actions
- [ ] New secret: `SUPABASE_URL` → Paste value
- [ ] New secret: `SUPABASE_ANON_KEY` → Paste value  
- [ ] New secret: `ANTHROPIC_API_KEY` → Paste value
- [ ] Verify all 3 secrets appear (values masked)

---

## Phase 4: Test Locally (25 minutes)

**Objective:** Verify the improvement loop works before automation

### Step 4.1: Create .env File
```bash
cat > agent-builder/.env.local <<EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-...
EOF
```

- [ ] Confirm file created: `ls -la agent-builder/.env.local`

### Step 4.2: Install Dependencies
```bash
cd agent-builder
pnpm install
```

- [ ] Completes successfully

### Step 4.3: Run Improvement Loop
```bash
pnpm tsx scripts/run-autonomous-loop.ts
```

- [ ] Runs successfully
- [ ] See output: `✅ Weekly Autonomous Improvement Loop Complete`
- [ ] Exit code 0

### Step 4.4: Check Results
```bash
cat results/improvements/latest.json | jq .
```

- [ ] See JSON with: `users_processed: 0`, `total_improvements: 0`, `errors: []`
- [ ] (0 users because system is new)

---

## Phase 5: Deploy Workflow (10 minutes)

**Objective:** Enable automatic weekly runs

### Step 5.1: Verify Workflow File
```bash
head -10 .github/workflows/autonomous-improvements.yml
```

- [ ] File exists and shows: `name: Weekly Autonomous Improvements`
- [ ] Cron schedule: `'0 2 * * 1'` (Monday 2 AM UTC)

### Step 5.2: Enable in GitHub
- [ ] GitHub → Actions
- [ ] Find "Weekly Autonomous Improvements"
- [ ] Enable if needed

### Step 5.3: Manual Test Trigger
- [ ] GitHub → Actions → "Weekly Autonomous Improvements"
- [ ] Click "Run workflow"  
- [ ] Select branch: your feature branch
- [ ] Click "Run workflow"
- [ ] Wait 1-2 minutes

- [ ] Workflow completes: Green checkmark
- [ ] Review logs: No errors

### Step 5.4: Schedule Confirmation
- [ ] Workflow is set to run: **Every Monday 2 AM UTC**
- [ ] Can trigger manually anytime
- [ ] First automatic run: Next Monday 2 AM UTC

---

## Phase 6: Monitor & Verify (10 minutes)

**Objective:** Confirm system is live

### Bookmark These URLs
- [ ] **Supabase:** `https://app.supabase.com/project/[id]/sql`  
  Query: `SELECT * FROM improvement_loops ORDER BY created_at DESC LIMIT 10;`
  
- [ ] **GitHub Actions:** Your workflows page  
  Link: `https://github.com/[user]/[repo]/actions/workflows/autonomous-improvements.yml`
  
- [ ] **Gumroad:** `https://app.gumroad.com/products`
  
- [ ] **Results:** `results/gumroad/products_latest.json`

### Verify in Supabase
```sql
SELECT COUNT(*) as loop_count FROM improvement_loops;
```

- [ ] Returns: 1 (from your test run)

---

## Phase 7: Production Deploy (5 minutes)

**Objective:** Go live

- [ ] All changes committed: `git status`
- [ ] All changes pushed: `git push origin [branch]`

### Verify Key Files Exist
- [ ] `agent-builder/lib/autonomous-improvement.ts`
- [ ] `agent-builder/migrations/002_improvements.sql`
- [ ] `agent-builder/scripts/run-autonomous-loop.ts`
- [ ] `.github/workflows/autonomous-improvements.yml`
- [ ] `scripts/monetization/setup_gumroad_products.py`

---

## ✅ System Live

When all phases complete:

| Component | Status |
|-----------|--------|
| Database | ✅ Ready |
| Gumroad Products | ✅ Live |
| GitHub Automation | ✅ Scheduled |
| Revenue | ✅ Flowing (1-2 weeks) |

---

## Revenue Timeline

Track your progress:

- [ ] **Week 1:** System deployed, monitoring (0 revenue)
- [ ] **Week 2:** 5 apps live, 1st improvement cycle ($50-200)
- [ ] **Week 3:** 15 apps live, pricing optimized ($200-800)
- [ ] **Week 4:** 50 apps live, auto-optimization ($800-2000)
- [ ] **Month 2:** 114 apps live ($3k-5k/month)

---

## Operational Checklist (Ongoing)

### Weekly (Automatic)
- [ ] GitHub Actions runs every Monday 2 AM UTC
- [ ] Check GitHub Actions → Artifacts for results

### Monthly (30 minutes)
- [ ] Review improvement_loops in Supabase
- [ ] Check Gumroad sales dashboard
- [ ] Review GA4 analytics (if set up)

### Quarterly (2 hours)
- [ ] Review revenue trends
- [ ] Plan next phase (subscriptions, white-label, etc.)

---

## Troubleshooting

### Gumroad script fails
```bash
echo $GUMROAD_TOKEN
curl -H "Authorization: Bearer $GUMROAD_TOKEN" https://api.gumroad.com/v2/products
```
- [ ] See 200 response = working

### GitHub Actions fails
- [ ] Check: Settings → Secrets → All 3 present
- [ ] Check: Workflow logs for error details

### No improvements generated
- [ ] Check: SELECT COUNT(*) FROM projects; (need data first)
- [ ] Check: improvement_loops table for errors

---

## Completion Checklist

**Date Started:** _______________

- [ ] Phase 1 Complete: _______________
- [ ] Phase 2 Complete: _______________
- [ ] Phase 3 Complete: _______________
- [ ] Phase 4 Complete: _______________
- [ ] Phase 5 Complete: _______________
- [ ] Phase 6 Complete: _______________
- [ ] Phase 7 Complete: _______________

**System Live Date: _______________**

**First Revenue Date: _______________**

---

**Next:** See `QUICK_START_AUTONOMOUS.md` for detailed walkthrough.  
See `AUTONOMOUS_MONETIZATION_SETUP.md` for complete technical docs.  
See `SYSTEM_COMPLETE.md` for overview and next phases.
