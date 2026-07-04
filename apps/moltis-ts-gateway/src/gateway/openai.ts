// OpenAI streaming chat with a graceful offline fallback.
// When OPENAI_API_KEY is unset, we stream a deterministic local reply so the
// gateway is fully runnable without a key (README: "Chat returns fallback response").
import type { GatewayConfig } from "./config.js";

export interface ChatTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

/** Async generator of text deltas for a chat completion. */
export async function* streamChat(
  cfg: GatewayConfig,
  turns: ChatTurn[],
): AsyncGenerator<string, void, unknown> {
  if (!cfg.openaiApiKey) {
    yield* fallbackStream(turns);
    return;
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${cfg.openaiApiKey}`,
    },
    body: JSON.stringify({ model: cfg.defaultModel, stream: true, messages: turns }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    yield `[gateway] upstream error ${res.status}. ${detail.slice(0, 200)}`;
    return;
  }

  // Parse Server-Sent Events: lines beginning with "data: ", terminated by "[DONE]".
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload);
        const delta: string | undefined = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // ignore keep-alive / partial frames
      }
    }
  }
}

/** Offline echo-style assistant so the UI works with no API key. */
async function* fallbackStream(turns: ChatTurn[]): AsyncGenerator<string> {
  const last = [...turns].reverse().find((t) => t.role === "user");
  const reply =
    `(offline fallback — set OPENAI_API_KEY for live chat) ` +
    `You said: "${(last?.content ?? "").slice(0, 400)}". ` +
    `The TypeScript gateway received it, persisted it to SQLite, and streamed this back over the WebSocket.`;
  for (const word of reply.split(" ")) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 12));
  }
}
