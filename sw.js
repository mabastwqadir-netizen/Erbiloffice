const CACHE_NAME = 'ihec-inout-v1.4.32';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/style.css',
  '/script.js',
  '/dashboard.js',
  '/lang.js',
  '/admin_dashboard.html',
  '/admin_dashboard.css',
  '/admin_dashboard.js',
  '/version.json',
  '/assets/icon.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/settings.html',
  '/settings.css',
  '/settings.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
