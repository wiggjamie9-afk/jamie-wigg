/**
 * Client-safe LLM router for STARLIGHTMIX Studio.
 *
 * Studio is a static export with no server runtime and a bring-your-own-token
 * model. The previous implementation reached into the repo-root `lib/llm-router`,
 * which imports the Node `openai` SDK and reads `process.env.ANTHROPIC_API_KEY`
 * at module load — both of which are wrong to bundle into a shipped browser
 * client (build break + secret-in-bundle smell). This module replaces that path
 * with a dependency-free, browser-first router:
 *
 *  - No `openai` SDK — talks to any OpenAI-compatible endpoint over `fetch`.
 *  - No secrets read at import time. Config is resolved lazily at call time from
 *    (1) an explicit arg, (2) `configureLLM()` set by the app at runtime,
 *    (3) `localStorage` in the browser, (4) `process.env` only when running
 *    under Node (tests / tooling) — never baked into the client bundle.
 *
 * The surface (`getLLMClient`, `completeWithLLM`, `getActiveLLMMode`, `LLMMode`)
 * matches what `llm-studio.ts` consumes, so callers are unchanged.
 */

export type LLMMode = "free" | "paid" | "auto";

export interface LLMConfig {
  mode?: LLMMode;
  /** Claude / paid OpenAI-compatible key (user-supplied). */
  paidKey?: string;
  /** Paid base URL (OpenAI-compatible). */
  paidUrl?: string;
  /** FreeLLMAPI key (user-supplied). */
  freeKey?: string;
  /** FreeLLMAPI base URL (OpenAI-compatible). */
  freeUrl?: string;
}

const LS_KEY = "starlightmix.llm.config";

/** Runtime config set by the app (e.g. the Settings page). Never persisted here. */
let runtimeConfig: LLMConfig = {};

/** Set LLM config at runtime (call from Settings / onboarding). */
export function configureLLM(config: LLMConfig): void {
  runtimeConfig = { ...runtimeConfig, ...config };
}

/** Lazily resolve config — browser-safe, no secrets at import time. */
function resolveConfig(override: Partial<LLMConfig> = {}): LLMConfig {
  const fromBrowser = readBrowserConfig();
  const fromEnv = readNodeEnvConfig();
  return { ...fromEnv, ...fromBrowser, ...runtimeConfig, ...override };
}

function readBrowserConfig(): LLMConfig {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as LLMConfig) : {};
  } catch {
    return {};
  }
}

function readNodeEnvConfig(): LLMConfig {
  // Only touch process.env under Node (tests/tooling). In the browser bundle
  // `process` is undefined, so nothing is read or baked in.
  if (typeof process === "undefined" || !process.env) return {};
  const e = process.env;
  return {
    mode: e.LLM_MODE as LLMMode | undefined,
    paidKey: e.ANTHROPIC_API_KEY,
    freeKey: e.FREELLM_API_KEY,
    freeUrl: e.FREELLM_URL,
  };
}

// ---- minimal OpenAI-compatible client over fetch -----------------------------

interface ChatCreateParams {
  model: string;
  messages: Array<{ role: string; content: string }>;
  /** Non-standard convenience used by llm-studio — prepended as a system message. */
  system?: string;
  temperature?: number;
  max_tokens?: number;
}

interface ChatCreateResult {
  choices: Array<{ message?: { content?: string } }>;
  headers?: Headers;
}

export interface LLMClient {
  chat: { completions: { create(params: ChatCreateParams): Promise<ChatCreateResult> } };
}

function resolveMode(mode: LLMMode, cfg: LLMConfig): "free" | "paid" {
  if (mode === "auto") return cfg.freeKey && cfg.freeUrl ? "free" : "paid";
  return mode;
}

/**
 * Build a client-safe LLM client for the given mode. Throws a clear error at
 * CALL time (not import time) if the chosen mode isn't configured.
 */
export function getLLMClient(
  mode: LLMMode = "auto",
  override: Partial<LLMConfig> = {},
): LLMClient {
  const cfg = resolveConfig(override);
  const resolved = resolveMode(mode, cfg);

  const baseURL =
    resolved === "free"
      ? cfg.freeUrl
      : cfg.paidUrl ?? "https://api.anthropic.com/v1";
  const apiKey = resolved === "free" ? cfg.freeKey : cfg.paidKey;

  return {
    chat: {
      completions: {
        async create(params: ChatCreateParams): Promise<ChatCreateResult> {
          if (!apiKey || !baseURL) {
            throw new Error(
              `LLM ${resolved} mode is not configured. Set your key/URL via ` +
                `configureLLM() or the Studio settings before generating.`,
            );
          }
          const messages = params.system
            ? [{ role: "system", content: params.system }, ...params.messages]
            : params.messages;

          const res = await fetch(`${baseURL.replace(/\/$/, "")}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "x-llm-mode": resolved,
            },
            body: JSON.stringify({
              model: params.model,
              messages,
              temperature: params.temperature,
              max_tokens: params.max_tokens,
            }),
          });

          if (!res.ok) {
            throw new Error(`LLM request failed: ${res.status} ${res.statusText}`);
          }
          const data = (await res.json()) as ChatCreateResult;
          return { choices: data.choices ?? [], headers: res.headers };
        },
      },
    },
  };
}

/** Convenience single-shot completion (mirrors the prior helper surface). */
export async function completeWithLLM(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    mode?: LLMMode;
  } = {},
): Promise<{ text: string; provider: string }> {
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

  return {
    text: resp.choices[0]?.message?.content || "",
    provider: resp.headers?.get?.("x-routed-via") || "unknown",
  };
}

/** Report the effective mode (for analytics/logging). */
export function getActiveLLMMode(mode: LLMMode = "auto"): "free" | "paid" {
  return resolveMode(mode, resolveConfig());
}
