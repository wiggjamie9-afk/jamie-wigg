// Barrel re-export of the platform-agnostic core. Anything importable from
// here is safe to run in a browser, edge runtime, or Node — no node: imports,
// no child_process, no fs, no path. The dirty edges (ffmpeg/ffprobe, disk
// writes, child processes) live one level up in src/audio.mjs, src/compose.mjs,
// src/replicate.mjs (downloadToDisk), src/sources/pexels.mjs (downloadPexelsVideo),
// and src/sources/local.mjs.

export {
  buildPlan,
  beatsFromBpm,
  nearestBeat,
} from "./plan.mjs";

export {
  MODELS,
  pickModel,
  estimateCost,
} from "./models.mjs";

export {
  replicateRun,
  firstUrl,
  ReplicateError,
} from "./replicate.mjs";

export {
  pexelsSearch,
  pickVideoFile,
  PexelsError,
} from "./sources/pexels.mjs";
