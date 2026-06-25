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

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Load our pathways alongside Cortex's core pathways.
process.env.CORTEX_PATHWAYS_PATH = path.join(here, "pathways");

// "Ask for the capability; Cortex decides where it lands." The planner model is
// a group so it can be free local Ollama or a hosted model depending on config.
const PLANNER_GROUP = process.env.RHYTHMIX_PLANNER_GROUP || "rhythmix-planner";

// Free local planner model (Ollama). Cortex's OPENAI-CHAT plugin speaks to
// Ollama's OpenAI-compatible endpoint; any bearer token is accepted.
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

const models = {
  "rhythmix-local": {
    name: "rhythmix-local",
    type: "OPENAI-CHAT",
    supportsStreaming: true,
    endpoints: [
      {
        name: "ollama",
        url: `${OLLAMA_URL}/v1/chat/completions`,
        // Ollama's OpenAI-compatible endpoint accepts any bearer token.
        headers: { Authorization: "Bearer ollama" },
        params: { model: OLLAMA_MODEL },
      },
    ],
    metadata: { displayName: "RHYTHMIX Local (Ollama)", provider: "ollama", category: "chat" },
  },
};

const modelGroups = {
  [PLANNER_GROUP]: {
    // First member wins when healthy; add a hosted model id here (e.g.
    // "oai-gpt54-mini") as a quality fallback when you have a key.
    members: ["rhythmix-local"],
    metadata: { displayName: "RHYTHMIX Planner", provider: "cortex", category: "chat", isAgentic: true },
  },
};

// --- Merge our Ollama model INTO Cortex's config file -----------------------
// When CORTEX_CONFIG_FILE is set, Cortex loads models from that file and ignores
// the `models` passed programmatically below. So we read the base config, splice
// in our local model + planner group, write a runtime config, and point Cortex
// at THAT. Result: all of Cortex's defaults PLUS our free local brain, all in
// one registry. The runtime file is regenerated on every boot (gitignored).
const baseConfigPath =
  process.env.CORTEX_BASE_CONFIG_FILE ||
  path.join(here, "node_modules", "@aj-archipelago", "cortex", "config", "default.example.json");

let baseConfig = {};
try {
  baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, "utf8"));
  console.log(`[rhythmix] merged Ollama model into base config: ${baseConfigPath}`);
} catch (err) {
  console.warn(`[rhythmix] could not read base config (${baseConfigPath}): ${err.message}`);
  console.warn("[rhythmix] continuing with our models only.");
}

baseConfig.models = { ...(baseConfig.models || {}), ...models };
baseConfig.modelGroups = { ...(baseConfig.modelGroups || {}), ...modelGroups };
baseConfig.defaultModelName = process.env.DEFAULT_MODEL_NAME || PLANNER_GROUP;

const runtimeConfigPath = path.join(here, "cortex.runtime.json");
fs.writeFileSync(runtimeConfigPath, JSON.stringify(baseConfig, null, 2));
process.env.CORTEX_CONFIG_FILE = runtimeConfigPath;

// Import Cortex only AFTER CORTEX_CONFIG_FILE points at our merged runtime file.
const { default: cortex } = await import("@aj-archipelago/cortex");

const { startServer } = await cortex({
  PORT: Number(process.env.CORTEX_PORT || 4000),
  defaultModelName: process.env.DEFAULT_MODEL_NAME || PLANNER_GROUP,
  models,
  modelGroups,

  entityConfig: {
    rhythmix: {
      name: "RHYTHMIX",
      description:
        "Autonomous content factory for the RHYTHMIX music platform. Turns a " +
        "brief into assets (copy, images, talking-head video) across local and " +
        "hosted engines.",
      instructions: [
        "Plan a brief into concrete asset tasks, then produce each asset with the",
        "right tool. Prefer free local engines (Z-Image, HiDream/ComfyUI, ID-LoRA,",
        "whisper.cpp, LLaVA). Use the hosted ModelsLab tool only when no local GPU",
        "is available. Verify generated images with DescribeOrVerifyImage before",
        "shipping. Never auto-publish: PreparePost stops before submit for human",
        "review. Be honest about failures — surface the engine's error, don't fake",
        "success.",
      ].join(" "),
      // Tool names match each pathway's toolDefinition.function.name.
      tools: [
        "PlanRhythmixWorkflow",
        "GenerateImageZImage",
        "GenerateImageHiDream",
        "GenerateImageModelsLab",
        "GenerateTalkingVideoIDLoRA",
        "TranscribeAudio",
        "DescribeOrVerifyImage",
        "PreparePost",
        "SearchAvailableTools",
      ],
      useMemory: true,
    },
  },
});

await startServer();
