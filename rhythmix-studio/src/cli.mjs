import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { probeAudio } from "./audio.mjs";
import { buildPlan } from "./plan.mjs";
import { MODELS, estimateCost } from "./models.mjs";
import { replicateRun, downloadToDisk, firstUrl, ReplicateError } from "./replicate.mjs";
import { pexelsSearch, pickVideoFile, downloadPexelsVideo, PexelsError } from "./sources/pexels.mjs";
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
  --source <name>       "replicate" (default, paid AI gen) or "pexels" (FREE stock footage).
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
  if (!args.theme) throw new Error("--theme is required");

  const source = args.source ?? "replicate";

  log.header("RHYTHMIX Studio — Plan");
  log.info(`Track:  ${track}`);
  log.info(`Theme:  ${args.theme}`);
  log.info(`Source: ${source}`);

  const audio = await probeAudio(track);
  log.ok(`Duration: ${audio.duration.toFixed(2)}s @ ${audio.sampleRate}Hz, ${audio.channels}ch (${audio.codec})`);

  const aspectRatio = args.aspect ?? "16:9";
  const dims = aspectRatio === "9:16"
    ? { width: 720, height: 1280 }
    : aspectRatio === "1:1"
      ? { width: 1024, height: 1024 }
      : { width: 1280, height: 720 };

  const plan = buildPlan({
    audio,
    theme: args.theme,
    bpm: args.bpm ? Number(args.bpm) : undefined,
    modelPreference: args.model,
    aspectRatio,
    width: dims.width,
    height: dims.height,
  });

  log.ok(`${plan.scenes.length} scenes across ${plan.sections.length} sections`);
  for (const s of plan.scenes) {
    const label = source === "pexels" ? "Pexels stock" : MODELS[s.model].label;
    log.step(
      s.index + 1,
      plan.scenes.length,
      `${s.role.padEnd(7)} ${s.start.toFixed(1)}s→${s.end.toFixed(1)}s (${s.duration.toFixed(1)}s) [${label}]`
    );
    console.log(`     ${s.prompt}`);
  }

  if (source === "pexels") {
    log.info("Pexels mode: $0 — uses your free PEXELS_API_KEY.");
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

async function generateAll({ plan, outDir, concurrency, source }) {
  const sceneDir = join(outDir, "scenes");
  await ensureDir(sceneDir);

  let pexelsVideos = null;
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
  }

  const results = new Array(plan.scenes.length);
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < plan.scenes.length) {
      const idx = cursor++;
      const scene = plan.scenes[idx];
      const label = source === "pexels" ? "Pexels stock" : MODELS[scene.model].label;
      log.step(idx + 1, plan.scenes.length, `Fetching ${scene.role} via ${label}…`);
      try {
        const path = source === "pexels"
          ? await generateScenePexels({ scene, outDir: sceneDir, pexelsVideos })
          : await generateSceneReplicate({ scene, outDir: sceneDir });
        log.ok(`  scene ${idx + 1} → ${path}`);
        results[idx] = path;
      } catch (err) {
        log.err(`  scene ${idx + 1} failed: ${err.message}`);
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
}

async function cmdRender(args) {
  const { plan, outDir, source } = await cmdPlan(args);

  if (args["dry-run"]) {
    log.warn("Dry run — skipping generation. Re-run without --dry-run to render.");
    return;
  }

  requireSourceCredentials(source);

  log.header(`Generating scenes (source: ${source})`);
  const concurrency = Number(args.concurrency ?? 2);
  const sceneFiles = await generateAll({ plan, outDir, concurrency, source });

  log.header("Composing final video");
  const finalPath = join(outDir, "final.mp4");
  const workDir = join(outDir, "work");
  await compose({ plan, sceneFiles, outputPath: finalPath, workDir });
  log.ok(`Final video: ${finalPath}`);
}

async function cmdRenderFromPlan(args) {
  const planPath = args._[1];
  if (!planPath) throw new Error("Missing <plan.json> path");
  const planData = JSON.parse(await readFile(planPath, "utf8"));
  const source = args.source ?? planData.source ?? "replicate";
  const outDir = args.out ? resolve(args.out) : resolve(planPath, "..");

  requireSourceCredentials(source);

  log.header(`Generating scenes from saved plan (source: ${source})`);
  const concurrency = Number(args.concurrency ?? 2);
  const sceneFiles = await generateAll({ plan: planData, outDir, concurrency, source });

  log.header("Composing final video");
  const finalPath = join(outDir, "final.mp4");
  const workDir = join(outDir, "work");
  await compose({ plan: planData, sceneFiles, outputPath: finalPath, workDir });
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
