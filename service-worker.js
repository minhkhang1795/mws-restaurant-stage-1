var staticCacheName = 'restaurant-static-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll([
        '/',
        'js/main.js',
        'js/restaurant_info.js',
        'js/dbhelper.js',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
        'css/styles.css',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg'
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('restaurant-') &&
            cacheName !== staticCacheName;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
  // https://github.com/paulirish/caltrainschedule.io/issues/49
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
  console.log(event.request);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // console.log(response);
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});