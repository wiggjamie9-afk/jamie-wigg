#!/usr/bin/env node

/**
 * MiniMax M3 MCP Server (multi-provider)
 *
 * Primary backend: MiniMax M3 (local SGLang/vLLM or MiniMax cloud) for extended
 * reasoning and million-token contexts. Also routes to OpenAI-compatible free
 * gateways (OpenRouter, Groq) so a single skill can fall back across providers.
 *
 * All providers are called over the OpenAI-compatible `/chat/completions` shape.
 * Provider-specific knobs (MiniMax `thinking`, `top_k`) are only sent to
 * providers that accept them.
 */

/**
 * Provider registry. Each entry resolves from env at process start.
 * - supportsThinking: send MiniMax-style `thinking` param (reasoning budget)
 * - supportsTopK: include `top_k` in the request body
 * - extraHeaders: provider-specific headers (e.g. OpenRouter ranking headers)
 */
const providers = {
  minimax: {
    apiBase: process.env.MINIMAX_API_BASE || "https://api.minimaxi.com/v1",
    apiKey: process.env.MINIMAX_API_KEY,
    defaultModel: process.env.MINIMAX_MODEL || "MiniMax-M3-text",
    supportsThinking: true,
    supportsTopK: true,
    setupHint:
      "Set MINIMAX_API_KEY in .env (cloud), or run a local server and set MINIMAX_API_BASE=http://localhost:8000/v1 with MINIMAX_API_KEY=local",
  },
  openrouter: {
    apiBase: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultModel:
      process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
    supportsThinking: false,
    supportsTopK: true,
    extraHeaders: {
      "HTTP-Referer": "https://rhythmixapp.com.au",
      "X-Title": "RHYTHMIX Studio",
    },
    setupHint:
      "Get a free key at https://openrouter.ai and set OPENROUTER_API_KEY in .env",
  },
  groq: {
    apiBase: process.env.GROQ_API_BASE || "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    defaultModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    supportsThinking: false,
    supportsTopK: false, // Groq's OpenAI-compatible endpoint rejects top_k
    setupHint:
      "Get a free key at https://console.groq.com and set GROQ_API_KEY in .env",
  },
};

const defaults = {
  provider: process.env.MINIMAX_PROVIDER || "minimax",
  reasoning: process.env.MINIMAX_REASONING || "adaptive",
};

/**
 * MCP Server: M3 Reasoning
 * Handles requests for extended reasoning and million-token contexts.
 */
async function handleRequest(request) {
  const { type, name, arguments: args } = request;

  if (type === "tool_use" || type === "call_tool") {
    switch (name) {
      case "m3_reasoning":
        return await m3Reasoning(args);
      case "m3_analysis":
        return await m3Analysis(args);
      case "m3_generate":
        return await m3Generate(args);
      default:
        return { error: `Unknown tool: ${name}` };
    }
  }

  return { error: "Invalid request type" };
}

/**
 * Extended reasoning across any configured provider.
 */
async function m3Reasoning(args) {
  const {
    query,
    provider = defaults.provider,
    model,
    reasoning = defaults.reasoning,
    context_size = 32768,
    temperature = 1.0,
    top_p = 0.95,
    top_k = 40,
    max_tokens = 4096,
  } = args;

  const cfg = providers[provider];
  if (!cfg) {
    return {
      error: `Unknown provider: ${provider}`,
      available: Object.keys(providers),
    };
  }

  if (!cfg.apiKey) {
    return {
      error: `${provider}: API key not configured`,
      setup: cfg.setupHint,
    };
  }

  const targetModel = model || cfg.defaultModel;

  try {
    console.error(
      `[M3] ${provider}/${targetModel} (${reasoning} mode, ~${Math.round(
        context_size / 1000
      )}k context)`
    );

    // Reasoning mode is conveyed via system prompt for every provider, and
    // additionally via the native `thinking` param where supported.
    const reasoningPrompts = {
      enabled:
        "You are an expert reasoning engine. Think deeply about the problem, showing your reasoning process. Provide comprehensive analysis with justification for each conclusion.",
      adaptive:
        "You are an intelligent assistant. Think as deeply as needed to solve the problem well. For simple queries, respond directly. For complex queries, show your reasoning.",
      disabled:
        "You are a concise assistant. Provide direct answers without extensive reasoning.",
    };

    const systemPrompt = reasoningPrompts[reasoning] || reasoningPrompts.adaptive;

    const body = {
      model: targetModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature,
      top_p,
      max_tokens,
    };

    if (cfg.supportsTopK) {
      body.top_k = top_k;
    }

    if (cfg.supportsThinking) {
      if (reasoning === "enabled") {
        body.thinking = {
          type: "enabled",
          budget_tokens: Math.floor(context_size / 4),
        };
      } else if (reasoning === "adaptive") {
        body.thinking = { type: "adaptive" };
      }
    }

    const response = await fetch(`${cfg.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
        ...(cfg.extraHeaders || {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let detail;
      try {
        const err = await response.json();
        detail = err.error?.message || err.message;
      } catch {
        detail = await response.text();
      }
      return {
        error: `${provider} API error (${response.status})`,
        detail: detail || response.statusText,
      };
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    return {
      success: true,
      provider,
      model: targetModel,
      reasoning_mode: reasoning,
      result,
      tokens_used: data.usage || {},
    };
  } catch (error) {
    return { error: error.message, provider, model: targetModel };
  }
}

/**
 * Deep analysis for large documents.
 */
async function m3Analysis(args) {
  const {
    document,
    analysis_type = "general",
    focus_areas = [],
    context_size = 500000, // Up to 1M tokens
    reasoning = "enabled",
    provider = defaults.provider,
    model,
  } = args;

  const analysisPrompts = {
    code: "Analyze this code for architecture, performance, security, and maintainability. Identify design patterns, potential issues, and improvements.",
    document:
      "Analyze this document comprehensively. Extract key themes, summarize findings, and identify gaps or contradictions.",
    specification:
      "Analyze this specification. Identify ambiguities, missing requirements, design implications, and potential edge cases.",
    general: "Provide a comprehensive analysis of this content.",
  };

  const analysisPrompt = analysisPrompts[analysis_type] || analysisPrompts.general;
  const focusAddition =
    focus_areas.length > 0
      ? `\n\nFocus specifically on: ${focus_areas.join(", ")}`
      : "";

  return await m3Reasoning({
    query: `${analysisPrompt}${focusAddition}\n\nContent:\n${document}`,
    reasoning,
    context_size,
    provider,
    model,
  });
}

/**
 * Context-aware generation.
 */
async function m3Generate(args) {
  const {
    prompt,
    context = "",
    style = "technical",
    length = "medium",
    reasoning = "adaptive",
    provider = defaults.provider,
    model,
  } = args;

  const fullPrompt = context
    ? `Context:\n${context}\n\nTask: ${prompt}`
    : prompt;

  const lengthTokens = {
    short: 500,
    medium: 2000,
    long: 8000,
    xlarge: 16000,
  };

  return await m3Reasoning({
    query: fullPrompt,
    reasoning,
    max_tokens: lengthTokens[length] || 2000,
    provider,
    model,
  });
}

/**
 * Start MCP server.
 */
async function start() {
  console.error("[M3 MCP Server] Starting (multi-provider)...");
  console.error(`[Config] Default provider: ${defaults.provider}`);
  console.error(`[Config] Default reasoning: ${defaults.reasoning}`);

  const configured = [];
  const missing = [];
  for (const [name, cfg] of Object.entries(providers)) {
    const line = `${name} → ${cfg.apiBase} (${cfg.defaultModel})`;
    if (cfg.apiKey) configured.push(line);
    else missing.push(name);
  }

  if (configured.length) {
    console.error("[Providers configured]");
    for (const line of configured) console.error(`  ✓ ${line}`);
  }
  if (missing.length) {
    console.error(`[Providers not configured] ${missing.join(", ")}`);
    console.error(
      "         Add the matching *_API_KEY to .env to enable. See .env.example"
    );
  }

  console.error("[Ready] M3 MCP Server listening for requests\n");

  // In a real MCP setup, this would handle stdio/network communication.
  // For now, tools are available for direct invocation.
}

// Export for direct invocation
export { handleRequest, m3Reasoning, m3Analysis, m3Generate, providers, start };

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}
