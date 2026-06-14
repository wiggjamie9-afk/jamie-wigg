# Anthropic API Billing Setup Guide

For organizational use where the company/client covers API costs.

## Quick Start: Enable Billing

### Step 1: Access Billing Settings
1. Log in to https://console.anthropic.com
2. Click **Settings** (bottom left)
3. Select **Billing & Plans**
4. Or go directly to: https://console.anthropic.com/account/billing/overview

### Step 2: Add Payment Method
1. Click **Add Payment Method**
2. Enter credit card details:
   - Card number
   - Expiration date
   - CVC
   - Billing zip code
3. Click **Save**

### Step 3: Confirm Active Status
1. You should see "✓ Payment method added"
2. Your account is now **active** and can use the API
3. Usage charges will be billed to this card

### Step 4: Start Using OpenManus
```bash
cd openmanus
source venv/bin/activate
python main.py
```

## Billing & Costs

### Pricing (Claude 3.7 Sonnet - as of 2026-06-14)

| Component | Cost |
|-----------|------|
| Input tokens | $3 per 1M tokens |
| Output tokens | $15 per 1M tokens |

**Example costs:**
- 1000 requests with 500 input + 500 output tokens each
- Input: (1000 × 500) ÷ 1,000,000 × $3 = $1.50
- Output: (1000 × 500) ÷ 1,000,000 × $15 = $7.50
- **Total: ~$9.00**

### Monitor Usage

Check your current usage and costs:
- **Console**: https://console.anthropic.com/account/usage
- Updates every hour
- Shows costs by model and day

## Organization Setup (Optional)

### Create Organization (for team billing)
1. Go to: https://console.anthropic.com/settings/organizations
2. Click **Create Organization**
3. Enter organization name
4. Add team members (optional)
5. Set up separate billing for the org

### Set Spending Limits
1. Go to **Billing & Plans**
2. Look for **Spending Limits** or **Budget Controls**
3. Set monthly/daily limit
4. Choose action when limit reached:
   - Soft limit (warning)
   - Hard limit (block requests)

## Account Management

### View Invoices
1. Go to: https://console.anthropic.com/account/billing/invoices
2. Download PDF invoices
3. View payment history

### Change Payment Method
1. Go to **Billing & Plans**
2. Click gear icon next to payment method
3. Select **Update Card**
4. Enter new card details

### Cancel Subscription / Stop Charges
1. Go to **Billing & Plans**
2. Click **Manage Subscription**
3. Select **Cancel** (to stop future charges)
- Note: Existing API keys will still work if you manually remove them

## Troubleshooting

### "Credit balance too low"
- **Cause**: No payment method added
- **Fix**: Add payment method (see Step 2 above)
- **Wait**: 1-2 minutes for activation

### "Payment declined"
- **Cause**: Card issuer rejected charge
- **Fix**: 
  - Update payment method
  - Contact card issuer
  - Try different card

### "Organization not found"
- **Cause**: Org not set up yet
- **Fix**: Create organization first (see Organization Setup)

### Can't access Billing section
- **Cause**: Insufficient permissions
- **Fix**: 
  - Must be account owner or admin
  - Ask account owner to add payment method
  - Request admin access

## Security Notes

✅ **Payment info is encrypted**
- PCI DSS Level 1 compliant
- Card data never stored in plaintext

✅ **API keys are separate**
- Billing doesn't expose API keys
- Keys managed separately at: https://console.anthropic.com/account/keys

⚠️ **Protect your API key**
- Don't commit to git
- Don't share in Slack/email
- Rotate periodically
- Revoke unused keys

## Enterprise Billing

For high-volume usage (>$10k/month):
- Contact: https://www.anthropic.com/contact-sales
- Get custom pricing
- Dedicated account manager
- Volume discounts available

## Support

- **Billing Issues**: support@anthropic.com
- **API Issues**: https://docs.anthropic.com/support
- **Status**: https://status.anthropic.com

---

## Next Steps

1. ✅ Add payment method (5 minutes)
2. ✅ Wait for activation (1-2 minutes)
3. ✅ Run: `python main.py`
4. ✅ Check usage at: https://console.anthropic.com/account/usage

**The API is ready to use as soon as billing is enabled!**

---

**Setup Date**: 2026-06-14  
**OpenManus Status**: Configured and waiting for billing  
**Ready**: Yes, after payment method added
