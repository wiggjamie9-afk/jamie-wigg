#!/usr/bin/env node
// NVIDIA NIM MCP server — MiniMax-M3
// Wraps NVIDIA's hosted, OpenAI-compatible MiniMax-M3 endpoint as MCP tools for
// long-context + multimodal (image / video) reasoning in the RHYTHMIX pipeline.
//
// MiniMax-M3 is multimodal: messages may carry text, image_url, and video_url
// parts (public URLs or base64 data URIs). See SETUP-NVIDIA-MINIMAX.md.
//
// Required env vars:
//   NVIDIA_API_KEY   - get one at https://build.nvidia.com (used as a Bearer token)
// Optional env vars:
//   NVIDIA_BASE_URL  - defaults to https://integrate.api.nvidia.com/v1
//   NVIDIA_MODEL     - defaults to minimaxai/minimax-m3

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const MODEL = process.env.NVIDIA_MODEL || "minimaxai/minimax-m3";

const server = new McpServer({ name: "nvidia", version: "0.1.0" });

// ---------- Core client --------------------------------------------------

async function chat({ messages, temperature = 1.0, topP = 0.95, maxTokens = 8192 }) {
  if (!NVIDIA_API_KEY) throw new Error("NVIDIA_API_KEY is not set — add it to .env");

  const body = {
    model: MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    stream: false,
  };

  const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`NVIDIA API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// Build a multimodal user-message content array from text + media URLs.
function buildContent(text, imageUrls = [], videoUrls = []) {
  if ((!imageUrls || imageUrls.length === 0) && (!videoUrls || videoUrls.length === 0)) {
    return text; // plain string — keeps simple text calls clean
  }
  return [
    { type: "text", text },
    ...(imageUrls || []).map((url) => ({ type: "image_url", image_url: { url } })),
    ...(videoUrls || []).map((url) => ({ type: "video_url", video_url: { url } })),
  ];
}

// ---------- Tools --------------------------------------------------------

server.registerTool(
  "minimax_chat",
  {
    title: "Chat with MiniMax-M3 (NVIDIA NIM)",
    description:
      "General-purpose, long-context, multimodal chat with MiniMax-M3 hosted on NVIDIA NIM. " +
      "Use for story development, campaign/series arcs, pitch analysis, or any reasoning task. " +
      "Attach public image or video URLs (or base64 data URIs) via image_urls / video_urls to " +
      "the last user message for multimodal input — e.g. to reason over a mood board or a rendered Cut.",
    inputSchema: {
      messages: z
        .array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          }),
        )
        .describe("Conversation history. At minimum, supply a single user message."),
      image_urls: z
        .array(z.string())
        .optional()
        .describe("Image URLs or data URIs appended to the last user message (multimodal)"),
      video_urls: z
        .array(z.string())
        .optional()
        .describe("Video URLs or data URIs appended to the last user message (multimodal)"),
      temperature: z.number().min(0).max(2).optional().default(1.0),
      top_p: z.number().min(0).max(1).optional().default(0.95),
      max_tokens: z.number().int().positive().optional().default(8192),
    },
  },
  async ({ messages, image_urls, video_urls, temperature, top_p, max_tokens }) => {
    const msgs = [...messages];
    if ((image_urls && image_urls.length) || (video_urls && video_urls.length)) {
      const last = msgs[msgs.length - 1];
      if (last && last.role === "user") {
        msgs[msgs.length - 1] = {
          role: "user",
          content: buildContent(last.content, image_urls, video_urls),
        };
      }
    }

    const result = await chat({ messages: msgs, temperature, topP: top_p, maxTokens: max_tokens });
    return { content: [{ type: "text", text: result }] };
  },
);

server.registerTool(
  "minimax_vision",
  {
    title: "Analyse an image or video frame with MiniMax-M3",
    description:
      "Multimodal critique tool: pass image and/or video URLs plus a question, and MiniMax-M3 " +
      "describes, critiques, or compares them. Built for the RHYTHMIX pipeline — shot selection, " +
      "thumbnail review, brand-consistency checks on rendered frames, or mood-board analysis.",
    inputSchema: {
      prompt: z
        .string()
        .describe("What to ask about the media — e.g. 'Which of these thumbnails has the strongest hook and why?'"),
      image_urls: z.array(z.string()).optional().describe("Image URLs or base64 data URIs to analyse"),
      video_urls: z.array(z.string()).optional().describe("Video URLs or base64 data URIs to analyse"),
      system_prompt: z
        .string()
        .optional()
        .describe("Override the default system prompt (an art-director persona)."),
      max_tokens: z.number().int().positive().optional().default(4096),
    },
  },
  async ({ prompt, image_urls, video_urls, system_prompt, max_tokens }) => {
    if ((!image_urls || !image_urls.length) && (!video_urls || !video_urls.length)) {
      throw new Error("minimax_vision needs at least one image_url or video_url");
    }
    const defaultSystem =
      "You are an art director and shot critic for RHYTHMIX, an AI music platform brand. " +
      "You judge frames, thumbnails, and reference images for visual impact, brand fit " +
      "(neon, cinematic, high-energy), and hook strength. Be specific and decisive.";

    const result = await chat({
      messages: [
        { role: "system", content: system_prompt || defaultSystem },
        { role: "user", content: buildContent(prompt, image_urls, video_urls) },
      ],
      maxTokens: max_tokens,
    });
    return { content: [{ type: "text", text: result }] };
  },
);

server.registerTool(
  "minimax_script",
  {
    title: "Write a RHYTHMIX script / narration with MiniMax-M3",
    description:
      "Write a video script, promo narration, pitch-deck copy, or animated-series dialogue with " +
      "MiniMax-M3. Pass existing scenes, brand docs, or reference scripts as context. Lower " +
      "temperature for tighter, on-brief copy; higher for more inventive drafts.",
    inputSchema: {
      prompt: z
        .string()
        .describe("What to write — e.g. 'A 60s landscape promo narration for the RHYTHMIX Studio launch'"),
      system_prompt: z
        .string()
        .optional()
        .describe("Override the default RHYTHMIX scriptwriter persona."),
      context: z.string().optional().describe("Reference material — existing scenes, brand doc, prior script"),
      format: z
        .enum(["narration", "dialogue", "shot-list", "pitch-deck", "raw"])
        .optional()
        .default("narration")
        .describe("Output structure hint"),
      temperature: z.number().min(0).max(2).optional().default(0.8),
      max_tokens: z.number().int().positive().optional().default(2048),
    },
  },
  async ({ prompt, system_prompt, context, format, temperature, max_tokens }) => {
    const defaultSystem =
      "You are a cinematic scriptwriter for RHYTHMIX, an AI music platform brand. " +
      "Your scripts are punchy, vivid, and built for animated visuals and voiceover. " +
      "Beats are short (5–15 words), emotionally direct, and end on a strong hook or call-to-action. " +
      "For pitch-deck copy, structure as: Hook → Problem → Solution → Proof → Vision → CTA.";

    const userContent = [
      context ? `--- CONTEXT ---\n${context}\n---\n` : "",
      `FORMAT: ${format}\n`,
      prompt,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await chat({
      messages: [
        { role: "system", content: system_prompt || defaultSystem },
        { role: "user", content: userContent },
      ],
      temperature,
      maxTokens: max_tokens,
    });
    return { content: [{ type: "text", text: result }] };
  },
);

// ---------- Boot ---------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
