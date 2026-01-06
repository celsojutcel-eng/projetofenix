const CACHE_NAME = 'projeto-fenix-v1';
const FILES_TO_CACHE = [
  '/',                 // raiz
  '/index.html',       // seu HTML principal
  '/manifest.json',    // manifesto do PWA
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// ===============================
// INSTALL
// ===============================
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ===============================
// ACTIVATE
// ===============================
self.addEventListener('activate', event => {
  console.log('[SW] Ativado!');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// ===============================
// FETCH
// ===============================
self.addEventListener('fetch', event => {
  // ignora requests de terceiros (ex: Google Fonts)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResp => {
        return cachedResp || fetch(event.request)
          .then(fetchResp => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchResp.clone());
              return fetchResp;
            });
          });
      })
      .catch(() => {
        // fallback se der erro (opcional)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
