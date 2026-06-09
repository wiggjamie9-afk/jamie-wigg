# Stripe Integration Guide

## Overview

Stripe enables direct payment processing for web-based apps and server-side subscription management. Use Stripe for:
- Web-based app users (iOS Web Clip, PWAs)
- One-time purchases
- Fallback payment method for Play Store IAP failures
- Direct international payments

## Setup Phase

### 1. Stripe Account Creation

**Step 1.1: Register**
```
Go to https://dashboard.stripe.com/register
Sign up with work email: stripe-business@rhythmix.com (recommended)
```

**Step 1.2: Account Type**
```
Account Type: Business (not individual)
Country: Australia (primary)
Industry: Software/SaaS
Website: rhythmixapp.com.au
```

**Step 1.3: Verification**
- Stripe will request: Business license, ABN, director ID
- Expected approval time: 2–5 business days
- Keep `stripe_account_id` secure (starts with `acct_`)

### 2. API Keys

**Step 2.1: Generate Keys**
```
Dashboard > Developers > API Keys
```

**Keys you'll need:**
```
Publishable key (pk_live_..., pk_test_...)  → Frontend/Client
Secret key (sk_live_..., sk_test_...)       → Backend only
Restricted API key (rk_live_...)            → Limited access
```

**Never commit secret keys to version control.**

**Step 2.2: Save to Environment**

`.env` (gitignored):
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_ABC123...
STRIPE_SECRET_KEY=sk_live_DEF456...     # NEVER share
STRIPE_WEBHOOK_SECRET=whsec_ABC...
STRIPE_ACCOUNT_ID=acct_1234567890
```

### 3. Product & Pricing Setup

**Step 3.1: Create Products**

Dashboard > Products > + Add product

For each app:
```json
{
  "name": "Blood Pressure Buddy Premium",
  "description": "Unlimited history, advanced analytics, ad-free",
  "type": "service",
  "id": "prod_bloodpressure_premium"
}
```

**Step 3.2: Create Prices**

For each product, create two prices:

```
Price 1: Monthly
├─ Name: Blood Pressure Buddy Premium Monthly
├─ Recurring: Monthly
├─ Price: $2.99 USD
├─ Billing period: Monthly
├─ Trial period: 7 days (optional)
└─ Price ID: price_bp_monthly

Price 2: Annual
├─ Name: Blood Pressure Buddy Premium Annual
├─ Recurring: Yearly
├─ Price: $29.99 USD
├─ Billing period: Yearly
└─ Price ID: price_bp_annual
```

**Step 3.3: Regional Pricing**

Dashboard > Products > [Product] > Prices > + Add another price

```
For "Developed" markets (US, UK, CA, AU, JP):
├─ Billing country: United States → $2.99
├─ Billing country: United Kingdom → £2.49
├─ Billing country: Japan → ¥330
└─ (Repeat for all 7 developed countries)

For "Emerging" markets (IN, BR, MX):
├─ Billing country: India → ₹199
├─ Billing country: Brazil → R$14.99
└─ Billing country: Mexico → $49.99 MXN

Stripe Tax auto-calculates conversion.
```

---

## Implementation

### 4. Frontend Integration (Web/PWA)

**Step 4.1: Install Stripe.js**

```bash
npm install @stripe/stripe-js
```

**Step 4.2: Initialize Client**

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

**Step 4.3: Create Checkout Session**

```javascript
// Frontend code (React example)
async function handleSubscribe(priceId) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: priceId,
      appId: 'blood-pressure-buddy',
      returnUrl: window.location.origin + '/success'
    })
  });

  const session = await response.json();
  
  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({
    sessionId: session.id
  });

  if (result.error) console.error(result.error.message);
}
```

**Step 4.4: Success/Cancel Pages**

After payment, redirect to:
- **Success**: `/success?session_id={SESSION_ID}` → Show "Premium activated"
- **Cancel**: `/cancel` → Show "Subscription cancelled"

### 5. Backend Integration

**Step 5.1: Install Stripe SDK**

```bash
npm install stripe
# or
pip install stripe
```

**Step 5.2: Create Checkout Endpoint**

```javascript
// Node.js/Express example
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, appId, returnUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
      customer_email: req.user?.email || undefined,
      metadata: {
        app_id: appId
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

**Step 5.3: Verify Purchase (Backend)**

```javascript
// Verify session after redirect
app.get('/api/verify-subscription', async (req, res) => {
  const { sessionId } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Grant access
      res.json({
        success: true,
        customerId: session.customer,
        subscriptionId: session.subscription
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

---

## Webhook Configuration

### 6. Webhook Setup

**Step 6.1: Create Webhook Endpoint**

Dashboard > Developers > Webhooks > + Add endpoint

```
Endpoint URL: https://yourapi.com/webhooks/stripe
Description: Stripe subscription events
```

**Step 6.2: Select Events to Listen**

Listen for these events:
```
✓ customer.subscription.created
✓ customer.subscription.updated
✓ customer.subscription.deleted
✓ charge.refunded
✓ payment_intent.succeeded
✓ invoice.payment_failed
```

**Step 6.3: Get Webhook Secret**

After creation, you'll receive:
```
Webhook signing secret: whsec_ABC123...
```

Save to `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_ABC123...
```

**Step 6.4: Handle Webhook Events**

```javascript
// Node.js/Express
const express = require('express');
const app = express();

app.post('/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.sendStatus(400);
  }

  // Handle events
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.sendStatus(200);
});

// Example handlers
async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  
  // Store in database
  await db.subscriptions.create({
    customerId,
    subscriptionId,
    status: 'active',
    createdAt: new Date()
  });
  
  // Send welcome email
  await sendEmail(customerId, 'Welcome to Premium!');
}

async function handleSubscriptionCancelled(subscription) {
  const customerId = subscription.customer;
  
  // Update database
  await db.subscriptions.update(
    { customerId },
    { status: 'cancelled', cancelledAt: new Date() }
  );
  
  // Revoke access
  await revokeAppAccess(customerId);
}
```

---

## Subscription Management

### 7. Customer Portal

Enable self-service subscriptions management:

**Step 7.1: Enable Billing Portal**

Dashboard > Settings > Billing Portal

**Step 7.2: Configure Portal**

```
Features enabled:
✓ Update payment method
✓ Change billing email
✓ View invoices
✓ Download invoices
✓ Cancel subscription
✓ View subscription history
```

**Step 7.3: Create Portal Session Link**

```javascript
app.post('/api/create-portal-session', async (req, res) => {
  const { customerId } = req.body;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.DOMAIN + '/account'
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

**Step 7.4: Add Link in App Settings**

```html
<button onclick="openBillingPortal()">
  Manage Subscription
</button>

<script>
async function openBillingPortal() {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    body: JSON.stringify({ customerId: USER_ID })
  });
  const { url } = await response.json();
  window.location.href = url;
}
</script>
```

---

## Refund Policy

### 8. Refund Configuration

**Step 8.1: Refund Terms (in TOS)**

```
Refund Policy:
- Within 7 days of purchase: Full refund
- After 7 days: No refund (continuing subscription)
- Cancellation: Immediate, no refund of current period
```

**Step 8.2: Manual Refunds**

Dashboard > Payments > Refund a charge

```
1. Find charge by customer or order ID
2. Click "Refund"
3. Enter refund amount
4. Add reason: "Customer requested", "Product not as described", etc.
5. Submit
```

**Step 8.3: Programmatic Refunds**

```javascript
app.post('/api/refund', async (req, res) => {
  const { chargeId, reason } = req.body;

  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
      reason: reason // 'requested_by_customer' or 'fraudulent'
    });

    res.json({ refundId: refund.id, status: refund.status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

---

## Testing

### 9. Test Mode

Always test before going live.

**Step 9.1: Use Test Keys**

Switch to test keys in `.env`:
```
STRIPE_PUBLISHABLE_KEY=pk_test_ABC123...
STRIPE_SECRET_KEY=sk_test_DEF456...
```

**Step 9.2: Test Card Numbers**

```
✓ Success: 4242 4242 4242 4242
✓ Decline: 4000 0000 0000 0002
✓ 3D Secure: 4000 0025 0000 3155
✓ Insufficient funds: 4000 0000 0000 9995

Expiry: 12/25
CVC: 123
```

**Step 9.3: Test Scenarios**

```javascript
// Test subscription creation
POST /api/create-checkout-session
{
  "priceId": "price_test_monthly",
  "appId": "blood-pressure-buddy"
}
// Expected: Checkout URL with test mode indicator

// Test webhook
curl -X POST http://localhost:3000/webhooks/stripe \
  -H "stripe-signature: $(./test-signature.sh)" \
  -d @test-event.json
```

---

## Monitoring & Analytics

### 10. Dashboard Metrics

**Key metrics to track:**

| Metric | Dashboard Path |
|--------|---|
| Monthly recurring revenue (MRR) | Reports > Revenue |
| Active subscriptions | Customers > [Filter] |
| Churn rate | Reports > Subscriptions |
| Failed payments | Invoices > [Filter by status] |
| Average revenue per user | Reports > Metrics |

**Step 10.1: Set up Alerts**

Dashboard > Settings > Notifications

```
✓ Failed payment attempts (alert via email)
✓ New disputes (alert immediately)
✓ High refund rate (alert on 10%+ refunds)
```

**Step 10.2: Export Data**

Dashboard > Data > Export

Export monthly for accounting:
```
1. Invoices (CSV)
2. Customers (CSV)
3. Payment summaries (PDF)
```

---

## Compliance

### 11. PSD2 & SCA (Strong Customer Authentication)

If selling in EU:
- Stripe automatically handles 3D Secure
- No action needed; Stripe uses 3D Secure 2 (3DS2)
- Users see additional auth step on some cards (normal)

### 12. Tax Compliance

**Step 12.1: Enable Stripe Tax**

Dashboard > Settings > Billing settings > Stripe Tax

```
✓ Automatically calculate tax
✓ Collect tax on invoices
✓ Report tax by country
```

**Step 12.2: Tax IDs**

- Australia: ABN (Australian Business Number)
- Other countries: VAT ID, GST ID, etc.

Stripe automatically applies exemptions if customer provides tax ID.

### 13. PCI DSS Compliance

Stripe handles all PCI compliance. You do not:
- Store card numbers
- Store CVCs
- Handle raw card data

Use Stripe's hosted forms (Checkout, Payment Element) for compliance.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Check `.env`, ensure `sk_live_` key is used in production |
| Webhook not triggered | Verify endpoint in Dashboard > Webhooks; check logs |
| Customer not created | Ensure `customer_email` is passed in session creation |
| Failed payment attempt | Check Dashboard > Invoices > [Filter failed]; contact customer |
| Refund declined | Some payment methods don't support refunds; try manual |
| Test mode data showing in production | Switch to live keys immediately |

---

## Cutover Checklist

- [ ] Create Stripe account and verify
- [ ] Generate publishable & secret keys
- [ ] Create 28 products & 56 prices (monthly + annual)
- [ ] Set regional pricing for all apps
- [ ] Test checkout flow end-to-end
- [ ] Implement webhook handlers
- [ ] Test refund flow
- [ ] Set up Billing Portal
- [ ] Update app TOS/privacy with Stripe links
- [ ] Enable PSD2 SCA
- [ ] Activate Stripe Tax
- [ ] Go live (switch to pk_live_, sk_live_ keys)
- [ ] Monitor failed payments & churn
- [ ] Monthly reconciliation with accounting

---

## Monthly Operations

**1st of month:**
- Review MRR, active subs, churn rate
- Export invoices for accounting

**Weekly:**
- Check failed payment alerts
- Review disputes dashboard

**Quarterly:**
- Analyze LTV by app
- Review pricing strategy (A/B test if needed)
