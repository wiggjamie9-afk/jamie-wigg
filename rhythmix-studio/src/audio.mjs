import { spawn } from "node:child_process";

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d.toString()));
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${cmd} exited ${code}: ${stderr}`));
    });
  });
}

export async function probeAudio(path) {
  const { stdout } = await run("ffprobe", [
    "-v", "quiet",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    path,
  ]);
  const meta = JSON.parse(stdout);
  const stream = meta.streams.find((s) => s.codec_type === "audio");
  if (!stream) throw new Error(`No audio stream found in ${path}`);
  const duration = Number(meta.format.duration);
  return {
    path,
    duration,
    sampleRate: Number(stream.sample_rate),
    channels: stream.channels,
    codec: stream.codec_name,
    bitRate: stream.bit_rate ? Number(stream.bit_rate) : null,
  };
}

export function beatsFromBpm({ duration, bpm, downbeatsPerBar = 4 }) {
  if (!bpm || bpm <= 0) return [];
  const secondsPerBeat = 60 / bpm;
  const beats = [];
  for (let t = 0; t < duration; t += secondsPerBeat) {
    beats.push({
      t,
      isDownbeat: beats.length % downbeatsPerBar === 0,
    });
  }
  return beats;
}

export function nearestBeat(beats, t) {
  if (!beats.length) return t;
  let best = beats[0];
  let bestDiff = Math.abs(beats[0].t - t);
  for (const b of beats) {
    const diff = Math.abs(b.t - t);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = b;
    }
  }
  return best.t;
}
