#!/usr/bin/env node
/**
 * App Factory — PWA injector
 * --------------------------------------------------------------------------
 * Turns a standalone HTML app in apps/ into an installable, offline-capable
 * PWA to "2026 App Factory standard":
 *   • generates  apps/<name>.webmanifest   (icons as inline SVG data-URIs)
 *   • generates  apps/<name>-sw.js         (cache-first app shell + CDN deps)
 *   • injects into the HTML <head>: manifest link, theme-color, apple meta
 *   • injects a service-worker registration before </body>
 *
 * Idempotent: re-running won't double-inject (guarded by a marker comment).
 *
 * Usage:
 *   node scripts/app-factory/pwa-inject.mjs            # process all in registry
 *   node scripts/app-factory/pwa-inject.mjs bookreader-pro mathtutor-pro
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APPS = join(ROOT, 'apps');
const MARKER = '<!-- app-factory:pwa -->';

/**
 * Registry of apps the factory knows how to package. Add a row per app.
 * extraCache = absolute CDN URLs the app needs offline (best-effort cached).
 */
const REGISTRY = {
  'bookreader-pro': {
    appName: 'BookReader Pro',
    shortName: 'BookReader',
    description: 'Scan any book and have it read aloud. OCR + natural text-to-speech for dyslexic and low-vision readers. Offline-first.',
    themeColor: '#5B7FBE',
    bgColor: '#FFF0F6',
    emoji: '📖',
    categories: ['education', 'books', 'productivity'],
    extraCache: ['https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'],
  },
  'mathtutor-pro': {
    appName: 'MathTutor Pro',
    shortName: 'MathTutor',
    description: 'Step-by-step math solver and tutor. Snap a problem, get a worked solution, practice with streaks. Offline-first.',
    themeColor: '#5B7FBE',
    bgColor: '#FFF0F6',
    emoji: '🧮',
    categories: ['education', 'productivity'],
    extraCache: ['https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'],
  },
  'fitcoach-pro': {
    appName: 'FitCoach Pro',
    shortName: 'FitCoach',
    description: 'Log workouts, build streaks, and watch your progress charts climb. Clean 2026 fitness tracking. Offline-first.',
    themeColor: '#FF9800',
    bgColor: '#FFF5F8',
    emoji: '💪',
    categories: ['health', 'fitness', 'lifestyle'],
    extraCache: [],
  },
  'owed': {
    appName: "Owed — Find Money You're Owed",
    shortName: 'Owed',
    description: 'Privacy-first class action settlement finder. Match settlements you qualify for, track deadlines, and prep claims — all on your device. We never read your inbox.',
    themeColor: '#48A9A6',
    bgColor: '#F6F8F8',
    emoji: '💰',
    categories: ['finance', 'productivity', 'utilities'],
    extraCache: [],
  },
};

const enc = encodeURIComponent;
const iconSvg = (emoji, bg, size) =>
  `data:image/svg+xml,${enc(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'><rect fill='${bg}' width='${size}' height='${size}' rx='${Math.round(size * 0.22)}'/><text x='${size / 2}' y='${size / 2}' text-anchor='middle' dominant-baseline='central' font-size='${Math.round(size * 0.55)}'>${emoji}</text></svg>`
  )}`;

function buildManifest(name, m) {
  return JSON.stringify(
    {
      name: m.appName,
      short_name: m.shortName,
      description: m.description,
      start_url: `${name}.html`,
      scope: './',
      display: 'standalone',
      orientation: 'portrait-primary',
      theme_color: m.themeColor,
      background_color: m.bgColor,
      categories: m.categories,
      icons: [
        { src: iconSvg(m.emoji, m.themeColor, 192), sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
        { src: iconSvg(m.emoji, m.themeColor, 512), sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
      prefer_related_applications: false,
    },
    null,
    2
  );
}

function buildServiceWorker(name, m) {
  const version = `${name}-v${new Date().toISOString().slice(0, 10)}`;
  const shell = [`./${name}.html`, `./${name}.webmanifest`, ...m.extraCache];
  return `/* App Factory service worker — ${m.appName} */
const CACHE = '${version}';
const SHELL = ${JSON.stringify(shell, null, 2)};

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // best-effort: don't fail install if a CDN asset is unreachable
      Promise.allSettled(SHELL.map((u) => c.add(u)))
    )
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  // network-first for API calls (anthropic / replicate / elevenlabs etc.)
  if (/anthropic|replicate|elevenlabs|higgsfield/i.test(request.url)) return;
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
`;
}

const headInject = (name, m) => `${MARKER}
  <link rel="manifest" href="${name}.webmanifest">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="${m.shortName}">
  <link rel="apple-touch-icon" href="${iconSvg(m.emoji, m.themeColor, 192)}">`;

const swRegister = (name) => `${MARKER}
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('${name}-sw.js').catch((err) =>
        console.warn('[app-factory] SW registration failed:', err)
      );
    });
  }
</script>`;

function processApp(name) {
  const m = REGISTRY[name];
  if (!m) {
    console.error(`✗ ${name}: not in registry`);
    return false;
  }
  const htmlPath = join(APPS, `${name}.html`);
  if (!existsSync(htmlPath)) {
    console.error(`✗ ${name}: apps/${name}.html not found`);
    return false;
  }

  // 1. manifest + sw files
  writeFileSync(join(APPS, `${name}.webmanifest`), buildManifest(name, m));
  writeFileSync(join(APPS, `${name}-sw.js`), buildServiceWorker(name, m));

  // 2. inject into HTML (idempotent)
  let html = readFileSync(htmlPath, 'utf8');
  if (html.includes(MARKER)) {
    console.log(`• ${name}: already wired (manifest + sw regenerated)`);
    return true;
  }
  // head: after the existing theme-color meta if present, else after <title>
  if (/<meta name="theme-color"[^>]*>/.test(html)) {
    html = html.replace(/(<meta name="theme-color"[^>]*>)/, `$1\n  ${headInject(name, m)}`);
  } else {
    html = html.replace(/(<\/title>)/, `$1\n  ${headInject(name, m)}`);
  }
  // body: before </body>
  html = html.replace(/(<\/body>)/, `${swRegister(name)}\n$1`);

  writeFileSync(htmlPath, html);
  console.log(`✓ ${name}: PWA wired (manifest, sw, head + register injected)`);
  return true;
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(REGISTRY);
let ok = true;
for (const t of targets) ok = processApp(t) && ok;
console.log(ok ? '\nApp Factory PWA pass complete.' : '\nApp Factory PWA pass finished with errors.');
process.exit(ok ? 0 : 1);
