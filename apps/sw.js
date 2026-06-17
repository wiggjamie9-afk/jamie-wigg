/**
 * Service Worker for Buddy System Apps
 * Enables offline-first PWA experience
 * - Caches app shell (HTML, CSS, JS) on first load
 * - Network-first for API calls (Claude, ElevenLabs, Higgsfield)
 * - Offline fallback: app continues to work with localStorage data
 */

const CACHE_VERSION = 'buddy-system-v1';
const CACHE_SHELL = `${CACHE_VERSION}-shell`;
const CACHE_API = `${CACHE_VERSION}-api`;

const SHELL_ASSETS = [
  '/',
  '/apps/',
  '/apps/buddy-system.html',
  '/apps/buddies.html',
  '/apps/buddy-app-template.html',
  '/apps/buddy-personalities.js',
  '/apps/AVATAR-STUDIO-SETUP.md',
  '/apps/BUDDIES-README.md',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {
        // Graceful fail if offline during install
        console.log('Offline install: shell cache incomplete');
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_SHELL && name !== CACHE_API && !name.startsWith(CACHE_VERSION)) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network-first
  if (
    url.origin === 'https://api.anthropic.com' ||
    url.origin === 'https://api.elevenlabs.io' ||
    url.origin === 'https://api.higgsfield.ai' ||
    url.hostname === 'localhost' || // Proxy calls
    request.method !== 'GET'
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_API).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Offline: return cached API response if available
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // No cache available: return offline response
            return new Response(
              JSON.stringify({ error: 'offline', message: 'No internet connection' }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches
      .match(request)
      .then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(CACHE_SHELL).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
      })
      .catch(() => {
        // Fallback: return offline page or blank response
        return new Response('Offline. Please check your connection.', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
  );
});

// Message handler: allow clients to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
