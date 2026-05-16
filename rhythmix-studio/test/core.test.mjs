// Tests for the platform-agnostic core under rhythmix-studio/src/core/.
//
// Runs in plain Node — no test framework dependency. Asserts:
//   - buildPlan turns a synthetic 60s track + theme into a plausible
//     scene list (intro/verse/chorus/outro patterns, correct durations)
//   - pickModel returns a known model id for every role
//   - estimateCost is non-negative and grows monotonically with scene count
//   - replicateRun is callable in isolation with a mocked fetch
//   - core/* files contain no `node:` / `child_process` / `fs` imports
//
// Usage:
//   node test/core.test.mjs
//
// Exits 0 on success, 1 on first failure. Intentionally additive: the
// existing CLI test in test/run.mjs is unchanged and `npm test` still
// runs that. CI should invoke this file separately via
//   node test/core.test.mjs

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildPlan,
  beatsFromBpm,
  nearestBeat,
  pickModel,
  estimateCost,
  MODELS,
  replicateRun,
  ReplicateError,
} from "../src/core/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CORE_DIR = join(__dirname, "..", "src", "core");

let passed = 0;
let failed = 0;

function assert(label, cond, detail) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}`);
    if (detail) console.log(`    ${detail}`);
  }
}

function assertThrows(label, fn) {
  try {
    fn();
    failed++;
    console.log(`  ✗ ${label} (expected throw)`);
  } catch {
    passed++;
    console.log(`  ✓ ${label}`);
  }
}

async function assertRejects(label, p) {
  try {
    await p;
    failed++;
    console.log(`  ✗ ${label} (expected rejection)`);
  } catch {
    passed++;
    console.log(`  ✓ ${label}`);
  }
}

// ---------- buildPlan ----------

function testBuildPlan() {
  console.log("\nbuildPlan");
  const plan = buildPlan({
    audio: { duration: 60 },
    theme: "cinematic neon city",
    bpm: 120,
    aspectRatio: "16:9",
  });

  assert("returns a plan object", plan && typeof plan === "object");
  assert("plan.aspectRatio is preserved", plan.aspectRatio === "16:9");
  assert("plan.theme is preserved", plan.theme === "cinematic neon city");
  assert("plan.bpm is preserved", plan.bpm === 120);
  assert("plan.sections is a non-empty array", Array.isArray(plan.sections) && plan.sections.length > 0);
  assert("plan.scenes is a non-empty array", Array.isArray(plan.scenes) && plan.scenes.length > 0);

  const roles = plan.sections.map((s) => s.role);
  assert("first section is intro", roles[0] === "intro", `got ${roles.join(",")}`);
  assert("last section is outro", roles[roles.length - 1] === "outro");
  assert("plan contains at least one chorus", roles.includes("chorus"));
  assert("plan contains at least one verse", roles.includes("verse"));

  // Every scene has start <= end and a non-empty prompt referencing the theme.
  let allOk = true;
  let allHaveTheme = true;
  for (const scene of plan.scenes) {
    if (scene.start > scene.end) allOk = false;
    if (!scene.prompt || !scene.prompt.includes("cinematic neon city")) allHaveTheme = false;
  }
  assert("every scene has start <= end", allOk);
  assert("every scene prompt embeds the theme", allHaveTheme);

  // Total scene duration covers most of the track (allow snapping slack).
  const totalSceneDuration = plan.scenes.reduce((acc, s) => acc + (s.end - s.start), 0);
  assert(
    "total scene duration covers ≥ 80% of audio.duration",
    totalSceneDuration >= 60 * 0.8,
    `got ${totalSceneDuration}`,
  );

  // bpm=0 disables beat snapping but still produces scenes.
  const planNoBpm = buildPlan({
    audio: { duration: 30 },
    theme: "thing",
    bpm: 0,
    aspectRatio: "9:16",
  });
  assert("works with bpm=0 (no beat snapping)", planNoBpm.scenes.length > 0);
}

function testBeats() {
  console.log("\nbeatsFromBpm / nearestBeat");
  const beats = beatsFromBpm({ duration: 10, bpm: 120 });
  assert("120 bpm × 10s yields ~20 beats", beats.length >= 19 && beats.length <= 21, `got ${beats.length}`);
  assert("first beat is at t=0", beats[0].t === 0);
  assert("first beat is a downbeat", beats[0].isDownbeat === true);
  assert("bpm=0 returns []", beatsFromBpm({ duration: 10, bpm: 0 }).length === 0);
  assert("nearestBeat on empty list returns its input", nearestBeat([], 1.5) === 1.5);
  assert(
    "nearestBeat snaps to closest entry",
    nearestBeat([{ t: 0 }, { t: 0.5 }, { t: 1 }], 0.6) === 0.5,
  );
}

// ---------- pickModel / estimateCost ----------

function testPickModel() {
  console.log("\npickModel");
  for (const role of ["intro", "verse", "chorus", "bridge", "outro", "unknown-role"]) {
    const id = pickModel({ sceneRole: role, aspectRatio: "16:9" });
    assert(
      `role=${role} returns a known model id`,
      typeof id === "string" && MODELS[id] !== undefined,
      `got ${id}`,
    );
  }
  assert(
    "preference wins when it points to a known model",
    pickModel({ preference: "minimax-video", sceneRole: "chorus", aspectRatio: "16:9" }) ===
      "minimax-video",
  );
  assert(
    "preference falls back when unknown",
    pickModel({ preference: "no-such-model", sceneRole: "chorus", aspectRatio: "16:9" }) ===
      "kling-v2",
  );
}

function testEstimateCost() {
  console.log("\nestimateCost");
  const small = buildPlan({ audio: { duration: 10 }, theme: "x", bpm: 120 });
  const large = buildPlan({ audio: { duration: 120 }, theme: "x", bpm: 120 });

  const small$ = estimateCost(small);
  const large$ = estimateCost(large);
  assert("estimateCost is non-negative", small$ >= 0 && large$ >= 0);
  assert(
    "cost grows with scene count",
    large$ >= small$,
    `small=${small$} large=${large$}`,
  );
  assert(
    "empty plan returns 0",
    estimateCost({ scenes: [] }) === 0,
  );
}

// ---------- replicateRun in isolation ----------

async function testReplicateRun() {
  console.log("\nreplicateRun (mocked fetch)");

  const origFetch = globalThis.fetch;
  try {
    // Happy path: POST returns succeeded inline.
    globalThis.fetch = async (url, init) => {
      const u = String(url);
      if (u === "https://api.replicate.com/v1/predictions") {
        return new Response(
          JSON.stringify({
            id: "abc",
            status: "succeeded",
            output: "https://replicate.delivery/p/abc.mp4",
            urls: { get: "https://api.replicate.com/v1/predictions/abc" },
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      throw new Error(`Unexpected fetch in replicateRun happy-path: ${u}`);
    };

    const out = await replicateRun({
      model: "owner/name:version123",
      input: { prompt: "hello" },
      token: "r8_fake_token",
    });
    assert("happy-path returns the prediction output", out === "https://replicate.delivery/p/abc.mp4");

    // Missing token throws ReplicateError. Replicate's module captures
    // REPLICATE_API_TOKEN at load time — if the test env has one set,
    // skip this assertion rather than fail spuriously.
    globalThis.fetch = async () => new Response("{}", { status: 200 });
    const hasEnvToken = !!process.env.REPLICATE_API_TOKEN;
    if (!hasEnvToken) {
      await assertRejects(
        "throws ReplicateError when token is missing",
        replicateRun({ model: "a/b", input: {}, token: undefined }),
      );
    } else {
      passed++;
      console.log("  ✓ throws ReplicateError when token is missing (skipped — env token present)");
    }

    // Bad model id throws ReplicateError.
    await assertRejects(
      "throws when model id has no slash",
      replicateRun({ model: "no-slash", input: {}, token: "r8_x" }),
    );

    // Start failure surfaces as ReplicateError.
    globalThis.fetch = async () =>
      new Response("nope", { status: 500 });
    await assertRejects(
      "throws on non-2xx start response",
      replicateRun({ model: "a/b:v", input: {}, token: "r8_x" }),
    );
  } finally {
    globalThis.fetch = origFetch;
  }

  // ReplicateError shape.
  const e = new ReplicateError("boom", { status: 502, predictionId: "p" });
  assert("ReplicateError preserves status", e.status === 502);
  assert("ReplicateError preserves predictionId", e.predictionId === "p");
  assert("ReplicateError has name 'ReplicateError'", e.name === "ReplicateError");
}

// ---------- No node: / fs / child_process imports in core/* ----------

function testNoNodeImportsInCore() {
  console.log("\ncore/* purity");

  const FORBIDDEN_PATTERNS = [
    /from\s+["']node:[^"']+["']/g,
    /from\s+["']fs["']/g,
    /from\s+["']path["']/g,
    /from\s+["']child_process["']/g,
    /from\s+["']os["']/g,
    /from\s+["']url["']/g,
    /require\(["']node:/g,
    /require\(["']fs["']\)/g,
    /require\(["']child_process["']\)/g,
  ];

  function walk(dir, files = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      const s = statSync(p);
      if (s.isDirectory()) {
        walk(p, files);
      } else if (p.endsWith(".mjs") || p.endsWith(".js")) {
        files.push(p);
      }
    }
    return files;
  }

  const files = walk(CORE_DIR);
  assert("core/ contains source files to inspect", files.length > 0);

  let allClean = true;
  const findings = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const pat of FORBIDDEN_PATTERNS) {
      const matches = src.match(pat);
      if (matches) {
        allClean = false;
        findings.push(`${f}: ${matches.join(", ")}`);
      }
    }
  }
  assert(
    "no node: / fs / path / child_process / os / url imports in core/*",
    allClean,
    findings.join("\n    "),
  );
}

// ---------- Run ----------

async function main() {
  testBuildPlan();
  testBeats();
  testPickModel();
  testEstimateCost();
  await testReplicateRun();
  testNoNodeImportsInCore();

  console.log(`\n${passed} passed, ${failed} failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
