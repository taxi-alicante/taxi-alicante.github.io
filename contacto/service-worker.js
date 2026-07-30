const CACHE_NAME = 'taxi-alicante-contacto-v1';

const urlsToCache = [
  '/contacto/',
  '/contacto/index.html',
  '/contacto/en.html',
  '/contacto/legal.html',
  '/contacto/legal_en.html',
  '/contacto/site.webmanifest',

  '/contacto/android-chrome-192x192.png',
  '/contacto/android-chrome-512x512.png',
  '/contacto/apple-touch-icon.png',

  '/contacto/favicon.ico',
  '/contacto/favicon-32x32.png',
  '/contacto/favicon-16x16.png',

  '/contacto/radioteletaxi.vcf',
  '/contacto/radioteletaxi_en.vcf',

  '/contacto/tarifas-oficiales-alicante.pdf'
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
            return caches.match('/contacto/index.html');
          }
          return cachedResponse;
        });

      // Respuesta inmediata si existe en caché, si no espera a la red
      return cachedResponse || fetchPromise;
    })
  );
});
