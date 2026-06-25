/**
 * Cortex pathway: on-device transcription via whisper.cpp.
 *
 * The JS port of automation/handlers/whispercpp_handler.py — shells out to the
 * whisper.cpp `whisper-cli` binary, emitting JSON, and returns the text +
 * segments. Exposed as the `TranscribeAudio` entity tool (free, offline).
 *
 * Needs a whisper.cpp build + a ggml model. Point WHISPER_BIN at the binary and
 * WHISPER_MODEL at the .bin model (or rely on the defaults below).
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const BIN_CANDIDATES = [
  process.env.WHISPER_BIN,
  path.join(os.homedir(), "whisper.cpp/build/bin/whisper-cli"),
  path.join(os.homedir(), "whisper.cpp/build/bin/main"),
  "whisper-cli",
].filter(Boolean);

const MODEL =
  process.env.WHISPER_MODEL ||
  path.join(os.homedir(), "whisper.cpp/models/ggml-base.en.bin");

function findBin() {
  for (const b of BIN_CANDIDATES) {
    if (b === "whisper-cli" || existsSync(b)) return b;
  }
  return null;
}

function run(cmd, args, timeoutMs) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args);
    let err = "";
    const timer = setTimeout(() => proc.kill("SIGKILL"), timeoutMs);
    proc.stderr.on("data", (d) => (err += d.toString()));
    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, err });
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ code: -1, err: String(e) });
    });
  });
}

export default {
  inputParameters: {
    audio: "",
    language: "auto",
  },

  toolDefinition: [
    {
      type: "function",
      function: {
        name: "TranscribeAudio",
        description:
          "Transcribe an audio file to text on-device with whisper.cpp (free, " +
          "offline). Returns the transcript and timed segments.",
        parameters: {
          type: "object",
          properties: {
            audio: { type: "string", description: "Path to the audio file." },
            language: { type: "string", description: "Language code or 'auto'.", default: "auto" },
          },
          required: ["audio"],
        },
      },
    },
  ],

  executePathway: async ({ args }) => {
    const bin = findBin();
    if (!bin) {
      return JSON.stringify({
        status: "failed",
        error: "whispercpp_not_found",
        hint: "Build whisper.cpp and set WHISPER_BIN (and WHISPER_MODEL).",
      });
    }
    if (!existsSync(MODEL)) {
      return JSON.stringify({
        status: "failed",
        error: "whisper_model_missing",
        hint: `Download a ggml model and set WHISPER_MODEL (looked for ${MODEL}).`,
      });
    }
    if (!args.audio || !existsSync(args.audio)) {
      return JSON.stringify({ status: "failed", error: "audio_not_found", detail: args.audio });
    }

    const outPrefix = path.join(os.tmpdir(), `whisper_${Date.now()}`);
    const cmdArgs = [
      "-m", MODEL, "-f", args.audio,
      "-oj", "-of", outPrefix,
      "-l", args.language || "auto",
    ];
    const { code, err } = await run(bin, cmdArgs, 1800 * 1000);
    if (code !== 0) {
      return JSON.stringify({ status: "failed", error: (err || "whisper_failed").slice(-800) });
    }

    const jsonPath = `${outPrefix}.json`;
    try {
      const data = JSON.parse(readFileSync(jsonPath, "utf8"));
      rmSync(jsonPath, { force: true });
      const segments = (data.transcription || []).map((s) => ({
        text: (s.text || "").trim(),
        start: s.offsets?.from,
        end: s.offsets?.to,
      }));
      const text = segments.map((s) => s.text).join(" ").trim();
      return JSON.stringify({ status: "completed", engine: "whisper.cpp", text, segments });
    } catch (e) {
      return JSON.stringify({ status: "failed", error: "parse_failed: " + String(e) });
    }
  },
};
