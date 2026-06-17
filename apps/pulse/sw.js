const CACHE = 'pulse-v1';
const ASSETS = [
  '/apps/pulse/',
  '/apps/pulse/index.html',
  '/apps/pulse/manifest.json'
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
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/apps/pulse/index.html'));
    })
  );
});

// Push notifications for habit reminders
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'PULSE', body: 'Time for your habits!' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'PULSE', {
      body: data.body || 'Small actions. Big life.',
      icon: '/apps/pulse/manifest.json',
      badge: '/apps/pulse/manifest.json',
      tag: 'pulse-habit',
      renotify: true,
      vibrate: [100, 50, 100]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url.includes('/apps/pulse') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/apps/pulse/');
    })
  );
});
