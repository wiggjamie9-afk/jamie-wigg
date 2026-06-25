/**
 * Cortex pathway: plan a RHYTHMIX brief into concrete asset tasks.
 *
 * The JS port of OllamaOrchestrationHandler.handle_plan_workflow — but model-
 * agnostic: it uses Cortex's default model (or the `rhythmix-planner` group),
 * so the same pathway runs on free local Ollama or a hosted model depending on
 * config. Returns a JSON workflow the entity agent can execute with its tools.
 */

export default {
  // No `model` — let Cortex routing pick (defaultModelName / model group).
  prompt: [
    "You are RHYTHMIX's autonomous workflow planner.",
    "Given a business brief, return ONLY a JSON object with keys:",
    "workflow_name (string), tasks (array of {task_id, type, input, depends_on}),",
    "estimated_duration_minutes (number).",
    "Valid task types: image_generation, talking_video, text_generation,",
    "audio_generation, publish, research.",
    "",
    "Brief:",
    "{{{text}}}",
  ].join("\n"),

  inputParameters: {
    text: "",
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "PlanRhythmixWorkflow",
        description:
          "Turn a RHYTHMIX brief into a JSON workflow of asset tasks " +
          "(image/talking_video/text/audio/publish/research).",
        parameters: {
          type: "object",
          properties: {
            text: { type: "string", description: "The brief to plan." },
          },
          required: ["text"],
        },
      },
    },
  ],
};
