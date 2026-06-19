# Free & Low-Cost LLM API Providers (Global + China)

**48+ platforms** offering free API quotas, tokens, or low-cost coding subscriptions. Last updated: 2026-06-19.

📌 **For quick integration:** See `.env` for primary keys. See `/lib/llm-router.js` (or `.py`) to switch between providers.

---

## 🔥 Top Picks by Use Case

### Maximum Free Quota (No Expiration)
1. **美团 (Meituan/LongCat)** — 55M tokens/day, permanent
2. **Groq** — 14,400 Llama calls/day, permanent
3. **Cerebras** — 1M tokens/day, permanent
4. **硅基流动 (SiliconFlow)** — 200M tokens, permanent (after signup)
5. **Google AI Studio** — Permanent free tier (RPM-limited)

### Best First Month Deal
- **火山引擎 (VolcanoEngine) Lite** — ¥9.9/month (first 2 months at 75% off)
- **智谱 GLM Lite** — ¥9.9/month (first month)
- **阿里云百炼 Pro** — ¥39.9/month (first month)

### Lowest Monthly Subscription
- **科大讯飞 (iFlytek) Lite** — ¥3.9/month ⭐
- **无问芯穹 Lite** — ¥19.9/month
- **火山引擎 Lite** — ¥40/month

### Best for Coding/Agent Workflows
- **火山引擎 Pro** — 6,000 calls/5h + DeepSeek-V4 + Auto routing
- **阿里百炼 Pro** — 8 model options (Qwen, Kimi, GLM) + 90k calls/month
- **智谱 GLM Max** — Closest to Claude Opus quality

### Fastest Inference
- **Groq** — LPU hardware acceleration
- **Cerebras Code** — Wafer-scale chip

---

## 📋 Platform Categories

### Tier 1: Permanent Free Layers (No Expiration)

| Platform | Free Quota | Model | Best For |
|----------|-----------|-------|----------|
| 美团 LongCat | 55M tokens/day | LongCat-Flash-Lite | General chat (unlimited) |
| Groq | 14,400/day (Llama), 1,000/day (DeepSeek) | Llama, DeepSeek, GPT-OSS | Speed-critical |
| Cerebras | 1M tokens/day | Llama 4, Qwen, DeepSeek | Reasoning + speed |
| 硅基流动 | 200M tokens permanent | DeepSeek V3/R1, Qwen, GLM | Variety + permanence |
| Google AI Studio | Permanent tier | Gemini models | Vision + multimodal |
| NVIDIA NIM | ~40 calls/min | Llama, Nemotron | Enterprise use |
| OpenRouter | 27+ free models | Auto-select | Multi-model variety |
| Groq/Cerebras | 100M tokens/month | Mix | Research |
| 智谱 GLM | 20M tokens | GLM-4-Flash | OpenAI compat |

### Tier 2: Time-Limited Free Credits (Common Registration Offer)

| Platform | Initial Credit | Expiration | Model |
|----------|---|---|---|
| 阿里云百炼 | 70M tokens | 90 days | Qwen + 8 models |
| 百度千帆 | 1M tokens + ¥20 | 3 months | Ernie, etc. |
| 腾讯云混元 | 1M tokens | 1 year | Hunyuan |
| 科大讯飞 | Lite API permanent | Permanent | Spark |
| 火山引擎 | 0.5-1M tokens | Permanent | Doubao, DeepSeek |
| MiniMax | Token credits | 90 days | M3, M2.7 |
| DeepSeek | 5M tokens | 30 days | DeepSeek V4/R1 |

### Tier 3: Coding Subscriptions (Monthly Fixed Fee)

| Platform | Lite Price | Lite Quota | Pro Price | Pro Quota |
|----------|-----------|-----------|----------|----------|
| 科大讯飞 | ¥3.9/mo | Per-request limit | ¥39/mo | Higher |
| 无问芯穹 | ¥19.9/mo | 12k calls/mo | ¥149/mo | 60k calls/mo |
| 火山引擎 | ¥40/mo | 1,200 calls/5h | ¥200/mo | 6,000 calls/5h |
| 智谱 GLM | ¥49/mo | 80 calls/5h | ¥149/mo | Higher tier |
| 阿里百炼 | ¥40/mo (discontinued) | — | ¥200/mo | 90k calls/mo |
| MiniMax | ¥49/mo | ~1M tokens/mo | ¥119/mo | Higher |
| Cerebras Code | $50/mo | ~24M tokens/day | $200/mo | ~120M tokens/day |

---

## 🔑 How to Get Keys

### Quick Start (No Credit Card)

1. **SiliconFlow** → Sign up, verify identity → get 200M tokens instantly
2. **Groq** → Sign up (email only) → instant free tier
3. **Meituan LongCat** → Phone login → claim 55M/day
4. **Cerebras** → Sign up → activate free tier
5. **Google AI Studio** → Google login → instant Gemini access

### Chinese Platforms (Require ID Verification)

1. **火山引擎** → Alipay/WeChat → real-name verification → claim ¥40 credit
2. **阿里云百炼** → Alibaba login → verify ID → 70M tokens/90 days
3. **智谱 GLM** → Email + phone → 20M permanent tokens
4. **DeepSeek** → Email only → 5M tokens/30 days

---

## 🔄 Integration Patterns

### Pattern 1: Load-Balance Between Providers

```javascript
const router = require('./lib/llm-router');

// Try primary, fallback to secondary, tertiary...
const response = await router.chat("Your prompt", {
  providers: ['groq', 'siliconflow', 'meituan'],
  model: 'llama-3.1-70b'  // fallback model
});
```

### Pattern 2: Cost-Aware Provider Selection

```python
from lib.llm_router import select_cheapest

provider = select_cheapest(
    budget_cents=10,  # Max $0.10 per call
    models=['gpt-4-level', 'claude-level'],
    min_rpm=5  # At least 5 requests/min
)
```

### Pattern 3: Quota Monitoring

```bash
# Check remaining quota for all providers
node scripts/check-quotas.js

# Output:
# groq: 14,400 calls remaining (resets daily)
# meituan: 55M tokens remaining (resets daily)
# cerebras: 1M tokens remaining (resets daily)
# siliconflow: 150M tokens remaining (permanent)
```

---

## 📊 Recommended Stacks

### Stack 1: Maximum Free (No Subscriptions)

**Primary:** Meituan LongCat (55M tokens/day)  
**Secondary:** Groq (14k Llama calls/day)  
**Tertiary:** Cerebras (1M tokens/day)  
**Cost:** $0/month  
**Use case:** Unlimited experimentation

### Stack 2: Minimal Monthly Cost + Premium Quality

**Primary:** 科大讯飞 Lite (¥3.9/mo)  
**Secondary:** Meituan LongCat (free)  
**Tertiary:** Groq (free)  
**Cost:** ¥3.9/month (~$0.50 USD)  
**Use case:** Budget hacker + fallback redundancy

### Stack 3: Coding/Agent Optimization

**Primary:** 火山引擎 Pro (¥200/mo, 6k calls/5h, DeepSeek-V4)  
**Secondary:** 阿里百炼 Pro (¥200/mo, 8 models, 90k calls/mo)  
**Tertiary:** Groq (free for Llama)  
**Cost:** ¥400/month (~$56 USD)  
**Use case:** Full-time AI developer

### Stack 4: RHYTHMIX-Optimized (Video + Creative)

**Promo Scripts:** 智谱 GLM (permanent ¥49/mo Lite)  
**Image Gen:** Meituan + SiliconFlow  
**Video Analysis:** Groq (fast inference)  
**Fallback:** Cerebras  
**Cost:** ¥49/month + free tier credits  
**Use case:** Video/content creator

---

## ⚙️ Configuration

### .env Template

```bash
# Primary providers (free tier after signup)
GROQ_API_KEY=gsk_...
MEITUAN_API_KEY=mk_...
CEREBRAS_API_KEY=csk_...
SILICONFLOW_API_KEY=sk_...

# Chinese platforms (requires ID verification)
VOLCANOENGINE_API_KEY=...
ALIYUN_API_KEY=...
ZHIPUAI_API_KEY=...
DEEPSEEK_API_KEY=...

# Paid coding plans (optional)
VOLCANOENGINE_CODING_PLAN=true  # Auto-use Pro tier
ALIDUYUN_CODING_PLAN=true
ZHIPUAI_CODING_PLAN=true

# Router strategy
LLM_ROUTER_STRATEGY=cost-aware  # or 'speed-first', 'quality-first'
LLM_FALLBACK_CHAIN=groq,cerebras,meituan,siliconflow
```

### Setup Script

```bash
# 1. Generate provider config
node scripts/setup-providers.js

# 2. Verify all keys work
node scripts/verify-keys.js

# 3. Show available quota
node scripts/check-quotas.js

# 4. Set preferred routing strategy
echo "LLM_ROUTER_STRATEGY=cost-aware" >> .env
```

---

## 🚀 Quick Commands (for RHYTHMIX)

```bash
# Generate promo script (auto-selects best provider)
node -e "require('./lib/llm-router').chat('Write 60s promo for electronic music')"

# Generate via specific provider
node -e "require('./lib/llm-router').chat(..., {provider: 'zhipuai'})"

# Check if any provider has quota available
node -e "require('./lib/llm-router').hasQuota()"

# Rotate through providers for load balance
for i in {1..10}; do node -e "require('./lib/llm-router').chat(...)"; done
```

---

## ⚠️ Important Notes

1. **Quota Management** — Most free tiers have daily/monthly resets. Set up cron jobs to monitor.
2. **Rate Limits** — Free tiers often have RPM/TPM caps. Use queue/batch when possible.
3. **Regional Locks** — Chinese platforms may require Chinese phone number or ID.
4. **API Stability** — Free tiers have no SLA. Always have 3+ fallbacks.
5. **TOS Compliance** — Don't scrape or abuse. Use for personal projects.

---

## 📖 References

- **Chinese Guide:** [FreeLLM-API-KeyHub](https://github.com/free-llms/free-llm-api-keys)
- **Global Guide:** [free-llm-api-keys](https://github.com/alistaitsacle/free-llm-api-keys)
- **Monitoring:** Follow [@getkeyway](https://x.com/getkeyway) on X for daily updates

---

**Last verified:** 2026-06-19 | **Next update:** Daily via automation
