// Fast unit tests — no ffmpeg, no external APIs, no real audio files.
// Runs in <1s. Covers planner determinism, story-mode narrative arc,
// reference-image propagation, multi-aspect dispatch, asset-pack validation.
//
// Usage: node test/unit.mjs
//   exits 0 on success, 1 on first failure.

import { buildPlan } from "../src/plan.mjs";
import { validateFormats, estimateAssetCost, ASSET_SPECS } from "../src/assets.mjs";

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

// Minimal stub of the audio object that buildPlan needs.
function stubAudio(duration = 60) {
  return { path: "/dev/null", duration, sampleRate: 44100, channels: 2, codec: "mp3" };
}

function testPlannerDeterminism() {
  header("planner — determinism");
  const a = buildPlan({ audio: stubAudio(60), theme: "cyberpunk skyline", bpm: 120 });
  const b = buildPlan({ audio: stubAudio(60), theme: "cyberpunk skyline", bpm: 120 });
  const aPrompts = a.scenes.map((s) => s.prompt).join("|");
  const bPrompts = b.scenes.map((s) => s.prompt).join("|");
  if (aPrompts === bPrompts) ok("same inputs → identical prompts (deterministic)");
  else fail("same inputs produced different prompts");
}

function testStoryModeDefaultsOn() {
  header("planner — story mode default ON");
  const plan = buildPlan({ audio: stubAudio(60), theme: "noir city", bpm: 120 });
  if (plan.storyMode === true) ok("plan.storyMode is true by default");
  else fail(`plan.storyMode is ${plan.storyMode}, expected true`);
  const allHaveBeats = plan.scenes.every((s) => s.narrativeBeat);
  if (allHaveBeats) ok("every scene has a narrativeBeat");
  else fail("at least one scene is missing narrativeBeat");
  const firstScene = plan.scenes[0];
  if (firstScene.prompt.startsWith("[")) ok(`first scene prompt starts with bracketed beat: "${firstScene.prompt.slice(0, 60)}…"`);
  else fail(`first scene prompt does not start with [: "${firstScene.prompt.slice(0, 60)}…"`);
}

function testStoryModeDisable() {
  header("planner — story mode disabled");
  const plan = buildPlan({ audio: stubAudio(60), theme: "noir city", bpm: 120, storyMode: false });
  if (plan.storyMode === false) ok("plan.storyMode is false when disabled");
  else fail(`plan.storyMode is ${plan.storyMode}, expected false`);
  const noBeats = plan.scenes.every((s) => !s.prompt.startsWith("["));
  if (noBeats) ok("no scene prompt starts with bracketed beat");
  else fail("found bracketed beat preamble despite storyMode: false");
}

function testNarrativeArc() {
  header("planner — narrative arc shape");
  const plan = buildPlan({ audio: stubAudio(60), theme: "noir city", bpm: 120 });
  const firstBeat = plan.scenes[0].narrativeBeat;
  const lastBeat = plan.scenes[plan.scenes.length - 1].narrativeBeat;
  if (firstBeat.includes("arrival") || firstBeat.includes("establish")) ok(`first scene beat is opening: "${firstBeat}"`);
  else fail(`first scene beat is not opening: "${firstBeat}"`);
  if (lastBeat.includes("departure") || lastBeat.includes("resolution")) ok(`last scene beat is closing: "${lastBeat}"`);
  else fail(`last scene beat is not closing: "${lastBeat}"`);
}

function testReferenceImagePropagation() {
  header("planner — reference image propagation");
  const url = "https://example.com/hero.jpg";
  const plan = buildPlan({ audio: stubAudio(60), theme: "noir city", bpm: 120, referenceImage: url });
  if (plan.referenceImage === url) ok("plan.referenceImage is preserved at plan level");
  else fail(`plan.referenceImage is ${plan.referenceImage}`);
  const allCarryRef = plan.scenes.every((s) => s.referenceImage === url);
  if (allCarryRef) ok("every scene carries the reference image");
  else fail("at least one scene is missing reference image");
}

function testReferenceImageOmittedWhenAbsent() {
  header("planner — no reference image by default");
  const plan = buildPlan({ audio: stubAudio(60), theme: "noir city", bpm: 120 });
  if (plan.referenceImage === null) ok("plan.referenceImage is null when not supplied");
  else fail(`plan.referenceImage is ${plan.referenceImage}, expected null`);
  const noneCarryRef = plan.scenes.every((s) => !("referenceImage" in s));
  if (noneCarryRef) ok("scenes do not carry a referenceImage field when absent");
  else fail("a scene has referenceImage when none was supplied");
}

function testAssetValidation() {
  header("assets — format validation");
  try {
    validateFormats(["cover", "canvas", "feedCover"]);
    ok("validateFormats accepts the three canonical formats");
  } catch (err) {
    fail("validateFormats rejected canonical formats", err);
  }
  try {
    validateFormats(["cover", "bogus"]);
    fail("validateFormats accepted an unknown format");
  } catch (err) {
    if (err.message.includes("bogus")) ok(`validateFormats rejects unknown format with helpful error`);
    else fail(`validateFormats error didn't name the bad format: ${err.message}`);
  }
}

function testAssetCost() {
  header("assets — cost estimation");
  const oneCost = estimateAssetCost(["cover"]);
  const threeCost = estimateAssetCost(["cover", "canvas", "feedCover"]);
  if (oneCost > 0 && oneCost < 1) ok(`single-asset cost is $${oneCost.toFixed(2)} (sane range)`);
  else fail(`single-asset cost is $${oneCost}, out of expected range`);
  if (Math.abs(threeCost - oneCost * 3) < 0.001) ok("three-asset cost is 3× single-asset cost");
  else fail(`three-asset cost is $${threeCost}, expected 3× $${oneCost}`);
}

function testAssetSpecsShape() {
  header("assets — spec shape");
  const requiredKeys = ["label", "filename", "aspectRatio", "promptSuffix"];
  for (const [fmt, spec] of Object.entries(ASSET_SPECS)) {
    const missing = requiredKeys.filter((k) => !spec[k]);
    if (missing.length === 0) ok(`${fmt} spec has all required keys`);
    else fail(`${fmt} spec missing keys: ${missing.join(", ")}`);
  }
}

function main() {
  testPlannerDeterminism();
  testStoryModeDefaultsOn();
  testStoryModeDisable();
  testNarrativeArc();
  testReferenceImagePropagation();
  testReferenceImageOmittedWhenAbsent();
  testAssetValidation();
  testAssetCost();
  testAssetSpecsShape();

  console.log(`\n${passed} passed, ${failed} failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
