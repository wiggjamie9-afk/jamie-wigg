#!/usr/bin/env node
/**
 * App Factory — contrast corrector (lint-driven, minimal)
 * --------------------------------------------------------------------------
 * Only touches apps the readability lint actually flags. For each one it tries
 * the smallest fix that clears the failure:
 *   • near-white --vibe-text  → force a dark ink (invisible body text)
 *   • a light --vibe-accent used as a white-text surface → darken just that
 *     accent (preserving hue) until white text reads
 * Apps that already pass get any stale correction stripped (no needless change).
 * Visual-only, marker-guarded, idempotent.
 *
 * Usage: node scripts/app-factory/fix-contrast.mjs            # all buddy/food
 *        node scripts/app-factory/fix-contrast.mjs buddy-15
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { analyze, hexToRgb, lum, contrast } from '../../test-harness/contrast-core.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APPS = join(ROOT, 'apps');
const MARK = 'af-contrast';
const DARK_INK = '#2A2533';

const toHex = ([r, g, b]) => '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
const cw = (rgb) => contrast([255, 255, 255], rgb.slice(0, 3));
const darkenForWhite = (hex) => { let rgb = hexToRgb(hex); let i = 0; while (cw(rgb) < 3.5 && i++ < 40) rgb = rgb.map(c => c * 0.92); return toHex(rgb); };
const strip = (html) => html.replace(new RegExp(`\\s*<style id="${MARK}">[\\s\\S]*?<\\/style>`, 'g'), '');
const inject = (html, rules) => html.replace(/<\/head>/, `<style id="${MARK}">/* contrast corrector */${rules}</style>\n</head>`);

function processApp(slug) {
  const file = join(APPS, `${slug}.html`);
  if (!existsSync(file)) { console.error(`✗ ${slug}: not found`); return; }
  let html = strip(readFileSync(file, 'utf8'));           // start from clean (reverts stale fixes)

  if (!analyze(html).issues.length) { writeFileSync(file, html); console.log(`✓ ${slug}: readable (no change)`); return; }

  const tx = html.match(/--vibe-text:\s*(#[0-9A-Fa-f]{3,8})/);
  const ac = html.match(/--vibe-accent:\s*(#[0-9A-Fa-f]{3,8})/);
  let rules = '', notes = [];

  // 1) near-white text → dark
  if (tx && lum(hexToRgb(tx[1])) > 0.45) { rules += `:root{--vibe-text:${DARK_INK};}`; notes.push('text'); }
  // 2) if still failing and the accent is too light for white text, darken it
  if (ac && analyze(inject(html, rules)).issues.length && cw(hexToRgb(ac[1])) < 3.5) {
    const dk = darkenForWhite(ac[1]); rules += `:root{--vibe-accent:${dk};}`; notes.push(`accent ${ac[1]}→${dk}`);
  }

  const out = inject(html, rules);
  const remaining = analyze(out).issues.length;
  writeFileSync(file, out);
  console.log(`${remaining ? '⚠' : '↻'} ${slug}: ${notes.join(', ')}${remaining ? ` (still ${remaining} flagged)` : ''}`);
}

let targets = process.argv.slice(2);
if (!targets.length) targets = readdirSync(APPS).filter(f => /^(buddy-\d+|food-buddy-\d+)\.html$/.test(f)).map(f => f.replace(/\.html$/, ''));
for (const t of targets) processApp(t);
console.log(`\nContrast correction pass: ${targets.length} app(s).`);
