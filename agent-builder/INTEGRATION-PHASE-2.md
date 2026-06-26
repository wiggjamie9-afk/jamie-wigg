# Phase 2: Monetization Integration

## Status: Architecture Complete, Ready for Product Integration

### Phase 1 ✅ Complete
- Database schema: 5 tables (products, pricing_tiers, purchases, license_validations, revenue_events)
- License validation: Server-side (for Supabase Functions) and client-side (for React apps)
- Stripe webhook handler: Checkout, subscriptions, refunds
- Dashboard: Shows purchases, license keys, expiration dates
- Build: Compiles successfully (static export, no API routes)

### Phase 2: Integration Path

#### For Next.js React Apps (Studio, dashboard)
Use the `useLicense()` React hook from `lib/license-system.ts`:

```tsx
import { useLicense } from '@/lib/license-system';

export default function App() {
  const { license, isValidating, error } = useLicense();

  if (isValidating) return <LoadingScreen />;
  if (!license?.valid) return <PurchaseScreen />;

  return <AppContent license={license} />;
}
```

#### For Standalone HTML Apps (HUM, DREAMS, RESONANCE)
Use the standalone `LicenseValidator` class from `public/license-validator.js`:

```html
<script src="/license-validator.js"></script>
<script>
  const validator = new LicenseValidator({
    productId: 'hum',
    onValidated: (license) => { showApp(); },
    onInvalid: (err) => { showPaywall(); }
  });
  validator.validate();
</script>
```

### Stripe Webhook Configuration

**Note:** Since the app uses `output: "export"` (static), API routes are unavailable. 
Use **Supabase Functions** instead:

```bash
cd agent-builder
supabase functions deploy handle-stripe-webhook
```

Configure in Stripe Dashboard:
- **Endpoint URL:** `https://<project-id>.supabase.co/functions/v1/handle-stripe-webhook`
- **Secret:** Set via `wrangler secret put STRIPE_WEBHOOK_SECRET`
- **Events:** checkout.session.completed, customer.subscription.*, charge.refunded

### Products to Integrate (Sequential)

1. **HUM** (AU$30 one-time)
   - Status: Ready (standalone HTML)
   - Action: Wrap with license check + paywall panel

2. **DREAMS** 
   - Status: Ready (standalone HTML)
   - Action: Same pattern as HUM

3. **RESONANCE**
   - Status: Ready (standalone HTML)
   - Action: Same pattern as HUM

4. **HerdCheck** (livestock/)
   - Status: Ready (offline PWA)
   - Action: Add license check to app.js initialization

5. **Reset** (recovery/)
   - Status: Ready (iOS-style PWA)
   - Action: Add license check to app initialization

6. **STARLIGHTMIX Studio** (studio/)
   - Status: Ready (React + Next.js)
   - Action: Wrap root page with useLicense() hook

7. **RHYTHMIX** (main marketing)
   - Status: Review pricing model (possibly different from others)
   - Action: TBD based on business model

### License Validation Flow

1. User accesses app → License validator checks:
   - URL parameter: `?license=LIC-xxxxx`
   - localStorage: `app_license`
   
2. Calls Supabase to validate:
   - Database lookup in `purchases` table
   - Check: status='active' AND (expires_at IS NULL OR expires_at > now)
   
3. If valid: App unlocks, license stored in localStorage
   
4. If invalid: Show purchase link with product_id + tier_id in Stripe checkout metadata

### Pricing Tiers (Configured per Product)

Define in database:
- **HUM:** $30 USD one-time, $5/month subscription option
- **DREAMS:** $20 USD one-time, $3/month subscription option
- etc.

Each product can have multiple tiers (e.g., Basic, Pro, Enterprise).

### Revenue Tracking

All purchases, subscriptions, renewals, and refunds are logged to `revenue_events` table:
- `event_type`: 'purchase' | 'subscription' | 'renewal' | 'refund'
- `amount_usd`: transaction amount
- `stripe_charge_id`: for reconciliation

Query for analytics: `SELECT product_id, SUM(amount_usd) FROM revenue_events WHERE event_type='purchase' GROUP BY product_id`

### Next Steps

1. Deploy Supabase Function for webhooks
2. Create Stripe products + checkout sessions per app
3. Integrate license checking into HUM (first product)
4. Test end-to-end: purchase → license key → app unlock
5. Repeat for remaining 6 products

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Set these in `.env.local` and deploy to Cloudflare.
