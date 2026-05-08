const CACHE_NAME = 'ihec-inout-v1.4.34';
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
    caches.open(CACHE_NAME).then((cache) => {
      // هەر فایلێک بە جیا کاش بکە - ئەگەر یەکێک شکستی هێنا، ئەوانی تر کاش دەبن
      return Promise.allSettled(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('Failed to cache:', url, err);
          })
        )
      );
    })
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
      return fetch(e.request).then((networkRes) => {
        // فایلە نوێیەکانیش کاش بکە بۆ نۆرەی داهاتوو
        if (networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return networkRes;
      }).catch(() => {
        // فەیڵباک: ئەگەر نێتوۆرک نەبوو، index.html پیشان بدە
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
