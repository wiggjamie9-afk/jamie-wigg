#!/usr/bin/env node
// Creative Stack MCP server.
// Exposes Replicate (image/video/music gen) and ElevenLabs (voice) as MCP tools.
//
// Required env vars:
//   REPLICATE_API_TOKEN   - get at https://replicate.com/account/api-tokens
//   ELEVENLABS_API_KEY    - get at https://elevenlabs.io/app/settings/api-keys
//
// Optional env vars:
//   CREATIVE_OUT_DIR      - directory for downloaded artifacts (default: ./creative-out)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const OUT = process.env.CREATIVE_OUT_DIR
  ? resolve(process.env.CREATIVE_OUT_DIR)
  : resolve(process.cwd(), "creative-out");

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

const server = new McpServer({
  name: "creative-stack",
  version: "0.1.0",
});

// ---------- Replicate ---------------------------------------------------

async function replicateRun({ model, input, timeoutMs = 600000 }) {
  if (!REPLICATE_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN is not set");
  }
  const start = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait=60",
    },
    body: JSON.stringify({ version: model.split(":")[1] || undefined, model: model.includes(":") ? undefined : model, input }),
  });
  if (!start.ok) {
    throw new Error(`Replicate start failed: ${start.status} ${await start.text()}`);
  }
  let prediction = await start.json();
  const deadline = Date.now() + timeoutMs;
  while (
    prediction.status !== "succeeded" &&
    prediction.status !== "failed" &&
    prediction.status !== "canceled"
  ) {
    if (Date.now() > deadline) throw new Error("Replicate timeout");
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(prediction.urls.get, {
      headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
    });
    prediction = await poll.json();
  }
  if (prediction.status !== "succeeded") {
    throw new Error(`Replicate ${prediction.status}: ${prediction.error || ""}`);
  }
  return prediction.output;
}

async function downloadToDisk(url, filename) {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const path = join(OUT, filename);
  await writeFile(path, buf);
  return path;
}

server.registerTool(
  "replicate_run",
  {
    title: "Run a Replicate model (generic)",
    description:
      "Run any model on replicate.com. Supply 'model' as 'owner/name' or 'owner/name:version'. 'input' is an object of model-specific parameters. Returns the raw model output (typically a URL or array of URLs). For common cases use replicate_image / replicate_video / replicate_music instead.",
    inputSchema: {
      model: z.string().describe("Model identifier, e.g. 'black-forest-labs/flux-1.1-pro' or 'owner/name:version-hash'"),
      input: z.record(z.any()).describe("Input parameters specific to the chosen model"),
      timeoutMs: z.number().int().positive().optional().describe("Override poll timeout (default 600000)"),
    },
  },
  async ({ model, input, timeoutMs }) => {
    const output = await replicateRun({ model, input, timeoutMs });
    return {
      content: [
        { type: "text", text: typeof output === "string" ? output : JSON.stringify(output, null, 2) },
      ],
    };
  },
);

server.registerTool(
  "replicate_image",
  {
    title: "Generate an image",
    description:
      "Generate a still image from a text prompt using FLUX 1.1 Pro on Replicate. Returns the URL of the generated image and downloads it to the output directory.",
    inputSchema: {
      prompt: z.string().describe("Description of the image to generate"),
      aspect_ratio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"]).optional().default("1:1"),
      filename: z.string().optional().describe("Output filename (default: replicate-image-<timestamp>.png)"),
    },
  },
  async ({ prompt, aspect_ratio, filename }) => {
    const output = await replicateRun({
      model: "black-forest-labs/flux-1.1-pro",
      input: { prompt, aspect_ratio, output_format: "png" },
    });
    const url = Array.isArray(output) ? output[0] : output;
    const fname = filename || `replicate-image-${Date.now()}.png`;
    const path = await downloadToDisk(url, fname);
    return {
      content: [{ type: "text", text: `Saved to ${path}\nURL: ${url}` }],
    };
  },
);

server.registerTool(
  "replicate_video",
  {
    title: "Generate a video clip",
    description:
      "Generate a short video clip from a text prompt using HunyuanVideo on Replicate. Typically produces 5-10 second clips. Returns local path and URL.",
    inputSchema: {
      prompt: z.string().describe("Description of the video to generate"),
      filename: z.string().optional().describe("Output filename (default: replicate-video-<timestamp>.mp4)"),
    },
  },
  async ({ prompt, filename }) => {
    const output = await replicateRun({
      model: "tencent/hunyuan-video",
      input: { prompt },
      timeoutMs: 1200000,
    });
    const url = Array.isArray(output) ? output[0] : output;
    const fname = filename || `replicate-video-${Date.now()}.mp4`;
    const path = await downloadToDisk(url, fname);
    return {
      content: [{ type: "text", text: `Saved to ${path}\nURL: ${url}` }],
    };
  },
);

server.registerTool(
  "replicate_music",
  {
    title: "Generate music or sound",
    description:
      "Generate music or sound from a text prompt using MusicGen on Replicate. Returns local path and URL.",
    inputSchema: {
      prompt: z.string().describe("Description of the music to generate (e.g., 'upbeat synth-pop with a driving bassline')"),
      duration: z.number().int().min(1).max(30).optional().default(8).describe("Length in seconds (1-30)"),
      filename: z.string().optional().describe("Output filename (default: replicate-music-<timestamp>.wav)"),
    },
  },
  async ({ prompt, duration, filename }) => {
    const output = await replicateRun({
      model: "meta/musicgen",
      input: { prompt, duration, output_format: "wav" },
      timeoutMs: 600000,
    });
    const url = Array.isArray(output) ? output[0] : output;
    const fname = filename || `replicate-music-${Date.now()}.wav`;
    const path = await downloadToDisk(url, fname);
    return {
      content: [{ type: "text", text: `Saved to ${path}\nURL: ${url}` }],
    };
  },
);

// ---------- ElevenLabs --------------------------------------------------

server.registerTool(
  "elevenlabs_tts",
  {
    title: "Generate speech with ElevenLabs",
    description:
      "Synthesize speech from text using ElevenLabs. Returns the path to a saved MP3.",
    inputSchema: {
      text: z.string().describe("Text to speak"),
      voice_id: z.string().describe("ElevenLabs voice ID (use elevenlabs_voices to list)"),
      model_id: z.string().optional().default("eleven_multilingual_v2").describe("ElevenLabs model id"),
      filename: z.string().optional().describe("Output filename (default: elevenlabs-<timestamp>.mp3)"),
      stability: z.number().min(0).max(1).optional().default(0.5),
      similarity_boost: z.number().min(0).max(1).optional().default(0.75),
    },
  },
  async ({ text, voice_id, model_id, filename, stability, similarity_boost }) => {
    if (!ELEVENLABS_KEY) throw new Error("ELEVENLABS_API_KEY is not set");
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings: { stability, similarity_boost },
      }),
    });
    if (!res.ok) {
      throw new Error(`ElevenLabs TTS failed: ${res.status} ${await res.text()}`);
    }
    if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
    const buf = Buffer.from(await res.arrayBuffer());
    const fname = filename || `elevenlabs-${Date.now()}.mp3`;
    const path = join(OUT, fname);
    await writeFile(path, buf);
    return { content: [{ type: "text", text: `Saved to ${path}` }] };
  },
);

server.registerTool(
  "elevenlabs_voices",
  {
    title: "List available ElevenLabs voices",
    description:
      "List voices available in your ElevenLabs account, including pre-made and cloned voices. Returns voice_id, name, and category for each.",
    inputSchema: {},
  },
  async () => {
    if (!ELEVENLABS_KEY) throw new Error("ELEVENLABS_API_KEY is not set");
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": ELEVENLABS_KEY },
    });
    if (!res.ok) throw new Error(`ElevenLabs voices failed: ${res.status}`);
    const data = await res.json();
    const voices = (data.voices || []).map((v) => ({
      voice_id: v.voice_id,
      name: v.name,
      category: v.category,
      labels: v.labels,
    }));
    return { content: [{ type: "text", text: JSON.stringify(voices, null, 2) }] };
  },
);

// ---------- Boot --------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
