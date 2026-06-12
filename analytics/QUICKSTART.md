# Analytics Dashboard — Quick Start

## What You Have

✅ **dashboard.html** (1,594 lines)
- Responsive, dark-themed analytics dashboard
- 6 KPI cards with trend indicators
- 6 interactive charts (Chart.js)
- Sortable apps performance table
- Conversion funnel visualization
- Cohort retention analysis
- Feature usage heatmap
- Export (CSV, JSON, print, share)

✅ **data.json** (496 lines)
- Sample data for all 10 apps (TYMPAN, HERD, STACK, DOCKET, LULL, RACK, PLUMB, SPOT, SOLE, AXLE)
- 12 months of MRR trend
- Retention cohorts
- Feature usage breakdown
- Geographic & device segmentation

✅ **README.md** (536 lines)
- Full documentation
- Data schema reference
- Customization guide
- API integration examples
- Troubleshooting

✅ **INTEGRATION.md** (this file)
- Step-by-step API connection guide
- Code snippets (Firebase, Stripe, Mixpanel, custom backend)
- CORS solutions
- Deployment checklist

## Try It Right Now

```bash
cd analytics
python3 -m http.server 8000
# Open browser: http://localhost:8000/dashboard.html
```

You'll see:
- All 10 apps with real-looking metrics
- Revenue trends, retention curves, feature heatmaps
- Fully interactive (sortable table, date filters, exports)

No API needed—works with static sample data.

## Deploy to Production

### Option 1: GitHub Pages (Easiest)

```bash
git add analytics/
git commit -m "Add analytics dashboard"
git push origin main
# Live at: https://rhythmixapp.com.au/analytics/dashboard.html
```

### Option 2: Cloudflare Pages

```bash
wrangler deploy
# Live at: https://yourproject.pages.dev/analytics/dashboard.html
```

### Option 3: Any Web Server

Copy `analytics/` folder to your hosting. Done.

## Connect Real Data (5 Minutes)

1. **Get your API endpoint** (Firebase, Stripe, custom backend, etc.)

2. **Edit `dashboard.html` line ~1365:**

```javascript
// Old:
const response = await fetch('data.json');

// New:
const response = await fetch('https://your-api.com/analytics', {
  headers: { 'Authorization': `Bearer ${yourToken}` }
});
```

3. **Refresh browser.** Dashboard now pulls live data.

For detailed examples, see `INTEGRATION.md`.

## Key Features

| Feature | Where | Notes |
|---|---|---|
| **KPI Cards** | Top of dashboard | Downloads, MAU, Premium subs, MRR, ARR, Conversion |
| **MRR Trend** | Revenue section | 12-month line chart |
| **Revenue by App** | Revenue section | Bar chart, ranked by contribution |
| **Conversion Funnel** | User section | Visitors → Downloads → Active → Premium |
| **Apps Table** | Middle section | Sortable, all 10 apps with metrics |
| **Retention Curves** | User section | Day-1, 7, 30 retention rates |
| **Cohort Analysis** | Segmentation | Track retention by signup month |
| **Feature Heatmap** | Bottom section | Top features per app + usage % |
| **Export** | Bottom | CSV, JSON, print, share link |

## Customize in 10 Minutes

### Change Colors

Edit `:root` at top of `dashboard.html`:

```css
:root {
  --accent: #60a5fa;        /* Primary blue */
  --success: #10b981;       /* Green */
  --danger: #ef4444;        /* Red */
  --chart-1: #3b82f6;       /* Chart colors */
}
```

### Change App Names/Colors

Edit `data.json`:

```json
"apps": [
  {
    "name": "YOUR_APP_NAME",
    "badge": "#yourcolor",
    "downloads": 34521,
    ...
  }
]
```

### Add New App

Add to `apps` array in `data.json`. Table/charts auto-update.

### Remove Date Range Buttons

Delete from HTML:
```html
<div class="date-range-group">
  <button class="date-range-btn active" data-range="30">30 Days</button>
  <!-- Remove others if not needed -->
</div>
```

## Monitor These Metrics Weekly

1. **KPI Cards** (top of dashboard)
   - Downloads growth
   - Premium subscriber trend
   - MRR (should trend up)

2. **Conversion Funnel**
   - Watch for drops at each stage
   - Aim for 9-12% funnel conversion

3. **Retention Curve**
   - Day-7 retention: target 35-45%
   - Day-30 retention: target 20-30%

4. **Churn Rate per App**
   - Watch apps with churn >5%
   - Address feature gaps

5. **Feature Usage**
   - Which features drive retention?
   - Which are ignored?

## Technical Details

- **Size**: ~38KB (HTML + styles + JS in one file)
- **Dependencies**: Chart.js (loaded from CDN)
- **Browser support**: Chrome, Firefox, Safari, Edge (ES6)
- **Mobile**: Fully responsive
- **Load time**: ~500ms
- **No build step**: Just open in browser

## Security Notes

- **Read-only**: Dashboard doesn't modify data
- **No backend required**: Works entirely client-side (with JSON)
- **No user tracking**: This is an internal tool
- **Optional auth**: Add `Authorization: Bearer` header to your fetch call if your API requires it

## Share the Dashboard

### Shareable Link
Click "Share" button → copies dashboard URL to clipboard

### Export Report
- **CSV**: Download app metrics as spreadsheet
- **JSON**: Download full data snapshot
- **Print**: Generate PDF report (use browser print function)

All exports include timestamp and period.

## FAQ

**Q: Can I add more than 10 apps?**
A: Yes. Add to `data.json` `apps` array. Table expands automatically.

**Q: How do I make charts update automatically?**
A: Set `setInterval(loadData, 60000)` to refresh every minute.

**Q: How do I protect the dashboard with a password?**
A: Use basic auth on your web server, or add OAuth2 to your API endpoint.

**Q: Can I embed in a web app?**
A: Yes. Iframe the dashboard, or extract the charts as separate components.

**Q: What if my data format is different?**
A: Map your API response to the schema in `data.json`. See `README.md` for schema.

## Support

- **Setup issues**: Check `INTEGRATION.md`
- **Data format questions**: See `README.md` → Data Schema
- **Feature requests**: Edit `dashboard.html` directly (single file, easy to customize)
- **Bugs**: Check browser DevTools console (F12 → Console)

## Next Steps

1. ✅ Try locally (`python3 -m http.server`)
2. ✅ Deploy to production (GitHub Pages / Cloudflare Pages)
3. ✅ Connect real data source (see `INTEGRATION.md`)
4. ✅ Customize colors & app names
5. ✅ Share with team (use shareable link)

---

**Ready?** Open `dashboard.html` in your browser. No setup needed.
