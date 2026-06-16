const CACHE_SHELL = 'post-op-v1-shell';
const CACHE_API = 'post-op-v1-api';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then(cache => {
      return cache.addAll([
        '/',
        '/post-op-companion/',
        '/post-op-companion/index.html',
        '/post-op-companion/styles.css',
        '/post-op-companion/app.js',
        '/post-op-companion/wearable-sync.js',
        '/post-op-companion/claude-ai.js',
        '/post-op-companion/manifest.webmanifest',
      ]).catch(err => {
        console.log('Cache install error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_SHELL && key !== CACHE_API) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // API calls: network-first with fallback
  if (event.request.url.includes('api.anthropic.com') || event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_API).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(() => {
        return caches.match(event.request).then(response => {
          return response || new Response('Offline: API unavailable', { status: 503 });
        });
      })
    );
  } else {
    // Static: cache-first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_SHELL).then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        });
      }).catch(() => {
        return new Response('Offline: Page not available', { status: 503 });
      })
    );
  }
});
