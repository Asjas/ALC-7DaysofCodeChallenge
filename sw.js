/**
 * Create cache when SW installs
 */
const dataCacheName = 'currency-api-v3';
const cacheName = 'static-cache-v3';

const filesToCache = [
  '/ALC-7DaysofCodeChallenge/', // This root url caches normalize.css and google fonts
  './index.html',
  './manifest.json',
  './public/css/styles.min.css',
  './public/css/styles.min.css.map',
  './public/js/app.min.js',
  './public/js/app.min.js.map',
  './public/favicons/android-chrome-192x192.png',
  './public/favicons/android-chrome-512x512.png',
  './public/favicons/apple-touch-icon.png',
  './public/favicons/browserconfig.xml',
  './public/favicons/favicon-16x16.png',
  './public/favicons/favicon-32x32.png',
  './public/favicons/favicon.ico',
  './public/favicons/mstile-150x150.png',
  './public/favicons/safari-pinned-tab.svg',
];

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }),
  );
});

/**
 *  Purge previous cache after activating the next cache
 */
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

/**
 * Serve app from cache if there is a cached version
 */
self.addEventListener('fetch', event => {
  const dataUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';

  // If contacting API, fetch and then cache the new data
  if (event.request.url.indexOf(dataUrl) === 0) {
    event.respondWith(
      fetch(event.request).then(response =>
        caches.open(dataCacheName).then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        }),
      ),
    );
  } else {
    // Respond with cached content if they are matched
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetch(event.request)),
    );
  }
});
