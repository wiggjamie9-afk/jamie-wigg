// Node ffmpeg adapter. Shells out to the system `ffmpeg` / `ffprobe`
// binaries via child_process — same approach the CLI has always used.
// All file arguments are filesystem paths (strings); functions write
// their output to disk and return void (or, for probe, the parsed
// metadata).
//
// The five spec'd operations (probe / trim / concat / mux /
// extractFrame) are convenience wrappers. `runFfmpeg` and `runFfprobe`
// are exported too because `compose.mjs` runs custom filter graphs
// (xfade chains, aspect-fit scale+crop, etc.) that don't fit the
// generic shape — having a low-level escape hatch keeps that code
// inside the adapter family instead of bypassing it.

import { spawn } from "node:child_process";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

function spawnAndWait(cmd, args, { captureStdout = false } = {}) {
  return new Promise((resolveP, rejectP) => {
    const p = spawn(cmd, args, {
      stdio: ["ignore", captureStdout ? "pipe" : "ignore", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    if (captureStdout) p.stdout.on("data", (d) => (stdout += d.toString()));
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", rejectP);
    p.on("close", (code) => {
      if (code === 0) resolveP({ stdout, stderr });
      else rejectP(new Error(`${cmd} exited ${code}\n${stderr}`));
    });
  });
}

// Low-level escape hatch — runs `ffmpeg -y <args>` and resolves when the
// process exits 0. Used by compose.mjs for its xfade / filter-graph work.
export async function runFfmpeg(args) {
  await spawnAndWait("ffmpeg", ["-y", ...args]);
}

// Same idea for ffprobe, with stdout captured so JSON can be parsed.
export async function runFfprobe(args) {
  const { stdout } = await spawnAndWait("ffprobe", args, { captureStdout: true });
  return stdout;
}

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

// probe → { duration, sampleRate, channels, codec }. Reads the first
// audio stream + format metadata. If there's no audio stream (e.g. a
// video-only file) sampleRate/channels come back as null and `codec` is
// the first stream's codec — keeps the shape predictable for the web app.
export async function probe(filePath) {
  const stdout = await runFfprobe([
    "-v", "error",
    "-print_format", "json",
    "-show_streams",
    "-show_format",
    filePath,
  ]);
  const meta = JSON.parse(stdout);
  const audioStream = meta.streams?.find((s) => s.codec_type === "audio");
  const firstStream = meta.streams?.[0];
  const stream = audioStream ?? firstStream;
  const duration = meta.format?.duration ? Number(meta.format.duration) : NaN;
  return {
    duration,
    sampleRate: audioStream ? Number(audioStream.sample_rate) : null,
    channels: audioStream ? audioStream.channels : null,
    codec: stream?.codec_name ?? null,
    // Pass through a couple of extras the existing CLI relies on. The web
    // app can ignore them; the CLI's `probeAudio` re-exposes them.
    path: filePath,
    bitRate: audioStream?.bit_rate ? Number(audioStream.bit_rate) : null,
  };
}

// trim → -ss/-to with stream-copy first; if stream-copy fails (e.g. the
// keyframes don't line up and the resulting file is unplayable) fall
// back to a full re-encode with libx264 + aac.
export async function trim(inputPath, startSec, endSec, outputPath) {
  await ensureDir(dirname(outputPath));
  const duration = Number(endSec) - Number(startSec);
  if (!(duration > 0)) {
    throw new Error(
      `trim: invalid range start=${startSec} end=${endSec} (duration must be > 0)`
    );
  }
  try {
    await runFfmpeg([
      "-ss", String(startSec),
      "-to", String(endSec),
      "-i", inputPath,
      "-c", "copy",
      "-avoid_negative_ts", "make_zero",
      outputPath,
    ]);
  } catch (copyErr) {
    // Stream-copy can fail when the cut point isn't on a keyframe; fall
    // back to a re-encode so the user always gets a playable clip.
    await runFfmpeg([
      "-ss", String(startSec),
      "-to", String(endSec),
      "-i", inputPath,
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-c:a", "aac",
      outputPath,
    ]);
  }
}

// concat → ffmpeg concat demuxer. Writes a temp list.txt, runs the
// concat, then cleans up. Stream-copies by default; falls back to
// re-encode if the inputs have mismatched codecs/timebases.
export async function concat(inputPaths, outputPath) {
  if (!Array.isArray(inputPaths) || inputPaths.length === 0) {
    throw new Error("concat: at least one input is required");
  }
  await ensureDir(dirname(outputPath));
  const listDir = await mkdir(join(tmpdir(), `rhythmix-concat-${process.pid}-${Date.now()}`), {
    recursive: true,
  });
  const listFile = join(listDir, "list.txt");
  const body = inputPaths
    .map((p) => `file '${resolve(p).replace(/'/g, "'\\''")}'`)
    .join("\n");
  await writeFile(listFile, body);
  try {
    try {
      await runFfmpeg([
        "-f", "concat",
        "-safe", "0",
        "-i", listFile,
        "-c", "copy",
        outputPath,
      ]);
    } catch {
      await runFfmpeg([
        "-f", "concat",
        "-safe", "0",
        "-i", listFile,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-c:a", "aac",
        outputPath,
      ]);
    }
  } finally {
    await unlink(listFile).catch(() => {});
  }
}

// mux → join one video track + one audio track. Video is stream-copied,
// audio re-encoded to aac so we always end with a compatibly-encoded
// output. -shortest stops at the shorter of the two streams.
export async function mux(videoPath, audioPath, outputPath) {
  await ensureDir(dirname(outputPath));
  await runFfmpeg([
    "-i", videoPath,
    "-i", audioPath,
    "-map", "0:v",
    "-map", "1:a",
    "-c:v", "copy",
    "-c:a", "aac",
    "-shortest",
    outputPath,
  ]);
}

// extractFrame → grab one frame at `timeSec` as a still image. Format
// is inferred from the output extension by ffmpeg (.jpg, .png, etc.).
export async function extractFrame(videoPath, timeSec, outputPath) {
  await ensureDir(dirname(outputPath));
  await runFfmpeg([
    "-ss", String(timeSec),
    "-i", videoPath,
    "-frames:v", "1",
    "-q:v", "2",
    outputPath,
  ]);
}
