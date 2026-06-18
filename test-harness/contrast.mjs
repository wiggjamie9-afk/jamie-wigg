#!/usr/bin/env node
/**
 * App Factory — readability / contrast lint
 * Guards against the "invisible text" disaster (opaque text vanishing into an
 * opaque surface). Shared analysis lives in contrast-core.mjs.
 *
 * Usage:  node test-harness/contrast.mjs --all
 *         node test-harness/contrast.mjs owed buddy-1
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { analyze } from './contrast-core.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPS = join(ROOT, 'apps');

const args = process.argv.slice(2);
let slugs = args.includes('--all')
  ? readdirSync(APPS).filter(f => /^(buddy-\d+|food-buddy-\d+|bookreader-pro|mathtutor-pro|fitcoach-pro|owed)\.html$/.test(f)).map(f => f.replace(/\.html$/, '')).sort()
  : args.filter(a => a !== '--all');
if (!slugs.length) slugs = ['owed'];

let failed = 0;
for (const slug of slugs) {
  const { issues } = analyze(readFileSync(join(APPS, `${slug}.html`), 'utf8'));
  if (issues.length) {
    failed++;
    console.log(`✗ ${slug}`);
    for (const i of issues) console.log(`    FAIL contrast ${i.ratio.toFixed(2)}:1 — ${i.sel.slice(0, 48)}`);
  } else {
    console.log(`✓ ${slug}`);
  }
}
console.log(`\n${failed ? `✗ ${failed} app(s) with unreadable text` : `✓ readability OK (${slugs.length} apps)`}`);
process.exit(failed ? 1 : 0);
