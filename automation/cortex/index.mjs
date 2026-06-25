/**
 * RHYTHMIX × Cortex — backbone entry point.
 *
 * Boots Cortex with one `rhythmix` entity that owns the content-factory tools.
 * Our generation engines live as pathways in ./pathways and become entity tools
 * via their toolDefinition. Native providers (Ollama, OpenAI, Gemini, Claude,
 * Replicate) are configured through Cortex model config + model groups — no
 * pathway needed for those.
 *
 * Run on a real machine (not the iPhone-only flow), with at least one model
 * provider key set:
 *
 *     cd automation/cortex && npm install
 *     OPENAI_API_KEY=...  (or OLLAMA_URL=http://localhost:11434 for free local)
 *     npm start            # GraphQL at :4000/graphql, REST at /v1/* and /rest/*
 *
 * Then drive the agent:
 *     curl http://localhost:4000/v1/chat/completions \
 *       -H 'content-type: application/json' \
 *       -d '{"model":"cortex-agent","messages":[{"role":"user",
 *            "content":"Plan a 3-asset launch for RHYTHMIX and generate the cover."}]}'
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import cortex from "@aj-archipelago/cortex";

const here = path.dirname(fileURLToPath(import.meta.url));

// Load our pathways alongside Cortex's core pathways.
process.env.CORTEX_PATHWAYS_PATH = path.join(here, "pathways");

// "Ask for the capability; Cortex decides where it lands." The planner model is
// a group so it can be free local Ollama or a hosted model depending on config.
const PLANNER_GROUP = process.env.RHYTHMIX_PLANNER_GROUP || "rhythmix-planner";

const { startServer } = await cortex({
  PORT: Number(process.env.CORTEX_PORT || 4000),
  defaultModelName: process.env.DEFAULT_MODEL_NAME || PLANNER_GROUP,

  entityConfig: {
    rhythmix: {
      name: "RHYTHMIX",
      description:
        "Autonomous content factory for the RHYTHMIX music platform. Turns a " +
        "brief into assets (copy, images, talking-head video) across local and " +
        "hosted engines.",
      instructions: [
        "Plan a brief into concrete asset tasks, then produce each asset with the",
        "right tool. Prefer free local engines (Ollama, Z-Image, ComfyUI, ID-LoRA).",
        "Use the hosted ModelsLab tool when no local GPU is available.",
        "Never auto-publish: stop before any outward-facing post for human review.",
        "Be honest about failures — surface the engine's error, don't fake success.",
      ].join(" "),
      // Tool names match each pathway's toolDefinition.function.name.
      tools: [
        "GenerateImageModelsLab",
        "GenerateTalkingVideoIDLoRA",
        "SearchAvailableTools",
      ],
      useMemory: true,
    },
  },
});

await startServer();
