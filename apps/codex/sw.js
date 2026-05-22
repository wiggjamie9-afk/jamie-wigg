// Codex service worker — shell + protocol-manifest caching.
const CACHE = 'codex-v1';
const SHELL = [
  './',
  './index.html',
  './styles/tokens.css',
  './styles/app.css',
  './js/app.js',
  './js/coherence-engine.js',
  './js/breath-pacer.js',
  './js/frequency-player.js',
  './js/protocol-player.js',
  './js/streak.js',
  './js/storage.js',
  './data/protocols.json',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
