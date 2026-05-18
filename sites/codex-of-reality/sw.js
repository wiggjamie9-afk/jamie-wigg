/* Codex of Reality — service worker
 * Cache-first for the app shell + Google Fonts.
 * Network-first (with cache fallback) for live data feeds. */

const CACHE = 'codex-v4-2026-05-18-samantha';

const SHELL = [
  './',
  './index.html',
  './home.html',
  './app.html',
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const DYNAMIC_HOSTS = ['services.swpc.noaa.gov', 'www.heartmath.org', 'heartmath.org'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-first for live data
  if (DYNAMIC_HOSTS.some((h) => url.hostname.endsWith(h))) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
          return resp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        if (!resp || !resp.ok) return resp;
        // Cache shell + fonts opportunistically
        const shouldCache =
          url.origin === self.location.origin ||
          FONT_HOSTS.some((h) => url.hostname.endsWith(h));
        if (shouldCache) {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, clone)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
