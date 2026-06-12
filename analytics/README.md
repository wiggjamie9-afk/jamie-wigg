# Analytics Dashboard

A comprehensive, real-time analytics dashboard for tracking app performance across all 10 apps (TYMPAN, HERD, STACK, DOCKET, LULL, RACK, PLUMB, SPOT, SOLE, AXLE).

## Overview

The dashboard provides:

- **KPI Cards**: 6 top-level metrics (downloads, MAU, premium subs, MRR, ARR, conversion rate)
- **Revenue Metrics**: MRR trend, revenue by app, pricing tier breakdown
- **User Metrics**: DAU/MAU health gauge, acquisition vs churn, retention curves
- **Conversion Funnel**: Visitors → Downloads → Active Users → Premium
- **Apps Performance Table**: Sortable table with all 10 apps and key metrics
- **User Segmentation**: Cohort retention, device breakdown
- **Feature Usage Heatmap**: Top features used per app
- **Export & Share**: CSV, JSON, print, share link

## Files

| File | Purpose |
|---|---|
| `dashboard.html` | Main interactive dashboard (single-file, no dependencies except Chart.js) |
| `data.json` | Sample data for all 10 apps (easily swappable with real API) |
| `README.md` | This file — setup, customization, API integration |

## Quick Start

### 1. Local Testing

```bash
# From analytics/ directory
python3 -m http.server 8000

# Open browser
http://localhost:8000/dashboard.html
```

The dashboard will load `data.json` and render all charts and tables automatically.

### 2. Hosting

- **GitHub Pages**: Drop `analytics/` folder into repo root, deploy as usual
- **Netlify/Vercel**: Connect git repo, configure build to serve `analytics/dashboard.html` at `/analytics`
- **Cloudflare Pages**: Push to repo, Cloudflare auto-deploys
- **Self-hosted**: Copy both files to any web server (nginx, Apache, etc.)

## Features

### KPI Cards
- Total Downloads with period-over-period change
- Monthly Active Users (MAU)
- Premium Subscribers
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Conversion Rate
- Color-coded trends (green = growth, red = decline)

### Charts (Chart.js)

1. **MRR Trend** (Line chart)
   - 12-month rolling view
   - Shows revenue growth trajectory

2. **Revenue by App** (Bar chart)
   - Ranked by MRR contribution
   - Color-coded per app

3. **Pricing Tier Breakdown** (Doughnut chart)
   - % revenue from Premium vs Free+Ads
   - Currently: 78% Premium, 22% Free

4. **DAU/MAU Ratio** (Gauge)
   - Health indicator (target: 35-45%)
   - Shows engagement quality

5. **Acquisition vs Churn** (Line chart)
   - New signups vs monthly churn
   - Trend tracking

6. **Retention Curve** (Line chart)
   - Day-1, Day-7, Day-30 retention rates
   - Cohort analysis (4 months of historical data)

### Apps Performance Table

Sortable table with columns:

| Column | Type | Example |
|---|---|---|
| App Name | Text | TYMPAN, HERD, STACK |
| Downloads | Number | 34,521 |
| Active Users | Number | 8,934 |
| Free Users | Number | 7,324 |
| Premium Users | Number | 1,610 |
| MRR | Currency | $8,050 |
| Conversion Rate | Percentage | 18.0% |
| Churn Rate | Percentage | 3.2% |
| Trend | Emoji | 📈 📉 ➡️ |

**Sorting**: Click any column header to sort ascending/descending. Visual indicators show active sort.

### Conversion Funnel

Shows drop-off at each stage:

1. **Visitors**: 1,243,521
2. **Downloads**: 287,453 (23% of visitors)
3. **Active Users**: 42,189 (15% of downloads)
4. **Premium Conversions**: 3,847 (9.1% of active)

Each stage shows:
- Absolute count
- Percentage of initial funnel
- Drop-off % from previous stage

### User Segmentation

- **Cohort Retention Table**: Track retention by signup cohort (Apr, May, Jun)
  - Day+1, +7, +14, +30, +60 retention rates
  - Color-coded: Green (high) / Orange (medium) / Red (low)

- **Device Breakdown**: iOS (58%), Android (35%), Web (7%)

### Feature Usage Heatmap

Visual breakdown of feature adoption per app:

```
TYMPAN    [Environment Detection: 94%] [Custom Presets: 87%] [Real-time EQ: 82%]
HERD      [Lameness Scoring: 91%]      [Mastitis Detection: 88%] [Herd Reports: 76%]
STACK     [Source Detection: 89%]      [Recommendations: 84%]   [History: 71%]
```

Bars show visual height by usage %, with labels showing feature name.

### Export & Share

- **CSV Export**: App metrics table (name, downloads, users, revenue, rates)
- **JSON Export**: Full `data.json` payload
- **Print**: Formatted report with charts
- **Share Link**: Copy dashboard URL to clipboard

### Date Range Picker

Quick filters:
- 30 Days (default)
- 90 Days
- 12 Months

In a real implementation, these would filter the data fetched from your API. Currently, they toggle visually but don't change the displayed data (that's by design — update the data fetch logic to support dynamic ranges).

## Data Integration

### Option 1: Static JSON (Current)

The dashboard reads `data.json` on load. To update data:

1. Manually edit `data.json`
2. Refresh browser (Ctrl+R)

Useful for:
- Local testing
- Demo environments
- Embedded analytics (PDF reports)

### Option 2: Real-time API

Modify the `loadData()` function in `dashboard.html`:

```javascript
async function loadData() {
  try {
    // Instead of:
    // const response = await fetch('data.json');

    // Use your API:
    const response = await fetch('https://api.yourcompany.com/analytics', {
      headers: { 'Authorization': `Bearer ${yourToken}` }
    });

    CONFIG.data = await response.json();
  } catch (error) {
    console.error('Failed to load data:', error);
    CONFIG.data = getMockData();
  }
}
```

Supported API sources:
- **Firebase**: Use `firebase-admin` SDK to query Firestore/Realtime DB
- **Stripe**: `/v1/subscriptions` + `/v1/customers` for revenue metrics
- **Mixpanel**: `https://mixpanel.com/api/2.0/events`
- **Segment**: Custom HTTP endpoint to your warehouse
- **Custom Node.js**: Build your own aggregation service

### Option 3: Polling + Real-time

Set up auto-refresh:

```javascript
// Auto-refresh every 5 minutes
setInterval(async () => {
  await loadData();
  renderDashboard();
  initCharts();
}, 5 * 60 * 1000);
```

## Data Schema

The `data.json` structure:

```json
{
  "period": "Last 30 Days",
  "generatedAt": "2026-06-12T14:32:00Z",
  "summary": {
    "totalDownloads": 287453,
    "monthlyActiveUsers": 42189,
    "dailyActiveUsers": 17740,
    "premiumSubscribers": 3847,
    "mrr": 67850,
    "arr": 814200,
    "conversionRate": 9.1,
    "churnRate": 3.4,
    "arpu": 14.25,
    "mrrTrend": 18.7,        // % growth vs last period
    "mauTrend": 8.3,
    "premiumTrend": 15.2,
    "conversionTrend": 2.3
  },
  "apps": [
    {
      "name": "TYMPAN",
      "badge": "#6b4f7a",     // Color for app card
      "downloads": 34521,
      "activeUsers": 8934,
      "freeUsers": 7324,
      "premiumUsers": 1610,
      "mrr": 8050,
      "conversionRate": 18.0,
      "churnRate": 3.2,
      "trend": "up"           // "up", "down", "neutral"
    },
    // ... 9 more apps
  ],
  "mrrTrendData": [45000, 48000, ..., 67850],  // 12 months
  "conversionFunnel": {
    "visitors": 1243521,
    "downloads": 287453,
    "activeUsers": 42189,
    "premiumConversions": 3847
  },
  "retentionRates": {
    "day1": 65,
    "day7": 42,
    "day30": 28
  },
  "cohorts": [
    { "month": "Apr", "d1": 68, "d7": 45, "d14": 32, "d30": 22, "d60": 15 },
    // ... more cohorts
  ],
  "features": [
    {
      "app": "TYMPAN",
      "features": [
        { "name": "Environment Detection", "usage": 94 },
        // ... more features
      ]
    },
    // ... more apps
  ]
}
```

### Key Metrics Definitions

| Metric | Definition | Source |
|---|---|---|
| **Downloads** | Cumulative app installs (iOS + Android + Web) | App Store, Google Play, custom install tracking |
| **Active Users** | Users who opened app in last 30 days | Firebase / Mixpanel / custom event tracking |
| **Free Users** | Active users on free tier | Database / subscription table |
| **Premium Users** | Active users with paid subscription | Stripe / Zuora / custom billing |
| **MRR** | Monthly Recurring Revenue = Σ(subscriber monthly fee) | Stripe / recurring revenue metric |
| **ARR** | Annual Recurring Revenue = MRR × 12 | Calculated |
| **Conversion Rate** | % of active users → premium | Premium Users ÷ Active Users |
| **Churn Rate** | % of premium users who unsubscribed | Unsubscribed ÷ Previous Month Premium × 100 |
| **ARPU** | Average Revenue Per User = MRR ÷ Active Users | Calculated |

## Customization

### Colors & Theme

Edit CSS variables at top of `dashboard.html`:

```css
:root {
  --bg: #0a0e27;              /* Main background */
  --surface: #0f1432;         /* Card background */
  --accent: #60a5fa;          /* Primary highlight */
  --success: #10b981;         /* Green for growth */
  --danger: #ef4444;          /* Red for decline */
  --chart-1: #3b82f6;         /* Chart colors */
  --chart-2: #ec4899;
  /* ... more colors ... */
}
```

### App Colors

Edit the app badge colors in `data.json`:

```json
"apps": [
  { "name": "TYMPAN", "badge": "#6b4f7a", ... },
  { "name": "HERD", "badge": "#b85c38", ... },
  // ... update to match your brand
]
```

Current colors match the Untapped app portfolio aesthetic.

### Add/Remove Apps

1. **Add**: Add new object to `apps` array in `data.json`
2. **Remove**: Delete from `apps` array
3. The table, charts, and funnel auto-update

Example:

```json
"apps": [
  {
    "name": "MY_NEW_APP",
    "badge": "#ff1493",
    "downloads": 15000,
    "activeUsers": 2500,
    "freeUsers": 2000,
    "premiumUsers": 500,
    "mrr": 2500,
    "conversionRate": 20.0,
    "churnRate": 3.5,
    "trend": "up"
  }
]
```

### Add New Metrics

To add a new KPI card (e.g., "Lifetime Value"):

1. Add to `summary` in `data.json`:
   ```json
   "ltv": 145.50
   ```

2. Add HTML card in dashboard:
   ```html
   <div class="kpi-card">
     <div class="kpi-label">Lifetime Value</div>
     <div class="kpi-value" id="kpiLTV">$0</div>
     <div class="kpi-change positive">↑ <span id="kpiLTVChange">5.2%</span></div>
   </div>
   ```

3. Update JavaScript:
   ```javascript
   document.getElementById('kpiLTV').textContent = '$' + data.summary.ltv.toFixed(2);
   ```

## Performance

- **Load time**: ~500ms (Chart.js via CDN)
- **Data size**: ~50KB (data.json)
- **Browser support**: Chrome, Firefox, Safari, Edge (ES6 required)
- **Mobile**: Fully responsive (tested on iPhone 12, iPad, Android tablets)

### Optimization Tips

1. **Large datasets**: Aggregate data server-side before sending to dashboard
2. **Real-time updates**: Use WebSocket instead of polling to reduce network traffic
3. **Chart performance**: Limit data points to ~12-24 months; use sampling for older data
4. **Caching**: Set `Cache-Control: max-age=3600` on data.json to cache for 1 hour

## Troubleshooting

### "data.json not found" error

**Problem**: Dashboard shows "Failed to load data" and falls back to mock data.

**Solutions**:
1. Ensure `data.json` is in the same directory as `dashboard.html`
2. Check browser console (F12 → Console) for CORS errors
3. If serving from different domain, add CORS headers:
   ```
   Access-Control-Allow-Origin: *
   ```

### Charts not rendering

**Problem**: Chart containers are blank.

**Solutions**:
1. Verify Chart.js loaded: Open DevTools → Network tab, search for "chart.min.js"
2. Check console for JavaScript errors
3. Ensure data.json has `mrrTrendData`, `conversionFunnel`, etc.

### Table sorting not working

**Problem**: Clicking column headers doesn't sort.

**Solutions**:
1. Check browser DevTools → Console for JavaScript errors
2. Verify table headers have `class="sortable"` attribute
3. Ensure app data includes all fields (name, downloads, activeUsers, etc.)

## API Integration Examples

### Firebase Analytics + Stripe

```javascript
async function loadData() {
  // Fetch from Cloud Firestore (via REST API)
  const analyticsResp = await fetch(
    'https://firestore.googleapis.com/v1/projects/{project}/databases/(default)/documents/analytics/summary',
    { headers: { 'Authorization': `Bearer ${idToken}` } }
  );
  const analytics = await analyticsResp.json();

  // Fetch from Stripe via custom backend
  const stripeResp = await fetch(
    '/api/stripe/revenue',
    { headers: { 'Authorization': `Bearer ${authToken}` } }
  );
  const stripe = await stripeResp.json();

  // Merge and normalize
  CONFIG.data = {
    summary: {
      totalDownloads: analytics.downloads,
      premiumSubscribers: stripe.activeSubscriptions,
      mrr: stripe.currentMrr,
      // ... more metrics
    },
    apps: analytics.appBreakdown,
    // ... other sections
  };
}
```

### Mixpanel Export API

```javascript
async function loadData() {
  const response = await fetch(
    `https://mixpanel.com/api/2.0/export?from_date=${startDate}&to_date=${endDate}`,
    {
      headers: {
        'Authorization': `Basic ${btoa(token + ':')}`
      }
    }
  );
  const events = await response.json();

  // Parse and aggregate events
  const summary = aggregateEvents(events);
  CONFIG.data = buildDataModel(summary);
}
```

### Custom Node.js Backend

```javascript
async function loadData() {
  const response = await fetch(
    'https://api.yourcompany.com/analytics?period=30d&format=dashboard',
    { headers: { 'Authorization': `Bearer ${yourToken}` } }
  );
  CONFIG.data = await response.json();
}
```

Then in your backend:

```javascript
// Node.js / Express
app.get('/analytics', authenticateToken, async (req, res) => {
  const period = req.query.period || '30d';
  
  // Query your database (Postgres, MongoDB, Snowflake, etc.)
  const data = await aggregateAnalytics(period);
  
  res.json(data);
});
```

## Maintenance

### Weekly
- Review KPI cards for anomalies
- Check retention trends (especially day-7 and day-30)
- Monitor churn rate per app

### Monthly
- Review conversion funnel (watch for drops)
- Analyze cohort retention patterns
- Check ARPU trend
- Review top features per app

### Quarterly
- Full data audit (verify numbers against source systems)
- User segmentation analysis
- Geographic breakdown trends
- App performance rankings

## Permissions

All metrics are **read-only** — the dashboard doesn't modify any data. Safe to share with:

- Product managers
- Investors
- Board members
- Operations team

## Support

For issues or feature requests:

1. Check `README.md` (this file)
2. Review browser DevTools console for errors
3. Verify `data.json` format matches schema
4. Test with mock data first before integrating real API

## License

Analytics dashboard is part of the main repository. Use as needed internally.
