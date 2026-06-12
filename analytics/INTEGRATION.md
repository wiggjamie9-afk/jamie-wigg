# Analytics Dashboard Integration Guide

Quick reference for connecting the analytics dashboard to real data sources.

## 5-Minute Setup

### 1. Local Testing (No Integration)

```bash
cd analytics
python3 -m http.server 8000
# Open: http://localhost:8000/dashboard.html
```

The dashboard loads sample data from `data.json` automatically.

### 2. Deploy to GitHub Pages

```bash
# Already in repo root: /home/user/jamie-wigg/
git add analytics/
git commit -m "Add analytics dashboard"
git push origin main
```

Access at: `https://rhythmixapp.com.au/analytics/dashboard.html`

### 3. Deploy to Cloudflare Pages

```bash
# If not already set up:
npm install -g wrangler

# From analytics/ directory:
wrangler publish
```

## Data Source Integration

### Swap Data Source (Real API)

Edit the `loadData()` function in `dashboard.html` (around line 1365):

**Before (static JSON):**
```javascript
async function loadData() {
  try {
    const response = await fetch('data.json');
    CONFIG.data = await response.json();
  } catch (error) {
    CONFIG.data = getMockData();
  }
}
```

**After (API endpoint):**
```javascript
async function loadData() {
  try {
    const response = await fetch('https://api.yourcompany.com/analytics', {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    CONFIG.data = await response.json();
  } catch (error) {
    CONFIG.data = getMockData();
  }
}
```

### Firebase (Recommended)

If using Firebase Analytics + Firestore:

```javascript
async function loadData() {
  try {
    // Use Firebase SDK
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    const docSnap = await getDoc(doc(db, 'analytics', 'dashboard'));
    CONFIG.data = docSnap.data();
  } catch (error) {
    CONFIG.data = getMockData();
  }
}
```

### Stripe (Revenue Metrics)

For MRR/ARR calculations:

```javascript
async function getStripeMetrics() {
  // Call your backend endpoint
  const response = await fetch('/api/stripe/metrics', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

async function loadData() {
  const stripeData = await getStripeMetrics();
  // Merge with analytics data
  CONFIG.data.summary.mrr = stripeData.mrr;
  CONFIG.data.summary.arr = stripeData.arr;
  CONFIG.data.apps = CONFIG.data.apps.map(app => ({
    ...app,
    mrr: stripeData.appRevenue[app.name] || 0
  }));
}
```

### Mixpanel (User Events)

```javascript
async function getMixpanelData() {
  // Use Mixpanel HTTP API
  const response = await fetch(
    `https://mixpanel.com/api/2.0/retention?` +
    `from_date=${startDate}&to_date=${endDate}&interval=1&unit=day`,
    {
      headers: {
        'Authorization': `Basic ${btoa(apiToken + ':')}`
      }
    }
  );
  return response.json();
}
```

### Custom Node.js Backend

Create an endpoint that returns the dashboard data structure:

**Backend (Node.js):**
```javascript
// backend/routes/analytics.js
const express = require('express');
const router = express.Router();

router.get('/api/analytics', authenticateToken, async (req, res) => {
  const period = req.query.period || '30';
  
  // Query database (Postgres, MongoDB, etc.)
  const summary = await querySummary(period);
  const apps = await queryApps(period);
  const trends = await queryTrends(period);
  
  res.json({
    period: `Last ${period} Days`,
    generatedAt: new Date().toISOString(),
    summary,
    apps,
    mrrTrendData: trends.mrr,
    mauTrendData: trends.mau,
    conversionFunnel: trends.funnel,
    // ... other sections
  });
});

module.exports = router;
```

**Frontend (dashboard.html):**
```javascript
async function loadData() {
  const period = CONFIG.dateRange;
  const response = await fetch(`/api/analytics?period=${period}`, {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  });
  CONFIG.data = await response.json();
}
```

## Auto-Refresh

Add periodic updates:

```javascript
// Refresh data every 5 minutes
setInterval(async () => {
  await loadData();
  renderDashboard();
  initCharts();
  updateTimestamp();
}, 5 * 60 * 1000);
```

Or on user action:

```javascript
// Refresh button
document.querySelector('[data-refresh]').addEventListener('click', async () => {
  await loadData();
  renderDashboard();
});
```

## Date Range Integration

To make date range buttons actually change data:

```javascript
function initDateRangePicker() {
  document.querySelectorAll('.date-range-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.date-range-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CONFIG.dateRange = parseInt(btn.dataset.range);
      
      // Load new data for selected range
      await loadData();
      renderDashboard();
      initCharts();
    });
  });
}
```

## Data Format

Your API **must** return JSON matching this structure:

```json
{
  "period": "Last 30 Days",
  "generatedAt": "2026-06-12T14:32:00Z",
  "summary": {
    "totalDownloads": 287453,
    "monthlyActiveUsers": 42189,
    "premiumSubscribers": 3847,
    "mrr": 67850,
    "arr": 814200,
    "conversionRate": 9.1,
    "churnRate": 3.4,
    "arpu": 14.25,
    "mrrTrend": 18.7,
    "mauTrend": 8.3,
    "premiumTrend": 15.2,
    "conversionTrend": 2.3
  },
  "apps": [
    {
      "name": "APP_NAME",
      "badge": "#color",
      "downloads": 34521,
      "activeUsers": 8934,
      "freeUsers": 7324,
      "premiumUsers": 1610,
      "mrr": 8050,
      "conversionRate": 18.0,
      "churnRate": 3.2,
      "trend": "up"
    }
    // ... 10 apps total
  ],
  "mrrTrendData": [45000, 48000, ..., 67850],
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
    { "month": "Apr", "d1": 68, "d7": 45, "d14": 32, "d30": 22, "d60": 15 }
  ],
  "features": [
    {
      "app": "APP_NAME",
      "features": [
        { "name": "Feature Name", "usage": 94 }
      ]
    }
  ]
}
```

See `README.md` for full schema details.

## Common Issues

### CORS Errors

**Problem**: Dashboard can't fetch from API.

**Solution**: Add CORS headers to your backend:

```javascript
// Node.js/Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Or if using specific domain:
res.header('Access-Control-Allow-Origin', 'https://yourapp.com');
```

### Empty Charts

**Problem**: Charts render but show no data.

**Solution**: Verify your API returns:
- `mrrTrendData`: array of 12 numbers
- `conversionFunnel`: object with visitors, downloads, activeUsers, premiumConversions
- `apps`: array of exactly 10 app objects

### Slow Loading

**Problem**: Dashboard takes >2s to load.

**Solution**:
1. Compress data.json (GZip)
2. Use CDN for Chart.js (already done)
3. Cache API responses (set Cache-Control headers)
4. Reduce data precision (e.g., round large numbers)

## Testing Data

While building integration, use mock data:

```javascript
// Toggle between mock and real API
const USE_MOCK_DATA = true;

async function loadData() {
  if (USE_MOCK_DATA) {
    CONFIG.data = getMockData();
  } else {
    // Fetch from API
  }
}
```

## Deployment Checklist

Before going live:

- [ ] Test with real API in staging
- [ ] Verify all 10 apps appear in table
- [ ] Check charts render correctly
- [ ] Test date range picker
- [ ] Test exports (CSV, JSON, print)
- [ ] Verify mobile responsiveness
- [ ] Set up auto-refresh (optional)
- [ ] Add authentication if needed
- [ ] Monitor for errors in production

## Next Steps

1. **Short term**: Swap data source from `data.json` to your API
2. **Medium term**: Add real-time updates via WebSocket
3. **Long term**: Add drill-down views per app, custom date ranges, data export scheduling

Need help? See `README.md` for detailed API integration examples.
