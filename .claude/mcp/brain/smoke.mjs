// Smoke test: exercise every brain operation against an in-memory db.
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rmSync } from "node:fs";
import { openBrain } from "./db.mjs";

const path = join(tmpdir(), `brain-smoke-${Date.now()}.db`);
const brain = openBrain(path);

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`  ok  ${msg}`);
}

const a = brain.remember({ content: "RHYTHMIX uses a $149 lifetime tier", kind: "fact", tags: ["pricing", "rhythmix"] });
const b = brain.remember({ content: "Suno charges $10/month", kind: "fact", tags: ["pricing", "competitor"] });
const c = brain.remember({ content: "Decided to lead with the lifetime tier on the landing page", kind: "decision", tags: ["pricing", "landing"] });

assert(a.id && b.id && c.id, "remember returns ids");

const recall = brain.recall({ query: "pricing", limit: 5 });
assert(recall.length === 3, `recall finds 3, got ${recall.length}`);
assert(recall[0].effective_strength <= 2, "effective_strength bounded");

const tagged = brain.recall({ tags: ["competitor"], limit: 5 });
assert(tagged.length === 1 && tagged[0].id === b.id, "tag filter works");

const edge = brain.relate({ fromId: c.id, toId: a.id, kind: "supports" });
assert(edge.kind === "supports", "relate creates edge");

const nbrs = brain.neighbours(c.id, 1);
assert(nbrs.length === 1 && nbrs[0].id === a.id, "neighbours follows edge");

const stats = brain.stats();
assert(stats.total === 3 && stats.edges === 1, "stats correct");

const decayed = brain.decay({ halfLifeDays: 30 });
assert(typeof decayed.touched === "number", "decay returns touched count");

assert(brain.forget(b.id), "forget returns true");
assert(brain.recall({ query: "Suno" }).length === 0, "forgotten memory gone");

console.log("\nall good");
rmSync(path, { force: true });
rmSync(`${path}-wal`, { force: true });
rmSync(`${path}-shm`, { force: true });
