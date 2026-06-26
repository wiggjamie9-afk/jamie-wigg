# Private Portal Monetization Setup

**How customers buy → How they access → How you get paid**

---

## Architecture Overview

```
Customer Journey:

1. Find App (Social/Marketing)
   ↓
2. Click "Buy" → Gumroad Checkout
   ↓
3. Pay $2.99
   ↓
4. Gumroad sends webhook to your server
   ↓
5. Server creates:
   - User account (if new)
   - Purchase record
   - License key
   ↓
6. Gumroad delivers:
   - Login email & password
   - Direct link to app
   ↓
7. Customer logs in at studio.starlightmix.com
   ↓
8. Sees "My Apps" portal
   ↓
9. Clicks app card
   ↓
10. App opens with license key validated
    ↓
11. Full access to app + premium features
    ↓
12. Revenue flows to your bank (Gumroad pays weekly)
```

---

## Database Setup (Already Created)

Three migrations are now in place:

1. **001_users.sql** - User accounts, Supabase Auth
2. **002_improvements.sql** - Variant tracking (autonomous system)
3. **003_purchases.sql** - License keys, revenue tracking ← NEW

Tables created:
- `user_purchases` - What customers bought
- `license_validations` - Fast validation cache
- `premium_features` - What features they can access
- `subscriptions` - Future: recurring subscriptions
- `app_sessions` - Usage analytics
- `revenue_events` - Money tracking

---

## Deploy Migration

### Step 1: Run Migration in Supabase

```
Supabase Dashboard → SQL Editor
→ Paste: agent-builder/migrations/003_purchases.sql
→ Run
```

Verify tables exist:
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_purchases', 'revenue_events', 'subscriptions');
```

Should return: **3**

---

## How It Works: Step-by-Step

### Step 1: Customer Purchases on Gumroad

```
https://gumroad.com/studio.starlightmix.com/motivation-expert
→ Clicks "Buy"
→ Pays $2.99
→ Enters email: customer@example.com
```

### Step 2: Gumroad Sends Webhook

Your server receives:
```json
{
  "email": "customer@example.com",
  "name": "John Doe",
  "product_id": "12345",
  "product_name": "Motivation Expert",
  "price": "2.99",
  "currency": "USD",
  "transaction_id": "gumroad_12345"
}
```

### Step 3: Server Creates Purchase

API endpoint: `/api/licenses/validate` (POST)

This endpoint:
1. Finds or creates user in `users` table
2. Creates record in `user_purchases` table
3. Generates unique license key
4. Records `revenue_events` for accounting

### Step 4: Gumroad Delivers License

Gumroad sends email to customer with:
```
Thank you for purchasing Motivation Expert!

Your login credentials:
  Email: customer@example.com
  Password: [auto-generated]

Access your app here:
  https://studio.starlightmix.com/dashboard/apps

Direct link (saves login):
  https://studio.starlightmix.com/apps/motivation-expert?license=LIC-ABC123...
```

### Step 5: Customer Logs In

Two paths:

**Path A: Via Login Portal**
```
1. Visit studio.starlightmix.com
2. Log in with email + password
3. See "My Apps" dashboard
4. Click app card
5. App opens (license validated)
```

**Path B: Via Direct Link**
```
1. Click link in Gumroad email
2. App opens immediately
3. License auto-validated from URL
```

### Step 6: App Validates License

```typescript
// In your app's React component:
import { useLicense, LicenseGuard } from '@/lib/license-client';

export default function MotivationExpertApp() {
  return (
    <LicenseGuard>
      {/* Only renders if license is valid */}
      <AppUI />
    </LicenseGuard>
  );
}
```

License validation:
- Checks URL parameter: `?license=LIC-ABC123`
- Falls back to sessionStorage
- Calls `/api/licenses/validate` endpoint
- Server confirms license exists + is valid
- Records usage in `app_sessions` table
- Returns premium flag

---

## Integration Steps

### Step 1: Update Your Apps

Each of your 114 apps needs to wrap in `<LicenseGuard>`:

**Before:**
```typescript
export default function BuddyApp() {
  return <AppUI />;
}
```

**After:**
```typescript
import { LicenseGuard } from '@/lib/license-client';

export default function BuddyApp() {
  return (
    <LicenseGuard>
      <AppUI />
    </LicenseGuard>
  );
}
```

This:
- ✅ Blocks access without license key
- ✅ Shows "Invalid License" screen
- ✅ Records usage analytics
- ✅ Enables premium feature gating

### Step 2: Deploy Dashboard

The `/dashboard/apps` page is ready:

```
1. User logs in at studio.starlightmix.com
2. Navigates to /dashboard/apps
3. Sees all their purchased apps
4. Can click to open each one
5. Apps auto-validate license
```

This is already built in: `agent-builder/app/dashboard/apps/page.tsx`

### Step 3: Add Premium Features

In your apps, gate premium features:

```typescript
import { useLicense } from '@/lib/license-client';

export default function MotivationApp() {
  const { isPremium } = useLicense();

  return (
    <LicenseGuard>
      <MainUI />

      {/* Premium features only show for premium users */}
      {isPremium && (
        <>
          <AdvancedAnalytics />
          <ExportToCSV />
          <CustomThemes />
        </>
      )}
    </LicenseGuard>
  );
}
```

### Step 4: Configure Gumroad Webhooks

#### Gumroad → Settings → Webhooks

Add webhook:
```
URL: https://studio.starlightmix.com/api/licenses/validate
Events: Purchase, License Key
```

This sends purchase data to your server automatically.

---

## Gumroad Integration Details

### Product Setup

For each app on Gumroad, set:

**Product Name:** `Motivation Expert`
**Description:** App description
**Price:** `$2.99` or `$3.99`
**License Keys:** Enable (Gumroad auto-generates)
**Delivery Method:** License Key

### Email on Purchase

Customize Gumroad's auto-email:

```
Thank you for purchasing {product_name}!

Your License Key: {license_key}

Access your app:
https://studio.starlightmix.com/dashboard/apps

Or direct link:
https://studio.starlightmix.com/apps/{product_slug}?license={license_key}
```

(Replace `{license_key}` with actual Gumroad variable)

### Affiliate Program (Optional)

Enable on Gumroad:
- Commission: 30%
- This lets other creators promote your apps
- Passive income stream

---

## Revenue Tracking

### Real-Time Dashboard

Query your revenue:

```sql
-- Total revenue this month
SELECT 
  SUM(amount) as total_revenue,
  COUNT(*) as transactions,
  AVG(amount) as avg_transaction
FROM revenue_events
WHERE event_type = 'purchase'
  AND created_at > now() - interval '30 days';

-- Revenue by app
SELECT 
  app_id,
  COUNT(*) as sales,
  SUM(amount) as revenue
FROM revenue_events
WHERE event_type = 'purchase'
GROUP BY app_id
ORDER BY revenue DESC;

-- Top customers
SELECT 
  user_id,
  COUNT(*) as purchases,
  SUM(amount) as spent
FROM revenue_events
WHERE event_type = 'purchase'
GROUP BY user_id
ORDER BY spent DESC
LIMIT 10;
```

### Gumroad Dashboard

```
https://app.gumroad.com/dashboard/sales
```

Shows:
- Total sales
- Revenue breakdown
- Payouts (weekly)
- Customer list
- Product performance

---

## Pricing Strategy

### Recommended Tiers

| App Type | Price | Rationale |
|---|---|---|
| Buddy (Motivation/Support) | $2.99 | Impulse buy, high volume |
| Learning (Education) | $3.99 | Higher perceived value |
| Health & Fitness | $2.99 | Highly competitive |
| Finance Tools | $4.99 | Professional tier |
| Utilities | $0.99 | Low-friction tools |

### Discount Strategy

**Launch Special:**
```
First 100 customers: $1.99 (33% off)
Creates urgency + social proof
```

**Bundle Deal:**
```
Buy 3+ apps: 20% off total
Higher customer lifetime value
```

**Seasonal:**
```
New Year: Motivation apps 30% off
Back to School: Learning apps 25% off
```

---

## Customer Success Flow

### Day 1: Welcome Email

```
Subject: Your Motivation Expert app is ready! 🎉

Hi [Name],

Thanks for purchasing! Your app is ready to use.

👉 Open now: [direct link with license]

Or log in to your dashboard:
→ Email: [email]
→ Password: [password]

Questions? Reply to this email or visit support@rhythmixapp.com.au
```

### Day 7: Re-engagement

```
Subject: Loving your Motivation Expert? 💪

Haven't used your app in a while. Here's what you're missing:

✓ Daily affirmations
✓ Goal tracking
✓ Streak achievements

Re-open now: [link]
```

### Day 30: Premium Upsell

```
Subject: 🚀 Upgrade to Premium

Ready to level up?

Premium includes:
✓ Advanced analytics
✓ Export your data
✓ Custom themes
✓ Priority support

Upgrade now: $4.99/month
```

---

## Security Considerations

### License Keys

- 16-character random hex: `LIC-a7b3c9e2f4d6`
- Unique per purchase (no sharing)
- Validated server-side only
- Cached for 1 hour (performance)

### Data Protection

- License keys in logs: Redacted (`LIC-****...`)
- Payment data: Never stored (Gumroad handles)
- Personal data: Encrypted at rest (Supabase)
- GDPR compliant: User can request deletion

### Rate Limiting

- 10 validations per minute per license
- 100 validations per minute per IP
- Prevents brute-force attacks

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Conversion Rate**
   ```
   (Purchases / App Views) × 100
   Target: 2-5%
   ```

2. **Customer Lifetime Value (CLV)**
   ```
   Average purchase price × repeat purchases
   Target: $5-20 per customer
   ```

3. **Premium Adoption**
   ```
   (Premium users / total) × 100
   Target: 15-30% upgrade rate
   ```

4. **Churn Rate**
   ```
   (Cancelled subscriptions / active) × 100
   Target: <5% monthly
   ```

### Dashboards

**Gumroad Analytics:**
- Sales by product
- Customer geography
- Revenue trends
- Top referrers

**Supabase Dashboard:**
```sql
-- Apps being used
SELECT 
  app_id,
  COUNT(DISTINCT purchase_id) as active_users,
  COUNT(*) as sessions
FROM app_sessions
WHERE session_start > now() - interval '7 days'
GROUP BY app_id;
```

---

## Troubleshooting

### "Invalid License" Error

**Cause:** License key not in database

**Fix:**
```sql
-- Check if purchase exists
SELECT * FROM user_purchases 
WHERE license_key = 'LIC-...';

-- Check if valid
SELECT * FROM license_validations 
WHERE license_key = 'LIC-...' 
AND is_valid = true;
```

### Webhook Not Firing

**Check:**
1. Gumroad Settings → Webhooks → Verify URL is correct
2. Test webhook: Gumroad → "Send Test"
3. Check server logs: `/api/licenses/validate`
4. Verify endpoint returns 200 OK

### Revenue Not Showing

**Check:**
1. Is webhook firing? (See above)
2. Check `revenue_events` table:
   ```sql
   SELECT * FROM revenue_events 
   WHERE created_at > now() - interval '1 hour';
   ```
3. Verify user exists in `users` table

---

## Next Steps

### This Week
- [ ] Run migration 003_purchases.sql
- [ ] Test Gumroad webhook
- [ ] Wrap one app in `<LicenseGuard>`
- [ ] Verify license validation works

### Next Week
- [ ] Wrap all 114 apps in `<LicenseGuard>`
- [ ] Deploy `/dashboard/apps` portal
- [ ] Create landing pages with "Buy Now" buttons
- [ ] Test full flow: Purchase → Email → Login → Use App

### Phase 2 (Month 2)
- [ ] Add premium features ($4.99/month)
- [ ] Premium features unlock in apps
- [ ] Subscription recurring payments (Stripe)

### Phase 3 (Month 3)
- [ ] Affiliate program (30% commission)
- [ ] Bundle deals (3+ apps)
- [ ] Seasonal promotions

---

## Files Reference

**New Files (This Implementation):**
- `migrations/003_purchases.sql` — Database schema
- `lib/types.ts` — TypeScript interfaces
- `lib/license-client.ts` — Client-side validation
- `app/api/licenses/validate/route.ts` — Webhook receiver
- `app/dashboard/apps/page.tsx` — Purchase portal

**Existing Files (Already Set Up):**
- `lib/auth.ts` — User authentication
- `lib/db.ts` — Supabase client
- `app/layout.tsx` — Layout with protected routes

**To Update (For Each App):**
- Every app HTML → Wrap in `<LicenseGuard>`
- App descriptions → Add "Buy Now" button
- Landing pages → Add pricing & features

---

## Support

Having issues?

1. **Check:** `results/improvement-results/` for error logs
2. **Query:** Supabase SQL to verify data
3. **Test:** `curl https://studio.starlightmix.com/api/licenses/validate?key=LIC-...`
4. **Contact:** Check Gumroad webhook logs

---

**Status:** ✅ **READY TO DEPLOY**

This is a complete monetization system. The portal goes live as soon as:
1. Migration deployed
2. Apps wrapped in `<LicenseGuard>`
3. Gumroad products created
4. Webhooks configured

Estimated time: 4-6 hours from this point to first revenue.
