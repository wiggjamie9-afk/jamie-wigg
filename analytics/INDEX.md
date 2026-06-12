# Analytics Dashboard — File Index

## 📊 Main Files

### `dashboard.html` (38 KB, 1,594 lines)
**The complete, single-file analytics dashboard.**

**Contains:**
- Responsive HTML structure with sticky header
- Inline CSS (1,000+ lines) with dark theme
- Inline JavaScript (600+ lines) for interactivity
- Chart.js integration (CDN-loaded)
- All UI components (KPI cards, tables, charts, gauges)

**Features:**
- 6 KPI cards (Downloads, MAU, Premium, MRR, ARR, Conversion)
- 6 interactive charts (MRR trend, revenue by app, pricing breakdown, DAU/MAU, acq vs churn, retention)
- Sortable apps performance table
- Conversion funnel visualization
- Cohort retention matrix
- Feature usage heatmap
- Export functionality (CSV, JSON, print, share)
- Mobile-responsive (tested on iPhone, iPad, Android)
- No build step—open directly in browser

**Load:** Open in browser: `file:///path/to/analytics/dashboard.html` or serve via HTTP

---

### `data.json` (11 KB, 496 lines)
**Sample analytics data for all 10 apps.**

**Sections:**
- `summary`: 6 top-level KPIs + trends
- `apps[10]`: Detailed metrics per app (downloads, users, revenue, conversion, churn, features)
- `mrrTrendData`: 12-month revenue trend
- `conversionFunnel`: Visitor→Download→Active→Premium pipeline
- `retentionRates`: Day-1, 7, 30 retention percentages
- `cohorts[3]`: Historical cohort retention (Apr, May, Jun)
- `features[3]`: Feature usage breakdown per app
- `geographicBreakdown`: Regional distribution
- `deviceBreakdown`: iOS/Android/Web split
- `metadata`: Data source, update frequency, timezone

**Format:** Valid JSON, UTF-8 encoded. No trailing commas.

**Use:** Drop-in replacement or template for building your API response. See schema in `README.md`.

---

## 📚 Documentation

### `README.md` (15 KB, 536 lines)
**Complete reference documentation.**

**Covers:**
- Quick start (local testing, hosting options)
- Feature overview (all sections of dashboard)
- Data integration (3 options: static JSON, API, polling)
- Data schema (full structure, metric definitions, field descriptions)
- Customization (colors, app list, metrics, additional features)
- Performance tips (load time, caching, optimization)
- Troubleshooting (common errors, solutions)
- API integration examples (Firebase, Stripe, Mixpanel, custom backend)
- Maintenance checklist (weekly, monthly, quarterly reviews)

**Best for:** Understanding the dashboard, customizing colors, integrating APIs.

---

### `INTEGRATION.md` (8.1 KB, 364 lines)
**Step-by-step API integration guide.**

**Covers:**
- 5-minute setup (local testing, GitHub Pages, Cloudflare Pages)
- Data source swap (static → real API)
- Code examples for:
  - Firebase (Analytics + Firestore)
  - Stripe (revenue metrics)
  - Mixpanel (user events)
  - Custom Node.js backend
- Auto-refresh strategies (polling, WebSocket)
- Date range integration
- CORS troubleshooting
- Deployment checklist

**Best for:** Developers integrating the dashboard with real data sources.

---

### `QUICKSTART.md` (6.1 KB, 235 lines)
**Quick reference and getting started guide.**

**Covers:**
- 30-second overview of what you have
- Try it now (local server command)
- Deploy options (GitHub Pages, Cloudflare, self-hosted)
- Connect real data in 5 minutes
- Feature table
- Key customizations (colors, app names)
- Metrics to monitor weekly
- Technical details
- FAQ
- Support resources

**Best for:** Getting started fast, quick answers, sharing with non-technical stakeholders.

---

## 🎯 How to Use These Files

### If you want to...

| Goal | Read | Action |
|---|---|---|
| **Try the dashboard now** | `QUICKSTART.md` | `python3 -m http.server 8000`, open dashboard.html |
| **Deploy to production** | `QUICKSTART.md` → `INTEGRATION.md` | Copy `analytics/` folder, push to GitHub/Cloudflare |
| **Connect to real API** | `INTEGRATION.md` | Edit `loadData()` function, provide API endpoint |
| **Understand data format** | `README.md` → Data Schema | Study `data.json` structure, build matching API response |
| **Customize colors/theme** | `README.md` → Customization | Edit `:root` CSS variables in dashboard.html |
| **Add more apps** | `README.md` → Customize | Add entries to `apps` array in data.json |
| **Troubleshoot issues** | `README.md` → Troubleshooting | Check console, verify JSON, test with mock data |
| **Understand every feature** | `README.md` → Features | Read full feature descriptions |

---

## 📋 Data Fields Reference

### Summary Metrics (in `data.json.summary`)
```
totalDownloads      - Cumulative installs
monthlyActiveUsers  - Users active in past 30 days
dailyActiveUsers    - Users active today
premiumSubscribers  - Active paid users
mrr                 - Monthly recurring revenue ($)
arr                 - Annual recurring revenue ($)
conversionRate      - % of active users → premium
churnRate           - % monthly churn
arpu                - Average revenue per user
*Trend              - % growth vs previous period (mrrTrend, mauTrend, etc.)
```

### App Metrics (in `data.json.apps[]`)
```
name                - App display name
badge               - Hex color for card/chart
downloads           - Total installs
activeUsers         - Monthly active
freeUsers           - Free tier users
premiumUsers        - Paid tier users
mrr                 - Monthly revenue from this app
conversionRate      - % free → premium
churnRate           - % monthly churn
trend               - "up" | "down" | "neutral"
features[]          - Top features with usage %
```

---

## 🔧 File Dependencies

```
dashboard.html
  ├── Loads data.json (fetch at startup)
  ├── Uses Chart.js (CDN: cdn.jsdelivr.net)
  └── Self-contained (CSS + JS inline)

data.json
  └── Serves as data source (can swap for API)

README.md
  ├── Comprehensive reference
  └── No dependencies

INTEGRATION.md
  ├── Code snippets reference README.md for schema
  └── Provides API implementation examples

QUICKSTART.md
  ├── Quick reference to other docs
  └── No dependencies
```

---

## 🚀 Deployment Paths

### Simplest: GitHub Pages
1. `git add analytics/`
2. `git commit -m "Add analytics"`
3. `git push`
4. Live at: `https://rhythmixapp.com.au/analytics/dashboard.html`

### Fastest: Cloudflare Pages
1. `wrangler deploy`
2. Live in ~10 seconds
3. Auto-redeploys on push

### Most Control: Custom Server
1. Copy `analytics/` to server
2. Serve via nginx/Apache
3. Add auth/HTTPS as needed

---

## 📊 What the Dashboard Shows

| Component | Data Source | Updates |
|---|---|---|
| KPI Cards | `summary.*` | Pulled from data.json (or real API) |
| MRR Trend | `mrrTrendData[12]` | 12-month historical |
| Revenue by App | `apps[].mrr` | Per-app breakdown |
| Apps Table | `apps[10]` | All 10 apps with full metrics |
| Conversion Funnel | `conversionFunnel.*` | Visitors → Premium pipeline |
| Retention | `retentionRates.*` | D+1, +7, +30 % |
| Cohorts | `cohorts[3]` | 3 month history with D+1-60 |
| Features | `features[].usage` | Top features per app |

---

## 🎨 Customization Quick Links

| What to Change | Where | How |
|---|---|---|
| **Colors/Theme** | dashboard.html `:root` CSS | Edit hex color values |
| **App Names** | data.json `apps[].name` | Replace text |
| **App Badges** | data.json `apps[].badge` | Update hex colors |
| **KPI Labels** | dashboard.html `<div class="kpi-label">` | Edit text |
| **Chart Colors** | CSS `--chart-1` through `--chart-5` | Change hex values |
| **Font** | CSS `font-family` | Update Google Fonts or system fonts |
| **Date Ranges** | HTML `date-range-btn` buttons | Edit `data-range` values |

---

## ✅ Pre-Integration Checklist

Before connecting to a real API:

- [ ] Tested dashboard locally (`python3 -m http.server`)
- [ ] Reviewed all 10 apps in sample data
- [ ] Understood `data.json` schema
- [ ] Identified your data source (Firebase, Stripe, custom backend)
- [ ] Reviewed API integration examples in `INTEGRATION.md`
- [ ] Decided on authentication method (Bearer token, OAuth, API key)
- [ ] Planned auto-refresh strategy (polling, WebSocket, manual)
- [ ] Tested CORS setup if data source on different domain
- [ ] Prepared API endpoint that returns matching JSON structure

---

## 📞 Quick Answers

**Q: Where do I change the dashboard colors?**
A: Edit `:root { ... }` at top of `dashboard.html` (lines 15-35)

**Q: How do I add an 11th app?**
A: Add object to `apps` array in `data.json`

**Q: Can I use real data instead of sample data?**
A: Yes. Edit `loadData()` function (line ~1365) to fetch from your API

**Q: What if my data source returns different fields?**
A: Map your API response to the schema shown in `data.json`

**Q: How do I deploy this?**
A: Copy `analytics/` folder to your server or push to GitHub

**Q: Does this need a backend?**
A: No—works entirely client-side with static JSON. Optional backend for real data.

**Q: Can I share the dashboard with non-technical people?**
A: Yes. It's a webpage—just send the URL.

---

## 📁 Directory Structure

```
analytics/
├── dashboard.html      ← Open this in browser
├── data.json          ← Data source
├── README.md          ← Full documentation
├── INTEGRATION.md     ← API integration guide
├── QUICKSTART.md      ← Getting started
└── INDEX.md           ← This file
```

---

## 🎓 Learning Resources

- **Chart.js Docs**: https://www.chartjs.org/docs/
- **Responsive Design**: CSS Grid/Flexbox (all used in dashboard.html)
- **JSON Schema**: Standard format used in `data.json`
- **REST APIs**: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs
- **Firebase**: https://firebase.google.com/docs
- **Stripe API**: https://stripe.com/docs/api

---

Generated: June 12, 2026
Version: 1.0
Apps Tracked: 10 (TYMPAN, HERD, STACK, DOCKET, LULL, RACK, PLUMB, SPOT, SOLE, AXLE)
