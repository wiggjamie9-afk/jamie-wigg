/**
 * Cortex pathway: vision / asset quality-check via a local LLaVA server.
 *
 * The JS port of automation/handlers/llava_handler.py's describe/verify path,
 * targeting an OpenAI-compatible vision endpoint (e.g. a llama.cpp server with a
 * LLaVA GGUF, or any /v1/chat/completions server that accepts image_url).
 * Exposed as the `DescribeOrVerifyImage` tool — used to QA generated assets
 * before they ship.
 *
 * Point LLAVA_URL at the server base (default http://localhost:8080).
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const BASE = (process.env.LLAVA_URL || "http://localhost:8080").replace(/\/$/, "");
const MODEL = process.env.LLAVA_MODEL || "llava";

function toDataUrl(p) {
  const ext = (path.extname(p).slice(1) || "png").toLowerCase();
  const mime = ext === "jpg" ? "jpeg" : ext;
  return `data:image/${mime};base64,${readFileSync(p).toString("base64")}`;
}

export default {
  inputParameters: {
    image: "",
    question: "Describe this image in detail.",
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "DescribeOrVerifyImage",
        description:
          "Look at an image with a local LLaVA vision model and answer a " +
          "question about it — describe it, or verify a generated asset matches " +
          "its brief before shipping.",
        parameters: {
          type: "object",
          properties: {
            image: { type: "string", description: "Path to the image file." },
            question: { type: "string", description: "What to ask about the image." },
          },
          required: ["image"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    if (!args.image || !existsSync(args.image)) {
      return JSON.stringify({ status: "failed", error: "image_not_found", detail: args.image });
    }

    let dataUrl;
    try {
      dataUrl = toDataUrl(args.image);
    } catch (e) {
      return JSON.stringify({ status: "failed", error: "read_failed: " + String(e) });
    }

    let res;
    try {
      res = await fetch(`${BASE}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: args.question },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
        }),
      });
    } catch (e) {
      return JSON.stringify({
        status: "failed",
        error: String(e),
        hint: `Is a LLaVA server running at ${BASE}? Set LLAVA_URL.`,
      });
    }
    if (!res.ok) {
      return JSON.stringify({ status: "failed", error: `llava_http_${res.status}` });
    }
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "";
    return JSON.stringify({ status: "completed", engine: "llava", answer });
  },
};
