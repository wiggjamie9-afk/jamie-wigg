// CodeMentor service worker — offline-first app shell.
//
// Precaches the single-file app + icons so it launches with no network and
// qualifies as an installable PWA (required before any TWA/Capacitor wrap).
// API calls to the Claude proxy are deliberately NOT cached (network-only).

const CACHE = 'codementor-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // never cache POSTs (proxy / AI calls)
  const url = new URL(req.url);
  // Network-only for the AI proxy and any cross-origin API.
  if (url.pathname.endsWith('/v1/messages')) return;

  // Cache-first for the shell; fall back to network, then to index for navigations.
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
    )
  );
});
