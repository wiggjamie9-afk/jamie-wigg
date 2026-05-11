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
  // Normalize to a fixed framerate + reset PTS — xfade (used for transitions)
  // refuses to compose inputs with mismatched timebases, so all clips have
  // to come out of trim with the same fps/timebase even if their sources
  // differ. -stream_loop -1 loops the input indefinitely so a short source
  // clip (e.g. a 4s --source local file) still produces the full requested
  // duration; the -t flag then truncates cleanly at the right length.
  const filter = `${aspectFilter({ width, height })},fps=30,setpts=PTS-STARTPTS`;
  await runFfmpeg([
    "-stream_loop", "-1",
    "-i", input,
    "-t", String(duration),
    "-vf", filter,
    "-r", "30",
    "-video_track_timescale", "15360",
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

// Chain N clips with a short xfade between each pair. Produces a single
// labelled output stream "[outv]". `crossfadeSec` should be much smaller
// than the shortest clip; defaults to 0.25s which reads as a snappy cut
// with a softened seam instead of a jarring flash-frame.
function buildXfadeChain(durations, crossfadeSec) {
  const n = durations.length;
  if (n === 1) return "[0:v]copy[outv]";
  const F = crossfadeSec;
  const parts = [];
  let offset = durations[0] - F;
  let leftLabel = "[0:v]";
  for (let i = 1; i < n; i++) {
    const isLast = i === n - 1;
    const outLabel = isLast ? "[outv]" : `[v${i}x]`;
    parts.push(
      `${leftLabel}[${i}:v]xfade=transition=fade:duration=${F}:offset=${offset.toFixed(3)}${outLabel}`
    );
    if (!isLast) {
      offset += durations[i] - F;
      leftLabel = outLabel;
    }
  }
  return parts.join(";");
}

async function crossfadeClips({ clipPaths, durations, output, crossfadeSec }) {
  if (clipPaths.length === 0) throw new Error("crossfadeClips: no clips");
  if (clipPaths.length === 1) {
    // Single clip — just re-encode straight through.
    await runFfmpeg([
      "-i", clipPaths[0],
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-pix_fmt", "yuv420p",
      "-an",
      output,
    ]);
    return;
  }
  const inputs = clipPaths.flatMap((p) => ["-i", p]);
  const chain = buildXfadeChain(durations, crossfadeSec);
  await runFfmpeg([
    ...inputs,
    "-filter_complex", chain,
    "-map", "[outv]",
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

export async function compose({ plan, sceneFiles, outputPath, workDir, transitions = "crossfade" }) {
  if (!existsSync(workDir)) await mkdir(workDir, { recursive: true });

  const N = plan.scenes.length;
  // Crossfade overlap eats (N-1)*F seconds of total duration. To keep the
  // final video the same length as the audio, lengthen every clip's trim by
  // an equal share of the loss. Math: N*e == (N-1)*F  →  e = (N-1)*F/N.
  const crossfadeSec = 0.25;
  const willCrossfade = transitions !== "cut" && N > 1;
  const extraPerClip = willCrossfade ? ((N - 1) * crossfadeSec) / N : 0;

  const trimmed = [];
  const durations = [];
  for (let i = 0; i < N; i++) {
    const scene = plan.scenes[i];
    const src = sceneFiles[i];
    const dst = join(workDir, `trimmed-${String(i).padStart(3, "0")}.mp4`);
    const trimDuration = scene.duration + extraPerClip;
    await trimClip({
      input: src,
      output: dst,
      duration: trimDuration,
      width: scene.width ?? plan.scenes[0]?.width ?? 1280,
      height: scene.height ?? plan.scenes[0]?.height ?? 720,
    });
    trimmed.push(dst);
    durations.push(trimDuration);
  }

  // Crossfade only works if every clip is longer than the overlap; if any
  // scene is too short, auto-fallback to a hard concat instead of erroring.
  const useCrossfade =
    willCrossfade && durations.every((d) => d > crossfadeSec * 2);

  const concatPath = join(workDir, "concat.mp4");
  if (useCrossfade && trimmed.length > 1) {
    await crossfadeClips({
      clipPaths: trimmed,
      durations,
      output: concatPath,
      crossfadeSec,
    });
  } else {
    await concatClips({ clipPaths: trimmed, output: concatPath, workDir });
  }

  await muxAudio({
    video: concatPath,
    audio: plan.audio.path,
    output: outputPath,
    totalDuration: plan.audio.duration,
  });

  return outputPath;
}
