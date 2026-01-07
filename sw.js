const CACHE_NAME = 'projeto-fenix-cache-v2'; // Mudamos para v2 para forçar a atualização
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/logo.png' // Nome correto do seu arquivo atual
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Instalando novo cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
