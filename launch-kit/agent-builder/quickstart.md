# Agent Builder: 10-Minute Quickstart

Get your first AI agent running in 10 minutes.

---

## Step 1: Sign Up (1 min)

1. Go to **[app.agentbuilder.com](https://app.agentbuilder.com)**
2. Click **Sign Up**
3. Enter email + password (or use Google/GitHub OAuth)
4. Verify email (check your inbox)

**Done**: You're in the dashboard.

---

## Step 2: Create Your First Agent (3 min)

1. Click **+ New Agent**
2. **Pick a type** from 6 templates:
   - **Code Review**: Analyze pull requests for bugs, style, security
   - **Document Processing**: Extract data, summarize, classify documents
   - **Research**: Gather, synthesize, and cite sources
   - **Security Audit**: Scan code for vulnerabilities
   - **Data Analysis**: Process CSV/JSON, generate insights
   - **Customer Support**: Build a chatbot for FAQs
   
   → Select **Code Review** for this quickstart

3. Click **Next**

---

## Step 3: Configure Your Agent (2 min)

Fill in the form:

| Field | Example | Notes |
|-------|---------|-------|
| **Agent Name** | "PR Code Reviewer" | Used internally; can change later |
| **Description** | "Reviews Python PRs for style and bugs" | Shows in your agent list |
| **Model** | Claude Opus (default) | Options: Opus, Sonnet, Haiku |
| **Temperature** | 0.3 | Lower = more consistent, higher = more creative |
| **Max Tokens** | 4,096 | Output length limit |

**Leave other fields as defaults** (we'll fine-tune later).

Click **Next**.

---

## Step 4: Copy Your Agent Prompt (2 min)

The builder shows a **pre-written system prompt** for Code Review agents:

```
You are an expert code reviewer. Analyze pull requests for:
1. Bugs and logic errors
2. Security vulnerabilities
3. Code style and best practices
4. Performance issues

Provide concise, actionable feedback per issue.
```

**Option A** (Easiest): Use the default prompt → Click **Next**

**Option B** (Custom): Edit the prompt in the text box, then click **Next**

---

## Step 5: Test Your Agent (2 min)

You now see the **Agent Playground**:

```
Your Agent: "PR Code Reviewer"
Model: Claude Opus
Temperature: 0.3
```

Click in the **Message box** and paste a code snippet:

```python
def calculate_total(items):
    total = 0
    for item in items:
        total = total + item.price * item.quantity
    return total

# Call the function
total = calculate_total(shopping_cart)
print(f"Total: ${total}")
```

Click **Send** (or press Enter).

**The agent responds** with code review feedback in 5–15 seconds:

```
Feedback:
1. Missing error handling - what if items is None?
2. Could use sum() with a generator expression for clarity
3. No input validation for negative prices
4. Consider using a dataclass instead of ad-hoc item objects
```

---

## Step 6: Deploy Your Agent (done!)

After testing, click **Save & Deploy**.

Your agent now has:
- ✅ **Unique ID**: `agent-xyz123` (shown on the page)
- ✅ **API endpoint**: `https://api.agentbuilder.com/v1/agents/agent-xyz123/invoke`
- ✅ **API key**: Visible in your **Account Settings** > **API Keys**

---

## Next: Call Your Agent via API (5 min bonus)

### Get your API key

1. Click your **avatar** (top right) → **Account Settings**
2. Click **API Keys**
3. Click **+ Generate Key**
4. Copy the key (you'll only see it once)

### Make your first API call

**Option A: cURL**

```bash
curl -X POST https://api.agentbuilder.com/v1/agents/agent-xyz123/invoke \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Review this code for bugs: def foo(x): return x * 2",
    "stream": false
  }'
```

**Option B: JavaScript/Node.js**

```javascript
const apiKey = 'YOUR_API_KEY';
const agentId = 'agent-xyz123'; // from your dashboard

const response = await fetch(
  `https://api.agentbuilder.com/v1/agents/${agentId}/invoke`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: 'Review this code: def foo(x): return x * 2',
      stream: false
    })
  }
);

const { result, tokens_used } = await response.json();
console.log('Feedback:', result);
console.log('Tokens:', tokens_used);
```

**Option C: Python**

```python
import requests

api_key = 'YOUR_API_KEY'
agent_id = 'agent-xyz123'

response = requests.post(
    f'https://api.agentbuilder.com/v1/agents/{agent_id}/invoke',
    headers={
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    },
    json={
        'prompt': 'Review this code: def foo(x): return x * 2',
        'stream': False
    }
)

result = response.json()
print(f"Feedback: {result['result']}")
print(f"Tokens used: {result['tokens_used']}")
```

**Response** (in ~2–5 seconds):

```json
{
  "result": "This code is simple and correct. Consider adding type hints for clarity: def foo(x: int) -> int: return x * 2",
  "tokens_used": 87,
  "cost_usd": 0.0013
}
```

---

## Key Features to Explore Next

### 1. **Agent Library** (Dashboard)
   - See all your agents
   - Clone an agent template
   - View usage stats + costs

### 2. **Fine-Tuning** (Agent Settings)
   - Adjust temperature, max tokens
   - Edit system prompt
   - Add custom tools (in Pro plan)

### 3. **Streaming** (Advanced)
   Set `"stream": true` in API calls to get real-time responses:
   
   ```javascript
   const response = await fetch(`...invoke`, {
     method: 'POST',
     body: JSON.stringify({ prompt: '...', stream: true })
   });
   
   const reader = response.body.getReader();
   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     console.log(new TextDecoder().decode(value)); // chunk of response
   }
   ```

### 4. **Analytics** (Dashboard > Analytics)
   - Track requests per day
   - Monitor success rates
   - View cost breakdown by agent

### 5. **Billing** (Account Settings > Billing)
   - Choose your plan: Starter ($500/mo), Pro ($1,500/mo), Addon ($500/mo)
   - View invoices
   - Set usage limits

---

## Pricing at a Glance

| Plan | Cost | Agents | API Calls/Day | Tools | Support |
|------|------|--------|---------------|-------|---------|
| **Starter** | $500/mo | 5 | 10k | Basic | Email |
| **Pro** | $1,500/mo | Unlimited | 100k | Advanced | Priority |
| **Addon** | $500/mo | +5 agents | +10k calls | 1 tool | N/A |

**No setup fees**. Cancel anytime.

---

## Troubleshooting

**Q: I get a 401 "Unauthorized" error**
- Check that your API key is correct (in Account Settings > API Keys)
- Make sure you're using `Bearer YOUR_API_KEY` in the Authorization header
- API keys expire after 90 days; regenerate if needed

**Q: API calls are slow (>10 sec)**
- Check your internet connection
- Verify the agent model is appropriate (Haiku is fastest)
- Check if you're hitting rate limits (429 responses)

**Q: I want to use a different Claude model**
- Open your agent → Settings → Model
- Choose Claude Sonnet or Haiku (Opus is default)
- Click Save

**Q: How do I delete an agent?**
- Dashboard → Select agent → ⋮ menu → Delete
- Deletion is permanent; confirm before proceeding

**Q: Can I invite team members?**
- Pro plan feature coming soon (currently in beta)
- Contact support@agentbuilder.com to enable early access

---

## Learn More

- **Full API Docs**: [docs.agentbuilder.com/api](https://docs.agentbuilder.com/api)
- **Deployment Guide**: [launch-kit/agent-builder/deployment-guide.md](./deployment-guide.md)
- **Agent Templates**: Built into the UI; no setup needed
- **Community**: Join our Slack at [slack.agentbuilder.com](https://slack.agentbuilder.com)
- **Support**: Email support@agentbuilder.com

---

## You Did It! 🎉

You've:
- ✅ Created an AI agent (Code Review)
- ✅ Configured it with a system prompt
- ✅ Tested it in the playground
- ✅ Called it via API
- ✅ Got your first structured response

**Next**: Build a second agent of a different type, or integrate into your app using the API.

Enjoy!
