/**
 * LLM Router — Switch between Claude and FreeLLMAPI
 *
 * Usage:
 *   const client = getLLMClient("free");  // Use FreeLLMAPI
 *   const client = getLLMClient("paid");  // Use Claude
 *   const client = getLLMClient();        // Use env var or default to paid
 */

import { OpenAI } from "openai";

export type LLMMode = "free" | "paid" | "auto";

interface LLMConfig {
  mode: LLMMode;
  claudeApiKey?: string;
  freeLLMUrl?: string;
  freeLLMKey?: string;
}

const defaultConfig: LLMConfig = {
  mode: (process.env.LLM_MODE as LLMMode) || "auto",
  claudeApiKey: process.env.ANTHROPIC_API_KEY,
  freeLLMUrl: process.env.FREELLM_URL || "http://localhost:3001/v1",
  freeLLMKey: process.env.FREELLM_API_KEY,
};

/**
 * Get an OpenAI-compatible client configured for Claude or FreeLLMAPI
 *
 * @param mode - "free" (FreeLLMAPI), "paid" (Claude), or "auto" (env-based)
 * @param config - Override default config
 * @returns OpenAI client instance
 */
export function getLLMClient(
  mode: LLMMode = defaultConfig.mode,
  config: Partial<LLMConfig> = {}
): OpenAI {
  const mergedConfig = { ...defaultConfig, ...config };

  if (mode === "auto") {
    // In auto mode, prefer free if fully configured, else use paid
    if (mergedConfig.freeLLMKey && mergedConfig.freeLLMUrl) {
      mode = "free";
    } else {
      mode = "paid";
    }
  }

  if (mode === "free") {
    if (!mergedConfig.freeLLMKey || !mergedConfig.freeLLMUrl) {
      throw new Error(
        "FreeLLMAPI key or URL not configured. Set FREELLM_API_KEY and FREELLM_URL env vars, or pass them to getLLMClient()."
      );
    }

    return new OpenAI({
      baseURL: mergedConfig.freeLLMUrl,
      apiKey: mergedConfig.freeLLMKey,
      defaultHeaders: {
        "x-llm-mode": "free",
      },
    });
  }

  // mode === "paid"
  if (!mergedConfig.claudeApiKey) {
    throw new Error(
      "Claude API key not configured. Set ANTHROPIC_API_KEY env var, or pass it to getLLMClient()."
    );
  }

  return new OpenAI({
    apiKey: mergedConfig.claudeApiKey,
    defaultHeaders: {
      "x-llm-mode": "paid",
    },
  });
}

/**
 * Helper to make a chat completion call with automatic provider selection
 *
 * @param prompt - User message
 * @param options - OpenAI chat completion options (model, temperature, etc.)
 * @param mode - Which provider to use
 * @returns Parsed response text
 */
export async function completeWithLLM(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    mode?: LLMMode;
  } = {}
): Promise<{
  text: string;
  provider: string;
}> {
  const {
    model = options.mode === "free" ? "auto" : "claude-opus-4-8",
    temperature = 0.7,
    maxTokens = 1024,
    mode = "auto",
  } = options;

  const client = getLLMClient(mode);

  const resp = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: maxTokens,
  });

  const text = resp.choices[0]?.message?.content || "";
  const provider = resp.headers?.get?.("x-routed-via") || "unknown";

  return { text, provider };
}

/**
 * Get the active LLM mode (useful for logging/debugging)
 */
export function getActiveLLMMode(
  mode: LLMMode = defaultConfig.mode
): "free" | "paid" {
  if (mode === "auto") {
    return defaultConfig.freeLLMKey ? "free" : "paid";
  }
  return mode;
}

/**
 * Check if FreeLLMAPI is available/healthy
 */
export async function isFreeLLMAvailable(): Promise<boolean> {
  try {
    const url = defaultConfig.freeLLMUrl || "http://localhost:3001/v1";
    const res = await fetch(`${url}/models`, {
      headers: {
        Authorization: `Bearer ${defaultConfig.freeLLMKey || ""}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Cost estimate helper (rough ballpark)
 * Free tiers: 0.0
 * Claude Opus: ~$0.015 per 1K input tokens
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  mode: "free" | "paid"
): number {
  if (mode === "free") return 0;

  // Rough estimate: Claude Opus
  const inputCost = (inputTokens / 1000) * 0.015;
  const outputCost = (outputTokens / 1000) * 0.06;
  return inputCost + outputCost;
}
