#!/usr/bin/env node
// Validate an n8n workflow JSON before import.
// Usage: node validate-workflow.mjs <path/to/workflow.json>
// Exit 0 = OK (warnings allowed), 1 = errors found, 2 = bad usage / unreadable.

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node validate-workflow.mjs <workflow.json>");
  process.exit(2);
}

let raw;
try {
  raw = readFileSync(file, "utf8");
} catch (e) {
  console.error(`cannot read ${file}: ${e.message}`);
  process.exit(2);
}

let wf;
try {
  wf = JSON.parse(raw);
} catch (e) {
  console.error(`✗ invalid JSON: ${e.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];

// --- top-level shape ---
if (typeof wf.name !== "string" || !wf.name.trim()) errors.push("missing top-level `name`");
if (!Array.isArray(wf.nodes)) errors.push("`nodes` must be an array");
if (wf.connections == null || typeof wf.connections !== "object") errors.push("`connections` must be an object");
if (wf.settings == null) warnings.push("no `settings` block (add { executionOrder: 'v1' })");

const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
const names = new Set();
const ids = new Set();

// --- per-node checks ---
for (const [i, n] of nodes.entries()) {
  const label = n && n.name ? `"${n.name}"` : `#${i}`;
  if (!n || typeof n !== "object") { errors.push(`node ${label}: not an object`); continue; }
  for (const f of ["parameters", "name", "type", "typeVersion", "position"]) {
    if (!(f in n)) errors.push(`node ${label}: missing \`${f}\``);
  }
  if (typeof n.name === "string") {
    if (names.has(n.name)) errors.push(`duplicate node name "${n.name}" (connections key on name, so names must be unique)`);
    names.add(n.name);
  }
  if (n.id != null) {
    if (ids.has(n.id)) errors.push(`duplicate node id "${n.id}"`);
    ids.add(n.id);
  }
  if (n.position && (!Array.isArray(n.position) || n.position.length !== 2)) {
    errors.push(`node ${label}: \`position\` must be [x, y]`);
  }
  if (typeof n.type === "string" && !/^(@[\w-]+\/)?n8n-nodes-[\w.-]+$/.test(n.type)) {
    warnings.push(`node ${label}: type "${n.type}" doesn't look like an n8n node type`);
  }
  // leftover placeholders worth surfacing in the README
  const blob = JSON.stringify(n);
  for (const ph of ["REPLACE_ME", "REPLACE_WITH", "YOUR_", "REPLACE_UPLOADPOST"]) {
    if (blob.includes(ph)) { warnings.push(`node ${label}: contains placeholder "${ph}" — document it in the README`); break; }
  }
}

// --- connection integrity ---
const conns = wf.connections && typeof wf.connections === "object" ? wf.connections : {};
let edgeCount = 0;
for (const [src, spec] of Object.entries(conns)) {
  if (!names.has(src)) errors.push(`connection source "${src}" is not a defined node`);
  const ports = spec && spec.main;
  if (!Array.isArray(ports)) { warnings.push(`connection "${src}": no \`main\` output array`); continue; }
  for (const [outIdx, arr] of ports.entries()) {
    for (const c of arr || []) {
      edgeCount++;
      if (!c || typeof c.node !== "string") { errors.push(`connection "${src}" port ${outIdx}: malformed target`); continue; }
      if (!names.has(c.node)) errors.push(`connection "${src}" port ${outIdx} → "${c.node}": target node does not exist`);
    }
  }
}

// --- orphan check (non-trigger nodes with no inbound edge) ---
const targeted = new Set();
for (const spec of Object.values(conns)) for (const arr of spec.main || []) for (const c of arr || []) c && c.node && targeted.add(c.node);
for (const n of nodes) {
  if (!n || typeof n.type !== "string") continue;
  if (n.type.includes("stickyNote")) continue;
  const isTrigger = /trigger|manualTrigger|webhook|scheduleTrigger/i.test(n.type);
  if (!isTrigger && !targeted.has(n.name) && !(n.name in conns)) {
    warnings.push(`node "${n.name}" is disconnected (no inbound or outbound edges)`);
  }
}

// --- report ---
console.log(`Checked: ${file}`);
console.log(`Nodes: ${nodes.length} (sticky notes: ${nodes.filter(n => n?.type?.includes("stickyNote")).length}) · edges: ${edgeCount}`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
for (const e of errors) console.log(`  ✗ ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s) — fix before import.`);
  process.exit(1);
}
console.log(`\n✓ valid${warnings.length ? ` (${warnings.length} warning(s))` : ""} — safe to import into n8n.`);
process.exit(0);
