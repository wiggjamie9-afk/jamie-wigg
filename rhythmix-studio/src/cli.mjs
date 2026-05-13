import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { probeAudio, detectBpm, loudnessCurve, structureFromLoudness } from "./audio.mjs";
import { buildPlan } from "./plan.mjs";
import { MODELS, estimateCost } from "./models.mjs";
import { replicateRun, downloadToDisk, firstUrl, ReplicateError } from "./replicate.mjs";
import { pexelsSearch, pickVideoFile, downloadPexelsVideo, PexelsError } from "./sources/pexels.mjs";
import { listLocalClips, copyLocalClip, LocalSourceError } from "./sources/local.mjs";
import { compose } from "./compose.mjs";
import { log } from "./log.mjs";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

// ---- Argument validation ------------------------------------------------
//
// parseArgs is intentionally tolerant — it just shuttles strings off the
// command line into an object. These helpers run *after* parsing and turn
// bad input into a clear single-line error before the pipeline runs, so a
// user typo never makes it as far as ffmpeg / Replicate / a half-built MP4.

const VALID_ASPECTS = new Set(["16:9", "9:16", "1:1"]);
const VALID_SOURCES = new Set(["replicate", "pexels", "local"]);

function requireStringValue(args, flag) {
  const v = args[flag];
  if (v === undefined) return undefined;
  if (v === true) {
    throw new Error(`--${flag} requires a value, e.g. --${flag} "..."`);
  }
  return String(v);
}

function requirePositiveNumber(args, flag) {
  const raw = args[flag];
  if (raw === undefined) return undefined;
  if (raw === true) {
    throw new Error(`--${flag} requires a numeric value, e.g. --${flag} 120`);
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`--${flag} must be a positive number (got "${raw}")`);
  }
  return n;
}

function validateAspect(args) {
  const a = requireStringValue(args, "aspect") ?? "16:9";
  if (!VALID_ASPECTS.has(a)) {
    throw new Error(`--aspect must be one of ${[...VALID_ASPECTS].join(", ")} (got "${a}")`);
  }
  return a;
}

function validateSource(args) {
  const s = requireStringValue(args, "source") ?? "replicate";
  if (!VALID_SOURCES.has(s)) {
    throw new Error(`--source must be one of ${[...VALID_SOURCES].join(", ")} (got "${s}")`);
  }
  return s;
}

function validateModel(args) {
  const m = requireStringValue(args, "model");
  if (m === undefined) return undefined;
  if (!MODELS[m]) {
    throw new Error(`--model "${m}" is unknown. Available: ${Object.keys(MODELS).join(", ")}`);
  }
  return m;
}

function validateConcurrency(args) {
  const raw = args.concurrency;
  if (raw === undefined) return 2;
  if (raw === true) {
    throw new Error(`--concurrency requires a numeric value, e.g. --concurrency 3`);
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`--concurrency must be a positive integer (got "${raw}")`);
  }
  return n;
}

function printHelp() {
  console.log(`
rhythmix-studio — turn a track into a cinematic music video

Usage:
  rhythmix-studio plan <track.mp3> --theme "..." [options]
  rhythmix-studio render <track.mp3> --theme "..." [options]
  rhythmix-studio render-from-plan <plan.json> [options]

Common options:
  --theme <text>        Visual theme/concept (required for plan/render).
  --bpm <n>             Track BPM, used to snap cuts to beats. Default: no snapping.
  --aspect <ratio>      "16:9" (default), "9:16", or "1:1".
  --source <name>       "replicate" (default, paid AI gen), "pexels" (FREE stock footage), or "local" (FREE, your own clips).
  --clips-dir <path>    For --source local: directory containing .mp4/.mov clips to use as scene material.
  --model <name>        For replicate source: hunyuan-video | kling-v2 | luma-ray | minimax-video.
  --out <dir>           Output directory (default: ./rhythmix-out/<track-name>).
  --dry-run             Plan only, print scenes + cost, do not call any model.
  --concurrency <n>     Parallel scene generations (default: 2).

Sources:
  replicate   AI-generated video clips. Costs ~$5-25 per video.
              Requires REPLICATE_API_TOKEN.
  pexels      Real cinematic stock footage. Free.
              Trade-off: artistic consistency across clips is lower.
              Requires PEXELS_API_KEY (free signup at https://www.pexels.com/api/).
  local       Your own video files used as scene material. Free, no API.
              Use --clips-dir <path> to point at a directory of .mp4 clips.
              Trade-off: visuals are whatever you supply, not theme-matched.

Environment:
  REPLICATE_API_TOKEN   For --source replicate.
  PEXELS_API_KEY        For --source pexels (free).
`);
}

function defaultOutDir(trackPath) {
  const base = basename(trackPath).replace(/\.[^.]+$/, "");
  return resolve(process.cwd(), "rhythmix-out", base);
}

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function cmdPlan(args) {
  const track = args._[1];
  if (!track) throw new Error("Missing <track> path. Try: rhythmix-studio plan ./song.mp3 --theme \"...\"");
  if (!existsSync(track)) throw new Error(`Track not found: ${track}`);
  const theme = requireStringValue(args, "theme");
  if (!theme) throw new Error("--theme is required");

  const source = validateSource(args);
  const aspectRatio = validateAspect(args);
  const modelPreference = validateModel(args);
  const bpmFlag = requirePositiveNumber(args, "bpm");

  log.header("RHYTHMIX Studio — Plan");
  log.info(`Track:  ${track}`);
  log.info(`Theme:  ${theme}`);
  log.info(`Source: ${source}`);

  // Store the resolved absolute path so a saved plan.json is portable: the
  // user can move it (or run `render-from-plan` from a different cwd) without
  // ffmpeg failing because the original "./song.mp3" no longer resolves.
  const audio = await probeAudio(track);
  audio.path = resolve(audio.path);
  log.ok(`Duration: ${audio.duration.toFixed(2)}s @ ${audio.sampleRate}Hz, ${audio.channels}ch (${audio.codec})`);

  let bpm = bpmFlag;
  if (!bpm) {
    const detected = await detectBpm(track);
    if (detected) {
      bpm = detected.bpm;
      log.ok(`Auto-detected BPM: ${bpm.toFixed(1)} (via ${detected.detector})`);
    } else {
      log.warn(`No --bpm given and no BPM detector installed (install 'aubio' or 'bpm-tools' for auto-detect). Cuts will not snap to beat.`);
    }
  }

  // Optional audio-driven structure detection. Reads the per-second loudness
  // curve and groups quiet/loud runs into intro/verse/chorus/bridge/outro.
  // Falls back to the hardcoded template if the song is too short or too flat.
  let structure;
  if (!args["flat-plan"]) {
    const curve = await loudnessCurve(track);
    const detected = structureFromLoudness(curve);
    if (detected) {
      structure = detected;
      log.ok(`Detected structure: ${structure.map((s) => s.role).join(" → ")}`);
    } else {
      log.info(`Audio too flat or short for structure detection — using default template.`);
    }
  }

  const dims = aspectRatio === "9:16"
    ? { width: 720, height: 1280 }
    : aspectRatio === "1:1"
      ? { width: 1024, height: 1024 }
      : { width: 1280, height: 720 };

  const plan = buildPlan({
    audio,
    theme,
    bpm,
    structure,
    modelPreference,
    aspectRatio,
    width: dims.width,
    height: dims.height,
  });

  log.ok(`${plan.scenes.length} scenes across ${plan.sections.length} sections`);
  for (const s of plan.scenes) {
    const label = source === "pexels"
      ? "Pexels stock"
      : source === "local"
        ? "Local clip"
        : MODELS[s.model].label;
    log.step(
      s.index + 1,
      plan.scenes.length,
      `${s.role.padEnd(7)} ${s.start.toFixed(1)}s→${s.end.toFixed(1)}s (${s.duration.toFixed(1)}s) [${label}]`
    );
    console.log(`     ${s.prompt}`);
  }

  if (source === "pexels") {
    log.info("Pexels mode: $0 — uses your free PEXELS_API_KEY.");
  } else if (source === "local") {
    log.info("Local mode: $0 — uses video files from --clips-dir.");
  } else {
    const cost = estimateCost(plan);
    log.cost("Estimated total", cost);
  }

  const outDir = args.out ? resolve(args.out) : defaultOutDir(track);
  await ensureDir(outDir);
  const planPath = join(outDir, "plan.json");
  await writeFile(planPath, JSON.stringify({ ...plan, source }, null, 2));
  log.ok(`Plan saved: ${planPath}`);

  return { plan, outDir, source };
}

async function generateSceneReplicate({ scene, outDir }) {
  const m = MODELS[scene.model];
  if (!m) throw new Error(`Unknown model: ${scene.model}`);
  const input = m.buildInput(scene);
  const output = await replicateRun({ model: m.replicateId, input });
  const url = firstUrl(output);
  const filename = `scene-${String(scene.index).padStart(3, "0")}-${scene.model}.mp4`;
  return downloadToDisk(url, filename, outDir);
}

async function generateScenePexels({ scene, outDir, pexelsVideos }) {
  const video = pexelsVideos[scene.index % pexelsVideos.length];
  if (!video) throw new Error(`No Pexels video available for scene ${scene.index}`);
  const file = pickVideoFile(video, { preferWidth: scene.width || 1280 });
  if (!file) throw new Error(`No usable video file in Pexels result for scene ${scene.index}`);
  const filename = `scene-${String(scene.index).padStart(3, "0")}-pexels.mp4`;
  return downloadPexelsVideo({ url: file.link, filename, outDir });
}

async function generateSceneLocal({ scene, outDir, localClips }) {
  const srcPath = localClips[scene.index % localClips.length];
  if (!srcPath) throw new Error(`No local clip available for scene ${scene.index}`);
  const filename = `scene-${String(scene.index).padStart(3, "0")}-local.mp4`;
  return copyLocalClip({ srcPath, filename, outDir });
}

// Wrap a scene fetch in bounded retries with exponential backoff so a
// transient API failure doesn't abandon the whole render (and its $$).
async function withRetry(fn, { attempts = 3, label = "fetch" } = {}) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts) break;
      const waitMs = 1000 * Math.pow(2, i - 1);
      log.warn(`  ${label} failed (attempt ${i}/${attempts}): ${err.message} — retrying in ${waitMs}ms`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  throw lastErr;
}

function expectedSceneFilename(scene, source) {
  const tag = source === "pexels" ? "pexels" : source === "local" ? "local" : scene.model;
  return `scene-${String(scene.index).padStart(3, "0")}-${tag}.mp4`;
}

async function generateAll({ plan, outDir, concurrency, source, clipsDir }) {
  const sceneDir = join(outDir, "scenes");
  await ensureDir(sceneDir);

  let pexelsVideos = null;
  let localClips = null;
  if (source === "pexels") {
    log.info(`Searching Pexels for: "${plan.theme}"`);
    const orientation = plan.aspectRatio === "9:16"
      ? "portrait"
      : plan.aspectRatio === "1:1" ? "square" : "landscape";
    pexelsVideos = await pexelsSearch({
      query: plan.theme,
      perPage: Math.min(80, Math.max(plan.scenes.length, 10)),
      orientation,
    });
    log.ok(`Found ${pexelsVideos.length} videos on Pexels`);
    if (!pexelsVideos.length) {
      throw new Error(`Pexels returned no videos for "${plan.theme}". Try a different theme.`);
    }
  } else if (source === "local") {
    if (!clipsDir) throw new Error("--clips-dir is required for --source local");
    log.info(`Loading local clips from: ${clipsDir}`);
    localClips = await listLocalClips(clipsDir);
    log.ok(`Found ${localClips.length} local clips`);
  }

  const results = new Array(plan.scenes.length);
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < plan.scenes.length) {
      const idx = cursor++;
      const scene = plan.scenes[idx];
      const label = source === "pexels"
        ? "Pexels stock"
        : source === "local"
          ? "Local clip"
          : MODELS[scene.model].label;

      // Checkpoint: skip if this scene's output already exists from a
      // previous run. Lets a failed render resume without re-spending.
      const existingPath = join(sceneDir, expectedSceneFilename(scene, source));
      if (existsSync(existingPath)) {
        log.step(idx + 1, plan.scenes.length, `✓ scene ${idx + 1} already rendered — skipping`);
        results[idx] = existingPath;
        continue;
      }

      log.step(idx + 1, plan.scenes.length, `Fetching ${scene.role} via ${label}…`);
      try {
        const path = await withRetry(
          () => (source === "pexels"
            ? generateScenePexels({ scene, outDir: sceneDir, pexelsVideos })
            : source === "local"
              ? generateSceneLocal({ scene, outDir: sceneDir, localClips })
              : generateSceneReplicate({ scene, outDir: sceneDir })),
          { attempts: 3, label: `scene ${idx + 1} fetch` }
        );
        log.ok(`  scene ${idx + 1} → ${path}`);
        results[idx] = path;
      } catch (err) {
        log.err(`  scene ${idx + 1} failed after retries: ${err.message}`);
        log.info(`  Re-run the same command to resume — completed scenes are kept.`);
        throw err;
      }
    }
  });
  await Promise.all(workers);
  return results;
}

function requireSourceCredentials(source) {
  if (source === "replicate" && !process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN not set. Required for --source replicate.");
  }
  if (source === "pexels" && !process.env.PEXELS_API_KEY) {
    throw new Error("PEXELS_API_KEY not set. Required for --source pexels. Free at https://www.pexels.com/api/");
  }
  // source === "local" needs no credentials, only --clips-dir at runtime
}

async function cmdRender(args) {
  const { plan, outDir, source } = await cmdPlan(args);

  if (args["dry-run"]) {
    log.warn("Dry run — skipping generation. Re-run without --dry-run to render.");
    return;
  }

  requireSourceCredentials(source);

  log.header(`Generating scenes (source: ${source})`);
  const concurrency = validateConcurrency(args);
  const sceneFiles = await generateAll({ plan, outDir, concurrency, source, clipsDir: args["clips-dir"] });

  log.header("Composing final video");
  const finalPath = join(outDir, "final.mp4");
  const workDir = join(outDir, "work");
  const transitions = args["no-transitions"] ? "cut" : "crossfade";
  await compose({ plan, sceneFiles, outputPath: finalPath, workDir, transitions });
  log.ok(`Final video: ${finalPath}`);
}

async function cmdRenderFromPlan(args) {
  const planPath = args._[1];
  if (!planPath) throw new Error("Missing <plan.json> path");
  const planData = JSON.parse(await readFile(planPath, "utf8"));
  const sourceFromArgs = requireStringValue(args, "source");
  if (sourceFromArgs && !VALID_SOURCES.has(sourceFromArgs)) {
    throw new Error(`--source must be one of ${[...VALID_SOURCES].join(", ")} (got "${sourceFromArgs}")`);
  }
  const source = sourceFromArgs ?? planData.source ?? "replicate";
  const outDir = args.out ? resolve(args.out) : resolve(planPath, "..");

  requireSourceCredentials(source);

  log.header(`Generating scenes from saved plan (source: ${source})`);
  const concurrency = validateConcurrency(args);
  const sceneFiles = await generateAll({ plan: planData, outDir, concurrency, source, clipsDir: args["clips-dir"] });

  log.header("Composing final video");
  const finalPath = join(outDir, "final.mp4");
  const workDir = join(outDir, "work");
  const transitions = args["no-transitions"] ? "cut" : "crossfade";
  await compose({ plan: planData, sceneFiles, outputPath: finalPath, workDir, transitions });
  log.ok(`Final video: ${finalPath}`);
}

export async function main(argv) {
  const args = parseArgs(argv);
  const cmd = args._[0];

  if (!cmd || cmd === "help" || args.help) {
    printHelp();
    return 0;
  }

  try {
    if (cmd === "plan") await cmdPlan(args);
    else if (cmd === "render") await cmdRender(args);
    else if (cmd === "render-from-plan") await cmdRenderFromPlan(args);
    else {
      log.err(`Unknown command: ${cmd}`);
      printHelp();
      return 1;
    }
    return 0;
  } catch (err) {
    if (err instanceof ReplicateError) log.err(`Replicate: ${err.message}`);
    else if (err instanceof PexelsError) log.err(`Pexels: ${err.message}`);
    else {
      log.err(err.message);
      if (process.env.RHYTHMIX_DEBUG) console.error(err.stack);
    }
    return 1;
  }
}
