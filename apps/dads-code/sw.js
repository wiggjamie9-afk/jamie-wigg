// sw.js — cache-first app shell. (R13 / design §5)
// CRITICAL: user content is NEVER cached here. Only the app shell (code/markup/style).
// Everything the dad writes lives in IndexedDB and is his alone.

const CACHE = "dadscode-v1";
const SHELL = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./db.js",
  "./store.js",
  "./ui.js",
  "./code.js",
  "./diary.js",
  "./export.js",
  "./manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then((hit) =>
      hit || fetch(request).then((res) => {
        // cache-fill only same-origin shell assets
        if (res.ok && new URL(request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
