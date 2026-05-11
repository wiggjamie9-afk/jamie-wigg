import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

function runFfmpeg(args) {
  return new Promise((resolveP, rejectP) => {
    const p = spawn("ffmpeg", ["-y", ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", rejectP);
    p.on("close", (code) => {
      if (code === 0) resolveP();
      else rejectP(new Error(`ffmpeg exited ${code}\n${stderr}`));
    });
  });
}

// Cover-style aspect fit: scale up so the clip fully covers the target box,
// then center-crop the overflow. No black bars; some edge content is lost.
function aspectFilter({ width, height }) {
  return `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`;
}

async function trimClip({ input, output, duration, width, height }) {
  const filter = aspectFilter({ width, height });
  await runFfmpeg([
    "-i", input,
    "-t", String(duration),
    "-vf", filter,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-pix_fmt", "yuv420p",
    "-an",
    output,
  ]);
}

async function concatClips({ clipPaths, output, workDir }) {
  if (!existsSync(workDir)) await mkdir(workDir, { recursive: true });
  const listFile = join(workDir, "concat-list.txt");
  const lines = clipPaths.map((p) => `file '${resolve(p).replace(/'/g, "'\\''")}'`).join("\n");
  await writeFile(listFile, lines);
  await runFfmpeg([
    "-f", "concat",
    "-safe", "0",
    "-i", listFile,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-pix_fmt", "yuv420p",
    "-an",
    output,
  ]);
}

async function muxAudio({ video, audio, output, totalDuration }) {
  await runFfmpeg([
    "-i", video,
    "-i", audio,
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "copy",
    "-c:a", "aac",
    "-shortest",
    "-t", String(totalDuration),
    output,
  ]);
}

export async function compose({ plan, sceneFiles, outputPath, workDir }) {
  if (!existsSync(workDir)) await mkdir(workDir, { recursive: true });

  const trimmed = [];
  for (let i = 0; i < plan.scenes.length; i++) {
    const scene = plan.scenes[i];
    const src = sceneFiles[i];
    const dst = join(workDir, `trimmed-${String(i).padStart(3, "0")}.mp4`);
    await trimClip({
      input: src,
      output: dst,
      duration: scene.duration,
      width: scene.width ?? plan.scenes[0]?.width ?? 1280,
      height: scene.height ?? plan.scenes[0]?.height ?? 720,
    });
    trimmed.push(dst);
  }

  const concatPath = join(workDir, "concat.mp4");
  await concatClips({ clipPaths: trimmed, output: concatPath, workDir });

  await muxAudio({
    video: concatPath,
    audio: plan.audio.path,
    output: outputPath,
    totalDuration: plan.audio.duration,
  });

  return outputPath;
}
