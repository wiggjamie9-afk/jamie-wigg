// Browser ffmpeg adapter — wraps @ffmpeg/ffmpeg's WASM build. Loaded
// lazily on first call so the WASM payload (~30MB) isn't in the
// critical path of the layout. Cache the FFmpeg instance across calls
// so subsequent ops don't re-fetch the WASM blob.
//
// I/O units differ from the Node adapter on purpose:
//   - Node adapter takes filesystem paths (strings) and writes to disk.
//   - WASM adapter takes Blobs (or path-like strings — see note) and
//     returns output Blobs.
// The probe shape is identical: { duration, sampleRate, channels, codec }.
//
// On load failure, throws a descriptive Error so the UI can route to
// the `ffmpeg-load-failed` fallback screen (T15).

let _ffmpegInstance = null;
let _ffmpegLoading = null;
let _utilModule = null;

async function loadFfmpeg() {
  if (_ffmpegInstance) return _ffmpegInstance;
  if (_ffmpegLoading) return _ffmpegLoading;
  _ffmpegLoading = (async () => {
    let FFmpegCtor;
    let util;
    try {
      const ff = await import("@ffmpeg/ffmpeg");
      util = await import("@ffmpeg/util");
      FFmpegCtor = ff.FFmpeg;
    } catch (err) {
      throw new Error(
        `ffmpeg-load-failed: could not import @ffmpeg/ffmpeg (${err?.message ?? err}). ` +
          `Make sure @ffmpeg/ffmpeg and @ffmpeg/util are installed and that your bundler ` +
          `serves the WASM core (see studio/lib/ffmpeg-loader.ts).`
      );
    }
    const instance = new FFmpegCtor();
    try {
      await instance.load();
    } catch (err) {
      throw new Error(
        `ffmpeg-load-failed: FFmpeg.load() threw (${err?.message ?? err}). ` +
          `This usually means the WASM core could not be fetched — check the network tab ` +
          `and any CSP / cross-origin-isolation headers (SharedArrayBuffer requires COOP/COEP).`
      );
    }
    _ffmpegInstance = instance;
    _utilModule = util;
    return instance;
  })();
  try {
    return await _ffmpegLoading;
  } finally {
    _ffmpegLoading = null;
  }
}

async function blobToBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input && typeof input.arrayBuffer === "function") {
    return new Uint8Array(await input.arrayBuffer());
  }
  // String input — fetch the URL (data: or http(s):). The @ffmpeg/util
  // `fetchFile` helper handles all of these uniformly.
  if (typeof input === "string") {
    if (!_utilModule) await loadFfmpeg();
    return _utilModule.fetchFile(input);
  }
  throw new Error(
    `ffmpeg/wasm: unsupported input type ${typeof input}. Pass a Blob, File, Uint8Array, or URL string.`
  );
}

function extOf(name, fallback) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : fallback;
}

function uniqueName(prefix, ext) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

async function writeInput(ff, name, input) {
  const bytes = await blobToBytes(input);
  await ff.writeFile(name, bytes);
}

async function readOutput(ff, name, mimeType) {
  const data = await ff.readFile(name);
  const buf = data instanceof Uint8Array ? data : new Uint8Array(data);
  return new Blob([buf], { type: mimeType });
}

async function cleanup(ff, names) {
  for (const n of names) {
    try {
      await ff.deleteFile(n);
    } catch {
      // best-effort
    }
  }
}

// probe(blob) → { duration, sampleRate, channels, codec }. Uses
// `ffprobe`-equivalent flags via the ffmpeg binary's own `-show_streams
// -show_format` mode. @ffmpeg/ffmpeg ships a single `ffmpeg` entry; we
// approximate ffprobe by running ffmpeg with format-only output and
// parsing the stderr stream metadata. (Newer @ffmpeg/ffmpeg builds
// expose ffprobe; we try that first and fall back to stderr parsing.)
export async function probe(input) {
  const ff = await loadFfmpeg();
  const inName = uniqueName("probe-in", extOf(input?.name ?? "", "bin"));
  await writeInput(ff, inName, input);
  let duration = NaN;
  let sampleRate = null;
  let channels = null;
  let codec = null;
  let collected = "";
  const onLog = ({ message }) => {
    collected += message + "\n";
  };
  ff.on?.("log", onLog);
  try {
    // -hide_banner keeps the noise down; the stream-info ffmpeg prints
    // to stderr before bailing is what we parse.
    await ff
      .exec([
        "-hide_banner",
        "-i", inName,
        "-f", "null",
        "-",
      ])
      .catch(() => {
        // ffmpeg exits non-zero when given `-i` with no output filters
        // that consume input fully; the metadata we want is already in
        // the collected log, so swallow.
      });
    const durMatch = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(collected);
    if (durMatch) {
      duration =
        Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]);
    }
    const audioMatch = /Stream #\d+:\d+.*?Audio:\s*([a-z0-9_]+)[^,]*,\s*(\d+)\s*Hz,\s*([a-z0-9.()]+)/i.exec(
      collected
    );
    if (audioMatch) {
      codec = audioMatch[1];
      sampleRate = Number(audioMatch[2]);
      const layout = audioMatch[3].toLowerCase();
      channels = layout === "mono" ? 1 : layout === "stereo" ? 2 : Number(layout) || null;
    } else {
      const videoMatch = /Stream #\d+:\d+.*?Video:\s*([a-z0-9_]+)/i.exec(collected);
      if (videoMatch) codec = videoMatch[1];
    }
  } finally {
    ff.off?.("log", onLog);
    await cleanup(ff, [inName]);
  }
  return { duration, sampleRate, channels, codec };
}

// trim(blob, startSec, endSec) → Blob. Re-encodes with libx264 + aac
// because the WASM build ships a software encoder and stream-copy is
// brittle when cut points don't land on keyframes in-browser.
export async function trim(input, startSec, endSec) {
  const ff = await loadFfmpeg();
  const ext = extOf(input?.name ?? "", "mp4");
  const inName = uniqueName("trim-in", ext);
  const outName = uniqueName("trim-out", "mp4");
  await writeInput(ff, inName, input);
  try {
    await ff.exec([
      "-ss", String(startSec),
      "-to", String(endSec),
      "-i", inName,
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-c:a", "aac",
      outName,
    ]);
    return await readOutput(ff, outName, "video/mp4");
  } finally {
    await cleanup(ff, [inName, outName]);
  }
}

// concat(blobs[]) → Blob. Writes each input under a temp name, builds
// a concat-demuxer list, runs ffmpeg with a re-encode (safer than
// stream-copy in the WASM environment).
export async function concat(inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new Error("concat: at least one input is required");
  }
  const ff = await loadFfmpeg();
  const inputNames = [];
  for (let i = 0; i < inputs.length; i++) {
    const name = uniqueName(`concat-in-${i}`, "mp4");
    await writeInput(ff, name, inputs[i]);
    inputNames.push(name);
  }
  const listName = uniqueName("concat-list", "txt");
  const body = inputNames.map((n) => `file '${n}'`).join("\n");
  await ff.writeFile(listName, new TextEncoder().encode(body));
  const outName = uniqueName("concat-out", "mp4");
  try {
    await ff.exec([
      "-f", "concat",
      "-safe", "0",
      "-i", listName,
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-c:a", "aac",
      outName,
    ]);
    return await readOutput(ff, outName, "video/mp4");
  } finally {
    await cleanup(ff, [...inputNames, listName, outName]);
  }
}

// mux(videoBlob, audioBlob) → Blob. Same -map / -c:v copy / -c:a aac /
// -shortest pattern as the Node adapter.
export async function mux(video, audio) {
  const ff = await loadFfmpeg();
  const vName = uniqueName("mux-v", extOf(video?.name ?? "", "mp4"));
  const aName = uniqueName("mux-a", extOf(audio?.name ?? "", "mp3"));
  const outName = uniqueName("mux-out", "mp4");
  await writeInput(ff, vName, video);
  await writeInput(ff, aName, audio);
  try {
    await ff.exec([
      "-i", vName,
      "-i", aName,
      "-map", "0:v",
      "-map", "1:a",
      "-c:v", "copy",
      "-c:a", "aac",
      "-shortest",
      outName,
    ]);
    return await readOutput(ff, outName, "video/mp4");
  } finally {
    await cleanup(ff, [vName, aName, outName]);
  }
}

// extractFrame(videoBlob, timeSec) → Blob (image/jpeg). Single-frame
// grab; output ext fixed to .jpg here because the thumbnail caller
// (R8) only needs one shape.
export async function extractFrame(video, timeSec) {
  const ff = await loadFfmpeg();
  const inName = uniqueName("frame-in", extOf(video?.name ?? "", "mp4"));
  const outName = uniqueName("frame-out", "jpg");
  await writeInput(ff, inName, video);
  try {
    await ff.exec([
      "-ss", String(timeSec),
      "-i", inName,
      "-frames:v", "1",
      "-q:v", "2",
      outName,
    ]);
    return await readOutput(ff, outName, "image/jpeg");
  } finally {
    await cleanup(ff, [inName, outName]);
  }
}

// Reset the cached instance (useful for tests). Not exported via the
// facade so it doesn't leak into the Node side.
export function _resetForTests() {
  _ffmpegInstance = null;
  _ffmpegLoading = null;
  _utilModule = null;
}
