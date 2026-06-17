#!/usr/bin/env node
/* Idempotently inject PWA support (manifest + service-worker registration) into
 * every MVP app HTML file so they install to the home screen and work offline.
 * Safe to re-run: a marker comment prevents double injection.
 * Usage: node apps/make-installable.mjs [file1.html file2.html ...]
 *        (no args = all MVP apps listed below)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const APPS_DIR = dirname(fileURLToPath(import.meta.url));
const MARKER = 'pwa-injected';

// The MVP suite (new apps built in this initiative). Existing/legacy apps are left untouched.
const SUITE = [
  'beatmap', 'tuner', 'stemmix', 'metro', 'tabplayer', 'setlist', 'lrcsync', 'harmony',
  'calving', 'herdlog', 'feedcost', 'vaxtrack', 'herdgene', 'graze',
  'breathe', 'achelog', 'stretch', 'rehab',
  'statline', 'hrzones', 'protocol',
  'prompter', 'thumbforge', 'brandkit', 'newsletter',
  'wordstreak', 'askform', 'contentcal', 'timeblock', 'samplevault',
  'waveedit', 'podclip', 'moodatlas',
  'stemsplit', 'transcribe', 'pasturescan', 'aerialmap', 'formcheck', 'yoga', 'earlywarn', 'mvtemplates',
].map((n) => `${n}.html`);

function titleFrom(html, fallback) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (m) return m[1].split(/[—\-–|]/)[0].trim() || fallback;
  return fallback;
}
function themeFrom(html) {
  const m = html.match(/<meta\s+name=["']theme-color["']\s+content=["']([^"']+)["']/i);
  return m ? m[1] : '#0F172A';
}

function manifestDataUri(name, theme) {
  const manifest = {
    name,
    short_name: name.slice(0, 12),
    start_url: '.',
    scope: '.',
    display: 'standalone',
    background_color: '#0B1020',
    theme_color: theme,
    icons: [
      { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
  };
  return 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
}

function inject(file) {
  const path = join(APPS_DIR, file);
  if (!existsSync(path)) return { file, status: 'skip (missing)' };
  let html = readFileSync(path, 'utf8');
  if (html.includes(MARKER)) return { file, status: 'already done' };
  if (!/<\/head>/i.test(html) || !/<\/body>/i.test(html)) return { file, status: 'skip (no head/body)' };

  const name = titleFrom(html, basename(file, '.html').toUpperCase());
  const theme = themeFrom(html);
  const headBits =
    `\n  <!-- ${MARKER} -->\n` +
    `  <link rel="manifest" href="${manifestDataUri(name, theme)}">\n` +
    `  <meta name="apple-mobile-web-app-capable" content="yes">\n` +
    `  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n` +
    `  <link rel="apple-touch-icon" href="pwa-icon.svg">\n`;
  const bodyBits =
    `\n<script>/* ${MARKER} */if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('pwa-sw.js').catch(function(){});});}</script>\n`;

  html = html.replace(/<\/head>/i, headBits + '</head>');
  html = html.replace(/<\/body>/i, bodyBits + '</body>');
  writeFileSync(path, html);
  return { file, status: 'injected' };
}

const targets = process.argv.length > 2 ? process.argv.slice(2).map((a) => basename(a)) : SUITE;
const results = targets.map(inject);
const counts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
for (const r of results) console.log(`${r.status.padEnd(18)} ${r.file}`);
console.log('\nSummary:', JSON.stringify(counts));
