# Gumroad Integration Guide

## Overview

Gumroad is a creator-first payment platform ideal for:
- Selling lifetime licenses (one-time purchase)
- Digital products & bundles
- Affiliate/referral marketing
- Minimal backend complexity (no webhooks required)
- Higher payouts (92% after payment processing)

Use Gumroad for web apps where users want to "own" the app rather than subscribe.

## Setup Phase

### 1. Gumroad Account Creation

**Step 1.1: Register**
```
Go to https://gumroad.com
Sign up with email: gumroad-business@rhythmix.com
Account Type: Creator (to sell products)
```

**Step 1.2: Verify Account**
- Confirm email
- Add payout account (bank details or PayPal)
- Add tax ID (ABN for Australia)

**Step 1.3: Store Credentials**

`.env` (gitignored):
```
GUMROAD_ACCESS_TOKEN=YOUR_GUMROAD_API_KEY
GUMROAD_SELLER_ID=your_gumroad_id
```

### 2. API Access

**Step 2.1: Generate API Token**

Dashboard > Settings > Creator Tools > Creator Access Token

```
Copy: ACCESS_TOKEN (keep secret)
Store in .env as GUMROAD_ACCESS_TOKEN
```

**Step 2.2: Create Products (Licenses)**

For each app, create a Gumroad product:

```
Product Name: Blood Pressure Buddy - Lifetime License
Description: Unlock premium features forever. One payment, no subscription.
Price: $19.99
Product Type: One-time purchase
License Key: [Auto-generate]
```

---

## Product Setup

### 3. Create Products via Dashboard

**Step 3.1: Manual Creation (Recommended for First Setup)**

1. Dashboard > Products > + New Product
2. Fill form:
   - **Name**: `[App Name] - Lifetime License`
   - **Description**: "Unlock premium features forever"
   - **Price**: Varies (see pricing below)
   - **Product Type**: Standalone
   - **License key**: Enable if you want auto-generated keys

3. Save & note the **Product ID** (e.g., `1234567890`)

**Step 3.2: API Product Creation**

```bash
curl -X POST https://api.gumroad.com/v2/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "name=Blood Pressure Buddy Lifetime" \
  -d "description=Unlock premium features forever" \
  -d "price=1999" \
  -d "currency=usd"
```

Response:
```json
{
  "product": {
    "id": "prod_12345",
    "name": "Blood Pressure Buddy Lifetime",
    "url": "https://gumroad.com/l/bloodpressure",
    "product_id": "1234567890"
  }
}
```

### 4. Pricing Strategy

**Lifetime License Pricing by App:**

| App Category | Price | Rationale |
|---|---|---|
| Health (BP, Weight, Period, Calorie, Medicine, Heartbeat) | $9.99 | Personal health tools, medium demand |
| Finance (Budget, Expense, Savings, Loan Calc) | $14.99 | Business value, willingness to pay |
| Wellness (Meditation, Resonate, Roomtone) | $19.99 | Premium experience, recurring value |
| Music (Hum) | $29.99 | Creative tool, higher perceived value |
| Productivity (Notes, Tasks, Reminders, Planner) | $7.99 | Commoditized, lower premium price |
| Education (Study, English, Math) | $9.99 | Student audience, lower budgets |
| Lifestyle (Mood Journal, Habit Tracker, Water, Voice Notes) | $4.99 | Low friction, impulse purchase |

**Regional Pricing (Gumroad auto-adjusts):**

Gumroad automatically converts USD prices based on customer location:
- Developed markets: Full USD price
- Emerging markets: Suggested local price
- Always show local currency

---

## Integration

### 5. Frontend Integration

**Step 5.1: Embed Gumroad Embed**

Simplest method: No backend required.

```html
<!-- In your app's upgrade/paywall button -->
<script src="https://gumroad.com/js/gumroad.js"></script>

<button class="gumroad-button" 
        href="https://gumroad.com/l/bloodpressure" 
        target="_blank">
  Unlock Premium
</button>
```

**Step 5.2: Link Style**

```html
<!-- Custom styled link -->
<a href="https://gumroad.com/l/bloodpressure" target="_blank" class="btn btn-primary">
  Buy Lifetime License - $9.99
</a>
```

**Step 5.3: Variant Links**

For affiliate tracking or user segmentation:

```
Standard: https://gumroad.com/l/bloodpressure
With affiliate: https://gumroad.com/l/bloodpressure?via=user123
With discount: https://gumroad.com/l/bloodpressure?code=LAUNCH20
```

### 6. License Key Verification

**Step 6.1: Enable License Keys**

Dashboard > Products > [Product] > License keys

```
✓ Enable license key generation
✓ Auto-send license key in email
```

**Step 6.2: Verify License Keys (Backend)**

When user enters their license key:

```javascript
// Node.js backend
const fetch = require('node-fetch');

async function verifyGumroadLicense(licenseKey, productId) {
  const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      product_id: productId,
      license_key: licenseKey
    })
  });

  const data = await response.json();
  
  if (data.success) {
    return {
      valid: true,
      email: data.email,
      purchaseDate: data.created_at
    };
  } else {
    return { valid: false, error: data.message };
  }
}

// Express endpoint
app.post('/api/verify-license', async (req, res) => {
  const { licenseKey, productId } = req.body;

  try {
    const result = await verifyGumroadLicense(licenseKey, productId);
    
    if (result.valid) {
      // Store verification in session/database
      req.session.premium = true;
      req.session.purchaseEmail = result.email;
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Step 6.3: Frontend License Entry**

```html
<!-- Paywall: Enter License Key -->
<form id="licenseForm">
  <input type="text" 
         placeholder="Paste your license key" 
         id="licenseKey"
         pattern="[A-Z0-9]{32}">
  <button type="submit">Unlock Premium</button>
</form>

<script>
document.getElementById('licenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const licenseKey = document.getElementById('licenseKey').value;
  const response = await fetch('/api/verify-license', {
    method: 'POST',
    body: JSON.stringify({
      licenseKey,
      productId: 'bloodpressure' // App ID
    })
  });

  if (response.ok) {
    alert('Premium activated!');
    localStorage.setItem('premium', 'true');
    location.reload();
  } else {
    alert('Invalid license key');
  }
});
</script>
```

---

## Affiliate Program

### 7. Affiliate Links

**Step 7.1: Enable Affiliates**

Dashboard > Products > [Product] > Affiliates

```
✓ Enable affiliates
Commission: 30% (or custom)
```

**Step 7.2: Affiliate Link Format**

```
Standard product link: https://gumroad.com/l/bloodpressure
Affiliate link: https://gumroad.com/l/bloodpressure?via=AFFILIATE_ID
```

**Step 7.3: Create Affiliate Program Terms**

```
Gumroad handles affiliate payments automatically.
Affiliates earn 30% of each sale.
```

**Step 7.4: Invite Affiliates**

Dashboard > Affiliates > Invite

```
Email: partner@example.com
Commission: 30%
Message: "Help promote Blood Pressure Buddy and earn 30% per sale"
```

---

## Webhook Integration (Optional)

### 8. Webhook Setup

**Step 8.1: Enable Webhooks**

Dashboard > Settings > Webhooks > + Add webhook

```
Endpoint: https://yourapi.com/webhooks/gumroad
Events: sale
```

**Step 8.2: Handle Webhook Events**

```javascript
// Express endpoint
const crypto = require('crypto');

app.post('/webhooks/gumroad', express.json(), (req, res) => {
  // Verify signature
  const signature = req.headers['x-gumroad-signature'];
  const body = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.GUMROAD_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle sale event
  if (req.body.resource_type === 'sale') {
    const sale = req.body.data;
    
    // Log purchase
    console.log(`Purchase: ${sale.email} bought ${sale.product_id}`);
    
    // Send license key email
    await sendEmail(sale.email, {
      subject: 'Your Premium License Key',
      body: `License Key: ${sale.license_key}`
    });

    // Update user database
    await db.purchases.create({
      email: sale.email,
      productId: sale.product_id,
      licenseKey: sale.license_key,
      purchasedAt: new Date()
    });
  }

  res.json({ success: true });
});
```

---

## Email Automation

### 9. Post-Purchase Emails

**Step 9.1: License Key Email (Gumroad Default)**

Gumroad automatically sends:
```
Subject: Your license key for [Product]
---
Hi,

Thank you for your purchase! Here's your license key:

LICENSE_KEY_HERE

Paste this in the app to unlock premium features.
```

**Step 9.2: Custom Email (Optional)**

Use Gumroad's email integration or hook into your own email service:

```javascript
async function sendPremiumWelcomeEmail(email, licenseKey, appName) {
  await sendEmail(email, {
    subject: `Welcome to ${appName} Premium!`,
    template: 'premium-welcome',
    variables: {
      licenseKey,
      appName,
      setupLink: `${process.env.DOMAIN}?license=${licenseKey}`
    }
  });
}
```

---

## Refund Policy

### 10. Refund Configuration

**Step 10.1: Set Refund Policy**

Dashboard > Products > [Product] > Refund Policy

```
Allow refunds: Yes
Refund window: 30 days (Gumroad recommends 14–30 days)
Automatic refunds: Disabled (manual approval)
```

**Step 10.2: Manual Refunds**

Dashboard > Orders > [Order] > Refund

```
1. Find purchase by email or order ID
2. Click "Refund"
3. Gumroad refunds customer automatically
4. License key is revoked
```

**Step 10.3: Refund Terms (in TOS)**

```
Refund Policy:
- Within 30 days of purchase: Full refund
- After 30 days: No refund (permanent license)
- Refunds processed to original payment method
```

---

## Analytics & Reporting

### 11. Sales Dashboard

**Metrics Available:**

Dashboard > Analytics

| Metric | Where |
|--------|-------|
| Total sales | Dashboard home |
| Monthly revenue | Reports > Revenue |
| Sales by product | Reports > Products |
| Customer list | Customers |
| Affiliate sales | Affiliates > Sales |

**Step 11.1: Export Data**

```
Dashboard > Products > [Product] > Orders
Export as CSV for accounting
```

**Step 11.2: API Queries**

```bash
# Get sales for a product
curl https://api.gumroad.com/v2/products/PRODUCT_ID/sales \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Response: List of all purchases
{
  "sales": [
    {
      "id": "12345",
      "email": "customer@example.com",
      "product_id": "bloodpressure",
      "license_key": "ABCD1234...",
      "price": 999,
      "currency": "usd",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Comparison: Gumroad vs Stripe vs Play Store

| Feature | Gumroad | Stripe | Play Store |
|---------|---------|--------|-----------|
| **Payout** | 92% | 70% (after fees) | 70% |
| **Setup** | 5 minutes | 30 minutes | 1+ day |
| **Subscription** | No | Yes | Yes |
| **Lifetime license** | Yes | Possible | No |
| **License key verification** | Built-in | Custom | N/A |
| **Affiliate support** | Yes | No | No |
| **Mobile app** | No | No | Yes (required) |
| **Web app** | Yes | Yes | No |
| **Webhook complexity** | Low | Medium | High |

**Recommendation by platform:**
- **Web/PWA apps**: Use Stripe or Gumroad
  - Gumroad if lifetime license (simpler)
  - Stripe if subscription (more features)
- **Native mobile**: Use Play Store IAP (mandatory) + fallback to Gumroad for web users

---

## Testing

### 12. Test Purchases

**Step 12.1: Gumroad Sandbox**

Gumroad doesn't have a sandbox. Use these strategies:

1. **Test Link**: Create a free product with $0 price
   ```
   Dashboard > Products > [Product] > Edit > Price: Free
   Test workflow, then change back to $X
   ```

2. **Refund Test**: 
   - Make real purchase with test email
   - Immediately refund (30-second turnaround)
   - Cost: ~$1 payment fee

3. **License Key Test**:
   ```bash
   # Test verification with dummy key
   curl https://api.gumroad.com/v2/licenses/verify \
     -d product_id=test \
     -d license_key=INVALID_KEY \
     -H "Authorization: Bearer ACCESS_TOKEN"
   # Should return success: false
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid access token" | Regenerate token in Settings > Creator Tools |
| License key not sent | Enable "License keys" for product; Gumroad auto-sends |
| Webhook not triggering | Check endpoint URL; ensure it's HTTPS |
| Affiliate link not working | Check "Enable affiliates" on product |
| Refund not processing | Check refund window setting; some payment methods have delays |
| Customer sees error on checkout | Clear browser cache; try incognito mode |

---

## Monthly Operations

**1st of month:**
- Check sales by product
- Verify affiliate payouts processed
- Export sales CSV for accounting

**Weekly:**
- Monitor failed purchases (none expected, but check)
- Respond to refund requests

**Quarterly:**
- Analyze top-selling apps
- Review affiliate performance
- Consider price adjustments

---

## Cutover Checklist for All 28 Apps

- [ ] Create Gumroad account & verify payout method
- [ ] Generate API token; save to `.env`
- [ ] Create 28 products (one per app)
- [ ] Set pricing by category
- [ ] Enable license keys for all products
- [ ] Test checkout flow (free product)
- [ ] Test license key verification endpoint
- [ ] Implement paywall UI in each app
- [ ] Add refund policy to TOS
- [ ] Set up affiliate program (optional)
- [ ] Go live on all 28 products
- [ ] Monitor first week sales & refunds
- [ ] Monthly revenue reconciliation

---

## Example: Complete Integration for One App

### Blood Pressure Buddy - Full Setup

**1. Create Product**
```
Name: Blood Pressure Buddy - Lifetime License
Price: $9.99
License key: Enabled
```

**2. Add Paywall to App**
```html
<!-- In app.html, premium feature section -->
<div id="premium-paywall" class="hidden">
  <h2>Unlock Premium</h2>
  <p>Get advanced analytics, unlimited history, and more.</p>
  
  <div class="pricing">
    <button id="buyButton" class="btn btn-primary">
      Buy Lifetime License - $9.99
    </button>
  </div>
  
  <div class="license-entry hidden" id="licenseEntry">
    <input type="text" id="licenseKey" placeholder="Paste license key">
    <button onclick="verifyLicense()">Activate</button>
  </div>
</div>

<script src="https://gumroad.com/js/gumroad.js"></script>
<script>
document.getElementById('buyButton').addEventListener('click', () => {
  window.location.href = 'https://gumroad.com/l/bloodpressure';
});

// After purchase, user returns and enters license key
async function verifyLicense() {
  const key = document.getElementById('licenseKey').value;
  const res = await fetch('/api/verify-license', {
    method: 'POST',
    body: JSON.stringify({ licenseKey: key, productId: 'bloodpressure' })
  });
  if (res.ok) {
    localStorage.setItem('bloodpressure-premium', 'true');
    location.reload();
  }
}

// On app load, check if premium
if (localStorage.getItem('bloodpressure-premium')) {
  document.getElementById('premium-paywall').remove();
  // Show premium features
} else {
  // Show paywall after 7 days or 5 sessions
}
</script>
```

**3. Backend Verification**
```javascript
// See Step 6.2 for full endpoint code
```

**4. Go Live**
```
1. Publish product on Gumroad
2. Deploy app with paywall
3. Share link: rhythmixapp.com.au/blood-pressure-buddy?ref=gumroad
4. Monitor first week: refunds, license key issues, conversion rate
```

Done. Zero subscription complexity, 92% payout, one-time purchase simplicity.
