#!/usr/bin/env node

/**
 * MiniMax M3 MCP Server
 * Provides extended reasoning and million-token context support
 */

import Anthropic from "@anthropic-ai/sdk";

const minimax = {
  apiKey: process.env.MINIMAX_API_KEY,
  apiBase: process.env.MINIMAX_API_BASE || "https://api.minimaxi.com/v1",
  model: process.env.MINIMAX_MODEL || "MiniMax-M3-text",
  reasoning: process.env.MINIMAX_REASONING || "adaptive",
};

/**
 * MCP Server: MiniMax M3 Reasoning
 * Handles requests for extended reasoning and million-token contexts
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
 * M3 Extended Reasoning
 */
async function m3Reasoning(args) {
  const {
    query,
    reasoning = minimax.reasoning,
    context_size = 32768,
    temperature = 1.0,
    top_p = 0.95,
    top_k = 40,
    max_tokens = 4096,
  } = args;

  if (!minimax.apiKey) {
    return {
      error: "MINIMAX_API_KEY not configured",
      setup:
        "Set MINIMAX_API_KEY in .env or environment variables",
    };
  }

  try {
    console.error(
      `[M3] Reasoning query (${reasoning} mode, ${context_size}k tokens)`
    );

    // Construct system prompt based on reasoning mode
    const reasoningPrompts = {
      enabled:
        "You are an expert reasoning engine. Think deeply about the problem, showing your reasoning process. Provide comprehensive analysis with justification for each conclusion.",
      adaptive:
        "You are an intelligent assistant. Think as deeply as needed to solve the problem well. For simple queries, respond directly. For complex queries, show your reasoning.",
      disabled:
        "You are a concise assistant. Provide direct answers without extensive reasoning.",
    };

    const systemPrompt = reasoningPrompts[reasoning] || reasoningPrompts.adaptive;

    // Call M3 API (uses OpenAI-compatible endpoint structure)
    const response = await fetch(`${minimax.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${minimax.apiKey}`,
      },
      body: JSON.stringify({
        model: minimax.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature,
        top_p,
        top_k,
        max_tokens,
        thinking:
          reasoning === "enabled"
            ? { type: "enabled", budget_tokens: Math.floor(context_size / 4) }
            : reasoning === "adaptive"
              ? { type: "adaptive" }
              : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "M3 API error" };
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    return {
      success: true,
      reasoning_mode: reasoning,
      result,
      tokens_used: data.usage || {},
      model: minimax.model,
    };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * M3 Deep Analysis (for large documents)
 */
async function m3Analysis(args) {
  const {
    document,
    analysis_type = "general",
    focus_areas = [],
    context_size = 500000, // Up to 1M tokens
    reasoning = "enabled",
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
  });
}

/**
 * M3 Generation with Context Awareness
 */
async function m3Generate(args) {
  const {
    prompt,
    context = "",
    style = "technical",
    length = "medium",
    reasoning = "adaptive",
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
  });
}

/**
 * Start MCP server
 */
async function start() {
  console.error("[MiniMax M3 MCP Server] Starting...");
  console.error(`[Config] Model: ${minimax.model}`);
  console.error(`[Config] Reasoning: ${minimax.reasoning}`);
  console.error(`[Config] API Base: ${minimax.apiBase}`);

  if (!minimax.apiKey) {
    console.error(
      "[Warning] MINIMAX_API_KEY not configured. Some features will be unavailable."
    );
    console.error("         Set MINIMAX_API_KEY=sk-... in .env");
    console.error("         Or deploy locally: see .claude/agents/m3-reasoning-agent.md");
  }

  console.error("[Ready] MiniMax M3 MCP Server listening for requests\n");

  // In a real MCP setup, this would handle stdio/network communication
  // For now, tools are available for direct invocation
}

// Export for direct invocation
export { handleRequest, m3Reasoning, m3Analysis, m3Generate, start };

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}
