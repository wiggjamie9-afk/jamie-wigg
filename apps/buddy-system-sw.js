/* Buddy System — Service Worker
 * Cache-first for the app shell (instant offline launch),
 * network-first for live API traffic (Claude, ElevenLabs).
 */

const CACHE_VERSION = 'buddy-v1';

// App shell — everything needed to boot offline.
const APP_SHELL = [
  './buddy-system.html',
  './buddy-system-manifest.webmanifest',
  './buddy-icon-192.svg',
  './buddy-icon-512.svg',
  './buddy-icon-maskable.svg',
  // Web fonts used by the app (Inter + Lexend via Google Fonts).
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lexend:wght@400;500;600;700&display=swap'
];

// Hosts whose responses must always be fresh (never served stale from cache).
const API_HOSTS = [
  'api.anthropic.com',      // Claude
  'api.elevenlabs.io'       // ElevenLabs
];

// ---- Install: pre-cache the app shell, then take over immediately. ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => {
        // Don't fail the whole install if a single cross-origin asset 404s.
        return Promise.resolve();
      }))
      .then(() => self.skipWaiting())
  );
});

// ---- Activate: drop old caches, claim open clients for instant updates. ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ---- Fetch routing. ----
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET; let POST/PUT (e.g. API calls with bodies) pass straight through.
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (_) {
    return;
  }

  const isApi = API_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith('.' + host));

  if (isApi) {
    // Network-first for APIs: always try the network, fall back to cache if offline.
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for everything else (the app shell + static assets).
  event.respondWith(cacheFirst(request));
});

// Cache-first: serve from cache, fall back to network and populate the cache.
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, copy);
    }
    return response;
  } catch (_) {
    // Offline navigation fallback → the app shell.
    if (request.mode === 'navigate') {
      const shell = await caches.match('./buddy-system.html');
      if (shell) return shell;
    }
    return Response.error();
  }
}

// Network-first: prefer fresh data, fall back to cache when offline.
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, copy);
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return Response.error();
  }
}

// Allow the page to trigger an immediate update (postMessage 'SKIP_WAITING').
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
