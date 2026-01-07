const CACHE_NAME = 'projeto-fenix-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',  // se você criar um CSS separado
  './script.js',  // se você criar um JS separado
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// INSTALAÇÃO
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ATIVAÇÃO
self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
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

// FETCH (CACHE FIRST)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
