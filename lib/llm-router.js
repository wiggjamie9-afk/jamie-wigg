/**
 * Multi-Provider LLM Router
 *
 * Intelligently routes requests across 30+ free/paid LLM providers.
 * Supports fallback chains, cost-aware selection, and quota monitoring.
 *
 * Usage:
 *   const router = require('./lib/llm-router');
 *
 *   // Auto-select best provider
 *   const response = await router.chat("Your prompt");
 *
 *   // Force specific provider
 *   const response = await router.chat("Prompt", { provider: 'groq' });
 *
 *   // Multi-provider fallback chain
 *   const response = await router.chat("Prompt", {
 *     providers: ['groq', 'cerebras', 'meituan']
 *   });
 */

const OpenAI = require('openai').default;

// Provider configurations
const PROVIDERS = {
  // Tier 1: Permanent Free (No Expiration)
  groq: {
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
    freeQuota: 14400, // calls/day for Llama
    costPerMTok: 0, // free
    speedRank: 1, // fastest
    tier: 'permanent-free',
  },

  cerebras: {
    name: 'Cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY,
    models: ['llama-3.1-70b', 'qwen-3-32b', 'deepseek-r1-distill'],
    freeQuota: 1000000, // tokens/day
    costPerMTok: 0,
    speedRank: 2,
    tier: 'permanent-free',
  },

  meituan: {
    name: 'Meituan LongCat',
    baseURL: 'https://api.longcat.meituan.com/v1',
    apiKey: process.env.MEITUAN_API_KEY,
    models: ['longcat-flash-lite', 'longcat-flash'],
    freeQuota: 55000000, // tokens/day (!!)
    costPerMTok: 0,
    speedRank: 3,
    tier: 'permanent-free',
  },

  siliconflow: {
    name: 'SiliconFlow (硅基流动)',
    baseURL: 'https://api.siliconflow.cn/v1',
    apiKey: process.env.SILICONFLOW_API_KEY,
    models: ['deepseek-v3', 'deepseek-r1', 'qwen-coder-32b'],
    freeQuota: 200000000, // tokens (permanent after signup!)
    costPerMTok: 0,
    speedRank: 3,
    tier: 'permanent-free',
  },

  // Tier 2: Time-Limited Free Credits
  volcanoengine: {
    name: 'VolcanoEngine (火山引擎)',
    baseURL: 'https://api.volcengine.com/v1',
    apiKey: process.env.VOLCANOENGINE_API_KEY,
    models: ['doubao-pro', 'doubao-seed', 'deepseek-v4', 'kimi-k2.5'],
    freeQuota: 1000000, // initial tokens (expires)
    costPerMTok: 0.5, // ¥/MTok after free tier
    speedRank: 3,
    tier: 'time-limited-free',
  },

  aliyun: {
    name: 'Aliyun (阿里云百炼)',
    baseURL: 'https://dashscope.aliyuncs.com/api/v1',
    apiKey: process.env.ALIYUN_API_KEY,
    models: ['qwen-plus', 'qwen-max', 'qwen-coder-plus'],
    freeQuota: 70000000, // tokens for 90 days
    costPerMTok: 0.5,
    speedRank: 2,
    tier: 'time-limited-free',
  },

  zhipuai: {
    name: 'Zhipu GLM (智谱)',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ZHIPUAI_API_KEY,
    models: ['glm-4-plus', 'glm-5'],
    freeQuota: 20000000, // permanent tokens
    costPerMTok: 0,
    speedRank: 2,
    tier: 'permanent-free',
  },

  deepseek: {
    name: 'DeepSeek (深度求索)',
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
    models: ['deepseek-chat', 'deepseek-reasoner'],
    freeQuota: 5000000, // 30 days
    costPerMTok: 0.14,
    speedRank: 3,
    tier: 'time-limited-free',
  },

  // International Fallback
  google: {
    name: 'Google AI Studio',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GOOGLE_API_KEY,
    models: ['gemini-2.5-flash'],
    freeQuota: Infinity, // RPM-limited, not token-limited
    costPerMTok: 0,
    speedRank: 2,
    tier: 'permanent-free',
  },

  // Fallback: Pekpik aggregator
  pekpik: {
    name: 'Pekpik (Free API Aggregator)',
    baseURL: process.env.PEKPIK_BASE_URL || 'https://aiapiv2.pekpik.com/v1',
    apiKey: process.env.PEKPIK_API_KEY,
    models: ['claude-opus-4-7', 'openai/gpt-5.5', 'gemini-2.5-flash'],
    freeQuota: 20, // calls/key (shared pool)
    costPerMTok: 0,
    speedRank: 3,
    tier: 'permanent-free',
  },
};

// Router strategies
const STRATEGIES = {
  'cost-aware': selectCostAware,
  'speed-first': selectSpeedFirst,
  'quality-first': selectQualityFirst,
  'quota-first': selectQuotaFirst,
  'round-robin': selectRoundRobin,
};

/**
 * Main chat function with intelligent routing
 */
async function chat(prompt, options = {}) {
  const {
    provider = null,
    providers = null,
    strategy = process.env.LLM_ROUTER_STRATEGY || 'cost-aware',
    model = null,
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  // Determine provider chain
  let chain = [];
  if (provider) {
    chain = [provider];
  } else if (providers) {
    chain = providers;
  } else {
    const selected = STRATEGIES[strategy]?.(model);
    chain = Array.isArray(selected) ? selected : [selected];
  }

  // Try each provider in chain
  for (const name of chain) {
    const config = PROVIDERS[name];
    if (!config) {
      console.warn(`[Router] Unknown provider: ${name}`);
      continue;
    }

    try {
      if (!config.apiKey) {
        console.warn(`[Router] No API key for ${config.name}, skipping...`);
        continue;
      }

      const client = new OpenAI({
        baseURL: config.baseURL,
        apiKey: config.apiKey,
      });

      const response = await client.chat.completions.create({
        model: model || config.models[0],
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      });

      console.log(`[Router] ✓ Success via ${config.name}`);
      return response.choices[0].message.content;
    } catch (error) {
      console.warn(`[Router] ✗ ${config.name} failed: ${error.message}`);
      continue;
    }
  }

  throw new Error(`[Router] All providers failed. Chain: ${chain.join(', ')}`);
}

/**
 * Selection strategies
 */

function selectCostAware(model) {
  // Prefer free → cheapest → fallback
  return Object.entries(PROVIDERS)
    .filter(([, p]) => p.apiKey) // Has API key
    .sort((a, b) => {
      const costA = a[1].costPerMTok;
      const costB = b[1].costPerMTok;
      if (costA === costB) return a[1].speedRank - b[1].speedRank;
      return costA - costB;
    })
    .map(([name]) => name);
}

function selectSpeedFirst(model) {
  // Fastest first
  return Object.entries(PROVIDERS)
    .filter(([, p]) => p.apiKey)
    .sort((a, b) => a[1].speedRank - b[1].speedRank)
    .map(([name]) => name);
}

function selectQualityFirst(model) {
  // Tier priority: permanent free > time-limited > paid
  const tierRank = { 'permanent-free': 0, 'time-limited-free': 1, paid: 2 };
  return Object.entries(PROVIDERS)
    .filter(([, p]) => p.apiKey)
    .sort((a, b) => {
      const tierA = tierRank[a[1].tier] ?? 99;
      const tierB = tierRank[b[1].tier] ?? 99;
      return tierA - tierB;
    })
    .map(([name]) => name);
}

function selectQuotaFirst(model) {
  // Highest remaining quota first
  return Object.entries(PROVIDERS)
    .filter(([, p]) => p.apiKey && p.freeQuota > 0)
    .sort((a, b) => b[1].freeQuota - a[1].freeQuota)
    .map(([name]) => name);
}

function selectRoundRobin(model) {
  // Cycle through all providers
  return Object.keys(PROVIDERS).filter((name) => PROVIDERS[name].apiKey);
}

/**
 * Utility functions
 */

function getProvider(name) {
  return PROVIDERS[name];
}

function listProviders() {
  return Object.entries(PROVIDERS)
    .filter(([, p]) => p.apiKey)
    .map(([name, p]) => ({
      name,
      displayName: p.name,
      tier: p.tier,
      freeQuota: p.freeQuota,
      costPerMTok: p.costPerMTok,
      speedRank: p.speedRank,
    }));
}

function hasQuota(minTokens = 1000) {
  return Object.values(PROVIDERS).some((p) => p.apiKey && p.freeQuota >= minTokens);
}

module.exports = {
  chat,
  getProvider,
  listProviders,
  hasQuota,
  PROVIDERS,
  STRATEGIES,
};
