/**
 * Cortex pathway: gated GUI publishing via Agent TARS.
 *
 * The JS port of automation/handlers/agent_tars_handler.py's publish path —
 * shells out to the agent-tars CLI to drive a real browser, but ALWAYS stops
 * before submitting so a human reviews and clicks publish. Exposed as the
 * `PreparePost` tool.
 *
 * This is the one outward-facing tool in the factory. It is deliberately gated:
 * it never auto-posts. The entity instructions also forbid auto-publishing.
 */

import { spawn } from "node:child_process";

const PROVIDER = process.env.AGENT_TARS_PROVIDER || "anthropic";
const MODEL = process.env.AGENT_TARS_MODEL || "claude-3-7-sonnet-latest";

function apiKeyFor(provider) {
  const map = {
    anthropic: "ANTHROPIC_API_KEY",
    openai: "OPENAI_API_KEY",
    volcengine: "VOLCENGINE_API_KEY",
  };
  return process.env[map[provider] || ""] || null;
}

function run(cmd, args, timeoutMs) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args);
    let out = "";
    let err = "";
    const timer = setTimeout(() => proc.kill("SIGKILL"), timeoutMs);
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (err += d.toString()));
    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, out, err });
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ code: -1, out, err: String(e) });
    });
  });
}

export default {
  inputParameters: {
    platform: "",
    content: "",
    media_path: "",
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "PreparePost",
        description:
          "Open a social platform in a browser and fill in a post (text + " +
          "optional media), then STOP before submitting for human review. Never " +
          "publishes automatically. Use only when the user asked to draft a post.",
        parameters: {
          type: "object",
          properties: {
            platform: { type: "string", description: "Platform to post to (e.g. 'x', 'instagram')." },
            content: { type: "string", description: "The post text." },
            media_path: { type: "string", description: "Optional path to media to attach." },
          },
          required: ["platform", "content"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    const key = apiKeyFor(PROVIDER);
    if (!key) {
      return JSON.stringify({
        status: "failed",
        error: "agent_tars_no_api_key",
        hint: `Set the ${PROVIDER} API key (e.g. ANTHROPIC_API_KEY).`,
      });
    }

    let instruction =
      `Open ${args.platform} in the browser (assume already logged in). ` +
      `Create a new post with this content:\n"${args.content}"\n`;
    if (args.media_path) instruction += `Attach the media file at: ${args.media_path}\n`;
    instruction +=
      "Do NOT submit/publish. Fill everything in, take a screenshot of the " +
      "composed post, and stop so a human can review and click publish.";

    const cmdArgs = [
      "-y", "@agent-tars/cli@latest", "run", instruction,
      "--provider", PROVIDER, "--model", MODEL, "--apiKey", key, "--headless",
    ];

    const { code, out, err } = await run("npx", cmdArgs, 1800 * 1000);
    return JSON.stringify({
      status: code === 0 ? "completed" : "failed",
      engine: "agent-tars",
      review_required: true,
      platform: args.platform,
      output: (out || err).slice(-1500),
    });
  },
};
