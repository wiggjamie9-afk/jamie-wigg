# Payout Configuration & Compliance Guide

## Overview

Configure bank payouts, tax compliance, and regulatory requirements for 28 apps across Stripe, Google Play, and Gumroad.

---

## Part 1: Bank Account Setup

### 1. Primary Bank Account (Australia)

**Step 1.1: Open Business Account**

Required for:
- Stripe payouts
- Gumroad payouts
- Google Play payouts

**Details needed:**
```
Account type: Business / Company
Business name: Rhythmix Apps Pty Ltd
ABN: [Your ABN]
ACN: [Your ACN]
Director name: Jamie Wigg
Address: [Business address in Australia]
```

**Major Australian banks supporting Stripe:**
- Commonwealth Bank
- Westpac
- ANZ
- NAB
- ING Direct

**Recommended: Commonwealth Bank**
- Low fees
- Fast transfers
- Strong Stripe integration

**Step 1.2: Get Bank Details**

Collect:
```
Account holder name: Rhythmix Apps Pty Ltd
Account number: [6-10 digits]
BSB: [3 digits]
Bank name: Commonwealth Bank of Australia
SWIFT code: CTBKAU2S
```

---

## Part 2: Stripe Payout Configuration

### 2. Stripe Bank Account Link

**Step 2.1: Add Bank Account to Stripe**

Dashboard > Settings > Payout Settings

1. Click "Add bank account"
2. Country: Australia
3. Currency: AUD
4. Bank details:
   ```
   Account holder name: Rhythmix Apps Pty Ltd
   Account number: [6-10 digits]
   BSB: [3 digits]
   ```
5. Save

**Step 2.2: Verify Bank Account**

Stripe will deposit 2 small amounts ($0.01–$1.00) to your account.

1. Check bank statement (2–5 business days)
2. Return to Stripe dashboard
3. Enter verification amounts
4. Account verified

**Step 2.3: Payout Schedule**

Dashboard > Settings > Payout Settings > Schedule

```
Payout frequency: Daily (recommended) or Weekly
Payout timing: Next business day
Minimum payout: $1.00
```

**Example:**
```
Friday sales: $200
Payout triggered: Tuesday 9am (next business day)
Arrives in account: Tuesday 2pm (instant transfer in Australia)
```

### 3. Stripe Fees & Net Payouts

**Stripe fee structure:**
```
Transaction fee: 2.9% + $0.30 USD per charge
Subscription fee: 1% per month (recurring billing)
International card: +1% if outside Australia

Example:
- Customer pays: $2.99 USD (app.premium.monthly)
- Stripe fee: 2.9% × $2.99 + $0.30 = $0.39
- You receive: $2.60 per subscription
```

**Monthly payouts example (1,000 active subs):**
```
Monthly revenue: 1,000 subs × $2.99 = $2,990
Stripe fees (approx): ~$380
Net to bank: ~$2,610
```

---

## Part 3: Google Play Payout Configuration

### 4. Google Play Console Setup

**Step 4.1: Link Bank Account**

Google Play Console > Settings > Financial information > Account holder

1. Enter business name: Rhythmix Apps Pty Ltd
2. Enter ABN: [Your ABN]
3. Country: Australia

**Step 4.2: Add Bank Account**

Settings > Payments profile > Add payment method

```
Account type: Business
Country: Australia
Bank: Commonwealth Bank
Account number: [Your account]
BSB: [Your BSB]
```

**Step 4.3: Payout Schedule**

Settings > Payout settings

```
Payout frequency: Monthly
Scheduled payout date: 25th of each month
Currency: AUD or USD (you choose)
```

**Google Play fee structure:**
```
App developer revenue share: 70% (your cut)
Google cut: 30%

Example:
- User pays: $2.99 USD
- Google takes: $0.90
- You receive: $2.09
```

---

## Part 4: Gumroad Payout Configuration

### 5. Gumroad Payouts

**Step 5.1: Set Payout Method**

Dashboard > Settings > Payments

Choose one:
```
Option A: Stripe Connect (Gumroad → Stripe → Bank)
  - Automatic
  - Faster
  - Recommended

Option B: PayPal
  - Manual request
  - Slower

Option C: Bank transfer (direct)
  - Manual
  - Slowest
```

**Step 5.2: Stripe Connect Setup (Recommended)**

1. Gumroad dashboard > Settings > Payments
2. Click "Connect to Stripe"
3. Authorize Gumroad to access your Stripe account
4. Confirm connection
5. Payouts automatically go to your Stripe bank account

**Step 5.3: Manual PayPal Setup**

If not using Stripe Connect:

1. Settings > Payments > PayPal
2. Link PayPal account
3. Request payout anytime (minimum $1)
4. Arrives in 1–3 days

**Gumroad fee structure:**
```
You keep: 92% of revenue (excluding payment processor fees)
Gumroad takes: 8%
Payment processor (Stripe): 2.2% + $0.20 USD

Example:
- Customer pays: $19.99 (lifetime license)
- Gumroad fee: $1.60
- Payment fee: ~$0.64
- You receive: $17.75 (88.8%)
```

---

## Part 5: Multi-Currency & FX Conversion

### 6. Handle Multiple Currencies

**Problem:** Users pay in USD, but you want AUD in bank.

**Solution 1: Multi-currency in Stripe**

```
Stripe detects user location
Charges in their local currency
Converts to your payout currency (AUD)
```

**Step 6.1: Enable multi-currency in Stripe**

Dashboard > Settings > Payout settings > Settlement currency

```
Primary currency: AUD (your bank account is AUD)
Secondary: USD (if customers in US)
Stripe handles FX automatically
```

**FX fees:**
- Stripe charges 1% FX conversion fee
- Example: $100 USD → ~$150 AUD, minus 1% = $148.50

**Solution 2: Fixed USD bank account**

Alternative: Open USD account with Wise.com

```
Wise (formerly TransferWise)
- Convert AUD ↔ USD at real exchange rates
- Lower fees than banks (0.5–1.5%)
- Stripe → Wise account (seconds)
- Wise → Your AUD bank (1 day)
```

---

## Part 6: Tax Compliance

### 7. Australian Tax (ABN Holder)

**Step 7.1: ABN Registration**

If you haven't already:
```
1. Go to abr.gov.au
2. Register your business (ABN)
3. Get ABN certificate
4. Keep records for tax office
```

**Step 7.2: GST Registration**

If turnover > $75,000/year:

```
ATO (Australian Taxation Office)
- Register for GST
- Charge 10% GST on sales (included in price or separate)
- File GST return every quarter
- Get GST back on business expenses
```

**Example with GST:**

```
Price to customer: $2.99 (inclusive of GST)
GST amount: $0.27 (10%)
Your revenue: $2.72
```

**Step 7.3: Income Tax**

App income is:
```
Australian tax resident: Taxed at marginal rate (0–47%)
Foreign resident: 32.5% withholding tax (on Australian income)
Company structure: 25% company tax rate + dividend tax
```

### 8. PAYG Withholding (US Contractors)

If paying US developers / designers:

**W-9 / W-8BEN Forms:**
```
- W-9: US resident providing services
  → You withhold 10% + file 1099-NEC annually
  
- W-8BEN: Non-US resident
  → 0% withholding (treaty benefit)
```

Get these forms from contractors before paying.

---

## Part 7: Regional Pricing & Tax

### 9. VAT/GST by Country

**Configure in Stripe Tax:**

Dashboard > Settings > Stripe Tax

Enable automatic tax calculation:

```
✓ Automatically calculate tax on invoices
✓ Collect tax from customers
✓ File tax reports
```

**Regional tax rates (approximate):**

| Region | Tax Rate | Config in Stripe |
|--------|----------|---|
| Australia | 10% GST | taxable_nature=services |
| UK | 20% VAT | tax_id_type=gb_vat |
| EU | 19–25% VAT | country-specific |
| US | 0–10% sales tax | taxable_nature=digital_goods |
| Canada | 5–15% GST/HST | tax_id_type=ca_gst |

**Exemptions:**
- B2B sales (if customer has VAT ID): usually tax-exempt
- Export outside EU: 0% VAT
- Digital services in EU: VAT applies to customer's country

---

## Part 8: Revenue Split (Multi-party Payouts)

### 10. Stripe Connect (If Revenue Sharing)

If splitting revenue with developers, designers, etc.:

**Example structure:**
```
- Core team (you): 70%
- UI designer: 15%
- Backend engineer: 15%
- Total: 100%
```

**Step 10.1: Set up Stripe Connect**

Admin > Settings > Stripe Connect

Create connected accounts for each person:
```
Designer: acct_design123 → $150/month
Backend: acct_backend456 → $150/month
```

**Step 10.2: Automatic Payouts**

```javascript
// Node.js: When user pays, split automatically
const charge = await stripe.charges.create({
  amount: 2999, // $29.99
  currency: 'usd',
  source: 'tok_visa',
  application_fee_amount: 300, // $3 platform fee
  stripe_account: 'acct_connected_account' // Designer's account
});

// Stripe automatically:
// 1. Takes $3 for you
// 2. Sends $26.99 to designer
```

---

## Part 9: Refund & Chargeback Policy

### 11. Legal Refund Policy

**Step 11.1: Create Refund Policy Document**

Add to your app's TOS:

```markdown
# Refund Policy

## Subscription Refunds
- Within 7 days of first charge: Full refund
- Cancel anytime; refund applied to remaining period
- After 30 days: Non-refundable (permanent subscription)

## Lifetime License Refunds
- Within 30 days of purchase: Full refund
- After 30 days: Non-refundable

## Payment Methods
- Refunds processed to original payment method
- Processing time: 3–5 business days

## How to Request Refund
1. Email support@rhythmix.com with order ID
2. State reason for refund
3. We'll process within 48 hours

## Chargebacks
If you dispute a charge via your bank instead of 
requesting a refund, we may take legal action.
```

**Step 11.2: Store Policy in Stripe**

Dashboard > Settings > Customer emails

Add refund policy to:
```
- Confirmation emails
- Receipt emails
- Invoice footer
```

### 12. Chargeback Protection

**Reduce chargebacks by:**
```
1. Clear billing descriptor (shows "RHYTHMIX" on statement)
2. Send receipt immediately after purchase
3. Provide instant access to product
4. Make refund process obvious (link in app)
5. Dispute fraudulent chargebacks within 30 days
```

**Dispute in Stripe:**

Dashboard > Payments > Disputes

Evidence to provide:
```
1. Customer email / consent to charge
2. Proof of delivery (access grant timestamp)
3. Communication history
4. Refund policy document
```

---

## Part 10: Privacy & Data Compliance

### 13. Privacy Policy Requirements

**Add to your app's privacy policy:**

```markdown
## Payment Information
- We use Stripe / Google Play / Gumroad for payments
- We do NOT store credit card details
- Payment processors store encrypted card data
- You can view/delete payment history [link to processor]

## Data We Collect
- Email address (if user provides)
- Payment history (date, amount, app)
- Device/IP info (for fraud prevention)
- Analytics: page views, button clicks

## User Rights
- Access: Request your data at privacy@rhythmix.com
- Delete: Request data deletion (we'll anonymize after 30 days)
- Portability: Export your data in CSV format
- Opt-out: Disable analytics in app settings

## GDPR Compliance (EU users)
- Legal basis: Legitimate interest (app functionality)
- We do NOT sell data
- Data retention: 2 years max
- You have right to delete / withdraw consent

## CCPA Compliance (California users)
- You can request data deletion
- We will not discriminate if you opt-out
- Contact privacy@rhythmix.com for requests
```

---

## Part 11: International Operations

### 14. Operating in Multiple Countries

**If selling globally:**

| Country | Tax ID | Requirement |
|---------|--------|---|
| Australia | ABN | Register GST |
| US | EIN | Federal tax ID (optional, but recommended) |
| UK | EORI | Brexit customs (if B2B) |
| EU | VAT ID | Register for VAT if > €10k sales |
| Canada | BN | HST registration |

**Recommendation:** Use Stripe Tax (handles complexity automatically)

---

## Part 12: Audit & Compliance Trail

### 15. Record Keeping

**Keep records for 5 years:**

```
- Bank statements (all deposits)
- Stripe/Gumroad statements (monthly CSV exports)
- Tax returns & ATO correspondence
- Refund records
- Chargeback disputes
- Payment processing agreements
```

**Create automated records:**

```javascript
// Monthly export script (runs 1st of month)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function exportMonthlyReport() {
  const charges = await stripe.charges.list({
    limit: 100,
    created: {
      gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
      lt: Math.floor(Date.now() / 1000)
    }
  });

  const csv = 'Date,Customer,Amount,Status,Fee\n';
  charges.data.forEach(charge => {
    csv += `${new Date(charge.created * 1000).toISOString()},"${charge.customer}","${charge.amount / 100}","${charge.status}","${charge.fee_details ? charge.fee_details[0].amount / 100 : 0}"\n`;
  });

  // Save to storage
  fs.writeFileSync(`reports/stripe_${new Date().toISOString().split('T')[0]}.csv`, csv);
}

// Schedule via cron or serverless
```

---

## Part 13: ATO Reporting

### 16. Annual Tax Return (ITR)

**If operating as sole trader:**

```
Form: Individual Income Tax Return (ITR)
Due: 31 October (previous financial year)
Includes:
- Business income (total sales - refunds)
- Deductible expenses (server costs, tools, ads)
- Net profit
- GST collected/paid (if registered)
```

**If operating as company:**

```
Form: Company Tax Return (CT)
Due: 31 October
Includes:
- Company profit
- Director salary (if applicable)
- Dividend payments
- Net profit @ 25% company tax
```

**Expense categories (deductible):**
```
- Hosting / CDN / cloud services
- Payment processor fees (Stripe, Google)
- Design / development tools
- Advertising (acquisition costs)
- Professional services (accounting, legal)
- Office supplies
- Insurance
- NOT deductible: personal use, clothing, entertainment
```

---

## Part 14: Monthly Payout Checklist

**1st of month:**
- [ ] Check all three payout accounts (Stripe, Google Play, Gumroad)
- [ ] Reconcile with GA4 revenue numbers
- [ ] Export invoices (for accounting)

**Monthly (any day):**
- [ ] Review refund requests
- [ ] Dispute chargebacks (if any)
- [ ] Monitor payment failures

**Quarterly:**
- [ ] GST return (if registered)
- [ ] Tax provision (set aside 25–47% of profit)
- [ ] PAYG withholding (if applicable)

**Annually:**
- [ ] Full tax reconciliation
- [ ] ATO income tax return
- [ ] Update all processor agreements
- [ ] Audit expense records

---

## Part 15: Troubleshooting Payouts

| Issue | Solution |
|-------|----------|
| Stripe payout delayed | Check bank account verification; contact Stripe support |
| Money stuck in Google Play | Google holds 30 days; automatic release after |
| FX rates too high | Use Wise for conversion instead of bank |
| Chargeback received | Dispute within 30 days with evidence in Stripe |
| Tax audit notice | Contact accountant immediately; provide all receipts |
| Refund not processing | Check if refund window passed (varies by processor) |

---

## Final Payout Configuration Summary

| Platform | Bank Setup | Payout Schedule | Fee | Verification |
|----------|---|---|---|---|
| Stripe | CBA AUD | Daily | 2.9% + $0.30 | 2–5 days |
| Google Play | CBA AUD | 25th monthly | 30% | Manual |
| Gumroad | Stripe Connect | Auto | 8% | Instant |

**Total expected fees (28 apps, $12,000/month revenue):**
```
Stripe: 2.9% × 12,000 = $348
Google Play: 30% × 12,000 = $3,600
Gumroad: 8% × 12,000 = $960
Total platform fees: $4,908 (41% of revenue)

Net to bank: ~$7,092/month
```

---

## Recommended Sequence for Launch

1. ✓ Open AUD business bank account
2. ✓ Register ABN (if not done)
3. ✓ Register GST (if turnover > $75k)
4. ✓ Link bank to Stripe
5. ✓ Verify Stripe account (small transfers)
6. ✓ Enable Stripe multi-currency + tax
7. ✓ Link Google Play Console
8. ✓ Set up Gumroad payouts
9. ✓ Create privacy policy + refund policy
10. ✓ Document all processor agreements
11. ✓ Go live
12. ✓ Monthly: export & reconcile
13. ✓ Quarterly: file GST
14. ✓ Annually: tax return + audit trail
