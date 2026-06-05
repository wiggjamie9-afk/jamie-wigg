#!/usr/bin/env node
// StepFun MCP server — Step 3.7 Flash
// Exposes Flash as MCP tools for script, story, and chat generation.
//
// Required env vars:
//   STEP_API_KEY    - get at https://platform.stepfun.ai
//   STEP_BASE_URL   - https://api.stepfun.ai/v1 (Global) or https://api.stepfun.com/v1 (China)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const STEP_API_KEY = process.env.STEP_API_KEY;
const STEP_BASE_URL = process.env.STEP_BASE_URL || "https://api.stepfun.ai/v1";
const MODEL = "step-3.7-flash";

const server = new McpServer({ name: "stepfun", version: "0.1.0" });

// ---------- Core client --------------------------------------------------

async function flashChat({ messages, reasoning = "medium", maxTokens = 4096 }) {
  if (!STEP_API_KEY) throw new Error("STEP_API_KEY is not set — add it to .env");

  const body = {
    model: MODEL,
    messages,
    max_tokens: maxTokens,
    ...(reasoning !== "off" ? { thinking: { type: reasoning } } : {}),
  };

  const res = await fetch(`${STEP_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STEP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`StepFun API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------- Tools --------------------------------------------------------

server.registerTool(
  "flash_script",
  {
    title: "Generate a script with Step 3.7 Flash",
    description:
      "Write a video script, episode narration, pitch deck copy, or animated series dialogue using Step 3.7 Flash. Supports 256k context so you can pass existing scripts, brand docs, or scene descriptions as context. reasoning='low' is fast and cheap; 'medium' (default) balances quality and cost; 'high' is best for multi-act story structure. For RHYTHMIX promos, pass the brand voice (upbeat, cinematic, brief) in the system_prompt.",
    inputSchema: {
      prompt: z.string().describe("What to write — e.g. 'A 60s pitch deck narration for an animated TV series about AI musicians'"),
      system_prompt: z.string().optional().describe("Override the default system prompt. Defaults to a RHYTHMIX-aware scriptwriter persona."),
      context: z.string().optional().describe("Additional context to inject — e.g. existing scenes, brand doc, reference script"),
      format: z.enum(["narration", "dialogue", "shot-list", "pitch-deck", "raw"]).optional().default("narration").describe("Output structure hint"),
      reasoning: z.enum(["low", "medium", "high"]).optional().default("medium"),
      max_tokens: z.number().int().positive().optional().default(2048),
    },
  },
  async ({ prompt, system_prompt, context, format, reasoning, max_tokens }) => {
    const defaultSystem =
      "You are a cinematic scriptwriter for RHYTHMIX, an AI music platform brand. " +
      "Your scripts are punchy, vivid, and built for animated visuals and voiceover. " +
      "Scenes are short (5–15 words per beat), emotionally direct, and end on a strong call-to-action or hook. " +
      "When writing pitch deck copy, structure it as: Hook → Problem → Solution → Proof → Vision → CTA.";

    const userContent = [
      context ? `--- CONTEXT ---\n${context}\n---\n` : "",
      `FORMAT: ${format}\n`,
      prompt,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await flashChat({
      messages: [
        { role: "system", content: system_prompt || defaultSystem },
        { role: "user", content: userContent },
      ],
      reasoning,
      maxTokens: max_tokens,
    });

    return { content: [{ type: "text", text: result }] };
  },
);

server.registerTool(
  "flash_chat",
  {
    title: "Chat with Step 3.7 Flash (generic)",
    description:
      "General-purpose chat with Step 3.7 Flash. Use for story development, episode arcs, character breakdowns, pitch analysis, or any long-context reasoning task. Supports up to 256k tokens of context. Pass image URLs in user_images for multimodal input — e.g. to analyse a mood board or storyboard.",
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
        .describe("Image URLs to append to the last user message (multimodal)"),
      reasoning: z.enum(["low", "medium", "high", "off"]).optional().default("medium"),
      max_tokens: z.number().int().positive().optional().default(4096),
    },
  },
  async ({ messages, user_images, reasoning, max_tokens }) => {
    let msgs = [...messages];

    // Append images to the last user message if provided
    if (user_images && user_images.length > 0) {
      const last = msgs[msgs.length - 1];
      if (last.role === "user") {
        msgs[msgs.length - 1] = {
          role: "user",
          content: [
            { type: "text", text: last.content },
            ...user_images.map((url) => ({ type: "image_url", image_url: { url } })),
          ],
        };
      }
    }

    const result = await flashChat({ messages: msgs, reasoning, maxTokens: max_tokens });
    return { content: [{ type: "text", text: result }] };
  },
);

server.registerTool(
  "flash_episode_brief",
  {
    title: "Generate an episode brief / pitch page",
    description:
      "Produce a structured episode brief or series pitch page for an animated TV series concept. Outputs: title, logline, act structure, visual style notes, and a 3-sentence hook for a pitch deck or promo site. Ideal for feeding into /site-build or /rhythmix-author.",
    inputSchema: {
      series_title: z.string().describe("Name of the animated series"),
      series_premise: z.string().describe("One-paragraph premise — genre, world, central conflict"),
      episode_number: z.number().int().positive().optional().default(1),
      episode_topic: z.string().describe("What this episode is about"),
      target_length: z.enum(["90s", "5min", "10min", "feature"]).optional().default("5min"),
      visual_style: z.string().optional().describe("Visual style reference — e.g. 'neon cyberpunk, cel-shaded, Studio Ghibli-influenced'"),
      reasoning: z.enum(["low", "medium", "high"]).optional().default("high"),
    },
  },
  async ({ series_title, series_premise, episode_number, episode_topic, target_length, visual_style, reasoning }) => {
    const prompt = `
Series: ${series_title}
Premise: ${series_premise}
Episode: ${episode_number} — ${episode_topic}
Target length: ${target_length}
${visual_style ? `Visual style: ${visual_style}` : ""}

Write a structured episode brief with these sections:
1. LOGLINE (one sentence)
2. HOOK (3 sentences — for a pitch deck or animated promo site)
3. ACT STRUCTURE (3 acts, 2–3 beats each)
4. VISUAL NOTES (colours, camera language, key frames)
5. PROMO COPY (30-word social caption + 10-word tagline)
`.trim();

    const result = await flashChat({
      messages: [
        {
          role: "system",
          content:
            "You are a showrunner and pitch writer for animated web series. Your briefs are sharp, visual, and sellable.",
        },
        { role: "user", content: prompt },
      ],
      reasoning,
      maxTokens: 2048,
    });

    return { content: [{ type: "text", text: result }] };
  },
);

// ---------- Boot ---------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
