#!/usr/bin/env node
/**
 * App Factory — web bundler
 * --------------------------------------------------------------------------
 * Assembles app-factory/www/ for the current batch (app-factory/batch.json):
 *   • copies each app's <slug>.html, <slug>.webmanifest, <slug>-sw.js
 *   • copies any shared deps the app references locally (gsap, sw helpers)
 *   • generates a launcher index.html linking all apps in the batch
 *
 * After this, `npx cap sync` packages www/ into the native iOS/Android shells.
 *
 * Usage:  node app-factory/scripts/build-web.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const FACTORY = join(HERE, '..');
const ROOT = join(FACTORY, '..');
const APPS = join(ROOT, 'apps');
const WWW = join(FACTORY, 'www');

// Which batch file to build (default batch.json). Pass a filename or set
// APP_FACTORY_BATCH to build a different batch / a standalone app, e.g.:
//   node scripts/build-web.mjs owed.batch.json
//   APP_FACTORY_BATCH=owed.batch.json node scripts/build-web.mjs
const batchFile = process.argv[2] || process.env.APP_FACTORY_BATCH || 'batch.json';
const batch = JSON.parse(readFileSync(join(FACTORY, batchFile), 'utf8'));

// fresh www/
rmSync(WWW, { recursive: true, force: true });
mkdirSync(WWW, { recursive: true });

const copied = [];
const missing = [];

for (const app of batch.apps) {
  const variants = [`${app.slug}.html`, `${app.slug}.webmanifest`, `${app.slug}-sw.js`];
  let htmlOk = false;
  for (const f of variants) {
    const src = join(APPS, f);
    if (existsSync(src)) {
      copyFileSync(src, join(WWW, f));
      if (f.endsWith('.html')) htmlOk = true;
    }
  }
  // copy a co-located sw.js fallback (buddy apps register 'sw.js')
  const buddySw = join(APPS, 'sw.js');
  if (existsSync(buddySw) && !existsSync(join(WWW, 'sw.js'))) copyFileSync(buddySw, join(WWW, 'sw.js'));
  const buddyManifest = join(APPS, 'manifest.webmanifest');
  if (existsSync(buddyManifest) && !existsSync(join(WWW, 'manifest.webmanifest')))
    copyFileSync(buddyManifest, join(WWW, 'manifest.webmanifest'));

  (htmlOk ? copied : missing).push(app.slug);
}

// Standalone (single-app) build: the app IS the home screen — copy it to
// index.html instead of generating a launcher.
if (batch.apps.length === 1) {
  const only = batch.apps[0];
  const src = join(WWW, `${only.slug}.html`);
  if (existsSync(src)) {
    copyFileSync(src, join(WWW, 'index.html'));
    console.log(`App Factory standalone bundle → app-factory/www/ (${only.slug})`);
    console.log(`  ✓ ${only.slug} → index.html`);
    process.exit(missing.length ? 1 : 0);
  }
}

// launcher index.html
const cards = batch.apps
  .map(
    (a) => `      <a class="card" href="${a.slug}.html" style="--c:${a.color}">
        <span class="emoji">${a.emoji}</span>
        <span class="meta"><strong>${a.name}</strong><small>${a.tagline}</small></span>
        <span class="go">›</span>
      </a>`
  )
  .join('\n');

const index = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b1120">
<title>${batch.appName}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body {
    margin: 0; min-height: 100dvh; font-family: -apple-system, "Segoe UI", Roboto, system-ui, sans-serif;
    background: radial-gradient(120% 80% at 50% 0%, #15203a 0%, #0b1120 60%, #060912 100%);
    color: #f4f6fb; padding: max(28px, env(safe-area-inset-top)) 20px calc(28px + env(safe-area-inset-bottom));
  }
  header { max-width: 560px; margin: 0 auto 22px; }
  h1 { font-size: 1.6rem; margin: 0 0 4px; letter-spacing: -0.02em; }
  header p { margin: 0; color: #9aa6bf; font-size: .95rem; }
  .grid { max-width: 560px; margin: 0 auto; display: grid; gap: 12px; }
  .card {
    display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; padding: 16px 18px; transition: transform .12s ease, background .12s ease;
  }
  .card:active { transform: scale(.985); background: rgba(255,255,255,0.08); }
  .emoji {
    width: 50px; height: 50px; flex: none; display: grid; place-items: center; font-size: 26px;
    border-radius: 14px; background: color-mix(in srgb, var(--c) 26%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 45%, transparent);
  }
  .meta { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
  .meta strong { font-size: 1.05rem; }
  .meta small { color: #9aa6bf; font-size: .82rem; }
  .go { font-size: 1.4rem; color: #6b7488; opacity: .55; }
  footer { max-width: 560px; margin: 26px auto 0; text-align: center; }
  footer small { color: #6b7488; font-size: .76rem; }
</style>
</head>
<body>
  <header>
    <h1>${batch.launcherTitle}</h1>
    <p>${batch.appName} · works offline</p>
  </header>
  <main class="grid">
${cards}
  </main>
  <footer><small>All data stays on your device.</small></footer>
</body>
</html>
`;

writeFileSync(join(WWW, 'index.html'), index);

console.log(`App Factory web bundle → app-factory/www/`);
console.log(`  ✓ bundled: ${copied.join(', ') || '(none)'}`);
if (missing.length) console.log(`  ✗ missing html: ${missing.join(', ')}`);
console.log(`  ✓ launcher index.html generated (${batch.apps.length} apps)`);
process.exit(missing.length ? 1 : 0);
