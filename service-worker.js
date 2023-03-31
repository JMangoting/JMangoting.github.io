var CACHE_NAME = 'mdl-template-portfolio-v1';
var urlsToCache = [
    '/',
    './index.html',
    './about.html',
    './blog.html',
    './contact.html',
    './portfolio-example01.html',
    './style.css',
    './js/app.js',
    './images/about-header.jpg',
    './images/contact-image.jpg',
    './images/example-blog01.jpg',
    './images/example-blog02.jpg',
    './images/example-blog03.jpg',
    './images/example-blog04.jpg',
    './images/example-blog05.jpg',
    './images/example-blog06.jpg',
    './images/example-blog07.jpg',
    './images/example-work01.jpg',
];

// Install service worker
    self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
    });

// Cache first then network strategy
    self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
            return response;
            }

            // Clone the request because it's a one-time use
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
            function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
                }

                // Clone the response because it's a one-time use
                var responseToCache = response.clone();

                caches.open(CACHE_NAME)
                .then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }
            );
        })
        .catch(function() {
            // If both cache and network fail, show a generic fallback
            return caches.match('/offline.html');
        })
    );
    });

    // Clean up old caches
    self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['mdl-template-portfolio-v1'];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
            })
        );
        })
    );
    });
