// RHYTHMIX Frequency · Service Worker
// Strategy: network-first for HTML (so updates ship), cache-first for static assets

const CACHE = 'frequency-v1';
const ASSETS = [
  '/frequency.html',
  '/frequency-icon-192.png',
  '/frequency-icon-512.png',
  '/frequency-og.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // only handle same-origin GET
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // bypass cache for form submissions / fetch APIs (formsubmit etc.)
  if (url.pathname.startsWith('/api/') || url.search.includes('nocache')) return;

  // network-first for HTML (we want updates)
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/frequency.html')))
    );
    return;
  }

  // cache-first for everything else (icons, images, manifest)
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => cached))
  );
});
