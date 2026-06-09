# Analytics & Revenue Tracking Setup

## Overview

Track monetization metrics across 28 apps using Google Analytics 4 (GA4), Stripe/Gumroad APIs, and custom dashboards.

## Google Analytics 4 Setup

### 1. GA4 Property Creation

**Step 1.1: Create GA4 Property**

1. Go to https://analytics.google.com
2. Sign in with analytics@rhythmix.com
3. Admin > Create Property

```
Property name: Rhythmix Apps Analytics
Reporting timezone: Australia/Sydney
Currency: USD
Industry category: Software/Technology
```

**Step 1.2: Create Data Stream**

```
Platform: Web
Website URL: rhythmixapp.com.au
Stream name: Rhythmix Main Stream
```

Copy **Measurement ID**: `G-XXXXXXXXXX`

### 2. GA4 Implementation

**Step 2.1: Install gtag.js in All Apps**

Add to `<head>` of every app HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': window.location.pathname,
    'page_title': 'Blood Pressure Buddy',
    'app_name': 'blood-pressure-buddy'
  });
</script>
```

Replace `G-XXXXXXXXXX` with your Measurement ID.

**Step 2.2: Consent Mode (GDPR/Privacy)**

```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted'
});

// After user consents to analytics:
// gtag('consent', 'update', { 'analytics_storage': 'granted' });
```

---

## Custom Events for Monetization

### 3. Event Tracking

**Step 3.1: Define Custom Events**

Track these events in GA4:

```javascript
// Paywall impression
gtag('event', 'view_item', {
  'items': [{
    'item_id': 'blood-pressure-buddy',
    'item_name': 'Blood Pressure Buddy Premium',
    'price': 2.99,
    'currency': 'USD'
  }]
});

// Trial started
gtag('event', 'trial_start', {
  'app_id': 'blood-pressure-buddy',
  'app_name': 'Blood Pressure Buddy',
  'trial_length_days': 7
});

// Trial ended
gtag('event', 'trial_end', {
  'app_id': 'blood-pressure-buddy',
  'status': 'converted' // or 'expired'
});

// Purchase/subscription started
gtag('event', 'purchase', {
  'items': [{
    'item_id': 'blood-pressure-buddy',
    'item_name': 'Blood Pressure Buddy Premium',
    'price': 2.99,
    'quantity': 1,
    'currency': 'USD'
  }],
  'transaction_id': 'STRIPE_SESSION_ID_or_GUMROAD_ORDER_ID',
  'payment_method': 'stripe' // or 'gumroad', 'iap'
});

// Upgrade/downgrade
gtag('event', 'view_item', {
  'items': [{
    'item_id': 'blood-pressure-buddy-annual',
    'item_name': 'Blood Pressure Buddy Premium Annual',
    'price': 29.99,
    'item_category': 'subscription-upgrade'
  }]
});

// Subscription cancelled
gtag('event', 'subscription_cancel', {
  'app_id': 'blood-pressure-buddy',
  'subscription_id': 'sub_123',
  'reason': 'user_cancelled' // or 'failed_payment', 'refund'
});

// Premium feature used
gtag('event', 'view_item', {
  'items': [{
    'item_name': 'Export Analytics Report',
    'item_category': 'premium-feature-access'
  }]
});

// Refund processed
gtag('event', 'refund', {
  'items': [{
    'item_id': 'blood-pressure-buddy',
    'quantity': 1
  }],
  'transaction_id': 'ref_123'
});
```

**Step 3.2: Track Events in Code**

```javascript
// At paywall display
function showPaywall(appId) {
  gtag('event', 'view_item', {
    'items': [{
      'item_id': appId,
      'item_category': 'paywall'
    }]
  });
}

// On subscription button click
async function handleSubscribeClick(appId, priceId) {
  gtag('event', 'add_to_cart', {
    'items': [{
      'item_id': appId,
      'price': 2.99,
      'currency': 'USD'
    }]
  });

  // Redirect to checkout
  const response = await fetch('/api/create-checkout', { /* ... */ });
}

// On purchase success (after redirect back)
function onPurchaseSuccess(sessionId, appId) {
  gtag('event', 'purchase', {
    'items': [{
      'item_id': appId,
      'price': 2.99
    }],
    'transaction_id': sessionId,
    'payment_method': 'stripe'
  });

  // Mark conversion in GA4
  gtag('event', 'purchase', {
    'currency': 'USD',
    'value': 2.99
  });
}
```

---

## Conversion Funnel Tracking

### 4. Define Conversion Funnels

**Step 4.1: Create Funnel in GA4**

Admin > Events > Create event

Create these conversion events:
- `trial_start`
- `paywall_view`
- `purchase`
- `subscription_cancel`

**Step 4.2: Analyze Funnel**

Reporting > Exploration > Create new exploration

**Funnel visualization:**
```
1. Session Start (100%)
   ↓
2. View App (95%)
   ↓
3. Trial Started (25%)
   ↓
4. Paywall Viewed (20%)
   ↓
5. Purchase Completed (3%)
   ↓
6. Active Premium Users (98% retention after 1 month)
```

---

## Revenue Tracking

### 5. eCommerce Tracking

**Step 5.1: Enable Enhanced eCommerce**

Admin > Data Streams > [Stream] > Enhanced measurement

```
✓ Purchase event tracking
✓ Scroll events
✓ Search events
✓ Video engagement
```

**Step 5.2: Track Purchase Revenue**

```javascript
gtag('event', 'purchase', {
  'transaction_id': 'T_123456',
  'affiliation': 'rhythmix_stripe',
  'value': 2.99,
  'currency': 'USD',
  'tax': 0.30,
  'shipping': 0,
  'items': [
    {
      'item_id': 'blood-pressure-buddy',
      'item_name': 'Blood Pressure Buddy Premium',
      'affiliation': 'stripe',
      'coupon': '',
      'discount': 0,
      'index': 0,
      'price': 2.99,
      'quantity': 1
    }
  ]
});
```

**Step 5.3: GA4 Reports**

Reporting > Monetization > Overview

```
Metrics displayed:
- Total revenue
- Average revenue per user (ARPU)
- Purchase events
- Active users making purchases
```

---

## ARPU & LTV Calculations

### 6. Custom Calculations

**Step 6.1: ARPU (Average Revenue Per User)**

```
ARPU = Total Revenue / Total Active Users

Example:
- Total revenue: $10,000/month
- Active users: 5,000
- ARPU: $2.00/month
```

**In GA4:**
```
Admin > Custom metrics
Metric name: ARPU
Description: Average Revenue Per User
Formula: revenue / active_users
```

**Step 6.2: LTV (Lifetime Value)**

```
LTV = (Average Monthly Revenue Per User) × (Subscription Lifetime)

Example (assuming 2-year average):
- ARPU: $2.00/month
- Lifetime: 24 months
- LTV: $48.00 per user
```

**In spreadsheet (monthly export):**

```
Month | Revenue | Active Users | Churn % | LTV Estimate
------|---------|--------------|---------|-------------
Jan   | $10,000 | 5,000        | 5%      | $48
Feb   | $11,000 | 5,200        | 4.5%    | $52
Mar   | $11,500 | 5,400        | 4%      | $55
```

**Step 6.3: Create GA4 Audience for LTV Segments**

Reporting > Audiences

```
Audience: High LTV Users
Conditions:
- Purchase count >= 2
- Days since first purchase >= 30
```

---

## Funnel Analysis

### 7. Free-to-Premium Funnel

**Step 7.1: Create Funnel**

Reporting > Exploration

```
Type: Funnel exploration
Step 1: session_start
Step 2: trial_start (event)
Step 3: paywall_view (event)
Step 4: purchase (event)

Visualize drop-off between each step
```

**Expected funnel metrics:**

| Step | Sessions | Drop-off |
|------|----------|----------|
| Install | 100 | - |
| Trial Start | 25 | 75% |
| Paywall View | 20 | 20% |
| Purchase | 3 | 85% |
| Active 30d later | 3 | 0% (retention) |

**Step 7.2: Diagnose Drop-off**

If paywall view is 0:
- Check if paywall component loads
- Check if event fires (browser console)
- Check if GA4 property ID is correct

If purchase is 0:
- Check Stripe/Gumroad integration
- Check if success event fires
- Verify payment processing

---

## Custom Dashboard

### 8. Create Dashboard in GA4

**Step 8.1: Build Dashboard**

Reporting > Dashboard > Create dashboard

Add widgets:

| Widget | Type | Metric |
|--------|------|--------|
| Revenue | Scorecard | Total revenue (last 30d) |
| Conversions | Trend | Purchase events by day |
| ARPU | Scorecard | Revenue / Active users |
| Churn Rate | Trend | Cancellation events |
| Top Apps | Table | Revenue by app_name |
| Free-Premium | Funnel | trial → paywall → purchase |
| Retention | Trend | Active users day 1, 7, 30 |

**Step 8.2: Custom Report**

Reporting > Create custom report

```
Dimensions: Date, App Name, Subscription Type
Metrics: Revenue, Users, Conversion Rate, LTV
Filter: Only purchase events
```

---

## Stripe/Gumroad Data Import

### 9. API Integration for Detailed Reporting

**Step 9.1: Export Stripe Data**

```bash
# Monthly export script
curl https://api.stripe.com/v1/reporting/report_runs \
  -H "Authorization: Bearer sk_live_..." \
  -d type=platform_payouts \
  -d parameters[connected_account]=acct_... \
  -d parameters[interval_start]=$(date +%s) \
  -d parameters[interval_end]=$(date -d '+1 month' +%s)
```

**Step 9.2: Import to Google Sheets (for Dashboard)**

```javascript
// Apps Script in Google Sheets
function updateStripeData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Stripe Data');
  
  const response = UrlFetchApp.fetch(
    'https://api.stripe.com/v1/charges?limit=100',
    {
      headers: { 'Authorization': 'Bearer sk_live_...' }
    }
  );

  const data = JSON.parse(response.getContentText());
  
  // Parse and write to sheet
  let row = 2;
  data.data.forEach(charge => {
    sheet.getRange(row, 1).setValue(charge.created);
    sheet.getRange(row, 2).setValue(charge.amount / 100);
    sheet.getRange(row, 3).setValue(charge.status);
    row++;
  });
}

// Run monthly: Admin > Triggers > Add trigger
```

**Step 9.3: Create Revenue Dashboard in Sheets**

```
Tab 1: Raw Data (Stripe API export)
Tab 2: Summary (pivot table)
Tab 3: Metrics (ARPU, LTV, churn)
Tab 4: Charts (by app, by region)
```

---

## Retention & Churn Analysis

### 10. Cohort Analysis

**Step 10.1: GA4 Cohort Report**

Reporting > Retention > Cohort analysis

```
Cohort type: By acquisition date
Cohort size: Daily
Metrics: Revenue, Active users, Churn

Visualization:
Date        Day 1   Day 7   Day 30  Day 90
2024-01-01  100     92      78      45
2024-01-02  100     89      75      42
2024-01-03  100     94      82      51
```

**Step 10.2: Calculate Churn Rate**

```
Churn rate = Cancelled subscriptions / Active subscriptions at start of month

Example:
- Start of month: 1,000 active subs
- Cancelled during month: 45
- Churn rate: 4.5%

Target: < 5% monthly churn
```

**Step 10.3: Retention Cohort**

```
Cohort: Users who purchased in January 2024
- 1-month retention: 96% (still active in Feb)
- 3-month retention: 85% (still active in Apr)
- 6-month retention: 72% (still active in Jul)
- 12-month retention: 55% (still active in Jan 2025)
```

---

## Real-time Monitoring

### 11. Real-time Dashboard

**For Monitoring During Launch**

Reporting > Realtime

```
Metrics:
- Active users (now)
- Events per minute
- Recent purchases
- Top pages
```

Set up alerts:

Admin > Alerts

```
Alert 1: Purchase event drops below 1/hour
Alert 2: Site error rate > 5%
Alert 3: Payment failures > 10/hour
```

---

## Attribution Model

### 12. Multi-touch Attribution

**Default in GA4: Data-driven attribution**

This automatically weighs touchpoints:
- First click: Gets 25% credit
- Last click: Gets 40% credit
- Intermediate: 15% each

**View in:**
Reporting > Conversion > Model comparison

---

## Monthly Reporting

### 13. Create Monthly Report Template

**Step 13.1: Automated Email Report**

Use Google Sheets + Apps Script:

```javascript
function sendMonthlyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reportSheet = ss.getSheetByName('Monthly Report');

  const attachment = ss.getBlob();
  
  MailApp.sendEmail('owner@rhythmix.com', 
    'Monetization Report - ' + Utilities.formatDate(new Date(), 'UTC', 'MMM YYYY'),
    'See attached for detailed breakdown.',
    { attachments: [attachment] }
  );
}

// Schedule: Triggers > Every 1st of month at 9am
```

**Step 13.2: Report Structure**

```
RHYTHMIX APPS - MONTHLY MONETIZATION REPORT
===========================================

Period: January 2024

KEY METRICS
-----------
Total Revenue:           $12,450
Active Premium Users:    550
Monthly Recurring Rev:   $11,200
One-time Sales:         $1,250
ARPU:                   $22.63
Churn Rate:             4.2%

REVENUE BY APP
--------------
Blood Pressure Buddy    $1,850 (14.8%)
Meditation Guide        $1,650 (13.3%)
Hum                     $1,400 (11.2%)
Resonate                $1,320 (10.6%)
[... 24 more apps]

CONVERSION FUNNEL
-----------------
Trial Starts:    1,200
Paywall Views:   350 (29%)
Purchases:       45 (12.9%)
Conversion Rate: 3.75%

PLATFORM BREAKDOWN
-------------------
Stripe (web):    $8,100 (65%)
Google IAP:      $3,200 (26%)
Gumroad (license): $1,150 (9%)

RETENTION
----------
Day 1 Retention:   100%
Day 7 Retention:   92%
Day 30 Retention:  78%
Day 90 Retention:  52%

CHURN
------
Subscriptions ended: 24
Refunds processed:   3
Net churn rate:      4.2%
```

---

## Troubleshooting Analytics

| Issue | Solution |
|-------|----------|
| Events not showing in GA4 | Check Measurement ID; use GA Debug View; refresh page |
| Revenue showing as $0 | Ensure `value` & `currency` parameters in purchase event |
| Users not tracked | Check consent mode; user may have analytics disabled |
| Funnel shows 0 drop-off | Verify event names match exactly; GA is case-sensitive |
| ARPU calculation wrong | Ensure revenue and user count from same date range |

---

## Advanced: Custom Dashboards via Data Studio

### 14. Create Multi-source Dashboard

1. Google Data Studio: https://datastudio.google.com
2. Create data sources:
   - GA4 property
   - Google Sheets (Stripe exports)
   - Gumroad API (via Sheets)

3. Build dashboard:
   - Revenue trend (Stripe + IAP + Gumroad)
   - Conversion funnel (GA4)
   - Cohort retention (calculated in Sheets)
   - ARPU by app (GA4 + revenue data)

This gives a 360-degree view of monetization across all platforms.

---

## Compliance Notes

- **GDPR**: Ensure users consent before GA4 tracking
- **CCPA**: Provide opt-out mechanism
- **Australia Privacy Act**: Disclose analytics in privacy policy
- **User data**: Never send PII to GA4 (email, phone)

---

## Metrics Checklist

Track these monthly:

- [ ] Total revenue (all platforms)
- [ ] Revenue by app
- [ ] Revenue by platform (Stripe/IAP/Gumroad)
- [ ] Active premium subscriptions
- [ ] New subscriptions
- [ ] Cancelled subscriptions
- [ ] Churn rate
- [ ] ARPU
- [ ] LTV estimate
- [ ] Free-to-premium conversion rate
- [ ] Retention (Day 1, 7, 30, 90)
- [ ] Refunds issued
- [ ] Payment failures
