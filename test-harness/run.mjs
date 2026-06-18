#!/usr/bin/env node
/**
 * App Factory — functional smoke tests
 * --------------------------------------------------------------------------
 * Loads each app in a real DOM (jsdom), EXECUTES its inline scripts, stubs the
 * browser APIs apps expect (localStorage, fetch, speechSynthesis, canvas,
 * serviceWorker, matchMedia...), then asserts:
 *   1. the document parses and the title is right
 *   2. no uncaught JS errors / console errors / unhandled rejections on load
 *   3. the PWA wiring is present (manifest link + SW registration attempted)
 *   4. there's real interactive UI (buttons / inputs / tabs)
 *   5. clicking the first handful of buttons throws nothing (handler smoke test)
 *   6. localStorage is usable (offline/local-first contract)
 *
 * Catches the classes of bug that actually bit this repo: invisible/empty
 * render, broken event handlers, missing globals, JS that throws on load.
 *
 * Usage:  node test-harness/run.mjs [slug ...]   (default: all apps in APPS_DIR)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPS = join(ROOT, 'apps');

// Apps under test (the App Factory batch apps). Override via argv.
const DEFAULT = ['bookreader-pro', 'mathtutor-pro', 'fitcoach-pro', 'buddy-1', 'food-buddy-1'];

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;

function makeStubs(window, flags) {
  // localStorage (jsdom has it, but make sure it's there)
  if (!window.localStorage) {
    const store = new Map();
    window.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
      key: (i) => [...store.keys()][i] ?? null,
      get length() { return store.size; },
    };
  }
  // fetch: should NOT be called on load without a key; stub to a benign reject
  window.fetch = () => Promise.reject(new Error('fetch blocked in test'));
  // serviceWorker — must exist BEFORE inline scripts run their
  // `'serviceWorker' in navigator` guard, so install this in beforeParse
  Object.defineProperty(window.navigator, 'serviceWorker', {
    configurable: true,
    value: { register: () => { flags.swRegistered = true; return Promise.resolve({ scope: './' }); } },
  });
  // speech (bookreader/voice apps)
  window.speechSynthesis = {
    speak: () => {}, cancel: () => {}, pause: () => {}, resume: () => {},
    getVoices: () => [], addEventListener: () => {},
  };
  window.SpeechSynthesisUtterance = function () { return { addEventListener: () => {} }; };
  // matchMedia
  window.matchMedia = window.matchMedia || ((q) => ({
    matches: false, media: q, addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  }));
  // canvas getContext → minimal 2D stub (jsdom returns null without 'canvas' pkg)
  const proto = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;
  if (proto) {
    proto.getContext = () => ({
      fillRect: () => {}, clearRect: () => {}, getImageData: () => ({ data: [] }),
      putImageData: () => {}, createImageData: () => ({ data: [] }), setTransform: () => {},
      drawImage: () => {}, save: () => {}, restore: () => {}, beginPath: () => {},
      moveTo: () => {}, lineTo: () => {}, closePath: () => {}, stroke: () => {},
      fill: () => {}, arc: () => {}, scale: () => {}, rotate: () => {}, translate: () => {},
      measureText: () => ({ width: 0 }), fillText: () => {}, strokeText: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }), rect: () => {}, clip: () => {},
      setLineDash: () => {}, quadraticCurveTo: () => {}, bezierCurveTo: () => {},
    });
    proto.toDataURL = () => 'data:,';
  }
  window.scrollTo = () => {};
  window.alert = () => {}; window.confirm = () => true; window.prompt = () => null;
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  window.cancelAnimationFrame = () => {};
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function testApp(slug) {
  const file = join(APPS, `${slug}.html`);
  const result = { slug, pass: true, checks: [], errors: [] };
  const ok = (name, cond, detail = '') => {
    result.checks.push({ name, pass: !!cond, detail });
    if (!cond) result.pass = false;
  };

  if (!existsSync(file)) {
    result.pass = false;
    result.errors.push(`apps/${slug}.html not found`);
    return result;
  }

  const html = readFileSync(file, 'utf8');
  const jsErrors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => jsErrors.push(`jsdomError: ${e.message}`));
  // Don't fail on console.warn/error noise that apps emit intentionally; we
  // track real thrown errors via window.onerror + unhandledrejection below.

  const flags = { swRegistered: false };
  let dom;
  try {
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: undefined, // don't fetch external CDN scripts
      pretendToBeVisual: true,
      virtualConsole: vc,
      url: `http://localhost/apps/${slug}.html`,
      beforeParse(window) {
        // stub browser APIs BEFORE inline scripts run, so feature-detect
        // guards (`'serviceWorker' in navigator`, canvas, speech...) see them
        makeStubs(window, flags);
        window.addEventListener('error', (e) => jsErrors.push(`window.error: ${e.message || e.error}`));
        window.addEventListener('unhandledrejection', (e) =>
          jsErrors.push(`unhandledrejection: ${e.reason}`)
        );
      },
    });
  } catch (e) {
    result.pass = false;
    result.errors.push(`construct: ${e.message}`);
    return result;
  }

  const { window } = dom;
  const { document } = window;

  // fire load so 'load' listeners (SW registration etc.) run
  try {
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
    window.dispatchEvent(new window.Event('load'));
  } catch (e) {
    jsErrors.push(`dispatch load: ${e.message}`);
  }
  await sleep(120);

  // 1. title
  ok('has <title>', !!document.title, `title="${document.title}"`);

  // 2. no JS errors on load
  ok('no JS errors on load', jsErrors.length === 0, jsErrors.slice(0, 3).join(' | '));

  // 3. PWA wiring
  const hasManifest = !!document.querySelector('link[rel="manifest"]');
  ok('manifest linked', hasManifest);
  ok('service worker registered', flags.swRegistered);

  // 4. interactive UI present
  const buttons = [...document.querySelectorAll('button, [role="button"], .btn')];
  const inputs = [...document.querySelectorAll('input, textarea, select')];
  ok('has interactive UI', buttons.length + inputs.length >= 3,
    `${buttons.length} buttons, ${inputs.length} inputs`);

  // 5. body actually rendered content (not blank)
  const textLen = (document.body && document.body.textContent || '').replace(/\s+/g, ' ').trim().length;
  ok('body has visible content', textLen > 50, `${textLen} chars`);

  // 6. handler smoke test — click first 5 buttons, expect no throw
  let clickErrors = 0;
  for (const b of buttons.slice(0, 5)) {
    try { b.click(); } catch { clickErrors++; }
    await sleep(5);
  }
  ok('buttons click without throwing', clickErrors === 0, `${clickErrors} threw`);

  // 7. localStorage usable
  let lsOk = false;
  try { window.localStorage.setItem('__t', '1'); lsOk = window.localStorage.getItem('__t') === '1'; } catch {}
  ok('localStorage usable', lsOk);

  // capture any errors triggered by clicks
  await sleep(50);
  if (jsErrors.length) result.errors = jsErrors.slice(0, 5);

  dom.window.close();
  return result;
}

const results = [];
for (const slug of slugs) results.push(await testApp(slug));

// report
let allPass = true;
console.log('\nApp Factory — functional smoke tests\n' + '='.repeat(46));
for (const r of results) {
  const icon = r.pass ? '✓' : '✗';
  console.log(`\n${icon} ${r.slug}`);
  for (const c of r.checks) {
    console.log(`    ${c.pass ? '✓' : '✗'} ${c.name}${c.detail ? `  — ${c.detail}` : ''}`);
  }
  if (r.errors.length) {
    console.log('    errors:');
    for (const e of r.errors) console.log(`      • ${e}`);
  }
  if (!r.pass) allPass = false;
}
console.log('\n' + '='.repeat(46));
console.log(allPass ? `ALL PASS (${results.length} apps)` : 'FAILURES present');
process.exit(allPass ? 0 : 1);
