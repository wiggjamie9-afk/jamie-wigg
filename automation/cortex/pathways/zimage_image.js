/**
 * Cortex pathway: fast local stills via the Z-Image-Turbo MCP server.
 *
 * The JS port of automation/handlers/zimage_handler.py — talks to the local
 * Z-Image MCP server (JSON-RPC over streamable HTTP), saving base64 images to
 * disk. Exposed as the `GenerateImageZImage` entity tool (free local GPU path,
 * preferred over the hosted ModelsLab tool when a GPU is available).
 *
 * Start the server:  cd backend && ./run_mcp.sh --http --port 8001
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOST = (process.env.ZIMAGE_HOST || "http://localhost:8001").replace(/\/$/, "");
const MCP_PATH = "/" + (process.env.ZIMAGE_MCP_PATH || "mcp").replace(/^\/+|\/+$/g, "");
const OUT_DIR =
  process.env.ZIMAGE_OUT_DIR ||
  path.join(os.homedir(), "RHYTHMIX_Empire", "output", "images");

let SESSION = null;
let RPC_ID = 0;

function parseBody(raw) {
  raw = raw.trim();
  try {
    return JSON.parse(raw);
  } catch {
    /* fall through to SSE parsing */
  }
  let last = {};
  for (const line of raw.split(/\r?\n/)) {
    const l = line.trim();
    if (l.startsWith("data:")) {
      try {
        last = JSON.parse(l.slice(5).trim());
      } catch {
        /* ignore non-JSON data lines */
      }
    }
  }
  return last;
}

async function rpc(method, params, notify = false) {
  const body = { jsonrpc: "2.0", method };
  if (params !== undefined) body.params = params;
  if (!notify) {
    RPC_ID += 1;
    body.id = RPC_ID;
  }
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (SESSION) headers["mcp-session-id"] = SESSION;

  const res = await fetch(HOST + MCP_PATH, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const sid = res.headers.get("mcp-session-id");
  if (sid) SESSION = sid;
  const raw = await res.text();
  if (notify || !raw.trim()) return {};
  const payload = parseBody(raw);
  if (payload.error) throw new Error("mcp_error: " + JSON.stringify(payload.error));
  return payload.result || {};
}

async function ensureSession() {
  if (SESSION) return;
  await rpc("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "rhythmix-cortex", version: "0.1.0" },
  });
  if (!SESSION) SESSION = "sessionless";
  await rpc("notifications/initialized", undefined, true);
}

async function reachable() {
  try {
    await fetch(HOST + "/", { method: "GET" });
    return true;
  } catch {
    return false;
  }
}

function saveContent(content, stem) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const images = [];
  const texts = [];
  (content || []).forEach((item, i) => {
    if (item.type === "image" && item.data) {
      const ext = (item.mimeType || "image/png").split("/").pop() || "png";
      const p = path.join(OUT_DIR, `${stem}_${i}.${ext}`);
      fs.writeFileSync(p, Buffer.from(item.data, "base64"));
      images.push(p);
    } else if (item.type === "text" && item.text) {
      texts.push(item.text);
    }
  });
  return { images, text: texts.join("\n") };
}

export default {
  inputParameters: {
    prompt: "",
    width: 1024,
    height: 1024,
    steps: Number(process.env.ZIMAGE_STEPS || 8),
    seed: -1,
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "GenerateImageZImage",
        description:
          "Generate a still image from a text prompt using the local " +
          "Z-Image-Turbo server (fast, free, needs a GPU). Prefer this over the " +
          "hosted ModelsLab tool when a local GPU is available.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "What to generate." },
            width: { type: "integer", default: 1024 },
            height: { type: "integer", default: 1024 },
          },
          required: ["prompt"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    if (!(await reachable())) {
      return JSON.stringify({
        status: "failed",
        error: "zimage_not_running",
        hint: "Start the server: cd backend && ./run_mcp.sh --http --port 8001",
      });
    }
    const a = {
      prompt: args.prompt,
      width: args.width,
      height: args.height,
      num_inference_steps: args.steps,
    };
    if (args.seed != null && args.seed >= 0) a.seed = args.seed;

    let result;
    try {
      await ensureSession();
      result = await rpc("tools/call", { name: "generate_image", arguments: a });
    } catch (e) {
      return JSON.stringify({ status: "failed", error: String(e) });
    }
    if (result.isError) {
      return JSON.stringify({ status: "failed", error: String(result.content) });
    }
    const stem =
      "img_" + (args.prompt || "img").slice(0, 40).replace(/[^a-zA-Z0-9]/g, "_");
    const { images, text } = saveContent(result.content || [], stem);
    if (!images.length && !text) {
      return JSON.stringify({ status: "failed", error: "no_image_in_response" });
    }
    return JSON.stringify({ status: "completed", engine: "z-image-turbo", output: images, text });
  },
};
