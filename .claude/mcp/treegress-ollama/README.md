# Treegress Browser MCP + Ollama Checkout Automation

LLM-powered browser automation for checkout flows. Runs locally on your laptop using Ollama (free) + Playwright.

## Quick Start (30 seconds)

```bash
# 1. Install Ollama
# https://ollama.ai/download

# 2. Pull a model
ollama pull mistral

# 3. Start Ollama
ollama serve

# 4. Set your .env
echo "OLLAMA_API_URL=http://localhost:11434" >> .env
echo "OLLAMA_MODEL=mistral" >> .env

# 5. In Claude Code, use the MCP:
browser_open { url: "https://shop.example.com/checkout" }
checkout_analyze {}
checkout_fill_profile { profileName: "default" }
checkout_confirm { submitButtonRefId: "ref_42" }
```

## What It Does

- **`browser_open`**: Launch Chromium and navigate to a URL
- **`browser_snapshot`**: Capture full DOM tree with refIds (use refIds to target elements)
- **`browser_interact`**: Click, fill, or select by refId
- **`checkout_analyze`**: Use Ollama to parse the form and detect fields
- **`checkout_fill_profile`**: Auto-fill form fields from a saved profile (with approval gate)
- **`checkout_confirm`**: Submit the form
- **`profile_save`**: Save a reusable checkout profile
- **`browser_close`**: End session

## Key Features

✅ **No cloud dependencies** — Ollama runs locally; your checkout data never leaves your machine
✅ **Approval gates** — Before final submission, waits for your manual OK
✅ **Profile-based** — Save "Jamie", "Mom", "Business" profiles and reuse across stores
✅ **Smart form parsing** — Ollama automatically detects required fields and their types
✅ **refId targeting** — Full DOM tree with unique IDs for precise element interaction

## Supported Checkouts

- Shopify
- WooCommerce
- Stripe Checkout
- Custom HTML forms

## Example Workflow

```javascript
// Step 1: Open the checkout page
browser_open { url: "https://example-shop.com/checkout" }

// Step 2: Take a snapshot of the form
browser_snapshot {}
// Returns:
// {
//   "tree": { ... full DOM tree ... },
//   "refMap": { "ref_5": "input[name='firstName']", ... }
// }

// Step 3: Analyze the form with Ollama
checkout_analyze { profile: "default" }
// Returns:
// {
//   "fields": [
//     { "label": "First Name", "refId": "ref_5", "type": "text", "required": true },
//     { "label": "Email", "refId": "ref_12", "type": "email", "required": true },
//     ...
//   ]
// }

// Step 4: Fill fields from a saved profile
checkout_fill_profile { profileName: "default", autoApprove: false }
// Fills firstName, email, phone, address from "default" profile
// Stops and waits for approval

// Step 5: Review in browser, then approve
// ✓ All fields filled correctly? ✓ Promo code applied?

// Step 6: Confirm submission
checkout_confirm { submitButtonRefId: "ref_42" }
// Places the order
```

## Saved Profiles

Profiles are stored in `checkout-profiles.json` (not pushed to git):

```json
{
  "default": {
    "firstName": "Jamie",
    "lastName": "Wigg",
    "email": "jamie.jack.28@hotmail.com",
    "phone": "+61412345678",
    "address": "123 Example Street",
    "city": "Sydney",
    "state": "NSW",
    "postcode": "2000",
    "country": "AU"
  },
  "business": {
    "companyName": "Jamie Wigg Studios",
    "contactName": "Jamie Wigg",
    "email": "business@rhythmixapp.com.au",
    ...
  }
}
```

Create new profiles with:

```javascript
profile_save {
  profileName: "mom_birthday",
  data: {
    firstName: "Susan",
    lastName: "Wigg",
    email: "mom@example.com",
    ...
  }
}
```

## Troubleshooting

**Ollama connection failed**
```bash
ollama serve  # Start Ollama in another terminal
```

**Ollama returns malformed JSON**
- Try a different model: `ollama pull neural-chat`
- Update `.env`: `OLLAMA_MODEL=neural-chat`

**Form has dynamic fields (appears after selection)**
- Re-run `browser_snapshot` and `checkout_analyze` to detect new fields
- Ollama will only see currently visible fields

**Too slow**
- Use `orca-mini` (2.7 GB, very fast): `ollama pull orca-mini`

## Architecture

### DOM Serialization (Treegress)

When you call `browser_snapshot`, the MCP:
1. Traverses the DOM tree (max depth 10)
2. Assigns refIds to interactive elements
3. Preserves attributes (classes, IDs, placeholders, aria labels)
4. Returns JSON tree + refMap

### Ollama Integration

When you call `checkout_analyze`, the MCP:
1. Sends the DOM tree to Ollama as JSON
2. Prompts Ollama: "Parse this form and list all checkout fields"
3. Ollama reasons about the structure
4. Returns JSON with detected fields + their refIds

### Approval Gate

Before `checkout_confirm`, you manually review:
- Did all fields fill correctly?
- Are there any errors or warnings?
- Is the total price correct?

This prevents accidental purchases.

## Performance

On a 2021 MacBook Pro with Ollama (mistral):
- DOM serialization: 50 ms
- Ollama form analysis: 1.2 s (first), 200 ms (cached)
- Field filling: 100 ms per field
- **Total checkout: 3–5 seconds**

Repeat purchases: 2–3 seconds

## Full Documentation

See `TREEGRESS-OLLAMA-SETUP.md` for:
- Detailed setup instructions
- API reference
- Workflow examples
- Advanced configuration
- Security & privacy notes
