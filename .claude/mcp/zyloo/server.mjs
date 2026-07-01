#!/usr/bin/env node
// Zyloo MCP server
// Exposes the Zyloo API (an OpenAI-compatible gateway that fronts Claude and
// other frontier models) as MCP tools for chat, single-prompt completion, and
// model discovery.
//
// Zyloo speaks the OpenAI Chat Completions wire format, so any model the
// gateway routes to is reachable through the standard /chat/completions and
// /models endpoints. Model IDs are namespaced, e.g. "zyloo/claude-haiku-4-5-20251001".
//
// Required env vars:
//   ZYLOO_API_KEY   - your Zyloo key (starts with "sk-zy-")
//   ZYLOO_BASE_URL  - defaults to https://api.zyloo.io/v1
//   ZYLOO_MODEL     - optional default model (defaults below)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ZYLOO_API_KEY = process.env.ZYLOO_API_KEY;
const ZYLOO_BASE_URL = (process.env.ZYLOO_BASE_URL || "https://api.zyloo.io/v1").replace(/\/$/, "");
const DEFAULT_MODEL = process.env.ZYLOO_MODEL || "zyloo/claude-haiku-4-5-20251001";

const server = new McpServer({ name: "zyloo", version: "0.1.0" });

// ---------- Core client --------------------------------------------------

function requireKey() {
  if (!ZYLOO_API_KEY) {
    throw new Error("ZYLOO_API_KEY is not set — add it to .env (see .env.example)");
  }
}

async function zylooRequest(path, { method = "GET", body } = {}) {
  requireKey();
  const res = await fetch(`${ZYLOO_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${ZYLOO_API_KEY}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    throw new Error(`Zyloo API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function chatCompletion({ messages, model, temperature, maxTokens }) {
  const body = {
    model: model || DEFAULT_MODEL,
    messages,
    ...(temperature !== undefined ? { temperature } : {}),
    ...(maxTokens !== undefined ? { max_tokens: maxTokens } : {}),
  };
  const data = await zylooRequest("/chat/completions", { method: "POST", body });
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------- Tools --------------------------------------------------------

server.registerTool(
  "zyloo_complete",
  {
    title: "Single-prompt completion via Zyloo",
    description:
      "Send one prompt to a model behind the Zyloo gateway and get the text back. " +
      "Use this for quick generations, rewrites, or reasoning tasks where you do not need " +
      "to manage a multi-turn conversation. Defaults to " +
      "'zyloo/claude-haiku-4-5-20251001'; pass a different `model` for a heavier model.",
    inputSchema: {
      prompt: z.string().describe("The user prompt to send"),
      system_prompt: z.string().optional().describe("Optional system prompt to steer the model"),
      model: z.string().optional().describe(`Model id (default: ${DEFAULT_MODEL})`),
      temperature: z.number().min(0).max(2).optional().describe("Sampling temperature (0–2)"),
      max_tokens: z.number().int().positive().optional().default(2048),
    },
  },
  async ({ prompt, system_prompt, model, temperature, max_tokens }) => {
    const messages = [
      ...(system_prompt ? [{ role: "system", content: system_prompt }] : []),
      { role: "user", content: prompt },
    ];
    const result = await chatCompletion({ messages, model, temperature, maxTokens: max_tokens });
    return { content: [{ type: "text", text: result }] };
  },
);

server.registerTool(
  "zyloo_chat",
  {
    title: "Multi-turn chat via Zyloo",
    description:
      "General-purpose chat completion against the Zyloo gateway using the full OpenAI " +
      "message format. Supply the conversation history in `messages`. Pass `user_images` " +
      "(URLs) to append vision inputs to the last user turn for multimodal models.",
    inputSchema: {
      messages: z
        .array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          }),
        )
        .describe("Conversation history. At minimum, supply a single user message."),
      user_images: z
        .array(z.string().url())
        .optional()
        .describe("Image URLs appended to the last user message (multimodal)"),
      model: z.string().optional().describe(`Model id (default: ${DEFAULT_MODEL})`),
      temperature: z.number().min(0).max(2).optional(),
      max_tokens: z.number().int().positive().optional().default(4096),
    },
  },
  async ({ messages, user_images, model, temperature, max_tokens }) => {
    const msgs = [...messages];

    if (user_images && user_images.length > 0) {
      const last = msgs[msgs.length - 1];
      if (last && last.role === "user") {
        msgs[msgs.length - 1] = {
          role: "user",
          content: [
            { type: "text", text: last.content },
            ...user_images.map((url) => ({ type: "image_url", image_url: { url } })),
          ],
        };
      }
    }

    const result = await chatCompletion({ messages: msgs, model, temperature, maxTokens: max_tokens });
    return { content: [{ type: "text", text: result }] };
  },
);

server.registerTool(
  "zyloo_list_models",
  {
    title: "List models available through Zyloo",
    description:
      "Fetch the catalogue of models the Zyloo gateway can route to (GET /models). " +
      "Use this to discover valid `model` ids before calling zyloo_chat or zyloo_complete.",
    inputSchema: {},
  },
  async () => {
    const data = await zylooRequest("/models");
    const ids = Array.isArray(data.data) ? data.data.map((m) => m.id).filter(Boolean) : [];
    const text = ids.length ? ids.join("\n") : JSON.stringify(data, null, 2);
    return { content: [{ type: "text", text }] };
  },
);

// ---------- Boot ---------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
