const CACHE_NAME = 'taxi-alicante-v2';

// Lista completa y unificada de archivos que la web guardará para uso offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index-en.html',
  '/legal.html',
  '/legal-en.html',
  '/contacto/index.html',
  '/contacto/index-en.html',
  '/metodos-de-pago/index.html',
  '/metodos-de-pago/index-en.html',
  '/css/estilos.css',
  '/js/main.js',
  '/manifest.json',
  '/img/favicon.ico',
  '/img/favicon-16x16.png',
  '/img/favicon-32x32.png',
  '/img/apple-touch-icon.png',
  '/img/android-chrome-192x192.png',
  '/img/android-chrome-512x512.png',
  '/vcard/radioteletaxi.vcf',
  '/vcard/radioteletaxi_en.vcf',
  '/docs/bitcoin_es.pdf',
  '/docs/bitcoin_en.pdf',
  '/docs/tarifas-oficiales-alicante.pdf'
];

// 1. INSTALACIÓN: Guardar los archivos principales en la memoria caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Guardando recursos principales en caché...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVACIÓN: Limpiar cachés antiguas cuando actualizamos el sitio web
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Borrando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. ESTRATEGIA DE INTERCEPTACIÓN (Fetch):
// Busca primero en la red (Network First). Si no hay internet, sirve la versión guardada en caché.
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta de red es válida, clonamos y actualizamos la caché en segundo plano
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red (offline), servimos el recurso desde la caché
        return caches.match(event.request);
      })
  );
});