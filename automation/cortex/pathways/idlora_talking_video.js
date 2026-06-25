/**
 * Cortex pathway: identity-preserving talking-head video via ID-LoRA (local CLI).
 *
 * The JS port of automation/handlers/idlora_handler.py — shells out to the
 * ID-LoRA checkout via `uv run`. Exposed as the `GenerateTalkingVideoIDLoRA`
 * entity tool. Needs a CUDA GPU box; degrades with an exact fix when uv, the
 * repo, or the checkpoint is missing.
 *
 * Outputs are synthetic likeness + voice: get consent, label as AI-generated.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO = process.env.IDLORA_HOME || path.join(os.homedir(), "ID-LoRA");
const LORA = process.env.IDLORA_LORA_PATH || "";
const OUT_DIR =
  process.env.IDLORA_OUT_DIR ||
  path.join(os.homedir(), "RHYTHMIX_Empire", "output", "idlora");

// version -> mode -> script (mirrors the Python handler's _SCRIPTS).
const SCRIPTS = {
  base: {
    one_stage: "scripts/inference_one_stage.py",
    two_stage: "scripts/inference_two_stage.py",
  },
  "2.3": {
    one_stage: "ID-LoRA-2.3/scripts/inference_one_stage.py",
    two_stage: "ID-LoRA-2.3/scripts/inference_two_stage.py",
    two_stage_hq: "ID-LoRA-2.3/scripts/inference_two_stage_hq.py",
  },
};

function buildPrompt(visual, speech, sounds) {
  const s =
    sounds ||
    "The speaker has a clear, conversational tone at moderate volume, close to the microphone.";
  return `[VISUAL]: ${visual.trim()}\n[SPEECH]: ${speech.trim()}\n[SOUNDS]: ${s.trim()}`;
}

function run(cmd, cmdArgs, cwd, timeoutMs) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, cmdArgs, { cwd });
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
    reference_audio: "",
    first_frame: "",
    visual: "",
    speech: "",
    sounds: "",
    version: process.env.IDLORA_VERSION || "2.3",
    mode: process.env.IDLORA_MODE || "two_stage",
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "GenerateTalkingVideoIDLoRA",
        description:
          "Generate an identity-preserving talking-head video from a first-frame " +
          "image, a ~5s reference voice clip, and spoken words. Local GPU engine. " +
          "Outputs are synthetic media — require consent and labeling.",
        parameters: {
          type: "object",
          properties: {
            reference_audio: { type: "string", description: "Path to ~5s reference .wav." },
            first_frame: { type: "string", description: "Path to first-frame image (face/scene)." },
            visual: { type: "string", description: "Shot/appearance/setting description." },
            speech: { type: "string", description: "Exact words to be spoken (literal transcript)." },
            sounds: { type: "string", description: "Vocal style + ambient sounds." },
          },
          required: ["reference_audio", "first_frame", "speech"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    const fail = (error, hint) => JSON.stringify({ status: "failed", error, ...(hint ? { hint } : {}) });

    const scriptRel = (SCRIPTS[args.version] || {})[args.mode];
    if (!scriptRel) {
      return fail("idlora_bad_mode", `No '${args.mode}' script for version ${args.version}.`);
    }
    const script = path.join(REPO, scriptRel);

    if (!existsSync(REPO) || !existsSync(path.join(REPO, "pyproject.toml"))) {
      return fail(
        "idlora_repo_not_found",
        "git clone https://github.com/ID-LoRA/ID-LoRA.git ~/ID-LoRA && cd ~/ID-LoRA && uv sync --frozen (or set IDLORA_HOME)."
      );
    }
    if (!existsSync(script)) {
      return fail("idlora_script_not_found", `Expected script missing: ${script}`);
    }
    if (!LORA) {
      return fail(
        "idlora_lora_missing",
        "Download checkpoints (bash scripts/download_models.sh) and set IDLORA_LORA_PATH."
      );
    }
    for (const [label, p] of [
      ["reference_audio", args.reference_audio],
      ["first_frame", args.first_frame],
    ]) {
      if (!p || !existsSync(p)) return fail(`missing_${label}`, `${label} not found: ${p}`);
    }

    const prompt = buildPrompt(args.visual, args.speech, args.sounds);
    const cmdArgs = [
      "run", "python", script,
      "--lora-path", LORA,
      "--reference-audio", args.reference_audio,
      "--first-frame", args.first_frame,
      "--prompt", prompt,
      "--output-dir", OUT_DIR,
    ];

    const { code, out, err } = await run("uv", cmdArgs, REPO, 3600 * 1000);
    if (code !== 0) {
      return JSON.stringify({ status: "failed", error: (err || out).slice(-1500) });
    }
    return JSON.stringify({
      status: "completed",
      engine: `id-lora-ltx${args.version}`,
      output_dir: OUT_DIR,
      log: (out || err).slice(-800),
      prompt,
    });
  },
};
