// Integration tests for the rhythmix-studio pipeline. Runs against a
// synthetic dynamic-loudness audio track + the existing scene clip stash;
// proves the music → video pipeline still composes valid output after any
// refactor. No external API calls; safe to run in CI or pre-release.
//
// Usage: node test/run.mjs
//   exits 0 on success, 1 on first failure.

import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loudnessCurve, structureFromLoudness } from "../src/audio.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TRACK = join(__dirname, "dynamic-track.mp3");
const CLIPS_DIR = join(ROOT, "rhythmix-out", "test-render", "scenes");
const OUT_BASE = join(__dirname, "_out");

let passed = 0;
let failed = 0;

function ok(msg) {
  passed++;
  console.log(`  ✓ ${msg}`);
}
function fail(msg, err) {
  failed++;
  console.log(`  ✗ ${msg}`);
  if (err) console.log(`    ${err.message ?? err}`);
}
function header(msg) {
  console.log(`\n${msg}`);
}

function run(cmd, args, { cwd } = {}) {
  return new Promise((resolveP, rejectP) => {
    const p = spawn(cmd, args, { cwd: cwd ?? ROOT });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d.toString()));
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", rejectP);
    p.on("close", (code) => {
      if (code === 0) resolveP({ stdout, stderr });
      else rejectP(new Error(`${cmd} exited ${code}: ${stderr || stdout}`));
    });
  });
}

async function ffprobe(path) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    path,
  ]);
  return JSON.parse(stdout);
}

async function testLoudnessCurve() {
  header("loudness curve");
  const curve = await loudnessCurve(TRACK);
  if (curve.length >= 25) ok(`curve has ${curve.length} samples (>= 25)`);
  else fail(`curve has only ${curve.length} samples`);
  const finite = curve.every((v) => Number.isFinite(v));
  if (finite) ok("all samples are finite numbers");
  else fail("some samples are NaN/Infinity");
}

async function testStructureDetection() {
  header("structure detection (dynamic track)");
  const curve = await loudnessCurve(TRACK);
  const structure = structureFromLoudness(curve);
  if (!structure) {
    fail("structureFromLoudness returned null for a clearly dynamic track");
    return;
  }
  ok(`detected ${structure.length} sections`);
  const roles = structure.map((s) => s.role);
  if (roles[0] === "intro") ok("first section is intro");
  else fail(`first section is '${roles[0]}', expected 'intro'`);
  if (roles[roles.length - 1] === "outro") ok("last section is outro");
  else fail(`last section is '${roles[roles.length - 1]}', expected 'outro'`);
  const hasChorus = roles.includes("chorus");
  if (hasChorus) ok("includes a chorus section (mapped from loud middle)");
  else fail(`no chorus detected — roles: ${roles.join(", ")}`);
  const totalShare = structure.reduce((s, r) => s + r.share, 0);
  if (Math.abs(totalShare - 1.0) < 0.001) ok(`section shares sum to 1.0`);
  else fail(`section shares sum to ${totalShare}, expected 1.0`);
}

async function testFullRender(name, extraArgs) {
  header(`full render: ${name}`);
  const outDir = join(OUT_BASE, name);
  try {
    await run("node", [
      "bin/rhythmix-studio.mjs", "render", TRACK,
      "--theme", "test render — automated pipeline test",
      "--source", "local",
      "--clips-dir", CLIPS_DIR,
      "--out", outDir,
      "--bpm", "120",
      ...extraArgs,
    ]);
  } catch (err) {
    fail(`render command exited non-zero`, err);
    return;
  }
  const finalPath = join(outDir, "final.mp4");
  if (existsSync(finalPath)) ok("final.mp4 exists");
  else { fail("final.mp4 missing"); return; }
  const size = statSync(finalPath).size;
  if (size > 100_000) ok(`final.mp4 is ${(size / 1024).toFixed(1)}KB (>= 100KB)`);
  else fail(`final.mp4 is only ${size} bytes`);
  const probe = await ffprobe(finalPath);
  const v = probe.streams.find((s) => s.codec_type === "video");
  const a = probe.streams.find((s) => s.codec_type === "audio");
  if (v && v.codec_name === "h264") ok(`video stream is h264 (${v.width}x${v.height})`);
  else fail(`video stream missing or wrong codec`);
  if (a && a.codec_name === "aac") ok(`audio stream is aac (${a.sample_rate}Hz)`);
  else fail(`audio stream missing or wrong codec`);
  const duration = Number(probe.format.duration);
  if (duration > 25 && duration < 32) ok(`duration ${duration.toFixed(2)}s (≈ 30s)`);
  else fail(`duration ${duration.toFixed(2)}s out of expected range`);
  return { v, a, duration };
}

// Run the CLI expecting a non-zero exit. Confirms the printed error contains
// `expectMsgFragment`. Used to lock in argument-validation rejections so a
// future refactor can't silently re-accept bad input.
async function expectCliReject(label, extraArgs, expectMsgFragment) {
  try {
    await run("node", ["bin/rhythmix-studio.mjs", ...extraArgs]);
    fail(`${label}: expected non-zero exit, got success`);
  } catch (err) {
    const msg = err.message ?? String(err);
    if (msg.includes(expectMsgFragment)) ok(`${label}: rejected with "${expectMsgFragment}"`);
    else fail(`${label}: rejected but message missing "${expectMsgFragment}"`, err);
  }
}

async function testArgValidation() {
  header("argument validation");
  // Each case = a typo a real user could make. Today's behavior is "throw
  // a single-line error before any work starts"; we lock that in so a
  // future refactor doesn't silently accept (and ruin the render).
  const base = ["plan", TRACK, "--dry-run"];
  await expectCliReject("--bpm without value",      [...base, "--theme", "x", "--bpm"],                   "--bpm requires a numeric value");
  await expectCliReject("--bpm non-numeric",        [...base, "--theme", "x", "--bpm", "abc"],            "--bpm must be a positive number");
  await expectCliReject("--bpm negative",           [...base, "--theme", "x", "--bpm", "-50"],            "--bpm must be a positive number");
  await expectCliReject("--theme without value",    [...base, "--theme", "--bpm", "120"],                  "--theme requires a value");
  await expectCliReject("--aspect invalid",         [...base, "--theme", "x", "--bpm", "120", "--aspect", "4:3"],     "--aspect must be one of");
  await expectCliReject("--model unknown",          [...base, "--theme", "x", "--bpm", "120", "--model", "kling-v99"], "--model \"kling-v99\" is unknown");
  await expectCliReject("--source invalid",         [...base, "--theme", "x", "--bpm", "120", "--source", "banana"],   "--source must be one of");
  await expectCliReject("--concurrency 0",          ["render", TRACK, "--theme", "x", "--bpm", "120", "--source", "local", "--clips-dir", CLIPS_DIR, "--concurrency", "0", "--out", join(OUT_BASE, "validate-c0")], "--concurrency must be a positive integer");
  await expectCliReject("--concurrency abc",        ["render", TRACK, "--theme", "x", "--bpm", "120", "--source", "local", "--clips-dir", CLIPS_DIR, "--concurrency", "abc", "--out", join(OUT_BASE, "validate-cs")], "--concurrency must be a positive integer");
}

async function testPlanPortability() {
  header("plan.json portability");
  // A saved plan should carry an absolute audio path so the user can
  // `cd somewhere/else && render-from-plan` without ffmpeg failing.
  const outDir = join(OUT_BASE, "portability");
  await run("node", ["bin/rhythmix-studio.mjs", "plan", TRACK,
    "--theme", "portability", "--bpm", "120", "--flat-plan", "--dry-run",
    "--out", outDir,
  ]);
  const planPath = join(outDir, "plan.json");
  const plan = JSON.parse(await import("node:fs/promises").then((m) => m.readFile(planPath, "utf8")));
  if (plan.audio.path && plan.audio.path.startsWith("/")) ok("plan.audio.path is absolute");
  else fail(`plan.audio.path is "${plan.audio.path}", expected absolute path`);
}

async function main() {
  if (!existsSync(TRACK)) {
    console.error(`Missing test track: ${TRACK}`);
    console.error(`Build it with:`);
    console.error(`  ffmpeg -f lavfi -i "sine=frequency=220:duration=30" \\`);
    console.error(`    -af "volume=enable='lt(t,8)':volume=0.15,volume=enable='between(t,8,22)':volume=0.85,volume=enable='gt(t,22)':volume=0.15" \\`);
    console.error(`    -ar 44100 -ac 2 ${TRACK}`);
    process.exit(2);
  }
  if (!existsSync(CLIPS_DIR)) {
    console.error(`Missing scene clips: ${CLIPS_DIR}`);
    console.error(`Run a render first, or supply your own --clips-dir.`);
    process.exit(2);
  }

  await testLoudnessCurve();
  await testStructureDetection();
  await testFullRender("landscape", ["--aspect", "16:9"]);
  await testFullRender("portrait", ["--aspect", "9:16"]);
  await testFullRender("square", ["--aspect", "1:1"]);
  await testFullRender("no-transitions", ["--aspect", "16:9", "--no-transitions"]);
  await testArgValidation();
  await testPlanPortability();

  console.log(`\n${passed} passed, ${failed} failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
