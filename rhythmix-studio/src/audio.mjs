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

// Sample per-second RMS loudness across the whole track using ffmpeg's
// astats filter. Returns an array of dB values (one per second). Loud
// passages of a song show up as higher (less negative) dB values; quiet
// intros/outros show up as lower values.
export async function loudnessCurve(path) {
  return new Promise((resolveP, rejectP) => {
    const p = spawn("ffmpeg", [
      "-i", path,
      "-af",
      "aresample=8000,asetnsamples=8000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level",
      "-f", "null", "-",
    ]);
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", rejectP);
    p.on("close", () => {
      const values = [];
      const re = /RMS_level=(-?\d+(?:\.\d+)?)/g;
      let m;
      while ((m = re.exec(stderr))) {
        const v = Number(m[1]);
        if (Number.isFinite(v)) values.push(v);
      }
      resolveP(values);
    });
  });
}

// Detect song structure from the loudness curve. Returns sections with
// proportional `share` summing to 1.0 (compatible with the existing plan
// builder). Loud bands become chorus, quiet bands become verse-ish, and the
// first/last sections are pinned as intro/outro for narrative arc.
export function structureFromLoudness(curve) {
  if (!curve || curve.length < 6) return null;
  const sorted = [...curve].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  // Smooth with a 4-second sliding window to suppress single-second spikes.
  const W = 4;
  const smoothed = curve.map((_, i) => {
    let sum = 0, n = 0;
    for (let j = Math.max(0, i - W); j < Math.min(curve.length, i + W + 1); j++) {
      sum += curve[j];
      n++;
    }
    return sum / n;
  });
  // Classify each second: LOUD if >= median+2dB, QUIET if <= median-2dB.
  const classes = smoothed.map((v) => {
    if (v >= median + 2) return "L";
    if (v <= median - 2) return "Q";
    return "M";
  });
  // Group into runs of same class.
  const runs = [];
  let runStart = 0;
  for (let i = 1; i <= classes.length; i++) {
    if (i === classes.length || classes[i] !== classes[runStart]) {
      runs.push({ class: classes[runStart], start: runStart, length: i - runStart });
      runStart = i;
    }
  }
  // Drop runs shorter than 3s by merging into neighbour, so we don't end up
  // with 1-second "sections" that fragment the plan.
  const merged = [];
  for (const r of runs) {
    if (r.length < 3 && merged.length) {
      merged[merged.length - 1].length += r.length;
    } else {
      merged.push({ ...r });
    }
  }
  if (merged.length < 2) return null;
  // Map classes to song roles, with first=intro and last=outro overrides.
  const total = merged.reduce((s, r) => s + r.length, 0);
  return merged.map((r, i) => {
    let role;
    if (i === 0) role = "intro";
    else if (i === merged.length - 1) role = "outro";
    else if (r.class === "L") role = "chorus";
    else if (r.class === "Q") role = "verse";
    else role = "bridge";
    return { role, share: r.length / total };
  });
}

// Try external BPM detectors in order of accuracy. Returns null if none
// installed — caller then falls back to "no beat snapping" with a clear hint.
export async function detectBpm(path) {
  const detectors = [
    {
      cmd: "aubio",
      args: ["tempo", path],
      parse: (out) => {
        const m = out.match(/([\d.]+)\s*bpm/i) || out.match(/^([\d.]+)/);
        return m ? Number(m[1]) : null;
      },
    },
    {
      cmd: "bpm-tag",
      args: ["-n", path],
      parse: (out) => {
        const m = out.match(/([\d.]+)\s*BPM/i);
        return m ? Number(m[1]) : null;
      },
    },
  ];
  for (const d of detectors) {
    try {
      const { stdout } = await run(d.cmd, d.args);
      const bpm = d.parse(stdout);
      if (bpm && bpm > 40 && bpm < 240) return { bpm, detector: d.cmd };
    } catch {
      // detector not installed or failed; try next
    }
  }
  return null;
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
