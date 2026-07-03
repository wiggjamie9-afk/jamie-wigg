#!/usr/bin/env node
// Gemini MCP server
// Exposes Google's Gemini models — text generation and native image
// generation — as MCP tools, routed through the ZenMux gateway.
//
// ZenMux fronts Vertex AI with the Google Gen AI wire format, so the standard
// `generateContent` endpoint is reachable at
//   {base}/v1/publishers/{provider}/models/{model}:generateContent
// with a Bearer token. Model ids are provider-namespaced OpenRouter-style
// slugs, e.g. "google/gemini-3.1-flash-lite-image".
//
// This mirrors the google-genai SDK snippet ZenMux publishes:
//   client = genai.Client(api_key="$ZENMUX_API_KEY", vertexai=True,
//       http_options=types.HttpOptions(api_version='v1',
//           base_url='https://zenmux.ai/api/vertex-ai'))
//
// Required env vars:
//   ZENMUX_API_KEY       - your ZenMux key (starts with "sk-")
// Optional env vars:
//   ZENMUX_BASE_URL      - vertex-ai base (default https://zenmux.ai/api/vertex-ai)
//   ZENMUX_API_VERSION   - api version segment (default v1)
//   ZENMUX_GEMINI_MODEL  - default model slug (default below)
//   ZENMUX_MODELS_URL    - OpenAI-compatible /models endpoint for discovery
//   GEMINI_OUT_DIR       - directory for generated images (default ./creative-out)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ZENMUX_API_KEY = process.env.ZENMUX_API_KEY;
const BASE_URL = (process.env.ZENMUX_BASE_URL || "https://zenmux.ai/api/vertex-ai").replace(/\/$/, "");
const API_VERSION = (process.env.ZENMUX_API_VERSION || "v1").replace(/^\/|\/$/g, "");
const DEFAULT_MODEL = process.env.ZENMUX_GEMINI_MODEL || "google/gemini-3.1-flash-lite-image";
// OpenAI-compatible side of the same gateway (Chat Completions / models list),
// used to route any ZenMux model (Claude, GPT, …), not just the Gemini path.
const OPENAI_BASE_URL = (process.env.ZENMUX_OPENAI_BASE_URL || "https://zenmux.ai/api/v1").replace(/\/$/, "");
const DEFAULT_CHAT_MODEL = process.env.ZENMUX_CHAT_MODEL || "anthropic/claude-sonnet-5-free";
const MODELS_URL = process.env.ZENMUX_MODELS_URL || `${OPENAI_BASE_URL}/models`;
const OUT = process.env.GEMINI_OUT_DIR
  ? resolve(process.env.GEMINI_OUT_DIR)
  : resolve(process.cwd(), "creative-out");

const server = new McpServer({ name: "gemini", version: "0.1.0" });

// ---------- Core client --------------------------------------------------

function requireKey() {
  if (!ZENMUX_API_KEY) {
    throw new Error("ZENMUX_API_KEY is not set — add it to .env (see .env.example)");
  }
}

// Resolve a model slug to a Vertex publisher path, matching how the google-genai
// SDK routes a `provider/model` id. "google/gemini-3.1-flash-lite-image" →
// "publishers/google/models/gemini-3.1-flash-lite-image". A bare id defaults to
// the google publisher. An already-qualified "publishers/..." path is kept.
function modelPath(model) {
  const slug = model.trim();
  if (slug.startsWith("publishers/")) return slug;
  const bare = slug.replace(/^models\//, "");
  const idx = bare.indexOf("/");
  if (idx === -1) return `publishers/google/models/${bare}`;
  return `publishers/${bare.slice(0, idx)}/models/${bare.slice(idx + 1)}`;
}

async function generateContent({ model, contents, systemInstruction, generationConfig, timeoutMs = 120000 }) {
  requireKey();
  const url = `${BASE_URL}/${API_VERSION}/${modelPath(model || DEFAULT_MODEL)}:generateContent`;
  const body = {
    contents,
    ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    ...(generationConfig && Object.keys(generationConfig).length ? { generationConfig } : {}),
  };
  const res = await fetch(url, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: `Bearer ${ZENMUX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`ZenMux/Gemini API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Pull the model's response parts out of a generateContent result.
function responseParts(data) {
  return data?.candidates?.[0]?.content?.parts ?? [];
}

function partsText(parts) {
  return parts
    .map((p) => p.text)
    .filter((t) => typeof t === "string")
    .join("");
}

// Fetch an image URL and turn it into an inlineData part for multimodal input.
async function urlToInlinePart(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`failed to fetch image ${url}: ${res.status}`);
  const mimeType = res.headers.get("content-type")?.split(";")[0] || "image/png";
  const data = Buffer.from(await res.arrayBuffer()).toString("base64");
  return { inlineData: { mimeType, data } };
}

async function saveInlineImages(parts, filenameBase) {
  const saved = [];
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
  let i = 0;
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    if (!inline?.data) continue;
    const mime = inline.mimeType || inline.mime_type || "image/png";
    const ext = mime.split("/")[1]?.split("+")[0] || "png";
    const suffix = i === 0 ? "" : `-${i}`;
    const path = join(OUT, `${filenameBase}${suffix}.${ext}`);
    await writeFile(path, Buffer.from(inline.data, "base64"));
    saved.push(path);
    i += 1;
  }
  return saved;
}

// OpenAI-compatible Chat Completions against the ZenMux /api/v1 gateway. This
// reaches any model ZenMux routes (Claude, GPT, Gemini, …) via the OpenAI wire
// format, complementing the Gemini-native generateContent tools above.
async function chatCompletion({ messages, model, temperature, maxTokens, timeoutMs = 120000 }) {
  requireKey();
  const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: `Bearer ${ZENMUX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || DEFAULT_CHAT_MODEL,
      messages,
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxTokens !== undefined ? { max_tokens: maxTokens } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`ZenMux chat error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------- Tools --------------------------------------------------------

server.registerTool(
  "gemini_generate",
  {
    title: "Text generation via Gemini (ZenMux)",
    description:
      "Send a single prompt to a Gemini model and get the text back. Use this for " +
      "quick generations, rewrites, summaries, or reasoning where you do not need a " +
      "multi-turn conversation. Routed through ZenMux's Vertex-AI-compatible gateway. " +
      `Defaults to '${DEFAULT_MODEL}'; pass a different \`model\` slug for another Gemini model.`,
    inputSchema: {
      prompt: z.string().describe("The user prompt to send"),
      system_instruction: z
        .string()
        .optional()
        .describe("Optional system instruction to steer the model"),
      model: z.string().optional().describe(`Model slug (default: ${DEFAULT_MODEL})`),
      temperature: z.number().min(0).max(2).optional().describe("Sampling temperature (0–2)"),
      max_tokens: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Max output tokens (maps to maxOutputTokens)"),
    },
  },
  async ({ prompt, system_instruction, model, temperature, max_tokens }) => {
    const generationConfig = {
      ...(temperature !== undefined ? { temperature } : {}),
      ...(max_tokens !== undefined ? { maxOutputTokens: max_tokens } : {}),
    };
    const data = await generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: system_instruction,
      generationConfig,
    });
    return { content: [{ type: "text", text: partsText(responseParts(data)) }] };
  },
);

server.registerTool(
  "gemini_chat",
  {
    title: "Multi-turn chat via Gemini (ZenMux)",
    description:
      "General-purpose chat against a Gemini model using the Gen AI `contents` format. " +
      "Supply the conversation as `messages` (roles: user | model). Pass `user_images` " +
      "(URLs) to attach vision inputs to the last user turn for multimodal models.",
    inputSchema: {
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "model"]),
            text: z.string(),
          }),
        )
        .min(1, "At least one message is required")
        .describe("Conversation history. At minimum, supply a single user message."),
      user_images: z
        .array(z.string().url())
        .optional()
        .describe("Image URLs attached to the last user message (multimodal)"),
      system_instruction: z.string().optional().describe("Optional system instruction"),
      model: z.string().optional().describe(`Model slug (default: ${DEFAULT_MODEL})`),
      temperature: z.number().min(0).max(2).optional(),
      max_tokens: z.number().int().positive().optional(),
    },
  },
  async ({ messages, user_images, system_instruction, model, temperature, max_tokens }) => {
    const contents = messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

    if (user_images && user_images.length > 0) {
      const lastUserIndex = contents.map((c) => c.role).lastIndexOf("user");
      if (lastUserIndex === -1) {
        throw new Error("user_images requires at least one user message");
      }
      const imageParts = await Promise.all(user_images.map(urlToInlinePart));
      contents[lastUserIndex].parts.push(...imageParts);
    }

    const generationConfig = {
      ...(temperature !== undefined ? { temperature } : {}),
      ...(max_tokens !== undefined ? { maxOutputTokens: max_tokens } : {}),
    };
    const data = await generateContent({
      model,
      contents,
      systemInstruction: system_instruction,
      generationConfig,
    });
    return { content: [{ type: "text", text: partsText(responseParts(data)) }] };
  },
);

server.registerTool(
  "gemini_image",
  {
    title: "Image generation via Gemini (ZenMux)",
    description:
      "Generate an image from a text prompt with a Gemini image model (native image " +
      "output via responseModalities [TEXT, IMAGE]). The returned image(s) are decoded " +
      `and saved under ${OUT}. Any accompanying text is returned alongside the file paths. ` +
      `Defaults to '${DEFAULT_MODEL}' — pass a Gemini image-capable \`model\` slug.`,
    inputSchema: {
      prompt: z.string().describe("Description of the image to generate"),
      model: z.string().optional().describe(`Model slug (default: ${DEFAULT_MODEL})`),
      filename: z
        .string()
        .optional()
        .describe("Base filename without extension (default: gemini-image-<timestamp>)"),
    },
  },
  async ({ prompt, model, filename }) => {
    const data = await generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    });
    const parts = responseParts(data);
    const base = filename?.replace(/\.[a-z0-9]+$/i, "") || `gemini-image-${Date.now()}`;
    const paths = await saveInlineImages(parts, base);
    const text = partsText(parts);
    if (paths.length === 0) {
      throw new Error(
        `No image returned. Model text: ${text || "(none)"}. ` +
          "Ensure the model supports image output (e.g. a *-image Gemini model).",
      );
    }
    const summary =
      `Saved ${paths.length} image${paths.length > 1 ? "s" : ""}:\n${paths.join("\n")}` +
      (text ? `\n\nModel text: ${text}` : "");
    return { content: [{ type: "text", text: summary }] };
  },
);

server.registerTool(
  "zenmux_complete",
  {
    title: "Single-prompt completion via any ZenMux model (OpenAI-compatible)",
    description:
      "Send one prompt to any model the ZenMux gateway routes (Claude, GPT, Gemini, " +
      "Doubao, Kimi, …) via the OpenAI Chat Completions wire format, and get the text back. " +
      "Use this for quick generations against a non-Gemini model, or when you want the " +
      `OpenAI message format. Defaults to '${DEFAULT_CHAT_MODEL}'; pass a different \`model\` slug ` +
      "(run gemini_list_models to discover ids).",
    inputSchema: {
      prompt: z.string().describe("The user prompt to send"),
      system_prompt: z.string().optional().describe("Optional system prompt to steer the model"),
      model: z.string().optional().describe(`Model slug (default: ${DEFAULT_CHAT_MODEL})`),
      temperature: z.number().min(0).max(2).optional().describe("Sampling temperature (0–2)"),
      max_tokens: z.number().int().positive().optional(),
    },
  },
  async ({ prompt, system_prompt, model, temperature, max_tokens }) => {
    const messages = [
      ...(system_prompt ? [{ role: "system", content: system_prompt }] : []),
      { role: "user", content: prompt },
    ];
    const text = await chatCompletion({ messages, model, temperature, maxTokens: max_tokens });
    return { content: [{ type: "text", text }] };
  },
);

server.registerTool(
  "zenmux_chat",
  {
    title: "Multi-turn chat via any ZenMux model (OpenAI-compatible)",
    description:
      "General-purpose chat completion against the ZenMux gateway using the full OpenAI " +
      "message format, so you can route to any model (Claude, GPT, Gemini, Doubao, Kimi, …). " +
      "Supply the conversation in `messages`. Pass `user_images` (URLs) to append vision " +
      "inputs to the last user turn for multimodal models.",
    inputSchema: {
      messages: z
        .array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          }),
        )
        .min(1, "At least one message is required")
        .describe("Conversation history. At minimum, supply a single user message."),
      user_images: z
        .array(z.string().url())
        .optional()
        .describe("Image URLs appended to the last user message (multimodal)"),
      model: z.string().optional().describe(`Model slug (default: ${DEFAULT_CHAT_MODEL})`),
      temperature: z.number().min(0).max(2).optional(),
      max_tokens: z.number().int().positive().optional(),
    },
  },
  async ({ messages, user_images, model, temperature, max_tokens }) => {
    const msgs = [...messages];

    if (user_images && user_images.length > 0) {
      const lastUserIndex = msgs.map((m) => m.role).lastIndexOf("user");
      if (lastUserIndex === -1) {
        throw new Error("user_images requires at least one user message");
      }
      const last = msgs[lastUserIndex];
      msgs[lastUserIndex] = {
        role: "user",
        content: [
          { type: "text", text: last.content },
          ...user_images.map((url) => ({ type: "image_url", image_url: { url } })),
        ],
      };
    }

    const text = await chatCompletion({ messages: msgs, model, temperature, maxTokens: max_tokens });
    return { content: [{ type: "text", text }] };
  },
);

server.registerTool(
  "gemini_list_models",
  {
    title: "List models routable through ZenMux",
    description:
      "Fetch the catalogue of models the ZenMux gateway can route to (OpenAI-compatible " +
      "GET /models). Use this to discover valid `model` slugs — Gemini ids for the gemini_* " +
      "tools, or any provider slug (anthropic/…, openai/…, moonshotai/…, bytedance/…) for " +
      "zenmux_chat / zenmux_complete.",
    inputSchema: {
      filter: z
        .string()
        .optional()
        .describe("Optional case-insensitive substring to filter model ids (e.g. 'gemini')"),
    },
  },
  async ({ filter }) => {
    requireKey();
    const res = await fetch(MODELS_URL, {
      signal: AbortSignal.timeout(60000),
      headers: { Authorization: `Bearer ${ZENMUX_API_KEY}` },
    });
    if (!res.ok) {
      throw new Error(`ZenMux /models error: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    let ids = Array.isArray(data.data) ? data.data.map((m) => m.id).filter(Boolean) : [];
    if (filter) {
      const f = filter.toLowerCase();
      ids = ids.filter((id) => id.toLowerCase().includes(f));
    }
    const text = ids.length ? ids.join("\n") : JSON.stringify(data, null, 2);
    return { content: [{ type: "text", text }] };
  },
);

// ---------- Boot ---------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
