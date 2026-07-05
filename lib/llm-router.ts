/**
 * LLM Router — the routing "brain" that switches between a free LLM tier and
 * a paid (Claude) tier behind one OpenAI-compatible interface.
 *
 * Re-engineered to remove the hard dependency on the `openai` npm package:
 *   - The package was never installed, so anything importing this module
 *     failed to type-check, and this module is pulled into a *client*
 *     component (video-exporter) where bundling the Node OpenAI SDK would be
 *     wrong anyway.
 *   - Instead we ship a tiny `fetch`-based client that speaks the OpenAI
 *     `/chat/completions` contract — which is exactly what FreeLLMAPI (see
 *     `infra/freellmapi/`) and OpenAI-compatible Claude proxies expose. No
 *     dependency, runs in the browser or Node, same call-site shape.
 *
 * Usage:
 *   const client = getLLMClient("free");  // FreeLLMAPI
 *   const client = getLLMClient("paid");  // Claude (OpenAI-compatible endpoint)
 *   const client = getLLMClient();        // env-driven, defaults to auto
 *
 * Both endpoints MUST be OpenAI-chat-completions compatible.
 */

export type LLMMode = "free" | "paid" | "auto";
export type ResolvedMode = "free" | "paid";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionParams {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResult {
  choices: Array<{ message: { role: string; content: string } }>;
  /** Response headers, so callers can read e.g. `x-routed-via`. */
  headers: Headers;
}

/** Minimal OpenAI-compatible client surface used across the studio. */
export interface ChatClient {
  readonly mode: ResolvedMode;
  readonly baseURL: string;
  chat: {
    completions: {
      create(params: ChatCompletionParams): Promise<ChatCompletionResult>;
    };
  };
}

export interface LLMConfig {
  mode: LLMMode;
  claudeApiKey?: string;
  /** OpenAI-compatible base URL for the paid (Claude) tier. */
  claudeBaseUrl: string;
  freeLLMUrl: string;
  freeLLMKey?: string;
}

function env(name: string): string | undefined {
  // Guarded so this module is safe to import in a browser bundle where
  // `process` may be undefined.
  return typeof process !== "undefined" ? process.env?.[name] : undefined;
}

const defaultConfig: LLMConfig = {
  mode: (env("LLM_MODE") as LLMMode) || "auto",
  claudeApiKey: env("ANTHROPIC_API_KEY"),
  claudeBaseUrl: env("CLAUDE_BASE_URL") || "https://api.anthropic.com/v1",
  freeLLMUrl: env("FREELLM_URL") || "http://localhost:3001/v1",
  freeLLMKey: env("FREELLM_API_KEY"),
};

/** Strip a single trailing slash so `${base}/chat/completions` is well-formed. */
function normalizeBase(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function makeClient(
  mode: ResolvedMode,
  baseURL: string,
  apiKey: string,
): ChatClient {
  const base = normalizeBase(baseURL);
  return {
    mode,
    baseURL: base,
    chat: {
      completions: {
        async create(params: ChatCompletionParams): Promise<ChatCompletionResult> {
          const res = await fetch(`${base}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "x-llm-mode": mode,
            },
            body: JSON.stringify(params),
          });

          if (!res.ok) {
            const detail = await res.text().catch(() => "");
            throw new Error(
              `LLM request failed (${mode}, ${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
            );
          }

          const data = (await res.json()) as {
            choices?: Array<{ message?: { role?: string; content?: string } }>;
          };
          const choices = (data.choices ?? []).map((c) => ({
            message: {
              role: c.message?.role ?? "assistant",
              content: c.message?.content ?? "",
            },
          }));
          return { choices, headers: res.headers };
        },
      },
    },
  };
}

/**
 * Get an OpenAI-compatible client configured for Claude or FreeLLMAPI.
 *
 * @param mode - "free", "paid", or "auto" (resolves via config)
 * @param config - Override default config
 */
export function getLLMClient(
  mode: LLMMode = defaultConfig.mode,
  config: Partial<LLMConfig> = {},
): ChatClient {
  const merged = { ...defaultConfig, ...config };
  const resolved = resolveMode(mode, merged);

  if (resolved === "free") {
    if (!merged.freeLLMKey || !merged.freeLLMUrl) {
      throw new Error(
        "FreeLLMAPI key or URL not configured. Set FREELLM_API_KEY and FREELLM_URL env vars, or pass them to getLLMClient().",
      );
    }
    return makeClient("free", merged.freeLLMUrl, merged.freeLLMKey);
  }

  // resolved === "paid"
  if (!merged.claudeApiKey) {
    throw new Error(
      "Claude API key not configured. Set ANTHROPIC_API_KEY env var, or pass it to getLLMClient().",
    );
  }
  return makeClient("paid", merged.claudeBaseUrl, merged.claudeApiKey);
}

/** Resolve an "auto" mode to a concrete tier: free if fully configured, else paid. */
function resolveMode(mode: LLMMode, config: LLMConfig): ResolvedMode {
  if (mode !== "auto") return mode;
  return config.freeLLMKey && config.freeLLMUrl ? "free" : "paid";
}

/**
 * Make a chat completion with automatic provider selection.
 */
export async function completeWithLLM(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    mode?: LLMMode;
    system?: string;
    config?: Partial<LLMConfig>;
  } = {},
): Promise<{ text: string; provider: string; mode: ResolvedMode }> {
  const {
    temperature = 0.7,
    maxTokens = 1024,
    mode = "auto",
    system,
    config,
  } = options;

  const client = getLLMClient(mode, config);
  const model =
    options.model ?? (client.mode === "free" ? "auto" : "claude-opus-4-8");

  const messages: ChatMessage[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const resp = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const text = resp.choices[0]?.message?.content || "";
  const provider = resp.headers?.get?.("x-routed-via") || client.mode;
  return { text, provider, mode: client.mode };
}

/**
 * Get the active LLM mode (useful for logging/debugging).
 */
export function getActiveLLMMode(
  mode: LLMMode = defaultConfig.mode,
): ResolvedMode {
  return resolveMode(mode, defaultConfig);
}

/**
 * Check if FreeLLMAPI is available/healthy.
 */
export async function isFreeLLMAvailable(): Promise<boolean> {
  try {
    const url = normalizeBase(defaultConfig.freeLLMUrl);
    const res = await fetch(`${url}/models`, {
      headers: { Authorization: `Bearer ${defaultConfig.freeLLMKey || ""}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Rough cost estimate. Free tiers cost 0; paid estimated at Claude Opus rates.
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  mode: ResolvedMode,
): number {
  if (mode === "free") return 0;
  const inputCost = (inputTokens / 1000) * 0.015;
  const outputCost = (outputTokens / 1000) * 0.06;
  return inputCost + outputCost;
}
