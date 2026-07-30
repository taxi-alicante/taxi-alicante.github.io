const CACHE_NAME = 'taxi-alicante-contacto-v1';

const urlsToCache = [
  './',
  './index.html',
  './en.html',
  './legal.html',
  './legal_en.html',
  './site.webmanifest',

  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './apple-touch-icon.png',

  './favicon.ico',
  './favicon-32x32.png',
  './favicon-16x16.png',

  './radioteletaxi.vcf',
  './radioteletaxi_en.vcf',

  './tarifas-oficiales-alicante.pdf'
];

// INSTALACIÓN
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVACIÓN Y LIMPIEZA
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (Stale-While-Revalidate: Sirve caché rapido y actualiza de red)
self.addEventListener('fetch', event => {
  const request = event.request;

  // Solo peticiones GET
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {

      const fetchPromise = fetch(request)
        .then(networkResponse => {
          // Solo guardamos en caché si la respuesta es válida (status 200)
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback a la index de contacto si falla la navegación estando offline
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return cachedResponse;
        });

      // Respuesta inmediata si existe en caché, si no espera a la red
      return cachedResponse || fetchPromise;
    })
  );
});
