/**
 * Cortex pathway: heavy local image / HiDream-O1 via ComfyUI.
 *
 * The JS port of automation/handlers/comfyui_handler.py's HiDream-O1 support:
 * loads the official ComfyUI workflow template JSON, overrides
 * prompt/checkpoint/reference/seed/steps, queues it on the local ComfyUI server,
 * and polls history for the result. Exposed as the `GenerateImageHiDream` tool
 * (local GPU, up to 2048px, strong long-text rendering).
 *
 * Needs ComfyUI running (default 127.0.0.1:8188) with the HiDream-O1 checkpoint
 * + the workflow template JSON downloaded. Pass the template path via
 * HIDREAM_TEMPLATE or the `template_path` arg.
 */

import fs from "node:fs";

const SERVER = process.env.COMFYUI_SERVER || "127.0.0.1:8188";
const BASE = `http://${SERVER}`;
const DEFAULT_TEMPLATE = process.env.HIDREAM_TEMPLATE || "";
const DEFAULT_CKPT = process.env.HIDREAM_CKPT || "hidream_o1_image_fp8_scaled.safetensors";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadTemplate(p) {
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  return data.prompt && typeof data.prompt === "object" ? data.prompt : data;
}

function overrideInputs(nodes, overrides) {
  for (const ov of overrides) {
    for (const node of Object.values(nodes)) {
      if (typeof node !== "object" || node === null) continue;
      if (ov.class_type && node.class_type !== ov.class_type) continue;
      if (ov.title && node._meta?.title !== ov.title) continue;
      node.inputs = node.inputs || {};
      node.inputs[ov.field] = ov.value;
      if (!ov.all) break;
    }
  }
}

async function queuePrompt(nodes) {
  const res = await fetch(`${BASE}/prompt`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: nodes }),
  });
  if (!res.ok) throw new Error(`comfyui_http_${res.status}`);
  return res.json();
}

async function getHistory(id) {
  const res = await fetch(`${BASE}/history/${id}`);
  return res.ok ? res.json() : {};
}

export default {
  inputParameters: {
    prompt: "",
    template_path: DEFAULT_TEMPLATE,
    checkpoint: DEFAULT_CKPT,
    reference_image: "",
    seed: -1,
    steps: 0,
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "GenerateImageHiDream",
        description:
          "Generate a high-quality image (up to 2048px, excellent text rendering) " +
          "with HiDream-O1 via local ComfyUI. Supports image editing when a " +
          "reference image is provided. Local GPU engine.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "What to generate (include any text to render)." },
            reference_image: { type: "string", description: "Optional reference image filename for edit mode." },
          },
          required: ["prompt"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    const tpl = args.template_path || DEFAULT_TEMPLATE;
    if (!tpl || !fs.existsSync(tpl)) {
      return JSON.stringify({
        status: "failed",
        error: "template_not_found",
        hint:
          "Download image_hidream_o1.json from github.com/Comfy-Org/workflow_templates " +
          "and set HIDREAM_TEMPLATE or pass template_path.",
      });
    }

    let nodes;
    try {
      nodes = loadTemplate(tpl);
    } catch (e) {
      return JSON.stringify({ status: "failed", error: "bad_template_json: " + String(e) });
    }

    const overrides = [{ class_type: "CLIPTextEncode", field: "text", value: args.prompt }];
    if (args.checkpoint)
      overrides.push({ class_type: "CheckpointLoaderSimple", field: "ckpt_name", value: args.checkpoint });
    if (args.reference_image)
      overrides.push({ class_type: "LoadImage", field: "image", value: args.reference_image });
    if (args.seed != null && args.seed >= 0) {
      overrides.push({ field: "noise_seed", value: args.seed, all: true });
      overrides.push({ field: "seed", value: args.seed, all: true });
    }
    if (args.steps && args.steps > 0)
      overrides.push({ field: "steps", value: args.steps, all: true });
    overrideInputs(nodes, overrides);

    let queued;
    try {
      queued = await queuePrompt(nodes);
    } catch (e) {
      return JSON.stringify({
        status: "failed",
        error: String(e),
        hint: `Is ComfyUI running at ${BASE}?`,
      });
    }
    const id = queued.prompt_id;
    if (!id) return JSON.stringify({ status: "failed", error: "no_prompt_id", detail: queued });

    // Poll history until this prompt completes (cap ~10 min).
    let waited = 0;
    while (waited < 600) {
      await sleep(2000);
      waited += 2;
      const hist = await getHistory(id);
      if (hist && hist[id]) {
        return JSON.stringify({ status: "completed", engine: "hidream-o1", prompt_id: id, history: hist[id] });
      }
    }
    return JSON.stringify({ status: "timeout", prompt_id: id });
  },
};
