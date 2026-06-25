/**
 * Cortex pathway: hosted text-to-image via ModelsLab (the no-GPU path).
 *
 * The JS port of automation/handlers/modelslab_handler.py — same v6 API, same
 * async fetch-poll pattern. Exposed as the `GenerateImageModelsLab` entity tool.
 * Cost lives on the user's MODELSLAB_API_KEY, not our infra.
 */

const BASE = process.env.MODELSLAB_BASE || "https://modelslab.com/api/v6";

async function post(pathSuffix, body) {
  const res = await fetch(`${BASE}${pathSuffix}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function extractUrls(payload) {
  const out = payload.output || payload.future_links || [];
  if (typeof out === "string") return [out];
  return Array.isArray(out) ? out.filter((u) => typeof u === "string") : [];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default {
  inputParameters: {
    prompt: "",
    width: 1024,
    height: 1024,
    samples: 1,
    model_id: "",
    negative_prompt: "",
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "GenerateImageModelsLab",
        description:
          "Generate an image from a text prompt using ModelsLab's hosted API " +
          "(10,000+ models incl. FLUX). Use when no local GPU is available.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "What to generate." },
            width: { type: "integer", description: "Image width.", default: 1024 },
            height: { type: "integer", description: "Image height.", default: 1024 },
            model_id: { type: "string", description: "Optional ModelsLab model id." },
          },
          required: ["prompt"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    const key = process.env.MODELSLAB_API_KEY;
    if (!key) {
      return JSON.stringify({
        status: "failed",
        error: "modelslab_no_api_key",
        hint:
          "Set MODELSLAB_API_KEY (modelslab.com/dashboard). Note: modelslab.com " +
          "egress is blocked from the cloud sandbox — run on the Mac.",
      });
    }

    const body = {
      key,
      prompt: args.prompt,
      width: String(args.width),
      height: String(args.height),
      samples: String(args.samples),
      negative_prompt: args.negative_prompt || "",
    };
    if (args.model_id) body.model_id = args.model_id;

    let payload;
    try {
      payload = await post("/realtime/text2img", body);
    } catch (e) {
      return JSON.stringify({ status: "failed", error: String(e) });
    }

    if (payload.status === "success") {
      return JSON.stringify({ status: "completed", output: extractUrls(payload) });
    }

    if (payload.status === "processing") {
      const jobId = payload.id || payload.request_id;
      const eta = Math.min(Math.max(payload.eta || 5, 2), 10);
      let waited = 0;
      while (waited < 300) {
        await sleep(eta * 1000);
        waited += eta;
        let fetched;
        try {
          fetched = await post(`/realtime/fetch/${jobId}`, { key });
        } catch (e) {
          return JSON.stringify({ status: "failed", error: String(e) });
        }
        if (fetched.status === "success") {
          return JSON.stringify({
            status: "completed",
            output: extractUrls(fetched),
            job_id: jobId,
          });
        }
        if (fetched.status === "failed" || fetched.status === "error") {
          return JSON.stringify({ status: "failed", job_id: jobId, error: String(fetched.message || fetched) });
        }
      }
      return JSON.stringify({ status: "timeout", job_id: jobId });
    }

    return JSON.stringify({ status: "failed", error: String(payload.message || JSON.stringify(payload)) });
  },
};
