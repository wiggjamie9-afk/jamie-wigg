#!/usr/bin/env node
/**
 * Render the HTML creative mockups in clients/rhythmix/outputs/creatives/<YYYY-MM>/
 * to PNG files at native resolution. Run locally on a Mac/Linux machine with
 * playwright installed:
 *
 *   npm install -g playwright
 *   npx playwright install chromium
 *   node clients/rhythmix/scripts/render-png.mjs 2026-05
 *
 * For each .html file it:
 *   - opens the file in headless Chromium at the right viewport
 *   - waits for fonts and CSS to settle
 *   - screenshots each .canvas element (slides for carousels, single canvas
 *     for single-image) at exact pixel dimensions
 *   - writes <slug>.png (single-image) or <slug>-NN.png (carousel slide N)
 *
 * Output sits next to the .html file. Push the PNGs and they're available at
 * raw.githubusercontent.com URLs that Zapier IG actions can consume.
 */

import { chromium } from 'playwright';
import { readdir } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');

const month = process.argv[2];
if (!month || !/^\d{4}-\d{2}$/.test(month)) {
  console.error('Usage: node render-png.mjs <YYYY-MM>');
  process.exit(1);
}

const dir = resolve(repoRoot, 'clients', 'rhythmix', 'outputs', 'creatives', month);
const files = (await readdir(dir)).filter(f => f.endsWith('.html'));

if (files.length === 0) {
  console.error(`No .html files in ${dir}`);
  process.exit(1);
}

console.log(`Rendering ${files.length} mockups in ${dir}`);

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });

for (const file of files) {
  const slug = basename(file, '.html');
  const url = `file://${join(dir, file)}`;
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  // Allow Google Fonts to settle.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const canvases = await page.locator('.canvas').all();
  if (canvases.length === 1) {
    const out = join(dir, `${slug}.png`);
    await canvases[0].screenshot({ path: out, omitBackground: false });
    console.log(`  ✓ ${basename(out)}`);
  } else if (canvases.length > 1) {
    for (let i = 0; i < canvases.length; i++) {
      const n = String(i + 1).padStart(2, '0');
      const out = join(dir, `${slug}-${n}.png`);
      await canvases[i].screenshot({ path: out, omitBackground: false });
      console.log(`  ✓ ${basename(out)}`);
    }
  } else {
    console.warn(`  ✗ ${file}: no .canvas element found`);
  }
  await page.close();
}

await browser.close();
console.log('Done. Push the PNGs and they\'re live at raw.githubusercontent.com URLs.');
