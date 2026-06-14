# Getting Your Anthropic Claude API Key for OpenManus

This guide walks you through obtaining an API key and configuring OpenManus to use it.

## Step 1: Create/Access Your Anthropic Account

### If you don't have an account:
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Click **Sign Up**
3. Enter your email and create a password
4. Verify your email address
5. Add payment information (required for API access)

### If you already have an account:
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign in with your credentials

## Step 2: Navigate to API Keys

1. Log in to [console.anthropic.com](https://console.anthropic.com)
2. Click your **Profile** (top right corner)
3. Select **API Keys** from the dropdown menu
4. Or navigate directly to: `https://console.anthropic.com/account/keys`

## Step 3: Create a New API Key

1. Click the **Create Key** button
2. Enter a descriptive name (e.g., "OpenManus Integration" or "Development")
3. Click **Create**
4. **IMPORTANT:** Copy the key immediately - you won't be able to see it again!
   - The key format starts with `sk-ant-`
   - Example: `sk-ant-api03-R2D...igAA`

## Step 4: Configure OpenManus

### Option A: Direct File Edit (Recommended)

1. Open the OpenManus config file:
   ```bash
   nano openmanus/config/config.toml
   ```

2. Find this section:
   ```toml
   [llm]
   model = "claude-3-7-sonnet-20250219"
   base_url = "https://api.anthropic.com/v1/"
   api_key = "YOUR_API_KEY"
   max_tokens = 8192
   temperature = 0.0
   ```

3. Replace `YOUR_API_KEY` with your actual key:
   ```toml
   api_key = "sk-ant-api03-R2D...igAA"
   ```

4. Save the file:
   - Press `Ctrl+X` → `Y` → `Enter` (if using nano)

### Option B: Environment Variable

Alternatively, set the API key as an environment variable:

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-R2D...igAA"
```

Then in `config.toml`, you can reference it:
```toml
api_key = "${ANTHROPIC_API_KEY}"
```

### Option C: Command Line (for testing)

```bash
cd openmanus
source venv/bin/activate
ANTHROPIC_API_KEY="sk-ant-api03-R2D...igAA" python main.py
```

## Step 5: Verify Configuration

Test that OpenManus can connect to the API:

```bash
cd openmanus
source venv/bin/activate
python -c "
from app.config import config
print('✓ Config loaded successfully')
print(f'✓ Model: {config.llm_settings.model}')
print(f'✓ API Key configured: {bool(config.llm_settings.api_key)}')
"
```

Expected output:
```
✓ Config loaded successfully
✓ Model: claude-3-7-sonnet-20250219
✓ API Key configured: True
```

## Step 6: Test with OpenManus

```bash
cd openmanus
source venv/bin/activate
python main.py
```

You should see the OpenManus interface load without authentication errors.

## API Key Management

### View Your Keys

```bash
curl https://api.anthropic.com/v1/organizations/api_keys \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"
```

### Deactivate a Key (if compromised)

1. Log in to [console.anthropic.com](https://console.anthropic.com)
2. Go to **API Keys**
3. Find the key you want to deactivate
4. Click the three dots (**⋮**)
5. Select **Deactivate**

### Delete a Key

1. Follow steps 1-4 above
2. Select **Delete** from the menu

## Security Best Practices

### ✅ DO:
- Store your key in `config/config.toml` (which is gitignored)
- Use environment variables for CI/CD pipelines
- Rotate keys regularly
- Use separate keys for development and production
- Deactivate keys you no longer use

### ❌ DON'T:
- Commit your API key to Git
- Share your key in Slack, email, or public channels
- Use the same key across multiple projects
- Store keys in version control
- Hardcode keys in source code

## Pricing & Limits

### Billing
- Pay-as-you-go pricing based on input and output tokens
- No upfront costs or minimum spend
- View costs in [console.anthropic.com/account/usage](https://console.anthropic.com/account/usage)

### Rate Limits
- **Free tier:** Limited requests
- **Paid tier:** Higher limits based on usage tier
- Check your limits at: [console.anthropic.com/account/limits](https://console.anthropic.com/account/limits)

## Models Available

As of the OpenManus setup:

| Model | Context | Input Cost | Output Cost |
|-------|---------|-----------|------------|
| claude-3-7-sonnet-20250219 | 200K | $3/1M | $15/1M |
| claude-3-7-opus-20250219 | 200K | $15/1M | $75/1M |
| claude-3-7-haiku-20250219 | 200K | $0.80/1M | $4/1M |

Switch models by editing the `model` field in `config.toml`.

## Troubleshooting

### "Invalid API Key" Error
- [ ] Check that your key starts with `sk-ant-`
- [ ] Verify you copied the entire key (no spaces before/after)
- [ ] Confirm the key hasn't expired in the console
- [ ] Check that you have billing enabled

### "Authentication Failed" Error
- [ ] Ensure the API key is in the correct format
- [ ] Verify the `base_url` is correct: `https://api.anthropic.com/v1/`
- [ ] Check that the key is active (not deactivated/archived)

### "Rate Limited" Error
- [ ] Wait a few moments before retrying
- [ ] Check your rate limits in the console
- [ ] Consider upgrading your account tier

### Config File Won't Load
- [ ] Verify `config.toml` syntax (use `python -m tomli config.toml`)
- [ ] Check file permissions (should be readable)
- [ ] Ensure all required fields are present

## Getting Help

- **Anthropic Docs:** [docs.anthropic.com](https://docs.anthropic.com)
- **Console:** [console.anthropic.com](https://console.anthropic.com)
- **API Reference:** [api.anthropic.com/docs](https://api.anthropic.com/docs)
- **Support:** [support.anthropic.com](https://support.anthropic.com)

---

**Setup Guide Created:** 2026-06-14  
**For:** OpenManus Integration  
**API:** Anthropic Claude
