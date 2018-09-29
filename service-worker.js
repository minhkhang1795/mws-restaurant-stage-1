var staticCacheName = 'restaurant-static-v1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                'js/main.js',
                'js/restaurant_info.js',
                'js/dbhelper.js',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
                'css/styles.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName !== staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log(response);
            return response || fetch(event.request);
        }).catch(function (error) {
            console.log(error);
        })
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});